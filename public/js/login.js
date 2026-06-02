const skjema = document.querySelector("#innlogging");

skjema.addEventListener("submit", login);
const mailEl = document.querySelector("#mail");
const passEl = document.querySelector("#passord");


async function login(e) {
    e.preventDefault();

    const mail = mailEl.value.trim();
    const passord = passEl.value.trim();

    // Prøver å logge inn ved å sende inn mail og passord fra inputfeltene
    const res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mail, passord})
    });

    // Hvis brukeren "godkjennes" får den en velkomstmelding, ellers en melding om feil mail eller passord
    if (res.ok) {
        const data = await res.json();
        alert(`Velkommen, ${data.fornavn}!`);
        window.location.href = "../index.html"; 
    }
    else {
        // Skal endres for å unngå popups
        alert("Feil mailadresse eller passord");
    }

}