document.addEventListener('DOMContentLoaded', () => {
    // Pega os dados que foram guardados no localStorage
    const analysisDataJSON = localStorage.getItem('analysisData');
    const goalsDataJSON = localStorage.getItem('goalsData'); // Pega o objeto de metas

    const barChartCanvas = document.getElementById('resultsChart');
    const pieChartCanvas = document.getElementById('goalsChart');
    const mainContent = document.querySelector('.dashboard-grid');

    if (analysisDataJSON) {
        const analysisData = JSON.parse(analysisDataJSON);

        if (analysisData && analysisData.labels && analysisData.data) {
            
            // --- GRÁFICO 1: BARRAS (Gastos por Categoria) ---
            createBarChart(analysisData, barChartCanvas);

            // --- LÓGICA DE METAS APRIMORADA NA PÁGINA DE RESULTADOS ---
            let totalGoals = 0;
            if (goalsDataJSON) {
                const goalsData = JSON.parse(goalsDataJSON);
                
                // IMPORTANTE PARA DEPURAR: Pressione F12 no browser para ver esta mensagem.
                console.log("Metas recebidas na página de resultados:", goalsData);
                
                // Soma os valores de todas as metas recebidas
                totalGoals = Object.values(goalsData).reduce((sum, value) => sum + value, 0);
            }
            console.log("Soma total das metas calculada:", totalGoals);


            // --- GRÁFICO 2: PIZZA (Gastos vs. Metas) ---
            if (pieChartCanvas) {
                // Calcula o total de gastos somando todos os valores do array 'data'
                const totalExpenses = analysisData.data.reduce((sum, value) => sum + value, 0);
                
                // Cria o gráfico de pizza com os valores corretos
                createPieChart(totalExpenses, totalGoals, pieChartCanvas);
            }

            // Limpa os dados do localStorage para não serem usados novamente
            localStorage.removeItem('analysisData');
            localStorage.removeItem('goalsData');

        } else {
            mainContent.innerHTML = '<div class="results-box"><h2>Erro</h2><p>Os dados da análise parecem estar corrompidos. Por favor, tente novamente.</p></div>';
        }
    } else {
        mainContent.innerHTML = '<div class="results-box"><h2>Nenhum dado para exibir</h2><p>Parece que você chegou aqui diretamente. Por favor, <a href="/dashboard">volte ao painel</a> e envie um extrato para ver a análise.</p></div>';
    }
});

/**
 * Função para criar o gráfico de barras (sem alterações)
 */
function createBarChart(analysisData, canvasElement) {
    const backgroundColors = [
        'rgba(34, 211, 238, 0.9)', 'rgba(34, 211, 238, 0.8)',
        'rgba(34, 211, 238, 0.7)', 'rgba(34, 211, 238, 0.6)',
        'rgba(34, 211, 238, 0.5)', 'rgba(34, 211, 238, 0.4)',
        'rgba(34, 211, 238, 0.3)', 'rgba(34, 211, 238, 0.2)'
    ];
    const borderColors = 'rgb(34, 211, 238)';

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

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#cbd5e1' } },
                x: { ticks: { color: '#cbd5e1' } }
            }
        }
    };

    new Chart(canvasElement, config);
}

/**
 * Função para criar o gráfico de pizza (pie chart) (sem alterações)
 */
function createPieChart(totalExpenses, totalGoals, canvasElement) {
    const data = {
        labels: ['Total Gasto', 'Meta de Gastos'],
        datasets: [{
            label: 'Comparação de Gastos vs. Metas',
            backgroundColor: [
                'rgba(239, 68, 68, 0.7)', // Cor para gastos (vermelho)
                'rgba(34, 197, 94, 0.7)'  // Cor para metas (verde)
            ],
            borderColor: [
                'rgb(239, 68, 68)',
                'rgb(34, 197, 94)'
            ],
            borderWidth: 1,
            data: [totalExpenses.toFixed(2), totalGoals.toFixed(2)],
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#cbd5e1'
                    }
                }
            }
        }
    };

    new Chart(canvasElement, config);
}