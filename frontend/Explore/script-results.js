// FUNCȚIE DE NORMALIZARE (fără diacritice)
function normalize(str){    
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}

// PRELUARE QUERY DIN URL
const query = new URLSearchParams(window.location.search).get('query') || "";
const q = normalize(query);

// SETARE TITLU
//document.getElementById("searchTitle").innerText = `Results for "${query}"`;

// CONTAINER REZULTATE
const container = document.getElementById("searchOutput");
container.innerHTML = ""; // reset

// VERIFICĂ DACA DATELE EXISTĂ
if(typeof POSTARI === "undefined" || typeof EVENIMENTE === "undefined"){
    document.getElementById("searchTitle").innerText = `"${query}" not found `;
   // container.innerHTML = `<p style="text-align:center; color:#ffb162;">Datele nu sunt disponibile.</p>`;
} else {
    document.getElementById("searchTitle").innerText = `Results for "${query}"`;
    let results = [];

    // SEARCH POSTĂRI
    for(const country in POSTARI){
        POSTARI[country].forEach(post => {
            if(normalize(post.titlu).includes(q) || 
               normalize(post.descriere).includes(q) || 
               normalize(country).includes(q)){
                results.push({...post, tara: country, type:"post"});
            }
        });
    }

    // SEARCH EVENIMENTE
    for(const country in EVENIMENTE){
        EVENIMENTE[country].forEach(event => {
            if(normalize(event.titlu).includes(q) || 
               normalize(event.descriere).includes(q) || 
               normalize(country).includes(q)){
                results.push({...event, tara: country, type:"event"});
            }
        });
    }

    // AFISARE REZULTATE
    if(results.length === 0){
        container.innerHTML = `<p style="text-align:center; color:#ffb162;">Nu s-au găsit rezultate</p>`;
    } else {
        results.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("result-card");

            let mediaHTML = "";
            if(item.imagine) mediaHTML = `<img src="${item.imagine}" class="post-media">`;
            else if(item.video) mediaHTML = `<video class="post-media" controls><source src="${item.video}" type="video/mp4"></video>`;

            card.innerHTML = `
                ${mediaHTML}
                <div class="result-content">
                    <h3>${item.titlu}</h3>
                    <p><strong>Țara:</strong> ${item.tara}</p>
                    ${item.type === "event" ? `<p><strong>Data:</strong> ${item.data}</p>` : ""}
                    ${item.type === "event" ? `<p><strong>Locație:</strong> ${item.locatie}</p>` : ""}
                    <p>${item.descriere}</p>
                    <p class="result-meta">By ${item.autor}</p>
                </div>
            `;
            container.appendChild(card);
        });
    }
}
