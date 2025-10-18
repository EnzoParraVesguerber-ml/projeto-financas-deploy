// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o container do menu e os botões/divs relevantes
    const menuContainer = document.querySelector('.menu-container');
    const btnsLog = document.querySelector('.btns-log');
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const userInfoDiv = document.querySelector(".user-info");
    const userNameSpan = document.getElementById("user-name");
    const logoutBtn = document.getElementById("logout-btn");

    // Lógica para exibir menu correto (Logado vs Deslogado)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');

    if (isLoggedIn && userName && userInfoDiv && userNameSpan) {
        // Usuário está logado
        userNameSpan.textContent = `Olá, ${userName}!`;
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        userInfoDiv.style.display = 'flex'; // Mostra nome e botão de logout
    } else {
        // Usuário não está logado
        if (loginBtn) loginBtn.style.display = 'block'; // Ou 'inline-block'
        if (signupBtn) signupBtn.style.display = 'block'; // Ou 'inline-block'
        if (userInfoDiv) userInfoDiv.style.display = 'none'; // Esconde nome e botão de logout
    }

    // Se o menu existir, adiciona eventos para mostrar/ocultar o popup ao passar o mouse
    if (menuContainer && btnsLog) { // Verificação extra para btnsLog
        menuContainer.addEventListener('mouseenter', function() {
            btnsLog.classList.add('active'); // Exibe o popup
        });

        menuContainer.addEventListener('mouseleave', function() {
            btnsLog.classList.remove('active'); // Oculta o popup
        });
    }

    // Adiciona evento de clique para o botão de signup, se existir
    if (signupBtn) {
        signupBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            window.location.href = "signup.html";
        });
    }

    // Adiciona evento de clique para o botão de login, se existir
    if (loginBtn) {
        loginBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            window.location.href = "login.html";
        });
    }

    // Adiciona evento de clique para o botão de logout, se existir
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            // Limpa dados de sessão do frontend e redireciona para a home
            localStorage.removeItem('isLoggedIn'); // Correção: remover isLoggedIn
            localStorage.removeItem('userName');
            // Opcional: Limpar dados da análise se ainda existirem
            localStorage.removeItem('analysisData');
            localStorage.removeItem('goalsData');
            sessionStorage.removeItem('flashMessage'); // Limpa mensagens flash

            window.location.href = "index.html"; // Redireciona para a página inicial
        });
    }
});