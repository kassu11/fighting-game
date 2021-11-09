
function generateArmor(num) {
	return [...new Array(num)].map((_, i) => {
		const time = Math.round(new Date().getTime() / random(10000));
		const [[img, eq, tag]] = [ 
			["baselegs3.png", "legs", "leggings"],  
			["basechest3.png", "chest", "chestplate"], 
			["helmet.png", "head", "helmet"]
		]
		return {
			id: `armor${(time + i).toString(32)}`,
			name: `Armor ${(time + i).toString(32)}`,
			image: img,
			canEquipTo: eq,
			tags: ["armor", tag]
		}
	}).map(item => {
		
		const vahvuus = random(3) ? "weak" : random(2) ? "normal" : "boss";
		const healthBoostValue = random(1) === 0;
		const defenceValue = random(1) === 0;
		const defencePercentage = random(1) === 0;
		const manaBoostValue = random(1) === 0;
		const kaikkiArvor = healthBoostValue || defenceValue || defencePercentage;

		if(healthBoostValue || (!kaikkiArvor && vahvuus == "weak")) {
			if(vahvuus == "weak") 	item.healthBoostValue = random(10, 25);
			if(vahvuus == "normal") item.healthBoostValue = random(25, 45);
			if(vahvuus == "boss") 	item.healthBoostValue = random(55, 120);
		} if(defenceValue || (!kaikkiArvor && vahvuus == "normal")) {
			if(vahvuus == "weak") 	item.defenceValue = random(2, 5);
			if(vahvuus == "normal") item.defenceValue = random(6, 10);
			if(vahvuus == "boss") 	item.defenceValue = random(20, 35);
		} if(defencePercentage || (!kaikkiArvor && vahvuus == "boss")) {
			if(vahvuus == "weak") 	item.defencePercentage = random(5, 10);
			if(vahvuus == "normal") item.defencePercentage = random(11, 15);
			if(vahvuus == "boss") 	item.defencePercentage = random(16, 25);
		} if(manaBoostValue) {
			if(vahvuus == "weak") 	item.manaBoostValue = random(10, 20);
			if(vahvuus == "normal") item.manaBoostValue = random(21, 30);
			if(vahvuus == "boss") 	item.manaBoostValue = random(50, 85);
		}
		
		return item;
	})
}

function generateMaterials(num) {
	return [...new Array(num)].map((_, i) => {
		const time = Math.round(new Date().getTime() / random(10000));
		return {
			id: `material${(time + i).toString(32)}`,
			name: `Material ${(time + i).toString(32)}`,
			image: "iron.png",
			amount: 2,
			tags: ["material"]
		}
	});
}

const effects = ["Strength", "Weakness", "Regeneration", "Poison"];

function generateWeapon(num) {
	return [...new Array(num)].map((_, i) => {
		const time = Math.round(new Date().getTime() / random(10000));
		return {
			id: `weapon${(time + i).toString(32)}`,
			name: `Weapon ${(time + i).toString(32)}`,
			image: "miekka1.png",
			tags: ["weapon"]
		}
	}).map(item => {
		item.useTime = (random(10, 100) / 10 - .5).toFixed(1);

		const vahvuus = random(3) ? "weak" : random(2) ? "normal" : "boss";
		const tyyppi = random(1) ? "mele" : "range";
		const secondDmg = random(2) === 0;
		const manaWeapon = random(2) === 0;

		if(tyyppi == "mele") {
			if(vahvuus == "weak") 	item.minMeleDmg = random(3, 25);
			if(vahvuus == "normal") item.minMeleDmg = random(25, 50);
			if(vahvuus == "boss") 	item.minMeleDmg = random(50, 150);

			if(secondDmg) {
				if(vahvuus == "weak") 	item.maxMeleDmg = item.minMeleDmg + random(3, 10);
				if(vahvuus == "normal") item.maxMeleDmg = item.minMeleDmg + random(10, 30);
				if(vahvuus == "boss") 	item.maxMeleDmg = item.minMeleDmg + random(25, 75);
			}
		} else if(tyyppi == "range") {
			if(vahvuus == "weak") 	item.minRangeDmg = random(2, 15);
			if(vahvuus == "normal") item.minRangeDmg = random(15, 35);
			if(vahvuus == "boss") 	item.minRangeDmg = random(50, 100);

			if(secondDmg) {
				if(vahvuus == "weak") 	item.maxRangeDmg = item.minRangeDmg + random(3, 10);
				if(vahvuus == "normal") item.maxRangeDmg = item.minRangeDmg + random(11, 30);
				if(vahvuus == "boss") 	item.maxRangeDmg = item.minRangeDmg + random(31, 50);
			}

			item.animationDelay = 200;
			item.useAmmoType = ammo[random(ammo.length - 1)].ammoType;
			item.image = "bow.png";
		}

		if(manaWeapon) {
			if(vahvuus == "weak") 	item.mana = Math.round(random(5, 25) / 5) * 5
			if(vahvuus == "normal") item.mana = Math.round(random(20, 45) / 5) * 5
			if(vahvuus == "boss") 	item.mana = Math.round(random(50, 100) / 5) * 5
		}	

		const selfEffect = random(5) === 0;
		const goodSelfEffects = ["Strength", "Regeneration"];
		const giveEffect = random(5) === 0;
		const goodGiveEffects = ["Weakness", "Poison"];

		if(selfEffect) {
			item.selfEffect = [];
			do {
				const effect = effects[random(effects.length - 1)];
				item.selfEffect.push({
					id: effect, 
					power: vahvuus === "boss" ? random(5, 8) : random(1, 4), 
					duration: vahvuus === "boss" ? random(15, 30) : random(1, 12), 
					effectStatus: goodSelfEffects.find(e => e === effect) ? "good" : "bad"
				});
			} while(random(1))
		} if(giveEffect) {
			item.giveEffect = [];
			do {
				const effect = effects[random(effects.length - 1)];
				item.giveEffect.push({
					id: effect, 
					power: vahvuus === "boss" ? random(5, 8) : random(1, 4), 
					duration: vahvuus === "boss" ? random(15, 30) : random(1, 12), 
					effectStatus: goodGiveEffects.find(e => e === effect) ? "good" : "bad"
				});
			} while(random(1))
		}
		
		return item;
	})
}

function generateAmmo(num) {
	return [...new Array(num)].map((_, i) => {
		const time = Math.round(new Date().getTime() / random(10000));
		return {
			id: `arrow${(time + i).toString(32)}`,
			name: `Arrow ${(time + i).toString(32)}`,
			image: "arrow.png",
			isNotUsable: true,
			amount: 2,
			tags: ["ammo"]
		}
	}).map(item => {
		item.ammoType = `arrow ${random(1, 5)}`

		const vahvuus = random(3) ? "weak" : random(2) ? "normal" : "boss";
		const secondDmg = random(2) === 0;

		if(vahvuus == "weak") 	item.minRangeDmg = random(3, 10);
		if(vahvuus == "normal") item.minRangeDmg = random(12, 25);
		if(vahvuus == "boss") 	item.minRangeDmg = random(30, 45);

		if(secondDmg) {
			if(vahvuus == "weak") 	item.maxRangeDmg = item.minRangeDmg + random(3, 5);
			if(vahvuus == "normal") item.maxRangeDmg = item.minRangeDmg + random(10, 20);
			if(vahvuus == "boss") 	item.maxRangeDmg = item.minRangeDmg + random(30, 50);
		}
	
		return item;
	})
}

function generateConsumable(num) {
	return [...new Array(num)].map((_, i) => {
		const time = Math.round(new Date().getTime() / random(10000));
		return {
			id: `consumable${(time + i).toString(32)}`,
			name: `Consumable ${(time + i).toString(32)}`,
			image: "hpPottu.png",
			tags: ["consumable"]
		}
	}).map(item => {
		item.useTime = (random(10, 100) / 10 - .5).toFixed(1);

		const vahvuus = random(3) ? "weak" : random(2) ? "normal" : "boss";
		const healV = random(1) === 0;
		const manaHealV = random(1) === 0;
		const needMana = random(1) === 0;

		if(healV) {
			if(vahvuus == "weak") 	item.healV = random(10, 25);
			if(vahvuus == "normal") item.healV = random(25, 50);
			if(vahvuus == "boss") 	item.healV = random(50, 75);
		} if(manaHealV) {
			if(vahvuus == "weak") 	item.manaHealV = random(10, 25);
			if(vahvuus == "normal") item.manaHealV = random(30, 50);
			if(vahvuus == "boss") 	item.manaHealV = random(65, 125);
		}

		if(needMana && !manaHealV) {
			if(vahvuus == "weak") 	item.mana = Math.round(random(5, 25) / 5) * 5
			if(vahvuus == "normal") item.mana = Math.round(random(20, 45) / 5) * 5
			if(vahvuus == "boss") 	item.mana = Math.round(random(50, 100) / 5) * 5
		}	

		const selfEffect = random(5) === 0;
		const goodSelfEffects = ["Strength", "Regeneration"];
		const giveEffect = random(5) === 0;
		const goodGiveEffects = ["Weakness", "Poison"];

		if(selfEffect) {
			item.selfEffect = [];
			do {
				const effect = effects[random(effects.length - 1)];
				item.selfEffect.push({
					id: effect, 
					power: vahvuus === "boss" ? random(5, 8) : random(1, 4), 
					duration: vahvuus === "boss" ? random(15, 30) : random(1, 12), 
					effectStatus: goodSelfEffects.find(e => e === effect) ? "good" : "bad"
				});
			} while(random(1))
		} if(giveEffect) {
			item.giveEffect = [];
			do {
				const effect = effects[random(effects.length - 1)];
				item.giveEffect.push({
					id: effect, 
					power: vahvuus === "boss" ? random(5, 8) : random(1, 4), 
					duration: vahvuus === "boss" ? random(15, 30) : random(1, 12), 
					effectStatus: goodGiveEffects.find(e => e === effect) ? "good" : "bad"
				});
			} while(random(1))
		} else item.needTarget = false;
		
		item.amount = random(1, 10);

		return item;
	})
}

function generateCraftingRecipe(arr) {
	if(arr.length < 2) return console.error("Give more items");
	for(let i = 0; i < arr.length; i++) {
		if(!random(6)) continue;

		const item = arr[i];
		item.craftingRecipes = [];
		
		while(!item.craftingRecipes.length || !random(2)) {
			const recipe = [];
			do {
				let recipeIndex = i;
				while(i === recipeIndex) recipeIndex = random(arr.length - 1);
				const recipeItem = arr[recipeIndex];
				const amount = random(10) ? random(1, 10) : random(15, 45);
				recipe.push({item: recipeItem.id, amount});
			} while(random(100) < 60);
			if(item.amount) item.craftingRecipes.push({items: recipe, craftingAmount: random(1, 15)});
			else item.craftingRecipes.push({items: recipe, craftingAmount: random(1, 2)});
		}
	}
}

const ammo = generateAmmo(40);
const armor = generateArmor(60);
const materials = generateMaterials(20);
const weapons = generateWeapon(150).sort((v1, v2) => v1.mana - v2.mana);;
const consumable = generateConsumable(50).sort((v1, v2) => v1.mana - v2.mana);;

const allItems = [...armor, ...materials, ...weapons, ...ammo, ...consumable];

generateCraftingRecipe(allItems);

if(typeof items === "undefined") var items = {};

allItems.forEach(v => items[v.id] = v);

const saveWeapon = weapons.filter(item => !item.useAmmoType && !item.mana);

const enemies = generateEnemy(50);
const levels = generateLevels(100);

function generateEnemy(num) {
	return [...new Array(num)].map((_, i) => {
		const time = Math.round(new Date().getTime() / random(10000));
		return {
			id: `enemy${(time + i).toString(32)}`,
			name: `Enemy ${(time + i).toString(32)}`,
			img: "fillerImage1.png",
		}
	}).map(enemy => {
		const vahvuus = random(2) ? "weak" : random(1) ? "normal" : "boss";

		if(vahvuus == "weak") 	enemy.maxHp = random(10, 35);
		if(vahvuus == "normal") enemy.maxHp = random(36, 65);
		if(vahvuus == "boss") 	enemy.maxHp = random(100, 210);

		if(vahvuus == "weak") 	enemy.maxMp = random(10, 45);
		if(vahvuus == "normal") enemy.maxMp = random(100, 200);
		if(vahvuus == "boss") 	enemy.maxMp = random(350, 750);

		const items = [saveWeapon[random(saveWeapon.length - 1)]];

		do { // Give weapons
			let min = 0;
			for(let i = 0; i < 10; i++) {
				const rng = random(min, weapons.length - 1)
				const item = weapons[rng];

				if(testIfWeaponIsUsable(enemy, item)) {
					items.push(item);
					break;
				} else min = rng;
			}
		} while(random(1) && items.length < 3);

		do { // Give consumables
			let min = 0;
			for(let i = 0; i < 10; i++) {
				const rng = random(min, consumable.length - 1)
				const item = consumable[rng];

				if(testIfWeaponIsUsable(enemy, item)) {
					items.push(item);
					break;
				} else min = rng;
			}
		} while(random(1) && items.length < 5);

		items.filter(item => item.useAmmoType?.length).forEach(({useAmmoType}) => {
			const arr = ammo.slice();
			while(arr.length) {
				const rng = random(arr.length - 1);
				const item = ammo[rng];
				if(item.ammoType === useAmmoType) {
					items.push(item);
					break;
				} else arr.splice(rng, 1);
			}
		});

		enemy.items = items.map(item => {
			if(item.amount) return `§'{...items['${item.id}'], 'amount': ${random(2, 10)}}'§`;
			else return `§'items['${item.id}']'§`;
		});
		enemy.drops = [];

		do {
			enemy.drops.push(generateDrop2(random(1, 3), 1))
		} while(random(1) && enemy.drops.length < 2);

		return enemy;
	});
}

function generateDrop(deep = 3, lastType) {
	const types = ["all", "one"];
	if(random(2) && deep) {
		const typeIndex = lastType === "all" ? "one" : "all";
		return {
			"type": lastType ? nType : random(1) ? "all" : "one",
			"chance": Math.min(random(5, 110), 100),
			"items": [...new Array(random(1, 3))].map(v => generateDrop(deep - 1))
		}
	} else {
		const item = allItems[random(allItems.length - 1)];
		const arr = {
			"item": `§'items['${item.id}']'§`,
			"chance": Math.min(random(5, 110), 100)
		}

		if(item.amount) arr.amount = random(10) ? random(25, 50) : random(1, 15);
		return arr;
	}
}

function generateDrop2(items = 10, deep = 3, lastType) {
	const types = ["all", "one"];
	const type = lastType != undefined ? (lastType + 1) % 2 : random(1);

	if(random(2) && deep && items) {
		return {
			"type": types[type],
			"chance": Math.min(random(5, 110), 100),
			"items": [...new Array(random(1, 3))].map((v, _, arr) => generateDrop2(items - arr.length, deep - 1, type))
		}
	} else {
		const item = allItems[random(allItems.length - 1)];
		const arr = {
			"item": `§'items['${item.id}']'§`,
			"chance": Math.min(random(5, 110), 100)
		}

		if(item.amount) {
			const montaArvoa = random(5) === 0;
			const min = random(1, 6);
			const max = random(9);
			if(montaArvoa) arr.amount = [...new Array(random(3, 5))].map((_, i) => min * (i + 1));
			else if(max) arr.amount = [min, max];
			else arr.amount = random(4, 15);
		}
		return arr;
	}
}

function generateLevels(num) {
	return [...new Array(num)].map((_, i) => {
		const time = Math.round(new Date().getTime() / random(10000));
		return {
			id: `level_${(time + i).toString(32)}`,
			enemies: [],
			"cords": {
				"y": 0,
				"x": 0
			}
		}
	}).map(level => {
		const vihut = [];
		do {
			const vihu = enemies[random(enemies.length - 1)]
			level.enemies.push(vihu.id);
			vihut.push(vihu)
		} while(random(2) && level.enemies.length < 5);

		level.enemies.forEach((data, i) => {
			const enemy = vihut[i];
			const enemyItems = enemy.items.map(e => {
				const id = e.split(`'`)[2];
				return items[id]
			});
			const values = enemyItems.map(e => {
				const item = new Item(e);
				const bullet = item.useAmmoType ? enemyItems.find(e => e.ammoType === item.useAmmoType) : null;
				const nBullet = bullet ? new Item(bullet) : null;
				const bDamage = nBullet?.calcDamage() ?? {};
				const damages = item.calcDamage();

				if(nBullet) return damages.meleDmg + damages.rangeDmg + bDamage.meleDmg + bDamage.rangeDmg;
				else return damages.meleDmg + damages.rangeDmg;
			});
			level.cords.x += enemy.maxHp * 5 ?? 0;
			level.cords.y += Math.max(...values) * 5;
		});


		return level;
	});
}

function testIfWeaponIsUsable(enemy, weapon) {
	if(enemy.maxMp < weapon.mana) return false;
	return true;
}

{
	const pre = document.createElement("pre");
	const arr = {};
	allItems.forEach(v => arr[v.id] = v);
	pre.textContent = "var items = " + JSON.stringify(arr, (key, value) => {
		if(value?.item || value?.effectStatus) {
			return `§'${JSON.stringify(value).replaceAll(`"`, "'").replaceAll(`,`, ", ").replaceAll(`:`, ": ")}'§`;
		} if(key === "tags") return `§'['${value.join("', '")}']'§`;
		return value;
	}, 2).replaceAll(`'`, `"`).replaceAll(`"§"`, "").replace(/"([^"]+)":/g, '$1:') + ";";
	document.body.append(pre);
}

{
	const pre = document.createElement("pre");
	const arr = {};
	enemies.forEach(v => arr[v.id] = v);
	pre.textContent = "var enemies = " + JSON.stringify(arr, (key, value) => {
		if(value?.item && value?.chance) {
			return `§'${JSON.stringify(value).replaceAll(`"`, "'").replaceAll(`,`, ", ").replaceAll(`:`, ": ")}'§`;
		} return value;
	}, 2).replaceAll(`'`, `"`).replaceAll(`"§"`, "").replace(/"([^"]+)":/g, '$1:') + ";";
	document.body.append(pre);
}

{
	const pre = document.createElement("pre");
	const arr = {};
	levels.forEach(v => arr[v.id] = v);
	pre.textContent = "var levels = " + JSON.stringify(arr, (key, value) => {
		if(key === "enemies") return `§'['${value.join("', '")}']'§`;
		if(key === "cords") return `§'${JSON.stringify(value).replaceAll(`"`, "'").replaceAll(`,`, ", ").replaceAll(`:`, ": ")}'§`;
		return value;
	}, 2).replaceAll(`'`, `"`).replaceAll(`"§"`, "").replace(/"([^"]+)":/g, '$1:') + ";";
	document.body.append(pre);
}











// {
// 	const arr = {id: 5};

// 	console.log(JSON.stringify(arr, (key, value) => {
// 		// console.log(key, value)
// 		if(key == "id") return undefined;
// 		return value;
// 	}, "\t"))
// }
