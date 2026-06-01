const express = require('express');
const app = express();
app.use(express.static('public'));

const PORT = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({extended : false}));
app.use(express.json());

// Gjør index.html til "hjemmesiden" -> den som vises på localhost:3000
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Serveren kjører på http://localhost:${PORT}`);
});