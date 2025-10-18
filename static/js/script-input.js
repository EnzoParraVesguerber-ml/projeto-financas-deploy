// URL da sua API no Render
const API_URL = 'https://projeto-financas-api.onrender.com';

// Esta função cria e exibe mensagens de alerta (flash messages) na interface.
function createFlashMessage(message, category) {
    let container = document.querySelector('.flash-messages-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-messages-container';
        document.querySelector('header.top-box').insertAdjacentElement('afterend', container);
    }
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${category}`;
    alertDiv.innerHTML = `${message}<span class="close-btn" onclick="this.parentElement.style.display='none';">&times;</span>`;
    container.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.5s ease';
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    }, 7000);
}

// Executa quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // Recupera mensagem flash da sessão, se existir.
    const flashDataJSON = sessionStorage.getItem('flashMessage');
    if (flashDataJSON) {
        try {
            const flashData = JSON.parse(flashDataJSON);
            createFlashMessage(flashData.message, flashData.category);
        } catch (e) {
            console.error("Erro ao ler a mensagem flash da sessão:", e);
        }
        // Limpa a mensagem para que ela não apareça novamente se o usuário recarregar a página.
        sessionStorage.removeItem('flashMessage');
    }

    // Seletores dos elementos principais da interface
    const fileInput = document.getElementById('file-upload');
    const fileNameSpan = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-analysis');
    const resultsArea = document.getElementById('analysis-results');

    // Lógica do Switch
    const analysisSwitch = document.getElementById('analysis-type-switch');
    const switchLabels = document.querySelectorAll('.switch-label');

    if (analysisSwitch) {
        // Garante que "Usar IA" seja o padrão ao carregar a página
        analysisSwitch.checked = false;
        document.querySelector('.switch-label[data-value="ai"]').classList.add('active');
        document.querySelector('.switch-label[data-value="labeled"]').classList.remove('active');

        analysisSwitch.addEventListener('change', () => {
            switchLabels.forEach(label => label.classList.toggle('active'));
        });
    }

    // Atualiza o nome do arquivo selecionado
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameSpan.textContent = fileInput.files[0].name;
            } else {
                fileNameSpan.textContent = 'Nenhum arquivo selecionado';
            }
        });
    }

    // Lógica do botão de gerar análise
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            // Verifica se um arquivo foi selecionado
            if (!fileInput.files || fileInput.files.length === 0) {
                createFlashMessage('Por favor, selecione um arquivo de extrato primeiro!', 'warning');
                return;
            }
            // Define o tipo de análise conforme o switch
            const analysisType = analysisSwitch.checked ? 'labeled' : 'ai';

            // Prepara os dados do formulário para envio
            const formData = new FormData();
            formData.append('file-upload', fileInput.files[0]);
            formData.append('analysis_type', analysisType);

            // Exibe mensagem de carregando na área de resultados
            if(resultsArea) {
                resultsArea.innerHTML = '<h3>Analisando seus dados... Por favor, aguarde.</h3>';
                resultsArea.classList.add('loading');
            }

            try {
                // Envia o arquivo para o backend via fetch, apontando para a API no Render
                const response = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                // Recebe o resultado da análise.
                const result = await response.json();

                if (response.ok) {
                    // Lógica para salvar metas definidas pelo usuário
                    const goalsData = {};
                    const goalInputs = document.querySelectorAll('#goals-form input[type="number"]');
                    goalInputs.forEach(input => {
                        const name = input.name;
                        const value = parseFloat(input.value);
                        if (!isNaN(value) && value > 0) {
                            goalsData[name] = value;
                        }
                    });

                    // Salva dados da análise e metas no localStorage.
                    localStorage.setItem('analysisData', JSON.stringify(result));
                    localStorage.setItem('goalsData', JSON.stringify(goalsData));
                    // Redireciona para página de resultados estática
                    window.location.href = 'resultados.html';

                } else {
                    // Em caso de erro, cria a mensagem flash diretamente na página atual
                    createFlashMessage(result.error || 'Ocorreu um problema desconhecido na análise.', 'danger');
                    if(resultsArea) {
                        resultsArea.innerHTML = ''; // Limpa a área de "carregando"
                    }
                }

            } catch (error) {
                // Erro de comunicação com o servidor
                console.error('Erro ao enviar o arquivo:', error);
                createFlashMessage('Erro de Comunicação: Não foi possível conectar ao servidor. Tente novamente.', 'danger');
                 if(resultsArea) {
                    resultsArea.innerHTML = ''; // Limpa a área de "carregando"
                }

            } finally {
                // Remove estado de carregando da área de resultados
                if(resultsArea) {
                    resultsArea.classList.remove('loading');
                }
            }
        });
    }
});

