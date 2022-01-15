function AddBattleParciles({x, y, dmg, bullet, x2, y2} = {}, type, target) {
	const box = document.querySelector("#figtingScreen .effectContainer");
	if(type == "explosion") {
		const div = document.createElement("div");
		div.classList = "explosion"
		div.style.left = x + "px";
		div.style.top = y + "px";
		removeElement(div, 1300);
		box.append(div);
	} else if(type == "explosion2") {
		const div = document.createElement("div");
		div.classList = "explosion2"
		div.style.left = x + "px";
		div.style.top = y + "px";
		removeElement(div, 2000);
		box.append(div);
	} else if(type == "meleDmg" || type == "enemyMeleDmg" || type == "poison" || type == "heal" || type == "mana") {
		if(dmg == null || dmg == NaN) return;
		const min = 100,
					max = 300;
		const p = document.createElement("p");
		box.append(p);
		const left = random(0, 1);
		const num = left ? random(-max, -min) : random(min, max);
		p.textContent = dmg;
		p.classList.add("meleDmgPopUp");
		p.style.animationName = "dmgDrop" + random(0, 2);
		p.style.left = x + "px";
		p.style.top = y - 60 + "px";
		if(type == "meleDmg") p.style.fontSize = random(45, 70) + "px";
		else if(type == "enemyMeleDmg" || type == "poison" || type == "heal" || type == "mana") p.style.fontSize = random(70, 100) + "px";
		if(type == "poison") p.classList.add("poison");
		if(type == "heal") p.classList.add("heal");
		if(type == "mana") p.classList.add("mana");
		setTimeout(v => {
			p.style.marginLeft = num + "px";
			p.style.transform = `translateX(-50%) rotate(${random(-20, 20)}deg)`;
		}, 20);
		removeElement(p, 2000);
	} else if(type == "stab") {
		const div = element("div").setClass("stab");
		div.style.left = x + "px";
		div.style.top = y + "px";
		removeElement(div, 2000);
		box.append(div);
	} else if(type == "boneExplosion") {
		for(let i = 0; i < 20; i++) {
			const min = 200,
						max = 500;
			const img = element("img").setClass("boneExplosion").setSrc("./images/bone.png");
			box.append(img);
			const left = random(0, 1);
			const num = left ? random(-max, -min) : random(min, max);
			img.style.animationName = "dmgDrop" + random(0, 2);
			img.style.left = x + "px";
			img.style.width = random(40, 70) + "px";
			img.style.top = y - 60 + "px";
			setTimeout(v => {
				img.style.marginLeft = num + "px";
				img.style.transform = `translateX(-50%) rotate(${num + (300 * num / Math.abs(num))}deg)`;
			}, 20);
			removeElement(img, 2000);
		}
	} else if(bullet && type == "bullet") {
		const [div] = emmet("div.bulletContainer>img");
		div.querySelector("img").src = "./images/" + bullet.image;
		div.style.left = x + "px";
		div.style.top = y + "px";
		div.style.setProperty("--rotate", `${random(0, 360)}deg`);
		div.style.setProperty("--rotateZ", `${bullet.bulletRotate}deg`);
		box.append(div);
		removeElement(div, 1000)
	} else if(bullet && type == "bullet2") {
		const [div] = emmet("div.bulletContainer2>img");
		div.querySelector("img").src = "./images/" + bullet.image;
		const rotation = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI + 135;
		
		div.style.setProperty("--x1", `${x}px`);
		div.style.setProperty("--y1", `${y}px`);
		div.style.setProperty("--x2", `${x2}px`);
		div.style.setProperty("--y2", `${y2}px`);
		div.style.setProperty("--rotate", `${rotation}deg`);
		div.style.setProperty("--rotateZ", `${bullet.bulletRotate}deg`);
		box.append(div);
		removeElement(div, 1000)
	}
}