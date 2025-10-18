import os
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env
# Isso é crucial para o desenvolvimento local
load_dotenv()

# Pega a chave secreta do ambiente. Se não achar, usa uma chave padrão
SECRET_KEY = os.environ.get('SECRET_KEY', 'jeby-financas-chave-secreta-para-desenvolvimento')

# Pega a string de conexão do banco de dados do ambiente
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

# Verifica se a URL do banco foi carregada
if not SQLALCHEMY_DATABASE_URI:
    raise ValueError("A variável de ambiente 'DATABASE_URL' não foi definida.")

# Desativa uma funcionalidade do SQLAlchemy que consome recursos
SQLALCHEMY_TRACK_MODIFICATIONS = False