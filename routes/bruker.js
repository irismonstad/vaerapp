const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/lagBruker', (req, res) => {
    try {
        let {mail, brukernavn, passord} = req.body;
        mail = mail.toString().trim();
        brukernavn = brukernavn.toString().trim();
        passord = passord.toString().trim();

        console.log('Laget bruker ', brukernavn);

        db.prepare('INSERT INTO bruker (mail, brukernavn, passord) VALUES (?, ?, ?)').run(mail, brukernavn, passord);

        return res.sendStatus(201);
    }

    catch (err) {
        console.error('Feil ved opprettelse av bruker');
        return res.status(500).json({error: 'Kunne ikke lage bruker'});
    }
});

router.post('/login', (req, res) => {
    const {mail, passord} = req.body;

    const bruker = db.prepare('SELECT * from bruker WHERE mail = ?').get(mail);

    if (bruker && bruker.passord === passord) {
        req.session.brukerId = bruker.id;
        req.session.brukernavn = bruker.brukernavn;

        return res.status(200).json({brukernavn: bruker.brukernavn});
    }
    
    else {
        return res.status(401).json({ error: "Feil e-post eller passord" });
    }
});

module.exports = router;