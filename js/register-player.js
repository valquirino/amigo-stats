function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };
  return fetch(url, { ...options, headers });
}

let isEdit = false;

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("player-form");
  const submitBtn = document.getElementById("submit-btn");
  const params = new URLSearchParams(window.location.search);
  const playerId = params.get("id");

  async function preencherClubes() {
    const select = document.getElementById("club");

    try {
      const resposta = await authFetch("http://localhost:3333/clubs/list");
      if (!resposta.ok) throw new Error("Erro ao buscar clubes");

      const clubes = await resposta.json();
      clubes.forEach((club) => {
        const option = document.createElement("option");
        option.value = club.id;
        option.textContent = club.name;
        select.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar clubes:", error);
      alert("Erro ao carregar clubes. Tente novamente mais tarde.");
    }
  }

  await preencherClubes();

  if (playerId) {
    isEdit = true;
    submitBtn.textContent = "Salvar Edições";

    try {
      const res = await authFetch(`http://localhost:3333/players/${playerId}`);
      if (!res.ok) throw new Error("Erro ao buscar jogador");

      const jogador = await res.json();

      document.getElementById("name").value = jogador.name || "";
      document.getElementById("nickname").value = jogador.nickname || "";
      document.getElementById("birthdate").value = jogador.birthDate
      document.getElementById("nationality").value = jogador.nationality || "";
      document.getElementById("position").value = jogador.position || "";
      document.getElementById("shirt_number").value = jogador.shirtNumber || "";
      document.getElementById("club").value = jogador.clubId || "";
      document.getElementById("height").value = jogador.height || "";
      document.getElementById("weight").value = jogador.weight || "";
      document.getElementById("status").value = jogador.stats || "";
      document.getElementById("notes").value = jogador.notes || "";
      document.getElementById("cpf").value = jogador.cpf || "";
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar os dados do jogador.");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();


const dadosJogador = {
    name: document.getElementById("name").value,
    nickname: document.getElementById("nickname").value,
    birthDate: document.getElementById("birthdate").value,
    nationality: document.getElementById("nationality").value,
    position: document.getElementById("position").value,
    shirtNumber: Number(document.getElementById("shirt_number").value), // 🔥 Convertido pra número
    clubId: Number(document.getElementById("club").value),               // 🔥 Convertido pra número
    height: Number(document.getElementById("height").value),             // 🔥 Convertido pra número
    weight: Number(document.getElementById("weight").value),             // 🔥 Convertido pra número
    status: document.getElementById("status").value,                     // 🔥 Corrigido de stats → status
    notes: document.getElementById("notes").value,
    cpf: document.getElementById("cpf").value
 
};

    try {
      let url, method;

      if (!isEdit) {   
        url = "http://localhost:3333/players";
        method = "POST";
      } else {
        url = `http://localhost:3333/players/${playerId}`;
        method = "PUT";
      }

      const resposta = await authFetch(url, {
        method,
        body: JSON.stringify(dadosJogador),
      });



      if (!resposta.ok) throw new Error("Erro ao salvar jogador.");

      const text = await resposta.text();
      const resultado = text ? JSON.parse(text) : {};
      
      alert(isEdit ? "Jogador atualizado com sucesso!" : "Jogador cadastrado com sucesso!");
  
      form.reset();
      window.location.href = 'players.html'; 

    } catch (erro) {
      console.error("Erro:", erro);
      alert("Falha ao salvar jogador.");
    }
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    form.reset();
  });

   

  function formatarDataParaInput(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    return data.toISOString().split('T')[0];  
  }
});
