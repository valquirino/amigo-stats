// Função para gerenciar o menu principal
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            sidebar.classList.toggle('md:block');
        });
    }
    
    // Gerenciar seleção de item atual no menu
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const currentPath = window.location.pathname;
    
    sidebarItems.forEach(item => {
        const link = item.getAttribute('href');
        if (currentPath.includes(link)) {
            item.classList.add('bg-primary', 'text-white');
        } else {
            item.classList.remove('bg-primary', 'text-white');
        }
        
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => {
                i.classList.remove('bg-primary', 'text-white');
            });
            this.classList.add('bg-primary', 'text-white');
        });
    });
}

// Função para carregar dados do usuário no cabeçalho
function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || null;
    const userNameElement = document.getElementById('user-name');
    const userRoleElement = document.getElementById('user-role');
    
    if (user && userNameElement) {
        userNameElement.textContent = user.name;
    }
    
    if (user && userRoleElement) {
        userRoleElement.textContent = user.role === 'admin' ? 'Administrador' : 'Usuário';
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    loadUserInfo();
}); 