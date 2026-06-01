/**
 * anime.js — Página principal de índice de anime
 * Gestiona la carga desde la API/caché, filtros, paginación y listas.
 */

/* =====================================================
   Estado de la aplicación
===================================================== */
let allAnime      = [];   // Todos los anime cargados (objetos Anime)
let filteredAnime = [];   // Anime tras aplicar los filtros activos
let displayedCount = 0;   // Cuántos se muestran actualmente
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
        console.log("Usuari autenticat correctament:", currentUser.username);
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
  //  buildGenreFilters();

    // Restaurar filtros si se viene del detalle
  //  restoreFilters();

    // Aplicar filtros y renderizar
   // applyFiltersAndRender();

    // Eventos de los controles de filtro


    // Eventos de los botones de ordenamiento


    // Botón "Cargar más"


    //dibuixem les targetes dels animes
    renderAnimeCards(filteredAnime);
    
});

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

/* =====================================================
   Tarjetas de Anime
===================================================== */

/** Crea el elemento HTML de una tarjeta de anime */

function renderAnimeCards(animeList) {
    const animeContainer = document.getElementById('animeContainer'); //agafem el contenidor de anime.html
    animeContainer.innerHTML = ""; //neteja el contenidor abans de dibuixar

    // recorrem un a un els animes que volem mostrar
    for (let i = 0; i < animeList.length; i++) {
        let anime = animeList[i];
        //creem caixa de text amb el codi html
        let cardHTML = `  
            <div class="anime-card">
                <img src="${anime.imageUrl}" alt="${anime.title}" class="anime-img">
                <div class="anime-info">
                    <h3 class="anime-title">${anime.title}</h3>
                    <p class="anime-genres"><strong>Gèneres:</strong> ${anime.genres}</p>
                    <p class="anime-score"><strong>Puntuació:</strong> ⭐ ${anime.score}</p>
                    <p class="anime-status"><strong>Estat:</strong> ${anime.status}</p>
                </div>
                <div class="anime-actions">
                    <button class="btn-list btn-watching" data-id="${anime.id}">Veient</button>
                    <button class ="btn-list btn-plan" data-id="${anime.id}">Planificat</button>
                </div>
            </div>`;

        // afegim aquesta targeta al final del contenidor
        animeContainer.innerHTML = animeContainer.innerHTML + cardHTML;

    }

}
//...
//...
//...
/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Gestión de listas
===================================================== */

/* Añadir las funciones que consideréis necesarias*/

/* =====================================================
   Loader / spinner
===================================================== */

function showLoader(visible) {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = visible ? 'flex' : 'none';
}


/* Añadir las funciones que consideréis necesarias*/
