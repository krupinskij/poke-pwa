const pokemonInput = document.getElementById("name");
const addPokemonBtn = document.getElementById("add-pokemon-btn");
const pokemonList = document.getElementById("my-pokemons");

document.addEventListener("DOMContentLoaded", () => {
  const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];
  pokemons.forEach(name => {
    pokemonList.appendChild(createNewPokemon(name));
  })
})

addPokemonBtn.addEventListener("click", () => {
  const name = pokemonInput.value.toLowerCase();
  pokemonInput.value = "";
  pokemonList.appendChild(createNewPokemon(name));

  const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];
  pokemons.push(name);
  localStorage.setItem("pokemons", JSON.stringify(pokemons));
})

function createNewPokemon(name) {
  const div = document.createElement("div");
  div.className = "pokemon-list_item";

  const a = document.createElement("a");
  a.className = "pokemon-list_link";
  a.href = "details.html?p=" + name;
  a.innerText = capitalizeFirstLetter(name);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "pokemon-list_button";
  deleteBtn.innerHTML = "&times;";
  deleteBtn.addEventListener("click", () => {
    pokemonList.removeChild(div);
    
    const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];
    localStorage.setItem("pokemons", JSON.stringify(pokemons.filter(p => p !== name)));
  })

  div.appendChild(a);
  div.appendChild(deleteBtn);

  return div;
}