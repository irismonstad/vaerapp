// HTML for en navigasjonsbar som skal vises på toppen av alle sidene
const navHTML = 
`<nav class="globalnav">
    <ul class="lenker">
        <li><a href="/" tabindex="0">Hjem</a></li>
        <li><a href="/html/login.html" tabindex="0">Login</a></li>
        <li><a href="/html/signup.html" tabindex="0">Signup</a></li>
    </ul>
</nav>`;

// Legger til HTML-en aller først i body-elementet
document.body.insertAdjacentHTML('afterbegin', navHTML);