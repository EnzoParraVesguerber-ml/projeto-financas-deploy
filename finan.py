from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

# 1. Inicializa a aplicação Flask
app = Flask(__name__)

# 2. Carrega as configurações do ficheiro config.py
app.config.from_pyfile('config.py')

# 3. Inicializa as extensões que vamos usar no projeto
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# 4. Importa as rotas (views) do nosso ficheiro views.py
#    É importante que esta linha venha DEPOIS da inicialização de 'app', 'db', e 'bcrypt'
#    para evitar erros de importação circular.
from views import *

# 5. Executa a aplicação em modo de desenvolvimento quando o script é chamado diretamente
if __name__ == '__main__':
    app.run(debug=True)

