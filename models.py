from finan import db
from datetime import datetime

# --- Modelo da Tabela de Utilizadores ---
# Cada classe representa uma tabela no banco de dados.
class Usuario(db.Model):
    # __tablename__ é opcional, mas ajuda a definir explicitamente o nome da tabela.
    __tablename__ = 'usuarios'
    
    # Define as colunas da tabela.
    # db.Column(<Tipo>, <Opções>)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    senha = db.Column(db.String(255), nullable=False)
    
    # Relacionamento: Um utilizador pode ter várias análises.
    # O 'backref' cria um atributo 'autor' no modelo Analise para aceder ao utilizador.
    # 'lazy=True' significa que os dados só serão carregados quando forem necessários.
    analises = db.relationship('Analise', backref='autor', lazy=True)

    # O método __repr__ define como o objeto será exibido para fins de depuração.
    def __repr__(self):
        return f'<Usuario {self.nome}>'


# --- Modelo da Tabela de Análises ---
class Analise(db.Model):
    __tablename__ = 'analises'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Define um valor padrão para a data e hora atuais no momento da criação.
    data_analise = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # O tipo 'Text' é ideal para guardar strings longas, como um JSON.
    dados_json = db.Column(db.Text, nullable=False)
    
    # Chave estrangeira que cria a ligação com a tabela 'usuarios'.
    # 'ondelete="CASCADE"' garante que, se um utilizador for apagado, as suas análises também o serão.
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f'<Analise {self.id} do Utilizador {self.usuario_id}>'
