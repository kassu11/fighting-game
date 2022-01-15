const allCraftableItems = Object.values(items).filter(item => item.craftingRecipes?.length).map((data, i) => new Item({...data, index: i}));
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
}
const craftInv = itemsMenu.querySelector(".crafting .craftableItems");

function generateCraftingItemsList(array) {
	if(array) craftingValues.gridItems = array;
	craftInv.textContent = "";
	const hover = hoverBox.querySelector("div");

	const sortA = craftingValues.sortOrder.indexOf("reverse") !== -1 ? -1 : 1;
	const sortB = sortA * -1;

	if(craftingValues.sortOrder == "") craftingValues.gridItems.sort((v1, v2) => v1.index - v2.index);
	else if(craftingValues.sortOrder.startsWith("Name")) {
		craftingValues.gridItems.sort((v1, v2) => v1.name > v2.name ? sortA : sortB)
	} else if(craftingValues.sortOrder.startsWith("Tags")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const tag1 = v1.tags.join("");
			const tag2 = v2.tags.join("");
			if(tag1 == tag2) return v1.name > v2.name ? 1 : -1;
			return tag1 > tag2 ? sortA : sortB;
		});
	} else if(craftingValues.sortOrder.startsWith("Use_time")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const time1 = v1.useTime ?? -1;
			const time2 = v2.useTime ?? -1;
			if(time1 == time2) return v1.name > v2.name ? 1 : -1;
			if(time1 == -1 || time2 == -1) return time1 < time2 ? 1 : -1;
			return time1 < time2 ? sortA : sortB;
		});
	} else if(craftingValues.sortOrder.startsWith("Damage")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const dm1 = v1.calcDamage().totalMaxDmg() || -1;
			const dm2 = v2.calcDamage().totalMaxDmg() || -1;
			if(dm1 == dm2) return v1.name > v2.name ? 1 : -1;
			if(dm1 == -1 || dm2 == -1) return dm1 < dm2 ? 1 : -1;
			return dm2 > dm1 ? sortA : sortB;
		})
	} else if(craftingValues.sortOrder.startsWith("Defence")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const data1 = v1.defencePercentage ?? -1;
			const data2 = v2.defencePercentage ?? -1;
			if(data1 == data2) return v1.name > v2.name ? 1 : -1;
			if(data1 == -1 || data2 == -1) return data1 < data2 ? 1 : -1;
			return data1 < data2 ? sortA : sortB;
		});
	} else if(craftingValues.sortOrder.startsWith("Health_boost")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const data1 = v1.healthBoostValue ?? -1;
			const data2 = v2.healthBoostValue ?? -1;
			if(data1 == data2) return v1.name > v2.name ? 1 : -1;
			if(data1 == -1 || data2 == -1) return data1 < data2 ? 1 : -1;
			return data1 < data2 ? sortA : sortB;
		});
	} else if(craftingValues.sortOrder.startsWith("Mana_boost")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const data1 = v1.manaBoostValue ?? -1;
			const data2 = v2.manaBoostValue ?? -1;
			if(data1 == data2) return v1.name > v2.name ? 1 : -1;
			if(data1 == -1 || data2 == -1) return data1 < data2 ? 1 : -1;
			return data1 < data2 ? sortA : sortB;
		});
	} else if(craftingValues.sortOrder.startsWith("Reduce_dmg")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const data1 = v1.defenceValue ?? -1;
			const data2 = v2.defenceValue ?? -1;
			if(data1 == data2) return v1.name > v2.name ? 1 : -1;
			if(data1 == -1 || data2 == -1) return data1 < data2 ? 1 : -1;
			return data1 < data2 ? sortA : sortB;
		});
	} else if(craftingValues.sortOrder.startsWith("Craftable")) {
		craftingValues.gridItems.sort((v1, v2) => {
			const craftable1 = ManyTimesCanCraft(v1);
			const craftable2 = ManyTimesCanCraft(v2);
			if(craftable1 == craftable2) return v1.index - v2.index;
			if(craftable1 == 0 || craftable2 == 0) return craftable1 < craftable2 ? 1 : -1;
			return craftable1 < craftable2 ? sortA : sortB;
		});
	}

	craftingValues.craftingElementsHeight = formatElementLeghtArray([[...new Array(craftingValues.gridItems.length)].map(() => 50)]);

	drawVisibleCraftingItems(true);
	craftInv.scrollTop = 0;
	if(hover === hoverBox.querySelector("div")) {
		if(itemsMenu.querySelector(".crafting:hover")) hoverBox.innerHTML = "";
	}
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
			if(type == "Melee_damage" && value.maxMeleDmg) return true;
			if(type == "Range_damage" && value.maxRangeDmg) return true;
			if(type == "Magic_damage" && value.maxMagicDmg) return true;
			if(type == "Bullet_damage" && value.maxArrowDmg) return true;
			if(type == "Defence" && value.defencePercentage) return true;
			if(type == "Health_boost" && value.healthBoostValue) return true;
			if(type == "Mana_boost" && value.manaBoostValue) return true;
			if(type == "Reduce_dmg" && value.defenceValue) return true;
			if(type == "Healing" && value.healV) return true;
			if(type == "Mana" && value.mana) return true;
			if(type == "Use_time" && value.useTime) return true;
		}
	})
}

const searchBar = itemsMenu.querySelector(".toolBar input.searchBar");
searchBar.addEventListener("input", () => craftingSearch(true));

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

	const strictSearch = [];

	const lookForItems = craftingValues.itemNeedsToBeInRecipe;
	const filteredVersionOfitems = lookForItems ? filterCraftingItems( allItemsUsedForCrafting[lookForItems] ) : filterCraftingItems( allCraftableItems );
	
	if(search.length == 0 || search == "#") {
		return generateCraftingItemsList(filteredVersionOfitems);
	} else filteredVersionOfitems.forEach(item => {
		const itemName = item.name.toLowerCase();

		if(itemName.indexOf(searchName.join(" ")) !== -1) {
			const tagNotFound = !searchTags.find(tag => item.tags.find(itag => itag.startsWith(tag)) == null);
			if(tagNotFound || searchTags.length == 0) return strictSearch.push(item);
		}
	});
	
	if(strictSearch.length) generateCraftingItemsList(strictSearch);
	else {
		searchBar.classList.add("failed");
		if(returnEmpty) generateCraftingItemsList([]);
	}
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
		
		["Name", "Tags", "Use_time", "Damage", "Defence", "Health_boost", "Mana_boost", "Reduce_dmg",  "Craftable"].forEach(sortTitle => {
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

		return ["Melee_damage", "Range_damage", "Magic_damage", "Bullet_damage", "Defence", "Health_boost", "Mana_boost", "Reduce_dmg", "Healing", "Mana", "Use_time"].forEach(title => {
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
	let recipeAdded = false;

	craftingValues.lastCrafted.id = "";

	if(!recipesSubmenu.textContent && recipes?.length) {
		addHover(recipesSubmenu, "");
		appendRecipeElement(recipesSubmenu, item);
		recipeAdded = true;
	}
	
	if(clickedItem.classList.toggle("selected")) {
		const totalHeight = Array.from(recipesSubmenu.children).map(e => e.getBoundingClientRect().height).reduce((a, v) => a + v);
		recipesSubmenu.style.maxHeight = `${totalHeight}px`;
		updateElementHeightArray(craftingValues.craftingElementsHeight, itemIndex, 49 + totalHeight);
		if(!recipeAdded) updateCraftingItem(itemIndex, item);
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

	const strictSearch = []; // indexOf whole name and all tags startWith
	const filteredVersionOfitems = listOfAllItemsUsedForCrafting;

	if(search.length == 0 || search == "#") return generateWhatCanCraftList(filteredVersionOfitems);
	else filteredVersionOfitems.forEach(item => {
		const itemName = item.name.toLowerCase();
		
		if(itemName.indexOf(searchName.join(" ")) !== -1) {
			const tagNotFound = !searchTags.find(tag => item.tags.find(itag => itag.startsWith(tag)) == null);
			if(tagNotFound || searchTags.length == 0) return strictSearch.push(item);
		}
	});
	generateWhatCanCraftList(strictSearch);
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

		addCraftingButtonHover(craftingButton, item, row.craftingAmount);

		if(row.craftingAmount > 1 || item.amount) craftingButton.append(img, element("p").setText(row.craftingAmount).setClass("itemAmount"));
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
				if(enemyDrops[nItem.id] || levelDrops[nItem.id]) itemDiv.onclick = () => leftClickRecipeItemToGetWiki(nItem.id);
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

function addCraftingButtonHover(elem, item, amount) {
	const notEnoughText = `<nct><v>craftInv.querySelector(".row:hover.cantCraft") ? "craftingButton notEnough" : "craftingButton"<v><nct>Craft item [ ${amount} ]§<nct>itemData<nct>`;
	addHover([elem, "crafting"], notEnoughText + item.hoverText());
}

function canYouCraft(item) {
	return item?.craftingRecipes?.findIndex(row => {
		return !row.items?.find(itemData => (player.totalItemCounts[itemData.item] || 0) < itemData.amount);
	}) !== -1;
}

function ManyTimesCanCraft(item) {
	let rowMax = 0;
	main: for(const row of item.craftingRecipes) {
		let num = null;
		for(const itemData of row.items) {
			const amount = Math.floor((player.totalItemCounts[itemData.item] || 0) / itemData.amount);
			if(amount == 0) continue main;
			if(amount < num || num == null) num = amount;
		} 
		
		if(num > rowMax) rowMax = num;
	} return rowMax;
}

function leftClickRecipeItem(item) {
	if(item.craftingRecipes) {
		itemsMenu.querySelector("input.searchBar").value = item.name + "#" + item.tags.join("#");
		generateCraftingItemsList([item]);
		itemsMenu.querySelector("#clearCraftingSearchBar").classList.remove("hidden");
		craftInv.querySelector(".craftingItem")?.click();
	}
}

function leftClickRecipeItemToGetWiki(itemId) {
	if(enemyDrops[itemId] || levelDrops[itemId]) {
		document.body.classList = "wikiMenu";
		wikiGenerateItemInfo(itemId);
	};
}

function rightClickRecipeItem(e, item) {
	craftingValues.itemNeedsToBeInRecipe = item.id;
	generateCraftingItemsList(allItemsUsedForCrafting[item.id]);
	whatCanCraftButton.querySelector(".value").innerHTML = `<div class="row selected" itemid="${item.id}">
		<img src="./images/${item.image}">
		<p>${item.name}</p>
		<div class="remove"></div>
	</div>`;
	e?.preventDefault();
	return false
}

function craftItem(item, recipe) {
	const slotItems = [...Object.values(player.hotbar), ...Object.values(player.armor)]
	const recipeItems = recipe.items.map(row => {
		const total = slotItems.reduce((acc, item) => {
			if(item.id === row.item) acc += item.amount ?? 1;
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
				if(item.slot && recipeRow.takeFromSlot <= 0) continue;
				if(item.amount) {
					if(item.slot && recipeRow.takeFromSlot > 0) recipeRow.takeFromSlot -= recipeRow.amount;
					player.takeItem(i, recipeRow.amount)
					recipeItems.splice(j, 1);
				} else {
					player.takeItem(i, 1);
					if(--recipeRow.amount == 0) recipeItems.splice(j, 1);
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
	hoverBox.querySelector(".craftingButton")?.classList.toggle("notEnough", craftInv.querySelector(".row:hover.cantCraft"))
}

function recipeItemHover(elem, recipeRow, item) {
	const notEnoughText = `<nct><v>(player.totalItemCounts["${recipeRow.item}"] || 0) < ${recipeRow.amount} ? "notEnough" : "notEnough hidden"<v><nct>Not enough items§<nct>itemData<nct>`;
	const leftToopTip = (item?.craftingRecipes || enemyDrops[item.id] || levelDrops[item.id]);
	const leftText = item?.craftingRecipes ? "Show recipe" : "Show wiki";
	const tooltipText = [
		"<ct>craftingTooltip<ct>",
		`[Left click]<cl>hotkey${leftToopTip ? "" : " hide"}<cl>`,
		`§<cl>right hotkey<cl>[Right click]`,
		`§${leftText}${leftToopTip ? "" : "<cl>hide<cl>"}`,
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