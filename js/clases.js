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
    set score(newScore){
        this.#score = newScore;
    }
    set popularity(newPopularity){
        this.#popularity = newPopularity;
    }
    set rank(newRank){
        this.#rank = newRank;
    }

    /* --- Métodos --- */


    /** Serializa el anime a un objeto plano para localStorage */
    toJSON() {
        //...
        return {
            malId: this.#malId,
            title: this.#title,
            titleJapanese: this.#titleJapanese,
            synopsis: this.#synopsis,
            imageUrl: this.#imageUrl,
            type: this.#type,
            episodes: this.#episodes,
            status: this.#status,
            score: this.#score,
            genres: this.#genres,
            studios: this.#studios,
            aired: this.#aired,
            popularity: this.#popularity,
            rank: this.#rank

        };
    }

    /** Crea un Anime desde datos guardados en localStorage */
    fromJSON(data) {
        //...
        const dataObj= JSON.parse(data);


        this.#malId = dataObj.malId;
        this.#title = dataObj.title;
        this.#titleJapanese = dataObj.titleJapanese;
        this.#synopsis = dataObj.synopsis;
        this.#imageUrl = dataObj.imageUrl;
        this.#type = dataObj.type;
        this.#episodes = dataObj.episodes;
        this.#status = dataObj.status;
        this.#score = dataObj.score;
        this.#genres = dataObj.genres;
        this.#studios = dataObj.studios;
        this.#aired = dataObj.aired;
        this.#popularity = dataObj.popularity;
        this.#rank = dataObj.rank;
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
    constructor (items, name, maxItems){
        this.#items = items; 
        this.#name = name;
        this.#maxItems = maxItems;
    }
    /* --- Getters --- */
    get items(){
        return this.#items;
    }
    get name(){
        return this.#name;
    }
    get maxItems(){
        return this.#maxItems;
    }

    /* --- Setters --- */

    set maxItems(newMax){
        this.#maxItems = newMax;
    }

    /* --- Métodos de gestión --- */


    /** Añade un anime a la lista */
    addAnime(anime) {
        //...
        if (this.#items.length < this.#maxItems) {
            this.#items.push(anime);  /*vaig a l'últim camp+1 i allà hi poso el nou element, ampliant la llista*/
    // ...
        } else {
            alert("Límit d'animes superat. No se'n pot afegir cap més.");
        }
    }

    /** Elimina un anime por su ID */
    removeAnime(malId) {
        //...
        for (let i = 0; i < this.#items.length; i++) {  /*faig repetició per comparar el Id i quan el trobo l'elimino "corrent" els posteriors cap endavant i "tapant-lo"*/
           if (this.#items[i].malId===malId){
                for (let a = i; a < this.#items.length-1; a++) {
                    this.#items[a]=this.#items[a+1];
                }  
                this.#items.pop();  /*l'últim element de la llista, perquè no quedi repetit, l'elimino, així he eliminat l'element demanat i escurçat la llista*/
            }
        }
    //...
    }
    

    //...

    /** Serializa la lista para localStorage */
    toJSON() {   //convertim a un format json
        //...
        return {
            items: this.#items,
            name: this.#name,
            maxItems: this.#maxItems
        }
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
constructor (name, surname, address, city, postalCode, email, username, password, watching, planToWatch) {
    this.#name = name;
    this.#surname = surname;
    this.#address = address;
    this.#city = city;
    this.#postalCode = postalCode;
    this.#email = email;
    this.#username = username;
    this.#password = password;
    this.#watching = watching;
    this.#planToWatch = planToWatch;
}

    /* --- Getters --- */
    get name(){
        return this.#name;
    }
    get surname(){
        return this.#surname;
    }
    get address(){
        return this.#address;
    }
    get city(){
        return this.#city;
    }
    get postalCode(){
        return this.#postalCode;
    }
    get email(){
        return this.#email;
    }
    get username(){
        return this.#username;
    }
    get password(){
        return this.#password;
    }
    get watching(){
        return this.#watching;
    }
    get planToWatch(){
        return this.#planToWatch;
    }

    /* --- Setters --- */
    set name(newName){
        this.#name = newName;
    }
    set surname(newSurname){
        this.#surname = newSurname;
    }
    set address(newAddress){
        this.#address = newAddress;
    }
    set city(newCity){
        this.#city = newCity;
    }
    set postalCode(newPostalCode){
        this.#postalCode = newPostalCode;
    }
    set email(newEmail){
        this.#email = newEmail;
    }
    set username(newUsername){
        this.#username = newUsername;
    }
    set password(newPassword){
        this.#password = newPassword;
    
    }
    set watching(newWatching){
        this.#watching = newWatching;
    }
    set planToWatch(newPlanToWatch){
        this.#planToWatch = newPlanToWatch;
    }


    //...

    /** Guarda el usuario en localStorage (nuevo usuario) */
    save() {
        const id=`user_${this.#username}`;
        const userData = JSON.stringify(this);
        localStorage.setItem(id, userData);
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
    toJSON() {   //para convertir l'objecte a un format json
        return {
            name: this.name,           
            surname: this.surname,
            address: this.address,
            city: this.city,
            postalCode: this.postalCode,
            email: this.email,
            username: this.username,
            password: this.password,
            watching: this.watching,   
            planToWatch: this.planToWatch
        };
    }
}
