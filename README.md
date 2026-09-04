# Portal LigaMagic

Portal administrativo para autenticação de usuários e gerenciamento de cartas de Magic: The Gathering, Pokémon e Yu-Gi-Oh!

## Tecnologias

- PHP 8.2 sem framework
- MySQL 8.0
- HTML5, CSS3 e JavaScript vanilla
- Docker 29.7.2 e Docker Compose

## Pré-requisitos

- Docker
- Docker Compose

## Como executar

Crie o arquivo `.env` a partir do modelo disponibilizado:

```bash
cp .env.example .env
```

Revise os valores do `.env` se necessário. A configuração padrão utiliza a porta `80` para a aplicação.

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Importe o schema e os dados iniciais:

```bash
chmod +x database/import-schema.sh
./database/import-schema.sh
```

Acesse a aplicação em [http://localhost:80](http://localhost:80).

> O arquivo `database/schema.sql` recria o banco `app_db`. A importação deve ser usada apenas para configurar ou resetar o ambiente de teste.

Para parar os containers:

```bash
docker compose down
```

## Credenciais de teste

- Usuário: `ADMIN`
- Senha: `admin123`

## Funcionalidades

- Login, sessão autenticada e logout
- Listagem de cartas com busca, filtros e paginação
- Cadastro, edição, visualização e exclusão de cartas
- Seleção de card game e carregamento das edições correspondentes via `fetch`
- Dados iniciais de jogos, edições e cartas

## Decisões de produto

### Frontend

- Optei por uma abordagem visual moderna, com interface limpa, responsiva e organizada. A navegação utiliza uma sidebar, seguindo padrões atuais e facilitando o acesso às funcionalidades.

- As cartas são exibidas em tabela, escolhida pela facilidade de organização e escalabilidade do produto. A listagem conta com paginação e filtros completos para agilizar a consulta e o gerenciamento dos dados.

- As raridades utilizam cores distintas para facilitar sua identificação. Cadastro, visualização e edição são realizados em modais, enquanto a exclusão exige confirmação, evitando ações acidentais.

- O frontend foi dividido em módulos de API, componentes, inicialização de telas e utilitários, facilitando a manutenção e a expansão do sistema sem concentrar a lógica em um único arquivo.

### Backend

- O backend foi organizado em controllers, services e repositories. Os controllers cuidam da requisição e resposta, os services concentram as regras do domínio e os repositories acessam o MySQL. Essa decisão facilita a manutenção, a validação do CRUD e futuras alterações sem misturar responsabilidades.

## Estrutura principal

```text
app/
├── index.php                 # Tela de login
├── home.php                  # Área autenticada
├── src/
│   ├── config/               # Configuração da aplicação e conexão com o banco
│   ├── controllers/          # Endpoints PHP para login, logout, cartas e jogos
│   ├── includes/             # Funções compartilhadas do backend
│   ├── repositories/         # Consultas e acesso aos dados do MySQL
│   └── service/              # Regras de negócio e validações
└── public/                   # Arquivos públicos do frontend
	├── css/                  # Separa os estilos por contexto
	└── js/
		├── api/              # Funções que fazem requisições HTTP com fetch
		├── bootstrap/        # Inicia cada tela e conecta os componentes aos elementos definidos nos arquivos PHP.
		├── components/       # Componentes de interface em JavaScript vanilla
		└── utils/            # Utilitários
database/
├── schema.sql                # Estrutura e dados iniciais
└── import-schema.sh          # Importação do banco
```
