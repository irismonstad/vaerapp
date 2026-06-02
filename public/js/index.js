// Henter element for skjema og legger eventlistener på submit-knapp
skjema = document.querySelector("#sok");
skjema.addEventListener("submit", sokStasjon);

const temperaturEl = document.querySelector("#stat_temp");

const stasjonEl = document.querySelector("#stasjon");

const dropdownEl = document.querySelector("#dropdown");
dropdownEl.addEventListener("change", hentTemperatur);

let navn = "";
let id = "";
let lengdegrad = 0;
let breddegrad = 0;

async function sokStasjon(e) {
    e.preventDefault();
    // Henter ut teksten fra søkefeltet
    const stasjonSok = stasjonEl.value.trim();

    try {
        const resultat = await fetch(`/frost/sok?navn=${stasjonSok}`);
        const respons = await resultat.json();

        // Sjekker om søket ga resultater, return hvis ikke
        if (!respons.data || respons.data.length === 0){
            console.log("Fant ingen stasjon med det navnet.");
            return;
        }

        // Oppdaterer dataverdiene for adressen
        id = respons.data[0].id;
        navn = respons.data[0].name;
        lengdegrad = respons.data[0].geometry.coordinates[0];
        breddegrad = respons.data[0].geometry.coordinates[1];

        hentTemperatur(id);

        console.log(id, navn, lengdegrad, breddegrad);

        const res = await fetch('/api/lagreStasjon', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({id, navn, lengdegrad, breddegrad})
        });

        fyllDropdown();
    }
    catch (error) {
        console.error("Feil under søk eller lagring:", error);
    }  
};

async function hentTemperatur(stasjonId) {
    const dropdown_id = dropdownEl.value;

    // Sjekker om stasjonId eksisterer, og om stasjonId har en .target attributt (er da et event-objekt fra dropdown meny), hvis ja, bruk dropdown valg, hvis ikke bruk søket
    const aktivId = (stasjonId && stasjonId.target) ? dropdownEl.value : (stasjonId || dropdownEl.value);
    // Hvis det ikke er noe gyldig id, stopp funksjonen
    if (!aktivId) return;

    try {
        const resultat = await fetch(`/frost/temperatur?id=${aktivId}`);
        const respons = await resultat.json();

        console.log(respons);

        if (respons.error || !respons.data || respons.data.length === 0) {
            temperaturEl.innerHTML = `<p>Ingen måledata</p>`
            return;
        }

        temperaturer = respons.data[0].observations;
        sistetemperatur = temperaturer[temperaturer.length - 1];
        temperatur = sistetemperatur.value;
        console.log(temperatur);
        temperaturEl.innerHTML = `<p>Temperatur nå: ${temperatur} C</p>`
    }
    catch (error) {
        console.error("Feil under henting av temperatur:", error);
        temperaturEl.innerHTML = `<p>Kunne ikke hente</p>`
    }
};

async function fyllDropdown() {
    try {
        const resultat = await fetch('/api/hentStasjoner');
        const respons = await resultat.json();

        console.log(respons);

        dropdownEl.innerHTML = '<option value="">Velg stasjon...</option>';

        for (const stasjon of respons) {
            let element = document.createElement('option');
            element.innerHTML = stasjon.navn;
            element.value = stasjon.id;
            dropdownEl.appendChild(element);
        }
    }
    catch (error){
        console.error("Kunne ikke fylle dropdown:", error);
    }
}

window.addEventListener("DOMContentLoaded", fyllDropdown);