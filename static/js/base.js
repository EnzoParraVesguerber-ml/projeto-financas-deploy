document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.querySelector('.menu-container');
    const btnsLog = document.querySelector('.btns-log');

    if (menuContainer) {
        menuContainer.addEventListener('mouseenter', function() {
            if (btnsLog) {
                btnsLog.classList.add('active');
            }
        });

        menuContainer.addEventListener('mouseleave', function() {
            if (btnsLog) {
                btnsLog.classList.remove('active');
            }
        });
    }

    // Adiciona evento de clique para o botão de signup, se existir
    const signupBtn = document.getElementById("signup-btn");
    if (signupBtn) {
        signupBtn.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "/signup";
        });
    }

    // Adiciona evento de clique para o botão de login, se existir
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "/login";
        });
    }

    // Adiciona evento de clique para o botão de logout, se existir
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "/logout";
        });
    }
});