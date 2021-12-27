const itemsMenu = document.querySelector("#itemsMenu");
const itemsMenuHoverOpacitys = [];
let itemsMenuArray = [];

function generateItemsOnGrid(items) {
	player.updateArmorStats();
	const armorSlotNames = ["head", "chest", "legs"];
	itemsMenuArray = items;
	if(!Array.isArray(items)) return;
	const itemBox = itemsMenu.querySelector(".inventoryContainer .inventoryBox");
	itemBox.innerHTML = "";

	items.forEach(item => {
		let itemHover = item.hoverText?.() ?? "";
		const div = document.createElement("div");
		div.classList.add("inv");

		if(item.slot) {
			if(item.slot.startsWith("hotbarSlot")) {
				const slotNum = document.createElement("p");
				const num = item.slot.substr(10);
				slotNum.textContent = num;
				slotNum.classList.add("slotNum");
				div.classList.add("hotbar")
				div.append(slotNum);
				// itemHover += `\nEquipped: §<c>#00ff1e<c><css>font-weight: 600<css>hotbar ${num}`;
				itemHover = `<nct>equippedHotbar<nct>Equipped: hotbar ${num}<nct>itemData<nct>` + itemHover;
			} else if(item.slot.startsWith("armor")) {
				const index = armorSlotNames.indexOf(item.slot.substr(5));
				div.innerHTML += `<p class="slotNum">${index + 1}</p>`
				div.classList.add("armor");
				// itemHover += `\nEquipped: §<c>#008eff<c><css>font-weight: 600<css>${armorSlotNames[index]}`;
				itemHover = `<nct>equippedArmor<nct>Equipped: ${armorSlotNames[index]}<nct>itemData<nct>` + itemHover;
			}
		}

		if(item.image) {
			const img = document.createElement("img");
			img.src = "./images/" + item.image;
			div.append(img);
		} if(item.amount) {
			const itemAmount = document.createElement("p");
			itemAmount.textContent = item.amount;
			itemAmount.classList.add("itemAmount");
			div.append(itemAmount);
		}

		addHover(div, itemHover, []);    
		itemBox.append(div);
	});
}

function updateItemsMenuHotbar() {
	const hotbarBox = itemsMenu.querySelector(".hotbarBox");
	hotbarBox.innerHTML = "";
	const hotbarLength = Object.keys(player.hotbar).length;

	for(let i = 1; i <= hotbarLength; i++) {
		const item = player.hotbar["hotbarSlot" + i];
		hotbarBox.innerHTML += `<div class="slot">
			<p class="slotNumber">${i}</p>
			<img src="${item.image ? "./images/" + item.image : ""}" class="slotImage">
			<p class="itemAmount">${item.useAmmoType ? item.ammoAmount() : item.amount ?? ""}</p>
		</div>`
	}

	hotbarBox.querySelectorAll(".slot").forEach((elem, i) => {
		const item = player.hotbar["hotbarSlot" + (i + 1)] ?? {};
		if(item.id) addHover(elem, item?.hoverText?.() ?? "", []);
	});
}

itemsMenu.addEventListener("click", ({target, x, y}) => {
	const container = itemsMenu.querySelector("#itemMenuPopUp .container");
	const isHotbarItem = target.classList.contains("slot");
	const isInvItem = target.classList.contains("inv");
	const isArmorSlot = target.classList.contains("armorSlot");

	if(target.closest(".container")) return;

	const itemElements = isInvItem ? itemsMenu.querySelector(".inventoryBox").childNodes : null;
	const hotbarElements = isHotbarItem ? itemsMenu.querySelectorAll(".hotbarContainer .hotbarBox .slot") : null;
	const index = itemElements ? Array.from(itemElements).indexOf(target)
	: hotbarElements ? Array.from(hotbarElements).indexOf(target) + 1
	: isArmorSlot ? target.classList[1] : null;
	const item = isInvItem ? itemsMenuArray[index]
	: isHotbarItem ? player.hotbar["hotbarSlot" + index]
	: isArmorSlot ? player.armor[target.classList[1]] : {};
	
	if(!item.id) return closePopUp();
	if(container.getAttribute("index") !== "" && index == container.getAttribute("index")) return closePopUp();

	const hoverBlock = document.querySelector("#hoverBox div");
	const hoverText = item.hoverText?.() ?? "";
	
	if(hoverBlock) {
		hoverBlock.style.opacity = 0;
		itemsMenuHoverOpacitys.push(hoverBlock);
	}

	container.innerHTML = `
	<div class="itemInfo"></div>
	<div class="equipBox">
		<p></p>
	</div>`

	container.querySelector(".itemInfo").append(customTextSyntax(hoverText));

	if(item.canEquipTo == "hotbar") {
		container.querySelector(".equipBox p").textContent = "Equip to hotbar:";
		for(let i = 1; i <= Object.keys(player.hotbar).length; i++) {
			const hotbarItem = player.hotbar["hotbarSlot" + i] ?? {};
			const num = item.slot?.startsWith("hotbarSlot") ? +item.slot.substr(10) : -1;
			const div = document.createElement("div");

			div.classList.add("equipHotbar");
			if(num == i) {
				div.classList.add("remove");
				div.innerHTML = `<p class="slotText">${i}. Unequip ${hotbarItem.name ?? ""}</p>`
			} else if(hotbarItem.id && num == -1) {
				div.classList.add("replace");
				div.innerHTML = `<p class="slotText">${i}. Replace ${hotbarItem.name ?? ""}</p>`
			} else if(hotbarItem.id && num !== -1) {
				div.classList.add("swap");
				div.innerHTML = `<p class="slotText">${i}. Swap with ${hotbarItem.name ?? ""}</p>`
			} else if(num !== -1) {
				div.classList.add("switch");
				div.innerHTML = `<p class="slotText">${i}. Switch to empty</p>`
			} else {
				div.classList.add("add");
				div.innerHTML = `<p class="slotText">${i}. Add to empty</p>`
			}
	
			div.addEventListener("click", ({}, slot = i) => {
				if(num > -1 && num != slot) {
					if(player.hotbar["hotbarSlot" + slot].id) {
						player.hotbar["hotbarSlot" + num] = player.hotbar["hotbarSlot" + slot];
						player.hotbar["hotbarSlot" + num].slot = "hotbarSlot" + num;
						player.hotbar["hotbarSlot" + slot] = {};
					} else player.hotbar["hotbarSlot" + num] = {};
				}
				player.hotbar["hotbarSlot" + slot].slot = null;
				player.hotbar["hotbarSlot" + slot] = item;
				item.slot = "hotbarSlot" + slot;
	
				if(num == slot) {
					player.hotbar["hotbarSlot" + slot] = {};
					item.slot = null;
				}
	
				updateItemsMenuHotbar();
				generateItemsOnGrid(itemsMenuArray);
				closePopUp();
			});
	
			container.append(div);
		}
	} else if(item.canEquipTo.startsWith("armor")) {
		const slotName = item.canEquipTo.substr(5);
		container.querySelector(".equipBox p").textContent = `Equip to ${slotName}:`;
		const div = document.createElement("div");
		div.classList.add("equipHotbar");

		if(item.slot == `${item.canEquipTo}`) {
			div.classList.add("remove");
			div.innerHTML = `<p class="slotText">Unequip ${item.name ?? ""}</p>`
		} else if(player.armor[item.canEquipTo].id) {
			div.classList.add("replace");
			div.innerHTML = `<p class="slotText">Replace ${player.armor[item.canEquipTo].name ?? ""}</p>`
		} else {
			div.classList.add("add");
			div.innerHTML = `<p class="slotText">Add to empty</p>`
		} container.append(div);

		div.addEventListener("click", () => {
			if(item.slot == item.canEquipTo) {
				item.slot = "";
				player.armor[item.canEquipTo] = {};
			} else {
				player.armor[item.canEquipTo].slot = "";
				player.armor[item.canEquipTo] = item;
				item.slot = item.canEquipTo;
			}
			
			updateItemsArmor();
			generateItemsOnGrid(itemsMenuArray);
			updateItemsMenuHotbar();
			closePopUp();
		});
	} else if(item.canEquipTo == "none") {
		container.querySelector(".equipBox p").setText("Can't be equipped");

		if(allItemsUsedForCrafting[item.id]) {
			const div = element("div").setClass("equipHotbar add");
			const p = element("p").setText("Where to use?");
			div.append(p);
			container.append(div);
			div.onclick = () => {
				rightClickRecipeItem(null, item);
				document.querySelector("#craftingMenuButton").click();
				container.innerHTML = "";
			};
		}
	}

	if(player.debug) {
		const debugDiv = element("div").setClass("debug");
		const debugText = element("p").setText("Delete item").setClass("debugText");
		debugDiv.append(debugText);
		container.append(debugDiv);
		debugDiv.onclick = () => {
			player.takeItem(index, item.amount ?? 1);
			player.inventory.splice(index, 1);
			generateItemsOnGrid(player.inventory);
			container.innerHTML = "";
		}
	}


	const maxY = innerHeight - container.getBoundingClientRect().height - 10;
	const maxX = innerWidth - container.getBoundingClientRect().width - 10;
	container.style.left = Math.min(x + 10, maxX) + "px";
	container.style.top = Math.min(y + 10, maxY) + "px";
	container.setAttribute("index", index);

	function closePopUp() {
		container.setAttribute("index", "");
		container.innerHTML = "";
		while(itemsMenuHoverOpacitys.length) itemsMenuHoverOpacitys.pop().style.opacity = null;
	}
});

function updateItemsArmor() {
	const armorBox = itemsMenu.querySelector(".menuWindow .armorContainer .armorBox");
	armorBox.innerHTML = "";

	for(const [key, item] of Object.entries(player.armor)) {
		const div = element("div").setClass(`armorSlot ${key}${item.id ? "" : " empty"}`);
		const img = element("img").setSrc("./images/" + key + ".png");
		if(item.image) img.setSrc("./images/" + item.image);
		addHover(div, item.hoverText?.() ?? "", []);
		div.append(img);
		armorBox.append(div);
	}
}

window.addEventListener("resize", itemsMenuInventoryResize);
function itemsMenuInventoryResize() {
	const invContainer = itemsMenu.querySelector(".inventoryContainer")
	if(itemsMenu.classList.contains("inv")) {
		// const screenOffset = innerWidth - 550;
		const screenOffset = innerWidth - 60;
		const item = 70;
		const itemSize = item + 10 // item + padding
		invContainer.style.width = Math.max(screenOffset - item - screenOffset % itemSize, 0) + "px";
	} else if(itemsMenu.classList.contains("craft")) {
		const screenOffset = Math.min(innerWidth, 1600) / 2;
		const item = 70;
		const itemSize = item + 10 // item + padding
		invContainer.style.width = Math.max(screenOffset - item - screenOffset % itemSize, 0) + "px";
		if(document.querySelector(".craftableItems").children.length) drawVisibleCraftingItems();
	}
} itemsMenuInventoryResize();
