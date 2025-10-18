// Adiciona um ouvinte de evento ao botão de login.
// Impede o comportamento padrão e redireciona para a página de login.
document.getElementById("login-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "login.html"; // MUDANÇA AQUI
}, false);

// Adiciona um ouvinte de evento ao botão de cadastro.
// Impede o comportamento padrão e redireciona para a página de cadastro.
document.getElementById("signup-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "signup.html"; // MUDANÇA AQUI
}, false);

// Adiciona um ouvinte de evento ao botão de começar.
// impede o comportamento padrão e redireciona para a página de cadastro.
document.getElementById("start-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "signup.html"; // MUDANÇA AQUI
}, false);
