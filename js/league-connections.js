document.addEventListener("DOMContentLoaded", async () => {
  const isLeagueConnectionsPage = window.location.pathname.includes("league-connections.html");
  const isLeagueRegisterPage = window.location.pathname.includes("league-register.html");
  
  if (!isLeagueConnectionsPage && !isLeagueRegisterPage) return;

  const user = JSON.parse(localStorage.getItem("userData"));  

  if (user?.role === "user") {
    const access_requests_sidebar = document.getElementById("access-requests");
    if (access_requests_sidebar) {
      access_requests_sidebar.remove();
    }
  }

  const API_BASE_URL = "http://localhost:3333";
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  // Elementos do DOM - Página de listagem
  const connectionsTableBody = document.getElementById("connections-table-body");
  const emptyState = document.getElementById("empty-state");
  const emptyStateNewBtn = document.getElementById("empty-state-new-btn");
  
  // Elementos do DOM para ligas - Página de listagem
  const leaguesTableBody = document.getElementById("leagues-table-body");
  const leaguesEmptyState = document.getElementById("leagues-empty-state");
  const leaguesEmptyStateNewBtn = document.getElementById("leagues-empty-state-new-btn");
  
  // Elementos do DOM - Página de registro
  const leagueForm = document.getElementById("league-form");
  const connectionForm = document.getElementById("connection-form");
  
  // Filtros
  const clubFilter = document.getElementById("club-filter");
  const leagueFilter = document.getElementById("league-filter");
  const yearFilter = document.getElementById("year-filter");
  const searchFilters = document.getElementById("search-filters");
  
  // Selects do formulário
  const clubSelect = document.getElementById("club-select");
  const leagueSelect = document.getElementById("league-select");

  // Fetch clubs for dropdowns
  async function fetchClubs() {
    try {
      const res = await fetch(`${API_BASE_URL}/clubs/list`, { headers });
      if (!res.ok) throw new Error("Erro ao buscar clubes");
      const clubs = await res.json();
      
      // Populate club selects
      const clubSelects = [clubSelect, clubFilter];
      clubSelects.forEach(select => {
        select.innerHTML = '<option value="">Selecione um clube</option>';
        clubs.forEach(club => {
          const option = document.createElement('option');
          option.value = club.id;
          option.textContent = club.name;
          select.appendChild(option);
        });
      });
      
      return clubs;
    } catch (err) {
      showNotification("Erro ao carregar clubes", "error");
      return [];
    }
  }

  // Fetch leagues for dropdowns
  async function fetchLeagues() {
    try {
      const res = await fetch(`${API_BASE_URL}/leagues`, { headers });
      if (!res.ok) throw new Error("Erro ao buscar ligas");
      const leagues = await res.json();
      
      // Populate league selects
      const leagueSelects = [leagueSelect, leagueFilter];
      leagueSelects.forEach(select => {
        select.innerHTML = '<option value="">Selecione uma liga</option>';
        leagues.forEach(league => {
          const option = document.createElement('option');
          option.value = league.id;
          option.textContent = league.name;
          select.appendChild(option);
        });
      });
      
      return leagues;
    } catch (err) {
      showNotification("Erro ao carregar ligas", "error");
      return [];
    }
  }

  // Fetch leagues
  async function fetchLeaguesList() {
    try {
      const res = await fetch(`${API_BASE_URL}/leagues`, { headers });
      if (!res.ok) throw new Error("Erro ao buscar ligas");
      const leagues = await res.json();
      renderLeagues(leagues);
    } catch (err) {
      renderLeagues([]);
      showNotification("Erro ao carregar ligas", "error");
    }
  }

  // Fetch league connections
  async function fetchConnections() {
    try {
      const res = await fetch(`${API_BASE_URL}/league-club-conciliations`, { headers });
      if (!res.ok) throw new Error("Erro ao buscar ligações");
      const connections = await res.json();

      console.log('dsdsdsdds', connections)

      renderConnections(connections);
    } catch (err) {
      renderConnections([]);
      showNotification("Erro ao carregar ligações", "error");
    }
  }

  // Render leagues table
  function renderLeagues(leagues) {
    if (!leaguesTableBody || !leaguesEmptyState) return;
    
    if (!leagues || leagues.length === 0) {
      leaguesTableBody.innerHTML = "";
      leaguesEmptyState.classList.remove("hidden");
      return;
    }
    
    leaguesEmptyState.classList.add("hidden");
    leaguesTableBody.innerHTML = leagues
      .map(
        (league) => `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <i class="fas fa-trophy"></i>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${league.name}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${league.teamsCount}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${league.gamesCount}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${formatDate(league.createdAt)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button data-id="${league.id}" class="delete-league-btn text-red-600 hover:text-red-900">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `
      )
      .join("");

    // Add delete listeners for leagues
    document.querySelectorAll(".delete-league-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = btn.getAttribute("data-id");
        if (confirm("Tem certeza que deseja remover esta liga? Esta ação não pode ser desfeita.")) {
          await deleteLeague(id);
        }
      });
    });
  }

  // Render connections table
  async function renderConnections(connections) {
    if (!connectionsTableBody || !emptyState) return;
  
    if (!connections || connections.length === 0) {
      connectionsTableBody.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }
  
    emptyState.classList.add("hidden");
  
    const tableRows = await Promise.all(
      connections.map(async (connection) => {
        const clubRes = await fetch(`${API_BASE_URL}/clubs/${connection.clubId}`, { headers });
        const club = await clubRes.json();
  
        const leagueRes = await fetch(`${API_BASE_URL}/leagues/${connection.leagueId}`, { headers });
        const league = await leagueRes.json();
  
        return `
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <i class="fas fa-shield-alt"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">${club.name}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeagueBadgeClass(league)}">
                ${league.name}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${connection.year}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${formatDate(connection.createdAt)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button data-id="${connection.id}" class="delete-btn text-red-600 hover:text-red-900">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
      })
    );
  
    connectionsTableBody.innerHTML = tableRows.join("");
  
    // Add delete listeners
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = btn.getAttribute("data-id");
        if (confirm("Tem certeza que deseja remover esta ligação? Esta ação não pode ser desfeita.")) {
          await deleteConnection(id);
        }
      });
    });
  }
  

  // Create new league
  async function createLeague(leagueData) {
    try {
      const res = await fetch(`${API_BASE_URL}/leagues`, {
        method: "POST",
        headers,
        body: JSON.stringify(leagueData),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao criar liga");
      }
      
      showNotification("Liga criada com sucesso!", "success");
      
      // Se estiver na página de registro, limpar o formulário
      if (isLeagueRegisterPage && leagueForm) {
        leagueForm.reset();
      }
      
      // Se estiver na página de listagem, atualizar as listas
      if (isLeagueConnectionsPage) {
        await fetchLeagues();
        await fetchLeaguesList();
      }
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  // Create new connection
  async function createConnection(connectionData) {
    const payload = {
      leagueId: Number(connectionData.leagueId),
      clubId: Number(connectionData.clubId),
      year: Number(connectionData.year),
    };
    try {
      const res = await fetch(`${API_BASE_URL}/league-club-conciliations`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erro ao criar ligação");
      }
      
      showNotification("Ligação criada com sucesso!", "success");
      
      // Se estiver na página de registro, limpar o formulário
      if (isLeagueRegisterPage && connectionForm) {
        connectionForm.reset();
      }
      
      // Se estiver na página de listagem, atualizar a lista
      if (isLeagueConnectionsPage) {
        fetchConnections();
      }
    } catch (err) {
      showNotification(err.message, "error");
    }
  }

  // Delete league
  async function deleteLeague(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/leagues/${id}`, {
        method: "DELETE",
        headers,
      });
      
      if (!res.ok) throw new Error("Erro ao remover liga");
      
      showNotification("Liga removida com sucesso!", "success");
      await fetchLeagues();
      await fetchLeaguesList();
    } catch (err) {
      showNotification("Erro ao remover liga", "error");
    }
  }

  // Delete connection
  async function deleteConnection(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/league-club-conciliations/${id}`, {
        method: "DELETE",
        headers,
      });
      
      if (!res.ok) throw new Error("Erro ao remover ligação");
      
      showNotification("Ligação removida com sucesso!", "success");
      fetchConnections();
    } catch (err) {
      showNotification("Erro ao remover ligação", "error");
    }
  }

  // Filter connections
  async function filterConnections() {
    const clubId = clubFilter.value;
    const leagueId = leagueFilter.value;
    const year = yearFilter.value;
    
    try {
      let url = `${API_BASE_URL}/league-club-conciliations`;
      const params = new URLSearchParams();
      
      if (clubId) params.append("clubId", clubId);
      if (leagueId) params.append("leagueId", leagueId);
      if (year) params.append("year", year);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Erro ao filtrar ligações");
      
      const connections = await res.json();
      renderConnections(connections);
    } catch (err) {
      showNotification("Erro ao filtrar ligações", "error");
    }
  }



  // Event listeners - Página de registro
  if (isLeagueRegisterPage) {
    if (leagueForm) {
      leagueForm.addEventListener("submit", async (e) => {
        e.preventDefault();
      
        const submitBtn = leagueForm.querySelector("button[type='submit']");
        submitBtn.disabled = true;
      
        try {
          const formData = new FormData(leagueForm);
          const leagueData = {
            name: formData.get("name"),
            teamsCount: parseInt(formData.get("teamsCount")),
            gamesCount: parseInt(formData.get("gamesCount")),
          };

          await createLeague(leagueData);
        } finally {
          submitBtn.disabled = false;
        }
      });
    }

    if (connectionForm) {
      connectionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const formData = new FormData(connectionForm);
        const connectionData = {
          clubId: formData.get("club"),
          leagueId: formData.get("league"),
          year: parseInt(formData.get("year")),
        };
        
        await createConnection(connectionData);
      });
    }
  }
  
  // Event listeners - Página de listagem (botões de estado vazio)
  if (isLeagueConnectionsPage) {
    if (leaguesEmptyStateNewBtn) {
      leaguesEmptyStateNewBtn.addEventListener("click", () => {
        window.location.href = "league-register.html";
      });
    }
    
    if (emptyStateNewBtn) {
      emptyStateNewBtn.addEventListener("click", () => {
        window.location.href = "league-register.html";
      });
    }
  }

  // Filter event listeners - Página de listagem
  if (isLeagueConnectionsPage) {
    if (searchFilters) {
      searchFilters.addEventListener("click", filterConnections);
    }
  }

  // Utility functions
  function getLeagueBadgeClass(league) {
    // Generate a consistent color based on league name
    const colors = [
      "bg-green-100 text-green-800",
      "bg-blue-100 text-blue-800", 
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-red-100 text-red-800",
      "bg-indigo-100 text-indigo-800"
    ];
    
    if (!league || !league.name) return "bg-gray-100 text-gray-800";
    
    const index = league.name.length % colors.length;
    return colors[index];
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`;
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-circle"
            : "info-circle"
        } mr-2"></i>
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

  // Initialize
  await fetchClubs();
  await fetchLeagues();
  await fetchLeaguesList();
  await fetchConnections();
}); 

async function fetchLeagueName(id) {
  const res = await fetch(`${API_BASE_URL}/leagues/${id}`);
  const data = await res.json();
  return data.name;
}

async function fetchClubName(id) {
  const res = await fetch(`${API_BASE_URL}/clubs/${id}`);
  const data = await res.json();
  return data.name;
}
