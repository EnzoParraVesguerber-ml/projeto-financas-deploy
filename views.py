# Importações necessárias do Flask e de outras bibliotecas
from flask import render_template, request, redirect, url_for, session, flash, jsonify
# Importa as variáveis 'app', 'db', e 'bcrypt' do ficheiro principal 'app.py'
from finan import app, db, bcrypt
# Importa os modelos do banco de dados
from models import Usuario, Analise
# Importa as classes de formulário do ficheiro helpers.py
from helpers import FormularioRegisto, FormularioLogin
# Importações para a análise de dados
import pandas as pd
import joblib
import os
from ml_model.predictor import classificar_despesas, processar_pre_classificado

# --- ROTAS DE UTILIZADOR E AUTENTICAÇÃO ---

@app.route('/login')
def login_page():
    proxima = request.args.get('proxima')
    form = FormularioLogin() # Cria uma instância do formulário
    if proxima is None:
        proxima = url_for('dashboard')
    return render_template('login/index.html', proxima=proxima, form=form) # Envia para o template

# No ficheiro: Projeto-Finan-as/views.py

@app.route('/autenticar', methods=['POST',])
def autenticar():
    form = FormularioLogin(request.form)
    usuario = Usuario.query.filter_by(email=form.email.data).first()

    # Passo 1: Verifica se o usuário existe
    if usuario:
        # Passo 2: Se existe, verifica a senha
        senha_correta = bcrypt.check_password_hash(usuario.senha, form.senha.data)
        if senha_correta:
            # Login bem-sucedido
            session['usuario_logado'] = usuario.id
            session['usuario_nome'] = usuario.nome
            flash(f'Bem-vindo(a) de volta, {usuario.nome}!', 'success')
            
            proxima_pagina = request.form.get('proxima')
            return redirect(proxima_pagina or url_for('dashboard'))

    # Se o usuário não existe OU a senha está incorreta, mostra o erro
    flash('Email ou senha incorretos. Tente novamente.', 'danger')
    return redirect(url_for('login_page'))

@app.route('/registrar', methods=['POST',])
def registrar():
    form = FormularioRegisto(request.form)

    # O método validate() verifica todas as regras definidas no helpers.py
    if form.validate():
        # Verifica se já existe um utilizador com este email
        if Usuario.query.filter_by(email=form.email.data).first():
            flash('Este email já está em uso. Por favor, escolha outro.', 'warning')
            return redirect(url_for('signup_page'))

        # Criptografa a senha antes de a guardar
        senha_hash = bcrypt.generate_password_hash(form.senha.data).decode('utf-8')
        
        # Cria um novo objeto Utilizador e guarda-o na base de dados
        novo_usuario = Usuario(nome=form.nome.data, email=form.email.data, senha=senha_hash)
        db.session.add(novo_usuario)
        db.session.commit()

        flash(f'Conta para {form.nome.data} criada com sucesso! Por favor, faça login.', 'success')
        return redirect(url_for('login_page'))
    else:
        # Se a validação falhar, mostra os erros para o utilizador
        for field, errors in form.errors.items():
            for error in errors:
                flash(f"{error}", 'danger')
        return redirect(url_for('signup_page'))

@app.route('/logout')
def logout():
    session.pop('usuario_logado', None)
    session.pop('usuario_nome', None)
    flash('Logout efetuado com sucesso!', 'info')
    return redirect(url_for('home'))

# --- ROTAS PRINCIPAIS DA APLICAÇÃO ---

@app.route('/')
def home():
    return render_template('inicial/index.html')

@app.route('/signup')
def signup_page():
    form = FormularioRegisto() # Cria uma instância do formulário
    return render_template('signup/index.html', form=form) # Envia para o template

@app.route('/dashboard')
def dashboard():
    if 'usuario_logado' not in session or session['usuario_logado'] is None:
        flash('Por favor, faça login para aceder a esta página.', 'info')
        return redirect(url_for('login_page', proxima=url_for('dashboard')))
    
    return render_template('input/index.html')

@app.route('/resultados')
def resultados_page():
    if 'usuario_logado' not in session or session['usuario_logado'] is None:
        return redirect(url_for('login_page'))
    
    return render_template('resultados/index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'usuario_logado' not in session or session['usuario_logado'] is None:
        return jsonify({'error': 'Não autorizado'}), 401

    if 'file-upload' not in request.files:
        return jsonify({'error': 'Nenhum ficheiro enviado'}), 400

    file = request.files['file-upload']
    analysis_type = request.form.get('analysis_type') # Pega o tipo de análise do formulário

    if file.filename == '':
        return jsonify({'error': 'Nome de ficheiro inválido'}), 400

    try:
        # Cria uma pasta temporária para guardar os uploads
        temp_dir = 'uploads'
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
        
        caminho_arquivo = os.path.join(temp_dir, file.filename)
        file.save(caminho_arquivo)

        dados_analise = None
        # Decide qual função chamar com base na escolha do usuário
        if analysis_type == 'ai':
            dados_analise = classificar_despesas(caminho_arquivo)
        elif analysis_type == 'labeled':
            dados_analise = processar_pre_classificado(caminho_arquivo)
        else:
            return jsonify({'error': 'Tipo de análise inválido'}), 400
        
        # Remove o ficheiro temporário depois de usar
        os.remove(caminho_arquivo)
        
        # Retorna os dados classificados para o frontend
        return jsonify(dados_analise)

    except ValueError as ve:
        # Erro específico para colunas faltando
        print(f"Erro de valor na rota /upload: {ve}")
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        # Erro genérico
        print(f"Erro na rota /upload: {e}")
        return jsonify({'error': f'Ocorreu um erro ao processar o ficheiro: {str(e)}'}), 500

