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
};

function handleCredentialResponse(response) {
  // Decodificar el JWT para obtener el nombre del usuario
  const data = parseJwt(response.credential);
  document.getElementById("username").textContent = data.name;
  document.getElementById("login").style.display = "none";
  document.getElementById("user-info").style.display = "block";
}

// Función para decodificar el token JWT
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(base64);
}
