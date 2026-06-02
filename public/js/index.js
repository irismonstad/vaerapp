// Henter element for skjema og legger eventlistener på submit-knapp
skjema = document.querySelector("#sok");
skjema.addEventListener("submit", sokStasjon);

// Element for å fylle inn nåværende temperatur
const temperaturEl = document.querySelector("#stat_temp");

// Søkefeltet
const stasjonEl = document.querySelector("#stasjon");

// Dropdown-menyen
const dropdownEl = document.querySelector("#dropdown");
dropdownEl.addEventListener("change", fyllStatistikk);


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
        const id = respons.data[0].id;
        const navn = respons.data[0].name;
        const lengdegrad = respons.data[0].geometry.coordinates[0];
        const breddegrad = respons.data[0].geometry.coordinates[1];

        fyllStatistikk(id);

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

async function fyllStatistikk(stasjonId) {
    const dropdown_id = dropdownEl.value;

    // Sjekker om stasjonId eksisterer, og om stasjonId har en .target attributt (er da et event-objekt fra dropdown meny), hvis ja, bruk dropdown valg, hvis ikke bruk søket
    const aktivId = (stasjonId && stasjonId.target) ? dropdownEl.value : (stasjonId || dropdownEl.value);
    // Hvis det ikke er noe gyldig id, stopp funksjonen
    if (!aktivId) return;

    try {
        const resultat = await fetch(`/api/hentStasjon/${aktivId}`);
        const respons = await resultat.json();

        const navn = respons.navn;
        const lengdegrad = respons.lengdegrad;
        const breddegrad = respons.breddegrad;
    
        const navnEl = document.querySelector("#navn_stasjon");
        navnEl.innerHTML = `${navn}` ;

        const lengdegradEl = document.querySelector("#lengdegrad");
        lengdegradEl.innerText = `Lengdegrader: ${lengdegrad}`;

        const breddegradEl = document.querySelector("#breddegrad");
        breddegradEl.innerHTML = `Breddegrader: ${breddegrad}`;
    }
    catch(error) {
        console.error("Feil under display av statistikk:", error);
    }

    try {
        const resultat = await fetch(`/frost/temperatur?id=${aktivId}`);
        const respons = await resultat.json();

        console.log(respons);

        if (respons.error || !respons.data || respons.data.length === 0) {
            temperaturEl.innerHTML = `<p>Ingen måledata</p>`
            return;
        }


        let temparray = []
        let timearray = []

        for (instans of respons.data) {
            const temp = instans.observations[0].value;
            const time = instans.referenceTime;
            temparray.push(temp);
            timearray.push(time);
        }
        lagGraf(timearray, temparray);
        console.log(temparray, timearray);

        const sistetemperatur = respons.data[respons.data.length - 1].observations[0];
        const temperatur = sistetemperatur.value;
        console.log(temperatur);
        temperaturEl.innerHTML = `<h1>${temperatur}°C</h1>`
    }
    catch (error) {
        console.error("Feil under henting av temperatur:", error);
        temperaturEl.innerHTML = `<p>Kunne ikke hente</p>`
    }
};

function lagGraf(timearray, temparray) {
    const container = document.querySelector('#graph');
    container.innerHTML = '';

    const nyCanvas = document.createElement('canvas');
    nyCanvas.id = 'tempGraf';

    container.appendChild(nyCanvas);

    const ctx = nyCanvas.getContext('2d');

    graf = new Chart(ctx, {
        type: 'line',
        data: {
            labels : timearray.map(tid => tid.slice(11,16)),
            datasets : [{
                label: 'Temperatur over det siste døgnet i °C',
                data: temparray,
                borderColor: 'rgb(75, 192, 192)',
                fill:true

            }]
        },
        options: {
            responsive:true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false 
                }
            }
        }
    }); 
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