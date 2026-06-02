require('dotenv').config();
// Henter element for skjema og legger eventlistener på submit-knapp
// skjema = document.querySelector("#sok");
// skjema.addEventListener("submit", sokStasjon);
// const temperaturEl = document.querySelector("#stat_temp");

// const stasjonEl = document.querySelector("#stasjon");

let navn = "";
let id = "";
let lengdegrad = 0;
let breddegrad = 0;

async function sokStasjon() {
    // e.preventDefault();
    // Henter ut teksten fra søkefeltet
    // const stasjonSok = stasjonEl.value.trim();
    stasjonSok = "Bergen - Florida";

    const clientId = process.env.FROSTAPI;
    const base64Credentials = Buffer.from(`${clientId}:`).toString('base64');

    const headers = {
        'Authorization': `Basic ${base64Credentials}`
    };

    const resultat = await fetch(`https://frost.met.no/sources/v0.jsonld?municipality=bergen&name=${stasjonSok}`, {headers});
    const respons = await resultat.json();

    // console.log(respons);

    // Oppdaterer dataverdiene for adressen
    id = respons.data[0].id;
    navn = respons.data[0].name;
    lengdegrad = respons.data[0].geometry.coordinates[0];
    breddegrad = respons.data[0].geometry.coordinates[1];
    fyllTopBar(id);

    console.log(id, navn, lengdegrad, breddegrad);
};

async function fyllTopBar() {
    // e.preventDefault();
    const clientId = process.env.FROSTAPI;
    const base64Credentials = Buffer.from(`${clientId}:`).toString('base64');
    const headers = {
        'Authorization': `Basic ${base64Credentials}`
    };

    const resultat = await fetch(`https://frost.met.no/observations/v0.jsonld?sources=${id}&referencetime=latest&elements=air_temperature`, {headers});
    const respons = await resultat.json();

    // console.log(respons);

    temperatur = respons.data[0].observations[0].value;
    console.log(temperatur);
    // temperaturEl.innerHTML = `<p>Temperatur nå: ${temperatur} C<p>`

};
sokStasjon();