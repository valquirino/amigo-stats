import { data } from "autoprefixer";

// Função para verificar se o usuário está logado
function isLoggedIn() {
    const user = getCurrentUser()

    if (!user) return false;
    
    return user.isLoggedIn === true;
}

// Função para fazer logout
function logout() {
    localStorage.removeItem('userData');
    window.location.href = '../index.html';
}

// Recuperar dados do usuário atual
function getCurrentUser() {
    const userData = localStorage.getItem('userData');

    if (!userData) return null;
    
    return JSON.parse(userData);
}

// Lidar com o envio do formulário de login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const success = await login(email, password);
            
            if (success) {
                localStorage.setItem('token', success.access_token)
                window.location.href = 'pages/dashboard.html';
                
            } else {
                alert('Email ou senha incorretos. Tente novamente.');
    
            }
        });
    }
    
    // Redirecionar para a página de login se não estiver logado (exceto na própria página de login)
    if (!isLoggedIn() && !window.location.href.includes('index.html')) {
        window.location.href = '../index.html';
    }
    
    // Configurar o botão de logout, se existir
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

async function login(email, password) {
    try {
        const response = await fetch('http://localhost:3333/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('userData', JSON.stringify({
                ...data.user,
                isLoggedIn: true
            }));

            return data;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Erro ao tentar logar:', error);
        return false;
    }
}

