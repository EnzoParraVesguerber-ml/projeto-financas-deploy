import pandas as pd
import joblib
import os
import re
from nltk.corpus import stopwords

# Define o caminho para a pasta onde os modelos treinados estão salvos
saved_models_path = os.path.join(os.path.dirname(__file__), 'saved_models')
# Caminhos dos arquivos do modelo e do vetorizador
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

# Mapeamento para corrigir rótulos quebrados vindos do modelo
CORRECTION_MAP = {
    r'Alimenta\x80\x9co': 'Alimentação',
    r'Alimenta\x8√\xdf\x8√\xdf£o': 'Alimentação',
    r'Casa e Vestu\x80\x9 rio': 'Casa e Vestuário',
    r'Casa e Vestu\x8√\xdf°rio': 'Casa e Vestuário',
    r'Educa\x80\x9co': 'Educação',
    r'Educa\x8√\xdf\x8√\xdf£o': 'Educação',
    r'Lazer e Eletr\x80\x9 nicos': 'Lazer e Eletrônicos',
    r'Lazer e Eletr\x8√\xdf¥nicos': 'Lazer e Eletrônicos',
    r'Sa\x80\x9ade': 'Saúde',
    r'Sa\x8√\xdf∫de': 'Saúde',
    r'Servi\x80\x9os e Taxas': 'Serviços e Taxas',
    r'Servi\x8√\xdf\x8√\xdfos e Taxas': 'Serviços e Taxas',
    r'Ve\x80\x9 culo': 'Veículo',
    r'Ve\x8√\xdf≠culo': 'Veículo'
}



def clean_text(text):
    """
    Limpa as descrições das transações.
    """
    if not isinstance(text, str):
        return ""
        
    text = text.lower()  # Converte para minúsculo
    text = re.sub(r'[^a-z\s]', '', text) # Remove caracteres não alfabéticos
    
    words = text.split()
    stop_words_pt = set(stopwords.words('portuguese')) # Stopwords em português
    words_without_stopwords = [word for word in words if word not in stop_words_pt]
    
    return ' '.join(words_without_stopwords) # Retorna texto limpo



def classificar_despesas(caminho_do_arquivo_csv):
    """
    Lê um arquivo CSV, classifica as despesas e retorna um resumo.
    """
    if model is None or vectorizer is None:
        raise RuntimeError("O modelo de NLP ou o vetorizador não puderam ser carregados.")

    try:
        # Lê o CSV enviado pelo usuário.
        df = pd.read_csv(caminho_do_arquivo_csv, encoding='utf-8', sep=';')
        
        # Garante que as colunas 'Descricao' e 'Valor' existem
        if 'Descricao' not in df.columns or 'Valor' not in df.columns:
            raise ValueError("O ficheiro CSV deve conter as colunas 'Descricao' e 'Valor'.")

        # Limpa as descrições
        df['Description_Cleaned'] = df['Descricao'].apply(clean_text)

        # Transforma as descrições limpas usando o vetorizador carregado
        descriptions_tfidf = vectorizer.transform(df['Description_Cleaned'])
        
        # Usa o modelo para prever as categorias (com os rótulos quebrados)
        categorias_preditas_quebradas = model.predict(descriptions_tfidf)
        
        # Corrigimos os rótulos quebrados que vieram do modelo usando o mapa.
        # Usamos .get(label, label) para que, se um rótulo não estiver no mapa, ele seja mantido como está.
        categorias_corrigidas = [CORRECTION_MAP.get(label, label) for label in categorias_preditas_quebradas]

        # Adiciona os resultados JÁ CORRIGIDOS ao DataFrame
        df['Categoria'] = categorias_corrigidas

        # Converte a coluna 'Valor' para numérico, tratando vírgulas e erros
        df['Valor'] = df['Valor'].str.replace(',', '.', regex=True)
        df['Valor'] = pd.to_numeric(df['Valor'], errors='coerce')
        df.dropna(subset=['Valor'], inplace=True) # Remove linhas onde o valor não pôde ser convertido

        # Converte todos os valores para positivos (valor absoluto)
        df['Valor'] = df['Valor'].abs()

        # Agrupa os gastos por categoria e soma os valores
        resumo_gastos = df.groupby('Categoria')['Valor'].sum().round(2)
        
        # Formata os dados para o gráfico (Chart.js)
        dados_formatados = {
            'labels': resumo_gastos.index.tolist(),
            'data': resumo_gastos.values.tolist()
        }
        
        return dados_formatados

    except Exception as e:
        print(f"Erro ao processar o ficheiro em predictor.py: {e}")
        raise

def processar_pre_classificado(caminho_do_arquivo_csv):
    """
    Lê um arquivo CSV que já contém as colunas 'Categoria' e 'Valor',
    e retorna um resumo formatado para o gráfico.
    """
    try:
        # Lê o CSV enviado pelo usuário.
        df = pd.read_csv(caminho_do_arquivo_csv, encoding='utf-8', sep=';')

        # Garante que as colunas 'Categoria' e 'Valor' existem
        if 'Categoria' not in df.columns or 'Valor' not in df.columns:
            raise ValueError("O ficheiro CSV para esta opção deve conter as colunas 'Categoria' e 'Valor'.")

        df['Categoria'] = df['Categoria'].replace(CORRECTION_MAP)

        # Converte a coluna 'Valor' para numérico, tratando vírgulas e erros
        df['Valor'] = df['Valor'].str.replace(',', '.', regex=True)
        df['Valor'] = pd.to_numeric(df['Valor'], errors='coerce')
        df.dropna(subset=['Valor'], inplace=True)

        # Converte todos os valores para positivos (valor absoluto)
        df['Valor'] = df['Valor'].abs()

        # Agrupa os gastos por categoria e soma os valores
        resumo_gastos = df.groupby('Categoria')['Valor'].sum().round(2)

        # Formata os dados para o gráfico (Chart.js)
        dados_formatados = {
            'labels': resumo_gastos.index.tolist(),
            'data': resumo_gastos.values.tolist()
        }
        
        return dados_formatados

    except Exception as e:
        print(f"Erro ao processar o ficheiro pré-classificado em predictor.py: {e}")
        raise