/**
 * registro.js — Lógica del formulario de registro con validaciones en JavaScript
 * (sin validaciones HTML5 nativas)
 */

/* Añadir las funciones que consideréis necesarias*/

//declaro les variables que necessito, agafant elements del DOM
const nameUser = document.getElementById('name');
const surnameUser = document.getElementById('surname');
const addressUser = document.getElementById('address');
const cityUser = document.getElementById('city');
const postalCodeUser = document.getElementById('postalCode');
const emailUser = document.getElementById('email');
const usernameUser = document.getElementById('username');
const passwordUser = document.getElementById('password');
const password2User = document.getElementById('password2');

//agafo també els elements per missatges d'error
const nameError = document.getElementById('nameError');
const surnameError = document.getElementById('surnameError');
const addressError = document.getElementById('addressError');
const cityError = document.getElementById('cityError');
const postalCodeError = document.getElementById('postalCodeError');
const emailError = document.getElementById('emailError');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const password2Error = document.getElementById('password2Error');

//faig una funció per mostrar les ciutats i poder-les seleccionar com a desplegable
function selectCity(){
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        cityUser.appendChild(option);   
    });
}
selectCity(); //crido la funció

//escoltem l'event de quan se selecciona una ciutat i busquem el codi postal associat per escriure'l en l'input
cityUser.addEventListener('change', () => {
    const selectedCity = cities.find(city => city.name === cityUser.value);

    if (selectedCity) {
        postalCodeUser.value = selectedCity.postalCode;
        postalCodeUser.setAttribute('value', selectedCity.postalCode);
    } else {
        postalCodeUser.value = "";
    }
});

// fem el pas contrari, quan s'escriu un codi postal comprobem que existeixi a la taula cities i posem la ciutat que li toca
postalCodeUser.addEventListener('input', () => {
    const writtenPostalCode = postalCodeUser.value;
    if (writtenPostalCode.length === 5) {
        const linkedCity = cities.find(city => city.postalCode === writtenPostalCode);
        if (linkedCity) {
            cityUser.value = linkedCity.name;
        } 
    }

});

//escoltem l'event de quan escribim el correu, i a la que es detecta el símbol @ se li afegeix el domini de la uoc
emailUser.addEventListener('input', () => {
    const writtenEmail = emailUser.value;
    if (writtenEmail.includes('@')) {
        emailUser.value= writtenEmail+'uoc.edu';
    }

});

//provem el localStorage per veure si guarda i comproba bé la informació del username
//localStorage.setItem('username', "prova");

// escoltem l'event d'introducció de Username i declarem una variable per saber si el que s'ha introduït és vàlid o noo
let validUsername= true;
usernameUser.addEventListener('input', () => {
    const writtenUsername = usernameUser.value;
    if (writtenUsername===localStorage.getItem('username')){
        usernameError.textContent = 'El nom d\'usuari ja existeix';
        validUsername=false;
    } else { 
        usernameError.textContent = '';
        validUsername=true;
    }
});

//escoltem l'event d'introducció del password i declarem variable per saber si el password és vàlid segons les condicions que hem posat
let validPassword=false;
passwordUser.addEventListener('input', () => {
    const writtenPassword = passwordUser.value;
    // logica amb .test() consultada a https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
    // per comprovar si el password conté els caràcters que volem
    const numbers= /\d/.test(writtenPassword);
    const letters= /[a-zA-Z]/.test(writtenPassword);
    const specialChar= /[!@#$%^&*()_+{}|;:,.<>?]/.test(writtenPassword);
  
    if ((writtenPassword.length>=8)&&(numbers) && (letters) && (specialChar)) {
        validPassword=true;
    } else {
        validPassword=false;
    }
    
});


//escoltem el click del botó de guardar les dades del formulari, i comprobem una a una que les dades siguin vàlides, i si no ho son mostrem missatge d'error
document.getElementById('saveButton').addEventListener('click', () => {
    if (nameUser.value===""){
        nameError.textContent = 'El nom no pot estar buit';
    } else { nameError.textContent = '';}
    if (surnameUser.value===""){
        surnameError.textContent = 'El cognom no pot estar buit';
    } else { surnameError.textContent = '';}
    if (addressUser.value===""){
        addressError.textContent = 'L\'adreça no pot estar buida';
    } else { addressError.textContent = '';}
    if (cityUser.value===""){
        cityError.textContent = 'La ciutat no pot estar buida';
    } else { cityError.textContent = '';}
    if (postalCodeUser.value===""){
        postalCodeError.textContent = 'El codi postal no pot estar buit';
    } else { postalCodeError.textContent = '';}
    if (emailUser.value===""){
        emailError.textContent = 'L\'email no pot estar buit';
    } else { emailError.textContent = '';}
    if (usernameUser.value===""){
        usernameError.textContent = 'El nom d\'usuari no pot estar buit';
    } else { usernameError.textContent = '';}
    if (!validPassword){
        passwordError.textContent = 'Mínim 8 caracters, incloure números, lletres i caracters especials';
    } else { passwordError.textContent = '';}
    if (password2User.value===""){
        password2Error.textContent = 'La confirmació de la contrasenya no pot estar buida';
    } else { password2Error.textContent = '';}

    // si totes les dades son vàlides guardarem en el localStorage tota la info i tornarem cap a la pàgina index.html
    if ((nameUser.value.length>0)&&(surnameUser.value.length>0)&&(addressUser.value.length>0)&&(cityUser.value.length>0)&&(postalCodeUser.value.length>0)&&(emailUser.value.length>0)&&(usernameUser.value.length>0)&&(validUsername)&&(passwordUser.value===password2User.value)&&(validPassword)){
        /* guardem les dades per separat, de moment, a localstorage
        localStorage.setItem('name', nameUser.value);
        localStorage.setItem('surname', surnameUser.value);
        localStorage.setItem('address', addressUser.value);
        localStorage.setItem('city', cityUser.value);
        localStorage.setItem('postalCode', postalCodeUser.value);
        localStorage.setItem('email', emailUser.value);
        localStorage.setItem('username', usernameUser.value);
        localStorage.setItem('password', passwordUser.value);*/

        //console.log(localStorage.getItem('username'));  //comprobacions de que ha quedat guardat
        //console.log(localStorage.getItem('password'));

        const watchingList = new AnimeList([], "Veient actualment", 10); 
        const planList = new AnimeList([], "Llista planificada", Infinity);
        
        let currentUser = new User (
        nameUser.value,
        surnameUser.value,
        addressUser.value,
        cityUser.value,
        postalCodeUser.value,
        emailUser.value,
        usernameUser.value,
        passwordUser.value,
        watchingList,
        planList
        );

        console.log(currentUser);

        currentUser.save();  

const comprobacion = JSON.parse(localStorage.getItem(`user_${usernameUser.value}`));
console.log("Objeto completo recuperado:", comprobacion); //comprobacions de que ha quedat guardat

        //window.location.href = 'index.html'; //redirigim a index.html
    }
});

//escoltem el click en el botó de tornar cap a la pagina index.html sense validar el formulari ni guardar res
document.getElementById('backToLoginButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});


 