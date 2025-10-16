import os

# Usada pelo Flask para proteger sessões, cookies e formulários contra ataques
SECRET_KEY = 'jeby-financas-chave-secreta-para-desenvolvimento'

# String de conexão para o SQLAlchemy se ligar ao seu banco de dados MySQL
SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:admin@127.0.0.1/jeby_financas'

# Desativa uma funcionalidade do SQLAlchemy que consome recursos e que não é necessária para este projeto
SQLALCHEMY_TRACK_MODIFICATIONS = False
