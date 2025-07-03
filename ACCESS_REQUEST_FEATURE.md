# Funcionalidade de Solicitação de Acesso

## Visão Geral

Esta funcionalidade permite que usuários que não possuem conta no sistema solicitem acesso através da tela de login. Quando um usuário preenche o email e senha e clica em "Solicitar acesso", uma requisição é enviada para o backend com status "pending".

## Como Funciona

### 1. Interface do Usuário
- Na tela de login (`index.html`), há um botão "Solicitar acesso" abaixo do formulário de login
- O usuário deve preencher email e senha antes de clicar no botão
- Validações são aplicadas:
  - Email e senha são obrigatórios
  - Email deve ter formato válido
  - Senha deve ter pelo menos 6 caracteres

### 2. Processo de Solicitação
- Quando o botão é clicado, a função `requestAccess()` é chamada
- Uma requisição POST é enviada para `http://localhost:3333/auth/request-access`
- Os dados enviados incluem:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha123",
    "status": "pending"
  }
  ```

### 3. Resposta do Sistema
- **Sucesso**: Exibe mensagem de confirmação e limpa os campos
- **Erro**: Exibe mensagem de erro específica

### 4. Gerenciamento pelo Administrador
- As solicitações aparecem na página "Requisições de Acesso" (`pages/access-requests.html`)
- O administrador pode aprovar ou rejeitar as solicitações
- Apenas usuários com role "admin" podem acessar esta funcionalidade

## Endpoints Necessários no Backend

### POST /auth/request-access
**Descrição**: Cria uma nova solicitação de acesso

**Corpo da requisição**:
```json
{
  "email": "string",
  "password": "string",
  "status": "pending"
}
```

**Resposta de sucesso (200)**:
```json
{
  "success": true,
  "message": "Solicitação de acesso enviada com sucesso!"
}
```

**Resposta de erro (400/500)**:
```json
{
  "success": false,
  "error": "Mensagem de erro específica"
}
```

### GET /access-requests
**Descrição**: Lista todas as solicitações de acesso (requer autenticação de admin)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Resposta de sucesso (200)**:
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "(11) 99999-9999",
    "type": "player",
    "status": "pending",
    "date": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Clube Atlético",
    "email": "contato@clube.com",
    "phone": "(11) 88888-8888",
    "type": "club",
    "status": "approved",
    "date": "2024-01-14T15:45:00Z"
  }
]
```

**Resposta de erro (401/403)**:
```json
{
  "error": "Acesso negado ou não autorizado"
}
```

### PUT /access-requests/:id/approve
**Descrição**: Aprova uma solicitação de acesso (requer autenticação de admin)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parâmetros**:
- `id`: ID da solicitação de acesso

**Resposta de sucesso (200)**:
```json
{
  "success": true,
  "message": "Requisição aprovada com sucesso!"
}
```

**Resposta de erro (400/404/500)**:
```json
{
  "error": "Erro ao aprovar requisição"
}
```

### DELETE /access-requests/:id
**Descrição**: Remove uma solicitação de acesso (requer autenticação de admin)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Parâmetros**:
- `id`: ID da solicitação de acesso

**Resposta de sucesso (200)**:
```json
{
  "success": true,
  "message": "Requisição removida com sucesso!"
}
```

**Resposta de erro (400/404/500)**:
```json
{
  "error": "Erro ao remover requisição"
}
```

## Estrutura de Dados

A solicitação de acesso deve ser armazenada no banco de dados com os seguintes campos:
- `id`: Identificador único
- `name`: Nome do solicitante (pode ser nome de pessoa ou clube)
- `email`: Email do solicitante
- `password`: Senha criptografada
- `phone`: Telefone do solicitante (opcional)
- `type`: Tipo de solicitação ("player" ou "club")
- `status`: Status da solicitação (pending, approved, rejected)
- `date`: Data da solicitação
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## Fluxo Completo

1. **Usuário**: Preenche email e senha na tela de login
2. **Usuário**: Clica em "Solicitar acesso"
3. **Frontend**: Valida os dados e envia requisição para o backend
4. **Backend**: Salva a solicitação com status "pending"
5. **Frontend**: Exibe mensagem de sucesso
6. **Administrador**: Acessa a página de requisições de acesso
7. **Administrador**: Aprova ou rejeita a solicitação
8. **Sistema**: Cria conta do usuário (se aprovado) ou mantém rejeitado

## Arquivos Modificados

- `js/auth.js`: Adicionada função `requestAccess()` e event listener
- `index.html`: Adicionado ID ao botão "Solicitar acesso"
- `ACCESS_REQUEST_FEATURE.md`: Esta documentação

## Próximos Passos

1. Implementar o endpoint `/auth/request-access` no backend
2. Criar modelo de dados para AccessRequest
3. Implementar lógica de aprovação/rejeição
4. Adicionar notificações por email (opcional)
5. Implementar sistema de notificação para novos usuários aprovados

## Autenticação e Autorização

### Endpoints Públicos
- `POST /auth/request-access`: Não requer autenticação

### Endpoints Protegidos (Admin)
- `GET /access-requests`: Requer token JWT válido e role "admin"
- `PUT /access-requests/:id/approve`: Requer token JWT válido e role "admin"
- `DELETE /access-requests/:id`: Requer token JWT válido e role "admin"

### Headers de Autenticação
Todos os endpoints protegidos devem incluir:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Middleware de Verificação
O backend deve implementar middleware para:
1. Verificar se o token JWT é válido
2. Verificar se o usuário tem role "admin"
3. Retornar erro 401/403 em caso de falha na autenticação

## Implementação no Frontend

### Arquivos JavaScript Envolvidos

#### `js/auth.js`
- Função `requestAccess()`: Envia solicitação de acesso
- Event listener para botão "Solicitar acesso"
- Validações de formulário

#### `js/access-requests.js`
- Função `fetchRequests()`: Lista todas as solicitações
- Função `approveRequest()`: Aprova uma solicitação
- Função `deleteRequest()`: Remove uma solicitação
- Renderização da tabela de solicitações
- Sistema de notificações

### Funcionalidades Implementadas
- ✅ Solicitação de acesso via tela de login
- ✅ Listagem de solicitações para administradores
- ✅ Aprovação de solicitações
- ✅ Remoção de solicitações
- ✅ Validações de formulário
- ✅ Sistema de notificações
- ✅ Interface responsiva 