# JEBY Finanças: Análise Financeira com Machine Learning

![Página de Dashboard do JEBY Finanças](https://i.imgur.com/X1OkbGP.png) ##  Visão Geral do Projeto

**JEBY Finanças** é uma aplicação web interativa de educação financeira projetada para ajudar jovens adultos, estudantes e qualquer pessoa a obter controle sobre suas finanças de forma visual e intuitiva. A plataforma simplifica a análise de despesas ao permitir que usuários façam o upload de seus extratos bancários (em formato `.csv`), recebendo em troca uma análise automática e categorizada de seus gastos.

O coração do projeto é um **classificador inteligente** que utiliza um modelo de Machine Learning (Processamento de Linguagem Natural) para ler a descrição de cada transação e atribuir-lhe uma categoria, transformando dados brutos em insights valiosos.

Este projeto foi desenvolvido como parte da disciplina de Web Design, com o objetivo de aplicar conceitos de Data Science e boas práticas de desenvolvimento web para criar uma ferramenta que não apenas informa, mas também educa o usuário sobre seus próprios hábitos financeiros.

## ✨ Funcionalidades Implementadas

O projeto final entregue inclui um conjunto robusto de funcionalidades que atendem e superam o escopo inicial:

* **F1. Upload e Processamento de Extratos:**
    * Interface para upload de arquivos `.csv` e `.xlsx`.
    * Opção de escolher entre dois modos de análise:
        1.  **Análise com IA:** Para extratos brutos, onde o modelo de NLP classifica cada transação.
        2.  **Análise de Arquivo Rotulado:** Para extratos que já possuem uma coluna de "Categoria".

* **F2. Classificador Inteligente de Despesas:**
    * Um modelo de Machine Learning (Regressão Logística) treinado com `scikit-learn` analisa a descrição das despesas e as classifica automaticamente em 12 categorias pré-definidas.

* **F3. Dashboard Interativo de Resultados:**
    * Após a análise, o usuário é direcionado para um painel visual com **4 gráficos dinâmicos** gerados com `Chart.js`:
        1.  **Gastos por Categoria (Gráfico de Barras):** Visão geral das principais fontes de despesa.
        2.  **Total Gasto vs. Meta Total (Gráfico de Pizza):** Comparativo do total gasto contra a soma das metas definidas.
        3.  **Gasto vs. Meta (Detalhado - Gráfico de Barras Agrupadas):** Comparação lado a lado do valor gasto e da meta para cada categoria.
        4.  **Sobra ou Excesso por Categoria (Gráfico de Barras Horizontais):** Mostra o quão perto ou longe o usuário ficou de atingir suas metas para cada categoria.

* **F4. Sistema de Usuários Completo:**
    * Páginas de **Cadastro** e **Login** seguras.
    * As senhas dos usuários são criptografadas com `Bcrypt` antes de serem salvas no banco de dados.
    * O sistema mantém a sessão do usuário ativa, personalizando a experiência.

* **F6. Definição de Metas e Orçamentos:**
    * Implementação da funcionalidade opcional que permite ao usuário definir limites de gastos mensais para cada uma das 12 categorias. Esses valores são usados para gerar os gráficos comparativos no dashboard de resultados.

* **Funcionalidades Adicionais de Interface e UX:**
    * **Design Responsivo:** A interface se adapta a desktops, tablets e celulares.
    * **Menu Interativo e Dinâmico:** O menu de navegação exibe opções diferentes para usuários logados e deslogados.
    * **Feedback ao Usuário:** O sistema utiliza mensagens "flash" para fornecer feedback sobre ações como login, logout e erros.
    * **Navegação Inteligente:** O link do logo direciona o usuário para o dashboard se ele já estiver logado, ou para a página inicial caso contrário.

## 🚀 Tecnologias Utilizadas (Tech Stack)

A aplicação foi construída com uma clara separação entre Frontend e Backend, utilizando tecnologias modernas e alinhadas com as melhores práticas de mercado.

### **Frontend (Client-Side)**

* **HTML5:** Estrutura semântica das páginas.
* **CSS3:** Estilização customizada, com foco em responsividade (media queries) e uma paleta de cores moderna.
* **JavaScript (ES6+):** Manipulação do DOM, interatividade da página, eventos de clique/upload e comunicação assíncrona (Fetch API) com o backend.
* **Chart.js:** Biblioteca utilizada para a renderização dos gráficos dinâmicos no dashboard de resultados.

### **Backend (Server-Side)**

* **Python 3:** Linguagem principal para toda a lógica do servidor.
* **Flask:** Micro-framework web utilizado para construir a API REST, gerenciar rotas e renderizar os templates.
    * **Flask-SQLAlchemy:** ORM para interação com o banco de dados.
    * **Flask-Bcrypt:** Para a criptografia de senhas.
    * **Flask-WTF:** Para validação de formulários de login e cadastro.
* **Pandas:** Para a manipulação e limpeza dos dados dos arquivos `.csv` enviados.

### **Machine Learning**

* **Scikit-learn:** Utilizada para treinar e utilizar o modelo de Processamento de Linguagem Natural.
    * `TfidfVectorizer`: Para converter o texto das descrições em vetores numéricos.
    * `LogisticRegression`: O algoritmo de classificação utilizado no modelo.
* **Joblib:** Para salvar e carregar os modelos de ML pré-treinados.
* **NLTK:** Para o pré-processamento de texto, como a remoção de stopwords.

### **Banco de Dados**

* **MySQL:** Sistema de gerenciamento de banco de dados relacional utilizado para armazenar os dados dos usuários.

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

### **Pré-requisitos**

* Python 3.8 ou superior
* Um servidor MySQL instalado e em execução
* Git

### **1. Clone o Repositório**

```bash
git clone https://github.com/BrunoLT/Projeto-Finan-as.git
cd Projeto-Finan-as
```

### **2. Crie e Ative um Ambiente Virtual**

É uma boa prática isolar as dependências do projeto.

```bash
# Para Windows
python -m venv venv
.\venv\Scripts\activate

# Para macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### **3. Instale as Dependências**

O projeto utiliza várias bibliotecas Python. Instale todas de uma vez com o comando:

```bash
    pip install -r requirements.txt
```

### **4. Baixe os Recursos do NLTK**

O modelo de NLP precisa da lista de stopwords em português. Execute o seguinte script uma vez:

```bash
python download_nltk.py
```

### **5. Configure e Popule o Banco de Dados**

* Certifique-se de que seu servidor MySQL está rodando.
* Abra o arquivo `prepara_banco.py` e, se necessário, altere as credenciais de conexão do MySQL (usuário e senha) na variável `config`.
* Execute o script para criar o banco de dados, as tabelas e inserir alguns usuários de exemplo:

```bash
python prepara_banco.py
```

### **6. Execute a Aplicação**

Com tudo configurado, inicie o servidor Flask:

```bash
python finan.py
```

A aplicação estará disponível em `http://127.0.0.1:5000` no seu navegador.

## 📊 Análise das Métricas da Disciplina

O projeto foi desenvolvido para atender e exceder as métricas propostas:

| Métrica | Status | Detalhes |
| :--- | :--- | :--- |
| **5+ Páginas Diferentes** | ✅ **Atingido** | O projeto conta com 5 páginas: Inicial, Login, Cadastro, Dashboard de Input e Resultados. |
| **20+ Mídias** | ✅ **Superado** | Foram utilizados mais de 25 ícones SVG para enriquecer a interface e melhorar a usabilidade em todas as páginas. |
| **Páginas Interligadas** | ✅ **Atingido** | A navegação é coesa, com links, botões e redirecionamentos lógicos entre todas as seções da aplicação. |
| **30+ Estilizações** | ✅ **Superado** | Com 6 arquivos CSS distintos, o projeto possui centenas de regras de estilo, criando um design consistente e detalhado. |
| **Site Responsivo** | ✅ **Atingido** | O uso de `media queries` garante que o layout se adapte de forma fluida a desktops, tablets e celulares. |
| **10+ Funcionalidades** | ✅ **Superado** | O projeto implementa mais de 12 funcionalidades, incluindo um sistema completo de usuários, upload de arquivos, análise com IA, definição de metas e geração de 4 tipos de gráficos. |
| **Menu Interativo** | ✅ **Atingido** | O menu de navegação é dinâmico (muda com o status de login) e interativo (efeito `hover`/clique). |

## 🔮 Possíveis Melhorias Futuras

Embora o projeto atual seja robusto, existem várias funcionalidades avançadas que podem ser implementadas no futuro:

* **F5. Comparativo Histórico de Gastos:** Salvar as análises no banco de dados para permitir que o usuário compare a evolução de seus gastos ao longo de diferentes meses.
* **F7. Previsão de Gastos:** Utilizar os dados históricos para treinar um modelo de série temporal e tentar prever os gastos do próximo mês.
* **Feedback Visual de Carregamento:** Adicionar "spinners" ou animações de carregamento durante o processamento do arquivo para melhorar a experiência do usuário.
* **Edição de Transações:** Permitir que o usuário corrija manualmente a categoria de uma transação caso a classificação da IA não seja a ideal.

---
