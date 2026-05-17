/**
 * index.js — Lógica de la página de login

Utilitzem Live Server per executar el projecte en el navegador, así el localStorage funciona bé entre pàgines
*/


/*Este script debe de gestionar el login de los usuarios.*/

/* Añadir las funciones que consideréis necesarias*/

//declarem les variables, recuperant la info de localStorage i del DOM
const storedUsername = localStorage.getItem('username');
const storedPassword = localStorage.getItem('password');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');
//recuperem la info de si està loguejat l'usuari
const isLogged = sessionStorage.getItem('isLogged');

    //COMPROvació de que la info ha quedat guardada en el localStorage
    //console.log(storedUsername);
    //console.log(storedPassword);

    // Si hay un usuario logeado, redirigimos a la página indice de Pokemons
    //...
if (isLogged) {
    window.location.href = 'anime.html';
} else {
    // Si no hay un usuario logeado, comprobamos datos de login
    //...
    document.getElementById('loginButton').addEventListener('click', () => {
        if ((storedUsername===usernameInput.value) && (storedPassword===passwordInput.value)) {
            // si usuari i contrsenya son correctes guardem que l'usuari està loguejat i redirigim a anime.html
            isLogged=true;
            sessionStorage.setItem('isLogged', isLogged); //utilitzem sessionStorage perquè si el navegador es tanca el login s'ha de tornar a fer
            window.location.href = 'anime.html';
        } else { 
            //en cas contrari missatge d'error
            errorMsg.textContent = 'Usuari o contrasenya incorrectes';
            errorMsg.style.display = 'block';
        }
        
    });

    // Al pulsar el boton redirigimos a la página de registro
    document.getElementById('newUserButton').addEventListener('click', () => {
        window.location.href = 'registro.html';
    });
}
    /* Añadir las funciones que consideréis necesarias*/