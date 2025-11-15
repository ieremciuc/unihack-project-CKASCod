const url = new URLSearchParams(window.location.search);
const country = url.get("country");

const container = document.getElementById("countryEvents");
container.innerHTML=`<h2>Eveniments in ${country}</h2><br>`;

const lista = EVENIMENTE[country] || [];

lista.forEach(event=>{
    const card = document.createElement("div");
    card.classList.add("result-card");

    card.innerHTML=`
        <h3>${event.title}</h3>
        <p>${event.descriere}</p>
        ${event.imagine ? `<img src="${event.imagine}" class="post-media"/>` : ""}
        ${event.video ? `<video class="post-media" controls>
            <source src="${event.video}" type="video/mp4">
            </video>` : ""
        }
        `;
    container.appendChild(card);
});

