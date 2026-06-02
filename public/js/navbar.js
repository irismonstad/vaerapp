// HTML for en navigasjonsbar som skal vises på toppen av alle sidene
const navHTML = 
`<nav class="globalnav">
    <ul class="lenker">
        <li><a href="/">Hjem</a></li>
        <li><a href="/html/login.html">Login</a></li>
        <li><a href="/html/signup.html">Signup</a></li>
    </ul>
</nav>`;

// Legger til HTML-en aller først i body-elementet
document.body.insertAdjacentHTML('afterbegin', navHTML);