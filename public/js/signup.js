const skjema = document.querySelector("#skjema");
skjema.addEventListener("submit", lagBruker);

const mailEl = document.querySelector("#mail");
const brukernavnEl = document.querySelector("#brukernavn");
const passordEl = document.querySelector("#passord");


async function lagBruker(e) {
    e.preventDefault();

    const mail = mailEl.value.trim();
    const brukernavn = brukernavnEl.value.trim();
    const passord = passordEl.value.trim();

    const res = await fetch('/lagBruker', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({mail, brukernavn, passord})
    });

    const feedback = document.createElement('p')
    document.body.appendChild(feedback);
    feedback.innerHTML = `<p>${mail} har opprettet bruker!`

};