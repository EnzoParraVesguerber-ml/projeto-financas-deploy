// --- FUNÇÃO AUXILIAR PARA CRIAR MENSAGENS FLASH DINAMICAMENTE ---
function createFlashMessage(message, category) {
    // Procura o container de mensagens que o Flask usa.
    let container = document.querySelector('.flash-messages-container');

    // Se não existir (porque não há mensagens do backend), nós o criamos.
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-messages-container';
        // Insere o container logo após o cabeçalho.
        document.querySelector('header.top-box').insertAdjacentElement('afterend', container);
    }

    // Cria o elemento do alerta.
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${category}`;
    alertDiv.innerHTML = `
        ${message}
        <span class="close-btn" onclick="this.parentElement.style.display='none';">&times;</span>
    `;

    // Adiciona o novo alerta ao container.
    container.appendChild(alertDiv);

    // Faz a mensagem desaparecer após 7 segundos para não poluir a tela.
    setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.5s ease';
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    }, 7000);
}


// --- LÓGICA PRINCIPAL DA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    
    // --- NOVO: Verifica se há uma mensagem de erro guardada para exibir ---
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
    // --- FIM DO NOVO BLOCO ---


    const fileInput = document.getElementById('file-upload');
    const fileNameSpan = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-analysis');
    const resultsArea = document.getElementById('analysis-results');
    
    // Lógica do Switch
    const analysisSwitch = document.getElementById('analysis-type-switch');
    const switchLabels = document.querySelectorAll('.switch-label');

    if (analysisSwitch) {
        analysisSwitch.checked = true; // Inicia com "Já Rotulado" selecionado
        document.querySelector('.switch-label[data-value="ai"]').classList.remove('active');
        document.querySelector('.switch-label[data-value="labeled"]').classList.add('active');

        analysisSwitch.addEventListener('change', () => {
            switchLabels.forEach(label => label.classList.toggle('active'));
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameSpan.textContent = fileInput.files[0].name;
            } else {
                fileNameSpan.textContent = 'Nenhum arquivo selecionado';
            }
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!fileInput.files || fileInput.files.length === 0) {
                // ALTERADO: Usa a nova função de flash message para alerta simples.
                createFlashMessage('Por favor, selecione um arquivo de extrato primeiro!', 'warning');
                return;
            }

            const analysisType = analysisSwitch.checked ? 'labeled' : 'ai';

            const formData = new FormData();
            formData.append('file-upload', fileInput.files[0]);
            formData.append('analysis_type', analysisType); 

            if(resultsArea) {
                resultsArea.innerHTML = '<h3>Analisando seus dados... Por favor, aguarde.</h3>';
                resultsArea.classList.add('loading');
            }

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    // --- Lógica de Metas (sem alteração) ---
                    const goalsData = {};
                    const goalInputs = document.querySelectorAll('#goals-form input[type="number"]');
                    goalInputs.forEach(input => {
                        const name = input.name;
                        const value = parseFloat(input.value);
                        if (!isNaN(value) && value > 0) {
                            goalsData[name] = value;
                        }
                    });

                    localStorage.setItem('analysisData', JSON.stringify(result));
                    localStorage.setItem('goalsData', JSON.stringify(goalsData));
                    window.location.href = '/resultados';

                } else {
                    // --- ALTERAÇÃO PRINCIPAL (ERRO DO SERVIDOR) ---
                    // Em vez de mostrar o erro no meio da página, guarda para o flash e recarrega.
                    sessionStorage.setItem('flashMessage', JSON.stringify({
                        message: result.error || 'Ocorreu um problema desconhecido na análise.',
                        category: 'danger'
                    }));
                    window.location.reload(); // Recarrega a página para mostrar a flash message.
                }

            } catch (error) {
                console.error('Erro ao enviar o arquivo:', error);
                
                // --- ALTERAÇÃO PRINCIPAL (ERRO DE CONEXÃO) ---
                sessionStorage.setItem('flashMessage', JSON.stringify({
                    message: 'Erro de Comunicação: Não foi possível conectar ao servidor. Tente novamente.',
                    category: 'danger'
                }));
                window.location.reload(); // Recarrega a página para mostrar a flash message.

            } finally {
                if(resultsArea) {
                    resultsArea.classList.remove('loading');
                }
            }
        });
    }
});