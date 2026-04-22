/**
 * config.js — Configuración global, datos estáticos y constantes
 */

/* --- API --- */
const API_BASE        = 'https://api.jikan.moe/v4';
const API_DELAY_MS    = 650;   // ms entre peticiones (límite: 2 req/s)
const ANIME_PER_PAGE  = 25;    // máximo que permite la API
const PAGES_TO_FETCH  = 4;     // 4 × 25 = 100 anime en caché
const CACHE_TTL_HOURS = 24;    // horas de validez de la caché
const ITEMS_PER_VIEW  = 25;    // anime mostrados por "página" en el índice

/* --- Listas --- */
const LIST_KEYS = {
    watching:    'watching',
    planToWatch: 'planToWatch',
};

const LIST_LABELS = {
    watching:    'Viendo actualmente',
    planToWatch: 'Plan to Watch',
};

/* --- Municipios con código postal (para el formulario de registro) --- */
const cities = [
    { name: 'Alicante',                    postalCode: '03001' },
    { name: 'Almería',                     postalCode: '04001' },
    { name: 'Ávila',                       postalCode: '05001' },
    { name: 'Badajoz',                     postalCode: '06001' },
    { name: 'Palma de Mallorca',           postalCode: '07001' },
    { name: 'Barcelona',                   postalCode: '08001' },
    { name: 'Burgos',                      postalCode: '09001' },
    { name: 'Cáceres',                     postalCode: '10001' },
    { name: 'Cádiz',                       postalCode: '11001' },
    { name: 'Castellón de la Plana',       postalCode: '12001' },
    { name: 'Ciudad Real',                 postalCode: '13001' },
    { name: 'Córdoba',                     postalCode: '14001' },
    { name: 'La Coruña',                   postalCode: '15001' },
    { name: 'Cuenca',                      postalCode: '16001' },
    { name: 'Girona',                      postalCode: '17001' },
    { name: 'Granada',                     postalCode: '18001' },
    { name: 'Guadalajara',                 postalCode: '19001' },
    { name: 'San Sebastián',               postalCode: '20001' },
    { name: 'Huelva',                      postalCode: '21001' },
    { name: 'Huesca',                      postalCode: '22001' },
    { name: 'Jaén',                        postalCode: '23001' },
    { name: 'Logroño',                     postalCode: '26001' },
    { name: 'Lugo',                        postalCode: '27001' },
    { name: 'Madrid',                      postalCode: '28001' },
    { name: 'Málaga',                      postalCode: '29001' },
    { name: 'Murcia',                      postalCode: '30001' },
    { name: 'Pamplona',                    postalCode: '31001' },
    { name: 'Orense',                      postalCode: '32001' },
    { name: 'Oviedo',                      postalCode: '33001' },
    { name: 'Palencia',                    postalCode: '34001' },
    { name: 'Las Palmas de Gran Canaria',  postalCode: '35001' },
    { name: 'Pontevedra',                  postalCode: '36001' },
    { name: 'Salamanca',                   postalCode: '37001' },
    { name: 'Santa Cruz de Tenerife',      postalCode: '38001' },
    { name: 'Santander',                   postalCode: '39001' },
    { name: 'Segovia',                     postalCode: '40001' },
    { name: 'Sevilla',                     postalCode: '41001' },
    { name: 'Soria',                       postalCode: '42001' },
    { name: 'Tarragona',                   postalCode: '43001' },
    { name: 'Teruel',                      postalCode: '44001' },
    { name: 'Toledo',                      postalCode: '45001' },
    { name: 'Valencia',                    postalCode: '46001' },
    { name: 'Valladolid',                  postalCode: '47001' },
    { name: 'Bilbao',                      postalCode: '48001' },
    { name: 'Zamora',                      postalCode: '49001' },
    { name: 'Zaragoza',                    postalCode: '50001' },
    { name: 'Vitoria-Gasteiz',             postalCode: '01001' },
    { name: 'León',                        postalCode: '24001' },
    { name: 'Lérida',                      postalCode: '25001' },
];
