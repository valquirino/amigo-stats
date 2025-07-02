
function authFetch(url, options = {}) {
    const token = localStorage.getItem('token')
    const headers = {
      ...options.headers,
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
    return fetch(url, { ...options, headers });
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('user-profile.html')) return;
    
    
    try {
      const resposta = await authFetch('http://localhost:3333/users/profile');

      
        if (!resposta.ok) throw new Error('Erro ao buscar dados do perfil');
        
        const usuario = await resposta.json();
  
      document.getElementById('profile-name').textContent = usuario.name;
      document.getElementById('profile-email').textContent = usuario.email;
      document.getElementById('profile-role').textContent = `Cargo: ${usuario.role}`;
      document.getElementById('name').value = usuario.name;
      document.getElementById('email').value = usuario.email;
      document.getElementById('position').value = usuario.role;
  
      const dataFormatada = new Date(usuario.created_at).toLocaleString('pt-BR');
      document.getElementById('create-login').value = dataFormatada;
  
    } catch (erro) {
      console.error('Erro ao carregar perfil do usuário:', erro);
      alert('Não foi possível carregar os dados do perfil.');
    }
  
    const perfilForm = document.getElementById('profile-form'); 
    perfilForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();      
      
      if (!name || !email) {
        alert('Nome e email são obrigatórios.');
        return;
      }
  
      try {
        const resposta = await authFetch('http://localhost:3333/users/update-profile', {
          method: 'PUT',
          body: JSON.stringify({ name, email })
        });

  
        if (!resposta.ok) throw new Error('Erro ao atualizar perfil');
  
        alert('Perfil atualizado com sucesso!');
      } catch (err) {
        console.error(err);
        alert('Erro ao atualizar o perfil.');
      }
    });
  
    const senhaForm = document.getElementById('password-form');
    senhaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const current = document.getElementById('current-password').value.trim();
      const nova = document.getElementById('new-password').value.trim();
      const confirmacao = document.getElementById('confirm-password').value.trim();
  
      if (!nova || !confirmacao) {
        alert('Os campos de nova senha e confirmação são obrigatórios.');
        return;
      }
  
      if (nova !== confirmacao) {
        alert('A nova senha e a confirmação devem ser iguais.');
        return;
      }
  
      try {
        const resposta = await authFetch('http://localhost:3333/users/update-password', {
          method: 'PUT',
          body: JSON.stringify({ currentPassword: current, newPassword: nova })
        });
  
        if (!resposta.ok) throw new Error('Erro ao alterar a senha');
  
        alert('Senha alterada com sucesso!');
        senhaForm.reset();
      } catch (err) {
        alert('Erro ao alterar a senha.');
      }
    });
  });
  