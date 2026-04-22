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

    // Verificar autenticación
    

    // Cargar usuario actual
    

    showLoader(true);

    try {
        // Cargar géneros y anime (desde caché o API)

    } catch (err) {
        console.error('Error al cargar datos:', err);
        document.getElementById('animeContainer').innerHTML =
            '<p class="no-results">Error al cargar los datos. Recarga la página.</p>';
    }

    showLoader(false);

    // Construir filtros de género
    buildGenreFilters();

    // Restaurar filtros si se viene del detalle
    restoreFilters();

    // Aplicar filtros y renderizar
    applyFiltersAndRender();

    // Eventos de los controles de filtro


    // Eventos de los botones de ordenamiento


    // Botón "Cargar más"
    
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
            await delay(2000);
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
    //...

    await delay(API_DELAY_MS);
    const data   = await fetchWithRateLimit(`${API_BASE}/genres/anime`);
    //...
}

/**
 * Carga la lista de anime desde caché o API (4 páginas × 25 = 100 anime).
 * @returns {Array<Anime>} Lista de objetos Anime
 */
async function loadAnimeList() {

    // Usar caché si es válida


    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
        //...

        const url  = `${API_BASE}/anime?order_by=popularity&sort=asc&limit=${ANIME_PER_PAGE}&page=${page}`;
        //...
    }

    //...
    //...
    //...
}

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
