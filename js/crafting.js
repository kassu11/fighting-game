itemsMenu.querySelector("#craftingMenuButton").addEventListener("click", e => {
  itemsMenu.classList = "craft";
  itemsMenuInventoryResize();
});

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
  } if(array && craftingValues.sortOrder.indexOf("reverse") !== -1) {
    craftingValues.gridItems.reverse();
  }



  craftingValues.gridItems.forEach(v => {
    const [item] = emmet(".craftingItem>.imageContainer>img.icon^p.name+p.tags");
    item.querySelector(".icon").src = "./images/" + v.image;
    item.querySelector(".name").textContent = v.name;
    item.querySelector(".tags").textContent = `#${v.tags.join(" #")}`
    craftInv.append(item);
    
    addHover(item, v.hoverText());

    // const item = document.createElement("div");
    // const imageContainer = document.createElement("div");
    // const img = document.createElement("img");
    // const name = document.createElement("p");
    // const tags = document.createElement("p");

    // item.classList.add("craftingItem");
    // imageContainer.classList.add("imageContainer");
    // img.classList.add("icon");
    // name.classList.add("name");
    // tags.classList.add("tags");

    // img.src = "./images/" + v.image;
    // name.textContent = v.name;
    // tags.textContent = `#${v.tags.join(" #")}`

    // imageContainer.append(img);
    // item.append(imageContainer, name, tags);
    // craftInv.append(item);
  });
}

const searchBar = itemsMenu.querySelector(".toolBar input.searchBar");
searchBar.addEventListener("input", () => {
  const search = searchBar.value.toLowerCase().replaceAll(/ +/g, " ");
  const searchName = [];
  const searchTags = [];

  const splitWithTags = search.split(/(#)| /g);

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

  if(search.length == 0 || search == "#") generateCraftingItemsList(allCraftableItems);
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

  if(strictSearch.length) return generateCraftingItemsList(strictSearch);
  if(mediumSearch.length) return generateCraftingItemsList(mediumSearch);
  if(easySearch.length) return generateCraftingItemsList(easySearch);
  generateCraftingItemsList(allCraftableItems);
  console.log("Search failed")
});

const sortButton = itemsMenu.querySelector(".toolBar .sort");
sortButton.addEventListener("click", e => {

  const subMenuContainer = sortButton.querySelector(".subMenu");
  if(e.target == sortButton) {
    if(subMenuContainer.querySelector(".sortValue")) return subMenuContainer.textContent = "";
    ["Name", "Damage", "Defence", "Tags"].forEach(sortTitle => {
      const [subMenuElement] = emmet(`.sortValue.${sortTitle}>div.directionContainer+p+img`);
      subMenuElement.querySelector("p").textContent = sortTitle;

      subMenuContainer.append(subMenuElement);
    })
  } else {
    const sortSelection = e.target?.classList[1]
    if(craftingValues.sortOrder.indexOf(sortSelection) !== -1) craftingValues.sortOrder = sortSelection + " reverse";
    else craftingValues.sortOrder = sortSelection;

    generateCraftingItemsList();
    if(sortButton.querySelectorAll(".sortValue.reverse") == e.target) e.target.classList.toggle("reverse");
    else sortButton.querySelectorAll(".sortValue").forEach(elem => elem.classList.remove("reverse"));

    const selectedCopy = e.target?.cloneNode(true)
    sortButton.querySelector(".value").textContent = "";
    sortButton.querySelector(".value").append(selectedCopy);

  }
});


// const iterations = 20;
// const arr = [...new Array(iterations)].map(_ => []);

// arr[0].push({x: 5, y: 5});

// const maxValueCords = {x: null, y: null, v: 0};
// const maxNum = map[vihu.y][vihu.x];

// map[vihu.y][vihu.x] = 0;

// for (let i = 0; i < arr.length; i++) {
//   for (let i2 = maxNum - 1; i2 < maxNum + iterations; i2++) {
//     for (const value of arr[i]) {
//       if(map[value.y][value.x] !== 0) continue;

//       const left = map[value.y]?.[value.x - 1] ?? null;
//       const right = map[value.y]?.[value.x + 1] ?? null;
//       const top = map[value.y - 1]?.[value.x] ?? null;
//       const bottom = map[value.y + 1]?.[value.x] ?? null;
  
//       // if(i != 0) map[value.y][value.x] = min + 1;
//       if([left, right, top, bottom].find(e => e == i2)) {
//         map[value.y][value.x] = i2 + 1;

//         if(left == 0) arr[i + 1]?.push({y: value.y, x: value.x - 1});
//         if(right == 0) arr[i + 1]?.push({y: value.y, x: value.x + 1});
//         if(top == 0) arr[i + 1]?.push({y: value.y - 1, x: value.x});
//         if(bottom == 0) arr[i + 1]?.push({y: value.y + 1, x: value.x});
//       }
  
  
//       if(i2 >= maxValueCords.v - 1) {
//         Object.assign(maxValueCords, {y: value.y, x: value.x, v: i2 + 1});
//         // if(left == 0) Object.assign(maxValueCords, {y: value.y, x: value.x - 1, v: min + 1});
//         // else if(right == 0) Object.assign(maxValueCords, {y: value.y, x: value.x + 1, v: min + 1});
//         // else if(top == 0) Object.assign(maxValueCords, {y: value.y - 1, x: value.x, v: min + 1});
//         // else if(bottom == 0) Object.assign(maxValueCords, {y: value.y + 1, x: value.x, v: min + 1});
//       }
//     } 
//   }
// }