from flask_wtf import FlaskForm    # Importa a classe base para formulários do Flask-WTF
from wtforms import StringField, PasswordField, validators

# Formulário de Registro de Usuário 
class FormularioRegisto(FlaskForm):
    # Campo para o nome completo do usuário, obrigatório, entre 3 e 100 caracteres
    nome = StringField(
        'Nome Completo', 
        [validators.DataRequired(), validators.Length(min=3, max=100)]
    )
    # Campo para o e-mail, obrigatório, formato de e-mail válido, até 150 caracteres
    email = StringField(
        'Email', 
        [validators.DataRequired(), validators.Email(), validators.Length(max=150)]
    )
     # Campo para senha, obrigatório, entre 6 e 100 caracteres, deve ser igual ao campo de confirmação
    senha = PasswordField(
        'Senha', 
        [
            validators.DataRequired(), 
            validators.Length(min=6, max=100),
            validators.EqualTo('confirmar_senha', message='As senhas devem ser iguais.')
        ]
    )
    # Campo para confirmação de senha, obrigatório para validar igualdade
    confirmar_senha = PasswordField('Confirmação de Senha')

# Formulário de Login de Usuário
class FormularioLogin(FlaskForm):
    # Campo para e-mail, obrigatório, formato de e-mail válido
    email = StringField(
        'Email', 
        [validators.DataRequired(), validators.Email()]
    )
    # Campo para senha, obrigatório
    senha = PasswordField(
        'Senha', 
        [validators.DataRequired()]
    )