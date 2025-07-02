// Dados mockados para demonstração
let mockRequests = [
    {
        id: 1,
        name: "João Silva",
        email: "joao.silva@email.com",
        type: "player",
        status: "pending",
        date: "2024-01-15",
        phone: "(11) 99999-9999",
        reason: "Quero participar dos campeonatos locais"
    },
    {
        id: 2,
        name: "Maria Santos",
        email: "maria.santos@email.com",
        type: "club",
        status: "pending",
        date: "2024-01-14",
        phone: "(11) 88888-8888",
        reason: "Novo clube na região"
    },
    {
        id: 3,
        name: "Pedro Costa",
        email: "pedro.costa@email.com",
        type: "player",
        status: "approved",
        date: "2024-01-10",
        phone: "(11) 77777-7777",
        reason: "Jogador experiente buscando novos desafios"
    }
];

let currentRequests = [...mockRequests];

// Elementos DOM
const requestsTableBody = document.getElementById('requests-table-body');
const emptyState = document.getElementById('empty-state');
const loadingState = document.getElementById('loading-state');
const refreshBtn = document.getElementById('refresh-btn');

// Contadores
const pendingCount = document.getElementById('pending-count');
const approvedCount = document.getElementById('approved-count');
const rejectedCount = document.getElementById('rejected-count');
const totalCount = document.getElementById('total-count');

// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadRequests();
});

function setupEventListeners() {
    // Botão de atualizar
    refreshBtn.addEventListener('click', loadRequests);

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
        });
    }

    // Logout/Login
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
}

// Função para fazer requisições simples
async function makeRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// 1. Fetch para listar requisições de acesso
async function fetchAccessRequests() {
    try {
        showLoading(true);
        
        // Simular chamada da API - substitua pela URL real da sua API
        // const response = await makeRequest(`${API_BASE_URL}/access-requests`);
        
        // Por enquanto, usando dados mockados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = {
            success: true,
            data: mockRequests
        };
        
        if (response.success) {
            currentRequests = [...response.data];
            updateStatistics();
            renderRequests();
        } else {
            throw new Error('Erro ao carregar requisições');
        }
        
    } catch (error) {
        console.error('Erro ao carregar requisições:', error);
        showNotification('Erro ao carregar requisições de acesso', 'error');
    } finally {
        showLoading(false);
    }
}

// 2. Fetch para aprovar requisição
async function fetchApproveRequest(requestId) {
    try {
        // Simular chamada da API - substitua pela URL real da sua API
        // const response = await makeRequest(`${API_BASE_URL}/access-requests/${requestId}/approve`, {
        //     method: 'PUT'
        // });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = {
            success: true,
            message: 'Requisição aprovada com sucesso'
        };
        
        if (response.success) {
            const request = mockRequests.find(r => r.id === requestId);
            if (request) {
                request.status = 'approved';
                currentRequests = [...mockRequests];
                updateStatistics();
                renderRequests();
                showNotification(response.message, 'success');
            }
        } else {
            throw new Error('Erro ao aprovar requisição');
        }
        
    } catch (error) {
        console.error('Erro ao aprovar requisição:', error);
        showNotification('Erro ao aprovar requisição', 'error');
    }
}

// 3. Fetch para remover requisição
async function fetchDeleteRequest(requestId) {
    try {
        // Simular chamada da API - substitua pela URL real da sua API
        // const response = await makeRequest(`${API_BASE_URL}/access-requests/${requestId}`, {
        //     method: 'DELETE'
        // });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = {
            success: true,
            message: 'Requisição removida com sucesso'
        };
        
        if (response.success) {
            mockRequests = mockRequests.filter(r => r.id !== requestId);
            currentRequests = [...mockRequests];
            updateStatistics();
            renderRequests();
            showNotification(response.message, 'success');
        } else {
            throw new Error('Erro ao remover requisição');
        }
        
    } catch (error) {
        console.error('Erro ao remover requisição:', error);
        showNotification('Erro ao remover requisição', 'error');
    }
}

function loadRequests() {
    fetchAccessRequests();
}

function updateStatistics() {
    const pending = mockRequests.filter(r => r.status === 'pending').length;
    const approved = mockRequests.filter(r => r.status === 'approved').length;
    const rejected = mockRequests.filter(r => r.status === 'rejected').length;
    const total = mockRequests.length;

    pendingCount.textContent = pending;
    approvedCount.textContent = approved;
    rejectedCount.textContent = rejected;
    totalCount.textContent = total;
}

function renderRequests() {
    if (currentRequests.length === 0) {
        requestsTableBody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    
    requestsTableBody.innerHTML = currentRequests.map(request => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <i class="fas fa-${request.type === 'player' ? 'user' : 'shield-alt'}"></i>
                        </div>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${request.name}</div>
                        <div class="text-sm text-gray-500">${request.phone}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.type === 'player' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                }">
                    ${request.type === 'player' ? 'Jogador' : 'Clube'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${request.email}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(request.date)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getStatusBadgeClass(request.status)
                }">
                    ${getStatusText(request.status)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                ${request.status === 'pending' ? `
                    <button onclick="approveRequest(${request.id})" class="text-green-600 hover:text-green-900 mr-3">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ''}
                <button onclick="deleteRequest(${request.id})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'approved':
            return 'bg-green-100 text-green-800';
        case 'rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'Pendente';
        case 'approved':
            return 'Aprovado';
        case 'rejected':
            return 'Rejeitado';
        default:
            return 'Desconhecido';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function showLoading(show) {
    if (show) {
        loadingState.classList.remove('hidden');
        requestsTableBody.innerHTML = '';
        emptyState.classList.add('hidden');
    } else {
        loadingState.classList.add('hidden');
    }
}

function approveRequest(requestId) {
    if (confirm('Tem certeza que deseja aprovar esta requisição?')) {
        fetchApproveRequest(requestId);
    }
}

function deleteRequest(requestId) {
    if (confirm('Tem certeza que deseja remover esta requisição? Esta ação não pode ser desfeita.')) {
        fetchDeleteRequest(requestId);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Funções globais para uso nos botões inline
window.approveRequest = approveRequest;
window.deleteRequest = deleteRequest;
