
document.addEventListener("DOMContentLoaded", () => {
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

    if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase())) {
      headers['Content-Type'] = 'application/json';
    }

    return fetch(url, { ...options, headers });
  }

  const searchInput = document.getElementById("search");
  const positionFilter = document.getElementById("position-filter");
  const clubFilter = document.getElementById("club-filter");
  const tableBody = document.getElementById("players-table-body");
  const btnPesquisar = document.getElementById("search-btn-players");

  async function preencherClubesDoFiltroJogadores() {
    try {
      const resposta = await authFetch("http://localhost:3333/clubs/list");
      if (!resposta.ok) throw new Error("Erro ao buscar clubes.");

      const clubes = await resposta.json();

      clubFilter.innerHTML = `<option value="">Todos os clubes</option>`;

      const clubesOrdenados = clubes.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      
      clubesOrdenados.forEach(club => {
        const opt = document.createElement("option");
        opt.value = club.id;
        opt.textContent = club.name;
        clubFilter.appendChild(opt);
      });      

    } catch (error) {
      console.error("Erro ao preencher clubes no filtro de jogadores:", error);
      alert("Erro ao carregar lista de clubes.");
    }
  }

  async function carregarTodosJogadores() {
    try {
      const resposta = await authFetch("http://localhost:3333/players/list");

      if (!resposta.ok) throw new Error("Erro ao carregar jogadores");

      const jogadores = await resposta.json();
      renderizarJogadores(jogadores);
    } catch (error) {
      console.error("Erro ao carregar todos os jogadores:", error);
      alert("Erro ao buscar jogadores. Tente novamente.");
    }
  }

  async function buscarJogadores() {
    const filtros = {
      search: searchInput.value.trim(),
      position: positionFilter.value,
      clubId: clubFilter.value
    };

    if(filtros.position==='Todas as posições'){
       delete filtros.position
    }

    if(filtros.club==='Todos os clubes'){ 
      delete filtros.club
    }

    try {
      const resposta = await authFetch("http://localhost:3333/players/filter", {
        method: "POST",
        body: JSON.stringify(filtros)
      });


      if (!resposta.ok) throw new Error("Erro ao buscar jogadores");

      const jogadores = await resposta.json();
      renderizarJogadores(jogadores);
    } catch (error) {
      console.error("Erro ao buscar jogadores com filtros:", error);
      alert("Erro ao buscar jogadores. Tente novamente.");
    }
  }

  function renderizarJogadores(jogadores) {
    tableBody.innerHTML = "";

    if (jogadores.length === 0 || jogadores.message) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-10 text-center text-gray-500">
            <i class="fas fa-info-circle text-2xl mb-2"></i>
            <p>Nenhum jogador encontrado. <a href="register-player.html" class="text-primary hover:underline">Adicionar um jogador</a>.</p>
          </td>
        </tr>
      `;
      return;
    }

    jogadores.forEach(jogador => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4">${jogador.name}</td>
        <td class="px-6 py-4">${jogador.birthDate ? calcularIdade(jogador.birthDate) + ' anos' : '-'}</td>
        <td class="px-6 py-4">${jogador.position ?? '-'}</td>
        <td class="px-6 py-4">${jogador.club?.name ?? '-'}</td>
        <td class="px-6 py-4">${jogador.status ?? '-'}</td>
        <td class="px-6 py-4 space-x-2">
          <button class="btn-editar text-yellow-500 hover:underline" data-player-id="${jogador.id}">
            Editar
          </button>
          <button class="btn-excluir text-red-500 hover:underline" data-player-id="${jogador.id}">
            Excluir
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => {
        const playerId = btn.getAttribute("data-player-id");
        window.location.href = `register-player.html?id=${playerId}`;
      });
    });

    document.querySelectorAll(".btn-excluir").forEach(btn => {
      btn.addEventListener("click", async () => {
        const playerId = btn.getAttribute("data-player-id");

        if (!confirm("Deseja realmente excluir este jogador?")) return;

        try {
          const resposta = await authFetch(`http://localhost:3333/players/${playerId}`, {
            method: "DELETE"
          });

          if (!resposta.ok) throw new Error("Erro ao excluir jogador.");

          alert("Jogador excluído com sucesso!");
          carregarTodosJogadores();
        } catch (err) {
          console.error("Erro ao excluir jogador:", err);
          alert("Erro ao excluir jogador.");
        }
      });
    });
  }
  function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNasc = nascimento.getMonth();
    const diaNasc = nascimento.getDate();
  
    if (mesAtual < mesNasc || (mesAtual === mesNasc && diaAtual < diaNasc)) {
      idade--;
    }
  
    return idade;
  }
  

  btnPesquisar.addEventListener("click", (e) => {
    e.preventDefault();
    buscarJogadores();
  });

  preencherClubesDoFiltroJogadores();
  carregarTodosJogadores();
});

  