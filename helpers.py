from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators

class FormularioRegisto(FlaskForm):
    nome = StringField(
        'Nome Completo', 
        [validators.DataRequired(), validators.Length(min=3, max=100)]
    )
    email = StringField(
        'Email', 
        [validators.DataRequired(), validators.Email(), validators.Length(max=150)]
    )
    senha = PasswordField(
        'Senha', 
        [
            validators.DataRequired(), 
            validators.Length(min=6, max=100),
            validators.EqualTo('confirmar_senha', message='As senhas devem ser iguais.')
        ]
    )
    confirmar_senha = PasswordField('Confirmação de Senha')

class FormularioLogin(FlaskForm):
    email = StringField(
        'Email', 
        [validators.DataRequired(), validators.Email()]
    )
    senha = PasswordField(
        'Senha', 
        [validators.DataRequired()]
    )