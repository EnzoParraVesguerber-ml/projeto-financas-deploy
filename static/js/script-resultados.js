// Aguarda o carregamento do DOM para executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Recupera dados de análise e metas do localStorage
    const analysisDataJSON = localStorage.getItem('analysisData');
    const goalsDataJSON = localStorage.getItem('goalsData');
    
    // Seleciona os elementos canvas dos gráficos
    const barChartCanvas = document.getElementById('resultsChart');
    const pieChartCanvas = document.getElementById('goalsChart');
    const comparisonChartCanvas = document.getElementById('comparisonChart');
    const deviationChartCanvas = document.getElementById('deviationChart'); // Canvas para o novo gráfico
    const mainContent = document.querySelector('.dashboard-grid');
    
    // Verifica se há dados de análise
    if (analysisDataJSON) {
        const analysisData = JSON.parse(analysisDataJSON);
        
        // Verifica se os dados possuem labels e valores
        if (analysisData && analysisData.labels && analysisData.data) {
            
            let goalsData = {};
            let totalGoals = 0;
            // Se houver dados de metas, calcula o total
            if (goalsDataJSON) {
                goalsData = JSON.parse(goalsDataJSON);
                totalGoals = Object.values(goalsData).reduce((sum, value) => sum + value, 0);
            }
            
            // Cria o gráfico de barras dos gastos por categoria
            createBarChart(analysisData, barChartCanvas);
            
            // Cria o gráfico de pizza comparando gastos totais e metas
            if (pieChartCanvas) {
                const totalExpenses = analysisData.data.reduce((sum, value) => sum + value, 0);
                createPieChart(totalExpenses, totalGoals, pieChartCanvas);
            }
            
            // Cria o gráfico de comparação entre gastos e metas por categoria
            if (comparisonChartCanvas) {
                createComparisonBarChart(analysisData, goalsData, comparisonChartCanvas);
            }

            // Cria o gráfico de desvio entre meta e gasto por categoria
            if (deviationChartCanvas) {
                createDeviationChart(analysisData, goalsData, deviationChartCanvas);
            }
            
            // Limpa os dados do localStorage após uso
            localStorage.removeItem('analysisData');
            localStorage.removeItem('goalsData');

        } else {
            // Exibe mensagem de erro se os dados estiverem corrompidos
            mainContent.innerHTML = '<div class="results-box"><h2>Erro</h2><p>Os dados da análise parecem estar corrompidos.</p></div>';
        }
    } else {
         // Exibe mensagem se não houver dados para mostrar
        mainContent.innerHTML = '<div class="results-box"><h2>Nenhum dado para exibir</h2><p><a href="/dashboard">Volte ao painel</a> e envie um extrato.</p></div>';
    }
});

// Paleta de cores personalizada para os gráficos
const NOVA_PALETA = {
    cyan: 'rgba(34, 211, 238, 0.8)',
    purple: 'rgba(168, 85, 247, 0.8)',
    indigo: 'rgba(99, 102, 241, 0.8)',
    pink: 'rgba(236, 72, 153, 0.8)',
    green: 'rgba(34, 197, 94, 0.8)',
    amber: 'rgba(245, 158, 11, 0.8)',
    blue: 'rgba(59, 130, 246, 0.8)',
    violet: 'rgba(139, 92, 246, 0.8)',
    sky: 'rgba(14, 165, 233, 0.8)',
    fuchsia: 'rgba(217, 70, 239, 0.8)',
    
    cyan_border: 'rgb(34, 211, 238)',
    purple_border: 'rgb(168, 85, 247)',
    indigo_border: 'rgb(99, 102, 241)',
    pink_border: 'rgb(236, 72, 153)',
    green_border: 'rgb(34, 197, 94)',
    amber_border: 'rgb(245, 158, 11)',
    blue_border: 'rgb(59, 130, 246)',
    violet_border: 'rgb(139, 92, 246)',
    sky_border: 'rgb(14, 165, 233)',
    fuchsia_border: 'rgb(217, 70, 239)'
};

// Função para criar gráfico de barras dos gastos por categoria
function createBarChart(analysisData, canvasElement) {
   
    const backgroundColors = [
        NOVA_PALETA.cyan, NOVA_PALETA.purple, NOVA_PALETA.indigo,
        NOVA_PALETA.pink, NOVA_PALETA.green, NOVA_PALETA.amber,
        NOVA_PALETA.blue, NOVA_PALETA.violet, NOVA_PALETA.sky,
        NOVA_PALETA.fuchsia
    ];
    const borderColors = [
        NOVA_PALETA.cyan_border, NOVA_PALETA.purple_border, NOVA_PALETA.indigo_border,
        NOVA_PALETA.pink_border, NOVA_PALETA.green_border, NOVA_PALETA.amber_border,
        NOVA_PALETA.blue_border, NOVA_PALETA.violet_border, NOVA_PALETA.sky_border,
        NOVA_PALETA.fuchsia_border
    ];
    // Dados do gráfico
    const data = {
        labels: analysisData.labels,
        datasets: [{
            label: 'Gastos por Categoria',
            data: analysisData.data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
        }]
    };
    // Configuração do gráfico
    const config = {
        type: 'bar', data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { color: '#cbd5e1' } }, x: { ticks: { color: '#cbd5e1' } } }
        }
    };
    // Renderiza o gráfico
    new Chart(canvasElement, config);
}

// Função para criar gráfico de pizza comparando total gasto e meta
function createPieChart(totalExpenses, totalGoals, canvasElement) {
    // Dados do gráfico
    const data = {
        labels: ['Total Gasto', 'Meta de Gastos'],
        datasets: [{
            data: [totalExpenses.toFixed(2), totalGoals.toFixed(2)],
            
            backgroundColor: [NOVA_PALETA.amber, NOVA_PALETA.blue],
            borderColor: [NOVA_PALETA.amber_border, NOVA_PALETA.blue_border],
            borderWidth: 1,
        }]
    };
    // Configuração do gráfico
    const config = {
        type: 'pie', data: data,
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'top', labels: { color: '#cbd5e1' } } }
        }
    };
    // Renderiza o gráfico
    new Chart(canvasElement, config);
}

// Função para criar gráfico de barras comparando gastos e metas por categoria
function createComparisonBarChart(analysisData, goalsData, canvasElement) {
    // Mapeamento dos nomes das categorias para as chaves das metas
    const goalMapping = { 'Alimentação': 'goal_alimentacao', 'Casa e Vestuário': 'goal_casa_vestuario', 'Cuidados Pessoais': 'goal_cuidados_pessoais', 'Educação': 'goal_educacao', 'Lazer e Eletrônicos': 'goal_lazer_eletronicos', 'Outros': 'goal_outros', 'Pet': 'goal_pet', 'Saúde': 'goal_saude', 'Serviços e Taxas': 'goal_servicos_taxas', 'Supermercado': 'goal_supermercado', 'Transporte': 'goal_transporte', 'Veículo': 'goal_veiculo' };
    // Alinha os valores das metas com as categorias
    const alignedGoals = analysisData.labels.map(label => goalsData[goalMapping[label]] || 0);
    const data = {
        labels: analysisData.labels,
        datasets: [
            
            { label: 'Valor Gasto', data: analysisData.data, backgroundColor: NOVA_PALETA.pink, borderColor: NOVA_PALETA.pink_border, borderWidth: 1 },
            { label: 'Meta de Gasto', data: alignedGoals, backgroundColor: NOVA_PALETA.green, borderColor: NOVA_PALETA.green_border, borderWidth: 1 }
        ]
    };
    // Configuração do gráfico
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

// Função para criar gráfico de barras horizontais mostrando o desvio entre meta e gasto
function createDeviationChart(analysisData, goalsData, canvasElement) {
    // Mapeamento das categorias para as chaves das metas
    const goalMapping = { 'Alimentação': 'goal_alimentacao', 'Casa e Vestuário': 'goal_casa_vestuario', 'Cuidados Pessoais': 'goal_cuidados_pessoais', 'Educação': 'goal_educacao', 'Lazer e Eletrônicos': 'goal_lazer_eletronicos', 'Outros': 'goal_outros', 'Pet': 'goal_pet', 'Saúde': 'goal_saude', 'Serviços e Taxas': 'goal_servicos_taxas', 'Supermercado': 'goal_supermercado', 'Transporte': 'goal_transporte', 'Veículo': 'goal_veiculo' };
    
    // Calcula o desvio (meta - gasto) para cada categoria
    const deviationData = analysisData.labels.map((label, index) => {
        const goalKey = goalMapping[label];
        const goalValue = goalsData[goalKey] || 0;
        const expenseValue = analysisData.data[index];
        return goalValue - expenseValue;
    });
    
    // Define cores conforme o desvio (positivo ou negativo)
    const backgroundColors = deviationData.map(value => 
        value >= 0 ? NOVA_PALETA.green : NOVA_PALETA.pink
    );
    const borderColors = deviationData.map(value =>
        value >= 0 ? NOVA_PALETA.green_border : NOVA_PALETA.pink_border
    );
    // Dados do gráfico
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
    // Configuração do gráfico (horizontal)
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y', 
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: { ticks: { color: '#cbd5e1' } },
                x: { ticks: { color: '#cbd5e1' } }
            }
        }
    };
    // Renderiza o gráfico
    new Chart(canvasElement, config);
}