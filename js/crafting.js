const allCraftableItems = Object.values(items).map(data => new Item(data, player));
const craftingValues = {
  gridItems: allCraftableItems,
  sortOrder: ""
}
const craftInv = itemsMenu.querySelector(".crafting .craftableItems");

generateCraftingItemsList(allCraftableItems);

function generateCraftingItemsList(array) {
  if(array) craftingValues.gridItems = array;
  craftInv.textContent = "";

  if(!array && craftingValues.sortOrder.indexOf("reverse") !== -1) {
    craftingValues.gridItems.reverse();
  } else if(craftingValues.sortOrder.startsWith("Name")) {
    craftingValues.gridItems.sort((v1, v2) => v1.name < v2.name ? 1 : -1)
  } else if(craftingValues.sortOrder.startsWith("Damage")) {
    craftingValues.gridItems.sort((v1, v2) => {
      const dm1 = v1.calcDamage().maxMeleDmg;
      const dm2 = v2.calcDamage().maxMeleDmg;
      if(dm1 == dm2) return v1.name > v2.name ? 1 : -1;
      else return dm1 < dm2 ? 1 : -1;
    })
  } else if(craftingValues.sortOrder.startsWith("Defence")) {
    craftingValues.gridItems.sort((v1, v2) => {
      const hp1 = v1.hp ?? 0;
      const hp2 = v2.hp ?? 0;
      if(hp1 == hp2) return v1.name > v2.name ? 1 : -1;
      else return hp1 < hp2 ? 1 : -1;
    });
  } else if(craftingValues.sortOrder.startsWith("Tags")) {
    craftingValues.gridItems.sort((v1, v2) => {
      const tag1 = v1.tags.join("");
      const tag2 = v2.tags.join("");
      if(tag1 == tag2) return v1.name > v2.name ? 1 : -1;
      else return tag1 > tag2 ? 1 : -1;
    });
  } else if(craftingValues.sortOrder.startsWith("Use_time")) {
    craftingValues.gridItems.sort((v1, v2) => {
      const [time1, time2] = [v1.useTime ?? 0, v2.useTime ?? 0];
      if(time1 == time2) return v1.name > v2.name ? 1 : -1;
      else return time1 < time2 ? 1 : -1;
    })
  } if(array && craftingValues.sortOrder.indexOf("reverse") !== -1) {
    craftingValues.gridItems.reverse();
  }



  craftingValues.gridItems.forEach(v => {
    const [item] = emmet(".craftingItem>.imageContainer>img.icon^p.name+p.tags");
    item.querySelector(".icon").src = "./images/" + v.image;
    item.querySelector(".name").textContent = v.name;
    item.querySelector(".tags").textContent = `#${v.tags.join(" #")}`
    craftInv.append(item);
    
    addHover([item, "crafting"], v.hoverText());

  });
}

const searchBar = itemsMenu.querySelector(".toolBar input.searchBar");
searchBar.addEventListener("input", () => {
  const search = searchBar.value.toLowerCase().replaceAll(/ +/g, " ");
  const searchName = [];
  const searchTags = [];

  const splitWithTags = search.split(/(#)| /g);

  searchBar.classList.remove("failed");

  for(let i = 0; i < splitWithTags.length; i++) {
    console.log(splitWithTags[i])
    if(!splitWithTags[i] || splitWithTags[i] == " ") continue;
    if(splitWithTags[i] == "#") {
      if(splitWithTags[i + 1]) searchTags.push(splitWithTags[i + 1]);
      i++; continue;
    } else searchName.push(splitWithTags[i])
  }

  const strictSearch = []; // indexOf whole name and all tags startWith
  const mediumSearch = []; // indexOf all words from name (not duplicate) and all tags indexOf
  const easySearch = [];   // indexOf any word and any tag

  if(search.length == 0 || search == "#") return generateCraftingItemsList(allCraftableItems);
  else allCraftableItems.forEach(item => {
    const itemName = item.name.toLowerCase();

    if(itemName.indexOf(searchName.join(" ")) !== -1) { // Strict
      const tagNotFound = !searchTags.find(tag => item.tags.find(itag => itag.startsWith(tag)) == null);
      if(tagNotFound || searchTags.length == 0) return strictSearch.push(item);
    } if(strictSearch.length == 0) { // Medium
      let newItemName = itemName;
      const tagNotFound = searchTags.find(tag => item.tags.find(itag => itag.indexOf(tag) !== -1) == null);
      const nameNotFound = searchName.find(name => {
        const length = newItemName.length;
        newItemName = newItemName.replace(name, "");
        return newItemName.length === length;
      }); if(!(nameNotFound || tagNotFound)) return mediumSearch.push(item);
    } if(mediumSearch.length == 0) { // Easy
      const findName = searchName.length == 0 ? true : searchName.find(name => itemName.indexOf(name) !== -1);
      const findTag = searchTags.length == 0 ? true : searchTags.find(tag => item.tags.find(itag => itag.indexOf(tag) !== -1));
      if(findTag && findName) return easySearch.push(item);
    }
  });

  if(strictSearch.length) generateCraftingItemsList(strictSearch);
  else if(mediumSearch.length) generateCraftingItemsList(mediumSearch);
  else if(easySearch.length) generateCraftingItemsList(easySearch);
  else {
    console.log("Search failed");
    searchBar.classList.add("failed");
  }

  const hoverPopUpItemName = hoverBox.querySelector("div[crafting] .itemTitle")?.textContent;
  const hoverItemName = craftInv.querySelector("craftingItem:hover>.name")?.textContent;
  if(hoverPopUpItemName && !hoverItemName) hoverBox.textContent = "";
  if(hoverPopUpItemName != hoverItemName) hoverBox.textContent = "";
});

const sortButton = itemsMenu.querySelector(".toolBar .sort");
sortButton.addEventListener("click", e => {
  const subMenuContainer = sortButton.querySelector(".subMenu");

  window.onclick = function hideSortSubMenu() {
    if(!itemsMenu.querySelector(".toolBar .sort:focus-within")) {
      subMenuContainer.textContent = "";
      window.onclick = null;
    }
  }

  if(e.target == sortButton) {
    const lastSortElem = sortButton.querySelector(".value .sortValue");
    const [,lastName, lastSortState] = lastSortElem?.classList ?? [];
    if(subMenuContainer.querySelector(".sortValue")) return subMenuContainer.textContent = "";
    
    ["Name", "Damage", "Defence", "Use_time","Tags"].forEach(sortTitle => {
      const [subMenuElement] = emmet(`.sortValue.${sortTitle}>div.directionContainer+p+img`);
      subMenuElement.querySelector("p").textContent = sortTitle.replaceAll("_", " ");
      if(sortTitle == lastName) subMenuElement.classList.add(lastSortState);
      subMenuContainer.append(subMenuElement);
    });
  } else {
    const sortSelection = e.target?.classList[1];
    if(!sortSelection) return;
    if(craftingValues.sortOrder.indexOf(sortSelection) !== -1) {
      craftingValues.sortOrder = sortSelection + " reverse";
      e.target.classList.toggle("selected");
      e.target.classList.toggle("reverse");
    } else {
      craftingValues.sortOrder = sortSelection;
      e.target.classList.add("selected");
    }

    generateCraftingItemsList();
    sortButton.querySelectorAll(`.sortValue:not(.${sortSelection})`).forEach(elem => elem.classList.remove("reverse", "selected"));

    const selectedCopy = e.target?.cloneNode(true);
    sortButton.querySelector(".value").textContent = "";
    sortButton.querySelector(".value").append(selectedCopy);
  }
});

const typesButton = itemsMenu.querySelector(".toolBar .types");
typesButton.addEventListener("click", e => {
  const subMenuContainer = typesButton.querySelector(".subMenu");

  window.onclick = function hideTypesSubMenu() {
    if(!itemsMenu.querySelector(".toolBar .types:focus-within")) {
      subMenuContainer.textContent = "";
      window.onclick = null;
    }
  }

  if(e.target == typesButton) {
    const lastSortElem = typesButton.querySelector(".value .typeValue");
    const [,lastName, lastSortState] = lastSortElem?.classList ?? [];
    if(subMenuContainer.querySelector(".typeValue")) return subMenuContainer.textContent = "";
    
    ["Damage", "Defence", "Healing", "Mana", "Use_time"].forEach(sortTitle => {
      const [subMenuElement] = emmet(`.typeValue.${sortTitle}>div.directionContainer+p+img`);
      subMenuElement.querySelector("p").textContent = sortTitle.replaceAll("_", " ");
      if(sortTitle == lastName) subMenuElement.classList.add(lastSortState);
      subMenuContainer.append(subMenuElement);
    });
  } else {
    const sortSelection = e.target?.classList[1];
    if(!sortSelection) return;
    if(craftingValues.sortOrder.indexOf(sortSelection) !== -1) {
      craftingValues.sortOrder = sortSelection + " reverse";
      e.target.classList.toggle("selected");
      e.target.classList.toggle("reverse");
    } else {
      craftingValues.sortOrder = sortSelection;
      e.target.classList.add("selected");
    }

    generateCraftingItemsList();
    typesButton.querySelectorAll(`.typeValue:not(.${sortSelection})`).forEach(elem => elem.classList.remove("reverse", "selected"));

    const selectedCopy = e.target?.cloneNode(true);
    typesButton.querySelector(".value").textContent = "";
    typesButton.querySelector(".value").append(selectedCopy);
  }
});