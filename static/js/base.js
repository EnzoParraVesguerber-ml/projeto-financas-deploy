// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
   // Seleciona o container do menu e os botões de login/logout
    const menuContainer = document.querySelector('.menu-container');
    const btnsLog = document.querySelector('.btns-log');

    // Se o menu existir, adiciona eventos para mostrar/ocultar os botões de login/logout ao passar o mouse
    if (menuContainer) {
        menuContainer.addEventListener('mouseenter', function() {
            if (btnsLog) {
                btnsLog.classList.add('active'); // Exibe os botões
            }
        });

        menuContainer.addEventListener('mouseleave', function() {
            if (btnsLog) {
                btnsLog.classList.remove('active'); // Oculta os botões
            }
        });
    }

    // Adiciona evento de clique para o botão de signup, se existir
    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            window.location.href = "signup.html"; // MUDANÇA AQUI
        });
    }

    // Adiciona evento de clique para o botão de login, se existir
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            window.location.href = "login.html"; // MUDANÇA AQUI
        });
    }

    // Adiciona evento de clique para o botão de logout, se existir
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            // Limpa dados de sessão do frontend e redireciona para a home
            localStorage.removeItem('user_token'); // Exemplo de como limpar sessão
            localStorage.removeItem('user_name');
            window.location.href = "index.html"; // MUDANÇA AQUI
        });
    }
});
