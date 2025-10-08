const menuContainer = document.querySelector('.menu-container');
const btnsLog = document.querySelector('.btns-log');

menuContainer.addEventListener('mouseenter', function() {
    btnsLog.classList.add('active');
});

menuContainer.addEventListener('mouseleave', function() {
    btnsLog.classList.remove('active');
});

document.getElementById("logout-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "C:\\Users\\bruno\\Documents\\Facens\\2° Semestre\\Web Design\\Codigos html\\Projeto Finanças\\pagina inicial\\index.html";
}, false);

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