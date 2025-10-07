const menuContainer = document.querySelector('.menu-container');
const btnsLog = document.querySelector('.btns-log');

menuContainer.addEventListener('mouseenter', function() {
    btnsLog.classList.add('active');
});

menuContainer.addEventListener('mouseleave', function() {
    btnsLog.classList.remove('active');
});

document.getElementById("login-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "C:\\Users\\bruno\\Documents\\Facens\\2° Semestre\\Web Design\\Codigos html\\Projeto Finanças\\pagina de login\\index.html";
}, false);

document.getElementById("signup-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "C:\\Users\\bruno\\Documents\\Facens\\2° Semestre\\Web Design\\Codigos html\\Projeto Finanças\\pagina de signup\\index.html";
}, false);

document.getElementById("start-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "C:\\Users\\bruno\\Documents\\Facens\\2° Semestre\\Web Design\\Codigos html\\Projeto Finanças\\pagina de signup\\index.html";
}, false);

