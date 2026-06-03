/**
 * anime.js — Página principal de índice de anime
 * Gestiona la carga desde la API/caché, filtros, paginación y listas.
 */

/* =====================================================
   Estado de la aplicación
===================================================== */
let allAnime      = [];   // Todos los anime cargados (objetos Anime)
let filteredAnime = [];   // Anime tras aplicar los filtros activos
let displayedCount = 24;   // començarem mostrant 24 animes
let allGenres     = [];   // Lista completa de géneros [{id, name}]
let selectedGenres = new Set(); // IDs de géneros seleccionados
let currentUser;          // Objeto User del usuario logueado

/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Inicialización
===================================================== */
document.addEventListener('DOMContentLoaded', async function () {
    //localStorage.removeItem('anime_cache');  //netegem cache d'animes per fer comprobacións de càrrega ********

    // Verifiquem autenticació
    if (sessionStorage.getItem('isLogged') !== 'true') {
        window.location.href = 'index.html'; //dirigim a index.html si isLogged es false
        return;
    }
    
    sessionStorage.removeItem('activeListKey'); //reset a activeListKey, per si hem passat per listas i ha canviat el valor

    // Carreguem usuari actual
    const currentUsername = localStorage.getItem('username');
    const rawUserData = localStorage.getItem(`user_${currentUsername}`);

    if (rawUserData) {
        const userData = JSON.parse(rawUserData);
        // recuperem objectes  de les llistes de l'usuari  
        const watchingList = new AnimeList(userData.watching || [], "Veient actualment", 10);
        const planList = new AnimeList(userData.planToWatch || [], "Llista planificada", Infinity);
        
        // Reconstruim l'objecte user  
        currentUser = new User(
            userData.name, userData.surname, userData.address, userData.city, 
            userData.postalCode, userData.email, userData.username, userData.password, 
            watchingList, planList
        );
        console.log("Usuari autenticat correctament:", currentUser.username); //comprobació d'usuari autenticatt
    }
    

    showLoader(true);

    try {
        // Cargar géneros y anime (desde caché o API)
        allGenres = await loadGenres();
        allAnime = await loadAnimeList();
        filteredAnime = [...allAnime];
        console.log("Gèneres carregats: "+ allGenres.length+ " Animes carregats: "+ allAnime.length); //comprobació

    } catch (err) {
        console.error('Error al cargar datos:', err);
        document.getElementById('animeContainer').innerHTML =
            '<p class="no-results">Error al cargar los datos. Recarga la página.</p>';
    }

    showLoader(false);

    

    // Construir filtros de género
    buildGenreFilters();

    // Restaurar filtros si se viene del detalle
  //  restoreFilters();

    // Aplicar filtros y renderizar
    applyFiltersAndRender();

    // Eventos de los controles de filtro
    const genreSelect = document.getElementById('typeFilter'); //busquem el select de generes
    genreSelect.addEventListener('change', function() { //escoltem si hi ha algun canvi d'estat
        applyFiltersAndRender();   //cridem a la funció per imprimir els animes
        });
    

    const statusSelect = document.getElementById('statusFilter'); //busquem el select de status en el dom
    statusSelect.addEventListener('change', function(){ //escoltem si hi h a algun canvi d'estat
        applyFiltersAndRender();   //apliquem filtres
    
    });

    const scoreInput = document.getElementById('minScoreFilter'); //select de puntuacio
    scoreInput.addEventListener('change', function(){ //escoltem si hi ha algun canvi d'estat
        applyFiltersAndRender();   //apliquem filtres
    });

    const clearBtn = document.getElementById('clearFiltersBtn'); //botó per netejar els filtres
    clearBtn.addEventListener('click', function(){ 
        genreSelect.value = "";  //resetejem filtres
        statusSelect.value = "";
        scoreInput.value = "";

        applyFiltersAndRender(); //apliquem filtres
    });


    // Eventos de los botones de ordenamiento
    const sortButton = document.querySelectorAll('.btn-sort'); //agafem els botons per la class btn-sort
    const sortDiv = document.getElementById('sortOrder'); //agafem el contenidor dels botons

    for (let i = 0; i < sortButton.length; i++) { 
        sortButton[i].addEventListener('click', function(){   //escoltem si hi ha algun canvi d'estat per cada botó

            for (let j = 0; j < sortButton.length; j++) { //netegem l'estil de tots els botons
                sortButton[j].classList.remove('active');

            }
            sortButton[i].classList.add('active'); //active només el botó clicat

            const newOrder = sortButton[i].getAttribute('data-sort');
            sortDiv.setAttribute('data-value', newOrder); //guardem el nou ordre al contenidor


            applyFiltersAndRender();   //cridem a la funció per imprimir els animes



        });

    }

    // botons watching i planificat
    const container= document.getElementById('animeContainer'); //agafem contenidor del DOM
    
    container.addEventListener('click', function(e) {  //escoltem clics dins el contenidor animeContainer
        const animeId = parseInt(e.target.getAttribute('data-id')); //recuperem l'id de l'anime associat al botó clicat

        if (e.target.classList.contains('buttonwatching')) { //si el botó clicat és de class buttonwatching
            addAnimeToList(animeId,'watching'); //afegim l'anime a la llista watching
        } else if (e.target.classList.contains('buttonplan')) { //si el botó clicat és de classe buttonplan
            addAnimeToList(animeId,'plan'); //afegim l'anime a la llista planificats
        }


    });
    

    // Botón "Cargar más"
    const loadMoreBtn = document.getElementById('loadMoreBtn'); //agafem botó carregar del DOM
    loadMoreBtn.addEventListener('click', function() {
            displayedCount = displayedCount + 24; // ampliem el contador d'animes mostrats
            renderAnimeCards(filteredAnime);     // imprimirm animes
        }
    );


    //dibuixem les targetes dels animes
    renderAnimeCards(filteredAnime);
    
})

/* =====================================================
   Carga de datos (API + caché localStorage)
===================================================== */

/**
 * Pausa la ejecución N milisegundos (para respetar rate limits).
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Petición a la API con manejo de error 429 (rate limit).
 * Reintenta automáticamente si recibe 429.
 */
async function fetchWithRateLimit(url, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(url);
        if (response.ok) return response.json();
        if (response.status === 429) {
            console.warn(`Rate limit (429). Esperando 2s... (intento ${attempt + 1}/${retries})`);
            await delay(5000);
        } else {
            throw new Error(`Error HTTP ${response.status} al consultar ${url}`);
        }
    }
    throw new Error('Se superó el número de reintentos por rate limit.');
}

/**
 * Carga géneros desde caché o API.
 * @returns {Array} Lista de géneros [{id, name}]
 */
async function loadGenres() {
    //comprobem si h iha gèneres a la cache  
    const cachedGenres = localStorage.getItem('genres_cache');
    if (cachedGenres) {
        return JSON.parse(cachedGenres);
    }

    await delay(API_DELAY_MS);
    const data   = await fetchWithRateLimit(`${API_BASE}/genres/anime`);
    //...
    const genres = data.data.map(g => ({ id: g.mal_id, name: g.name })); //ens quedem amb id i name

    // Guardem en localstorage per la propera vegada
    localStorage.setItem('genres_cache', JSON.stringify(genres));
    return genres;
}

/**
 * Carga la lista de anime desde caché o API (4 páginas × 25 = 100 anime).
 * @returns {Array<Anime>} Lista de objetos Anime
 */
async function loadAnimeList() {

    // Usar caché si es válida
    const cachedAnime = localStorage.getItem('anime_cache'); //reguperem la cache d'animes
    if (cachedAnime) {   
        const rawList = JSON.parse(cachedAnime);
        // recuperem objectes 
        return rawList.map(a => new Anime(
            a.id,          // malId
            a.title,       // title
            "",            // titleJapanese
            "",            // synopsis
            a.image,       // imageUrl 
            "",            // type
            0,             // episodes
            a.status,      // status
            a.score,       // score
            a.genres,      // genres
            "",            // studios
            "",            // aired
            0,             // popularity
            0              // rank
        ));
    }

    let allAnimesRaw = [];  //allAnimesRaw a punt per rebre les dades 

    //descarreguem dades de la api
    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
        //...
        await delay(API_DELAY_MS); //afegim delay per no saturar la api  

        const url  = `${API_BASE}/anime?order_by=popularity&sort=asc&limit=${ANIME_PER_PAGE}&page=${page}`;
        //...
        const result = await fetchWithRateLimit(url); //els resultats els guardem a result
        if (result && result.data) {
            allAnimesRaw = allAnimesRaw.concat(result.data); //concat per combinar arrays
        }
    }
    
    //extraiem totes les dades que ens interessen  
    
    let processedAnimes = [];

    //recorrem l'array  per extreure gèneres i imatges
        for (let i = 0; i<allAnimesRaw.length; i++) {
            let animeBrut = allAnimesRaw[i];

            

            // guardem els gèneres
            let llistaGeneresText = [];
            for (let j = 0; j < animeBrut.genres.length; j++) {
            llistaGeneresText.push(animeBrut.genres[j].name); //anem afegint
            }

            // agafem la url de la imatge
            let urlImatge = "";
            if (animeBrut.images && animeBrut.images.jpg) {
                urlImatge = animeBrut.images.jpg.image_url;
            }

            // c1reem l'objecte amb l'estructura que sens demana
            let animeNet = {
                id: animeBrut.mal_id,
                title: animeBrut.title,
                image: urlImatge,
                genres: llistaGeneresText,
                score: animeBrut.score ? animeBrut.score : 0, // Si no té nota, guardem un 0
                status: animeBrut.status
            };

            // El fiquem dins de la nostra llista
            processedAnimes.push(animeNet);
        }

    // Guardem el bloc complet d'animes al localstorage per a la propera vegada
    localStorage.setItem('anime_cache', JSON.stringify(processedAnimes));

    // convertim aquests objectes en instàncies reals de la class Anime
    let llistaObjectesAnime = [];
    for (let i = 0; i < processedAnimes.length; i++) {
        let a = processedAnimes[i];

        let nouAnime = new Anime(
            a.id,          // malId
            a.title,       // title
            "",            // titleJapanese
            "",            // synopsis
            a.image,       // imageUrl
            "",            // type
            0,             // episodes
            a.status,      // status
            a.score,       // score
            a.genres,      // genres
            "",            // studios
            "",            // aired
            0,             // popularity
            0              // rank
        );
        llistaObjectesAnime.push(nouAnime);
    }

    return llistaObjectesAnime;
  

}  
    //...
    //...
    //...


/* =====================================================
   Funciones para contrl de la Caché (localStorage)
===================================================== */

//...
//...
/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Filtros
===================================================== */

/* Añadir las funciones que consideréis necesarias*/

function buildGenreFilters() {
    const genreSelect = document.getElementById('typeFilter'); //busquem el contenidor select de gèneres

    genreSelect.innerHTML = '<option value="">Todos los géneros</option>'; //opció per defecte sense filtre

    //fem recerca dels gèneres disponibles
    let activeGenres = [];
    for (let i=0; i <allAnime.length; i++){
        //let anime=allAnime[i];

        for (let j=0; j<allAnime[i].genres.length; j++) {  //mirem dins tots els gèneres de cada anime
            if (!activeGenres.includes(allAnime[i].genres[j])) {
                activeGenres.push(allAnime[i].genres[j]);
            }
        }
    
    }
    for (let i = 0; i < activeGenres.length; i++) { //crreem les opcions del select a html
        genreSelect.innerHTML = genreSelect.innerHTML + `<option value="${activeGenres[i]}">${activeGenres[i]}</option>`;
    }
}

function applyFiltersAndRender() {
    displayedCount = 24; //reiniciem el contador

    const genreFilter = document.getElementById('typeFilter').value; //recuperem el text del select de gèneres
    if (genreFilter === "") {  //si no n'hi ha cap de seleccionat mostrem tot
        filteredAnime = [...allAnime];
    } else {
        filteredAnime = []; //netegem la llista
        for (let i =0; i < allAnime.length; i++){
            if (allAnime[i].genres.includes(genreFilter)){  //busquem si el gènere seleccionat encaixa amb el gènere de l'anime
                filteredAnime.push(allAnime[i]); //i creem la llista filtrada
            }
        }
    
    }

    const statusSelect = document.getElementById('statusFilter'); //agafem el select del DOM
    console.log("valor status seleccionat: "+statusSelect.value); //comprobació del valor seleccionat
    if (statusSelect && statusSelect.value !== "") {  //si s'ha seleccionat algo

        // relacionem amb el format que dona la api
        let apiStatus="";
        if (statusSelect.value === "airing") {
            apiStatus = "Currently Airing";
        } else if (statusSelect.value === "complete") {
            apiStatus = "Finished Airing";
        } else if (statusSelect.value === "upcoming") {
            apiStatus = "Not yet aired";
        }



        let statusList = [];  //reset a la llista
        for (let i = 0; i < filteredAnime.length; i++) { //passegem la llista per buscar
            if (filteredAnime[i].status === apiStatus) {
                statusList.push(filteredAnime[i]);  //omplim la llista amb els animes que compleixin status
            }
        
        }
        filteredAnime= statusList; //actualizem llistra filtrada
    }

    const scoreInput = document.getElementById('minScoreFilter'); //agafem el select puntuació del dom
    if (scoreInput.value > 0) {   //si el valor és més gran que 0
        let scoreList =[];
        for (let i = 0; i < filteredAnime.length; i++) {
            if (filteredAnime[i].score >= scoreInput.value) {
                scoreList.push(filteredAnime[i]);  //busquem i afegim els que encaixen
            }
        }
        filteredAnime = scoreList; //actualitzem llista filtrada
    }


    //botons d'ordre
    const sortDiv= document.getElementById('sortOrder');
    const order= sortDiv.getAttribute('data-value'); //recuperem el tipus d'ordre seleccionat

    filteredAnime.sort(function(a,b) {
        if (order === "titleAsc") {   //alfabètic ascendent
            if(a.title < b.title) return -1;
            if(a.title > b.title) return 1;
            return 0;
        } else if (order === "titleDesc") { //alfabètic descendent
            if(a.title > b.title) return -1;
            if( a.title < b.title) return 1;
            return 0;
        } else if (order === "scoreAsc") { //puntuació ascendent
            return a.score - b.score;

        } else if (order === "scoreDesc") { //puntuació descendent
            return b.score - a.score;
        } else if (order === "popularity") {
            return a.popularity - b.popularity;  //per defecte per popularitat
        }
        return 0;
    })


    renderAnimeCards(filteredAnime); //mostrem

}


/* =====================================================
   Tarjetas de Anime
===================================================== */

/** Crea el elemento HTML de una tarjeta de anime */

function renderAnimeCards(animeList) {
    const animeContainer = document.getElementById('animeContainer'); //agafem el contenidor de anime.html
    animeContainer.innerHTML = ""; //neteja el contenidor abans de dibuixar

    //el max d'animes que mostrem és el num més petit entre la llargada de la llista i el num definit de màxims animes per mostrar
    const maxVisualAnimes = Math.min(animeList.length, displayedCount); 

    // recorrem un a un els animes que volem mostrar
    for (let i = 0; i < maxVisualAnimes; i++) {
        let anime = animeList[i];
        //creem caixa de text amb el codi html
        let cardHTML = `  
            <div class="anime-card">
                <img src="${anime.imageUrl}" alt="${anime.title}" class="anime-img">
                <div class="anime-info">
                    <h3 class="anime-title">${anime.title}</h3> 
                    <p class="anime-genres"><strong>Gèneres:</strong> ${anime.genres}</p>
                    <p class="anime-score"><strong>Puntuació:</strong> ${anime.score}</p>
                    <p class="anime-status"><strong>Estat:</strong> ${anime.status}</p>
                </div>
                <div class="anime-actions">
                    <button class="buttonwatching" data-id="${anime.malId}">Veient</button>
                    <button class ="buttonplan" data-id="${anime.malId}">Planificat</button>
                </div>
            </div>`;

        // afegim aquesta targeta al final del contenidor
        animeContainer.innerHTML = animeContainer.innerHTML + cardHTML;

    }

    console.log("Targetes mostrades: "+maxVisualAnimes); //comprovació


}
//...
//...
//...
/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Gestión de listas
===================================================== */

/* Añadir las funciones que consideréis necesarias*/

function addAnimeToList (animeId, listType) {  //per afegir un anime a una llista

    let findedAnime = ''; //variable ressetejada
    for (let i = 0; i < allAnime.length; i++) { //passegem per tots els animes
        if (allAnime[i].malId === animeId) {   //si el trobem el guardem
            findedAnime= allAnime[i];
        }
    }

    //depenent de la llista l'afegim a una o l'altra
    if (listType === 'watching') {
        currentUser.watching.addAnime(findedAnime);
        //console.log("anime afegit a watching: "+ findedAnime.title); //comprovació
    } else if (listType === 'plan') {
        currentUser.planToWatch.addAnime(findedAnime);
        //console.log("anime afegit a planToWatch: "+ findedAnime.title); //comprovació
    }

    //per guardar a localstorage creem l0objecte
    const dataToSave = {
        name: currentUser.name,
        surname: currentUser.surname,
        address: currentUser.address,
        city: currentUser.city,
        postalCode: currentUser.postalCode,
        email: currentUser.email,
        username: currentUser.username,
        password: currentUser.password,
        watching: currentUser.watching.items, 
        planToWatch: currentUser.planToWatch.items
    };
    localStorage.setItem(`user_${currentUser.username}`, JSON.stringify(dataToSave)); //guardem

    updateMenu();
}

/* =====================================================
   Loader / spinner
===================================================== */

function showLoader(visible) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = visible ? 'flex' : 'none';
}


/* Añadir las funciones que consideréis necesarias*/
