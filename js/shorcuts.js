window.addEventListener("keydown", e => {
	if(e.code === "Tab") {
		e.preventDefault();
		const buttons = levelButtons.querySelectorAll(".levelButton");
		centerLevelMap(buttons[random(buttons.length - 1)].id, true);
	} else if((e.code.startsWith("Digit") || e.code.startsWith("Numpad"))) {
		const keyNumber = +e.code.replace("Digit", "").replace("Numpad", "");
		if(document.body.classList.contains("figtingMode")){
			if(keyNumber > 0 && keyNumber < 6) player.currentSlot = "hotbarSlot" + keyNumber;
			updatePlayersHotbar();
		} else if(document.body.classList.contains("settings") || document.activeElement === searchBar) return;
		else if(keyNumber == 1) document.querySelector("#levelsMenuButton").click();
		else if(keyNumber == 2) document.querySelector("#inventoryButton").click();
		else if(keyNumber == 3) document.querySelector("#craftingMenuButton").click();
		else if(keyNumber == 4) document.querySelector("#wikiMenuButton").click();

	} else if(e.code == "Escape" && !document.body.classList.contains("figtingMode")) {
		if(document.body.classList.contains("settings")) {
			if(settingsElem.querySelector(".popUpContainer")) settingsElem.querySelector(".popUpContainer div.button.no").click();
			else document.body.classList.remove("settings");
		}
		else openSettings();
	}
});

window.addEventListener("keyup", e => {
	if(e.code === "BracketLeft") debugger;
});