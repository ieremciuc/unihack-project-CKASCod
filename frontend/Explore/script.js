//DATE - continente si tari

const GEO={
    "Europe":["Romania","France","Germany","Italy","Spain","United Kingdom"],
    "Asia":["China","India","Japan","South Korea","Indonesia"],
    "Africa":["Nigeria","Ethiopia","Egypt","South Africa","Kenya"],
    "North America":["United States","Canada","Mexico","Cuba","Panama"],
    "South America":["Brazil","Argentina","Colombia","Chile","Peru"],
    "Oceania":["Australia","New Zealand","Fiji","Papua New Guinea","Samoa"]
};

const EVENIMENTE={
    "Romania":[
        {titlu:"Festivalul Toamnei", descriere:"Traditii si muzica populara"}],
    "Japan":[
        {titlu:"Sakura Matsuri", descriere:"Festivalul florilor de cires"}],
    "Brazil":[
        {titlu:"Carnavalul de la Rio", descriere:"Parade si petreceri stradale"}]
    };

//fallback daca nu exista
function getEvents(country)
{
    return EVENIMENTE[country] || [
        {titlu:"Niciun eveniment disponibil", descriere:" "}
    ];
}

// ELEMENTE DOM

const continentGrid = document.getElementById("continentGrid");
const countryList = document.getElementById("countryList");
const countryEvents = document.getElementById("countryEvents");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

//AFISEAZA TARILE DIN CONTINENT

function showCountries(continent){
    continentGrid.classList.add("hidden");
    countryEvents.classList.add("hidden");

    countryList.innerHTML = `<h2>${continent}</h2><br>`;

    GEO[continent].forEach(country => {
        const div = document.createElement("div");
        div.classList.add("coutry-item");
        div.innerText = country;

        div.onclick=() => showCountryEvents(country);

        countryList.appendChild(div);
    });
    countryList.classList.remove("hidden");
}

//AFISEAZA EVENIMENTELE UNEI TARI

function showCountryEvents(country){
    const lista = getEvents(country);

    countryEvents.innerHTML = `<h2>Evenimente in ${country}</h2><br>`;

    lista.forEach(event => {
        const card = document.createElement("div");
        card.classList.add("result-card");

        //toggle participa
        card.innerHTML = `
            <h3>${event.titlu}</h3>
            <p>${event.descriere}</p>
            <button class="toggle-btn">Participa</button>
        `;
        const btn = card.querySelector(".toggle-btn");
        btn.onclick = () =>{
            btn.innerText =
                btn.innerText === "Participa"
                ?"Participi la acest eveniment"
                :"Participa";
        };

        countryEvents.appendChild(card);
    });

    countryEvents.classList.remove("hidden");
}

//CLICK PE CONTINENTE

document.querySelectorAll(".continent-card").forEach(btn => {
    btn.addEventListener("click",() =>{
        const continent = btn.getAttribute("data-continent");
        showCountries(continent);
    });
});

//SEARCH

searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase().trim();

    if(text === ""){
        searchResults.classList.add("hidden");
        return;
    }

    let rezultate = [];

    for(const country in EVENIMENTE){
        EVENIMENTE[country].forEach(event => {
            if(
                event.titlu.toLowerCase().includes(text) ||
                event.descriere.toLowerCase().includes(text) ||
                country.toLowerCase().includes(text)
            ){
                rezultate.push({country, titlu: event.titlu, descriere: event.descriere});
            }
       });
    }

    //AFISEAZA REZULTATELE
    searchResults.innerHTML = "";

    rezultate.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("result-card");
        card.innerHTML = `
             <h3>${item.titlu}</h3> 
             <p>${item.descriere}</p> 
             <small>${item.country}</small>`;
        searchResults.appendChild(card);
    });

    searchResults.classList.remove("hidden");

});