// Adiciona um ouvinte de evento ao botão de login
// Impede o comportamento padrão do formulário e redireciona para a página de login
document.getElementById("login-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/login";
}, false);

// Adiciona um ouvinte de evento ao botão de cadastro
// Impede o comportamento padrão do formulário e redireciona para a página de cadastro
document.getElementById("signup-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/signup";
}, false);
