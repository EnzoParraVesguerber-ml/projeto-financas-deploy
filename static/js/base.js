// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DE CONTROLO DE LOGIN/LOGOUT ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');

    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const userInfoDiv = document.querySelector('.user-info');
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById("logout-btn");

    if (isLoggedIn && userName) {
        // Usuário está logado: mostra info do usuário e botão de logout
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (userInfoDiv) userInfoDiv.style.display = 'flex'; // Usa 'flex' como definido no CSS
        if (userNameSpan) userNameSpan.textContent = `Olá, ${userName}`;
    } else {
        // Usuário não está logado: mostra botões de login e signup
        if (loginBtn) loginBtn.style.display = 'block'; // Ou 'inline-block' dependendo do seu CSS
        if (signupBtn) signupBtn.style.display = 'block'; // Ou 'inline-block'
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }
    // --- FIM DA LÓGICA DE CONTROLO ---


    // Seleciona o container do menu e o dropdown
    const menuContainer = document.querySelector('.menu-container');
    const btnsLog = document.querySelector('.btns-log');

    // Se o menu existir, adiciona eventos para mostrar/ocultar o dropdown
    if (menuContainer && btnsLog) { // Garante que ambos existem
        // Evento para Desktop (hover)
        menuContainer.addEventListener('mouseenter', function() {
            btnsLog.classList.add('active'); // Exibe o dropdown
        });
        menuContainer.addEventListener('mouseleave', function() {
            btnsLog.classList.remove('active'); // Oculta o dropdown
        });

        // Evento para Mobile (click/touch no ícone)
        const mobileMenuTrigger = document.getElementById('trigger-box-phone');
        if (mobileMenuTrigger) {
            mobileMenuTrigger.addEventListener('click', function(event) {
                 event.stopPropagation(); // Impede que o clique feche o menu imediatamente
                 btnsLog.classList.toggle('active');
            });
        }

        // Fecha o menu se clicar fora dele (útil no mobile)
        document.addEventListener('click', function(event) {
            if (!menuContainer.contains(event.target) && btnsLog.classList.contains('active')) {
                btnsLog.classList.remove('active');
            }
        });
    }


    // Adiciona evento de clique para o botão de signup, se existir
    if (signupBtn) {
        signupBtn.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "signup.html";
        });
    }

    // Adiciona evento de clique para o botão de login, se existir
    if (loginBtn) {
        loginBtn.addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "login.html";
        });
    }

    // Adiciona evento de clique para o botão de logout, se existir
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault();
            // Limpa dados de "sessão" do frontend e redireciona para a home
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            window.location.href = "index.html";
        });
    }
});