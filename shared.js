var footer = `
<footer class="content">
Site (c) ConorSNES ${new Date().getFullYear()}. Hosted on Github.
</footer>
`

document.addEventListener("DOMContentLoaded", (event) => {
    // Inject footer when document exists.
    var body = document.body;
    body.innerHTML += footer;
} )

