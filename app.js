const express = require('express');
const app = express();
app.use(express.static('public'));

const session = require('express-session');

// Lager en session for å la brukeren holde seg innlogget
app.use(session({
    // Nøkkelen burde være noe hemmelig, helst lagret i en .env fil. Jeg har valgt å hardkode den for å lett kunne jobbe på tvers av maskiner. 
    secret: 'nøkkel',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000}
}));

const PORT = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({extended : false}));
app.use(express.json());

// Importerer rutene fra rutefilene
const brukerRuter = require('./routes/bruker');
const vaerRuter = require('./routes/vaer');

// Bruker rutene fra rutefilene, alle ruter for adresser faller under /api/rute.., mens alle ruter for brukere faller under /rute..
app.use('/', brukerRuter);
app.use('/api', vaerRuter);

// Gjør index.html til "hjemmesiden" -> den som vises på localhost:3000
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Serveren kjører på http://localhost:${PORT}`);
});