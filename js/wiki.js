const allLevelKeys = Object.keys(levels).sort((a, b) => a > b ? 1 : -1);
const enemyInLevels = allLevelKeys.reduce((acc, key) => {
	const level = levels[key];
	for(const enemy of level.enemies) {
		acc[enemy] ??= [];
		if(!acc[enemy].find(e => e === key)) acc[enemy].push(key);
	} return acc;
}, {});
const enemyDrops = Object.values(enemies).reduce((acc, enemy) => {
	if(!enemy.drops) return acc;
	for(const drop of enemy.drops) recursive(drop);
	return acc;

	function recursive(drop) {
		if(drop.items) drop.items.forEach(d => recursive(d));
		else if(drop.item) {
			acc[drop.item.id] ??= [];
			if(!acc[drop.item.id].find(e => e === enemy.id)) acc[drop.item.id].push(enemy.id);
		}
	}
}, {});


function wikiGenerateLevelsScreen() {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";
	
	const levelContainer = element("div").setClass("levelContainer");
	container.append(levelContainer);
	
	levelContainer.append( ...wikiGenerateLevels(allLevelKeys) );
}

function wikiGenerateLevel(levelId) {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";
	const level = levels[levelId];

	const levelContainer = element("div").setClass("levelData");
	container.append(levelContainer);

	for(const enemy of level.enemies) {
		const row = element("div").setClass("enemyRow");
		const rowContainer = element("div").setClass("container");
		row.append(rowContainer);

		const enemyImage = element("img").setSrc(`./images/${enemies[enemy].img}`);
		const imageContainer = element("div").setClass("imageContainer");
		const imageBox = element("div").setClass("imageBox");
		imageContainer.append(imageBox);
		imageBox.append(enemyImage);

		imageContainer.onclick = () => wikiGenerateEnemyInfo(enemy);

		const dropTree = element("div").setClass("dropTree");
		dropTree.append(...getEnemyDropTreeElements(enemy))

		const enemyStats = element("div").setClass("enemyStats");
		const statsText = customTextSyntax(
			`ID: ${enemies[enemy].id}\n` +
			`HP: ${enemies[enemy].maxHp}\n` +
			`MP: ${enemies[enemy].maxMp}`);
		enemyStats.append(statsText);

		rowContainer.append(imageContainer, enemyStats, dropTree);
		levelContainer.append(row);

	}
}

function wikiGenerateEnemyInfo(id) {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";
	const enemy = enemies[id];

	const enemyContainer = element("div").setClass("enemyData");
	container.append(enemyContainer);

	const enemyImage = element("img").setSrc(`./images/${enemy.img}`);
	const imageContainer = element("div").setClass("imageContainer");
	const imageBox = element("div").setClass("imageBox");
	imageContainer.append(imageBox);
	imageBox.append(enemyImage);

	const dropTree = element("div").setClass("dropTree");
	dropTree.append(...getEnemyDropTreeElements(enemy));

	const enemyStats = element("div").setClass("enemyStats");
	const statsText = customTextSyntax(
		`ID: ${enemy.id}\n` +
		`HP: ${enemy.maxHp}\n` +
		`MP: ${enemy.maxMp}`);
	enemyStats.append(statsText);

	const levelData = element("div").setClass("enemyLevelData");
	levelData.append(...wikiGenerateLevels(enemyInLevels[id]))

	enemyContainer.append(imageContainer, enemyStats, dropTree, levelData);
}

function wikiGenerateLevels(array) {
	return array.map(id => {
		const level = levels[id];
		const div = element("div").setClass("level");
		const numContainer = element("div").setClass("numContainer");
		const num = element("p").setText(random(1, 99));
		
		numContainer.appendChild(num);

		const enemyContainer = element("div").setClass("enemyContainer");
		const enemyImages = level.enemies.map(enemy => element("img").setSrc(`./images/${enemies[enemy].img}`));
		div.onclick = () => wikiGenerateLevel(id);

		enemyContainer.append(...enemyImages);
		div.append(numContainer, enemyContainer);
		return div;
	});
}

function wikiGenerateItemsScreen() {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";

	const itemsContainer = element("div").setClass("itemsContainer");
	container.append(itemsContainer);

	for(const itemID of Object.keys(enemyDrops)) {
		const item = items[itemID];
		const itemRow = element("div").setClass("itemRow");
		const itemImage = element("img").setSrc(`./images/${item.image}`);
		const itemName = element("p").setClass("name").setText(item.name);
		const itemTags = element("p").setClass("tags").setText("#" + item.tags.join("# "));
		const itemPercentage = element("p").setText(`${enemyDrops[itemID].length}/${allLevelKeys.length}`);
		const itemPercentageBar = element("div").setClass("itemPercentageBar");
		itemPercentageBar.style.width = `${(enemyDrops[itemID].length / allLevelKeys.length) * 100}%`;
		itemPercentageBar.style.backgroundColor = getPercentageColor(enemyDrops[itemID].length / allLevelKeys.length);
		itemRow.append(itemImage, itemName, itemPercentage, itemPercentageBar);
		itemsContainer.append(itemRow);

		itemRow.onclick = () => wikiGenerateItemInfo(itemID);
	}

}

function wikiGenerateItemInfo(id) {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";
	const item = items[id];

	const itemContainer = element("div").setClass("itemData");
	container.append(itemContainer);

	const itemImage = element("img").setSrc(`./images/${item.image}`);
	const imageContainer = element("div").setClass("imageContainer");
	const imageBox = element("div").setClass("imageBox");
	imageContainer.append(imageBox);
	imageBox.append(itemImage);

	const itemName = element("p").setClass("name").setText(item.name);
	const itemTags = element("p").setClass("tags").setText("#" + item.tags.join("# "));

	const enemiesWithItem = enemyDrops[id];
	const levelsWithItem = Object.keys(enemiesWithItem.reduce((acc, enemy) => {
		enemyInLevels[enemy]?.forEach(level => acc[level] = true);
		return acc;
	}, {}));

	const footer = element("div").setClass("footer");

	const levelsContainer = element("div").setClass("levelsContainer");
	levelsContainer.append(...wikiGenerateLevels(levelsWithItem));

	const listOfEnemysContainer = element("div").setClass("listOfEnemysContainer");
	for(const enemyID of enemiesWithItem) {
		const enemy = enemies[enemyID];
		const enemyRow = element("div").setClass("enemyRow");

		enemyRow.onclick = () => wikiGenerateEnemyInfo(enemyID);

		const enemyImage = element("img").setSrc(`./images/${enemy.img}`);
		const imageContainer = element("div").setClass("imageContainer");
		const imageBox = element("div").setClass("imageBox");
		imageContainer.append(imageBox);
		imageBox.append(enemyImage);

		const enemyName = element("p").setClass("name").setText(enemy.id);
		const enemyHp = element("p").setClass("hp").setText(`HP: ${enemy.maxHp}`);

		enemyRow.append(imageContainer, enemyName, enemyHp);
		listOfEnemysContainer.append(enemyRow);

		// console.log(enemies[enemy]);
	}

	footer.append(levelsContainer, listOfEnemysContainer);
	// enemyContainer.append(...wikiGenerateLevels(levelsWithItem));

	itemContainer.append(imageContainer, itemName, itemTags, footer);
}

function wikiGenerateEnemies() {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";

	const allEnemyContainer = element("div").setClass("allEnemyContainer");
	container.append(allEnemyContainer);

	for(const enemyID of Object.keys(enemyInLevels)) {
		const enemy = enemies[enemyID];
		const enemyRow = element("div").setClass("enemyRow");
		
		enemyRow.onclick = () => wikiGenerateEnemyInfo(enemyID);

		const enemyImage = element("img").setSrc(`./images/${enemy.img}`);
		const imageContainer = element("div").setClass("imageContainer");
		const imageBox = element("div").setClass("imageBox");
		imageContainer.append(imageBox);
		imageBox.append(enemyImage);

		const enemyName = element("p").setClass("name").setText(enemy.id);
		const enemyHp = element("p").setClass("hp").setText(`HP: ${enemy.maxHp}`);

		enemyRow.append(imageContainer, enemyName, enemyHp);
		allEnemyContainer.append(enemyRow);
	}
}

function getEnemyDropTreeElements(enemy) {
	const id = enemy?.id ?? enemy;

	return enemies[id]?.drops?.map(drop => {
		const slotsDiv = document.createElement("div");
		if(drop?.type == "all") typeAll(drop, slotsDiv);
		else if(drop?.type == "one") typeOne(drop, slotsDiv);
		else if(drop.amount?.length > 2) addAmountInsideOne(drop, slotsDiv, drop.chance);
		else addItem(drop, slotsDiv);
	
		function typeAll(arr, elem, per) {
			const [allElem] = emmet(".items");
			allElem.setAttribute("percentage", per ?? arr.chance ?? "");
			elem.append(allElem);
			addHover(allElem, `You will get these\nitems §<b>700<b><c>${getPercentageColor(per ?? arr.chance)}<c>${per ?? arr.chance}%§ of the time`);
			arr.items.forEach(drop => {
				if(drop?.type == "all") typeAll(drop, allElem);
				else if(drop?.type == "one") typeOne(drop, allElem, per ?? arr.chance);
				else if(drop.amount?.length > 2) addAmount(drop, allElem);
				else addItemInsideAll(drop, allElem);
			});
		}
	
		function typeOne(arr, elem, per) {
			const totalChance = arr.items.map(item => item.chance ?? 0).reduce((acc, v) => acc + v, 0);
			const [oneElem] = emmet(".row");
			oneElem.setAttribute("percentage", per ?? arr.chance ?? "");
			addHover(oneElem, `One of the following items \nwill drop §<c>${getPercentageColor(per ?? arr.chance)}<c><b>700<b>${per ?? arr.chance}% §of the time`);
			elem.append(oneElem);
			arr.items.forEach(drop => {
				if(drop?.type == "all") typeAll(drop, oneElem, Math.round(drop.chance / totalChance * 100));
				else if(drop?.type == "one") typeOne(drop, oneElem, Math.round(drop.chance / totalChance * 100));
				else if(drop.amount?.length > 2) addAmountInsideOne(drop, oneElem, Math.round(drop.chance / totalChance * 100));
				else addItem(drop, oneElem, Math.round(drop.chance / totalChance * 100));
			});
		}

		function addItem(arr, elem, per) {
			const nItem = new Item(arr.item);
			const [items] = emmet(".items>.slot>img+p");
			items.setAttribute("percentage", per ?? arr.chance ?? "");
			elem.append(items);
			items.querySelector("img").src = "./images/" + nItem.image;
			items.querySelector("p").textContent = arr.amount?.join?.("-") ?? arr.amount ?? "";
			addHover(items, `You will get this\nitem §<b>700<b><c>${getPercentageColor(per ?? arr.chance)}<c>${per ?? arr.chance}%§ of the time`);
			const hover = addHover(items.querySelector(".slot"), nItem.hoverText() ?? "");
			items.querySelector(".slot").onclick = () => hoverClick(hover, nItem.id);
		}

		function addItemInsideAll(arr, elem) {
			const nItem = new Item(arr.item);
			const [slot] = emmet(".slot>img+p");
			elem.append(slot);
			slot.querySelector("img").src = "./images/" + nItem.image;
			slot.querySelector("p").textContent = arr.amount?.join?.("-") ?? arr.amount ?? "";
			const hover = addHover(slot, nItem.hoverText() ?? "");
			slot.onclick = () => hoverClick(hover, nItem.id);
		}

		function addAmount(arr, elem) {
			const [amountElem] = emmet(".amount");
			const nItem = new Item(arr.item);
			elem.append(amountElem);
			const hover = addHover(amountElem, nItem.hoverText() ?? "");
			arr.amount.slice().sort((e, v) => e - v).forEach(amount => {
				const [slot] = emmet(".slot>img+p");
				slot.querySelector("img").src = "./images/" + nItem.image;
				slot.querySelector("p").textContent = amount;
				slot.onclick = () => hoverClick(hover, nItem.id);
				amountElem.append(slot);
			});
		}

		function addAmountInsideOne(arr, elem, per) {
			const [amountElem] = emmet(".items>.amount");
			const nItem = new Item(arr.item);
			amountElem.setAttribute("percentage", per ?? arr.chance ?? "");
			addHover(amountElem, `This item will drop §<c>${getPercentageColor(per ?? arr.chance)}<c><b>700<b>${per ?? arr.chance}% §of the time\nwith one of the following amounts`);
			const hover = addHover(amountElem.querySelector(".amount"), nItem.hoverText() ?? "");
			elem.append(amountElem);
			arr.amount.slice().sort((e, v) => e - v).forEach(amount => {
				const [slot] = emmet(".slot>img+p");
				slot.querySelector("img").src = "./images/" + nItem.image;
				slot.querySelector("p").textContent = amount
				slot.onclick = () => hoverClick(hover, nItem.id);
				amountElem.querySelector(".amount").append(slot);
			});
		} 

		function hoverClick(elem, id) {
			if(elem.closest?.("#hoverBox")) elem.remove();
			wikiGenerateItemInfo(id)
		}
		
		return slotsDiv.childNodes[0];
	}) ?? [];
}

function getPercentageColor(val = 0) {
	if(val <= 35) return "#ff6363";
	else if(val <= 50) return "#ffd363";
	else return "#63ff63";
}