//DATE - continente si tari

const GEO={
    "Europe":["Romania","France","Germany","Italy","Spain","United Kingdom"],
    "Asia":["China","India","Japan","South Korea","Indonesia"],
    "Africa":["Nigeria","Ethiopia","Egypt","South Africa","Kenya"],
    "North America":["United States","Canada","Mexico","Cuba","Panama"],
    "South America":["Brazil","Argentina","Colombia","Chile","Peru"],
    "Oceania":["Australia","New Zealand","Fiji","Papua New Guinea","Samoa"]
};
//DATE MOCK
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

        div.onclick = () => {
             window.location.href = `country.html?country=${encodeURIComponent(country)}`;
        };


        countryList.appendChild(div);
    });
    countryList.classList.remove("hidden");
}

//CLICK PE CONTINENTE

document.querySelectorAll(".continent-card").forEach(btn => {
    btn.addEventListener("click",() =>{
        const continent = btn.getAttribute("data-continent");
        showCountries(continent);
    });
});

//SEARCH - lansare pagina la enter

function normalize(str){
    return str
        .normalize("NFD")
        .replace(/[u0300-\u036f]/g, "")
        .toLowerCase();
}

searchInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter")
    {
        const q = searchInput.value.trim();
        if(q.length > 0){
            window.location.href=`search-results.html?query=${encodeURIComponent(q)}`;
        }
    }
});