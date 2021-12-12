for(let i = 0; i < 10; i++) {
	const div = element("div").setClass("save");
	const name = element("p").setClass("name").setText(`Save ${i}`);
	const date = element("p").setClass("date").setText(`${random(1, 30)}.${random(1, 12)}.${random(2020, 2022)}`);	
	const remove = element("div").setClass("remove");
	const saveToFile = element("div").setClass("saveToFile");

	div.append(name, date, remove, saveToFile);
	document.querySelector("#mainMenu .savesFileContainer").append(div);
}

document.querySelector(".newGameButton").addEventListener("click", startNewGame);

function startNewGame() {
	document.body.classList = "levelMenu";
}