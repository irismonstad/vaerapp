const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/lagreStasjon', (req, res) => {
    if (!req.sessionb.brukerId) {
        return res.status(401).send("Ikke innlogget");

        const brukerId = req.session.brukerId;

        try {
            let (id, navn, lengdegrad, breddegrad) = req.body;
            id = id.toString().trim();
            navn = navn.toString().trim();
            lengdegrad = lengdegrad.toString().trim();
            breddegrad = breddegrad.toString().trim();

            db.prepare('INSERT OR IGNORE INTO vaerstasjon (id, navn, lengdegrad, breddegrad) VALUES (?, ?, ?, ?)'.run(id, navn, lengdegrad, breddegrad));

            db.prepare('INSERT OR IGNORE INTO vaerstasjon_bruker (brukerid, vaerstasjonid) VALUES (?, ?)'.run(brukerId, id));

            console.log(`Lagret stasjon ${navn} til bruker ${brukerId}`);
        }

        catch(err) {
            console.error("Feil ved lagring av stasjon");
            return res.status(500).json({error: "Kunne ikke lagre stasjon"});
        }

    }
});

module.exports = router;