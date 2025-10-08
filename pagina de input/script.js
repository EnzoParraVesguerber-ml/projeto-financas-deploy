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
