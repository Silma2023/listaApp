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

  // Asignar el evento al botón btnIniciarSesion dentro de onload
  const btnIniciarSesion = document.getElementById("btnIniciarSesion");
  if (btnIniciarSesion) {
    btnIniciarSesion.addEventListener("click", validarClave);
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
function escanearTicket() {
  alert("Escanear ticket (pendiente)");
}
function verGastos() {
  alert("Reparto de gastos (pendiente)");
}

// Leer y Editar JSON
const FILE_ID = "1hrVIriz_hi-0ymKJtv-GWCokKjLXdAu0"; // ID real del archivo en Drive

async function leerJsonDeDrive() {
  try {
    const response = await gapi.client.drive.files.get({
      fileId: FILE_ID,
      alt: 'media' // Esto devuelve directamente el contenido JSON
    });

    const contenidoJson = response.result;
    console.log("Contenido JSON:", contenidoJson);
    return contenidoJson;
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    return null;
  }
}

async function sobrescribirJsonEnDrive(nuevoContenido) {
  try {
    const response = await gapi.client.request({
      path: `/upload/drive/v3/files/${FILE_ID}`,
      method: "PATCH",
      params: {
        uploadType: "media"
      },
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoContenido)
    });

    console.log("Archivo JSON sobrescrito con éxito:", response);
  } catch (error) {
    console.error("Error al sobrescribir el archivo JSON:", error);
  }
}

// Función para iniciar sesión en Google Drive (necesaria para poder hacer operaciones)
async function signInDrive() {
  return new Promise((resolve, reject) => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
      gapi.client.load('drive', 'v3', () => {
        resolve();
      });
    }).catch(err => reject(err));
  });
}

// Modo sin conexión
function guardarListaLocalmente(lista) {
  localStorage.setItem("listaCompraOffline", JSON.stringify(lista));
}

// Detectar reconexión
window.addEventListener("online", () => {
  console.log("Conexión restaurada. Intentando sincronizar...");
  sincronizarConDrive();
});

window.addEventListener("offline", () => {
  console.log("Sin conexión. Trabajando en modo offline.");
});

// Sincronizar con Google Drive al volver la conexión
async function sincronizarConDrive() {
  const listaOffline = localStorage.getItem("listaCompraOffline");
  if (listaOffline) {
    const datos = JSON.parse(listaOffline);
    try {
      await signInDrive();
      await sobrescribirJsonEnDrive(datos);
      localStorage.removeItem("listaCompraOffline");
      console.log("Lista sincronizada con Drive.");
    } catch (error) {
      console.error("Error al sincronizar con Drive:", error);
    }
  }
}

// Guardar lista, ya sea online o offline
function guardarListaCompra(lista) {
  if (navigator.onLine) {
    signInDrive()
      .then(() => sobrescribirJsonEnDrive({ listaCompra: lista }))
      .catch(error => {
        console.error("Error al guardar en Drive:", error);
        // Fallback a local si hay error en Drive aunque esté online
        guardarListaLocalmente({ listaCompra: lista });
      });
  } else {
    guardarListaLocalmente({ listaCompra: lista });
    alert("Sin conexión. Los datos se guardaron localmente.");
  }
}

// Lista Compra
let lineaAEliminar = null;
let datosCompra = [];

function mostrarLista() {
  document.getElementById("pantallaPrincipal").style.display = "none";
  document.getElementById("seccionLista").style.display = "flex";
  cargarDesdeJson();
}

function agregarLinea(texto = "", comprado = false) {
  const contenedor = document.getElementById("contenedorLista");

  const fila = document.createElement("div");
  fila.className = "fila-compra";
  fila.style = "display:flex; gap:10px; align-items:center; background:#fff; padding:10px; border-radius:8px;";

  const input = document.createElement("input");
  input.type = "text";
  input.value = texto;
  input.style = "flex:1; padding:8px;";
  input.oninput = guardarEnJson;

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.checked = comprado;
  toggle.onchange = guardarEnJson;

  const btnBorrar = document.createElement("button");
  btnBorrar.innerHTML = "🗑️";
  btnBorrar.style = "background:none; border:none; cursor:pointer; font-size:1.2rem;";
  btnBorrar.onclick = () => {
    lineaAEliminar = fila;
    document.getElementById("modalConfirmacion").style.display = "flex";
  };

  fila.appendChild(input);
  fila.appendChild(toggle);
  fila.appendChild(btnBorrar);

  contenedor.appendChild(fila);
  guardarEnJson();
}

function borrarMarcados() {
  const contenedor = document.getElementById("contenedorLista");
  const filas = contenedor.children;
  for (let i = filas.length - 1; i >= 0; i--) {
    const checkbox = filas[i].querySelector("input[type=checkbox]");
    if (checkbox && checkbox.checked) {
      filas[i].remove();
    }
  }
  guardarEnJson();
}

function confirmarBorrado(confirmado) {
  document.getElementById("modalConfirmacion").style.display = "none";
  if (confirmado && lineaAEliminar) {
    lineaAEliminar.remove();
    guardarEnJson();
    lineaAEliminar = null;
  }
}

function guardarEnJson() {
  const contenedor = document.getElementById("contenedorLista");
  const filas = contenedor.children;

  datosCompra = [];
  for (const fila of filas) {
    const texto = fila.querySelector("input[type=text]").value;
    const comprado = fila.querySelector("input[type=checkbox]").checked;
    datosCompra.push({ texto, comprado });
  }

  localStorage.setItem("listaCompra", JSON.stringify(datosCompra));
}

function cargarDesdeJson() {
  const guardado = localStorage.getItem("listaCompra");
  if (guardado) {
    datosCompra = JSON.parse(guardado);
    document.getElementById("contenedorLista").innerHTML = "";
    datosCompra.forEach(({ texto, comprado }) => agregarLinea(texto, comprado));
  }
}

// Auto-recarga cada 10 segundos
setInterval(() => {
  cargarDesdeJson();
}, 10000);
