import os

# --- Chave Secreta para Segurança ---
# IMPORTANTE: Para produção, esta chave deve ser longa, aleatória e secreta.
# Pode gerar uma chave forte com: python -c 'import secrets; print(secrets.token_hex())'
SECRET_KEY = 'jeby-financas-chave-secreta-para-desenvolvimento'

# --- Configuração do Banco de Dados ---
# String de conexão para o SQLAlchemy se ligar ao seu banco de dados MySQL.
# Formato: 'mysql+mysqlconnector://<utilizador>:<password>@<host>/<nome_db>'
SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:admin@127.0.0.1/jeby_financas'

# --- Configurações Adicionais do SQLAlchemy ---
# Desativa uma funcionalidade do SQLAlchemy que consome recursos e que não é necessária para este projeto.
SQLALCHEMY_TRACK_MODIFICATIONS = False
