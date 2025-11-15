// NORMALIZE FUNCTION (without diacritics)
function normalize(str) {    
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}

// GET QUERY FROM URL
const query = new URLSearchParams(window.location.search).get('query') || "";
const q = normalize(query);

// CONTAINER
const container = document.getElementById("searchOutput");
container.innerHTML = ""; // reset

// CHECK DATA
if (typeof POSTARI === "undefined" || typeof EVENIMENTE === "undefined") {
    container.innerHTML = `<p style="text-align:center; color:#ffb162;">Data not available.</p>`;
} else {
    let results = [];

    // SEARCH POSTS
    for (const country in POSTARI) {
        POSTARI[country].forEach(post => {
            if (normalize(post.titlu).includes(q) || 
                normalize(post.descriere).includes(q) || 
                normalize(country).includes(q)) {
                results.push({...post, tara: country, type: "post"});
            }
        });
    }

    // SEARCH EVENTS
    for (const country in EVENIMENTE) {
        EVENIMENTE[country].forEach(event => {
            if (normalize(event.titlu).includes(q) || 
                normalize(event.descriere).includes(q) || 
                normalize(country).includes(q)) {
                results.push({...event, tara: country, type: "event"});
            }
        });
    }

    // DISPLAY RESULTS
    if (results.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#ffb162;">Query not found</p>`;
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
                    <p><strong>Country:</strong> ${item.tara}</p>
                    ${item.type === "event" ? `<p><strong>Date:</strong> ${item.data}</p>` : ""}
                    ${item.type === "event" ? `<p><strong>Location:</strong> ${item.locatie}</p>` : ""}
                    <p>${item.descriere}</p>
                    <p class="result-meta">By ${item.autor}</p>
                </div>
            `;

            // Toggle participate button for events
            if(item.type === "event") {
                const btn = document.createElement("button");
                btn.classList.add("toggle-btn", "participate-btn");
                btn.innerText = "Participate";
                btn.onclick = () => {
                    btn.innerText = btn.innerText === "Participate" ? "You are participating" : "Participate";
                };
                card.appendChild(btn);
            }

            container.appendChild(card);
        });
    }
}
