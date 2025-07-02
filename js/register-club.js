let isEdit = false;

function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const method = options.method?.toUpperCase() || "GET";

  const headers = {
    ...options.headers,
    Authorization: "Bearer " + token,
  };

  if (["POST", "PUT", "PATCH"].includes(method)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, { ...options, headers });
}

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("club-form");
  const submitBtn = document.getElementById("submit-btn");
  const titulo = document.getElementById("titulo-club");
  const params = new URLSearchParams(window.location.search);
  const clubId = params.get("id");

  let isEdit = false;

  if (clubId) {
    submitBtn.textContent = "Salvar Edições";
    titulo.textContent = "Editar Clube";

    isEdit = true;

    try {
      const res = await authFetch(`http://localhost:3333/clubs/${clubId}`);
      if (!res.ok) throw new Error("Erro ao buscar clube");

      const clube = await res.json();

      document.getElementById("name").value = clube.name || "";
      document.getElementById("founded").value = clube.founded || "";
      document.getElementById("country").value = clube.country || "";
      document.getElementById("location").value = clube.location || "";
      document.getElementById("league").value = clube.league || "";
      document.getElementById("stadium").value = clube.stadium || "";
      document.getElementById("president").value = clube.president || "";
      document.getElementById("primary_color").value = clube.primaryColor || "";
      document.getElementById("secondary_color").value =
        clube.secondaryColor || "";
      document.getElementById("description").value = clube.description || "";
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar os dados do clube.");
    }
  }

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const dadosClube = {
      name: document.getElementById("name").value,
      founded: parseInt(document.getElementById("founded").value),
      country: document.getElementById("country").value,
      location: document.getElementById("location").value,
      league: document.getElementById("league").value,
      stadium: document.getElementById("stadium").value,
      president: document.getElementById("president").value,
      primaryColor: document.getElementById("primary_color").value,
      secondaryColor: document.getElementById("secondary_color").value,
      description: document.getElementById("description").value,
    };

    try {
      let url, method;

      if (!isEdit) {
        url = "http://localhost:3333/clubs";
        method = "POST";
      } else if (isEdit) {
        url = `http://localhost:3333/clubs/${clubId}`;
        method = "PUT";
      }

      const resposta = await authFetch(url, {
        method,
        body: JSON.stringify(dadosClube),
      });


      if (!resposta.ok) throw new Error("Erro ao salvar clube.");

      alert(
        isEdit
          ? "Clube atualizado com sucesso!"
          : "Clube cadastrado com sucesso!"
      );
      form.reset();
      window.location.href = "clubs.html";
    } catch (erro) {
      console.error("Erro ao enviar:", erro);
      alert("Erro ao salvar o clube. Verifique os dados e tente novamente.");
    }
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    form.reset();
  });
});
