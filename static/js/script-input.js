document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    const fileNameSpan = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-analysis');
    const resultsArea = document.getElementById('analysis-results');
    
    // --- LÓGICA DO SWITCH ---
    const analysisSwitch = document.getElementById('analysis-type-switch');
    const switchLabels = document.querySelectorAll('.switch-label');

    if (analysisSwitch) {
        analysisSwitch.checked = false; 
        document.querySelector('.switch-label[data-value="ai"]').classList.add('active');
        document.querySelector('.switch-label[data-value="labeled"]').classList.remove('active');

        analysisSwitch.addEventListener('change', () => {
            switchLabels.forEach(label => label.classList.toggle('active'));
        });
    }
    // --- FIM DA LÓGICA DO SWITCH ---

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameSpan.textContent = fileInput.files[0].name;
            } else {
                fileNameSpan.textContent = 'Nenhum ficheiro selecionado';
            }
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Por favor, selecione um ficheiro de extrato primeiro!');
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
                    // --- LÓGICA DE METAS APRIMORADA ---
                    const goalsData = {};
                    const goalInputs = document.querySelectorAll('#goals-form input[type="number"]');

                    goalInputs.forEach(input => {
                        const name = input.name;
                        const value = parseFloat(input.value);
                        
                        // Guarda o valor apenas se for um número válido e maior que zero
                        if (!isNaN(value) && value > 0) {
                            goalsData[name] = value;
                        }
                    });

                    // IMPORTANTE PARA DEPURAR: Pressione F12 no browser para ver esta mensagem.
                    console.log("Metas que estão a ser guardadas:", goalsData);

                    // Guarda os resultados da análise E o objeto de metas
                    localStorage.setItem('analysisData', JSON.stringify(result));
                    localStorage.setItem('goalsData', JSON.stringify(goalsData)); // Guarda o objeto completo

                    window.location.href = '/resultados';
                } else {
                    resultsArea.innerHTML = `<h3>Erro na Análise</h3><p>${result.error || 'Ocorreu um problema desconhecido.'}</p>`;
                }

            } catch (error) {
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