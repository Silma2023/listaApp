window.onload = function () {
  google.accounts.id.initialize({
    client_id: "789785230410-q2n02ojto3jjider6io17sg0iq7hhao0.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });

  const loginBtn = document.getElementById("login");
  if (loginBtn) {
    google.accounts.id.renderButton(loginBtn, { theme: "outline", size: "large" });
  }

  google.accounts.id.prompt();

  // Ocultar secciones si existen
  const userSelector = document.getElementById("userSelector");
  if (userSelector) userSelector.style.display = "none";

  const modalClave = document.getElementById("modalClave");
  if (modalClave) modalClave.style.display = "none";

  const pantallaPrincipal = document.getElementById("pantallaPrincipal");
  if (pantallaPrincipal) pantallaPrincipal.style.display = "none";

  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    usuarioSeleccionado = usuarioGuardado;
    if (loginBtn) loginBtn.style.display = "none";
    mostrarPantallaPrincipal();
  }
};

let usuarioSeleccionado = null;

const claves = {
  Silvia: "rosa2024",
  Manuel: "azul2024"
};

function handleCredentialResponse(response) {
  // Decodificar el JWT para obtener el nombre del usuario (opcional)
  const data = parseJwt(response.credential);
  console.log("Google login OK:", data.name);

  // Ocultar login Google y mostrar selector persona
  const loginBtn = document.getElementById("login");
  if (loginBtn) loginBtn.style.display = "none";

  const userSelector = document.getElementById("userSelector");
  if (userSelector) userSelector.style.display = "block";
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = decodeURIComponent(
    atob(base64Url)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(base64);
}

function abrirModalClave(nombre) {
  usuarioSeleccionado = nombre;
  const modalClave = document.getElementById("modalClave");
  if (modalClave) modalClave.style.display = "flex";

  const inputClave = document.getElementById("inputClave");
  if (inputClave) inputClave.value = "";

  const errorClave = document.getElementById("errorClave");
  if (errorClave) errorClave.style.display = "none";

  const modalTitulo = document.getElementById("modalTitulo");
  if (modalTitulo) modalTitulo.textContent = `Clave para ${nombre}`;

  if (inputClave) inputClave.focus();
}

function validarClave() {
  const inputClave = document.getElementById("inputClave");
  const claveIngresada = inputClave ? inputClave.value : "";

  if (claveIngresada === claves[usuarioSeleccionado]) {
    localStorage.setItem("usuario", usuarioSeleccionado);

    const modalClave = document.getElementById("modalClave");
    if (modalClave) modalClave.style.display = "none";

    const userSelector = document.getElementById("userSelector");
    if (userSelector) userSelector.style.display = "none";

    mostrarPantallaPrincipal();
  } else {
    const errorClave = document.getElementById("errorClave");
    if (errorClave) errorClave.style.display = "block";
  }
}

function mostrarPantallaPrincipal() {
  const pantallaPrincipal = document.getElementById("pantallaPrincipal");
  if (pantallaPrincipal) pantallaPrincipal.style.display = "block";

  const infoUsuario = document.getElementById("infoUsuario");
  if (infoUsuario) infoUsuario.textContent = `Bienvenido/a, ${usuarioSeleccionado}`;
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  usuarioSeleccionado = null;

  const pantallaPrincipal = document.getElementById("pantallaPrincipal");
  if (pantallaPrincipal) pantallaPrincipal.style.display = "none";

  const userSelector = document.getElementById("userSelector");
  if (userSelector) userSelector.style.display = "none";

  const loginBtn = document.getElementById("login");
  if (loginBtn) loginBtn.style.display = "block";

  google.accounts.id.prompt();
}

// Funciones botones menú (pendientes de implementar)
function mostrarLista() {
  alert("Mostrar lista de la compra (pendiente)");
}
function escanearTicket() {
  alert("Escanear ticket (pendiente)");
}
function verGastos() {
  alert("Reparto de gastos (pendiente)");
}
