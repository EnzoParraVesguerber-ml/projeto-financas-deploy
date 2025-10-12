import pandas as pd
import joblib
import os
import re
from nltk.corpus import stopwords

# --- CARREGAMENTO DO MODELO E VETORIZADOR ---

# Constrói o caminho absoluto para a pasta de modelos
saved_models_path = os.path.join(os.path.dirname(__file__), 'saved_models')

MODEL_PATH = os.path.join(saved_models_path, 'classifier_model.joblib')
VECTORIZER_PATH = os.path.join(saved_models_path, 'tfidf_vectorizer.joblib')

try:
    # Carrega os modelos que você treinou
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Modelo de NLP e vetorizador carregados com sucesso!")
except FileNotFoundError:
    print(f"Erro: Arquivos do modelo não encontrados em {saved_models_path}")
    model = None
    vectorizer = None

# --- FUNÇÃO DE LIMPEZA DE TEXTO (DO SEU NOTEBOOK) ---

def clean_text(text):
    """
    Limpa as descrições das transações.
    """
    if not isinstance(text, str):
        return ""
        
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    
    words = text.split()
    stop_words_pt = set(stopwords.words('portuguese'))
    words_without_stopwords = [word for word in words if word not in stop_words_pt]
    
    return ' '.join(words_without_stopwords)

# --- FUNÇÃO PRINCIPAL DE CLASSIFICAÇÃO ---

def classificar_despesas(caminho_do_arquivo_csv):
    """
    Lê um arquivo CSV, classifica as despesas e retorna um resumo.
    """
    if model is None or vectorizer is None:
        raise RuntimeError("O modelo de NLP ou o vetorizador não puderam ser carregados.")

    try:
        # Lê o CSV enviado pelo usuário. Assume que a primeira linha é o cabeçalho.
        df = pd.read_csv(caminho_do_arquivo_csv, encoding='latin1', sep=';')
        
        # Garante que as colunas 'Descricao' e 'Valor' existem
        if 'Descricao' not in df.columns or 'Valor' not in df.columns:
            raise ValueError("O ficheiro CSV deve conter as colunas 'Descricao' e 'Valor'.")

        # Limpa as descrições
        df['Description_Cleaned'] = df['Descricao'].apply(clean_text)

        # Transforma as descrições limpas usando o vetorizador carregado
        descriptions_tfidf = vectorizer.transform(df['Description_Cleaned'])
        
        # Usa o modelo para prever as categorias
        categorias_preditas = model.predict(descriptions_tfidf)
        
        # Adiciona os resultados ao DataFrame
        df['Categoria'] = categorias_preditas

        # Converte a coluna 'Valor' para numérico, tratando vírgulas e erros
        df['Valor'] = df['Valor'].str.replace(',', '.', regex=True)
        df['Valor'] = pd.to_numeric(df['Valor'], errors='coerce')
        df.dropna(subset=['Valor'], inplace=True) # Remove linhas onde o valor não pôde ser convertido

        # Filtra apenas despesas (valores negativos) e torna-os positivos para somar
        despesas_df = df[df['Valor'] < 0].copy()
        despesas_df['Valor'] = despesas_df['Valor'].abs()

        # Agrupa os gastos por categoria e soma os valores
        resumo_gastos = despesas_df.groupby('Categoria')['Valor'].sum().round(2)
        
        # Formata os dados para o gráfico (Chart.js)
        dados_formatados = {
            'labels': resumo_gastos.index.tolist(),
            'data': resumo_gastos.values.tolist()
        }
        
        return dados_formatados

    except Exception as e:
        print(f"Erro ao processar o ficheiro em predictor.py: {e}")
        raise

# NOVA FUNÇÃO PARA PROCESSAR ARQUIVOS PRÉ-CLASSIFICADOS
def processar_pre_classificado(caminho_do_arquivo_csv):
    """
    Lê um arquivo CSV que já contém as colunas 'Categoria' e 'Valor',
    e retorna um resumo formatado para o gráfico.
    """
    try:
        # Lê o CSV enviado pelo usuário.
        df = pd.read_csv(caminho_do_arquivo_csv, encoding='latin1', sep=';')

        # Garante que as colunas 'Categoria' e 'Valor' existem
        if 'Categoria' not in df.columns or 'Valor' not in df.columns:
            raise ValueError("O ficheiro CSV para esta opção deve conter as colunas 'Categoria' e 'Valor'.")

        # Converte a coluna 'Valor' para numérico, tratando vírgulas e erros
        # (Reutilizando a mesma lógica da outra função)
        df['Valor'] = df['Valor'].str.replace(',', '.', regex=True)
        df['Valor'] = pd.to_numeric(df['Valor'], errors='coerce')
        df.dropna(subset=['Valor'], inplace=True)

        # Filtra apenas despesas (valores negativos) e torna-os positivos para somar
        despesas_df = df[df['Valor'] < 0].copy()
        despesas_df['Valor'] = despesas_df['Valor'].abs()

        # Agrupa os gastos por categoria e soma os valores
        resumo_gastos = despesas_df.groupby('Categoria')['Valor'].sum().round(2)

        # Formata os dados para o gráfico (Chart.js), igual à outra função
        dados_formatados = {
            'labels': resumo_gastos.index.tolist(),
            'data': resumo_gastos.values.tolist()
        }
        
        return dados_formatados

    except Exception as e:
        print(f"Erro ao processar o ficheiro pré-classificado em predictor.py: {e}")
        raise