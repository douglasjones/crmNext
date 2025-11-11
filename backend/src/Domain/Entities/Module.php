<?php
declare(strict_types=1);

namespace App\Domain\Entities;

use JsonSerializable;

class Module implements JsonSerializable
{
    private ?int $pk;
    private string $ds_modulo;
    private string $ds_dominio;
    private int $tipo_modulo_pk;
    private int $ic_menu;
    private ?int $nr_ordem_menu;
    private string $dt_cadastro;
    private ?int $usuario_cadastro_pk;
    private string $dt_ult_atualizacao;
    private ?int $usuario_ult_atualizacao_pk;
    private ?int $modulo_pai_pk;
    private ?string $ds_icone;

    public function __construct(
        ?int $pk,
        string $ds_modulo,
        string $ds_dominio,
        int $tipo_modulo_pk,
        int $ic_menu,
        ?int $nr_ordem_menu,
        ?int $modulo_pai_pk,
        string $dt_cadastro,
        ?int $usuario_cadastro_pk,
        string $dt_ult_atualizacao,
        ?int $usuario_ult_atualizacao_pk,
        ?string $ds_icone
    )
    {
        $this->pk = $pk;
        $this->ds_modulo = $ds_modulo;
        $this->ds_dominio = $ds_dominio;
        $this->tipo_modulo_pk = $tipo_modulo_pk;
        $this->ic_menu = $ic_menu;
        $this->nr_ordem_menu = $nr_ordem_menu;
        $this->modulo_pai_pk = $modulo_pai_pk;
        $this->dt_cadastro = $dt_cadastro;
        $this->usuario_cadastro_pk = $usuario_cadastro_pk;
        $this->dt_ult_atualizacao = $dt_ult_atualizacao;
        $this->usuario_ult_atualizacao_pk = $usuario_ult_atualizacao_pk;
        $this->ds_icone = $ds_icone;
    }

    public function getPk(): ?int
    {
        return $this->pk;
    }

    public function getDsModulo(): string
    {
        return $this->ds_modulo;
    }

    public function getDsDominio(): string
    {
        return $this->ds_dominio;
    }

    public function getTipoModuloPk(): int
    {
        return $this->tipo_modulo_pk;
    }

    public function getIcMenu(): int
    {
        return $this->ic_menu;
    }

    public function getNrOrdemMenu(): ?int
    {
        return $this->nr_ordem_menu;
    }

    public function getDtCadastro(): string
    {
        return $this->dt_cadastro;
    }

    public function getUsuarioCadastroPk(): int
    {
        return $this->usuario_cadastro_pk;
    }

    public function getDtUltAtualizacao(): string
    {
        return $this->dt_ult_atualizacao;
    }

    public function getUsuarioUltAtualizacaoPk(): int
    {
        return $this->usuario_ult_atualizacao_pk;
    }

    public function getModuloPaiPk(): ?int
    {
        return $this->modulo_pai_pk;
    }

    public function getDsIcone(): ?string
    {
        return $this->ds_icone;
    }

    public function jsonSerialize(): array
    {
        return [
            'pk' => $this->pk,
            'ds_modulo' => $this->ds_modulo,
            'ds_dominio' => $this->ds_dominio,
            'tipo_modulo_pk' => $this->tipo_modulo_pk,
            'ic_menu' => $this->ic_menu,
            'nr_ordem_menu' => $this->nr_ordem_menu,
            'modulo_pai_pk' => $this->modulo_pai_pk,
            'ds_icone' => $this->ds_icone,
            'dt_cadastro' => $this->dt_cadastro,
            'usuario_cadastro_pk' => $this->usuario_cadastro_pk,
            'dt_ult_atualizacao' => $this->dt_ult_atualizacao,
            'usuario_ult_atualizacao_pk' => $this->usuario_ult_atualizacao_pk,
        ];
    }
}