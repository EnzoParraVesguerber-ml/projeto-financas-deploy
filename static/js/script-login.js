// Adiciona evento ao botão de login
// Ao clicar, impede o comportamento padrão do formulário e redireciona para a página de login
document.getElementById("login-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/login";
}, false);

// Adiciona evento ao botão de cadastro
// Ao clicar, impede o comportamento padrão do formulário e redireciona para a página de cadastro
document.getElementById("signup-btn").addEventListener("click", function( event ){
    event.preventDefault();
    window.location.href = "/signup";
}, false);
