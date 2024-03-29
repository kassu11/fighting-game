const allLevelKeys = Object.keys(levels).sort((a, b) => levels[a].num - levels[b].num);
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
const levelDrops = Object.entries(levels).reduce((acc, [id, level]) => {
	if(!level.drops) return acc;
	for(const drop of level.drops) recursive(drop);
	return acc;

	function recursive(drop) {
		if(drop.items) drop.items.forEach(d => recursive(d));
		else if(drop.item) {
			acc[drop.item.id] ??= [];
			if(!acc[drop.item.id].find(e => e === id)) acc[drop.item.id].push(id);
		}
	}
}, {});

function drawWikiMainPage() {
	const box = document.querySelector("#wiki .selectionContainer .box");
	const enemyCard = box.querySelector("#enemyInfo")
	const levelCard = box.querySelector("#levelInfo")
	const itemCard = box.querySelector("#itemInfo")
	for(let i = 0; i < 10; i++) {
		const className = i % 2 ? "left" : "right";
		const p = element("p").setText(`ENEMIES `.repeat(5)).setClass(className);
		enemyCard.append(p);
	}
	for(let i = 0; i < 10; i++) {
		const className = i % 2 ? "left" : "right";
		const p = element("p").setText(`LEVELS `.repeat(5)).setClass(className);
		levelCard.append(p);
	}
	for(let i = 0; i < 10; i++) {
		const className = i % 2 ? "left" : "right";
		const p = element("p").setText(`DROPS `.repeat(5)).setClass(className);
		itemCard.append(p);
	}
}

drawWikiMainPage();

function wikiGenerateLevelsScreen() {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";

	const levelHeader = element("h1").setText("Info about levels"); 
	const levelContainer = element("div").setClass("levelContainer");
	
	levelContainer.append(levelHeader);
	container.append(levelContainer);
	
	levelContainer.append( ...wikiGenerateLevels(allLevelKeys) );
}

function wikiGenerateLevel(levelId) {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";
	const level = levels[levelId];

	const levelContainer = element("div").setClass("levelData");
	container.append(levelContainer);

	const title = element("h1").setClass("levelName").setText(level.name);
	levelContainer.append(title);
	if(level.drops) {
		const levelRow = element("div").setClass("levelRow");
		const header = element("p").setText("Level rewards").setClass("miniTitle");
		const levelDropTree = element("div").setClass("dropTree");
		levelDropTree.append(...createDropTreeElements(level.drops));
		levelRow.append(header, levelDropTree);
		levelContainer.append(levelRow);
	}

	const enemyContainer = element("div").setClass("enemyContainer");
	const enemyContainerTitle = element("p").setText("Enemies").setClass("miniTitle enemyTitle");
	levelContainer.append(enemyContainerTitle, enemyContainer);
	for(const enemyId of level.enemies) {
		const row = element("div").setClass("enemyRow");
		const rowContainer = element("div").setClass("container");
		row.append(rowContainer);

		const enemyImage = element("img").setSrc(`./images/${enemies[enemyId].img}`);
		const imageContainer = element("div").setClass("imageContainer");
		const imageBox = element("div").setClass("imageBox");
		imageContainer.append(imageBox);
		imageBox.append(enemyImage);

		imageContainer.onclick = () => wikiGenerateEnemyInfo(enemyId);

		const dropTree = element("div").setClass("dropTree");
		dropTree.append(...createDropTreeElements(enemies[enemyId].drops))

		const enemyStats = element("div").setClass("enemyStats");
		const statsText = customTextSyntax(
			`§<b>700<b><c>#ff9b9b<c>${enemies[enemyId].name}\n` +
			`§<b>700<b><c>#5cff4d<c>${enemies[enemyId].maxHp}HP\n` +
			`§<b>700<b><c>#36a2ff<c>${enemies[enemyId].maxMp}MP`);
		enemyStats.append(statsText, dropTree);

		rowContainer.append(imageContainer, enemyStats);
		enemyContainer.append(row);
	}

	const locateLevelButton = element("div").setClass("locateLevelButton");
	const locateLevelText = element("p").setText("Locate level").setClass("miniTitle");
	locateLevelButton.onclick = () => {
		document.body.classList = "levelMenu";
		centerLevelMap(levelId, false, true);
	}
	locateLevelButton.append(locateLevelText);
	levelContainer.append(locateLevelButton);
}

function wikiGenerateEnemyInfo(id) {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";
	const enemy = enemies[id];

	const enemyContainer = element("div").setClass("enemyData");
	container.append(enemyContainer);

	const title = element("h1").setClass("enemyName").setText(enemy.name);
	enemyContainer.append(title);

	const firstRow = element("div").setClass("enemyRow");
	const enemyInfoContainer = element("div").setClass("enemyInfoContainer");
	
	const enemyImage = element("img").setSrc(`./images/${enemy.img}`);
	const imageContainer = element("div").setClass("imageContainer");
	const imageBox = element("div").setClass("imageBox");
	imageContainer.append(imageBox);
	imageBox.append(enemyImage);

	
	const dropTree = element("div").setClass("dropTree");
	dropTree.append(...createDropTreeElements(enemy.drops));

	const dropTreeContainer = element("div").setClass("dropTreeContainer");
	
	const dropTitle = element("p").setText("Loot table").setClass("miniTitle");
	dropTreeContainer.append(dropTitle, dropTree);
	
	const enemyStats = element("div").setClass("enemyStats");
	const levelCountNum = enemyInLevels[id]?.length ?? 0;
	const statsText = customTextSyntax(
		`§<b>700<b><c>#ff9b9b<c>${enemy.name}\n` +
		`§<b>700<b><c>#5cff4d<c>${enemy.maxHp}HP\n` +
		`§<b>700<b><c>#36a2ff<c>${enemy.maxMp}MP\n` +
		`§<b>700<b><c>#ffe950<c>Found in ${levelCountNum} level${levelCountNum === 1 ? "" : "s"}`);
		enemyStats.append(statsText);

	enemyInfoContainer.append(imageContainer, enemyStats);
		
	const levelData = element("div").setClass("enemyLevelData");
	const levelTitle = element("p").setText("Found in level(s)").setClass("miniTitle");
	levelData.append(levelTitle, ...wikiGenerateLevels(enemyInLevels[id]))

	
	firstRow.append(enemyInfoContainer, dropTreeContainer);
	enemyContainer.append(firstRow, levelData);
}

function wikiGenerateLevels(array) {
	return array.map(id => {
		const level = levels[id];
		const div = element("div").setClass("level");
		const numContainer = element("div").setClass("numContainer");
		const num = element("p").setText(level.num.toString().padStart(2, "0"));
		const play = element("div").setClass("play");

		play.onclick = () => {
			document.body.classList = "levelMenu";
			centerLevelMap(id, false, true);
		}
		
		numContainer.appendChild(num);

		const enemyContainer = element("div").setClass("enemyContainer");
		const enemyImages = level.enemies.map(enemy => {
			const cardContainer = element("div").setClass("cardContainer");
			const img = element("img").setSrc(`./images/${enemies[enemy].img}`);
			cardContainer.append(img)
			return cardContainer;
		});
		div.onclick = e => {
			if(e.target.classList.contains("play")) return;
			wikiGenerateLevel(id)
		};

		enemyContainer.append(...enemyImages);
		div.append(numContainer, play, enemyContainer);
		return div;
	});
}

function wikiGenerateItemsScreen() {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";

	const itemsContainer = element("div").setClass("itemsContainer");
	const itemsHeader = element("h1").setText("All items from drops");
	itemsContainer.append(itemsHeader);
	container.append(itemsContainer);

	for(const itemID of new Set([...Object.keys(enemyDrops), ...Object.keys(levelDrops)])) {
		const item = new Item(items[itemID], player);
		const itemBox = element("div").setClass("itemBox");
		const itemImage = element("img").setSrc(`./images/${item.image}`);
		itemBox.append(itemImage);
		itemsContainer.append(itemBox);
		const hover = addHover(itemBox, item.hoverText());

		itemBox.onclick = () => {
			wikiGenerateItemInfo(itemID);
			if(hoverBox.querySelector("div") === hover) hover.remove();
		};
	}

}

function wikiGenerateItemInfo(id) {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";
	const item = items[id];

	const itemContainer = element("div").setClass("itemData");
	container.append(itemContainer);

	const itemImage = element("img").setSrc(`./images/${item.image}`);
	const imageBox = element("div").setClass("imageBox");
	imageBox.append(itemImage);

	addHover(imageBox, new Item(item, player).hoverText())

	const itemName = element("h1").setClass("itemName").setText(item.name);

	const enemiesWithItem = enemyDrops[id] || [];
	const levelsWithItem = Object.keys(enemiesWithItem.reduce((acc, enemy) => {
		enemyInLevels[enemy]?.forEach(level => acc[level] = true);
		return acc;
	}, {}));
	if(levelDrops[id]) levelsWithItem.push(...levelDrops[id]);

	const footer = element("div").setClass("footer");

	const levelsContainer = element("div").setClass("levelsContainer");
	levelsContainer.append(...wikiGenerateLevels([...new Set(levelsWithItem)].sort((a, b) => {
		return levels[a].num - levels[b].num;
	})));

	const listOfEnemysContainer = element("div").setClass("listOfEnemysContainer");

	for(const enemyID of enemiesWithItem) {
		const row = element("div").setClass("enemyRow");
		const rowContainer = element("div").setClass("container");
		row.append(rowContainer);

		const enemyImage = element("img").setSrc(`./images/${enemies[enemyID].img}`);
		const imageContainer = element("div").setClass("imageContainer");
		const imageBox = element("div").setClass("imageBox");
		imageContainer.append(imageBox);
		imageBox.append(enemyImage);

		imageContainer.onclick = () => wikiGenerateEnemyInfo(enemyID);

		const dropTree = element("div").setClass("dropTree");
		dropTree.append(...createDropTreeElements(enemies[enemyID].drops))

		const enemyStats = element("div").setClass("enemyStats");
		const statsText = customTextSyntax(
			`§<b>700<b><c>#ff9b9b<c>${enemies[enemyID].name}\n` +
			`§<b>700<b><c>#5cff4d<c>${enemies[enemyID].maxHp}HP\n` +
			`§<b>700<b><c>#36a2ff<c>${enemies[enemyID].maxMp}MP`);
		enemyStats.append(statsText, dropTree);

		rowContainer.append(imageContainer, enemyStats);
		listOfEnemysContainer.append(row);
	}

	const levelsTitle = element("p").setText("Get from level(s)").setClass("miniTitle");
	const enemiesTitle = element("p").setText("Get from enemies").setClass("miniTitle");

	levelsContainer.prepend(levelsTitle);
	listOfEnemysContainer.prepend(enemiesTitle);

	footer.append(levelsContainer, listOfEnemysContainer);

	if(enemiesWithItem.length === 0) listOfEnemysContainer.remove();

	itemContainer.append(itemName, imageBox, footer);
}

function wikiGenerateEnemies() {
	const container = document.querySelector("#wiki .wikiContent");
	container.innerHTML = "";

	const allEnemyContainer = element("div").setClass("allEnemyContainer");
	const allEnemyHeader = element("h1").setText("All enemies");
	allEnemyContainer.append(allEnemyHeader);
	container.append(allEnemyContainer);

	for(const enemyId of Object.keys(enemyInLevels)) {
		const row = element("div").setClass("enemyRow");
		const rowContainer = element("div").setClass("container");
		row.append(rowContainer);

		const enemyImage = element("img").setSrc(`./images/${enemies[enemyId].img}`);
		const imageContainer = element("div").setClass("imageContainer");
		const imageBox = element("div").setClass("imageBox");
		imageContainer.append(imageBox);
		imageBox.append(enemyImage);

		imageContainer.onclick = () => wikiGenerateEnemyInfo(enemyId);

		const dropTree = element("div").setClass("dropTree");
		dropTree.append(...createDropTreeElements(enemies[enemyId].drops))

		const enemyStats = element("div").setClass("enemyStats");
		const statsText = customTextSyntax(
			`§<b>700<b><c>#ff9b9b<c>${enemies[enemyId].name}\n` +
			`§<b>700<b><c>#5cff4d<c>${enemies[enemyId].maxHp}HP\n` +
			`§<b>700<b><c>#36a2ff<c>${enemies[enemyId].maxMp}MP`);
		enemyStats.append(statsText, dropTree);

		rowContainer.append(imageContainer, enemyStats);
		allEnemyContainer.append(row);
	}
}

function createDropTreeElements(drops) {
	return drops?.map(drop => {
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