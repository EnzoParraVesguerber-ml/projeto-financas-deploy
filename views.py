# Importações necessárias do Flask e de outras bibliotecas
from flask import render_template, request, redirect, url_for, session, flash, jsonify
# Importa as variáveis 'app', 'db', e 'bcrypt' do ficheiro principal 'app.py'
from finan import app, db, bcrypt
# Importa os modelos do banco de dados
from models import Usuario
# Importa as classes de formulário do ficheiro helpers.py
from helpers import FormularioRegisto, FormularioLogin
# Importações para a análise de dados
import pandas as pd
import joblib
import os
from ml_model.predictor import classificar_despesas, processar_pre_classificado


@app.route('/autenticar', methods=['POST'])
def autenticar():
    # Rota para autenticar o usuário (AGORA RETORNA JSON)
    form = FormularioLogin(request.form)
    usuario = Usuario.query.filter_by(email=form.email.data).first()

    if usuario and bcrypt.check_password_hash(usuario.senha, form.senha.data):
        # Login bem-sucedido
        return jsonify({'message': 'Login bem-sucedido!', 'user_name': usuario.nome}), 200
    else:
        # Se o usuário não existe ou a senha está incorreta
        return jsonify({'error': 'Email ou senha incorretos. Tente novamente.'}), 401


@app.route('/registrar', methods=['POST'])
def registrar():
    # Rota para registrar novo usuário (AGORA RETORNA JSON)
    form = FormularioRegisto(request.form)

    # O método validate() do WTForms não funciona bem com JSON, então validamos manualmente
    if not form.nome.data or not form.email.data or not form.senha.data:
        return jsonify({'error': 'Todos os campos são obrigatórios.'}), 400
        
    if Usuario.query.filter_by(email=form.email.data).first():
        return jsonify({'error': 'Este email já está em uso. Por favor, escolha outro.'}), 409 # 409 Conflict

    senha_hash = bcrypt.generate_password_hash(form.senha.data).decode('utf-8')
    novo_usuario = Usuario(nome=form.nome.data, email=form.email.data, senha=senha_hash)
    db.session.add(novo_usuario)
    db.session.commit()

    return jsonify({'message': f'Conta para {form.nome.data} criada com sucesso! Por favor, faça login.'}), 201 # 201 Created


@app.route('/upload', methods=['POST'])
def upload():
    # Esta rota já retorna JSON, então está correta.
    # NOTA: Esta rota precisa de autenticação. O JS precisará enviar um token futuramente.
    # Por agora, a verificação de sessão está comentada para permitir testes.

    if 'file-upload' not in request.files:
        return jsonify({'error': 'Nenhum ficheiro enviado'}), 400

    file = request.files['file-upload']
    analysis_type = request.form.get('analysis_type')

    if file.filename == '':
        return jsonify({'error': 'Nome de ficheiro inválido'}), 400

    try:
        # Usar uma pasta temporária segura que o Render fornece
        temp_dir = '/tmp' 
        
        caminho_arquivo = os.path.join(temp_dir, file.filename)
        file.save(caminho_arquivo)

        dados_analise = None
        if analysis_type == 'ai':
            dados_analise = classificar_despesas(caminho_arquivo)
        elif analysis_type == 'labeled':
            dados_analise = processar_pre_classificado(caminho_arquivo)
        else:
            return jsonify({'error': 'Tipo de análise inválido'}), 400
        
        os.remove(caminho_arquivo)
        
        return jsonify(dados_analise)

    except ValueError as ve:
        print(f"Erro de valor na rota /upload: {ve}")
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        print(f"Erro na rota /upload: {e}")
        return jsonify({'error': f'Ocorreu um erro ao processar o ficheiro: {str(e)}'}), 500


# Rota principal da API para verificar se está online
@app.route('/')
def home():
    return "API do JEBY Finanças está no ar!"


# As rotas abaixo não são mais necessárias para o frontend, mas podem ser mantidas.
@app.route('/logout')
def logout():
    # A lógica de sessão do lado do servidor não se aplica mais da mesma forma
    # O logout será controlado pelo frontend limpando o localStorage
    return jsonify({'message': 'Logout endpoint.'})

