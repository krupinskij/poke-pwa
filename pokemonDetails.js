const nameDiv = document.getElementById("pokemon-name");
const image = document.getElementById("pokemon-image");
const heightDiv = document.getElementById("pokemon-height");
const weightDiv = document.getElementById("pokemon-weight");
const typeList = document.getElementById("type-list");
const abilityList = document.getElementById("ability-list");

document.addEventListener("DOMContentLoaded", () => {
  const name = capitalizeFirstLetter(new URLSearchParams(window.location.search).get("p"));
  document.title = name + " | Details"

  getPokemonDetails(name);
})

function getPokemonDetails(name) {
  fetch("https://pokeapi.co/api/v2/pokemon/" + name.toLowerCase())
  .then(resp => resp.json())
  .then(pokemon => {
    const id = String(pokemon.id).padStart(3,0);
    nameDiv.innerText = `${name} #${id}`;
    image.src = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`;
    heightDiv.innerText = pokemon.height;
    weightDiv.innerText = pokemon.weight;
    
    pokemon.types.forEach(elem => {
      typeList.appendChild(createListItem(elem.type.name));
    })

    pokemon.abilities.forEach(elem => {
      abilityList.appendChild(createListItem(elem.ability.name));
    })
  })
  
}

function createListItem(name) {
  const li = document.createElement("li");
  li.className = "data_type";
  li.innerText = name;

  return li;
}