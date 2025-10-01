// Aguarda o carregamento completo do DOM (Document Object Model)
document.addEventListener('DOMContentLoaded', function() {
    // 1. Seleciona o formulário de login pelo seu elemento 'form' dentro da caixa
    const loginForm = document.querySelector('.login-box form');

    // 2. Adiciona um "ouvinte de evento" (event listener) para a submissão do formulário
    loginForm.addEventListener('submit', function(event) {
        
        // Impede o envio padrão do formulário (que faria a página recarregar)
        event.preventDefault();

        // 3. Seleciona os campos de input
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Pega os valores (o .trim() remove espaços em branco no início/fim)
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // 4. Realiza uma validação simples
        if (email === '' || password === '') {
            // Se algum campo estiver vazio, exibe um erro
            alert('ERROR: Please fill in both the E-mail and Password fields.');
            
            // Você pode adicionar classes de erro CSS aqui:
            // if (email === '') emailInput.classList.add('input-error');

        } else if (password.length < 6) {
            // Exemplo de validação de senha (mínimo de 6 caracteres)
             alert('ERROR: The password must have at least 6 characters.');
             
        } else {
            // Se a validação passar, simula o envio de dados
            console.log('Login attempt successful with data:');
            console.log('Email:', email);
            console.log('Password:', password); // Geralmente, NUNCA exiba a senha real no console em produção!

            // 5. Simula um sucesso e limpa o formulário
            alert('Login successful! Redirecting...');
            loginForm.reset(); // Limpa os campos
            
            // Aqui você faria uma chamada real à API (fetch/XMLHttpRequest) para autenticar no servidor
        }
    });

    // 6. Adiciona interatividade aos botões de navegação
    const loginBtnHeader = document.querySelector('.login-button');
    const signupBtnHeader = document.querySelector('.signup-button');

    loginBtnHeader.addEventListener('click', () => {
        // Exemplo: Simplesmente rola para a caixa de login
        document.querySelector('.login-box').scrollIntoView({ behavior: 'smooth' });
    });

    signupBtnHeader.addEventListener('click', () => {
        alert('Navigating to the Sign Up page!');
        // Aqui você faria um redirecionamento ou mostraria o formulário de cadastro
        // window.location.href = '/signup.html';
    });
});