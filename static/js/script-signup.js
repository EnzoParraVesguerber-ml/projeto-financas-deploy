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
    const signupForm = document.getElementById('signup-form');

    if(signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(signupForm);
            const password = formData.get('senha');
            const confirmPassword = formData.get('confirmar_senha');

            if (password !== confirmPassword) {
                createFlashMessage('As senhas não coincidem.', 'danger');
                return;
            }

            const submitButton = signupForm.querySelector('.submit-button');
            submitButton.textContent = 'Cadastrando...';
            submitButton.disabled = true;

            try {
                 const response = await fetch(`${API_URL}/registrar`, {
                    method: 'POST',
                    body: new URLSearchParams(formData), // Envia como form-urlencoded
                });

                const result = await response.json();

                if (response.ok) {
                    // Armazena a mensagem de sucesso para exibir na página de login
                    sessionStorage.setItem('flashMessage', JSON.stringify({
                        message: result.message || 'Conta criada com sucesso! Por favor, faça login.',
                        category: 'success'
                    }));
                    window.location.href = 'login.html';
                } else {
                    createFlashMessage(result.error || 'Ocorreu um erro no cadastro.', 'danger');
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                createFlashMessage('Erro de conexão ao tentar registrar. Tente novamente.', 'danger');
            } finally {
                submitButton.textContent = 'Cadastrar-se';
                submitButton.disabled = false;
            }
        });
    }
});

