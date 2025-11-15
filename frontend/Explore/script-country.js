const url = new URLSearchParams(window.location.search);
const country = url.get("country");

document.getElementById("countryEvents").innerHTML=`<h2>Eveniments in ${country}</h2>`;

const lista = EVENIMENTE[country] || [];

lista.forEach(event=>{
    const card = DocumentFragment.createElement("div");
    card.classList.add("result-card");

    card.innerHTML=`
        <h3>${event.title}</h3>
        <p>${event.descriere}</p>
        ${event.imagine ? `<img src="${event.imagine}" class="post-media"/>` : ""}
        ${event.video ? `<video class="post-media" controls>
            <source src="${event.video}" type="video/mp4">
            </video>` : ""}
        <small>${event.data}</small>
        `;
    document.getElementById("countryEvents").appendChild(card);
});

