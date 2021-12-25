const settingsElem = document.querySelector("#settingsBox");
let currentSave = {
	loadTime: performance.now(),
	index: -1
};
const allSaves = JSON.parse(localStorage.saves ?? "[]");

function openSettings() {
	document.body.classList.add("settings");
	const container = settingsElem.querySelector(".container");
	container.innerHTML = "";

	const resumeButton = element("div").setClass("button").setText("Resume");
	const saveGameButton = element("div").setClass("button").setText("Save Game");
	const saveToNew = element("div").setClass("button").setText("Save to slot");
	const loadGameButton = element("div").setClass("button").setText("Load Game");
	const backToStart = element("div").setClass("button").setText("Back to main menu");

	resumeButton.onclick = () => document.body.classList.remove("settings");
	saveGameButton.onclick = () => {
		saveGameButton.setText("Game saved")
		if(currentSave.index === -1) {
			const saveArray = saveGameArray("Save: " + (allSaves.length + 1));
			saveArray.totalTime = performance.now() - currentSave.loadTime;
			allSaves.unshift(saveArray);
		} else {
			const saveArray = saveGameArray(allSaves[currentSave.index].name);
			saveArray.totalTime = performance.now() - currentSave.loadTime + allSaves[currentSave.index].totalTime;
			allSaves.splice(currentSave.index, 1);
			allSaves.unshift(saveArray);
		}
		localStorage.setItem("saves", JSON.stringify(allSaves));
		currentSave.index = 0;
		currentSave.loadTime = performance.now();
	};
	saveToNew.onclick = () => openSettingsSaveSlots();
	loadGameButton.onclick = () => openSettingsLoadGame();

	container.append(resumeButton, saveGameButton, saveToNew, loadGameButton, backToStart);
}

function openSettingsSaveSlots() {
	const container = settingsElem.querySelector(".container");
	container.innerHTML = "";

	const inputContainer = element("div").setClass("inputContainer");
	const input = element("input");
	input.setAttribute("placeholder", "Save file name");
	input.setAttribute("autocomplete", "off");
	input.setAttribute("autocorrect", "off");
	input.setAttribute("autocapitalize", "off");
	input.setAttribute("spellcheck", "false");
	const backButton = element("div").setClass("button").setText("Back");
	const saveButton = element("div").setClass("button").setText("Save");
	saveButton.onclick = () => {
		const saveArray = saveGameArray(input.value || "Save: " + (allSaves.length + 1));
		if(currentSave.index === -1) {
			saveArray.totalTime = performance.now() - currentSave.loadTime;
		} else {
			saveArray.totalTime = performance.now() - currentSave.loadTime + allSaves[currentSave.index].totalTime;
		}

		currentSave.index = 0;
		allSaves.unshift(saveArray);
		localStorage.setItem("saves", JSON.stringify(allSaves));
		currentSave.loadTime = performance.now();

		openSettingsSaveSlots();
	};
	backButton.onclick = () => openSettings();

	const saveFileSpaceContainer = element("div").setClass("saveFileSpaceContainer");
	const saveFileBar = element("div").setClass("saveFileBar");
	const space = calcLocalStorageMaxSpace();
	const usedSpaceAmount = calcLocalStorageUsedSpace();
	saveFileBar.style.width = `${usedSpaceAmount / space * 100}%`;
	const usedSpace = element("p").setClass("saveFileSpaceUsed").setText("Used space: " + compactBytes(usedSpaceAmount));
	const maxSpace = element("p").setClass("saveFileSpaceMax").setText("Max space: " + compactBytes(space));
	saveFileSpaceContainer.append(saveFileBar, usedSpace, maxSpace);

	inputContainer.append(input, backButton, saveButton);

	const savesContainer = element("div").setClass("savesContainer");
	allSaves.forEach((save, i) => {
		const saveRow = saveGameRowElem(save, i);
		savesContainer.append(saveRow);
	});


	container.append(inputContainer, saveFileSpaceContainer, savesContainer);
}

function compactBytes(bytesKB) {
	if(bytesKB >= 1000) {
		return (bytesKB / 1000).toFixed(2) + " MB";
	} else {
		return bytesKB + " KB";
	}
}

function openSettingsLoadGame() {
	const container = settingsElem.querySelector(".container");
	container.innerHTML = "";

	const inputContainer = element("div").setClass("inputContainer");
	const backButton = element("div").setClass("button").setText("Back");
	backButton.onclick = () => openSettings();

	const saveFileSpaceContainer = element("div").setClass("saveFileSpaceContainer");
	const saveFileBar = element("div").setClass("saveFileBar");
	const space = calcLocalStorageMaxSpace();
	const usedSpaceAmount = calcLocalStorageUsedSpace();
	saveFileBar.style.width = `${usedSpaceAmount / space * 100}%`;
	const usedSpace = element("p").setClass("saveFileSpaceUsed").setText("Used space: " + compactBytes(usedSpaceAmount));
	const maxSpace = element("p").setClass("saveFileSpaceMax").setText("Max space: " + compactBytes(space));
	saveFileSpaceContainer.append(saveFileBar, usedSpace, maxSpace);

	inputContainer.append(backButton);

	const savesContainer = element("div").setClass("savesContainer");
	allSaves.forEach((save, i) => {
		const saveRow = loadGameRow(save, i);
		savesContainer.append(saveRow);
	});


	container.append(saveFileSpaceContainer, savesContainer, inputContainer);
}

function loadGameRow(array, index) {
	const row = saveElement(array, index, openSettingsLoadGame);
	row.onclick = (e) => {
		if(!e.target?.classList?.contains("saveFileRow")) return;
		document.body.classList.remove("settings")
		currentSave.index = index;
		currentSave.loadTime = performance.now();
		player = new Player(JSON.parse(allSaves[index].pl));
		if(document.body.classList.contains("itemsMenu")) {
			generateItemsOnGrid(player.inventory);
			if(itemsMenu.classList.contains("inv")) {
				updateItemsMenuHotbar();
				updateItemsArmor();
			} else {
				generateCraftingItemsList();
			}
		}
	}

	return row;
}

function saveGameRowElem(array, index) {
	const elem = saveElement(array, index, openSettingsSaveSlots);
	elem.onclick = async (e) => {
		if(!e.target?.classList.contains("saveFileRow")) return;
		try {
			await overwriteSavePopUp();
			const saveData = saveGameArray(allSaves[index].name);
			saveData.totalTime = performance.now() - currentSave.loadTime + allSaves[index].totalTime;
			allSaves.splice(index, 1);
			allSaves.unshift(saveData);
			localStorage.setItem("saves", JSON.stringify(allSaves));
			currentSave.index = 0;
			currentSave.loadTime = performance.now();
			openSettingsSaveSlots();
		} catch {}
	}

	return elem;
}

function overwriteSavePopUp() {
	const popUpContainer = element("div").setClass("popUpContainer");
	const popUp = element("div").setClass("popUp");
	const header = element("p").setClass("popUpHeader").setText("Overwrite save?");
	const body = element("p").setClass("popUpBody").setText("Do you want to overwrite this save?");
	const buttonRow = element("div").setClass("buttonRow");
	const yesButton = element("div").setClass("button yes").setText("Yes");
	const noButton = element("div").setClass("button no").setText("No");
	buttonRow.append(yesButton, noButton);

	popUp.append(header, body, buttonRow);
	popUpContainer.append(popUp);
	settingsElem.append(popUpContainer);

	return new Promise((resolve, reject) => {
		yesButton.onclick = () => {
			resolve();
			popUpContainer.remove();
		};
		noButton.onclick = () => {
			reject();
			popUpContainer.remove();
		};
	});
}

function saveElement(array, index, callback) {
	const div = element("div").setClass("saveFileRow");
	const firtsRow = element("div").setClass("nameAndSpace");
	const name = element("input").setClass("saveFileName")
	name.setAttribute("placeholder", "Save name");
	name.setAttribute("autocomplete", "off");
	name.setAttribute("autocorrect", "off");
	name.setAttribute("autocapitalize", "off");
	name.setAttribute("spellcheck", "false");
	name.setAttribute("readonly", "");
	name.value = array.name;
	const space = element("p").setClass("saveFileSpace").setText("Space: " + compactBytes( calcSavesUsedStorage(JSON.stringify(array)) ));
	firtsRow.append(name, space);

	const secondRow = element("div").setClass("secondRow");
	const date = element("p").setClass("saveFileLastPlayed").setText(formatSaveElementDate(array.lastPlayed));
	const itemsElem = element("p").setClass("saveFileItems").setText("Items collected: " + array.items + "/" + Object.keys(items).length);
	secondRow.append(date, itemsElem);
	
	const lastPlayed = element("p").setClass("totalTimePlayed").setText("Time played: " + convertTimeToString(array.totalTime));
	const thirdRow = element("div").setClass("thirdRow");
	const deleteButton = element("div").setClass("saveRowButton").setText("Delete");
	const renameButton = element("div").setClass("saveRowButton").setText("Rename");
	thirdRow.append(lastPlayed, deleteButton, renameButton);

	deleteButton.onclick = () => {
		if(currentSave.index === index) {currentSave.index = -1;}
		else if(currentSave.index > index) {currentSave.index--;}
		allSaves.splice(index, 1);
		if(allSaves.length === 0) currentSave.index = -1;
		localStorage.setItem("saves", JSON.stringify(allSaves));
		callback();
	}

	renameButton.onclick = () => renameSaveFile(index);

	div.append(firtsRow, secondRow, thirdRow);
	return div;
}

function renameSaveFile(index) {
	const row = settingsElem.querySelector(".savesContainer")?.children[index];
	const button = row.querySelector(".saveRowButton:last-child");
	const input = row.querySelector("input");

	
	input.removeAttribute("readonly");
	input.focus();
	// input.select();
	button.setText("Confirm");
	button.onclick = () => confirm();
	input.onkeydown = (e) => {
		if(e.code === "Enter") confirm()
	}

	function confirm() {
		input.setAttribute("readonly", "");
		button.setText("Rename");
		input.onkeydown = null;
		input.scrollLeft = 0;
		button.onclick = () => renameSaveFile(index);
		allSaves[index].name = input.value.substring(0, 200);
		input.value = input.value.substring(0, 200);
		localStorage.setItem("saves", JSON.stringify(allSaves));
	}
}

function formatSaveElementDate(date) {
	const time = new Date(date);
	const today = new Date();
	const diff = convertTimeToString(today.getTime() - time.getTime());
	
	if(!diff.includes("d")) {
		return "Last played: " + diff + " ago";
	} return `Last played: ${time.getDate()}.${time.getMonth()}.${time.getFullYear()} klo ${time.getHours()}.${time.getMinutes()}`;

}

function saveGameArray(name) {
	const save = {
		totalTime: 0,
		pl: stringifyPlayer(),
		name,
		lastPlayed: new Date().getTime(),
		items: `${Object.keys(player.totalItemCounts).length}`
	}
	return save;
}

function stringifyPlayer() {
	return JSON.stringify(player, (key, value) => {
		if(key === "armor" || key === "hotbar" || key == "totalItemCounts" || key == "effects") return undefined;
		if(key.endsWith("BoostValue") || key.endsWith("BoostPercentage")) return undefined;
		if(key === "inventory") return value.map(({id, slot, amount}) => {
			const arr = {id};
			if(amount) arr.amount = amount;
			if(slot) arr.slot = slot;
			return arr
		});
		return value;
	});
}

function convertTimeToString(time) {
	const seconds = Math.floor(time / 1000) % 60;
	const minutes = Math.floor(time / 1000 / 60) % 60;
	const hours = Math.floor(time / 1000 / 60 / 60);
	const days = Math.floor(time / 1000 / 60 / 60 / 24);

	if(days > 0) return `${days}d ${hours}h`;
	if(hours > 0) return `${hours}h ${minutes}m`;
	if(minutes > 0) return `${minutes}m ${seconds}s`;
	return `${seconds}s`;
}


function calcLocalStorageMaxSpace() {
	try {
		for(let tuhat = 1000; tuhat < 100005; tuhat += 1000) localStorage.tuhat = "a".repeat(1024 * tuhat);
	} catch {}
	try {
		for(let sata = 100; sata < 1005; sata += 100) localStorage.sata = "a".repeat(1024 * sata);
	} catch {}
	try {
		for(let kymmenen = 10; kymmenen < 105; kymmenen += 10) localStorage.kymppi = "a".repeat(1024 * kymmenen);
	} catch {}
	try {
		for(let single = 1; single < 15; single++) localStorage.single = "a".repeat(1024 * single);
	} catch {}
	try {
		for(let half = 20; half > 0; half--) localStorage.half = "a".repeat(Math.ceil(1024 / half));
	} catch {}
	try {
		for(let pieni = 1; pieni < 512; pieni++) localStorage.pieni = "a".repeat(pieni);
	} catch {}

	const endSpace = calcLocalStorageUsedSpace();
	localStorage.removeItem("tuhat");
	localStorage.removeItem("sata");
	localStorage.removeItem("kymppi");
	localStorage.removeItem("single");
	localStorage.removeItem("half");
	localStorage.removeItem("pieni");
	return Math.round(endSpace);
}

function calcLocalStorageUsedSpace() {
	let total = 0;
	for(const key in localStorage) {
		if(localStorage.hasOwnProperty(key)) {
			const length = (localStorage[key].length + key.length) * 2;
			total += length;
		}
	} return (total / 1024).toFixed(2);
}

function calcSavesUsedStorage(string) {
	return (string.length * 2 / 1024).toFixed(2);
}

if(allSaves.length !== 0) {
	openSettings();
	openSettingsLoadGame();

	const backButton = settingsElem.querySelector(".container .inputContainer .button")
	backButton.setText("Start new game");
	backButton.onclick = () => document.body.classList.remove("settings");

}
