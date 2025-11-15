// NORMALIZE FUNCTION
function normalize(str) {    
    return str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}

// GET QUERY FROM URL
const query = new URLSearchParams(window.location.search).get('query') || "";
const q = normalize(query);

// CONTAINER
const container = document.getElementById("searchOutput");
container.innerHTML = ""; 

// LIKE/DISLIKE DATA
let likeData = JSON.parse(localStorage.getItem("searchLikes")) || {};
function saveLikes() {
    localStorage.setItem("searchLikes", JSON.stringify(likeData));
}

// HELPER: Unique key per post
function getPostKey(card) {
    const title = card.querySelector("h3")?.innerText.trim() || "";
    const country = card.querySelector("p strong")?.nextSibling?.textContent.trim() || "";
    return (country + "_" + title).replace(/\s+/g, "_").toLowerCase();
}

// INIT like/dislike button text
function initLikeDislike(button) {
    const card = button.closest(".result-card");
    const key = getPostKey(card);
    if (!likeData[key]) likeData[key] = { likes: 0, dislikes: 0 };

    const btns = card.querySelectorAll(".post-actions button");
    btns.forEach(b => {
        if (b.innerText.startsWith("👍")) b.innerText = `👍 Like (${likeData[key].likes})`;
        if (b.innerText.startsWith("👎")) b.innerText = `👎 Dislike (${likeData[key].dislikes})`;
    });
}

// LIKE/DISLIKE functions
function likePost(button) {
    const card = button.closest(".result-card");
    const key = getPostKey(card);
    if (!likeData[key]) likeData[key] = { likes: 0, dislikes: 0 };

    likeData[key].likes++;
    saveLikes();
    initLikeDislike(button);
}

function dislikePost(button) {
    const card = button.closest(".result-card");
    const key = getPostKey(card);
    if (!likeData[key]) likeData[key] = { likes: 0, dislikes: 0 };

    likeData[key].dislikes++;
    saveLikes();
    initLikeDislike(button);
}

/* ==== COMMENT LOGIC ==== */
function toggleComments(button) {
    const section = button.parentElement.nextElementSibling;
    section.classList.toggle("hidden");
}

function addComment(button) {
    const textarea = button.previousElementSibling;
    const list = button.parentElement.nextElementSibling;

    if (textarea.value.trim()) {
        const p = document.createElement("p");
        p.textContent = textarea.value.trim();
        list.appendChild(p);
        textarea.value = "";
    }
}

/* ==== MODAL MEDIA ==== */
const modal = document.createElement("div");
modal.className = "media-modal hidden";
modal.id = "mediaModal";
modal.innerHTML = `
    <div class="modal-content">
        <img id="modalImage" class="hidden">
        <video id="modalVideo" controls class="hidden"></video>
    </div>
`;
document.body.appendChild(modal);

function openMedia(src, type) {
    const modalImg = document.getElementById("modalImage");
    const modalVid = document.getElementById("modalVideo");

    modal.classList.remove("hidden");

    if (type === "image") {
        modalImg.src = src;
        modalImg.classList.remove("hidden");
        modalVid.classList.add("hidden");
    } else {
        modalVid.src = src;
        modalVid.classList.remove("hidden");
        modalImg.classList.add("hidden");
    }
}

// close modal by clicking outside
modal.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.getElementById("modalImage").src = "";
    document.getElementById("modalVideo").src = "";
});

/* ==== DISPLAY RESULTS ==== */
if (typeof POSTARI === "undefined" || typeof EVENIMENTE === "undefined") {
    container.innerHTML = `<p style="text-align:center; color:#ffb162;">Data not available.</p>`;
} else {

    let results = [];

    // SEARCH POSTS
    for (const country in POSTARI) {
        POSTARI[country].forEach(post => {
            if (
                normalize(post.titlu).includes(q) || 
                normalize(post.descriere).includes(q) || 
                normalize(country).includes(q)
            ) {
                results.push({...post, tara: country, type: "post"});
            }
        });
    }

    // SEARCH EVENTS
    for (const country in EVENIMENTE) {
        EVENIMENTE[country].forEach(event => {
            if (
                normalize(event.titlu).includes(q) || 
                normalize(event.descriere).includes(q) || 
                normalize(country).includes(q)
            ) {
                results.push({...event, tara: country, type: "event"});
            }
        });
    }

    // DISPLAY RESULTS
    if (results.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#ffb162;">No results found</p>`;
    } else {
        results.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("result-card");

            // MEDIA
            let mediaHTML = "";
            if (item.imagine) {
                mediaHTML = `<img src="${item.imagine}" class="result-media" onclick="openMedia('${item.imagine}', 'image')">`;
            } else if (item.video) {
                mediaHTML = `
                    <video class="result-media" onclick="openMedia('${item.video}', 'video')">
                        <source src="${item.video}" type="video/mp4">
                    </video>`;
            }

            card.innerHTML = `
                ${mediaHTML}

                <div class="result-content">
                    <h3>${item.titlu}</h3>

                    <p><strong>Country:</strong> ${item.tara}</p>

                    ${item.type === "event" ? `<p><strong>Date:</strong> ${item.data}</p>` : ""}
                    ${item.type === "event" ? `<p><strong>Location:</strong> ${item.locatie}</p>` : ""}

                    <p>${item.descriere}</p>
                    <p class="result-meta">By ${item.autor}</p>

                    <div class="post-actions">
                        <button onclick="likePost(this)">👍 Like</button>
                        <button onclick="dislikePost(this)">👎 Dislike</button>
                        <button onclick="toggleComments(this)">💬 Comments</button>
                    </div>

                    <div class="comments-section hidden">
                        <div class="comment-box">
                            <textarea placeholder="Write a comment..."></textarea>
                            <button onclick="addComment(this)">Send</button>
                        </div>
                        <div class="comments-list"></div>
                    </div>
                </div>
            `;

            // PARTICIPATE BUTTON (EVENTS ONLY)
            if (item.type === "event") {
                const btn = document.createElement("button");
                btn.classList.add("toggle-btn");
                btn.innerText = "Participate";
                btn.onclick = () => {
                    btn.innerText = btn.innerText === "Participate" 
                        ? "You are participating" 
                        : "Participate";
                };
                card.appendChild(btn);
            }

            container.appendChild(card);

            // INIT like/dislike counters for this card
            card.querySelectorAll(".post-actions button").forEach(btn => initLikeDislike(btn));
        });
    }
}
