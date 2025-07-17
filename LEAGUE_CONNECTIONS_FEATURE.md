# Funcionalidade de Ligas

## Visão Geral

Esta funcionalidade permite gerenciar ligações entre clubes e ligas (séries) para anos específicos. Os administradores podem criar, visualizar e remover ligações entre clubes existentes e séries predefinidas (A, B, C) para diferentes anos.

## Funcionalidades

### 1. Criar Nova Ligação
- **Formulário de criação**: Permite selecionar um clube existente, uma série (A, B ou C) e um ano específico
- **Validação**: Todos os campos são obrigatórios
- **Anos disponíveis**: De 2000 até o ano atual + 1

### 2. Visualizar Ligações
- **Tabela responsiva**: Exibe todas as ligações criadas
- **Informações mostradas**:
  - Nome e localização do clube
  - Série (com badge colorido)
  - Ano da ligação
  - Data de criação
  - Ações disponíveis

### 3. Filtrar Ligações
- **Filtro por clube**: Mostra apenas ligações de um clube específico
- **Filtro por série**: Filtra por Série A, B ou C
- **Filtro por ano**: Mostra ligações de um ano específico
- **Limpar filtros**: Remove todos os filtros aplicados

### 4. Remover Ligações
- **Confirmação**: Requer confirmação antes de remover
- **Ação irreversível**: A remoção não pode ser desfeita

## Estrutura de Arquivos

### Frontend
- `pages/league-connections.html` - Página principal da funcionalidade
- `js/league-connections.js` - Lógica JavaScript para gerenciar ligações

### Integração
- Atualizado `webpack.config.js` para incluir a nova página
- Atualizado `index.js` para importar o novo script
- Atualizado sidebar em todas as páginas para incluir o link

## Endpoints da API Esperados

### GET /league-connections
- **Descrição**: Busca todas as ligações
- **Query params opcionais**:
  - `clubId`: ID do clube para filtrar
  - `league`: Série (A, B, C) para filtrar
  - `year`: Ano para filtrar
- **Resposta**: Array de objetos com ligações

### POST /league-connections
- **Descrição**: Cria uma nova ligação
- **Body**:
  ```json
  {
    "clubId": "string",
    "league": "A|B|C",
    "year": "number"
  }
  ```

### DELETE /league-connections/:id
- **Descrição**: Remove uma ligação específica
- **Parâmetros**: ID da ligação na URL

## Interface do Usuário

### Cores dos Badges
- **Série A**: Verde (`bg-green-100 text-green-800`)
- **Série B**: Azul (`bg-blue-100 text-blue-800`)
- **Série C**: Roxo (`bg-purple-100 text-purple-800`)

### Estados da Interface
- **Estado vazio**: Mostra mensagem quando não há ligações
- **Formulário oculto**: Inicialmente oculto, aparece ao clicar em "Nova Ligação"
- **Notificações**: Feedback visual para ações de sucesso/erro

## Permissões

- **Administradores**: Acesso completo a todas as funcionalidades
- **Usuários**: Acesso negado (página não aparece no sidebar)

## Responsividade

- **Desktop**: Layout em grid com 3 colunas para o formulário
- **Mobile**: Layout em coluna única, sidebar colapsável
- **Tabela**: Scroll horizontal em telas pequenas

## Validações

### Frontend
- Todos os campos obrigatórios
- Ano deve ser entre 2000 e ano atual + 1
- Clube deve ser selecionado da lista existente

### Backend (Esperado)
- Verificação de existência do clube
- Validação de série (A, B, C)
- Validação de ano
- Verificação de duplicatas (mesmo clube + série + ano)

## Notificações

- **Sucesso**: Verde com ícone de check
- **Erro**: Vermelho com ícone de exclamação
- **Info**: Azul com ícone de informação
- **Duração**: 3 segundos
- **Posição**: Canto superior direito 