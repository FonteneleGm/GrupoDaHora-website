# Guia do projeto Grupo da Hora

Este documento explica como a aplicação funciona, onde cada requisito da atividade foi implementado e como demonstrar o projeto durante a avaliação.

## 1. Objetivo da aplicação

O projeto é a migração da página inicial do site Grupo da Hora para Angular 22.

Além da página inicial, foi criado um **Caderno de Presença** em memória. Ele permite:

- registrar uma presença;
- listar os registros;
- visualizar detalhes;
- editar nome e idade;
- remover um registro.

Os dados ficam somente na memória do navegador. Se a página for recarregada, os registros são perdidos.

## 2. Como executar

Na raiz do projeto:

```bash
npm install
npm start
```

Depois, acesse:

```text
http://localhost:4200
```

Para gerar uma compilação de produção:

```bash
npm run build
```

Para executar os testes:

```bash
npm test -- --watch=false
```

O Angular CLI está instalado localmente. Por isso, `ng` sozinho pode não funcionar no terminal, mas os scripts do `package.json` e `npx ng` funcionam:

```bash
npx ng version
```

## 3. Estrutura principal

```text
src/
├── app/
│   ├── app.ts
│   ├── app.html
│   ├── app.css
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.spec.ts
│   └── models/
│       └── registro-presenca.ts
├── index.html
└── styles.css
```

### `src/app/app.ts`

É a classe do componente principal. Ela contém:

- a lista de registros;
- os campos ligados ao formulário;
- o estado de edição;
- o registro selecionado para detalhes;
- os métodos das operações CRUD.

### `src/app/app.html`

É o template visual do componente principal. Ele contém:

- cabeçalho;
- menu;
- mensagem de boas-vindas;
- seta até o caderno;
- formulário;
- tabela;
- ações de detalhar, editar e remover;
- diálogo de detalhes;
- rodapé.

Um template Angular não deve conter `<!DOCTYPE html>`, `<html>`, `<head>` ou `<body>`. Essas partes ficam em `src/index.html`.

### `src/app/app.css`

Contém somente regras específicas da identidade do site que não foram colocadas diretamente no Tailwind:

- altura mínima do componente;
- imagem de fundo;
- sombra do título.

### `src/styles.css`

Importa o Tailwind CSS 4:

```css
@import 'tailwindcss';
```

### `src/app/models/registro-presenca.ts`

Define o formato dos dados manipulados pelo CRUD.

### `src/app/app.config.ts`

Configura os providers globais do Angular e o tema Aura do OptimusUI.

### `src/app/app.spec.ts`

Contém os testes do componente principal.

## 4. Model utilizado

O model está em [src/app/models/registro-presenca.ts](../src/app/models/registro-presenca.ts):

```ts
export interface RegistroPresenca {
  id: number;
  nome: string;
  idade?: number;
  dataHoraRegistro: Date;
  presencaConfirmada: boolean;
}
```

### Por que cada atributo existe?

| Atributo | Tipo | Função |
|---|---|---|
| `id` | `number` | Identifica internamente cada registro |
| `nome` | `string` | Nome escrito no caderno |
| `idade` | `number` opcional | Informação adicional, sem obrigar o visitante |
| `dataHoraRegistro` | `Date` | Horário automático da anotação |
| `presencaConfirmada` | `boolean` | Indica a situação da presença |

O `id` não aparece para o usuário, mas é importante para localizar o registro correto ao editar ou remover.

A idade é opcional. Isso é representado pelo `?`:

```ts
idade?: number;
```

O horário não é digitado. No momento da inclusão, o componente cria:

```ts
dataHoraRegistro: new Date()
```

## 5. Como o CRUD funciona

### Incluir

O formulário utiliza:

```html
(ngSubmit)="registrarPresenca()"
```

Os campos são ligados ao componente com two-way data binding:

```html
[(ngModel)]="novoNome"
[(ngModel)]="novaIdade"
```

Ao enviar:

1. o nome é retirado dos espaços extras;
2. se estiver vazio, o método não cria registro;
3. um `id` é gerado;
4. o horário atual é salvo;
5. a presença é marcada como confirmada;
6. o registro é adicionado ao array;
7. o formulário é limpo.

### Listar

A tabela percorre o array usando a sintaxe moderna de controle do Angular:

```html
@for (registro of registros; track registro.id) {
  ...
} @empty {
  ...
}
```

O `@empty` exibe uma mensagem quando ainda não há registros.

### Detalhar

O método:

```ts
detalharRegistro(registro: RegistroPresenca)
```

guarda o registro selecionado e abre um `p-dialog` do OptimusUI. O diálogo mostra nome, idade, horário e situação.

### Alterar

Ao clicar em `Editar`:

1. o registro é guardado em `registroEmEdicao`;
2. nome e idade são carregados no formulário;
3. o botão muda para `Salvar alterações`;
4. aparece o botão `Cancelar`.

Ao salvar, o nome e a idade são atualizados. O horário original é preservado, pois ele representa o momento da anotação.

### Remover

O método:

```ts
removerRegistro(id: number)
```

solicita confirmação com `window.confirm`. Se o usuário confirmar, o array é substituído por uma versão sem o registro escolhido.

## 6. Onde aparecem os requisitos da atividade

### Angular 22

As versões estão declaradas em [package.json](../package.json):

```json
"@angular/core": "^22.2.0",
"@angular/cli": "^22.2.1"
```

O arquivo de configuração principal é [angular.json](../angular.json).

### OptimusUI 2

As dependências estão em [package.json](../package.json):

```json
"@openng/optimus-ui": "^2.0.2",
"@openng/optimus-ui-themes": "^2.0.2"
```

Os módulos usados no componente principal são importados em [src/app/app.ts](../src/app/app.ts):

```ts
ButtonModule
DialogModule
InputNumberModule
InputTextModule
TagModule
```

No template, eles aparecem como:

| Componente | Uso |
|---|---|
| `pInputText` | Campo de nome |
| `p-inputnumber` | Campo opcional de idade |
| `p-button` | Ações do formulário e da tabela |
| `p-tag` | Situação da presença |
| `p-dialog` | Detalhes do registro |

### Tema Aura

O tema é configurado em [src/app/app.config.ts](../src/app/app.config.ts):

```ts
provideOptimus({
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: 'none',
    },
  },
})
```

`darkModeSelector: 'none'` foi usado para tentar manter os componentes no modo claro, combinando com o visual branco do site.

### Tailwind 4

As dependências estão em [package.json](../package.json):

```json
"tailwindcss": "^4.3.3",
"@tailwindcss/postcss": "^4.3.3"
```

A integração com o PostCSS está em [.postcssrc.json](../.postcssrc.json):

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

O Tailwind é usado no template para:

- flexbox;
- grid;
- espaçamento;
- largura máxima;
- responsividade;
- bordas;
- sombras;
- alinhamento;
- estados de hover;
- rolagem suave;
- animação da seta.

Exemplo:

```html
<section class="mx-auto max-w-6xl scroll-mt-4 px-4 pb-10">
```

### Data Binding

O two-way binding aparece no formulário:

```html
[(ngModel)]="novoNome"
[(ngModel)]="novaIdade"
```

Ele mantém o valor do campo sincronizado com as propriedades do componente.

### Diretivas e controle de fluxo

O projeto utiliza:

```html
@for
@if
@empty
```

Exemplo:

```html
@if (estaEditando) {
  ...
}
```

### Eventos

Os principais eventos são:

```html
(ngSubmit)="registrarPresenca()"
(click)="detalharRegistro(registro)"
(click)="iniciarEdicao(registro)"
(click)="removerRegistro(registro.id)"
```

## 7. Por que a tabela continua HTML?

Foi feita uma tentativa de usar a tabela do OptimusUI (`TableModule`). Porém, esse módulo aumentou muito o bundle inicial e ultrapassou o limite de erro configurado para a aplicação.

Por isso, a decisão atual é:

```text
Tabela HTML + Tailwind = tabela leve, responsiva e simples
OptimusUI/Aura = inputs, botões, tags e diálogo
```

A tabela HTML ainda utiliza Angular e Tailwind, portanto continua demonstrando:

- listagem de dados;
- controle `@for`;
- estado vazio com `@empty`;
- ações CRUD;
- responsividade;
- classes utilitárias.

Essa é uma decisão técnica intencional, não uma ausência de implementação do CRUD.

## 8. Estado dos testes

Os testes estão em [src/app/app.spec.ts](../src/app/app.spec.ts).

Atualmente são verificados:

1. criação do componente;
2. renderização da mensagem de boas-vindas;
3. inclusão de uma presença sem informar idade.

Os comandos de validação são:

```bash
npm run build
npm test -- --watch=false
```

O build passa e os testes atuais passam.

O build pode apresentar um aviso de tamanho do bundle inicial por causa dos componentes do OptimusUI. Isso é diferente de um erro: a compilação continua sendo concluída.

## 9. Roteiro para apresentação

Uma ordem boa para explicar o projeto é:

1. mostrar a página inicial e a seta até o caderno;
2. explicar que o layout usa Tailwind;
3. abrir `registro-presenca.ts` e mostrar os quatro tipos exigidos;
4. abrir `app.ts` e mostrar a lista em memória;
5. mostrar `registrarPresenca`;
6. demonstrar uma inclusão sem idade;
7. demonstrar uma inclusão com idade;
8. usar `Detalhar`;
9. usar `Editar` e salvar;
10. usar `Remover`;
11. mostrar `app.html` e os componentes OptimusUI;
12. mostrar `app.config.ts` e o preset Aura;
13. mostrar `.postcssrc.json` e `styles.css`;
14. executar os testes.

## 10. Perguntas que podem ser feitas

### Onde os dados são armazenados?

Em memória, no array `registros` dentro do componente `App`. O enunciado permite esse tipo de armazenamento. Não há banco de dados nem backend.

### Por que existe um `id`?

Para diferenciar registros, inclusive quando duas pessoas têm o mesmo nome. Ele é usado nas operações de edição e remoção, mas não precisa ser exibido ao usuário.

### Por que a idade é opcional?

Ela atende ao atributo numérico exigido sem tornar o preenchimento obrigatório para quem assina o caderno.

### Por que o horário é automático?

O caderno representa uma anotação de presença. Portanto, o sistema registra o momento da confirmação com `new Date()`, em vez de confiar em um horário digitado manualmente.

### O que acontece ao recarregar a página?

Como o armazenamento é em memória, os registros desaparecem. Persistência poderia ser adicionada depois com `localStorage`, API ou banco de dados, mas não é necessária para esta atividade.

### Onde está o CRUD?

Principalmente em:

- model: [src/app/models/registro-presenca.ts](../src/app/models/registro-presenca.ts);
- lógica: [src/app/app.ts](../src/app/app.ts);
- interface: [src/app/app.html](../src/app/app.html).

### Qual tecnologia faz cada parte?

```text
Angular       = componente, binding, eventos e controle de fluxo
TypeScript    = model e lógica do CRUD
OptimusUI     = componentes visuais interativos
Aura          = preset visual do OptimusUI
Tailwind      = layout, espaçamento e responsividade
CSS próprio   = fundo e detalhes específicos da identidade
```

## 11. Arquivos importantes para mostrar

- [package.json](../package.json): dependências e scripts;
- [package-lock.json](../package-lock.json): versões resolvidas pelo npm;
- [angular.json](../angular.json): configuração de build, assets e estilos;
- [.postcssrc.json](../.postcssrc.json): integração do Tailwind com PostCSS;
- [src/styles.css](../src/styles.css): importação do Tailwind;
- [src/app/app.config.ts](../src/app/app.config.ts): configuração do Aura;
- [src/app/models/registro-presenca.ts](../src/app/models/registro-presenca.ts): model;
- [src/app/app.ts](../src/app/app.ts): lógica;
- [src/app/app.html](../src/app/app.html): interface;
- [src/app/app.css](../src/app/app.css): estilos específicos;
- [src/app/app.spec.ts](../src/app/app.spec.ts): testes.

## 12. Checklist final

- [ ] Executar `npm install`.
- [ ] Executar `npm run build`.
- [ ] Executar `npm test -- --watch=false`.
- [ ] Testar inclusão com idade.
- [ ] Testar inclusão sem idade.
- [ ] Testar detalhes.
- [ ] Testar edição e cancelamento.
- [ ] Testar remoção cancelada.
- [ ] Testar remoção confirmada.
- [ ] Conferir o layout em tela pequena.
- [ ] Conferir se os assets usados estão em `public/imgs`.
- [ ] Conferir se o repositório contém `package.json` e `package-lock.json`.
- [ ] Enviar o link correto do repositório para avaliação.
