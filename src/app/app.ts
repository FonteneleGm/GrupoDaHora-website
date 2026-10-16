import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { InputNumberModule } from '@openng/optimus-ui/inputnumber';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TagModule } from '@openng/optimus-ui/tag';
import { RegistroPresenca } from './models/registro-presenca';

@Component({
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    FormsModule,
    InputNumberModule,
    InputTextModule,
    TagModule,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected registros: RegistroPresenca[] = [];
  protected novoNome = '';
  protected novaIdade: number | null = null;
  protected registroEmEdicao: RegistroPresenca | null = null;
  protected registroSelecionado: RegistroPresenca | null = null;
  protected detalhesVisiveis = false;

  protected get estaEditando(): boolean {
    return this.registroEmEdicao !== null;
  }

  protected registrarPresenca(): void {
    const nome = this.novoNome.trim();

    if (!nome) {
      return;
    }

    if (this.registroEmEdicao) {
      this.registroEmEdicao.nome = nome;
      this.registroEmEdicao.idade = this.novaIdade ?? undefined;
      this.registroEmEdicao = null;
      this.limparFormulario();
      return;
    }

    const registro: RegistroPresenca = {
      id: this.proximoId(),
      nome,
      dataHoraRegistro: new Date(),
      presencaConfirmada: true,
    };

    if (this.novaIdade !== null) {
      registro.idade = this.novaIdade;
    }

    this.registros.push(registro);
    this.limparFormulario();
  }

  protected detalharRegistro(registro: RegistroPresenca): void {
    this.registroSelecionado = registro;
    this.detalhesVisiveis = true;
  }

  protected iniciarEdicao(registro: RegistroPresenca): void {
    this.registroEmEdicao = registro;
    this.novoNome = registro.nome;
    this.novaIdade = registro.idade ?? null;
    this.registroSelecionado = null;
    this.detalhesVisiveis = false;
  }

  protected cancelarEdicao(): void {
    this.registroEmEdicao = null;
    this.limparFormulario();
  }

  protected removerRegistro(id: number): void {
    const confirmado = window.confirm('Deseja remover este registro de presença?');

    if (!confirmado) {
      return;
    }

    this.registros = this.registros.filter((registro) => registro.id !== id);

    if (this.registroSelecionado?.id === id) {
      this.registroSelecionado = null;
      this.detalhesVisiveis = false;
    }

    if (this.registroEmEdicao?.id === id) {
      this.cancelarEdicao();
    }
  }

  private limparFormulario(): void {
    this.novoNome = '';
    this.novaIdade = null;
  }

  private proximoId(): number {
    return this.registros.length > 0
      ? Math.max(...this.registros.map((registro) => registro.id)) + 1
      : 1;
  }
}
