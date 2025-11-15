const query = new URLSearchParams(window.location.search).get('query').toLowerCase();
document.getElementById("searchOutput".innerHTML=`<h2>Results for "${query}"</h2>`);

let results = [];
for (const country in EVENIMENTE){
    EVENIMENTE[country].forEach(event => {
        if(
            event.titlu.toLowerCase().includes(query) ||
            event.descriere.toLowerCase().includes(query) ||
            event.locatie.toLowerCase().includes(query)
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
    `;
    document.getElementById("searchOutput").appendChild(card);

});