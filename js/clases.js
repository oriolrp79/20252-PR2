/**
 * clases.js — Clases principales de la aplicación
 * Incluye: Anime, AnimeList, User
 */

/* ===========================
   CLASE ANIME
   Representa un anime individual con toda su información.
   =========================== */
class Anime {
    #malId;
    #title;
    #titleJapanese;
    #synopsis;
    #imageUrl;
    #type;
    #episodes;
    #status;
    #score;
    #genres;
    #studios;
    #aired;
    #popularity;
    #rank;

    /* Constructor de la clase Anime */
    constructor (malId, title, titleJapanese, synopsis, imageUrl, type, episodes, status, score, genres, studios, aired, popularity, rank) {
        this.#malId = malId;
        this.#title = title;
        this.#titleJapanese = titleJapanese;
        this.#synopsis = synopsis;
        this.#imageUrl = imageUrl;
        this.#type = type;
        this.#episodes = episodes;
        this.#status = status;
        this.#score = score;
        this.#genres = genres;
        this.#studios = studios;
        this.#aired = aired;
        this.#popularity = popularity;
        this.#rank = rank;
    }

    /* --- Getters --- */
    get malId() {
        return this.#malId;
    }

    get title() {
        return this.#title;
    }

    get titleJapanese() {
        return this.#titleJapanese;
    }

    get synopsis() {
        return this.#synopsis;
    }

    get imageUrl() {
        return this.#imageUrl;
    }

    get type() {
        return this.#type;
    }

    get episodes() {
        return this.#episodes;
    }

    get status() {
        return this.#status;
    }

    get score() {
        return this.#score
    }
    get genres() {
        return this.#genres;
    }

    get studios() {
        return this.#studios;
    }

    get aired() {
        return this.#aired;
    }

    get popularity() {
        return this.#popularity;
    }

    get rank() {
        return this.#rank;
    }

    /* --- Setters --- */


    /** Serializa el anime a un objeto plano para localStorage */
    toJSON() {
        //...
    }

    /** Crea un Anime desde datos guardados en localStorage */
    fromJSON(data) {
        //...
    }

    /* Añadir las funciones que consideréis necesarias*/
}


/* ===========================
   CLASE ANIMELIST
   Gestiona una lista de animes (con límite opcional).
   =========================== */
class AnimeList {
    #items;
    #name;
    #maxItems;

    /* Constructor de la clase AnimeList */

    /* --- Getters --- */

    /* --- Métodos de gestión --- */

    /** Añade un anime a la lista */
    addAnime(anime) {
        //...
    }

    /** Elimina un anime por su ID */
    removeAnime(malId) {
        //...
    }

    //...

    /** Serializa la lista para localStorage */
    toJSON() {
        //...
    }

    fromJSON(data) {
        //...
    }

    /* Añadir las funciones que consideréis necesarias*/
}


/* ===========================
   CLASE USER
   Gestiona un usuario con sus listas y datos personales.
   =========================== */
class User {
    #name;
    #surname;
    #address;
    #city;
    #postalCode;
    #email;
    #username;
    #password;
    #watching;     // AnimeList — máx. 10
    #planToWatch;  // AnimeList — sin límite

    /*Constructor de la clase User */

    /* --- Getters --- */
    
    /* --- Setters --- */


    //...

    /** Guarda el usuario en localStorage (nuevo usuario) */
    save() {
        //...
    }

    /** Actualiza los datos del usuario en localStorage */
    update() {
        //...
    }

    /** Objeto plano serializable para localStorage */
    #toStorageObject() {
        //...
    }

    /** Carga un usuario desde localStorage dado su nombre de usuario */
    loadFromStorage(username) {
        //...
    }

    /* Añadir las funciones que consideréis necesarias*/
}
