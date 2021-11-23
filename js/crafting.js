const allCraftableItems = Object.values(items).filter(item => item.craftingRecipes?.length).map((data, i) => new Item({...data, index: i}, player));
// const allCraftableItems = Object.values(items).filter(item => item.craftingRecipes).reduce((ac, v, i, a) => [...a, ...ac], []).map((data, i) => new Item({...data, index: i}, player)); // 64
// const allCraftableItems = Object.values(items).filter(item => item.craftingRecipes).reduce((ac, v, i, a) => [...a, ...ac], []).reduce((ac, v, i, a) => [...a, ...ac], []).map((data, i) => new Item({...data, index: i}, player)); // 4096
let lastOpenedCraftingRecipe = {height: 0, key: null}; // clears value after transition is over
const craftingValues = {
	gridItems: allCraftableItems,
	sortOrder: "",
	removeFilter: [],
	addFilter: [],
	selectedResipe: "",
	itemNeedsToBeInRecipe: "",
	lastCrafted: {index: 0, id: "", updates: null},
	craftingElementsHeight: [],
	history: {}
}
const craftInv = itemsMenu.querySelector(".crafting .craftableItems");

function generateCraftingItemsList(array) {
	if(array) craftingValues.gridItems = array;
	craftInv.textContent = "";

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
	} else if(craftingValues.sortOrder.startsWith("Craftable")) {
		craftingValues.gridItems.sort((v1, v2) => {
			return canYouCraft(v2) - canYouCraft(v1);
		})
	} if(array && craftingValues.sortOrder.indexOf("reverse") !== -1) {
		craftingValues.gridItems.reverse();
	} if(craftingValues.sortOrder == "") craftingValues.gridItems.sort((v1, v2) => v1.index - v2.index);

	craftingValues.craftingElementsHeight = formatElementLeghtArray([[...new Array(craftingValues.gridItems.length)].map(() => 50)]);

	drawVisibleCraftingItems(true);
	craftInv.scrollTop = 0;
}

function filterCraftingItems(array) {
	if(craftingValues.removeFilter.length == 0 && craftingValues.addFilter.length == 0) return array;
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
searchBar.addEventListener("input", () => craftingSearch());

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

	const historyKey = `${craftingValues.removeFilter.sort().join("")}§${craftingValues.addFilter.sort().join("")}§${searchName.sort().join("")}§${searchTags.sort().join("")}§${craftingValues.itemNeedsToBeInRecipe}`;

	if(craftingValues.history[historyKey]) {
		if(craftingValues.history[historyKey].length) generateCraftingItemsList(craftingValues.history[historyKey]);
		else if(returnEmpty) generateCraftingItemsList(craftingValues.history[historyKey]);
		else searchBar.classList.add("failed");
	} else {
		const perfectSearch = []; // Name and tags are identical
		const strictSearch = []; // indexOf whole name and all tags startWith
		const mediumSearch = []; // indexOf all words from name (not duplicate) and all tags indexOf
		const easySearch = [];   // indexOf any word and any tag
	
		const lookForItems = craftingValues.itemNeedsToBeInRecipe;
		const filteredVersionOfitems = lookForItems ? filterCraftingItems( allItemsUsedForCrafting[lookForItems] ) : filterCraftingItems( allCraftableItems );
	
		if(search.length == 0 || search == "#") {
			craftingValues.history[historyKey] = filteredVersionOfitems;
			return generateCraftingItemsList(filteredVersionOfitems);
		} else filteredVersionOfitems.forEach(item => {
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
		
		if(perfectSearch.length) {
			craftingValues.history[historyKey] = perfectSearch;
			generateCraftingItemsList(perfectSearch);
		}	else if(strictSearch.length) {
			craftingValues.history[historyKey] = strictSearch;
			generateCraftingItemsList(strictSearch);
		}	else if(mediumSearch.length) {
			craftingValues.history[historyKey] = mediumSearch;
			generateCraftingItemsList(mediumSearch);
		}	else if(easySearch.length) {
			craftingValues.history[historyKey] = easySearch; 
			generateCraftingItemsList(easySearch);
		}	else {
			searchBar.classList.add("failed");
			craftingValues.history[historyKey] = [];
			if(returnEmpty) generateCraftingItemsList([]);
		}
	}

	
	const refressFaled = craftInv.querySelector(".craftingItem:hover>.name");
	if(refressFaled) return;
	const hoverIsCraftingRecipeItemRow = hoverBox.querySelector("div[crafting] .itemTitle");
	const hoverIsCraftingWarning = hoverBox.querySelector("div[cantbecrafted]");
	const hoverIsCraftingRecipe = hoverBox.querySelector("div[recipe]");
	if(hoverIsCraftingRecipeItemRow || hoverIsCraftingWarning || hoverIsCraftingRecipe) hoverBox.textContent = "";
};

const sortButton = itemsMenu.querySelector(".toolBar .sort");
sortButton.addEventListener("click", e => {
	const subMenuContainer = sortButton.querySelector(".subMenu");
	sortButton.classList.add("active");

	window.onclick = closeCraftingDropdownMenus;
	
	if(e.target == sortButton) {
		const lastSortElem = sortButton.querySelector(".value .sortValue");
		const [,lastName, lastSortState] = lastSortElem?.classList ?? [];
		if(subMenuContainer.querySelector(".sortValue")) {
			sortButton.classList.remove("active");
			return subMenuContainer.textContent = "";
		}
		
		["Name", "Damage", "Defence", "Use_time", "Tags", "Craftable"].forEach(sortTitle => {
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
			if(craftingValues.sortOrder.endsWith("reverse")) craftingValues.sortOrder = sortSelection;
			else craftingValues.sortOrder = sortSelection + " reverse";
			e.target.classList.toggle("selected");
			e.target.classList.toggle("reverse");
		} else {
			craftingValues.sortOrder = sortSelection;
			e.target.classList.add("selected");
		}

		if(sortSelection !== "Craftable") generateCraftingItemsList();
		else generateCraftingItemsList(craftingValues.gridItems);
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
		appendRecipeElement(recipesSubmenu, item);
	}
	
	if(clickedItem.classList.toggle("selected")) {
		const totalHeight = Array.from(recipesSubmenu.children).map(e => e.getBoundingClientRect().height).reduce((a, v) => a + v);
		recipesSubmenu.style.maxHeight = `${totalHeight}px`;
		updateElementHeightArray(craftingValues.craftingElementsHeight, itemIndex, 49 + totalHeight);
		// Jos avaat receptin ja scrollaat alas, kesken avaamis transitionin, näet vähän mustaa, tää fixaa sen :D
		Object.assign(lastOpenedCraftingRecipe, {height: totalHeight + 49, key: recipesSubmenu});
		setTimeout(() => {
			if(lastOpenedCraftingRecipe.key == recipesSubmenu) {
				Object.assign(lastOpenedCraftingRecipe, {height: 0, key: null});
			}
		}, 500);
	} else {
		recipesSubmenu.style.maxHeight = null;
		updateElementHeightArray(craftingValues.craftingElementsHeight, itemIndex, 50);
		drawVisibleCraftingItems();
	}
});



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

function craftWithSearch() {
	const search = whatCanCraft.value.toLowerCase().replaceAll(/ +/g, " ");
	const searchName = [];
	const searchTags = [];

	const splitWithTags = search.split(/(#)| /g);

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

function craftingItem(index, item, open = false) {
	const craftingItemDiv = element("div").setClass("craftingItem");
	const imageContainer = element("div").setClass("imageContainer");
	const img = element("img").setClass("icon").setSrc(`./images/${item.image}`);
	const name = element("p").setClass("name").setText(item.name);
	const tags = element("p").setClass("tags").setText(`#${item.tags.join(" #")}`);
	const arrow = element("div").setClass("arrow");
	const recipes = element("div").setClass("recipes");

	imageContainer.append(img);
	craftingItemDiv.append(imageContainer, name, tags, arrow, recipes);
	craftingItemDiv.setAttribute("index", index);

	if(open) {
		appendRecipeElement(recipes, item);
		recipes.style.maxHeight = craftingValues.craftingElementsHeight[0][index] - 49 + "px";
		craftingItemDiv.classList.add("selected");

		if(recipes.classList.contains("cantCraft")) craftingItemDiv.classList.add("cantCraft");
	} else if( !canYouCraft(item) ) craftingItemDiv.classList.add("cantCraft");

	addHover([craftingItemDiv, "crafting"], item.hoverText());
	return craftingItemDiv;
}

function updateCraftingItem(index, item) {
	const craftingItemDiv = craftInv.querySelector(`div[index="${index}"].craftingItem`);
	const open = craftingItemDiv.classList.contains("selected");

	if(open) {
		craftingItemDiv.classList.add("selected");
		let cantCraftResipe = true;
		for(const [key, row] of Object.entries(item.craftingRecipes)) {
			const rowElement = craftingItemDiv.querySelector(".recipes").children[key];
			const items = rowElement.querySelector(".items");
			const craftingButton = rowElement.querySelector(".craftingButton");
			let cantCraftRow = false;
			
			for(const [key, itemData] of Object.entries(row.items)) {
				const itemDiv = items.children[key];
				const nItem = new Item({id: itemData.item}, player);
				if(itemDiv.classList.toggle("cantCraft", (player.totalItemCounts[itemData.item] || 0) < itemData.amount)) {
					cantCraftRow = true;
				} recipeItemHover(itemDiv, itemData, nItem);
			}
	
			if(rowElement.classList.toggle("cantCraft", cantCraftRow)) craftingButton.onclick = null;
			else {
				craftingButton.onclick = () => craftItem(item, row);
				cantCraftResipe = false;
			}
		}
	
		craftingItemDiv.classList.toggle("cantCraft", cantCraftResipe);
	} else craftingItemDiv.classList.toggle("cantCraft", !canYouCraft(item));
}

function appendRecipeElement(parent, item) {
	let cantCraftResipe = true;
	for(const row of item.craftingRecipes) {
		const rowElement = element("div").setClass("row");
		const craftingButton = element("div").setClass("craftingButton");
		const img = element("img").setSrc(`./images/${item.image}`);
		const items = element("div").setClass("items");

		if(row.craftingAmount > 2) craftingButton.append(img, element("p").setText(row.craftingAmount).setClass("itemAmount"));
		else craftingButton.append(img);
		rowElement.append(craftingButton, items);

		let cantCraftRow = false;

		for(const itemData of row.items) {
			const nItem = new Item({id: itemData.item}, player);
			const itemDiv = element("div").setClass("item");
			const img = element("img").setSrc(`./images/${nItem.image}`);
			const itemAmount = element("p").setText(itemData.amount).setClass("itemAmount");
			itemDiv.append(img, itemAmount);
			items.append(itemDiv);

			if((player.totalItemCounts[itemData.item] || 0) < itemData.amount) {
				itemDiv.classList.add("cantCraft");
				cantCraftRow = true;
			} if(!nItem.craftingRecipes) {
				const warningElem = element("p").setClass("warning").setText("!");
				addHover([warningElem, "cantBeCrafted"], "Item can't be crafted");
				itemDiv.append(warningElem);
			} else itemDiv.onclick = () => leftClickRecipeItem(nItem);
			itemDiv.oncontextmenu = e => rightClickRecipeItem(e, nItem);

			recipeItemHover(itemDiv, itemData, nItem);
		}

		if(cantCraftRow) rowElement.classList.add("cantCraft");
		else {
			craftingButton.onclick = () => craftItem(item, row);
			cantCraftResipe = false;
		}

		parent.append(rowElement);
	}

	if(cantCraftResipe) parent.classList.add("cantCraft");
}

function canYouCraft(item) {
	return item?.craftingRecipes?.findIndex(row => {
		return !row.items?.find(itemData => (player.totalItemCounts[itemData.item] || 0) < itemData.amount);
	}) !== -1;
}

function leftClickRecipeItem(item) {
	if(item.craftingRecipes) {
		itemsMenu.querySelector("input.searchBar").value = item.name + "#" + item.tags.join("#");
		generateCraftingItemsList([item]);
		itemsMenu.querySelector("#clearCraftingSearchBar").classList.remove("hidden");
		craftInv.querySelector(".craftingItem").click();
		hoverBox.querySelector("[recipe]").remove();
	}
}

function rightClickRecipeItem(e, item) {
	craftingValues.itemNeedsToBeInRecipe = item.id;
	generateCraftingItemsList(allItemsUsedForCrafting[item.id]);
	hoverBox.querySelector("div[recipe]")?.remove?.();
	whatCanCraftButton.querySelector(".value").innerHTML = `<div class="row selected" itemid="${item.id}">
		<img src="./images/${item.image}">
		<p>${item.name}</p>
		<div class="remove"></div>
	</div>`;
	e.preventDefault();
	return false
}

function craftItem(item, recipe) {
	const slotItems = [...Object.values(player.hotbar), ...Object.values(player.armor)]
	const recipeItems = recipe.items.map(row => {
		const total = slotItems.reduce((acc, item) => {
			if(item.id === row.item) acc += item.amount;
			return acc;
		}, 0);

		return {...row, takeFromSlot: row.amount - (player.totalItemCounts[row.item] - total)};
	});

	for(let i = 0; i < player.inventory.length; i++) {
		const item = player.inventory[i];
		if(recipeItems.length == 0) break;
		for(let j = 0; j < recipeItems.length; j++) {
			const recipeRow = recipeItems[j];
			if(item.id === recipeRow.item) {
				if(item.slot && recipeRow.takeFromSlot === 0) continue;
				if(item.amount) {
					if(item.slot && recipeRow.takeFromSlot > 0) recipeRow.takeFromSlot -= recipeRow.amount;
					player.takeItem(i, recipeRow.amount)
					recipeItems.splice(j, 1);
				} else if(--recipeRow.amount === 0) {
					recipeItems.splice(j, 1);
					player.takeItem(i, 1);
					if(item.slot && recipeRow.takeFromSlot > 0) recipeRow.takeFromSlot -= 1;
				}

				i--;
				break;
			}
		}
	}
	
	item.amount = recipe.craftingAmount;
	player.giveItem(item);

	updateVisibleCraftingItems();
	generateItemsOnGrid(player.inventory);
}

function recipeItemHover(elem, recipeRow, item) {
	const notEnoughText = `<nct><v>(player.totalItemCounts["${recipeRow.item}"] || 0) < ${recipeRow.amount} ? "notEnough" : "notEnough hidden"<v><nct>Not enough items§<nct>itemData<nct>`;
	const tooltipText = [
		"<ct>craftingTooltip<ct>",
		`[Left click]<cl>hotkey${item?.craftingRecipes ? "" : " hide"}<cl>`,
		`§<cl>right hotkey<cl>[Right click]`,
		`§Show recipe${item?.craftingRecipes ? "" : "<cl>hide<cl>"}`,
		`§<cl>right<cl>Used in`].join("");

	addHover([elem, "crafting"], notEnoughText + item.hoverText() + tooltipText);
}

craftInv.addEventListener("scroll", () => drawVisibleCraftingItems());

function formatElementLeghtArray(array) {
	for(let i = 0; i < 100; i++) {
		const lastArray = array[array.length - 1];
		if(lastArray.length < 2) return array;
		array.push(lastArray.reduce((acc, v, i) => {
			const result = Math.floor(i / 2);
			if(acc[result]) acc[result] += v ?? 0
			else acc[result] = v ?? 0
			return acc;
		}, []));
	}
}

function updateElementHeightArray(array, index, value) {
	const arvonEro = value - array[0][index];
	for(let i = 0; i < array.length; i++) {
		array[i][index] += arvonEro;
		index = Math.floor(index / 2);
	}
}

function drawVisibleCraftingItems(fullReDraw = false) {
	if(craftingValues.gridItems.length === 0) return;
	const totalHeight = craftingValues.craftingElementsHeight[craftingValues.craftingElementsHeight.length - 1][0];
	const clientHeight = (craftInv.clientHeight || innerHeight) + lastOpenedCraftingRecipe.height;
	const scrollTop = craftInv.scrollTop;
	
	const startIndex = craftingElementIndexByHeight(craftingValues.craftingElementsHeight, scrollTop);
	const endIndex = craftingElementIndexByHeight(craftingValues.craftingElementsHeight, scrollTop + clientHeight - 1);
	const topHeight = craftingElementTopByIndex(craftingValues.craftingElementsHeight, startIndex);
	const elementsHeight = craftingElementTopByIndex(craftingValues.craftingElementsHeight, endIndex) + craftingValues.craftingElementsHeight[0][endIndex] - topHeight - (scrollTop - topHeight);

	if(fullReDraw == true) craftInv.innerHTML = "";
	const firstElementIndex = parseInt(craftInv.children[0]?.getAttribute("index") ?? craftingValues.craftingElementsHeight.length);
	const lastElementIndex = parseInt(craftInv.children[craftInv.children.length - 1]?.getAttribute("index") ?? -1);

	
	loop: {
		if(firstElementIndex == startIndex && lastElementIndex == endIndex && fullReDraw == false) break loop;
		
		if(lastElementIndex < endIndex) {
			for(let i = Math.max(lastElementIndex + 1, startIndex); i <= endIndex; i++) {
				const height = craftingValues.craftingElementsHeight[0][i];
				const item = craftingValues.gridItems[i];
				
				const isOpen = height > 50;
				const element = craftingItem(i, item, isOpen);
				craftInv.append(element);
			}
		} else if(firstElementIndex > startIndex) {
			for(let i = Math.min(firstElementIndex - 1, endIndex); i >= startIndex; i--) {
				const height = craftingValues.craftingElementsHeight[0][i];
				const item = craftingValues.gridItems[i];
				
				const isOpen = height > 50;
				const element = craftingItem(i, item, isOpen);
				craftInv.prepend(element);
			}
		}

		if(fullReDraw == false) Array.from(craftInv.children).forEach(e => {
			const index = parseInt(e.getAttribute("index"));
			if(index < startIndex || index > endIndex) e.remove();
		});
	}

	if(endIndex == craftingValues.gridItems.length - 1) craftInv.style.setProperty('--bottom', "0px");
	else craftInv.style.setProperty('--bottom', totalHeight - topHeight - elementsHeight - (scrollTop - topHeight) + "px");
	
	craftInv.style.setProperty('--top', topHeight + "px");
}

function updateVisibleCraftingItems() {
	const craftingChilds = craftInv.children;
	const startIndex = parseInt(craftingChilds[0]?.getAttribute("index") ?? 0);

	for(let i = 0; i < craftingChilds.length; i++) {
		const item = craftingValues.gridItems[startIndex + i];
		updateCraftingItem(startIndex + i, item);
	}
}

function craftingElementIndexByHeight(array, height) {
	let index = 0;
	let minNum = 0;

	if(height >= array[array.length - 1]) return array[0].length - 1;

	for(let i = array.length - 2; i >= 0; i--) {
		const aNum = minNum + array[i][index];
		const bNum = aNum + array[i][index + 1];

		if(!(aNum > height)) {
			index++;
			minNum = aNum;
		} if(i !== 0) index *= 2;
	} return index;
}

function craftingElementTopByIndex(array, searchIndex) { 
	let extraHeight = 0;
	let rowIndex = 0;
	const currentIndexHeight = array[0][searchIndex];

	while(searchIndex > 0) {
		if(searchIndex % 2 == 0) extraHeight += (array[rowIndex][searchIndex + 1] ?? 0);
		searchIndex = Math.floor(searchIndex / 2);
		rowIndex++;
	} return array[rowIndex][0] - extraHeight - currentIndexHeight;
}