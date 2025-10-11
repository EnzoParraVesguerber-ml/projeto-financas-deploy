// ALTERADO: Aponta para a rota /logout em vez de um ficheiro local
document.getElementById("logout-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/logout";
}, false);

// O seu código original para o gráfico permanece igual
const labels= ['Casa e Vestuário', 'Veículo', 'Cuidados Pessoais', 'Supermercado', 'Alimentação', 'Educação', 'Saúde', 'Lazer e Eletrônicos', 'Pet', 'Serviços e Taxas', 'Transporte', 'Outros'];
const data = {
    labels: labels,
    datasets: [{
    label: 'Gastos Mensais por Categoria',
    backgroundColor: 'rgba(54, 162, 235, 0.5)', // Cor das barras
    borderColor: 'rgb(54, 162, 235)',         // Cor da borda das barras
    borderWidth: 1,
    data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10], // Os valores de cada barra
 }]
};

// Configurações do gráfico
const config = {
  type: 'bar', // Tipo do gráfico: 'bar' para barras
  data: data,
  options: {
    responsive: true, // Torna o gráfico responsivo
    scales: {
      y: {
        beginAtZero: true // Garante que o eixo Y comece no zero
      }
    }
  }
};

const myChart = document.getElementById('resultsChart');

new Chart(myChart, config);

