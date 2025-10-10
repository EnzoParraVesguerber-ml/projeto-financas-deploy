const menuContainer = document.querySelector('.menu-container');
const btnsLog = document.querySelector('.btns-log');

menuContainer.addEventListener('mouseenter', function() {
    btnsLog.classList.add('active');
});

menuContainer.addEventListener('mouseleave', function() {
    btnsLog.classList.remove('active');
});

// ALTERADO: Aponta para a rota /logout que será criada no Flask
document.getElementById("logout-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/logout";
}, false);

