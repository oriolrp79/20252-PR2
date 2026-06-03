/**
 * menu.js — Gestión del menú de navegación
 * Controla dropdowns por click (no por hover, para evitar el problema del hueco).
 * Se incluye en todas las páginas autenticadas.
 */

/**
 * Actualiza el menú con los datos del usuario actual:
 * nombre de usuario y contadores de listas.
 */
document.addEventListener('DOMContentLoaded', function() { //escoltem el dom
    
    updateMenu();  //actualitzem les dades del menú


    const logoutBtn = document.getElementById('logoutButton'); //botó de logout
    logoutBtn.addEventListener('click', function(e) {
        logout();           // Cridem a la funció de tancar sessió
    });

    dropDown(); //activem dropdown
});


function updateMenu() {
    //...
    const currentUsername = localStorage.getItem('username'); //recuperem el nom d'usuari que està loguejat
    const storageUserData = localStorage.getItem(`user_${currentUsername}`); //dades de les llistes a storage
    const userData = JSON.parse(storageUserData);

    //contem els elements de cada llista
    const totalWatching = userData.watching.length;
    const totalPlan = userData.planToWatch.length;

    //agafem contadors de la navbar
    const navWatching = document.querySelector('.watching-count');
    const navPlan = document.querySelector('.plan-count');

    //assignem nums reals
    navWatching.innerText = totalWatching;
    navPlan.innerText = totalPlan;

}

/**
 * Cierra la sesión del usuario y redirige al login.
 */
function logout() {
    //...
    sessionStorage.setItem('isLogged', 'false');  //canviem isLogged a false
    window.location.href = 'index.html'; //tornem a index.html
}

function dropDown() {
    const dropdowns = document.querySelectorAll('.dropdown');
    for (let i = 0; i < dropdowns.length; i++) {
        const dropBut= dropdowns[i].querySelector('.dropbtn');
        dropBut.addEventListener('click', function(e) {
            dropdowns[i].classList.toggle('open');
            //console.log("S'HA DETECTAT EL CLIC CORRECTAMENT AL BOTÓ " + i); //comprobació
        });

        const navLinks= document.querySelectorAll('.dropdown-content a');  //seleccionem els links de la navbar
        for (let k = 0; k < navLinks.length; k++) {   //recorrem els 2
            navLinks[k].addEventListener('click', function() {   //escoltem si hi ha click
                if (this.getAttribute('href').includes('planToWatch')) {     // guardem activeListKey segons la paraula que inclou el link
                    sessionStorage.setItem('activeListKey', 'plan');
                } else if (this.getAttribute('href').includes('watching')) {
                    sessionStorage.setItem('activeListKey', 'watching');
                }


            });
        
        }
    }

}

/* Añadir las funciones que consideréis necesarias*/