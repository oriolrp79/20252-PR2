/**
 * listas.js — Gestión de las listas del usuario (Viendo actualmente / Plan to Watch)
 */

let currentUser;

var activeListKey; // = 'watching'; // Lista activa por defecto, la definim més avall

/* Añadir las funciones que consideréis necesarias*/
document.addEventListener('DOMContentLoaded', function () { //carreguem el dom
    const currentUsername = localStorage.getItem('username');  //carreguem el nom d'usuari actiu
    const storageUserData = localStorage.getItem(`user_${currentUsername}`);  //i les dades de l'usuari

    currentUser = JSON.parse(storageUserData); //convertim el text json a un objecte js

    const savedKey= sessionStorage.getItem('activeListKey'); //reecuperem la key guardada a sessionStorage a menu.js
    if (savedKey) {
        activeListKey = savedKey;  //si existeix guardem la clau
    } else {
        activeListKey = 'watching'; // sinó default com estava definida més amunt
    }


    const listClick= document.getElementById('btnWatching'); //agafo element botó watching
    listClick.addEventListener('click', function(){  //l'escoltem i si hi ha click llavors canviem activeListKey
         activeListKey = 'watching';
         renderActiveList();
    });
    
    const listClick2= document.getElementById('btnPlan'); //lo mateix per l'altre botó, canviant a plan
    listClick2.addEventListener('click', function(){
        activeListKey = 'plan';
        renderActiveList();
    });

    



    updateListCounters(); //cridem la funció a actualitzar contadors

    renderActiveList(); //cridem ala funció per imprimir animes

    deleteAnimeList(); //detectar el botó borrar anime de la llista

});

function updateListCounters() {
    const totalWatching = currentUser.watching.length; //longituds de les llistes
    const totalPlan= currentUser.planToWatch.length;

    //recuperem els elements del html per modificar-los
    const watchingCount2 = document.getElementById('watchingCount2');
    const planCount2 =document.getElementById('planCount2');

    watchingCount2.innerText = totalWatching;  //fiquem els nums actualitzats
    planCount2.innerText = totalPlan;
}



function renderActiveList() {
    const listTitle = document.getElementById('listTitle');  //agafem l'element titol de la llista
    const listData= document.getElementById('listContainer');  //agafem l'element contenidor

    listData.innerHTML = ""; //reset al container

    let mostraAnimes= [];
    if (activeListKey === 'watching') {  //mirem dins la llista que està escollida per l'usuari
        listTitle.innerText = "Viendo actualmente";  //canviem el text
        mostraAnimes = currentUser.watching; // guardem llista watching
    } else {
        listTitle.innerText = "Plan to Watch";
        mostraAnimes= currentUser.planToWatch; // guardem llista plan
    }

    for (let i = 0; i < mostraAnimes.length; i++) {
        const anime = mostraAnimes[i];

        //creem caixa de text amb el codi html
        let cardHTML = `  
            <div class="anime-card">
                <img src="${anime.imageUrl}" alt="${anime.title}" class="anime-img">
                <div class="anime-info">
                    <h3 class="anime-title">${anime.title}</h3> 
                    <p class="anime-genres"><strong>Gèneres:</strong> ${anime.genres}</p>
                    <p class="anime-score"><strong>Puntuació:</strong> <span class="score-number">${anime.score}</span></p>
                    <p class="anime-status"><strong>Estat:</strong> ${anime.status}</p>
                </div>
                <div class="anime-actions">
                    <button class="button-delete" data-id="${anime.malId}">Delete</button> 
                    
                </div>
            </div>`;

        // afegim aquesta targeta al final del contenidor
        listData.innerHTML = listData.innerHTML + cardHTML;

    }
    console.log("Targetes mostrades en la llista "+activeListKey+": "+mostraAnimes.length); //comprovació
}

/**
 * Crear la tarjeta de un anime dentro de la lista.
 */


/**
 * Eliminar un anime de la lista activa y actualiza la vista.
 */
function deleteAnimeList() {
    const listData = document.getElementById('listContainer'); //agafem contenidor
    listData.addEventListener('click', function(e) { //escoltem si h ih a click
        
        if (e.target && e.target.classList.contains('button-delete')) {  //si s'ha fet click sobre button-detele
            const animeId = e.target.getAttribute('data-id');  //recuperem l'id de l'anime

            let listaActual = [];  //llista preparada i l'omplim amb la llista que toqui
            if (activeListKey === 'watching') {  
               listaActual = currentUser.watching;
            } else {
                listaActual = currentUser.planToWatch;
            }

            for (let i = 0; i < listaActual.length; i++) { //comparem i busquem l'anime per borrar
                
                if (String(listaActual[i].malId) === String(animeId)) {
                    listaActual.splice(i, 1);   //borrem de la llista 1 anime de la posició i amb splice
                    break; //si ho hem trobat parem el for
                }
                
            }

            //guardem la nova llista a localstorage
            const currentUsername = localStorage.getItem('username');
            localStorage.setItem(`user_${currentUsername}`, JSON.stringify(currentUser));

            //actualitzem pantalla amb la llista nova
            updateListCounters(); // Actualiza números centrales
            renderActiveList();

            if (typeof updateMenu === 'function') {  //actualiza menú per visualitzar-ho tot
                updateMenu();
            }
        }
    });
}



/* Añadir las funciones que consideréis necesarias*/
