document.addEventListener('DOMContentLoaded', () => {
    const analysisDataJSON = localStorage.getItem('analysisData');
    const goalsDataJSON = localStorage.getItem('goalsData');

    const barChartCanvas = document.getElementById('resultsChart');
    const pieChartCanvas = document.getElementById('goalsChart');
    const comparisonChartCanvas = document.getElementById('comparisonChart');
    const deviationChartCanvas = document.getElementById('deviationChart'); // Canvas para o novo gráfico
    const mainContent = document.querySelector('.dashboard-grid');

    if (analysisDataJSON) {
        const analysisData = JSON.parse(analysisDataJSON);

        if (analysisData && analysisData.labels && analysisData.data) {
            
            let goalsData = {};
            let totalGoals = 0;
            if (goalsDataJSON) {
                goalsData = JSON.parse(goalsDataJSON);
                totalGoals = Object.values(goalsData).reduce((sum, value) => sum + value, 0);
            }

            createBarChart(analysisData, barChartCanvas);

            if (pieChartCanvas) {
                const totalExpenses = analysisData.data.reduce((sum, value) => sum + value, 0);
                createPieChart(totalExpenses, totalGoals, pieChartCanvas);
            }

            if (comparisonChartCanvas) {
                createComparisonBarChart(analysisData, goalsData, comparisonChartCanvas);
            }

            // --- GRÁFICO 4: DESVIO DE METAS (NOVO) ---
            if (deviationChartCanvas) {
                createDeviationChart(analysisData, goalsData, deviationChartCanvas);
            }

            localStorage.removeItem('analysisData');
            localStorage.removeItem('goalsData');

        } else {
            mainContent.innerHTML = '<div class="results-box"><h2>Erro</h2><p>Os dados da análise parecem estar corrompidos.</p></div>';
        }
    } else {
        mainContent.innerHTML = '<div class="results-box"><h2>Nenhum dado para exibir</h2><p><a href="/dashboard">Volte ao painel</a> e envie um extrato.</p></div>';
    }
});

function createBarChart(analysisData, canvasElement) {
    const backgroundColors = [
        'rgba(34, 211, 238, 0.9)', 'rgba(34, 211, 238, 0.8)', 'rgba(34, 211, 238, 0.7)',
        'rgba(34, 211, 238, 0.6)', 'rgba(34, 211, 238, 0.5)', 'rgba(34, 211, 238, 0.4)',
        'rgba(34, 211, 238, 0.3)', 'rgba(34, 211, 238, 0.2)'
    ];
    const data = {
        labels: analysisData.labels,
        datasets: [{
            label: 'Gastos por Categoria',
            data: analysisData.data,
            backgroundColor: backgroundColors,
            borderColor: 'rgb(34, 211, 238)',
            borderWidth: 1,
        }]
    };
    const config = {
        type: 'bar', data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { color: '#cbd5e1' } }, x: { ticks: { color: '#cbd5e1' } } }
        }
    };
    new Chart(canvasElement, config);
}

function createPieChart(totalExpenses, totalGoals, canvasElement) {
    const data = {
        labels: ['Total Gasto', 'Meta de Gastos'],
        datasets: [{
            data: [totalExpenses.toFixed(2), totalGoals.toFixed(2)],
            backgroundColor: ['rgba(239, 68, 68, 0.7)', 'rgba(34, 197, 94, 0.7)'],
            borderColor: ['rgb(239, 68, 68)', 'rgb(34, 197, 94)'],
            borderWidth: 1,
        }]
    };
    const config = {
        type: 'pie', data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { color: '#cbd5e1' } } }
        }
    };
    new Chart(canvasElement, config);
}

function createComparisonBarChart(analysisData, goalsData, canvasElement) {
    const goalMapping = { 'Alimentação': 'goal_alimentacao', 'Casa e Vestuário': 'goal_casa_vestuario', 'Cuidados Pessoais': 'goal_cuidados_pessoais', 'Educação': 'goal_educacao', 'Lazer e Eletrônicos': 'goal_lazer_eletronicos', 'Outros': 'goal_outros', 'Pet': 'goal_pet', 'Saúde': 'goal_saude', 'Serviços e Taxas': 'goal_servicos_taxas', 'Supermercado': 'goal_supermercado', 'Transporte': 'goal_transporte', 'Veículo': 'goal_veiculo' };
    const alignedGoals = analysisData.labels.map(label => goalsData[goalMapping[label]] || 0);
    const data = {
        labels: analysisData.labels,
        datasets: [
            { label: 'Valor Gasto', data: analysisData.data, backgroundColor: 'rgba(239, 68, 68, 0.7)', borderColor: 'rgb(239, 68, 68)', borderWidth: 1 },
            { label: 'Meta de Gasto', data: alignedGoals, backgroundColor: 'rgba(34, 197, 94, 0.7)', borderColor: 'rgb(34, 197, 94)', borderWidth: 1 }
        ]
    };
    const config = {
        type: 'bar', data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { color: '#cbd5e1' } } },
            scales: { y: { beginAtZero: true, ticks: { color: '#cbd5e1' } }, x: { ticks: { color: '#cbd5e1' } } }
        }
    };
    new Chart(canvasElement, config);
}

/**
 * NOVO: Função para criar o gráfico de desvio (sobra ou excesso)
 */
function createDeviationChart(analysisData, goalsData, canvasElement) {
    const goalMapping = { 'Alimentação': 'goal_alimentacao', 'Casa e Vestuário': 'goal_casa_vestuario', 'Cuidados Pessoais': 'goal_cuidados_pessoais', 'Educação': 'goal_educacao', 'Lazer e Eletrônicos': 'goal_lazer_eletronicos', 'Outros': 'goal_outros', 'Pet': 'goal_pet', 'Saúde': 'goal_saude', 'Serviços e Taxas': 'goal_servicos_taxas', 'Supermercado': 'goal_supermercado', 'Transporte': 'goal_transporte', 'Veículo': 'goal_veiculo' };

    const deviationData = analysisData.labels.map((label, index) => {
        const goalKey = goalMapping[label];
        const goalValue = goalsData[goalKey] || 0;
        const expenseValue = analysisData.data[index];
        // Calcula a diferença: positivo se sobrou, negativo se excedeu
        return goalValue - expenseValue;
    });

    // Define a cor de cada barra com base no valor (positivo/negativo)
    const backgroundColors = deviationData.map(value => 
        value >= 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
    );
    const borderColors = deviationData.map(value =>
        value >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
    );

    const data = {
        labels: analysisData.labels,
        datasets: [{
            label: 'Diferença da Meta (R$)',
            data: deviationData,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y', // Transforma em gráfico de barras horizontais
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Legenda não é tão necessária aqui
                }
            },
            scales: {
                y: { ticks: { color: '#cbd5e1' } },
                x: { ticks: { color: '#cbd5e1' } }
            }
        }
    };
    
    new Chart(canvasElement, config);
}