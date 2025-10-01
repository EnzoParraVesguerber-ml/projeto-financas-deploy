document.addEventListener('DOMContentLoaded', function() {
    // 1. Seleciona o formulário de cadastro pelo ID
    const signupForm = document.getElementById('signup-form');
    // 2. Seleciona os campos de senha e confirmação de senha
    const passwordInput = document.getElementById('password-signup');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // 3. Adiciona um "listener" para o evento de SUBMIT do formulário
    signupForm.addEventListener('submit', function(event) {
        // Assume que a validação está ok no início
        let isValid = true;
        
        // --- Validação de Confirmação de Senha ---
        if (passwordInput.value !== confirmPasswordInput.value) {
            isValid = false;
            
            // Impede o envio do formulário
            event.preventDefault(); 
            
            // Adiciona uma mensagem de erro visual (opcional: requer CSS para estilizar o erro)
            alert('Erro: As senhas digitadas não coincidem!'); 

            // Para um feedback melhor, vamos adicionar uma classe de erro
            passwordInput.classList.add('input-error');
            confirmPasswordInput.classList.add('input-error');
            
            // Foca no campo para o usuário corrigir
            passwordInput.focus();
        } else {
            // Remove as classes de erro caso a validação anterior tenha falhado e o usuário corrigiu
            passwordInput.classList.remove('input-error');
            confirmPasswordInput.classList.remove('input-error');
        }


        // --- Ação Final do Formulário ---
        if (isValid) {
            // Este bloco SÓ é executado se isValid for true
            
            // Nota: Como o 'action="#"' está vazio no HTML, o formulário recarregaria a página.
            // Em um ambiente real, você faria aqui uma requisição (fetch/XHR) para enviar os dados ao servidor.
            
            console.log('Formulário validado com sucesso! Dados prontos para envio ao servidor.');
            // event.preventDefault(); // Descomente esta linha para evitar que a página recarregue após o console.log (útil para testes)
            
        } else {
            console.log('Validação falhou. O formulário não será enviado.');
        }
    });
});

// --- Funcionalidade Bônus: Alternar entre Login e Cadastro (Simulação de SPA) ---
// Função para simular a mudança de tela
const loginButton = document.querySelector('.login-button');
const signupButton = document.querySelector('.signup-button');
const signupBox = document.getElementById('signup-box');

// Simplesmente para ilustrar o clique nos botões do header
loginButton.addEventListener('click', function() {
    // Em um ambiente real, você mostraria o formulário de login aqui
    alert('Funcionalidade de Login em desenvolvimento! Voltando para o Cadastro.');
});

signupButton.addEventListener('click', function() {
    // Em um ambiente