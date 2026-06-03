/**
 * index.js — Lógica de la página de login

Utilitzem Live Server per executar el projecte en el navegador, así el localStorage funciona bé entre pàgines
*/


/*Este script debe de gestionar el login de los usuarios.*/

/* Añadir las funciones que consideréis necesarias*/

//declarem les variables, recuperant la info del DOM
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');

//llegim localstorage  
const initialStoredUsername = localStorage.getItem('username');
const initialStoredPassword = localStorage.getItem('password');
console.log("Username guardat:", initialStoredUsername); //comprobació  
console.log("Password guardat:", initialStoredPassword);

//recuperem la info de si està loguejat l'usuari
let isLogged = sessionStorage.getItem('isLogged');


    // Si hay un usuario logeado, redirigimos a la página indice de Pokemons
    //...
if (sessionStorage.getItem('isLogged') === 'true') {   //mirem si la var isLogged que esta guardadda a sessionstorage es true
    window.location.href = 'anime.html';
} else {
    // Si no hay un usuario logeado, comprobamos datos de login
    //...
    document.getElementById('loginButton').addEventListener('click', () => {
        const currentStoredUsername = localStorage.getItem('username'); //llegim localstorage  
        const currentStoredPassword = localStorage.getItem('password');

        console.log(usernameInput.value);  //comprobacions de que ha quedat guardat per fer login a index.html
        console.log(currentStoredUsername);

        if ((currentStoredUsername === usernameInput.value) && (currentStoredPassword === passwordInput.value)) {
            // si usuari i contrsenya son correctes guardem que l'usuari està loguejat i redirigim a anime.html
            isLogged=true;
            sessionStorage.setItem('isLogged', isLogged); //utilitzem sessionStorage perquè si el navegador es tanca el login s'ha de tornar a fer
            window.location.href = 'anime.html';
        } else { 
            //en cas contrari missatge d'error
            alert('Usuari o contrasenya incorrectes');
            /*errorMsg.textContent = 'Usuari o contrasenya incorrectes';  //m'agrada més el missatge en errorMsg, però es demana tipus alert
            errorMsg.style.display = 'block';*/
        }
        
    });

    // Al pulsar el boton redirigimos a la página de registro
    document.getElementById('newUserButton').addEventListener('click', () => {
        window.location.href = 'registro.html';
    });
}
    /* Añadir las funciones que consideréis necesarias*/