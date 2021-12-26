document.querySelector("#craftingMenuButton").addEventListener("click", e => {
	if(craftingValues.craftingElementsHeight.length == 0) generateCraftingItemsList();
	else if(itemsMenu.classList.contains("craft") && document.body.classList.contains("itemsMenu")) generateCraftingItemsList();
	else updateVisibleCraftingItems();
	itemsMenu.classList = "craft";
	document.body.classList = "itemsMenu";
	itemsMenuInventoryResize();
	generateItemsOnGrid(player.inventory.slice());
});
document.querySelector("#levelsMenuButton").addEventListener("click", e => {
	document.body.classList = "levelMenu"
});

document.querySelector("#inventoryButton").addEventListener("click", () => {
	document.body.classList = "itemsMenu";
	itemsMenu.classList = "inv";
	itemsMenuInventoryResize();
	updateItemsMenuHotbar();
	updateItemsArmor();
	generateItemsOnGrid(player.inventory.slice());
});

document.querySelector("#wikiMenuButton").addEventListener("click", () => {
	if(document.body.classList.contains("wikiMenu")) {
		document.querySelector("#wiki .wikiContent > div")?.remove();
	}
	document.body.classList = "wikiMenu";
});
