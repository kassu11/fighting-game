const items = {
	wooden_sword: {
		id: "wooden_sword",
		name: "Wooden sword",
		tags: ["weapon", "sword"],
		minMeleDmg: 10,
		maxMeleDmg: 20,
		useTime: 2,
		image: "miekka1.png",
		craftingRecipes: [
			{
				items: [
					{
						item: "weak_stick",
						amount: 5
					}
				],
			}
		]
	},
	stone_sword: {
		id: "stone_sword",
		name: "Stone sword",
		tags: ["weapon", "sword"],
		minMeleDmg: 15,
		maxMeleDmg: 25,
		useTime: 1.5,
		image: "heikkous.png",
		particle: "explosion2",
		craftingRecipes: [
			{
				items: [
					{
						item: "weak_stick",
						amount: 5
					},
					{
						item: "wooden_sword",
						amount: 1
					}
				],
			}
		]
	},
	weak_stick: {
		id: "weak_stick",
		name: "Weak stick",
		tags: ["weapon", "material"],
		// minMeleDmg: 2,
		maxMeleDmg: 4,
		useTime: 1,
		image: "weak_stick.png",
		particle: "explosion",
		craftingRecipes: [
			{
				items: [
					{
						item: "hp_pot",
						amount: 20
					},
				],
			},
			{
				items: [
					{
						item: "helmet",
						amount: 1
					},
					{
						item: "chestplate",
						amount: 1
					},
				]
			},
			{
				items: [
					{
						item: "dmgBooster",
						amount: 2
					},
				],
			},
		]
	},
	dmgBooster: {
		id: "dmgBooster",
		name: "Damage booster",
		tags: ["consumable"],
		useTime: 1,
		image: "voimaLääke.png",
		// particle: "explosion",
		selfEffect: [
			{id: "Strength", power: 5, duration: 3, effectStatus: "good"},
			{id: "Regeneration", power: 3, duration: 5, effectStatus: "good"},
			{id: "Poison", power: 1, duration: 20, effectStatus: "bad"},
		],
		giveEffect: [
			{id: "Poison", power: 1, duration: 20, effectStatus: "bad"}
		],
		amount: 2,
		needTarget: true,
		craftingRecipes: [
			{
				items: [
					{
						item: "hp_pot",
						amount: 2
					},
					{
						item: "suicideStick",
						amount: 6
					}
				],
				craftingAmount: 2
			}
		]
	},
	hp_pot: {
		id: "hp_pot",
		name: "Elämä pullo",
		tags: ["consumable", "material", "healing"],
		healV: 10,
		useTime: 1,
		amount: 10,
		needTarget: false,
		image: "hpPottu.png",
		mana: 15,
		craftingRecipes: [
			{
				items: [
					{
						item: "iron",
						amount: 2
					},
					{
						item: "suicideStick",
						amount: 1
					}
				],
				craftingAmount: 5
			}
		]
	},
	suicideStick: {
		id: "suicideStick",
		name: "Suicide stick",
		tags: ["weapon"],
		useTime: 2,
		image: "taika.png",
		selfEffect: [
			{id: "Strength", power: 50, duration: 300, effectStatus: "good"}
		],
		giveEffect: [
			{id: "Strength", power: 50, duration: 20, effectStatus: "good"}
		],
		needTarget: true
	},
	helmet: {
		id: "helmet",
		name: "Helmet",
		tags: ["armor", "helmet"],
		image: "helmet.png",
		canEquipTo: "head",
		healthBoostValue: 50,
		craftingRecipes: [
			{
				items: [
					{item: "iron", amount: 6}
				]
			}
		]
	},
	chestplate: {
		id: "chestplate",
		name: "Panssari",
		tags: ["armor", "chestplate"],
		image: "basechest3.png",
		canEquipTo: "chest",
		healthBoostValue: 50,
		craftingRecipes: [
			{
				items: [
					{item: "iron", amount: 8}
				]
			}
		]
	},
	legs: {
		id: "legs",
		name: "Jalat",
		tags: ["armor", "leggings"],
		image: "baselegs3.png",
		canEquipTo: "legs",
		healthBoostValue: 50,
		craftingRecipes: [
			{
				items: [
					{item: "iron", amount: 5}
				]
			},
			{
				items: [
					{item: "iron", amount: 1},
					{item: "chestplate", amount: 1},
					{item: "helmet", amount: 1},
					{item: "suicideStick", amount: 1},
					{item: "hp_pot", amount: 1},
					{item: "dmgBooster", amount: 1},
					{item: "weak_stick", amount: 1},
					{item: "stone_sword", amount: 1},
				]
			}
		]
	},
	iron: {
		id: "iron",
		name: "Block of iron",
		tags: ["material"],
		image: "iron.png",
		amount: 5
	},
	chestplate2: {
		id: "chestplate2",
		name: "Nahka panssari",
		tags: ["armor", "chestplate"],
		image: "lether-chest-plate.png",
		canEquipTo: "chest",
		defenceValue: 20,
		healthBoostValue: 50,
		craftingRecipes: []
	},
	leatherLeggins: {
		id: "leatherLeggins",
		name: "Nahka pöksyt",
		tags: ["armor", "leggings"],
		image: "leather-leggins.png",
		canEquipTo: "legs",
		defencePercentage: 75,
	},
	filler1: {
		id: "filler1",
		selfEffect: [
			{id: "Weakness", power: 1, duration: 20, effectStatus: "bad"},
		]
	},
	bow: {
		id: "bow",
		name: "Bow",
		useAmmoType: "arrow",
		image: "bow.png",
		useTime: 1,
		minRangeDmg: 6,
		animationDelay: 200
	},
	arrow: {
		id: "arrow",
		name: "Wooden arrow",
		ammoType: "arrow",
		image: "arrow.png",
		isNotUsable: true, 
		amount: 10,
		minRangeDmg: 6,
	}
}

function Item(item, user) {
	const base = items[item.id];
	this.user = user ?? item.user;
	this.id = item.id;
	this.name = item.name ?? base.name ?? "";
	this.minMeleDmg = base.minMeleDmg ?? base.maxMeleDmg;
	this.maxMeleDmg = base.maxMeleDmg ?? this.minMeleDmg;
	this.minRangeDmg = base.minRangeDmg ?? base.maxRangeDmg;
	this.maxRangeDmg = base.maxRangeDmg ?? this.minRangeDmg;
	this.useTime = base.useTime;
	this.image = base.image;
	this.particle = base.particle;
	this.slot = item.slot;
	this.amount = item.amount ?? base.amount;
	this.canEquipTo = base.canEquipTo ?? "hotbar";

	this.useAmmoType = base.useAmmoType;
	this.ammoType = base.ammoType;
	this.isNotUsable = base.isNotUsable;

	this.healthBoostValue = base.healthBoostValue;
	this.defenceValue = base.defenceValue;
	this.defencePercentage = base.defencePercentage;

	this.healV = base.healV;
	this.mana = base.mana;
	this.tags = base.tags?.sort().slice() ?? [];
	this.index = item.index;

	this.craftingRecipes = base.craftingRecipes;

	this.needTarget = base.needTarget ?? true;
	this.noShake = base.noShake;
	this.animationDelay = base.animationDelay;

	this.selfEffect = base.selfEffect?.map(effect => new Effect(effect)) ?? [];
	this.giveEffect = base.giveEffect?.map(effect => new Effect(effect)) ?? [];
}

Item.prototype.calcDamage = function() {
	const dmgPercentage = this.user?.effects?.reduce((arr, effect) => arr += effect.dmgPercentage || 0, 1) || 1;
	const dmgReduction = this.user?.effects?.reduce((arr, effect) => arr += effect.reduceDmg || 0, 0) || 0;

	const minMeleDmg = Math.max( (this.minMeleDmg ?? 0) * dmgPercentage - dmgReduction, 0 );
	const maxMeleDmg = Math.max( (this.maxMeleDmg ?? 0) * dmgPercentage - dmgReduction, 0 );

	const minRangeDmg = Math.max( (this.minRangeDmg ?? 0) * dmgPercentage - dmgReduction, 0 );
	const maxRangeDmg = Math.max( (this.maxRangeDmg ?? 0) * dmgPercentage - dmgReduction, 0 );

	return {
		intentToHurt: (this.minMeleDmg ?? this.minRangeDmg) != null,
		meleDmg: Math.max( Math.floor( random(minMeleDmg, maxMeleDmg) ), 0 ),
		rangeDmg: Math.max( Math.floor( random(minRangeDmg, maxRangeDmg) ), 0 ),
		minMeleDmg: Math.floor(minMeleDmg),
		maxMeleDmg: Math.floor(maxMeleDmg),
		minRangeDmg: Math.floor(minRangeDmg),
		maxRangeDmg: Math.floor(maxRangeDmg)
	}
}

Item.prototype.hoverText = function() {
	const text = [`<cl>itemTitle<cl>${this.name}§`];
	const calcDmg = this.calcDamage();

	if(this.minMeleDmg) {
		const oldDmgText = [];
		if(this.minMeleDmg) oldDmgText.push(this.minMeleDmg);
		if(this.maxMeleDmg > oldDmgText) oldDmgText.push(this.maxMeleDmg);
		const dmgText = [calcDmg.minMeleDmg];
		if(calcDmg.maxMeleDmg > dmgText) dmgText.push(calcDmg.maxMeleDmg);

		const sameDmg = oldDmgText.join("") == dmgText.join("");
		const oldClass = calcDmg.maxMeleDmg > oldDmgText.slice(-1) ? "lesser" : "";
		const newClass = sameDmg ? "hidden" : calcDmg.maxMeleDmg < oldDmgText.slice(-1) ? "lesser" : "";

		text.push(`\nMele damage: §<cl>dmg ${oldClass} ${sameDmg ? "" : "line"}<cl>${oldDmgText.join("-")}§<cl>dmg ${newClass}<cl> ${dmgText.join("-")}§`);
	} if(this.minRangeDmg) {
		const oldDmgText = [];
		if(this.minRangeDmg) oldDmgText.push(this.minRangeDmg);
		if(this.maxRangeDmg > oldDmgText) oldDmgText.push(this.maxRangeDmg);
		const dmgText = [calcDmg.minRangeDmg];
		if(calcDmg.maxRangeDmg > dmgText) dmgText.push(calcDmg.maxRangeDmg);

		const sameDmg = oldDmgText.join("") == dmgText.join("");
		const oldClass = calcDmg.maxRangeDmg > oldDmgText.slice(-1) ? "lesser" : "";
		const newClass = sameDmg ? "hidden" : calcDmg.maxRangeDmg < oldDmgText.slice(-1) ? "lesser" : "";

		text.push(`\nRange damage: §<cl>dmg ${oldClass} ${sameDmg ? "" : "line"}<cl>${oldDmgText.join("-")}§<cl>dmg ${newClass}<cl> ${dmgText.join("-")}§`);
	}

	if(this.useTime) text.push(`\nUse time: §${this.useTime} ${this.useTime > 1 ? "Rounds" : "Round"} <c>yellow<c>§`);
	if(this.healV) text.push(`\nHeals user: §${this.healV}HP<c>red<c><b>600<b>§`);
	if(this.mana) text.push(`\nMana use: §${this.mana}MP<c>#3a85ff<c><b>700<b>§`);

	if(this.useAmmoType) text.push(`\nUses ammo: §${this.useAmmoType}<c>lime<c>§`);
	if(this.ammoType) text.push(`\nAmmo type: §${this.ammoType}<c>lime<c>§`);

	if(this.healthBoostValue) text.push(`\nHealth boost: §${this.healthBoostValue}HP<c>lime<c><b>700<b>§`);
	if(this.defenceValue) text.push(`\nReduce damage: §${this.defenceValue}<c>#ff5454<c>HP<b>700<b>§`);
	if(this.defencePercentage) text.push(`\nDefence: §${this.defencePercentage}<c>#ac75ff<c><b>700<b>§`);

	if(this.selfEffect?.length > 0) {
		text.push(`\n\n§<cl>selfEffect<cl>Gives the user§`);
		this.selfEffect.forEach(effect => {
			if(effect.effectStatus == "good") text.push(`\n§<cl>goodEffect<cl>§<cl>effect<cl> ${effect.title} § for § <cl>effectDuration<cl>${effect.duration} rounds `);
			else text.push(`\n§<cl>badEffect<cl>§<cl>effect<cl> ${effect.title} § for § <cl>effectDuration<cl>${effect.duration} rounds `);
		}); text.push("§")
	}

	if(this.giveEffect?.length > 0) {
		text.push(`\n\n§<cl>giveEffect<cl>Gives enemy§`);
		this.giveEffect.forEach(effect => {
			if(effect.effectStatus == "good") text.push(`\n§<cl>goodEffect<cl>§<cl>effect<cl> ${effect.title} § for § <cl>effectDuration<cl>${effect.duration} rounds `);
			else text.push(`\n§<cl>badEffect<cl>§<cl>effect<cl> ${effect.title} § for § <cl>effectDuration<cl>${effect.duration} rounds `);
		}); text.push("§");
	}

	const tagsText = this.tags?.length ? `\n<cl>itemTags<cl>#${this.tags.join(" #")}§` : "";

	return text.join("") + tagsText;
}

Item.prototype.ammoAmount = function() {
	const ammoType = this.useAmmoType;
	return Object.values(player.hotbar).reduce((acc, val) => {
		if(ammoType !== val.ammoType) return acc
		return acc + val.amount;
	}, 0);
}