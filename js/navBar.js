document.querySelector("#craftingMenuButton").addEventListener("click", e => {
  itemsMenu.classList = "craft";
  document.body.classList = "itemsMenu";
  itemsMenuInventoryResize();
  generateItemsOnGrid(player.inventory.slice());
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



craftingMenuButton.click();

function test() {
  console.time("loop")
  document.querySelectorAll(".craftingItem").forEach(v => {
    v.getBoundingClientRect();
  })
  console.timeEnd("loop")
}