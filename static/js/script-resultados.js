document.addEventListener('DOMContentLoaded', () => {
    // 1. Pega os dados que foram guardados no localStorage na página anterior
    const analysisDataJSON = localStorage.getItem('analysisData');
    const resultsArea = document.getElementById('results');
    const chartCanvas = document.getElementById('resultsChart');

    if (analysisDataJSON) {
        // 2. Transforma a string JSON de volta em um objeto JavaScript
        const analysisData = JSON.parse(analysisDataJSON);

        // 3. Verifica se os dados necessários (labels e data) existem
        if (analysisData && analysisData.labels && analysisData.data) {
            
            // PALETA DE CORES MONOCROMÁTICA BASEADA NO CIANO DO SITE
            const backgroundColors = [
                'rgba(34, 211, 238, 0.9)',
                'rgba(34, 211, 238, 0.8)',
                'rgba(34, 211, 238, 0.7)',
                'rgba(34, 211, 238, 0.6)',
                'rgba(34, 211, 238, 0.5)',
                'rgba(34, 211, 238, 0.4)',
                'rgba(34, 211, 238, 0.3)',
                'rgba(34, 211, 238, 0.2)',
                'rgba(34, 211, 238, 0.5)',
                'rgba(34, 211, 238, 0.4)',
                'rgba(34, 211, 238, 0.3)',
                'rgba(34, 211, 238, 0.2)'
            ];

            const borderColors = [
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)',
                'rgb(34, 211, 238)'
            ];

            // 4. Configura os dados do gráfico com as informações recebidas
            const data = {
                labels: analysisData.labels,
                datasets: [{
                    label: 'Gastos por Categoria',
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    data: analysisData.data,
                }]
            };

            // 5. Configurações visuais do gráfico
            const config = {
                type: 'bar', // Tipo de gráfico (pode ser 'pie', 'doughnut', etc.)
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false // Esconde a legenda para um visual mais limpo
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                color: '#cbd5e1' // Cor do texto do eixo Y
                            }
                        },
                        x: {
                            ticks: {
                                color: '#cbd5e1' // Cor do texto do eixo X
                            }
                        }
                    }
                }
            };

            // 6. Cria o gráfico no elemento <canvas>
            new Chart(chartCanvas, config);

            // 7. (Opcional, mas recomendado) Limpa os dados do localStorage
            // para não serem usados novamente por engano.
            localStorage.removeItem('analysisData');

        } else {
            // Se os dados estiverem mal formatados
            resultsArea.innerHTML = '<h2>Erro</h2><p>Os dados da análise parecem estar corrompidos. Por favor, tente novamente.</p>';
        }
    } else {
        // 8. Se não houver dados no localStorage, mostra uma mensagem ao utilizador
        resultsArea.innerHTML = '<h2>Nenhum dado para exibir</h2><p>Parece que você chegou aqui diretamente. Por favor, <a href="/dashboard">volte ao painel</a> e envie um extrato para ver a análise.</p>';
    }
});