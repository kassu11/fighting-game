if(typeof enemies === "undefined") var enemies = {
	week_slime: {
		id: "week_slime",
		maxHp: 31,
		maxMp: 30,
		items: [
			{...items["hp_pot"], "amount": 4},
			{...items["weak_stick"]},
		],
		effects: [
			// {id: "Poison", power: 5, duration: 6},
		],
		drops: [
			{
				"type": "one",
				"chance": 10,
				"items": [
					{"item": items["dmgBooster"], "amount": 1, "chance": 50},
					{"item": items["chestplate"], "chance": 50},
				]
			},
			{"item": items["hp_pot"], "chance": 100, "amount": [1, 2]}
		],
		img: "vihu2.png"
	},
	red_guy: {
		id: "red_guy",
		maxHp: 40,
		maxMp: 10,
		items: [
			items["weak_stick"],
		],
		drops: [
			{
				"type": "one",
				"chance": 75,
				"items": [
					{"item": items["legs"], "chance": 50},
					{"item": items["chestplate"], "chance": 50},
					{"item": items["helmet"], "chance": 50},
				]
			},
			{"item": items["dmgBooster"], "chance": 100, "amount": [2, 4]}
		],
		img: "vihu3.png",
	},
	octopus: {
		id: "octopus",
		maxHp: 40,
		maxMp: 50,
		items: [
			items["wooden_sword"],
			items["weak_stick"],
			items["dmgBooster"],
		],
		effects: [
			// {id: "Strength", power: 1, duration: 3},
		],
		drops: [
			{
				"type": "one",
				"chance": 80,
				"items": [
					{"item": items["legs"], "chance": 50},
					{"item": items["chestplate"], "chance": 50},
					{"item": items["weak_stick"], "chance": 50},
				]
			},
			{
				"type": "one",
				"chance": 80,
				"items": [
					{"item": items["hp_pot"], "chance": 50},
					{"item": items["weak_stick"], "chance": 50},
					{"item": items["suicideStick"], "chance": 50},
					{"item": items["dmgBooster"], "amount": [7, 5, 6, 10], "chance": 50},
				]
			},
			{"item": items["helmet"], "chance": 100, "amount": [2, 4]}
		],
		img: "octopus.png",
	},
	fish_dude: {
		id: "fish_dude",
		maxHp: 40,
		maxMp: 50,
		items: [
			items["wooden_sword"],
		],
		drops: [
			{
				"type": "one",
				"chance": 80,
				"items": [
					{"item": items["legs"], "chance": 30},
					{"item": items["chestplate"], "chance": 30},
					{"item": items["helmet"], "chance": 30},
					{
						"type": "all",
						"chance": 10,
						"items": [
							{"item": items["hp_pot"], "amount": [2, 5]},
							{"item": items["dmgBooster"], "amount": [4, 2]},
						]
					}
				]
			},
		],
		img: "enemy4.png",
	},
	tongue_monster: {
		id: "tongue_monster",
		maxHp: 20,
		maxMp: 10,
		items: [
			items["weak_stick"],
		],
		effects: [],
		drops: [],
		img: "vihu1.png",
	},
	devil: {
		id: "devil",
		maxHp: 20,
		maxMp: 10,
		items: [
			items["weak_stick"],
		],
		img: "hahmo1.png",
	},
	filler1: {
		id: "filler1",
		maxHp: 20,
		maxMp: 15,
		items: [
			items["bow"],
			{...items["arrow"], amount: 1},
			items["hp_pot"],
			items["weak_stick"],
			items["stone_sword"]
		],
		effects: [
			// {id: "Poison", power: 2, duration: 4},
			// {id: "Strength", power: 5, duration: 60},
			// {id: "Regeneration", power: 6, duration: 2},
		],
		img: "fillerImage1.png",
		drops: [
			{
				"type": "all",
				"chance": 90,
				"items": [
					{"item": items["helmet"], "chance": 50, "amount": 100},
					{
						"type": "one",
						"chance": 90,
						"items": [
							{"item": items["helmet"], "chance": 50},
							{
								"type": "one",
								"chance": 20,
								"items": [
									{"item": items["legs"], "chance": 50},
									{"item": items["chestplate"], "chance": 50},
								]
							}
						]
					},
				]
			},
			{
				"type": "all",
				"chance": 90,
				"items": [
					{"item": items["helmet"], "chance": 50},
					{
						"type": "one",
						"chance": 20,
						"items": [
							{"item": items["legs"], "chance": 50},
							{"item": items["chestplate"], "chance": 50},
							{"item": items["helmet"], "chance": 50},
							{"item": items["legs"], "chance": 50},
							{"item": items["chestplate"], "chance": 50},
							{"item": items["helmet"], "chance": 50},
						]
					}
				]
			},
			{"item": items["legs"], "chance": 50},
			{"item": items["chestplate"], "chance": 50},
			{"item": items["helmet"], "chance": 50},
		]
	},
}

function Enemy(enemy) {
	this.id = enemy.id;
	this.hp = enemy.hp ?? enemy.maxHp;
	this.maxHp = enemy.maxHp;
	this.mp = enemy.mp ?? enemy.maxMp;
	this.maxMp = enemy.maxMp;
	this.bullets = enemy.bullets?.map(item => new Item(item, this)) || [];
	this.items = [];
	enemy.items?.forEach(item => {
		if(item.isNotUsable && item.ammoType?.length) {
			this.bullets.push(new Item(item, this));
		} else {
			this.items.push(new Item(item, this));
		}
	});
	this.img = enemy.img;

	this.drops = dropsFromLootTable(enemy.drops);

	this.effects = enemy.effects?.map(effect => new Effect(effect)) || [];
}

Enemy.prototype.effect = effect;

function dropsFromLootTable(lootTable = []) {
	const items = [];

	lootTable?.forEach(drop => {
		const r = random(100);
		if(r > drop.chance || drop.chance == null) return;
		if(drop?.type == "all") typeAll(drop);
		else if(drop?.type == "one") typeOne(drop);
		else items.push(drop)
	});

	function typeAll(arr) {
		arr.items.forEach(drop => {
			if(drop?.type == "all") typeAll(drop);
			else if(drop?.type == "one") typeOne(drop);
			else items.push(drop);
		});
	}

	function typeOne(arr) {
		const combinedChances = arr.items.map(item => item.chance ?? 0).reduce((acc, v) => [...acc, (acc[acc.length - 1] || 0) + v], []);
		const totalChance = Math.max(...combinedChances);
		const r = random(1, totalChance || 1);
		const index = combinedChances.findIndex(chance => r <= chance);
		const drop = arr.items[index];
		if(drop == null) return;
		else if(drop?.type == "all") typeAll(drop);
		else if(drop?.type == "one") typeOne(drop);
		else items.push(drop);
	}

	return items;
}

// {
//   let tulos = 0;
//   const maxNum = 10000;
	
//   const A = .9
//   const B = .8
//   const C = .5
//   const D = .5
//   const E = .5
	
//   console.log(tulos / maxNum);
	
//   console.log(A + B - A * B);
//   console.log(A + B + C - (A * B) - (A * C) - (B * C) + (A * B * C));
	
//   console.log(
//     (A + B + C + D) - 
//     (A * B) - (A * C) - (A * D) - 
//     (B * C) - (B * D) - 
//     (C * D) +
//     (A * B * C) + (A * B * D) +
//     (A * C * D) +
//     (B * C * D) -
//     (A * B * C * D)
//   );
// }



function printEnemyDropRates(id) {
	const mahikset = {};
	const max = 10000;
	for(let i = 0; i < max; i++) {
		const enemy = new Enemy(enemies[id]);
		enemy.drops.forEach(v => {
			const key = JSON.stringify(v);
			mahikset[key] ??= 0;
			mahikset[key]++;
		});
	}
	
	for(const [key, value] of Object.entries(mahikset)) {
		const taulu = JSON.parse(key);
		console.log(`ID: ${taulu.item.id} chance: ${taulu.chance}`, value, value / max)
	}
}

printEnemyDropRates("goblin")
