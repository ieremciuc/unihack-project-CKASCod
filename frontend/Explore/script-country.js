// NORMALIZARE FĂRĂ DIACRITICE
function normalize(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// CREARE CARD – POSTARE / EVENIMENT

function createCard(item, isEvent = false) {
    const card = document.createElement("div");
    card.classList.add("result-card");

    // media (poza sau video)
    let mediaHTML = "";
    if (item.imagine) {
        mediaHTML = `<img src="${item.imagine}" class="result-media">`;
    }
    else if (item.video) {
        mediaHTML = `
            <video class="result-media" controls>
                <source src="${item.video}" type="video/mp4">
            </video>
        `;
    } else {
        mediaHTML = `<div class="result-media" style="background:#1b2632;"></div>`;
    }

    // conținut
    let html = `
        ${mediaHTML}
        <div class="result-content">
            <h3>${item.titlu}</h3>
            <p><strong>Țara:</strong> ${item.tara}</p>
            ${isEvent ? `<p><strong>Data:</strong> ${item.data}</p>` : ""}
            ${isEvent ? `<p><strong>Locație:</strong> ${item.locatie}</p>` : ""}
            <p>${item.descriere}</p>
            <p class="result-meta">By ${item.autor}</p>
    `;

    // EVENT: toggle participă
    if (isEvent) {
        html += `<button class="toggle-btn participate-btn">Participă</button>`;
    }

    // POSTARE: like / dislike / comment

    if (!isEvent) {
        html += `
            <div class="post-actions">
                <button class="like-btn">👍 ${item.likes || 0}</button>
                <button class="dislike-btn">👎 ${item.dislikes || 0}</button>
                <button class="comment-btn">💬 Comentează</button>

                <div class="comment-box" style="display:none; margin-top:10px;">
                    <textarea class="comment-input" placeholder="Scrie un comentariu..."></textarea>
                    <button class="send-comment">Trimite</button>
                </div>

                <div class="comments-list"></div>
            </div>
        `;
    }

    html += `</div>`;
    card.innerHTML = html;

    // -------------------------------------------
    // LOGICĂ BUTOANE POSTARE
    // -------------------------------------------
    if (!isEvent) {
        const likeBtn = card.querySelector(".like-btn");
        const dislikeBtn = card.querySelector(".dislike-btn");
        const commentBtn = card.querySelector(".comment-btn");
        const commentBox = card.querySelector(".comment-box");
        const sendComment = card.querySelector(".send-comment");
        const commentsList = card.querySelector(".comments-list");

        // like
        likeBtn.onclick = () => {
            item.likes = (item.likes || 0) + 1;
            likeBtn.innerHTML = `👍 ${item.likes}`;
        };

        // dislike
        dislikeBtn.onclick = () => {
            item.dislikes = (item.dislikes || 0) + 1;
            dislikeBtn.innerHTML = `👎 ${item.dislikes}`;
        };

        // afișare/ascundere comentarii
        commentBtn.onclick = () => {
            commentBox.style.display = commentBox.style.display === "none" ? "block" : "none";
        };

        // adăugare comentariu
        sendComment.onclick = () => {
            const txt = card.querySelector(".comment-input").value.trim();
            if (txt.length > 0) {
                const p = document.createElement("p");
                p.innerText = txt;
                commentsList.appendChild(p);
                card.querySelector(".comment-input").value = "";
            }
        };
    }

    // LOGICĂ BUTON PARTICIPĂ (evenimente)
    
    if (isEvent) {
        const btn = card.querySelector(".participate-btn");
        btn.onclick = () => {
            btn.innerText =
                btn.innerText === "Participă"
                    ? "Participi deja"
                    : "Participă";
        };
    }

    return card;
}

// PRELUARE PARAMETRU DIN URL

const url = new URLSearchParams(window.location.search);
const country = url.get("country");

// SELECTARE CONTAINER
const container = document.getElementById("countryEvents");
document.getElementById("pageTitle").innerText = country;

// ÎNCĂRCARE DATE MOCK SAU BACKEND

// Pentru backend
// fetch(`/api/country/${country}`)
//   .then(r => r.json())
//   .then(data => render(data.events, data.posts));

let events = [];
let posts = [];

// fallback: folosim mock-data.js
if (typeof EVENIMENTE !== "undefined" && EVENIMENTE[country]) {
    events = EVENIMENTE[country];
}
if (typeof POSTARI !== "undefined" && POSTARI[country]) {
    posts = POSTARI[country];
}

// AFIȘARE REZULTATE

if ((events.length === 0) && (posts.length === 0)) {
    container.innerHTML += `<p style="text-align:center; color:#ffb162;">Nu s-au găsit rezultate</p>`;
} else {
    // POSTĂRI
    posts.forEach(post => {
        post.tara = country;  // pentru afișare
        const card = createCard(post, false);
        container.appendChild(card);
    });

    // EVENIMENTE
    events.forEach(event => {
        event.tara = country;
        const card = createCard(event, true);
        container.appendChild(card);
    });
}
//<script src="mock-data.js"></script>
