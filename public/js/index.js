// Henter element for skjema og legger eventlistener på submit-knapp
skjema = document.querySelector("#sok");
skjema.addEventListener("submit", sokStasjon);
const temperaturEl = document.querySelector("#stat_temp");

const stasjonEl = document.querySelector("#stasjon");
const dropdownEl = document.querySelector("#station");

let navn = "";
let id = "";
let lengdegrad = 0;
let breddegrad = 0;

async function sokStasjon(e) {
    e.preventDefault();
    // Henter ut teksten fra søkefeltet
    const stasjonSok = stasjonEl.value.trim();

    const resultat = await fetch(`/frost/sok?navn=${stasjonSok}`);
    const respons = await resultat.json();

    // Oppdaterer dataverdiene for adressen
    id = respons.data[0].id;
    navn = respons.data[0].name;
    lengdegrad = respons.data[0].geometry.coordinates[0];
    breddegrad = respons.data[0].geometry.coordinates[1];

    fyllTopBar(id);
    console.log(id, navn, lengdegrad, breddegrad);
    
    const res = await fetch('/api/lagreStasjon', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({id, navn, lengdegrad, breddegrad})
        });

    
};

async function fyllTopBar() {
    const resultat = await fetch(`/frost/temperatur?id=${id}`);
    const respons = await resultat.json();

    console.log(respons);

    temperatur = respons.data[0].observations[0].value;
    console.log(temperatur);
    temperaturEl.innerHTML = `<p>Temperatur nå: ${temperatur} C<p>`

};

async function fyllDropdown() {
    const resultat = await fetch('/api/hentStasjoner');
    const respons = await resultat.json();

    console.log(respons);

    for (const stasjon of respons) {
        let element = document.createElement('option');
        element.innerHTML = stasjon.navn;
        element.value = stasjon.id;
        dropdownEl.appendChild(element);
    }
    
}

window.addEventListener("DOMContentLoaded", fyllDropdown);