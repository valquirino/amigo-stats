// Arquivo de autenticação e solicitação de acesso

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

// Função para verificar se o usuário precisa trocar a senha
function needsPasswordChange() {
    const user = getCurrentUser();
    console.log('Verificando needsPasswordChange:', user);
    return user && user.isChecked === false;
}

// Função para criar e exibir o modal de troca de senha obrigatória
function createPasswordChangeModal() {
    // Remove modal existente se houver
    const existingModal = document.getElementById('password-change-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'password-change-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            width: 100%;
            max-width: 400px;
            margin: 0 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        ">
            <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 8px;
                ">Troca de Senha Obrigatória</h2>
                <p style="color: #6b7280; margin: 0;">Por segurança, você deve alterar sua senha antes de continuar.</p>
            </div>
            
            <form id="mandatory-password-form" style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <label for="current-password-modal" style="
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #374151;
                        margin-bottom: 4px;
                    ">Senha Atual</label>
                    <input type="password" id="current-password-modal" name="current-password" 
                           style="
                               width: 100%;
                               padding: 8px 12px;
                               border: 1px solid #d1d5db;
                               border-radius: 6px;
                               font-size: 14px;
                               box-sizing: border-box;
                           " required>
                </div>
                
                <div>
                    <label for="new-password-modal" style="
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #374151;
                        margin-bottom: 4px;
                    ">Nova Senha</label>
                    <input type="password" id="new-password-modal" name="new-password" 
                           style="
                               width: 100%;
                               padding: 8px 12px;
                               border: 1px solid #d1d5db;
                               border-radius: 6px;
                               font-size: 14px;
                               box-sizing: border-box;
                           " required>
                </div>
                
                <div>
                    <label for="confirm-password-modal" style="
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #374151;
                        margin-bottom: 4px;
                    ">Confirmar Nova Senha</label>
                    <input type="password" id="confirm-password-modal" name="confirm-password" 
                           style="
                               width: 100%;
                               padding: 8px 12px;
                               border: 1px solid #d1d5db;
                               border-radius: 6px;
                               font-size: 14px;
                               box-sizing: border-box;
                           " required>
                </div>
                
                <div style="display: flex; justify-content: flex-end; padding-top: 16px;">
                    <button type="submit" style="
                        padding: 8px 16px;
                        background-color: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                    ">Alterar Senha</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Adicionar event listener para o formulário
    const form = modal.querySelector('#mandatory-password-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password-modal').value.trim();
        const newPassword = document.getElementById('new-password-modal').value.trim();
        const confirmPassword = document.getElementById('confirm-password-modal').value.trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('A nova senha e a confirmação devem ser iguais.');
            return;
        }

        if (newPassword.length < 6) {
            alert('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3333/users/update-password', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    currentPassword: currentPassword, 
                    newPassword: newPassword 
                })
            });

            if (response.ok) {
                // Atualizar o status do usuário no localStorage
                const user = getCurrentUser();
                user.isChecked = true;
                localStorage.setItem('userData', JSON.stringify(user));
                
                alert('Senha alterada com sucesso!');
                modal.remove();
                
                // Recarregar a página para aplicar as mudanças
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Erro ao alterar a senha. Verifique a senha atual.');
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            alert('Erro ao alterar a senha. Tente novamente.');
        }
    });

    // Prevenir fechamento do modal - não permitir que o usuário feche
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Prevenir navegação com teclas
    document.addEventListener('keydown', function preventNavigation(e) {
        if (e.key === 'Escape' || e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Remover o event listener quando o modal for removido
    modal.addEventListener('remove', () => {
        document.removeEventListener('keydown', preventNavigation);
    });
}

// Função para verificar e aplicar a verificação de senha em todas as páginas
function checkPasswordChangeRequirement() {
    // Não verificar na página de login
    if (window.location.pathname.includes('index.html')) {
        return;
    }

    // Verificar se o usuário está logado
    if (!isLoggedIn()) {
        return;
    }

    console.log('Verificando necessidade de troca de senha...');
    const user = getCurrentUser();
    console.log('Dados do usuário:', user);

    if (needsPasswordChange()) {
        console.log('Usuário precisa trocar a senha. Exibindo modal...');
        createPasswordChangeModal();
    } else {
        console.log('Usuário não precisa trocar a senha.');
    }
}

// Função para solicitar acesso
async function requestAccess(email, password) {
    try {
        const response = await fetch('http://localhost:3333/auth/request-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email, 
                password,
                status: 'pending'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true, message: 'Solicitação de acesso enviada com sucesso! Aguarde a aprovação do administrador.' };
        } else {
            return { success: false, message: data.error || 'Erro ao solicitar acesso. Tente novamente.' };
        }
    } catch (error) {
        console.error('Erro ao solicitar acesso:', error);
        return { success: false, message: 'Erro de conexão. Verifique sua internet e tente novamente.' };
    }
}

// Lidar com o envio do formulário de login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const requestAccessBtn = document.getElementById('request-access-btn');
    
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

    // Event listener para o botão "Solicitar acesso"
    if (requestAccessBtn) {
        requestAccessBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validar se os campos estão preenchidos
            if (!email || !password) {
                alert('Por favor, preencha o email e senha antes de solicitar acesso.');
                return;
            }
            
            // Validar formato do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um email válido.');
                return;
            }
            
            // Validar senha (mínimo 6 caracteres)
            if (password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            const result = await requestAccess(email, password);
            
            if (result.success) {
                alert(result.message);
                // Limpar os campos após sucesso
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            } else {
                alert(result.message);
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

    // Verificar se o usuário precisa trocar a senha
    checkPasswordChangeRequirement();
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
            console.log(123, data);

            localStorage.setItem('userData', JSON.stringify({
                ...data.user,
                token: data.access_token,
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

