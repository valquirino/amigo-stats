# Especificações para Criação do Backend - AmigoStats

## 1. Visão Geral do Sistema

O AmigoStats é uma plataforma de gerenciamento de jogadores e clubes de futebol que requer uma API RESTful para fornecer os dados necessários para a interface web. O sistema deve gerenciar informações detalhadas sobre jogadores, clubes, usuários e autenticação.

## 2. Tecnologias Recomendadas

- **Node.js**: Ambiente de execução
- **Express.js**: Framework para API REST
- **Sequelize ORM**: Para abstração e interação com o banco de dados
- **MySQL/PostgreSQL**: Banco de dados relacional
- **JWT (JSON Web Tokens)**: Para autenticação
- **Multer**: Para upload de arquivos/imagens
- **Bcrypt**: Para criptografia de senhas
- **Cors**: Para gerenciar Cross-Origin Resource Sharing

## 3. Estrutura de Diretórios

```
/
├── config/               # Configurações do sistema
│   ├── database.js       # Configuração do banco de dados
│   ├── auth.js           # Configuração da autenticação
│   └── uploads.js        # Configuração de uploads
├── controllers/          # Controladores para cada entidade
├── models/               # Modelos de dados/esquemas
├── routes/               # Definição das rotas da API
├── middlewares/          # Middlewares (auth, validação, etc.)
├── services/             # Regras de negócio
├── utils/                # Utilitários e funções auxiliares
├── uploads/              # Diretório para armazenar uploads
├── app.js                # Ponto de entrada da aplicação
└── package.json          # Dependências e scripts
```

## 4. Modelos de Dados

### 4.1 Modelo de Usuário (User)

```javascript
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },
  createLogin: {
    type: DataTypes.DATE
  }
});
```

### 4.2 Modelo de Jogador (Player)

```javascript
const Player = sequelize.define('Player', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING
  },
  birthdate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false
  },
  document: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shirtNumber: {
    type: DataTypes.INTEGER
  },
  foot: {
    type: DataTypes.ENUM('Direito', 'Esquerdo', 'Ambos'),
    allowNull: false
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Ativo', 'Lesionado', 'Suspenso', 'Aposentado'),
    defaultValue: 'Ativo'
  },
  contractEnd: {
    type: DataTypes.DATEONLY
  },
  notes: {
    type: DataTypes.TEXT
  },
  profileImage: {
    type: DataTypes.STRING
  }
});
```

### 4.3 Modelo de Clube (Club)

```javascript
const Club = sequelize.define('Club', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shortName: {
    type: DataTypes.STRING
  },
  founded: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  league: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stadium: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  president: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  primaryColor: {
    type: DataTypes.STRING
  },
  secondaryColor: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  logo: {
    type: DataTypes.STRING
  }
});
```

### 4.4 Modelo de Galeria de Imagens (PlayerImage)

```javascript
const PlayerImage = sequelize.define('PlayerImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Players',
      key: 'id'
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
```

### 4.5 Modelo de Preferências do Usuário (UserPreference)

```javascript
const UserPreference = sequelize.define('UserPreference', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  emailNotifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  twoFactorAuth: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'system'),
    defaultValue: 'light'
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'pt-BR'
  }
});
```

## 5. Relacionamentos

```javascript
// Um clube tem muitos jogadores
Club.hasMany(Player, { foreignKey: 'clubId' });
Player.belongsTo(Club, { foreignKey: 'clubId' });

// Um jogador tem muitas imagens
Player.hasMany(PlayerImage, { foreignKey: 'playerId' });
PlayerImage.belongsTo(Player, { foreignKey: 'playerId' });

// Um usuário tem uma preferência
User.hasOne(UserPreference, { foreignKey: 'userId' });
UserPreference.belongsTo(User, { foreignKey: 'userId' });
```

## 6. Endpoints da API

### 6.1 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/auth/login | Realiza login e retorna token JWT |
| POST | /api/auth/register | Registra novo usuário (apenas para admin) |
| POST | /api/auth/change-password | Altera senha do usuário autenticado |

### 6.2 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/users/profile | Obtém perfil do usuário autenticado |
| PUT | /api/users/profile | Atualiza perfil do usuário autenticado |
| GET | /api/users (admin) | Lista todos os usuários |
| GET | /api/users/:id (admin) | Obtém detalhes de um usuário específico |
| PUT | /api/users/:id (admin) | Atualiza usuário específico |
| DELETE | /api/users/:id (admin) | Remove usuário |

### 6.3 Preferências do Usuário

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/users/preferences | Obtém preferências do usuário atual |
| PUT | /api/users/preferences | Atualiza preferências do usuário atual |

### 6.4 Jogadores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/players | Lista jogadores (com paginação e filtros) |
| GET | /api/players/:id | Obtém detalhes de um jogador específico |
| POST | /api/players | Cria novo jogador |
| PUT | /api/players/:id | Atualiza jogador |
| DELETE | /api/players/:id | Remove jogador |
| POST | /api/players/:id/images | Adiciona imagens à galeria do jogador |
| DELETE | /api/players/:id/images/:imageId | Remove imagem da galeria |
| GET | /api/players/stats | Obtém estatísticas (jogadores por posição, etc.) |

### 6.5 Clubes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/clubs | Lista clubes (com paginação e filtros) |
| GET | /api/clubs/:id | Obtém detalhes de um clube específico |
| POST | /api/clubs | Cria novo clube |
| PUT | /api/clubs/:id | Atualiza clube |
| DELETE | /api/clubs/:id | Remove clube |
| GET | /api/clubs/:id/players | Lista jogadores de um clube específico |
| GET | /api/clubs/stats | Obtém estatísticas (clubes por país, etc.) |

### 6.6 Upload de Arquivos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/upload/profile | Upload de foto de perfil de jogador |
| POST | /api/upload/gallery | Upload de imagens para galeria |
| POST | /api/upload/club-logo | Upload de logo de clube |

## 7. Segurança e Validação

### 7.1 Middleware de Autenticação

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acesso negado' });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};
```

### 7.2 Middleware de Autorização para Admin

```javascript
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permissão negada' });
  }
  next();
};
```

### 7.3 Validação de Dados

Usar biblioteca de validação como yup para validar dados de entrada nos endpoints.

## 8. Processamento de Imagens

- Implementar redimensionamento e otimização de imagens
- Limitar o tamanho máximo de upload para 2MB
- Salvar imagens em diretórios separados por tipo (profiles, gallery, logos)
- Gerar thumbnails para otimizar carregamento na interface

## 9. Paginação e Filtros

### 9.1 Exemplo de Query Params para Listagem de Jogadores

```
GET /api/players?page=1&limit=10&search=nome&position=Goleiro&club=1&sort=name&order=asc
```

### 9.2 Exemplo de Implementação

```javascript
const getPlayers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const position = req.query.position || '';
    const clubId = req.query.club || '';
    const sort = req.query.sort || 'name';
    const order = req.query.order || 'asc';
    
    const whereClause = {};
    
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    
    if (position) {
      whereClause.position = position;
    }
    
    if (clubId) {
      whereClause.clubId = clubId;
    }
    
    const { count, rows } = await Player.findAndCountAll({
      where: whereClause,
      include: [{ model: Club }],
      limit,
      offset,
      order: [[sort, order]]
    });
    
    return res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      players: rows
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

## 10. Documentação da API

Implementar Swagger ou OpenAPI para documentação da API:

```javascript
// Configuração básica do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AmigoStats API',
      version: '1.0.0',
      description: 'API para o sistema de gerenciamento de jogadores de futebol'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      }
    ]
  },
  apis: ['./routes/*.js']
};
```

## 11. Considerações Adicionais

1. **Cache**: Implementar cache com Redis para endpoints frequentemente acessados
2. **Logs**: Configurar winston para logging estruturado
3. **Monitoramento**: Integrar com New Relic ou similar para monitoramento
4. **Rate Limiting**: Implementar limitação de requisições para prevenir abuso
5. **CORS**: Configurar CORS adequadamente para permitir apenas origens confiáveis
6. **Error Handling**: Criar middleware centralizado para tratamento de erros

## 12. Tarefas Prioritárias para Desenvolvimento

1. Configurar estrutura base do projeto e dependências
2. Implementar modelos de dados e migrações
3. Desenvolver sistema de autenticação e autorização
4. Implementar endpoints CRUD para Jogadores
5. Implementar endpoints CRUD para Clubes
6. Desenvolver sistema de upload e gerenciamento de imagens
7. Implementar paginação, filtros e ordenação
8. Configurar validação e tratamento de erros
9. Desenvolver endpoints para dashboard e estatísticas
10. Implementar documentação e testes 