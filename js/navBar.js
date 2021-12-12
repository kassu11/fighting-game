document.querySelector("#craftingMenuButton").addEventListener("click", e => {
	itemsMenu.classList = "craft";
	document.body.classList = "itemsMenu";
	itemsMenuInventoryResize();
	generateItemsOnGrid(player.inventory.slice());
	generateCraftingItemsList();
});
document.querySelector("#levelsMenuButton").addEventListener("click", e => {
	document.body.classList = "levelMenu"
});
document.querySelector("#inventoryButton").addEventListener("click", e => {
	itemsMenu.classList = "inv";
	itemsMenuInventoryResize();
});

document.querySelector("#inventoryButton").addEventListener("click", () => {
	document.body.classList = "itemsMenu";
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



// craftingMenuButton.click();
