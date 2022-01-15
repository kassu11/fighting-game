function Effect(effect) {
	this.id = effect.id;
	this.power = effect.power;
	this.title = `${effect.id} ${effect.power}`;
	this.duration = effect.duration;
	this.effectStatus = effect.effectStatus ?? "good";

	switch(effect.id) {
		case "Strength": {
			this.dmgPercentage = .25 * effect.power;
			this.img = "./images/wooden-dagger.png"
			break;
		}
		case "Weakness": {
			const valuesArr = [5, 10, 15, 30, 60];
			if(effect.power <= 0) this.reduceDmg = 3;
			else if(effect.power <= valuesArr.length) this.reduceDmg = valuesArr[effect.power - 1];
			else this.reduceDmg = Math.round((effect.power - 3) ** 2 * 10 / 5) * 5;
			this.img = "./images/heikkous.png";
			break;
		}
		case "Regeneration": {
			const regenArr = [3, 5, 10, 25, 50];
			if(effect.power <= 0) this.regenHP = 3;
			else if(effect.power <= regenArr.length) this.regenHP = regenArr[effect.power - 1];
			else this.regenHP = Math.round((effect.power - 3) ** 2 * 10 / 5) * 5;
			this.img = "./images/regen_icon.png";
			break;
		}
		case "Poison": {
			const poisonArr = [3, 5, 10, 15, 30];
			if(effect.power <= 0) this.poisonHP = 3;
			else if(effect.power <= poisonArr.length) this.poisonHP = poisonArr[effect.power - 1];
			else this.poisonHP = Math.round((effect.power - 3) ** 2 * 10 / 5) * 5;
			this.img = "./images/slime_ball.png";
			break;
		}
	}
}

function giveEffectsToPlAndEn(pl = player, en = currentLevel.enemies, lite = false) {
	pl.effects.forEach(effect => {
		if(effect.regenHP) pl.hp = Math.min(pl.maxHpF(), pl.hp + effect.regenHP);
		if(effect.poisonHP) pl.hp -= effect.poisonHP;
		if(lite) return;

		if(effect.regenHP) {
			const area = 50;
			const {width, left, top, height} = figtingScreen.querySelector(".playerBox .hpBox")?.getBoundingClientRect();
			const x = random(width / 2 - area, width / 2 + area);
			const y = random(top, top + height) - 50;
			AddBattleParciles({x, y, dmg: effect.regenHP}, "heal");
		}
		if(effect.poisonHP) {
			const area = 50;
			const {width, left, top, height} = figtingScreen.querySelector(".playerBox .hpBox")?.getBoundingClientRect();
			const x = random(width / 2 - area, width / 2 + area);
			const y = random(top, top + height) - 100;
			AddBattleParciles({x, y, dmg: effect.poisonHP}, "poison");
		}

	});

	en.forEach((enemy, card) => {
		enemy.effects.forEach(effect => {
			if(effect.regenHP) enemy.hp = Math.min(enemy.maxHp, enemy.hp + effect.regenHP);
			if(effect.poisonHP) enemy.hp -= effect.poisonHP 
			
			if(lite) return;

			if(effect.regenHP) {
				const padding = 10;
				const {width, left, top, height} = card.getBoundingClientRect();
				const x = random(left + padding, left + width - padding);
				const y = random(top + padding, top + height - padding);
				AddBattleParciles({x, y, dmg: effect.regenHP}, "heal");
			}
			if(effect.poisonHP) {
				const padding = 10;
				const {width, left, top, height} = card.getBoundingClientRect();
				const x = random(left + padding, left + width - padding);
				const y = random(top + padding, top + height - padding);
				AddBattleParciles({x, y, dmg: effect.poisonHP}, "poison");
				shakeEnemyCard(card)
			}

			updateEnemyCard(card);
		});
	});
	if(lite) return;
	updatePlayerBars();
}

function effect(name, power, duration) {
	const effectSlotNumber = this.effects?.findIndex(({id}) => id == name);
	const hasMorePower = this.effects[effectSlotNumber]?.power > power;
	const effectSlot = effectSlotNumber == -1 ? this.effects.length : effectSlotNumber;

	if(!hasMorePower) this.effects[effectSlot] = new Effect({id: name, power, duration});
}