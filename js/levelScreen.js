
const levelMenu = document.querySelector("#levelMenu");

for(const [key, value] of Object.entries(levels)) {
	const div = document.createElement("div");
	const p = document.createElement("p");
	div.classList.add("levelButton")
	div.id = key;
	p.textContent = key;
	div.append(p);
	if(value.cords) {
		div.style.left = value.cords.x + "px";
		div.style.top =  value.cords.y + "px";
	} else div.style.left = random(window.innerWidth - 200) + "px";
	levelMenu.querySelector(".levelButtons .container").append(div);

	const info = document.createElement("div");
	info.addEventListener("click", e => {
		e.stopPropagation();
		levelMenu.querySelector(".levelInfoScreen").style.display = null;
		
		levelMenu.querySelector(".levelInfoScreen .enemyRowContainer").innerHTML = "";

		const enemyRow = value.enemies.map(id => {
			const [row] = emmet("div.enemyRow>.enemyCard>img^div.dropTree");
			row.querySelector(".enemyCard>img").src = "./images/" + enemies[id].img;
			row.querySelector(".dropTree").append(...getEnemyDropTreeElements(id));
			return row;
		});

		levelMenu.querySelector(".levelInfoScreen .enemyRowContainer").append(...enemyRow);
	});
	info.classList.add("info")

	div.append(info);

	div.addEventListener("click", e => {
		startLevel(key);
	});
}

function getEnemyDropTreeElements(enemy) {
	const id = enemy?.id ?? enemy;

	return enemies[id]?.drops?.map(drop => {
		const slotsDiv = document.createElement("div");
		if(drop?.type == "all") typeAll(drop, slotsDiv);
		else if(drop?.type == "one") typeOne(drop, slotsDiv);
		else if(drop.amount?.length > 2) addAmount(drop, slotsDiv);
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
			const combinedChances = arr.items.map(item => item.chance ?? 0).reduce((acc, v) => [...acc, (acc[acc.length - 1] || 0) + v], []);
			const totalChance = Math.max(...combinedChances);
			const [oneElem] = emmet(".row");
			oneElem.setAttribute("percentage", per ?? arr.chance ?? "");
			addHover(oneElem, `One of the following items \nwill drop §<c>${getPercentageColor(per ?? arr.chance)}<c><b>700<b>${per ?? arr.chance}% §of the time`);
			elem.append(oneElem);
			arr.items.forEach(drop => {
				if(drop?.type == "all") typeAll(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
				else if(drop?.type == "one") typeOne(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
				else if(drop.amount?.length > 2) addAmountInsideOne(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
				else addItem(drop, oneElem, Math.floor(drop.chance / totalChance * 100));
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
			addHover(items.querySelector(".slot"), nItem.hoverText() ?? "");
		}

		function addItemInsideAll(arr, elem) {
			const nItem = new Item(arr.item);
			const [slot] = emmet(".slot>img+p");
			elem.append(slot);
			slot.querySelector("img").src = "./images/" + nItem.image;
			slot.querySelector("p").textContent = arr.amount?.join?.("-") ?? arr.amount ?? "";
			addHover(slot, nItem.hoverText() ?? "");
		}

		function addAmount(arr, elem) {
			const [amountElem] = emmet(".amount");
			const nItem = new Item(arr.item);
			elem.append(amountElem);
			addHover(amountElem, nItem.hoverText() ?? "");
			arr.amount.slice().sort((e, v) => e - v).forEach(amount => {
				const [slot] = emmet(".slot>img+p");
				slot.querySelector("img").src = "./images/" + nItem.image;
				slot.querySelector("p").textContent = amount
				amountElem.append(slot);
			});
		}

		function addAmountInsideOne(arr, elem, per) {
			const [amountElem] = emmet(".items>.amount");
			const nItem = new Item(arr.item);
			amountElem.setAttribute("percentage", per ?? arr.chance ?? "");
			addHover(amountElem, nItem.hoverText() ?? "");
			elem.append(amountElem);
			arr.amount.slice().sort((e, v) => e - v).forEach(amount => {
				const [slot] = emmet(".slot>img+p");
				slot.querySelector("img").src = "./images/" + nItem.image;
				slot.querySelector("p").textContent = amount
				amountElem.querySelector(".amount").append(slot);
			})
		} return slotsDiv.childNodes[0];
	}) ?? [];
}

function getPercentageColor(val = 0) {
	return ["#ff6363", "#fcff63", "#73ff63"][[35, 50, 100].findIndex(e => e >= val)];
}

levelMenu.querySelector(".levelInfoScreen .close").addEventListener("click", () => {
	levelMenu.querySelector(".levelInfoScreen").style.display = "none";
});

const levelButtons = levelMenu.querySelector(".levelButtons")
levelButtons.addEventListener("mousedown", levelButtonsMouseDown);
const levelMenuDownData = {x: 0, y: 0, startX: 0, startY: 0};
function levelButtonsMouseDown(downEvent) {
	const canselClickMovedPixels = 15;
	const container = levelButtons.querySelector(".container");
	
	levelMenuDownData.startX = downEvent.x - +container.style.left.substr(0, container.style.left.length - 2);
	levelMenuDownData.startY = downEvent.y - +container.style.top.substr(0, container.style.top.length - 2);

	/* Delete later */
	const buttonElem = downEvent.target?.classList.contains("levelButton") ? downEvent.target : downEvent.target.parentElement;
	levelMenuDownData.x = downEvent.x;
	levelMenuDownData.y = downEvent.y;

	const bLeft = +buttonElem.style.left.substr(0, buttonElem.style.left.length - 2);
	const bTop = +buttonElem.style.top.substr(0, buttonElem.style.top.length - 2);

	/* Delete later */
	
	
	if(downEvent.button === 0) {
		
		levelButtons.onmousemove = moveEvent => {
			levelMenuDownData.x = moveEvent.x;
			levelMenuDownData.y = moveEvent.y;
			if(moveEvent.buttons === 1) {
				if(buttonElem?.classList.contains("levelButton")) {
					const scale = +container.style.getPropertyValue("--scale") || 1;
					buttonElem.style.left = (moveEvent.x - downEvent.x) / scale + bLeft + "px";
					buttonElem.style.top = (moveEvent.y - downEvent.y) / scale + bTop + "px";
					container.style.pointerEvents = "none";

					levels[buttonElem.id].cords.x = Math.round((moveEvent.x - downEvent.x) / scale + bLeft);
					levels[buttonElem.id].cords.y = Math.round((moveEvent.y - downEvent.y) / scale + bTop);

					return;
				}

				if(!container.style.pointerEvent) {
					if(Math.abs(downEvent.x - moveEvent.x) + Math.abs(downEvent.y - moveEvent.y) > canselClickMovedPixels) {
						container.style.pointerEvents = "none";
					}
				}
				container.style.left = moveEvent.x - levelMenuDownData.startX + "px";
				container.style.top = moveEvent.y - levelMenuDownData.startY + "px";
			} else {
				levelButtons.onmousemove = null;
				container.style.pointerEvents = null;
			}
		}
	}
};

levelButtons.addEventListener("wheel", e => {
	const container = levelButtons.querySelector(".container");
	let startX = +container.style.left.substr(0, container.style.left.length - 2);
	let startY = +container.style.top.substr(0, container.style.top.length - 2);
	const scale = +container.style.getPropertyValue("--scale") || 1;

	const {x, y} = e.buttons === 1 ? levelMenuDownData : e; // Fix little offsync if moving while scrollin (intensely)
	const {width, height} = container.getBoundingClientRect();
	
	if(e.deltaY < 0) {
		container.style.setProperty("--scale", Math.min(scale / .75, 500).toFixed(4));
	} else if(e.deltaY > 0){
		container.style.setProperty("--scale", Math.max(scale * .75, .01).toFixed(4));
	}
	
	const {width: w2, height: h2} = container.getBoundingClientRect();

	const trueX = width - startX + x - width;
	const trueY = height - startY + y - height;

	const perX = trueX / width;
	const perY = trueY / height;

	const trueScaledX = w2 * perX;
	const trueScaledY = h2 * perY;
	
	container.style.left = x - trueScaledX + "px";
	container.style.top = y - trueScaledY + "px";

	levelMenuDownData.startX = trueScaledX;
	levelMenuDownData.startY = trueScaledY;
});


function centerLevelMap(x, y) {
	const sadasd = 5;
}


{
	const button = document.querySelector(".levelButton");
	const container = levelMenu.querySelector(".levelButtons .container")
	console.log(button.getBoundingClientRect())
	console.log(container.getBoundingClientRect())

}