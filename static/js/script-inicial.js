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

// ALTERADO: Aponta para a rota /signup
document.getElementById("start-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/signup";
}, false);
