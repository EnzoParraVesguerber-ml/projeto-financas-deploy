const menuContainer = document.querySelector('.menu-container');
const btnsLog = document.querySelector('.btns-log');

menuContainer.addEventListener('mouseenter', function() {
    btnsLog.classList.add('active');
});

menuContainer.addEventListener('mouseleave', function() {
    btnsLog.classList.remove('active');
});

// ALTERADO: Aponta para a rota /login
document.getElementById("login-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/login";
}, false);

// ALTERADO: Aponta para a rota /signup
document.getElementById("signup-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/signup";
}, false);
