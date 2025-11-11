'use client';

import React, { useEffect, useState } from 'react';
import { moduleService, ModuleItem } from '@/services/moduleService';

const DynamicMenuTest = () => {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('DynamicMenuTest: useEffect triggered');
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedModules = await moduleService.getModules();
        console.log('DynamicMenuTest: fetchedModules', fetchedModules);
        setModules(fetchedModules || []);
      } catch (err: any) {
        console.error('DynamicMenuTest: Error fetching modules', err);
        setError(err.message || 'Failed to fetch modules');
        setModules([]); // Ensure modules is an empty array on error
      } finally {
        setLoading(false);
        console.log('DynamicMenuTest: Loading finished');
      }
    };

    fetchModules();
  }, []);

  console.log('DynamicMenuTest: Render - modules:', modules, 'loading:', loading, 'error:', error);

  if (loading) {
    return <div>Loading modules...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Only render the list if modules is an array and not empty
  if (!Array.isArray(modules) || modules.length === 0) {
    return <div>No modules to display.</div>;
  }

  return (
    <div>
      <h2>Dynamic Menu Test</h2>
      <ul>
        {modules.map((module) => (
          <li key={module.pk}>{module.ds_modulo} ({module.ds_dominio})</li>
        ))}
      </ul>
    </div>
  );
};

export default DynamicMenuTest;
