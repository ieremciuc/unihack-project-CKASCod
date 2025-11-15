function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function createCard(item, isEvent = false) {
    const card = document.createElement("div");
    card.classList.add("result-card");

    let mediaHTML = "";
    if (item.imagine) mediaHTML = `<img src="${item.imagine}" class="result-media">`;
    else if (item.video) mediaHTML = `<video class="result-media" controls><source src="${item.video}" type="video/mp4"></video>`;
    else mediaHTML = `<div class="result-media" style="background:#1b2632;"></div>`;

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

    if (isEvent) html += `<button class="toggle-btn participate-btn">Participate</button>`;

    if (!isEvent) {
        html += `
            <div class="post-actions">
                <button class="like-btn">👍 ${item.likes || 0}</button>
                <button class="dislike-btn">👎 ${item.dislikes || 0}</button>
                <button class="comment-btn">💬 Comment</button>
            </div>
            <div class="comment-box" style="display:none; margin-top:10px;">
                <textarea class="comment-input" placeholder="Write a comment..."></textarea>
                <button class="send-comment">Send</button>
            </div>
            <div class="comments-list" style="margin-top:10px;"></div>
        `;
    }

    html += `</div>`;
    card.innerHTML = html;

    // Logică like/dislike/comment
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
            if(txt.length>0){
                const p=document.createElement("p");
                p.innerText=txt;
                commentsList.appendChild(p);
                card.querySelector(".comment-input").value="";
            }
        };
    }

    if (isEvent) {
        const btn = card.querySelector(".participate-btn");
        btn.onclick = () => {
            btn.innerText = btn.innerText === "Participate" ? "Going" : "Participate";
        };
    }

    // Modal pentru media
    const modal = document.querySelector(".media-modal") || (() => {
        const m=document.createElement("div");
        m.classList.add("media-modal","hidden");
        const c=document.createElement("div");
        c.classList.add("modal-content");
        m.appendChild(c);
        document.body.appendChild(m);
        m.addEventListener("click", ()=>{
            m.classList.add("hidden");
            c.innerHTML="";
        });
        return m;
    })();
    const modalContent = modal.querySelector(".modal-content");

    card.querySelectorAll(".result-media").forEach(media=>{
        media.onclick = e=>{
            e.stopPropagation();
            modalContent.innerHTML="";
            if(media.tagName==="IMG"){
                const img=document.createElement("img");
                img.src=media.src;
                modalContent.appendChild(img);
            } else if(media.tagName==="VIDEO"){
                const video=document.createElement("video");
                video.src=media.querySelector("source").src;
                video.controls=true;
                video.autoplay=true;
                modalContent.appendChild(video);
            }
            modal.classList.remove("hidden");
        };
    });

    return card;
}

// Preluare țară
const url = new URLSearchParams(window.location.search);
const country = url.get("country");
document.getElementById("pageTitle").innerText = country;
const container = document.getElementById("countryEvents");

let events=[], posts=[];
if(typeof EVENIMENTE!=="undefined" && EVENIMENTE[country]) events=EVENIMENTE[country];
if(typeof POSTARI!=="undefined" && POSTARI[country]) posts=POSTARI[country];

if(events.length===0 && posts.length===0){
    container.innerHTML=`<p style="text-align:center; color:#ffb162;">No results found</p>`;
} else {
    posts.forEach(post=>{
        post.tara=country;
        container.appendChild(createCard(post,false));
    });
    events.forEach(event=>{
        event.tara=country;
        container.appendChild(createCard(event,true));
    });
}
