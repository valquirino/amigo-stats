# Painel Administrativo de Jogadores de Futebol

Sistema administrativo para registro e gerenciamento de jogadores e clubes de futebol.

## Tecnologias Utilizadas

- HTML5
- CSS (Tailwind CSS via CDN)
- JavaScript (Vanilla)
- Font Awesome (para ícones)
- Webpack (para build e live-reload)

## Estrutura do Projeto

```
player-dashboard/
├── index.html (Página de login)
├── index.js (Ponto de entrada para o Webpack)
├── js/
│   ├── auth.js (Autenticação e controle de usuários)
│   ├── main.js (Funções globais e gerenciamento de dados)
├── pages/
│   ├── dashboard.html (Dashboard principal)
│   ├── players.html (Lista de jogadores)
│   ├── clubs.html (Lista de clubes)
│   ├── register-player.html (Formulário de registro de jogador)
│   ├── register-club.html (Formulário de registro de clube)
├── webpack.config.js (Configuração do Webpack)
├── package.json (Configuração do projeto e dependências)
```

## Funcionalidades

- **Sistema de autenticação:** Login e controle de sessão
- **Dashboard:** Visão geral de jogadores e clubes cadastrados
- **Gerenciamento de jogadores:** Cadastro, visualização, edição e exclusão
- **Gerenciamento de clubes:** Cadastro, visualização, edição e exclusão
- **Armazenamento local:** Dados salvos no localStorage do navegador
- **Live-reload:** Atualização automática durante o desenvolvimento

## Como Usar

### Instalação

1. Certifique-se de ter o Node.js instalado (versão 14 ou superior recomendada)
2. Clone este repositório ou faça o download dos arquivos
3. Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

### Executando o projeto com live-reload

Para iniciar o servidor de desenvolvimento com live-reload:

```bash
npm start
```

Isso iniciará o projeto na porta 3000 (http://localhost:3000) e atualizará automaticamente o navegador quando houver alterações nos arquivos.

### Construindo para produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

Isso criará uma pasta `dist` com os arquivos prontos para serem hospedados em um servidor web.

### Acessando sem servidor de desenvolvimento

Se preferir acessar sem usar o servidor de desenvolvimento:

1. Abra o arquivo `index.html` em um navegador
2. Faça login com uma das contas pré-configuradas:
   - Admin: `admin@exemplo.com` / `admin123`
   - Usuário: `usuario@exemplo.com` / `usuario123`
3. Navegue pelo sistema utilizando o menu lateral

## Dados Armazenados

Os dados são armazenados no localStorage do navegador. Isto significa que:
- Os dados persistem entre sessões no mesmo navegador/dispositivo
- Os dados são perdidos se o localStorage for limpo
- Esta implementação é apenas para fins de demonstração (em um ambiente de produção, seria necessário um backend real)

## Observações

Este projeto foi desenvolvido como uma solução front-end pura, sem backend. Em um ambiente de produção, seria necessário implementar:

- Autenticação segura com JWT ou similar
- Backend para persistência de dados
- Validações mais robustas
- Testes automatizados

## Melhorias Futuras

- Adicionar funcionalidade de upload de imagens
- Implementar sistema de estatísticas de jogadores
- Adicionar suporte para múltiplos idiomas
- Implementar modo escuro
- Adicionar funcionalidades de importação/exportação de dados 