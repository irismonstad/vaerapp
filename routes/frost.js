const express = require('express');
const app = express();
const router = express.Router();
require('dotenv').config();

function getHeaders() {
    const clientId = process.env.FROSTAPI;
    const base64Credentials = Buffer.from(`${clientId}:`).toString('base64');
    const headers = { 'Authorization': `Basic ${base64Credentials}`};

    return headers;
};

// Søker etter stasjon etter navn
router.get('/sok', async (req, res) => {
    try {
        const headers = getHeaders();
        const stasjonSok = req.query.navn;
        const url = `https://frost.met.no/sources/v0.jsonld?municipality=bergen&name=${stasjonSok}`;
        
        const resultat = await fetch(url, { headers });
        const respons = await resultat.json();
        
        res.json(respons); // Sender dataene videre til nettleseren
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke hente stasjon' });
    }
});

// Henter temperatur med en stasjons id
router.get('/temperatur', async (req, res) => {
    try {
        const headers = getHeaders();
        const stasjonId = req.query.id;

        const tidNaa = new Date();
        const tid24Siden = new Date(tidNaa.getTime() - (24 * 60 * 60* 1000));

        const fraTid = tid24Siden.toISOString().slice(0, 16);
        const tilTid = tidNaa.toISOString().slice(0, 16);
        
        const tidsrom = `${fraTid}/${tilTid}`;
        const url = `https://frost.met.no/observations/v0.jsonld?sources=${stasjonId}&elements=air_temperature&referencetime=${tidsrom}`;
        
        const resultat = await fetch(url, { headers });
        const respons = await resultat.json();
        
        res.json(respons);
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke hente temperatur' });
    }
});

module.exports = router;