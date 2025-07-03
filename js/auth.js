// Arquivo de autenticação e solicitação de acesso

// Função para verificar se o usuário está logado
function isLoggedIn() {
  const user = getCurrentUser();

  if (!user) return false;

  return user.isLoggedIn === true;
}

// Função para fazer logout
function logout() {
  localStorage.removeItem("userData");
  window.location.href = "../index.html";
}

// Recuperar dados do usuário atual
function getCurrentUser() {
  const userData = localStorage.getItem("userData");

  if (!userData) return null;

  return JSON.parse(userData);
}

// Função para solicitar acesso
async function requestAccess(email, password) {
  try {
    const response = await fetch("http://localhost:3333/auth/request-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        status: "pending",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message:
          "Solicitação de acesso enviada com sucesso! Aguarde a aprovação do administrador.",
      };
    } else {
      return {
        success: false,
        message: data.error || "Erro ao solicitar acesso. Tente novamente.",
      };
    }
  } catch (error) {
    console.error("Erro ao solicitar acesso:", error);
    return {
      success: false,
      message: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}

// Lidar com o envio do formulário de login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const requestAccessBtn = document.getElementById("request-access-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const message = await login(email, password);

      if (message) {
        alert(message);
      } else {
        localStorage.setItem("token", success.access_token);
        window.location.href = "pages/dashboard.html";
      }
    });
  }

  // Event listener para o botão "Solicitar acesso"
  if (requestAccessBtn) {
    requestAccessBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Validar se os campos estão preenchidos
      if (!email || !password) {
        alert("Por favor, preencha o email e senha antes de solicitar acesso.");
        return;
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Por favor, insira um email válido.");
        return;
      }

      // Validar senha (mínimo 6 caracteres)
      if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
      }

      const result = await requestAccess(email, password);

      if (result.success) {
        alert(result.message);
        // Limpar os campos após sucesso
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
      } else {
        alert(result.message);
      }
    });
  }

  // Redirecionar para a página de login se não estiver logado (exceto na própria página de login)
  if (!isLoggedIn() && !window.location.href.includes("index.html")) {
    window.location.href = "../index.html";
  }

  // Configurar o botão de logout, se existir
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

async function login(email, password) {
  try {
    const response = await fetch("http://localhost:3333/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...data.user,
          token: data.access_token,
          isLoggedIn: true,
        })
      );

      return data;
    }

    if (response.status === 401) {
      return "Email ou senha incorretos.";
    }
    if (response.status === 403) {
      return "Sua conta ainda não foi aprovada pelo administrador,para isso solicite acesso no botao abaixo";
    }
    return "Erro inesperado.";
  } catch (error) {
    console.error("Erro ao tentar logar:", error);
    return false;
  }
}
