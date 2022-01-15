if(typeof items === "undefined") var items = {
	wooden_sword: {
		id: "wooden_sword",
		name: "Wooden sword",
		tags: ["weapon", "sword"],
		minMeleDmg: 12,
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
		mana: 10,
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
		maxMeleDmg: 1,
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
					{item: "helmet", amount: 1},
					{item: "chestplate", amount: 1},
				]
			},
			{
				items: [
					{item: "dmgBooster", amount: 2},
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
		image: "iron-chestplate.png",
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
		image: "iron-leggins.png",
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
		manaBoostValue: 100,
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
		name: "Filler item",
		selfEffect: [
			{id: "Weakness", power: 1, duration: 20, effectStatus: "bad"},
		],
		manaHealV: 10
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
		bulletRotate: 0,
		amount: 10,
		minRangeDmg: 6,
	}
}

items["filler"] = {id: "filler", minMeleDmg: 2, useTime: 1};

function Item(item, user) {
	const base = items[item.id];
	this.user = user ?? item.user;
	this.id = item.id;
	this.name = item.name ?? base.name ?? "";
	this.minMeleDmg = base.minMeleDmg ?? base.maxMeleDmg;
	this.maxMeleDmg = base.maxMeleDmg ?? this.minMeleDmg;
	this.minRangeDmg = base.minRangeDmg ?? base.maxRangeDmg;
	this.maxRangeDmg = base.maxRangeDmg ?? this.minRangeDmg;
	this.minMagicDmg = base.minMagicDmg ?? base.maxMagicDmg;
	this.maxMagicDmg = base.maxMagicDmg ?? this.minMagicDmg;
	this.minArrowDmg = base.minArrowDmg ?? base.maxArrowDmg;
	this.maxArrowDmg = base.maxArrowDmg ?? this.minArrowDmg;
	this.useTime = base.useTime;
	this.image = base.image;
	this.particle = base.particle;
	this.slot = item.slot;
	this.amount = item.amount ?? base.amount;
	this.canEquipTo = base.canEquipTo ?? "hotbar"; // hotbar, armorhead, armorchest, armorlegs

	this.useAmmoType = base.useAmmoType;
	this.ammoType = base.ammoType;
	this.isNotUsable = base.isNotUsable;
	this.bulletRotate = base.bulletRotate ?? 0;

	this.healthBoostValue = base.healthBoostValue;
	this.manaBoostValue = base.manaBoostValue;
	this.defenceValue = base.defenceValue;
	this.defencePercentage = base.defencePercentage;

	this.healV = base.healV;
	this.manaHealV = base.manaHealV;
	this.mana = base.mana;
	this.tags = base.tags?.sort().slice() ?? [];
	this.index = item.index;

	this.craftingRecipes = base.craftingRecipes;

	this.needTarget = base.needTarget ?? true;
	this.noShake = base.noShake;
	this.animationDelay = base.animationDelay;

	this.selfEffect = base.selfEffect?.map(effect => new Effect(effect)) ?? [];
	this.giveEffect = base.giveEffect?.map(effect => new Effect(effect)) ?? [];

	this.armorSet = base.armorSet;

	this.meleDmgValue = base.meleDmgValue;
	this.meleDmgPercentage = base.meleDmgPercentage;
	this.rangeDmgValue = base.rangeDmgValue;
	this.rangeDmgPercentage = base.rangeDmgPercentage;
	this.magicDmgValue = base.magicDmgValue;
	this.magicDmgPercentage = base.magicDmgPercentage;
	this.arrowDmgValue = base.arrowDmgValue;
	this.arrowDmgPercentage = base.arrowDmgPercentage;
}

Item.prototype.calcDamage = function() {
	const dmgPercentage = this.user?.effects?.reduce((arr, effect) => arr += effect.dmgPercentage || 0, 1) || 1;
	const dmgReduction = this.user?.effects?.reduce((arr, effect) => arr += effect.reduceDmg || 0, 0) || 0;

	const meleDmgValue = this.user?.armorMeleBoostValue ?? 0;
	const meleDmgPercentage = this.user?.armorMeleBoostPercentage ?? 1;
	const rangeDmgValue = this.user?.armorRangeBoostValue ?? 0;
	const rangeDmgPercentage = this.user?.armorRangeBoostPercentage ?? 1;
	const magicDmgValue = this.user?.armorMagicBoostValue ?? 0;
	const magicDmgPercentage = this.user?.armorMagicBoostPercentage ?? 1;
	const arrowDmgValue = this.user?.armorArrowBoostValue ?? 0;
	const arrowDmgPercentage = this.user?.armorArrowBoostPercentage ?? 1;

	const minMeleDmg = Math.max( this.minMeleDmg ? this.minMeleDmg * meleDmgPercentage * dmgPercentage - dmgReduction + meleDmgValue : 0, 0 );
	const maxMeleDmg = Math.max( this.maxMeleDmg ? this.maxMeleDmg * meleDmgPercentage * dmgPercentage - dmgReduction + meleDmgValue : 0, 0 );

	const minRangeDmg = Math.max( this.minRangeDmg ? this.minRangeDmg * rangeDmgPercentage * dmgPercentage - dmgReduction + rangeDmgValue : 0, 0 );
	const maxRangeDmg = Math.max( this.maxRangeDmg ? this.maxRangeDmg * rangeDmgPercentage * dmgPercentage - dmgReduction + rangeDmgValue : 0, 0 );

	const minMagicDmg = Math.max( this.minMagicDmg ? this.minMagicDmg * magicDmgPercentage * dmgPercentage - dmgReduction + magicDmgValue : 0, 0 );
	const maxMagicDmg = Math.max( this.maxMagicDmg ? this.maxMagicDmg * magicDmgPercentage * dmgPercentage - dmgReduction + magicDmgValue : 0, 0 );

	const minArrowDmg = Math.max( this.minArrowDmg ? this.minArrowDmg * arrowDmgPercentage * dmgPercentage - dmgReduction + arrowDmgValue : 0, 0 );
	const maxArrowDmg = Math.max( this.maxArrowDmg ? this.maxArrowDmg * arrowDmgPercentage * dmgPercentage - dmgReduction + arrowDmgValue : 0, 0 );

	return {
		intentToHurt: (this.minMeleDmg ?? this.minRangeDmg ?? this.minMagicDmg ?? this.minArrowDmg) != null,
		meleDmg: Math.max( Math.floor( random(minMeleDmg, maxMeleDmg) ), 0 ),
		rangeDmg: Math.max( Math.floor( random(minRangeDmg, maxRangeDmg) ), 0 ),
		magicDmg: Math.max( Math.floor( random(minMagicDmg, maxMagicDmg) ), 0 ),
		arrowDmg: Math.max( Math.floor( random(minArrowDmg, maxArrowDmg) ), 0 ),
		totalDmg: function() {return this.meleDmg + this.rangeDmg + this.magicDmg + this.arrowDmg},
		totalMaxDmg: function() {return this.maxMeleDmg + this.maxRangeDmg + this.maxMagicDmg + this.maxArrowDmg},
		totalMinDmg: function() {return this.minMeleDmg + this.minRangeDmg + this.minMagicDmg + this.minArrowDmg},
		minMeleDmg: Math.floor(minMeleDmg),
		maxMeleDmg: Math.floor(maxMeleDmg),
		minRangeDmg: Math.floor(minRangeDmg),
		maxRangeDmg: Math.floor(maxRangeDmg),
		minMagicDmg: Math.floor(minMagicDmg),
		maxMagicDmg: Math.floor(maxMagicDmg),
		minArrowDmg: Math.floor(minArrowDmg),
		maxArrowDmg: Math.floor(maxArrowDmg)
	}
}

Item.prototype.calcTotalDamage = function() {
	const dmg = this.calcDamage().totalMaxDmg();
	if(this.useAmmoType) {
		const items = this.user.bullets ?? Object.values(this.user.hotbar) ?? [];
		const bullet = items?.find(item => item.ammoType === this.useAmmoType);
		if(bullet) {
			const bulletDmg = bullet.calcDamage().totalMaxDmg();
			return dmg + bulletDmg;
		} 
	}

	return dmg;
}

Item.prototype.canUse = function() {
	if(this.isNotUsable) return false;
	if(this.mana > this.user?.mp) return false;
	if(this.useAmmoType && this.ammoAmount() === 0) return false;
	if(this.amount <= 0) return false;
	return true;
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

		text.push(`\nMelee damage: §<cl>dmg ${oldClass} ${sameDmg ? "" : "line"}<cl>${oldDmgText.join("-")}§<cl>dmg ${newClass}<cl> ${dmgText.join("-")}§`);
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
	} if(this.minMagicDmg) {
		const oldDmgText = [];
		if(this.minMagicDmg) oldDmgText.push(this.minMagicDmg);
		if(this.maxMagicDmg > oldDmgText) oldDmgText.push(this.maxMagicDmg);
		const dmgText = [calcDmg.minMagicDmg];
		if(calcDmg.maxMagicDmg > dmgText) dmgText.push(calcDmg.maxMagicDmg);

		const sameDmg = oldDmgText.join("") == dmgText.join("");
		const oldClass = calcDmg.maxMagicDmg > oldDmgText.slice(-1) ? "lesser" : "";
		const newClass = sameDmg ? "hidden" : calcDmg.maxMagicDmg < oldDmgText.slice(-1) ? "lesser" : "";

		text.push(`\nMagic damage: §<cl>dmg ${oldClass} ${sameDmg ? "" : "line"}<cl>${oldDmgText.join("-")}§<cl>dmg ${newClass}<cl> ${dmgText.join("-")}§`);
	} if(this.minArrowDmg) {
		const oldDmgText = [];
		if(this.minArrowDmg) oldDmgText.push(this.minArrowDmg);
		if(this.maxArrowDmg > oldDmgText) oldDmgText.push(this.maxArrowDmg);
		const dmgText = [calcDmg.minArrowDmg];
		if(calcDmg.maxArrowDmg > dmgText) dmgText.push(calcDmg.maxArrowDmg);

		const sameDmg = oldDmgText.join("") == dmgText.join("");
		const oldClass = calcDmg.maxArrowDmg > oldDmgText.slice(-1) ? "lesser" : "";
		const newClass = sameDmg ? "hidden" : calcDmg.maxArrowDmg < oldDmgText.slice(-1) ? "lesser" : "";

		text.push(`\nBullet damage: §<cl>dmg ${oldClass} ${sameDmg ? "" : "line"}<cl>${oldDmgText.join("-")}§<cl>dmg ${newClass}<cl> ${dmgText.join("-")}§`);
	}

	if(this.useTime) text.push(`\nUse time: §${this.useTime} ${this.useTime > 1 ? "Rounds" : "Round"} <c>yellow<c>§`);
	if(this.healV) text.push(`\nHeals user: §${this.healV}HP<c>red<c><b>700<b>§`);
	if(this.manaHealV) text.push(`\nGives mana: §${this.manaHealV}MP<c>#3a85ff<c><b>700<b>§`);
	if(this.mana) text.push(`\nMana use: §${this.mana}MP<c>#3a85ff<c><b>700<b>§`);

	if(this.useAmmoType) text.push(`\nUses ammo: §${this.useAmmoType}<c>lime<c>§`);
	if(this.ammoType) text.push(`\nAmmo type: §${this.ammoType}<c>lime<c>§`);

	if(this.healthBoostValue) text.push(`\nHealth boost: §${this.healthBoostValue}HP<c>lime<c><b>700<b>§`);
	if(this.manaBoostValue) text.push(`\nMana boost: §${this.manaBoostValue}HP<c>#3a85ff<c><b>700<b>§`);
	if(this.defenceValue) text.push(`\nReduce damage: §${this.defenceValue}<c>#ff5454<c>HP<b>700<b>§`);
	if(this.defencePercentage) text.push(`\nDefence: §${this.defencePercentage}<c>#ac75ff<c><b>700<b>§`);

	if(this.meleDmgValue > 0) text.push(`\nMelee damage: §+${this.meleDmgValue} DMG<c>#ffc400<c><b>600<b>§`);
	if(this.meleDmgPercentage > 0) text.push(`\nMelee damage: §+${Math.floor(this.meleDmgPercentage * 100)}%<c>#ffc400<c><b>600<b>§`);
	if(this.rangeDmgValue > 0) text.push(`\nRange damage: §+${this.rangeDmgValue} DMG<c>#ffc400<c><b>600<b>§`);
	if(this.rangeDmgPercentage > 0) text.push(`\nRange damage: §+${Math.floor(this.rangeDmgPercentage * 100)}%<c>#ffc400<c><b>600<b>§`);
	if(this.magicDmgValue > 0) text.push(`\nMagic damage: §+${this.magicDmgValue} DMG<c>#ffc400<c><b>600<b>§`);
	if(this.magicDmgPercentage > 0) text.push(`\nMagic damage: §+${Math.floor(this.magicDmgPercentage * 100)}%<c>#ffc400<c><b>600<b>§`);
	if(this.arrowDmgValue > 0) text.push(`\nArrow damage: §+${this.arrowDmgValue} DMG<c>#ffc400<c><b>600<b>§`);
	if(this.arrowDmgPercentage > 0) text.push(`\nArrow damage: §+${Math.floor(this.arrowDmgPercentage * 100)}%<c>#ffc400<c><b>600<b>§`);
	if(this.meleDmgValue < 0) text.push(`\nMelee damage: §${this.meleDmgValue} DMG<c>#ff5454<c><b>600<b>§`);
	if(this.meleDmgPercentage < 0) text.push(`\nMelee damage: §${Math.floor(this.meleDmgPercentage * 100)}%<c>#ff5454<c><b>600<b>§`);
	if(this.rangeDmgValue < 0) text.push(`\nRange damage: §${this.rangeDmgValue} DMG<c>#ff5454<c><b>600<b>§`);
	if(this.rangeDmgPercentage < 0) text.push(`\nRange damage: §${Math.floor(this.rangeDmgPercentage * 100)}%<c>#ff5454<c><b>600<b>§`);
	if(this.magicDmgValue < 0) text.push(`\nMagic damage: §${this.magicDmgValue} DMG<c>#ff5454<c><b>600<b>§`);
	if(this.magicDmgPercentage < 0) text.push(`\nMagic damage: §${Math.floor(this.magicDmgPercentage * 100)}%<c>#ff5454<c><b>600<b>§`);
	if(this.arrowDmgValue < 0) text.push(`\nArrow damage: §${this.arrowDmgValue} DMG<c>#ff5454<c><b>600<b>§`);
	if(this.arrowDmgPercentage < 0) text.push(`\nArrow damage: §${Math.floor(this.arrowDmgPercentage * 100)}%<c>#ff5454<c><b>600<b>§`);

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