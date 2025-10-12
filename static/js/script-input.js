document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    const fileNameSpan = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-analysis');
    const resultsArea = document.getElementById('analysis-results');
    
    // --- LÓGICA DO SWITCH ---
    const analysisSwitch = document.getElementById('analysis-type-switch');
    const switchLabels = document.querySelectorAll('.switch-label');

    if (analysisSwitch) {
        // Define o estado inicial (desmarcado = 'ai')
        analysisSwitch.checked = false; 
        document.querySelector('.switch-label[data-value="ai"]').classList.add('active');
        document.querySelector('.switch-label[data-value="labeled"]').classList.remove('active');

        analysisSwitch.addEventListener('change', () => {
            // Alterna a classe 'active' nos labels para dar feedback visual
            switchLabels.forEach(label => label.classList.toggle('active'));
        });
    }
    // --- FIM DA LÓGICA DO SWITCH ---

    // Mostra o nome do ficheiro selecionado
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameSpan.textContent = fileInput.files[0].name;
            } else {
                fileNameSpan.textContent = 'Nenhum ficheiro selecionado';
            }
        });
    }

    // Lógica para enviar o ficheiro para o backend
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Por favor, selecione um ficheiro de extrato primeiro!');
                return;
            }

            // NOVO: Verifica se o switch está marcado ('checked') ou não
            // Se estiver marcado, o valor é 'labeled'. Se não, é 'ai'.
            const analysisType = analysisSwitch.checked ? 'labeled' : 'ai';

            const formData = new FormData();
            formData.append('file-upload', fileInput.files[0]);
            formData.append('analysis_type', analysisType); // Envia o tipo de análise

            // Mostra uma mensagem de carregamento
            if(resultsArea) {
                resultsArea.innerHTML = '<h3>Analisando seus dados... Por favor, aguarde.</h3>';
                resultsArea.classList.add('loading');
            }

            try {
                // Faz a chamada "fetch" para a sua rota /upload no Flask
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    // Guarda os resultados e redireciona
                    localStorage.setItem('analysisData', JSON.stringify(result));
                    window.location.href = '/resultados';
                } else {
                    // Mostra erro
                    resultsArea.innerHTML = `<h3>Erro na Análise</h3><p>${result.error || 'Ocorreu um problema desconhecido.'}</p>`;
                }

            } catch (error) {
                // Se houver um erro de rede
                console.error('Erro ao enviar o ficheiro:', error);
                if(resultsArea) {
                    resultsArea.innerHTML = '<h3>Erro de Comunicação</h3><p>Não foi possível conectar ao servidor. Tente novamente.</p>';
                }
            } finally {
                if(resultsArea) {
                    resultsArea.classList.remove('loading');
                }
            }
        });
    }
});