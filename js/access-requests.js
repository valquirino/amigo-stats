document.addEventListener('DOMContentLoaded', async () => {
  if (!window.location.pathname.includes('access-requests.html')) return;

  const API_BASE_URL = 'http://localhost:3333';
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  const requestsTableBody = document.getElementById('requests-table-body');
  const emptyState = document.getElementById('empty-state');

  async function fetchRequests() {
    try {
      const res = await fetch(`${API_BASE_URL}/access-requests`, { headers });
      if (!res.ok) throw new Error('Erro ao buscar requisições');
      const data = await res.json();
      renderRequests(data);
    } catch (err) {
      renderRequests([]);
      showNotification('Erro ao carregar requisições de acesso', 'error');
    }
  }

  function renderRequests(requests) {
    if (!requestsTableBody || !emptyState) return;
    if (!requests || requests.length === 0) {
      requestsTableBody.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');
    requestsTableBody.innerHTML = requests.map(request => `
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
              <div class="text-sm text-gray-500">${request.phone || ''}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${request.type === 'player' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}">
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
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}">
            ${getStatusText(request.status)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          ${request.status === 'pending' ? `
            <button data-id="${request.id}" class="approve-btn text-green-600 hover:text-green-900 mr-3">
              <i class="fas fa-check"></i>
            </button>
          ` : ''}
          <button data-id="${request.id}" class="delete-btn text-red-600 hover:text-red-900">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    // Adiciona listeners
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-id');
        if (confirm('Tem certeza que deseja aprovar esta requisição?')) {
          await approveRequest(id);
        }
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-id');
        if (confirm('Tem certeza que deseja remover esta requisição? Esta ação não pode ser desfeita.')) {
          await deleteRequest(id);
        }
      });
    });
  }

  async function approveRequest(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/access-requests/${id}/approve`, {
        method: 'PUT', headers
      });
      if (!res.ok) throw new Error('Erro ao aprovar requisição');
      showNotification('Requisição aprovada com sucesso!', 'success');
      fetchRequests();
    } catch (err) {
      showNotification('Erro ao aprovar requisição', 'error');
    }
  }

  async function deleteRequest(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/access-requests/${id}`, {
        method: 'DELETE', headers
      });
      if (!res.ok) throw new Error('Erro ao remover requisição');
      showNotification('Requisição removida com sucesso!', 'success');
      fetchRequests();
    } catch (err) {
      showNotification('Erro ao remover requisição', 'error');
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusText(status) {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
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

  if (refreshBtn) {
    refreshBtn.addEventListener('click', fetchRequests);
  }

  fetchRequests();
});
