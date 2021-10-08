
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
		
		if(random(1)) {
			item.healthBoostValue = random(1, 1000)
		} if(random(1)) {
			item.defenceValue = random(1, 1000)
		} if(random(1)) {
			item.defencePercentage = random(1, 35);
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

		if(random(1)) {
			if(random(1)) {
				item.minMeleDmg = random(1, 1000)
			} if(random(1)) {
				item.maxMeleDmg = random(1, 1000)
			}
		} else {
			if(random(1)) {
				item.minRangeDmg = random(1, 1000)
			} if(random(1)) {
				item.maxRangeDmg = random(1, 1000)
			} 
			item.animationDelay = 200;
			item.useAmmoType = `arrow ${random(1, 5)}`
			item.image = "bow.png";
		}

		if(random(5) === 0) {
			item.selfEffect = [];
			for(let i = 1; i; i = random(1)) {
				item.selfEffect.push({
					id: effects[random(effects.length - 1)], 
					power: random(1, 6), 
					duration: random(1, 20), 
					effectStatus: random(1) ? "good" : "bad"
				})
			}
		} if(random(5) === 0) {
			item.giveEffect = [];
			for(let i = 1; i; i = random(1)) {
				item.giveEffect.push({
					id: effects[random(effects.length - 1)], 
					power: random(1, 6), 
					duration: random(1, 20), 
					effectStatus: random(1) ? "good" : "bad"
				})
			}
		}

		if(!random(2)) {
			item.mana = Math.round(random(5, 500) / 5) * 5;
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
		item.useTime = (random(10, 100) / 10 - .5).toFixed(1);
		item.ammoType = `arrow ${random(1, 5)}`

		if(random(1)) item.minRangeDmg = random(1, 300);
		if(random(1)) item.maxRangeDmg = random(1, 500);
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

		if(random(1)) {
			if(random(3)) {
				item.healV = random(5, 50)
			} else {
				item.healV = random(100, 500)
			}
		}

		if(random(1)) {
			if(random(3)) {
				item.manaHealV = random(5, 50)
			} else {
				item.manaHealV = random(100, 500)
			}
		}

		if(random(5) === 0) {
			item.selfEffect = [];
			for(let i = 1; i; i = random(1)) {
				item.selfEffect.push({
					id: effects[random(effects.length - 1)], 
					power: random(1, 6), 
					duration: random(1, 20), 
					effectStatus: random(1) ? "good" : "bad"
				})
			}
		} if(random(5) === 0) {
			item.giveEffect = [];
			for(let i = 1; i; i = random(1)) {
				item.giveEffect.push({
					id: effects[random(effects.length - 1)], 
					power: random(1, 6), 
					duration: random(1, 20), 
					effectStatus: random(1) ? "good" : "bad"
				})
			}
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

const armor = generateArmor(20);
const materials = generateMaterials(20);
const weapons = generateWeapon(100);
const ammo = generateAmmo(20);
const consumable = generateConsumable(35);

const allItems = [...armor, ...materials, ...weapons, ...ammo, ...consumable];

generateCraftingRecipe(allItems);

const items = {};

allItems.forEach(v => items[v.id] = v);


const enemies = generateEnemy(30);
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
		if(!random(10)) {
			enemy.maxHp = random(400, 1000);
		} else if(!random(5)) {
			enemy.maxHp = random(100, 350);
		} else {
			enemy.maxHp = random(10, 100);
		}

		if(!random(10)) {
			enemy.maxMp = random(400, 1000);
		} else if(!random(5)) {
			enemy.maxMp = random(100, 350);
		} else {
			enemy.maxMp = random(30, 100);
		}

		const items = [weapons[random(weapons.length - 1)]];

		do {
			if(random(1)) {
				items.push(consumable[random(consumable.length - 1)]);
			} else items.push(weapons[random(weapons.length - 1)]);
		} while(random(2) || items.length < 3);

		if(items.find(item => item.useAmmoType?.length)) {
			do {
				items.push(ammo[random(ammo.length - 1)])
			} while(random(3));
		}
		enemy.items = items.map(item => {
			if(item.amount) return `§'{...items['${item.id}'], 'amount': ${random(2, 10)}}'§`;
			else return `§'items['${item.id}']'§`;
		});
		enemy.drops = [];

		do {
			enemy.drops.push(generateDrop(2))
		} while(random(2) && enemy.drops.length < 4);

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
		} while(random(2));

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
			level.cords.x += enemy.maxHp ?? 0;
			level.cords.y += Math.max(...values);
		});


		return level;
	});
}

// {
// 	const pre = document.createElement("pre");
// 	const arr = {};
// 	allItems.forEach(v => arr[v.id] = v);
// 	pre.textContent = "const items = " + JSON.stringify(arr, null, 2) + ";";
// 	document.body.append(pre);
// }

{
	const pre = document.createElement("pre");
	const arr = {};
	enemies.forEach(v => arr[v.id] = v);
	pre.textContent = "const enemies = " + JSON.stringify(arr, null, 2).replaceAll(`'`, `"`).replaceAll(`"§"`, "") + ";";
	document.body.append(pre);
}

// {
// 	const pre = document.createElement("pre");
// 	const arr = {};
// 	levels.forEach(v => arr[v.id] = v);
// 	pre.textContent = "const levels = " + JSON.stringify(arr, (key, value) => {
// 		if(key === "enemies") return `§'['${value.join("', '")}']'§`;
// 		return value;
// 	}, 2).replaceAll(`'`, `"`).replaceAll(`"§"`, "") + ";";
// 	document.body.append(pre);
// }
