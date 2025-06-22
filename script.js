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

  const claveInputContainer = document.getElementById("claveInputContainer");
  if (claveInputContainer) claveInputContainer.style.display = "none";

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
  const data = parseJwt(response.credential);
  console.log("Google login OK:", data.name);

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
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(base64);
}

function abrirModalClave(nombre) {
  usuarioSeleccionado = nombre;

  // Mostrar el contenedor de clave
  const claveInputContainer = document.getElementById("claveInputContainer");
  if (claveInputContainer) claveInputContainer.style.display = "flex";

  // Limpiar input clave
  const inputClave = document.getElementById("inputClave");
  if (inputClave) {
    inputClave.value = "";
    inputClave.focus();
  }

  // Ocultar error
  const errorClave = document.getElementById("errorClave");
  if (errorClave) errorClave.style.display = "none";

  // Actualizar el label para que muestre el nombre (opcional)
  const labelClave = claveInputContainer ? claveInputContainer.querySelector("label") : null;
  if (labelClave) labelClave.textContent = `Clave para ${nombre}:`;
}

function validarClave() {
  const inputClave = document.getElementById("inputClave");
  const claveIngresada = inputClave ? inputClave.value : "";

  if (claveIngresada === claves[usuarioSeleccionado]) {
    localStorage.setItem("usuario", usuarioSeleccionado);

    const claveInputContainer = document.getElementById("claveInputContainer");
    if (claveInputContainer) claveInputContainer.style.display = "none";

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
  if (pantallaPrincipal) pantallaPrincipal.style.display = "flex";

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

  const claveInputContainer = document.getElementById("claveInputContainer");
  if (claveInputContainer) claveInputContainer.style.display = "none";

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
