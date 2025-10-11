document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-upload');
    const fileNameSpan = document.getElementById('file-name');
    const generateBtn = document.getElementById('generate-analysis-btn'); // Corrigido para corresponder ao ID no seu HTML
    const resultsArea = document.getElementById('analysis-results');

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

            const formData = new FormData();
            formData.append('file-upload', fileInput.files[0]);

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
                    // Se a análise foi bem-sucedida:
                    // 1. Guarda os resultados no armazenamento local do navegador
                    localStorage.setItem('analysisData', JSON.stringify(result));
                    
                    // 2. Redireciona para a página de resultados
                    window.location.href = '/resultados';

                } else {
                    // Se o backend retornou um erro
                    resultsArea.innerHTML = `<h3>Erro na Análise</h3><p>${result.error || 'Ocorreu um problema desconhecido.'}</p>`;
                }

            } catch (error) {
                // Se houver um erro de rede ou na comunicação
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

