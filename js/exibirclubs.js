document.addEventListener("DOMContentLoaded", () => {
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

  const tableBody = document.getElementById("clubs-table-body");

  async function carregarClubes() {
    try {
      const resposta = await authFetch("http://localhost:3333/clubs/list");
      if (!resposta.ok) throw new Error("Erro ao buscar clubes.");

      const clubes = await resposta.json();
      renderizarClubes(clubes);
    } catch (err) {
      console.error("Erro ao carregar clubes:", err);
      alert("Erro ao buscar clubes.");
    }
  }

  async function buscarClubes() {
    const filtros = {
      search: document.getElementById("search")?.value.trim(),
      country: document.getElementById("country-filter")?.value,
      league: document.getElementById("league-filter")?.value
    };


if (filtros.country === 'Todos os Paises') {
  delete filtros.country;
}

if (filtros.league === 'Todas as ligas'){
  delete filtros.league
    try {
      const resposta = await authFetch("http://localhost:3333/clubs/filter", {
        method: "POST",
        body: JSON.stringify(filtros)
      });

      if (!resposta.ok) throw new Error("Erro ao buscar clubes");

      const clubes = await resposta.json();
      renderizarClubes(clubes);
    } catch (error) {
      console.error("Erro ao buscar clubes com filtros:", error);
      alert("Erro ao buscar clubes. Tente novamente.");
    }
  }

  function renderizarClubes(clubes) {
    tableBody.innerHTML = "";

    if (clubes.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-10 text-center text-gray-500">
            <i class="fas fa-info-circle text-2xl mb-2"></i>
            <p>Nenhum clube encontrado.</p>
          </td>
        </tr>
      `;
      return;
    }

    clubes.forEach(clube => {
      const nomesJogadores = !clube.players ? '-' : clube.players.map(j => j.name).join(', ');
 
    
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4">${clube.name}</td>
        <td class="px-6 py-4">${clube.country || "-"}</td>
        <td class="px-6 py-4">${clube.league || "-"}</td>
        <td class="px-6 py-4">${nomesJogadores}</td> <!-- novo campo com jogadores -->
        <td class="px-6 py-4 space-x-2">
          <button class="btn-editar text-yellow-500 hover:underline" data-club-id="${clube.id}">Editar</button>
          <button class="btn-excluir text-red-500 hover:underline" data-club-id="${clube.id}">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
    

    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => {
        const clubId = btn.getAttribute("data-club-id");
        window.location.href = `register-club.html?id=${clubId}`;
      });
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.addEventListener("click", async () => {
        const clubId = btn.getAttribute("data-club-id");
        if (!confirm("Deseja realmente excluir este clube?")) return;

        try {
          const res = await authFetch(`http://localhost:3333/clubs/${clubId}`, {
            method: "DELETE"
          });

          if (!res.ok) throw new Error("Erro ao deletar clube.");

          alert("Clube excluído com sucesso.");
          carregarClubes();
        } catch (err) {
          console.error("Erro ao excluir clube:", err);
          alert("Erro ao excluir clube.");
        }
      });
    });
  }

  async function preencherFiltrosDeClubes() {
    try {
      const resposta = await authFetch("http://localhost:3333/clubs/list");
      if (!resposta.ok) throw new Error("Erro ao buscar clubes.");

      const clubes = await resposta.json();

      const ligasSet = new Set();
      const paisesSet = new Set();

      clubes.forEach(clube => {
        if (clube.league) ligasSet.add(clube.league);
        if (clube.country) paisesSet.add(clube.country);
      });

      const leagueFilter = document.getElementById("league-filter");
      const countryFilter = document.getElementById("country-filter");

      leagueFilter.innerHTML = `<option value="Todas as ligas">Todas as ligas</option>`;
      countryFilter.innerHTML = `<option value="Todos os Paises">Todos os países</option>`;

      [...ligasSet].sort().forEach(league => {
        const opt = document.createElement("option");
        opt.value = league;
        opt.textContent = league;
        leagueFilter.appendChild(opt);
      });

      [...paisesSet].sort().forEach(pais => {
        const opt = document.createElement("option");
        opt.value = pais;
        opt.textContent = pais;
        countryFilter.appendChild(opt);
      });

    } catch (err) {
      console.error("Erro ao preencher filtros:", err);
      alert("Erro ao preencher filtros de país e liga.");
    }
  }

  const btnPesquisarClub = document.getElementById("search-btn-club");
  btnPesquisarClub?.addEventListener("click", (e) => {
    e.preventDefault();
    buscarClubes();
  });

  preencherFiltrosDeClubes();
  carregarClubes();
}});
