const allCraftableItems = Object.values(items).filter(item => item.craftingRecipes?.length).map((data, i) => new Item({...data, index: i}, player));
// const allCraftableItems = Object.values(items).filter(item => item.craftingRecipes).reduce((ac, v, i, a) => [...a, ...ac], []).map((data, i) => new Item({...data, index: i}, player)); // 64
// const allCraftableItems = Object.values(items).filter(item => item.craftingRecipes).reduce((ac, v, i, a) => [...a, ...ac], []).reduce((ac, v, i, a) => [...a, ...ac], []).map((data, i) => new Item({...data, index: i}, player)); // 4096
const craftingValues = {
  gridItems: allCraftableItems,
  sortOrder: "",
  removeFilter: [],
  addFilter: [],
  selectedResipe: "",
  allOpenRecipes: {},
  itemNeedsToBeInRecipe: "",
  lastCrafted: {index: 0, id: "", updates: null}
}
const craftInv = itemsMenu.querySelector(".crafting .craftableItems");

function generateCraftingItemsList(array) {
  if(array) craftingValues.gridItems = array;
  craftInv.textContent = "";
  craftingValues.allOpenRecipes = {}

  if(!array && craftingValues.sortOrder.indexOf("reverse") !== -1) {
    craftingValues.gridItems.reverse();
  } else if(craftingValues.sortOrder.startsWith("Name")) {
    craftingValues.gridItems.sort((v1, v2) => v1.name > v2.name ? 1 : -1)
  } else if(craftingValues.sortOrder.startsWith("Damage")) {
    craftingValues.gridItems.sort((v1, v2) => {
      const dm1 = v1.calcDamage().maxMeleDmg ?? 0;
      const dm2 = v2.calcDamage().maxMeleDmg ?? 0;
      if(dm1 == dm2) return v1.name > v2.name ? 1 : -1;
      else return dm2 - dm1
    })
  } else if(craftingValues.sortOrder.startsWith("Defence")) {
    craftingValues.gridItems.sort((v1, v2) => {
      const hp1 = v1.healthBoostValue ?? 0;
      const hp2 = v2.healthBoostValue ?? 0;
      if(hp1 == hp2) return v1.name > v2.name ? 1 : -1;
      else return hp2 - hp1;
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
      else return time2 - time1;
    })
  } if(array && craftingValues.sortOrder.indexOf("reverse") !== -1) {
    craftingValues.gridItems.reverse();
  } if(craftingValues.sortOrder == "") craftingValues.gridItems.sort((v1, v2) => v1.index - v2.index);



  craftingValues.gridItems.forEach((v, i) => {
    const [item] = emmet(".craftingItem>.imageContainer>img.icon^p.name+p.tags+div.arrow+div.recipes");
    item.querySelector(".icon").src = "./images/" + v.image;
    item.querySelector(".name").textContent = v.name;
    item.querySelector(".tags").textContent = `#${v.tags.join(" #")}`;
    item.setAttribute("index", i);
    craftInv.append(item);
    
    addHover([item, "crafting"], v.hoverText());

  });
}

function filterCraftingItems(array) {
  return array.filter(value => {
    for(const filter of craftingValues.removeFilter) {
      if(filterResults(filter)) return false;
    }
    for(const filter of craftingValues.addFilter) {
      if(!filterResults(filter)) return false;
    }
    
    return true;

    function filterResults(type) {
      if(type == "Damage" && (value.maxMeleDmg || value.minMeleDmg)) return true;
      if(type == "Defence" && value.healthBoostValue) return true;
      if(type == "Healing" && value.healV) return true;
      if(type == "Mana" && value.mana) return true;
      if(type == "Use_time" && value.useTime) return true;
    }
  })
}

const searchBar = itemsMenu.querySelector(".toolBar input.searchBar");
searchBar.addEventListener("input", e => craftingSearch());

const clearCraftingSearchBar = itemsMenu.querySelector(".toolBar #clearCraftingSearchBar");
clearCraftingSearchBar.addEventListener("click", () => {
  searchBar.value = "";
  craftingSearch();
  searchBar.focus();
})

function craftingSearch(returnEmpty = false) {
  const search = searchBar.value.toLowerCase().replaceAll(/ +/g, " ");
  const searchName = [];
  const searchTags = [];

  const splitWithTags = search.split(/(#)| /g);

  searchBar.classList.remove("failed");
  if(search.length) {
    clearCraftingSearchBar.classList.remove("hidden");
  } else clearCraftingSearchBar.classList.add("hidden");

  for(let i = 0; i < splitWithTags.length; i++) {
    if(!splitWithTags[i] || splitWithTags[i] == " ") continue;
    if(splitWithTags[i] == "#") {
      if(splitWithTags[i + 1]) searchTags.push(splitWithTags[i + 1]);
      i++; continue;
    } else searchName.push(splitWithTags[i])
  }

  const perfectSearch = []; // Name and tags are identical
  const strictSearch = []; // indexOf whole name and all tags startWith
  const mediumSearch = []; // indexOf all words from name (not duplicate) and all tags indexOf
  const easySearch = [];   // indexOf any word and any tag

  const lookForItems = craftingValues.itemNeedsToBeInRecipe;
  const filteredVersionOfitems = lookForItems ? filterCraftingItems( allItemsUsedForCrafting[lookForItems] ) : filterCraftingItems( allCraftableItems );

  if(search.length == 0 || search == "#") return generateCraftingItemsList(filteredVersionOfitems);
  else filteredVersionOfitems.forEach(item => {
    const itemName = item.name.toLowerCase();

    if(itemName === searchName.join(" ")) {
      const tagNotFound = item.tags.find(itag => !searchTags.find(tag => itag.startsWith(tag)));
      if(!tagNotFound) return perfectSearch.push(item);
    } if(perfectSearch.length === 0 && itemName.indexOf(searchName.join(" ")) !== -1) { // Strict
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

  if(perfectSearch.length) generateCraftingItemsList(perfectSearch);
  else if(strictSearch.length) generateCraftingItemsList(strictSearch);
  else if(mediumSearch.length) generateCraftingItemsList(mediumSearch);
  else if(easySearch.length) generateCraftingItemsList(easySearch);
  else {
    console.log("Search failed");
    searchBar.classList.add("failed");

    if(returnEmpty) generateCraftingItemsList([]);
  }

  const hoverPopUpItemName = hoverBox.querySelector("div[crafting] .itemTitle")?.textContent;
  const hoverItemName = craftInv.querySelector("craftingItem:hover>.name")?.textContent;
  if(hoverPopUpItemName && !hoverItemName) hoverBox.textContent = "";
  if(hoverPopUpItemName != hoverItemName) hoverBox.textContent = "";
};

const sortButton = itemsMenu.querySelector(".toolBar .sort");
sortButton.addEventListener("click", e => {
  const subMenuContainer = sortButton.querySelector(".subMenu");
  sortButton.classList.add("active");

  window.onclick = closeCraftingDropdownMenus;
  
  // function hideSortSubMenu() {
  //   typesButton.querySelector(".subMenu").textContent = "";
  //   typesButton.classList.remove("active");
  //   if(!itemsMenu.querySelector(".toolBar .sort:focus-within")) {
  //     sortButton.classList.remove("active");
  //     subMenuContainer.textContent = "";
  //     window.onclick = null;
  //   }
  // }

  if(e.target == sortButton) {
    const lastSortElem = sortButton.querySelector(".value .sortValue");
    const [,lastName, lastSortState] = lastSortElem?.classList ?? [];
    if(subMenuContainer.querySelector(".sortValue")) {
      sortButton.classList.remove("active");
      return subMenuContainer.textContent = "";
    }
    
    ["Name", "Damage", "Defence", "Use_time","Tags"].forEach(sortTitle => {
      const [subMenuElement] = emmet(`.sortValue.${sortTitle}>div.directionContainer+p+div.removeSelection`);
      subMenuElement.querySelector("p").textContent = sortTitle.replaceAll("_", " ");
      if(sortTitle == lastName) subMenuElement.classList.add(lastSortState);
      subMenuContainer.append(subMenuElement);
    });
  } else if(e.target.classList.contains("removeSelection")) {
    if(e.target.parentElement.parentElement?.classList.contains("value")) {
      subMenuContainer.textContent = "";
      sortButton.classList.remove("active");
    }
    e.target?.parentElement.classList.remove("reverse", "selected");
    craftingValues.sortOrder = "";
    sortButton.querySelector(".value").textContent = "";
    const [p, div] = emmet("p+div.arrow");
    p.textContent = "Sort items"
    sortButton.querySelector(".value").append(p, div);
    generateCraftingItemsList();
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
  typesButton.classList.add("active");

  window.onclick = closeCraftingDropdownMenus;

  if(e.target == typesButton) {
    if(subMenuContainer.querySelector(".typeValue")) {
      typesButton.classList.remove("active");
      return subMenuContainer.textContent = "";
    }
    
    return ["Damage", "Defence", "Healing", "Mana", "Use_time"].forEach(title => {
      const [subMenuElement] = emmet(`.typeValue.${title}>div.directionContainer+p+div.removeSelection`);
      subMenuElement.querySelector("p").textContent = title.replaceAll("_", " ");
      if(craftingValues.removeFilter.find(e => e === title)) subMenuElement.classList.add("remove");
      else if(craftingValues.addFilter.find(e => e === title)) subMenuElement.classList.add("add");
      subMenuContainer.append(subMenuElement);
    });
  } else if(e.target.classList.contains("removeSelection")) {
    const typeSelection = e.target?.parentElement.classList[1];
    if(e.target.parentElement.parentElement?.classList?.contains("value")) {
      subMenuContainer.textContent = "";
      craftingValues.addFilter = [];
      craftingValues.removeFilter = [];
      typesButton.classList.remove("active");
    }
    craftingValues.addFilter = craftingValues.addFilter.filter(e => e !== typeSelection);
    craftingValues.removeFilter = craftingValues.removeFilter.filter(e => e !== typeSelection);
    e.target?.parentElement.classList.remove("add", "remove");
    craftingSearch(true);
  } else {
    const typeSelection = e.target?.classList[1];
    if(!typeSelection) return;

    e.target.classList.remove("add", "remove");
    if(craftingValues.addFilter.find(e => e === typeSelection)) {
      craftingValues.addFilter = craftingValues.addFilter.filter(e => e !== typeSelection);
      craftingValues.removeFilter.push(typeSelection);
      e.target.classList.add("remove");
    } else {
      craftingValues.addFilter.push(typeSelection);
      craftingValues.removeFilter = craftingValues.removeFilter.filter(e => e !== typeSelection);
      e.target.classList.add("add");
    }

    craftingSearch(true);
  }

  const totalFilterCount = craftingValues.addFilter.length + craftingValues.removeFilter.length;
  const valueContainer = typesButton.querySelector(".value");
  if(totalFilterCount == 1) {
    const [onlyActiveTypeClass] = [...craftingValues.addFilter, ...craftingValues.removeFilter];
    const selectedCopy = subMenuContainer.querySelector(`.typeValue.${onlyActiveTypeClass}`).cloneNode(true);
    valueContainer.textContent = "";
    valueContainer.append(selectedCopy);
  } else if(totalFilterCount > 1) {
    const [valueContent] = emmet(".typeValue>p+div.removeSelection");
    valueContainer.textContent = "";
    valueContent.querySelector("p").textContent = `${totalFilterCount} Filters active`
    valueContainer.append(valueContent);
  } else {
    valueContainer.textContent = "";
    const [p, arrow] = emmet("p+div.arrow");
    p.textContent = `Filter items`
    valueContainer.append(p, arrow);
  }
});

function closeCraftingDropdownMenus() {
  const buttons = [".sort", ".types", ".whatCanCraftContainer"];

  const allNotFocused = buttons.reduce((a, v) => {
    const notFocus = itemsMenu.querySelector(`.toolBar ${v}:not(:focus-within)`);

    if(notFocus) {
      notFocus.classList.remove("active");
      notFocus.querySelector(".subMenu").textContent = "";
      if(v === ".whatCanCraftContainer") whatCanCraft.value = "";
      return a;
    } return false;
  }, true);

  if(allNotFocused) window.onclick = null;
}

craftInv.addEventListener("click", function openCraftingRecipes(e) {
  const clickedItem = e.target.classList.contains("craftingItem") ? e.target : e.target.parentElement;
  if(e.target == craftInv || !clickedItem.classList.contains("craftingItem")) return;
  const itemIndex = +clickedItem.getAttribute("index");
  const item = craftingValues.gridItems[itemIndex];
  const recipes = item.craftingRecipes;
  const recipesSubmenu = clickedItem.querySelector(".recipes");

  craftingValues.lastCrafted.id = "";

  if(!recipesSubmenu.textContent && recipes?.length) {
    addHover(recipesSubmenu, "");
    const rows = recipes.map((recipe, y) => {
      const [rowElem] = emmet(".row>.craftingButton>img+p.itemAmount^div.items");
      const items = recipe.items.map((data, x) => {
        const item = new Item({id: data.item}, player);
        const [itemElem] = emmet(".item>img+p.itemAmount");
        const img = itemElem.querySelector("img");
        const amount = itemElem.querySelector("p");

        if(!item.craftingRecipes) {
          const [warningElem] = emmet("p.warning");
          warningElem.textContent = "!";
          addHover([warningElem, "cantBeCrafted"], "Item can't be crafted");
          itemElem.classList.add("cantBeCrafted");
          itemElem.append(warningElem);
        } else itemElem.addEventListener("mouseup", e => {
          // console.log(e.button)
          if(e.button === 0 && item.craftingRecipes) {
            itemsMenu.querySelector("input.searchBar").value = item.name + "#" + item.tags.join("#");
            generateCraftingItemsList([item]);
            itemsMenu.querySelector("#clearCraftingSearchBar").classList.remove("hidden");
            craftInv.querySelector(".craftingItem").click();
            hoverBox.querySelector("[recipe]").remove();
          }
        });

        itemElem.addEventListener("contextmenu", e => {
          craftingValues.itemNeedsToBeInRecipe = item.id;
          // craftingSearch();
          generateCraftingItemsList(allItemsUsedForCrafting[item.id]);
          hoverBox.querySelector("div[recipe]")?.remove?.();
          whatCanCraftButton.querySelector(".value").innerHTML = `<div class="row selected" itemid="${item.id}">
            <img src="./images/${item.image}">
            <p>${item.name}</p>
            <div class="remove"></div>
          </div>`;
          e.preventDefault();
          return false
        });
        
        amount.textContent = data.amount;
        img.src = "./images/" + item.image;

        const notEnoughText  = `<nct><v>craftInv.children[${itemIndex}].querySelector(".row:nth-child(${y + 1}) .item:nth-child(${x + 1})")?.classList.contains("cantCraft") ? "notEnough" : "notEnough hidden"<v><nct>Not enough items§<nct>itemData<nct>`
        const tooltipText = [
          "<ct>craftingTooltip<ct>", 
          `[Left click]<cl>left hotkey${item.craftingRecipes ? "" : " hide"}<cl>`,
          `§<cl>right hotkey<cl>[Right click]`,
          `§\nShow recipe${item.craftingRecipes ? "" : "<cl>hide<cl>"}`,
          `§<cl>right<cl>Used in`].join("");

        addHover([itemElem, "recipe"], notEnoughText + item.hoverText() + tooltipText);
        
        return itemElem;
      });

      rowElem.querySelector(".craftingButton>img").src = "./images/" + item.image;
      if(recipe.craftingAmount > 1) rowElem.querySelector(".craftingButton>p").textContent = recipe.craftingAmount;
      else rowElem.querySelector(".craftingButton>p").remove();

      rowElem.querySelector(".items").append(...items);

      addHover([rowElem.querySelector(".craftingButton"), "craftingButton"], "Craft item")
      rowElem.querySelector(".craftingButton").addEventListener("click", () => craftItem(item.id) );
      function craftItem(craftableItem) {
        const resursesNotNeeded = recipe.items.map(data => ({...data})).filter(recipeData => {
          const {amount} = new Item({id: recipeData.item});
          if(amount == undefined) {
            const allItems = player.inventory.filter(item => item.id === recipeData.item);
            recipeData.totalAmount = allItems.length;
            return allItems.length < recipeData.amount;
          } else {
            const foundItem = player.inventory.find((item, i) => item.id === recipeData.item) ?? {amount: 0};
            recipeData.totalAmount = foundItem.amount;
            return foundItem.amount < recipeData.amount;
          }
        });

        if(resursesNotNeeded.length == 0) {
          const giveItemData = recipe.craftingAmount ? {id: craftableItem, amount: recipe.craftingAmount} : {id: craftableItem};
          
          if(craftingValues.lastCrafted.id === "" || craftingValues.lastCrafted.id !== giveItemData.id) {
            craftingValues.lastCrafted.id = giveItemData.id + y;
            craftingValues.lastCrafted.index = 0;
            craftingValues.lastCrafted.updates = getCraftingNeededItemsHistory(itemIndex, y);
          } craftingValues.lastCrafted.index++;

          craftingValues.lastCrafted.updates[craftingValues.lastCrafted.index]?.forEach(e => {
            e.elem?.classList?.toggle("cantCraft", !e.canCraft);
          });

          player.giveItem( new Item( giveItemData ) );
          recipe.items.forEach(recipeData => {
            const {amount} = new Item({id: recipeData.item});
            if(amount == undefined) {
              let howManyInActiveSlots = 0;
              const allItems = player.inventory.filter(item => {
                if(item.id === recipeData.item) {
                  if(item.slot) howManyInActiveSlots++;
                  return true;
                }
              });
              let howManyRemoved = 0;
              for(let i = 0; i < player.inventory.length; i++) {
                if(player.inventory[i].id !== recipeData.item) continue;
                if(player.inventory[i].slot) {
                  if(allItems.length - howManyInActiveSlots >= recipeData.amount) continue;
                  howManyInActiveSlots--;
                };
                
                player.takeItem(i);
                howManyRemoved++;
                if(howManyRemoved == recipeData.amount) break;
                i--;
              }
              
            } else {
              const foundItemIndex = player.inventory.findIndex(item => item.id === recipeData.item);
              player.takeItem(foundItemIndex, recipeData.amount);
            }
          });

          generateItemsOnGrid(player.inventory.slice())
        }
      };

      return rowElem;
    });
    
    recipesSubmenu.append(...rows);
  }

  if(clickedItem.classList.toggle("selected")) {
    updateNeededItemsForCrafting(itemIndex);
    const totalHeight = Array.from(recipesSubmenu.children).map(e => e.getBoundingClientRect().height).reduce((a, v) => a + v);
    recipesSubmenu.style.maxHeight = `${totalHeight}px`;
    recipes.forEach((row, y) => row.items.forEach((value, x) => {
      if(!craftingValues.allOpenRecipes[value.item]) craftingValues.allOpenRecipes[value.item] = [];
      craftingValues.allOpenRecipes[value.item].push({elem: recipesSubmenu.children[y].children[1].children[x], amount: value.amount})
    }));
  } else {
    recipesSubmenu.style.maxHeight = null;
    recipes.forEach((row, y) => row.items.forEach((value, x) => {
      const elem = recipesSubmenu.children[y].children[1].children[x];
      const index = craftingValues.allOpenRecipes[value.item].findIndex(row => row.elem === elem);
      craftingValues.allOpenRecipes[value.item].splice(index, 1);
    }));
  }  
});

function getCraftingNeededItemsHistory(index, recipeIndex = null) {
  if(recipeIndex === null) return console.error("MISSING recipeIndex");
  const selectedItem = craftingValues.gridItems[index];
  const selectedRecipe = selectedItem.craftingRecipes[recipeIndex];
  const allNeededItems = selectedRecipe.items.reduce((ac, {item}) => {
    ac[item] = player.totalItemCounts[item] ?? 0;
    return ac;
  }, {});

  let amountOfCraftableItemInventory = player.totalItemCounts[selectedItem.id] ?? 0;
  const extraArray = [];

  for(const [key, value] of Object.entries(allNeededItems)) {
    if(!craftingValues.allOpenRecipes[key]) continue;
    const amountForCrafting = selectedRecipe.items.find(e => e.item === key).amount;
    craftingValues.allOpenRecipes[key].forEach(v => {
      const rowIndex = Math.floor((value - v.amount) / amountForCrafting) + 1;
      if(!extraArray[rowIndex]) extraArray[rowIndex] = [];
      extraArray[rowIndex].push({elem: v.elem, canCraft: false});
    });
  }

  const selectedRecipeAmount = selectedRecipe.amount ?? 1;
  main: for(let i = 1; i < 1000; i++) {
    for(const key of Object.keys(allNeededItems)) {
      allNeededItems[key] -= selectedRecipe.items.find(e => e.item === key).amount ?? 1;
      if(allNeededItems[key] < 0) break main;
    }

    craftingValues.allOpenRecipes[selectedItem.id]?.forEach(v => {
      if(amountOfCraftableItemInventory < v.amount && amountOfCraftableItemInventory + selectedRecipeAmount >= v.amount) {
        extraArray[i] ??= [];
        extraArray[i].push({elem: v.elem, canCraft: true});
      }
    });

    amountOfCraftableItemInventory += selectedRecipeAmount;
  }
 
  return extraArray
}

function updateNeededItemsForCrafting(index) {
  const selectedItem = craftingValues.gridItems[index];
  const recipeElem = craftInv.children[index].querySelector(".craftingItem>.recipes");
  selectedItem.craftingRecipes.forEach((row, y) => row.items.forEach((value, x) => {
    const elem = recipeElem.children[y].children[1].children[x];
    if(player.totalItemCounts[value.item] >= value.amount) elem.classList.remove("cantCraft");
    else elem.classList.add("cantCraft");
  }));
}



const allItemsUsedForCrafting = allCraftableItems.reduce((ac, va) => {
  va.craftingRecipes.forEach(row => {
    row.items.forEach(({item}) => {
      ac[item] ??= [];
      if(ac[item].findIndex(e => e === va) === -1) ac[item].push(va);
    });
  });
  return ac;
}, {});
const listOfAllItemsUsedForCrafting = Object.keys(allItemsUsedForCrafting).map(e => new Item({id: e}));


const whatCanCraft = itemsMenu.querySelector(".whatCanCraft");
whatCanCraft.addEventListener("input", craftWithSearch)

function craftWithSearch(e) {
  const search = whatCanCraft.value.toLowerCase().replaceAll(/ +/g, " ");
  const searchName = [];
  const searchTags = [];

  const splitWithTags = search.split(/(#)| /g);

  // searchBar.classList.remove("failed");
  // if(search.length) {
  //   clearCraftingSearchBar.classList.remove("hidden");
  // } else clearCraftingSearchBar.classList.add("hidden");

  for(let i = 0; i < splitWithTags.length; i++) {
    if(!splitWithTags[i] || splitWithTags[i] == " ") continue;
    if(splitWithTags[i] == "#") {
      if(splitWithTags[i + 1]) searchTags.push(splitWithTags[i + 1]);
      i++; continue;
    } else searchName.push(splitWithTags[i])
  }

  const perfectSearch = []; // Name and tags are identical
  const strictSearch = []; // indexOf whole name and all tags startWith
  const mediumSearch = []; // indexOf all words from name (not duplicate) and all tags indexOf
  const easySearch = [];   // indexOf any word and any tag

  // const lookForItems = craftingValues.itemNeedsToBeInRecipe;
  const filteredVersionOfitems = listOfAllItemsUsedForCrafting;

  if(search.length == 0 || search == "#") return generateWhatCanCraftList(filteredVersionOfitems);
  else filteredVersionOfitems.forEach(item => {
    const itemName = item.name.toLowerCase();

    if(itemName === searchName.join(" ")) {
      const tagNotFound = searchTags.find(tag => item.tags.find(itag => itag.indexOf(tag) !== -1) == null);
      if(!tagNotFound) return perfectSearch.push(item);
    } if(perfectSearch.length === 0 && itemName.indexOf(searchName.join(" ")) !== -1) { // Strict
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

  if(perfectSearch.length) generateWhatCanCraftList(perfectSearch);
  else if(strictSearch.length) generateWhatCanCraftList(strictSearch);
  else if(mediumSearch.length) generateWhatCanCraftList(mediumSearch);
  else if(easySearch.length) generateWhatCanCraftList(easySearch);
  else {
    console.log("Search failed");
    // searchBar.classList.add("failed");

    // if(returnEmpty) generateCraftingItemsList([]);
  }

  // const hoverPopUpItemName = hoverBox.querySelector("div[crafting] .itemTitle")?.textContent;
  // const hoverItemName = craftInv.querySelector("craftingItem:hover>.name")?.textContent;
  // if(hoverPopUpItemName && !hoverItemName) hoverBox.textContent = "";
  // if(hoverPopUpItemName != hoverItemName) hoverBox.textContent = "";

  // generateWhatCanCraftList()
};

const whatCanCraftButton = itemsMenu.querySelector(".whatCanCraftContainer");

function generateWhatCanCraftList(arr) {
  const submenu = whatCanCraftButton.querySelector(".subMenu");

  submenu.textContent = "";
  arr.forEach(item => {
    const [elem] = emmet("div.row>img+p+div.remove");
    elem.querySelector("img").src = "./images/" + item.image;
    elem.querySelector("p").textContent = item.name;
    elem.setAttribute("itemId", item.id)
    submenu.append(elem);

    if(craftingValues.itemNeedsToBeInRecipe === item.id) {
      elem.classList.add("selected");
      elem.scrollIntoView();
    }
  })
}

whatCanCraftButton.querySelector(".subMenu").addEventListener("click", e => {
  const id = e.target?.getAttribute("itemId");
  if(id) {
    whatCanCraftButton.querySelectorAll(".subMenu > .row.selected").forEach(elem => elem.classList.remove("selected"));
    craftingValues.itemNeedsToBeInRecipe = id;
    e.target.classList.add("selected");
  } else if(e.target?.classList.contains("remove")) {
    e.target.parentElement.classList.remove("selected");
    craftingValues.itemNeedsToBeInRecipe = "";
  } else return;
  
  craftingSearch(true);
  whatCanCraft.focus();
  whatCanCraftButton.querySelector(".value").innerHTML = e.target.outerHTML;
})

whatCanCraftButton.addEventListener("mousedown", e => {
  if(!whatCanCraftButton.classList.contains("active")) {
    whatCanCraft.value = "";
    if(e.target === whatCanCraft) {
      craftWithSearch(true);
      whatCanCraftButton.classList.add("active")
    
      window.onclick = closeCraftingDropdownMenus;
    } else if(e.target?.classList.contains("remove")) {
      craftingValues.itemNeedsToBeInRecipe = "";
      whatCanCraftButton.querySelector(".value").innerHTML = "";
      craftingSearch(true);
    }
  }

});