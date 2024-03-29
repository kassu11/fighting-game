function random(num1, num2 = 0) {
	return Math.round(Math.random() * (num2 - num1) + num1);
}

function removeElement(elem, time) {
	setTimeout(v => {
		elem.remove();
	}, time);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function emmet(syn) {
	let index = 0;
	let current;
	const length = syn.length;
	const base = [];

	while(index < length) {
		const subText = syn.substr(index);
		const endIndex = [".", "#", ">", "^", "*", "+"].reduce((acc, v) => acc.split(v)[0], subText.substr(1)).length;

		if(subText.startsWith(".")) {
			const className = subText.substr(1, endIndex);
			if(className.length == 0) return console.error("No classname")
			if(!current) {current = [document.createElement("div")]; base.push(...current)};
			current.forEach((c, i) => c.classList.add(className));
			index += endIndex + 1;
		} else if(subText.startsWith("#")) {
			const idName = subText.substr(1, endIndex);
			if(idName.length == 0) return console.error("No id")
			if(!current) {current = [document.createElement("div")]; base.push(...current)};
			current.forEach(c => c.id = idName);
			index += endIndex + 1;
		} else if(subText.startsWith(">")) {
			const elemName = subText.substr(1, endIndex);
			if(!current) return console.error(`Can't start with ">"`);
			const nElem = current.map(e => document.createElement(elemName || "div"));
			current.forEach((c, i) => c.append(nElem[i]));
			current = nElem;
			index += endIndex + 1;
		} else if(subText.startsWith("^")) {
			if(!current?.[0]?.parentNode?.parentNode) current = null;
			else current = current.map(e => e.parentNode.parentNode);
			index++;
		} else if(subText.startsWith("*")) {
			const num = +subText.substr(1, endIndex);
			console.log(current, num);
			if(!Number.isInteger(num)) return console.error(`"${subText.substr(1, endIndex)}" is not a number`);
			else if(num < 1) return console.error(`"${subText.substr(1, endIndex)}" is below 1`);
			const nElem = [...Array(current.length)].map(e => [...Array(num - 1)].map(e => current[0].cloneNode(true)));
			if(!current?.[0]?.parentNode) base.push(...nElem[0]);
			else current.forEach((c, i) => {c.parentNode.append(...nElem[i]); console.log(nElem)});
			current = [...current, ...nElem.reduce((acc, v) => [...acc, ...v], [])];
			index += endIndex + 1;
		} else if(subText.startsWith("+")) {
			const elemName = subText.substr(1, endIndex);
			const nElem = current?.map(e => document.createElement(elemName || "div")) ?? [document.createElement(elemName || "div")];
			if(!current?.[0]?.parentNode) {current = nElem; base.push(...current)}
			else current.forEach((c, i) => c.parentNode.append(nElem[i]));
			current = nElem;
			index += endIndex + 1;
		} else {
			const elemName = subText.substr(0, endIndex + 1);
			const nElem = current?.map(e => document.createElement(elemName || "div")) ?? [document.createElement(elemName || "div")];
			if(!current) {current = nElem; base.push(...current)}
			else current.forEach((c, i) => c.append(nElem[i]));
			current = nElem;
			index += endIndex + 1;
		}
	} return base;
}

function print() {
	let text = "{";

	// Object.entries(levels).forEach(([key, v], i) => {
	// 	text += `${i === 0 ? "" : ","}
	// "${key}": {
	// 	num: ${v.num},
	// 	name: "${v.name ?? ""}",
	// 	enemies: ["${v.enemies.join(`", "`)}"],
	// 	cords: {y: ${v.cords?.y ?? 0}, x: ${v.cords?.x ?? 0}}
	// }`
	// });

	console.log(JSON.stringify(levels, (key, value) => {
		if(key == "enemies" || key == "cords") {
			return "§'" + JSON.stringify(value).replaceAll('"', "'").replaceAll(",", ", ").replaceAll(":", ": ") + "'§";
		}
		if(value["item"]) {
			const copyValue = {...value};
			copyValue["item"] = `§'items['${copyValue["item"].id}']'§`;
			return "§'" + JSON.stringify(copyValue).replaceAll('"', "'").replaceAll(",", ", ").replaceAll(":", ": ") + "'§";
		}
		return value;
	}, "\t").replaceAll(`'`, `"`).replaceAll(`"§"`, ""))


	// console.log(text + "\n}");
}

const element = value => document.createElement(value);
HTMLElement.prototype.setID = function(value) {
	this.id = value;
	return this;
}
HTMLElement.prototype.setClass = function(value) {
	this.classList = value;
	return this;
}

HTMLElement.prototype.setSrc = function(value) {
	this.src = value;
	return this;
}
HTMLElement.prototype.setText = function(value) {
	this.textContent = value;
	return this;
}