import mysql.connector  # Biblioteca para conectar e manipular bancos MySQL em Python
from mysql.connector import errorcode  # Importa códigos de erro específicos do MySQL
from flask_bcrypt import generate_password_hash # Função para gerar hash seguro de senhas

print("A iniciar a configuração do banco de dados...")

# Detalhes de conexão
# Altere 'root' e 'admin' se as suas credenciais do MySQL forem diferentes
config = {
    'user': 'root',
    'password': 'admin',
    'host': '127.0.0.1'
}
DB_NAME = 'jeby_financas' # Nome do banco de dados a ser criado

# Conexão com o servidor MySQL
try:
    conn = mysql.connector.connect(**config) # Tenta conectar ao MySQL com as credenciais fornecidas
    cursor = conn.cursor()   # Cria um cursor para executar comandos SQL
    print("Conexão com o MySQL bem-sucedida.")
except mysql.connector.Error as err:
    # Trata erros de acesso e outros problemas de conexão
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Erro de acesso: Verifique o nome de utilizador ou a password.")
    else:
        print(f"Erro ao conectar ao MySQL: {err}")
    exit(1)

# Criação do banco de dados
try:
    cursor.execute(f"CREATE DATABASE {DB_NAME} DEFAULT CHARACTER SET 'utf8'") # Cria o banco de dados com charset UTF-8
    print(f"Banco de dados '{DB_NAME}' criado com sucesso.")
except mysql.connector.Error as err:
     # Se o banco já existe, apenas informa; outros erros são exibidos e encerram o script
    if err.errno == errorcode.ER_DB_CREATE_EXISTS:
        print(f"Banco de dados '{DB_NAME}' já existe.")
    else:
        print(f"Falha ao criar o banco de dados: {err.msg}")
        exit(1)

# Seleciona o banco de dados para uso
conn.database = DB_NAME

# Definição e criação das tabelas
TABLES = {}
# Define tabela de usuários
TABLES['usuarios'] = (
    "CREATE TABLE `usuarios` ("
    "  `id` INT(11) NOT NULL AUTO_INCREMENT,"
    "  `nome` VARCHAR(100) NOT NULL,"
    "  `email` VARCHAR(150) NOT NULL UNIQUE,"
    "  `senha` VARCHAR(255) NOT NULL,"
    "  PRIMARY KEY (`id`)"
    ") ENGINE=InnoDB")
# Define tabela de análises
TABLES['analises'] = (
    "CREATE TABLE `analises` ("
    "  `id` INT(11) NOT NULL AUTO_INCREMENT,"
    "  `data_analise` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"
    "  `dados_json` TEXT NOT NULL,"
    "  `usuario_id` INT(11) NOT NULL,"
    "  PRIMARY KEY (`id`),"
    "  FOREIGN KEY (`usuario_id`)"
    "    REFERENCES `usuarios`(`id`)"
    "    ON DELETE CASCADE" # Se um usuário for apagado, as suas análises também serão.
    ") ENGINE=InnoDB")

# Cria as tabelas no banco de dados
for table_name in TABLES:
    table_description = TABLES[table_name]
    try:
        print(f"A criar a tabela '{table_name}': ", end='')
        cursor.execute(table_description)
    except mysql.connector.Error as err:
        # Se a tabela já existe, informa; outros erros são exibidos
        if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
            print("já existe.")
        else:
            print(err.msg)
    else:
        print("OK")

# Inserção de dados de exemplo
print("\nA inserir utilizadores de exemplo...")
try:
    # SQL para inserir um novo utilizador
    add_user_sql = "INSERT INTO usuarios (nome, email, senha) VALUES (%s, %s, %s)"

    # Dados dos utilizadores de exemplo
    users_to_add = [
        ("Utilizador Teste 1", "teste1@jeby.com", generate_password_hash("senha123").decode('utf-8')),
        ("Maria Silva", "maria.silva@email.com", generate_password_hash("financas_em_dia").decode('utf-8')),
        ("João Pereira", "joao.p@exemplo.com", generate_password_hash("jeby2025").decode('utf-8'))
    ]

    cursor.executemany(add_user_sql, users_to_add) # Insere todos os usuários de exemplo
    conn.commit() # Efetiva as inserções no banco de dados
    print("Utilizadores de exemplo inseridos com sucesso.")

    # Verifica os utilizadores inseridos
    cursor.execute('SELECT nome, email FROM usuarios')
    print('--- Utilizadores no Banco de Dados: ---')
    for (nome, email) in cursor.fetchall():
        print(f"  - Nome: {nome}, Email: {email}")

except mysql.connector.Error as err:
    print(f"Erro ao inserir utilizadores: {err}")

print("\nConfiguração do banco de dados concluída.")
cursor.close() # Fecha o cursor
conn.close()  # Fecha a conexão com o banco de dados