// NORMALIZE FUNCTION (without diacritics)
function normalize(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// CREATE CARD – POST OR EVENT
function createCard(item, isEvent = false) {
    const card = document.createElement("div");
    card.classList.add("result-card");

    // media (image or video)
    let mediaHTML = "";
    if (item.imagine) {
        mediaHTML = `<img src="${item.imagine}" class="result-media">`;
    } else if (item.video) {
        mediaHTML = `
            <video class="result-media" controls>
                <source src="${item.video}" type="video/mp4">
            </video>
        `;
    } else {
        mediaHTML = `<div class="result-media" style="background:#1b2632;"></div>`;
    }

    // content
    let html = `
        ${mediaHTML}
        <div class="result-content">
            <h3>${item.titlu}</h3>
            <p><strong>Country:</strong> ${item.tara}</p>
            ${isEvent ? `<p><strong>Date:</strong> ${item.data}</p>` : ""}
            ${isEvent ? `<p><strong>Location:</strong> ${item.locatie}</p>` : ""}
            <p>${item.descriere}</p>
            <p class="result-meta">By ${item.autor}</p>
    `;

    // toggle participate for events
    if (isEvent) {
        html += `<button class="toggle-btn participate-btn">Participate</button>`;
    }

    // post actions
    if (!isEvent) {
        html += `
            <div class="post-actions">
                <button class="like-btn">👍 ${item.likes || 0}</button>
                <button class="dislike-btn">👎 ${item.dislikes || 0}</button>
                <button class="comment-btn">💬 Comment</button>

                <div class="comment-box" style="display:none; margin-top:10px;">
                    <textarea class="comment-input" placeholder="Write a comment..."></textarea>
                    <button class="send-comment">Send</button>
                </div>

                <div class="comments-list"></div>
            </div>
        `;
    }

    html += `</div>`;
    card.innerHTML = html;

    // POST BUTTON LOGIC
    if (!isEvent) {
        const likeBtn = card.querySelector(".like-btn");
        const dislikeBtn = card.querySelector(".dislike-btn");
        const commentBtn = card.querySelector(".comment-btn");
        const commentBox = card.querySelector(".comment-box");
        const sendComment = card.querySelector(".send-comment");
        const commentsList = card.querySelector(".comments-list");

        likeBtn.onclick = () => {
            item.likes = (item.likes || 0) + 1;
            likeBtn.innerHTML = `👍 ${item.likes}`;
        };

        dislikeBtn.onclick = () => {
            item.dislikes = (item.dislikes || 0) + 1;
            dislikeBtn.innerHTML = `👎 ${item.dislikes}`;
        };

        commentBtn.onclick = () => {
            commentBox.style.display = commentBox.style.display === "none" ? "block" : "none";
        };

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

    // EVENT PARTICIPATE BUTTON LOGIC
    if (isEvent) {
        const btn = card.querySelector(".participate-btn");
        btn.onclick = () => {
            btn.innerText =
                btn.innerText === "Participate"
                    ? "You are participating"
                    : "Participate";
        };
    }

    return card;
}

// GET COUNTRY FROM URL
const url = new URLSearchParams(window.location.search);
const country = url.get("country");

// CONTAINER
const container = document.getElementById("countryEvents");
document.getElementById("pageTitle").innerText = country;

// LOAD DATA (mock or backend)
let events = [];
let posts = [];

if (typeof EVENIMENTE !== "undefined" && EVENIMENTE[country]) {
    events = EVENIMENTE[country];
}
if (typeof POSTARI !== "undefined" && POSTARI[country]) {
    posts = POSTARI[country];
}

// DISPLAY RESULTS
if ((events.length === 0) && (posts.length === 0)) {
    container.innerHTML = `<p style="text-align:center; color:#ffb162;">No results found</p>`;
} else {
    posts.forEach(post => {
        post.tara = country;
        const card = createCard(post, false);
        container.appendChild(card);
    });

    events.forEach(event => {
        event.tara = country;
        const card = createCard(event, true);
        container.appendChild(card);
    });
}

// ===== MEDIA MODAL =====
const modal = document.createElement("div");
modal.id = "mediaModal";
modal.classList.add("media-modal", "hidden");
modal.innerHTML = `
    <span class="close-modal">&times;</span>
    <img id="modalImg" class="modal-content hidden">
    <video id="modalVideo" class="modal-content hidden" controls></video>
`;
document.body.appendChild(modal);

const modalImg = document.getElementById("modalImg");
const modalVideo = document.getElementById("modalVideo");
const closeModal = modal.querySelector(".close-modal");

// click pe media
document.addEventListener("click", e => {
    if(e.target.classList.contains("result-media") || e.target.classList.contains("post-media")){
        modal.classList.remove("hidden");
        if(e.target.tagName.toLowerCase() === "img"){
            modalImg.src = e.target.src;
            modalImg.classList.remove("hidden");
            modalVideo.classList.add("hidden");
        } else if(e.target.tagName.toLowerCase() === "video"){
            modalVideo.src = e.target.querySelector("source").src;
            modalVideo.classList.remove("hidden");
            modalImg.classList.add("hidden");
        }
    }
});

// inchidere modal
closeModal.onclick = () => {
    modal.classList.add("hidden");
    modalImg.classList.add("hidden");
    modalVideo.classList.add("hidden");
    modalVideo.pause();
};

