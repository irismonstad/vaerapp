const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/lagreStasjon', (req, res) => {
    if (!req.session.brukerId) {
        return res.status(401).send("Ikke innlogget");
    }

    // Henter brukerId fra session
    const brukerId = req.session.brukerId;

    try {
        let {id, navn, lengdegrad, breddegrad} = req.body;
        id = id.toString().trim();
        navn = navn.toString().trim();
        lengdegrad = lengdegrad.toString().trim();
        breddegrad = breddegrad.toString().trim();

        db.prepare('INSERT OR IGNORE INTO vaerstasjon (id, navn, lengdegrad, breddegrad) VALUES (?, ?, ?, ?)').run(id, navn, lengdegrad, breddegrad);

        db.prepare('INSERT OR IGNORE INTO vaerstasjon_bruker (brukerid, vaerstasjonid) VALUES (?, ?)').run(brukerId, id);

        console.log(`Lagret stasjon ${navn} til bruker ${brukerId}`);
    }

    catch(error) {
        console.error("Feil ved lagring av stasjon:", error);
        return res.status(500).json({error: "Kunne ikke lagre stasjon"});
    }
});

router.get('/hentStasjoner', (req, res) => {
    if (!req.session.brukerId) {
        return res.status(401).send("Ikke innlogget");
    }

    const brukerId = req.session.brukerId;
    
    try {
        const rows = db.prepare(`
            SELECT v.navn, v.id
            FROM  Vaerstasjon v
            JOIN Vaerstasjon_bruker vb ON vb.vaerstasjonid = v.id
            WHERE vb.brukerid = ?`).all(brukerId);
        
        res.json(rows);
    }

    catch(error) {
        console.error("Feil ved henting av stasjoner", error);
        res.status(500).json({error: "Kunne ikke hente stasjoner"});
    }
});

router.get('/hentStasjon/:id', (req, res) => {
    const id = req.params.id;
    try {
        const rows = db.prepare(`
            SELECT v.navn, v.lengdegrad, v.breddegrad
            FROM Vaerstasjon v
            WHERE v.id = ?`).get(id);
        
        res.json(rows);
    }
    catch(error) {
        console.error("Feil ved henting av stasjon", error);
        res.status(500).json({error: "Kunne ikke hente stasjon"});
    }
});

module.exports = router;