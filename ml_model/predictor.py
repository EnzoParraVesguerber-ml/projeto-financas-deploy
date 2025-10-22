# ml_model/predictor.py
import pandas as pd
import joblib
import os
import re
import nltk
from nltk.corpus import stopwords

# --- (Código NLTK e carregamento de modelo/vetorizador permanece o mesmo) ---
try:
    stopwords.words('portuguese')
except LookupError:
    print("Recurso 'stopwords' do NLTK não encontrado. Baixando...")
    nltk.download('stopwords')
    print("Download concluído.")
    # Recarrega stopwords após o download
    from nltk.corpus import stopwords

saved_models_path = os.path.join(os.path.dirname(__file__), 'saved_models')
MODEL_PATH = os.path.join(saved_models_path, 'classifier_model.joblib')
VECTORIZER_PATH = os.path.join(saved_models_path, 'tfidf_vectorizer.joblib')

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Modelo de NLP e vetorizador carregados com sucesso!")
except FileNotFoundError:
    print(f"Erro: Arquivos do modelo não encontrados em {saved_models_path}")
    model = None
    vectorizer = None

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
# --- (Função clean_text permanece a mesma) ---
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    words = text.split()
    stop_words_pt = set(stopwords.words('portuguese'))
    words_without_stopwords = [word for word in words if word not in stop_words_pt]
    return ' '.join(words_without_stopwords)

# Função auxiliar para ler CSV ou Excel de forma robusta
def ler_arquivo(caminho_arquivo):
    if caminho_arquivo.lower().endswith('.csv'):
        # Tenta detectar o separador e encoding automaticamente para CSV
        try:
            return pd.read_csv(caminho_arquivo, sep=None, engine='python', encoding='utf-8')
        except Exception as e_utf8:
            try:
                # Tenta com outro encoding comum se UTF-8 falhar
                return pd.read_csv(caminho_arquivo, sep=None, engine='python', encoding='latin1')
            except Exception as e_latin1:
                 raise ValueError(f"Não foi possível ler o CSV. Erro UTF-8: {e_utf8}. Erro Latin-1: {e_latin1}")
    elif caminho_arquivo.lower().endswith(('.xlsx', '.xls')):
        # Lê Excel (requer 'openpyxl' ou outro engine instalado)
        try:
            return pd.read_excel(caminho_arquivo, engine='openpyxl') # ou engine='xlrd' para .xls antigos
        except ImportError:
            raise ImportError("Para ler arquivos Excel (.xlsx), instale a biblioteca 'openpyxl'. Use: pip install openpyxl")
        except Exception as e:
            raise ValueError(f"Não foi possível ler o arquivo Excel: {e}")
    else:
        raise ValueError("Formato de arquivo não suportado. Use .csv ou .xlsx.")


def classificar_despesas(caminho_do_arquivo_csv):
    """
    Lê um arquivo (CSV ou Excel), classifica as despesas usando IA
    e retorna um resumo. Verifica se as colunas necessárias existem.
    """
    if model is None or vectorizer is None:
        raise RuntimeError("O modelo de NLP ou o vetorizador não puderam ser carregados.")

    try:
        df = ler_arquivo(caminho_do_arquivo_csv) # Usa a nova função de leitura

        # Normaliza nomes das colunas (minúsculas) para verificação case-insensitive
        colunas_df = {col.lower(): col for col in df.columns}
        colunas_necessarias_ai = {'descricao', 'valor'}
        colunas_presentes = set(colunas_df.keys())

        colunas_faltantes = colunas_necessarias_ai - colunas_presentes
        if colunas_faltantes:
             # Formata os nomes originais para a mensagem de erro
            nomes_originais_faltantes = [nome.capitalize() for nome in colunas_faltantes]
            raise ValueError(f"O ficheiro para análise com IA deve conter as colunas: {', '.join(nomes_originais_faltantes)}. Coluna(s) faltando: {', '.join(nomes_originais_faltantes)}")

        # Obtém os nomes originais das colunas necessárias
        col_descricao_original = colunas_df['descricao']
        col_valor_original = colunas_df['valor']

        # Renomeia temporariamente para o código existente funcionar ou seleciona as colunas
        df_processar = df[[col_descricao_original, col_valor_original]].rename(
            columns={col_descricao_original: 'Descricao', col_valor_original: 'Valor'}
        )

        # --- O restante do processamento continua como antes, usando df_processar ---
        df_processar['Description_Cleaned'] = df_processar['Descricao'].apply(clean_text)
        descriptions_tfidf = vectorizer.transform(df_processar['Description_Cleaned'])
        categorias_preditas_quebradas = model.predict(descriptions_tfidf)
        categorias_corrigidas = [CORRECTION_MAP.get(label, label) for label in categorias_preditas_quebradas]
        df_processar['Categoria'] = categorias_corrigidas

        df_processar['Valor'] = df_processar['Valor'].astype(str).str.replace(',', '.', regex=True)
        df_processar['Valor'] = pd.to_numeric(df_processar['Valor'], errors='coerce')
        df_processar.dropna(subset=['Valor'], inplace=True)
        df_processar['Valor'] = df_processar['Valor'].abs()

        resumo_gastos = df_processar.groupby('Categoria')['Valor'].sum().round(2)

        dados_formatados = {
            'labels': resumo_gastos.index.tolist(),
            'data': resumo_gastos.values.tolist()
        }
        return dados_formatados

    except Exception as e:
        print(f"Erro ao processar o ficheiro em predictor.py (IA): {e}")
        # Re-levanta a exceção para que a view.py possa capturá-la
        raise


def processar_pre_classificado(caminho_do_arquivo_csv):
    """
    Lê um arquivo (CSV ou Excel) que já deve conter 'Categoria' e 'Valor',
    e retorna um resumo formatado para o gráfico. Verifica as colunas.
    """
    try:
        df = ler_arquivo(caminho_do_arquivo_csv) # Usa a nova função de leitura

        # Normaliza nomes das colunas (minúsculas)
        colunas_df = {col.lower(): col for col in df.columns}
        # Nota: 'Descricao' não é estritamente necessária aqui, mas 'Valor' e 'Categoria' são.
        colunas_necessarias_rotulado = {'valor', 'categoria'}
        colunas_presentes = set(colunas_df.keys())

        colunas_faltantes = colunas_necessarias_rotulado - colunas_presentes
        if colunas_faltantes:
             # Formata os nomes originais para a mensagem de erro
            nomes_originais_faltantes = [nome.capitalize() for nome in colunas_faltantes]
            raise ValueError(f"O ficheiro para análise 'Já Rotulado' deve conter as colunas: {', '.join(nomes_originais_faltantes)}. Coluna(s) faltando: {', '.join(nomes_originais_faltantes)}")

        # Obtém os nomes originais das colunas necessárias
        col_categoria_original = colunas_df['categoria']
        col_valor_original = colunas_df['valor']

        # Seleciona apenas as colunas necessárias e renomeia
        df_processar = df[[col_categoria_original, col_valor_original]].rename(
            columns={col_categoria_original: 'Categoria', col_valor_original: 'Valor'}
        )

        # --- O restante do processamento continua como antes, usando df_processar ---
        df_processar['Categoria'] = df_processar['Categoria'].replace(CORRECTION_MAP)
        df_processar['Valor'] = df_processar['Valor'].astype(str).str.replace(',', '.', regex=True)
        df_processar['Valor'] = pd.to_numeric(df_processar['Valor'], errors='coerce')
        df_processar.dropna(subset=['Valor'], inplace=True)
        df_processar['Valor'] = df_processar['Valor'].abs()

        resumo_gastos = df_processar.groupby('Categoria')['Valor'].sum().round(2)

        dados_formatados = {
            'labels': resumo_gastos.index.tolist(),
            'data': resumo_gastos.values.tolist()
        }
        return dados_formatados

    except Exception as e:
        print(f"Erro ao processar o ficheiro pré-classificado em predictor.py: {e}")
        # Re-levanta a exceção
        raise