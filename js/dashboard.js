document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes('dashboard.html')) {
      return;
    }
    
    const user = JSON.parse(localStorage.getItem("userData"));  

    if (user.role === "user") {
      const access_requests_sidebar  = document.getElementById("access-requests");
  
      access_requests_sidebar.remove()
    }
  
    function authFetch(url, options = {}) {
      const token = localStorage.getItem('token');
      const headers = {
        ...options.headers,
        'Authorization': 'Bearer ' + token
      };
  
      if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())) {
        headers['Content-Type'] = 'application/json';
      }
  
      return fetch(url, { ...options, headers });
    }
  
  
    const counters = document.querySelectorAll('.text-3xl.font-bold.text-gray-800');
  
    async function reloadtotals() {
      try {
        const [resCounts, resLatest] = await Promise.all([
          authFetch("http://localhost:3333/dashboard/counts"),
          authFetch("http://localhost:3333/dashboard/latest"),
        ]);
        const counts = await resCounts.json();
        const latest = await resLatest.json();
  
        if (counters && counters.length >= 3) {
          counters[0].textContent = counts.players ?? 0;
          counters[1].textContent = counts.clubs ?? 0;
          counters[2].textContent = counts.activePlayers ?? 0;
        }
  
        const jogadoresContainer = document.getElementById('ultimos-jogadores');
        const clubesContainer = document.getElementById('ultimos-clubes');
  
        if (jogadoresContainer) {
          jogadoresContainer.innerHTML = latest.players.length
            ? latest.players.map(j => `<p class="text-gray-700">${j.name}</p>`).join('')
            : `<p class="text-gray-500">Nenhum jogador registrado no sistema.</p>`;
        }
  
        if (clubesContainer) {
          clubesContainer.innerHTML = latest.clubs.length
            ? latest.clubs.map(c => `<p class="text-gray-700">${c.name}</p>`).join('')
            : `<p class="text-gray-500">Nenhum clube registrado no sistema.</p>`;
        }
  
      } catch (error) {
        console.error("Erro ao carregar totais e últimos registros:", error);
      }
    }
    async function loadRecentActivities() {
        try {
          const res = await authFetch("http://localhost:3333/activities");
          const activities = await res.json();
  
          const container = document.getElementById('recent-activities');
      
          if (!container) return;
      
          if (activities.length === 0) {
            container.innerHTML = `<p class="text-gray-500">No recent activities to display.</p>`;
          } else {
            container.innerHTML = activities.map(activity => `
              <div class="mb-1">
                <p class="text-sm text-gray-700">
                  <strong>${activity.user}</strong> performed <em>${activity.actionType}</em> on ${activity.entity}: ${activity.description}
                  <br>
                  <span class="text-xs text-gray-500">${new Date(activity.date).toLocaleString()}</span>
                </p>
              </div>
            `).join('');
          }
        } catch (error) {
          console.error("Error loading recent activities:", error);
        }
      }
      
 
  
    reloadtotals();
    loadRecentActivities();
  });
  