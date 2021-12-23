window.addEventListener("keydown", e => {
	if(e.code === "Tab") {
		e.preventDefault();
		const buttons = levelButtons.querySelectorAll(".levelButton");
		centerLevelMap(buttons[random(buttons.length - 1)].id, true);
	} else if((e.code.startsWith("Digit") || e.code.startsWith("Numpad")) && document.body.classList.contains("figtingMode")) {
		const keyNumber = +e.code.replace("Digit", "").replace("Numpad", "");

		if(keyNumber > 0 && keyNumber < 6) player.currentSlot = "hotbarSlot" + keyNumber;
		updatePlayersHotbar();
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