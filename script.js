window.onload = function () {
  google.accounts.id.initialize({
    client_id: "789785230410-q2n02ojto3jjider6io17sg0iq7hhao0.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("login"),
    { theme: "outline", size: "large" }
  );

  google.accounts.id.prompt(); // Muestra automáticamente si hay sesión activa

  // Al cargar, ocultamos secciones excepto login
  document.getElementById("userSelector").style.display = "none";
  document.getElementById("modalClave").style.display = "none";
  document.getElementById("pantallaPrincipal").style.display = "none";

  // Si ya hay usuario guardado local, mostramos pantalla principal directamente
  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    usuarioSeleccionado = usuarioGuardado;
    document.getElementById("login").style.display = "none";
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
  document.getElementById("login").style.display = "none";
  document.getElementById("userSelector").style.display = "block";
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
  document.getElementById("modalClave").style.display = "flex";
  document.getElementById("inputClave").value = "";
  document.getElementById("errorClave").style.display = "none";
  document.getElementById("modalTitulo").textContent = `Clave para ${nombre}`;
  document.getElementById("inputClave").focus();
}

function validarClave() {
  const claveIngresada = document.getElementById("inputClave").value;
  if (claveIngresada === claves[usuarioSeleccionado]) {
    localStorage.setItem("usuario", usuarioSeleccionado);
    document.getElementById("modalClave").style.display = "none";
    document.getElementById("userSelector").style.display = "none";
    mostrarPantallaPrincipal();
  } else {
    document.getElementById("errorClave").style.display = "block";
  }
}

function mostrarPantallaPrincipal() {
  document.getElementById("pantallaPrincipal").style.display = "block";
  document.getElementById("infoUsuario").textContent = `Bienvenido/a, ${usuarioSeleccionado}`;
}

function cerrarSesion() {
  localStorage.removeItem("usuario");
  usuarioSeleccionado = null;
  document.getElementById("pantallaPrincipal").style.display = "none";
  document.getElementById("userSelector").style.display = "none";
  document.getElementById("login").style.display = "block";
  google.accounts.id.prompt(); // Muestra botón login Google
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
