import mysql.connector
from mysql.connector import errorcode
# É uma boa prática usar uma biblioteca de hashing mais robusta como a bcrypt
# Certifique-se de instalar com: pip install flask-bcrypt
from flask_bcrypt import generate_password_hash

print("A iniciar a configuração do banco de dados...")

# --- Detalhes da Conexão ---
# Altere 'root' e 'admin' se as suas credenciais do MySQL forem diferentes
config = {
    'user': 'root',
    'password': 'admin',
    'host': '127.0.0.1'
}
DB_NAME = 'jeby_financas'

# --- Conexão ao Servidor MySQL ---
try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    print("Conexão com o MySQL bem-sucedida.")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Erro de acesso: Verifique o nome de utilizador ou a password.")
    else:
        print(f"Erro ao conectar ao MySQL: {err}")
    exit(1)

# --- Criação do Banco de Dados ---
try:
    cursor.execute(f"CREATE DATABASE {DB_NAME} DEFAULT CHARACTER SET 'utf8'")
    print(f"Banco de dados '{DB_NAME}' criado com sucesso.")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_DB_CREATE_EXISTS:
        print(f"Banco de dados '{DB_NAME}' já existe.")
    else:
        print(f"Falha ao criar o banco de dados: {err.msg}")
        exit(1)

# Seleciona o banco de dados para uso
conn.database = DB_NAME

# --- Definição e Criação das Tabelas ---
TABLES = {}
TABLES['usuarios'] = (
    "CREATE TABLE `usuarios` ("
    "  `id` INT(11) NOT NULL AUTO_INCREMENT,"
    "  `nome` VARCHAR(100) NOT NULL,"
    "  `email` VARCHAR(150) NOT NULL UNIQUE,"
    "  `senha` VARCHAR(255) NOT NULL,"
    "  PRIMARY KEY (`id`)"
    ") ENGINE=InnoDB")

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

for table_name in TABLES:
    table_description = TABLES[table_name]
    try:
        print(f"A criar a tabela '{table_name}': ", end='')
        cursor.execute(table_description)
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
            print("já existe.")
        else:
            print(err.msg)
    else:
        print("OK")

# --- Inserção de Dados de Exemplo (Opcional) ---
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

    cursor.executemany(add_user_sql, users_to_add)
    
    # Efetiva as inserções no banco de dados
    conn.commit()
    print("Utilizadores de exemplo inseridos com sucesso.")

    # Verifica os utilizadores inseridos
    cursor.execute('SELECT nome, email FROM usuarios')
    print('--- Utilizadores no Banco de Dados: ---')
    for (nome, email) in cursor.fetchall():
        print(f"  - Nome: {nome}, Email: {email}")

except mysql.connector.Error as err:
    print(f"Erro ao inserir utilizadores: {err}")

# --- Finalização ---
print("\nConfiguração do banco de dados concluída.")
cursor.close()
conn.close()