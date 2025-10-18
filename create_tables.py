# Arquivo: create_tables.py
from finan import app, db

# Este script usa o 'app' e o 'db' do projeto.
# Como o 'app' carrega o 'config.py', e o 'config.py'
# carrega o '.env', este script vai se conectar 
# automaticamente ao banco de dados do AIVEN.

with app.app_context():
    print("Conectando ao banco de dados e criando tabelas (se não existirem)...")
    
    # Este comando olha todos os Models (em models.py)
    # e cria as tabelas no banco de dados.
    db.create_all()
    
    print("Tabelas 'usuarios' e 'analises' criadas com sucesso no Aiven!")