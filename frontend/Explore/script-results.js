function normalize(str){    
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const query = new URLSearchParams(window.location.search).get('query');
const q = normalize(query);

document.getElementById("searchTitle").innerHTML=`Results for "${query}"</b>`;

let results = [];

for (const country in EVENIMENTE){
    EVENIMENTE[country].forEach(event => {
        if(
            normalize(event.titlu).includes(q)||
            normalize(event.descriere).includes(q) ||
            normalize(country).includes(q)
        ){
            results.push({...event, tara: country});
        }
    });
};

results.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    card.innerHTML = `
        <h3>${event.titlu}</h3>
        <p>${event.descriere}</p>
        <small>${event.country}</small>

        ${event.imagine ? `<img src="${event.imagine}" class="post-media"/>` : ""}
        ${event.video ? `<video class="post-media" controls>
            <source src="${event.video}" type="video/mp4">
            </video>` : ""
        }
    `;
    document.getElementById("searchOutput").appendChild(card);

});