// URL da sua API no Render
const API_URL = 'https://projeto-financas-api.onrender.com';

// Função para criar mensagens de alerta
function createFlashMessage(message, category) {
    let container = document.querySelector('.flash-messages-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'flash-messages-container';
        document.querySelector('header.top-box').insertAdjacentElement('afterend', container);
    }
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${category}`;
    alertDiv.innerHTML = `${message}<span class="close-btn" onclick="this.parentElement.style.display='none';">&times;</span>`;
    container.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.style.transition = 'opacity 0.5s ease';
        alertDiv.style.opacity = '0';
        setTimeout(() => alertDiv.remove(), 500);
    }, 7000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Exibe mensagem de sucesso vinda da página de cadastro, se houver
    const flashDataJSON = sessionStorage.getItem('flashMessage');
    if (flashDataJSON) {
        const flashData = JSON.parse(flashDataJSON);
        createFlashMessage(flashData.message, flashData.category);
        sessionStorage.removeItem('flashMessage');
    }

    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const submitButton = loginForm.querySelector('.submit-button');
            submitButton.textContent = 'Entrando...';
            submitButton.disabled = true;

            try {
                const response = await fetch(`${API_URL}/autenticar`, {
                    method: 'POST',
                    body: new URLSearchParams(formData) // Envia como form-urlencoded
                });

                const result = await response.json();

                if (response.ok) {
                    // Armazena informações de login no localStorage para uso em outras páginas
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userName', result.user_name);
                    
                    // Armazena uma mensagem flash para ser exibida no dashboard
                    sessionStorage.setItem('flashMessage', JSON.stringify({
                        message: `Bem-vindo(a) de volta, ${result.user_name}!`,
                        category: 'success'
                    }));

                    window.location.href = 'dashboard.html';
                } else {
                    createFlashMessage(result.error || 'Email ou senha incorretos.', 'danger');
                }
            } catch (error) {
                console.error('Erro de autenticação:', error);
                createFlashMessage('Erro de conexão com o servidor. Tente novamente mais tarde.', 'danger');
            } finally {
                submitButton.textContent = 'Entrar';
                submitButton.disabled = false;
            }
        });
    }
});

