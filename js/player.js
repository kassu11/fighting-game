let player = new Player({
	hp: 25,
	mp: 45,
	maxHp: 25,
	maxMp: 45,
	inventory: [
		{...items["weak_stick"], slot: "hotbarSlot1"},
		{...items["stone_sword"], slot: "hotbarSlot2"},
		{...items["bow"], slot: "hotbarSlot3"},
		{...items["arrow"], slot: "hotbarSlot5"},
		{...items["suicideStick"]},
		{...items["suicideStick"]},
		{...items["suicideStick"]},
		{...items["chestplate2"]},
		{...items["leatherLeggins"]},
		{...items["suicideStick"]},
		{...items["suicideStick"]},
		{...items["suicideStick"]},
		{...items["suicideStick"]},
		{...items["dmgBooster"], slot: "hotbarSlot4", amount: 100},
		{...items["iron"], amount: 50},
		{...items["helmet"]},
		{...items["helmet"]},
		{...items["helmet"]},
		{...items["helmet"]},
		{...items["helmet"]},
		{...items["helmet"]},
		{...items["helmet"]},
		{...items["helmet"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["chestplate"]},
		{...items["legs"]},
		{...items["legs"]},
		{...items["legs"]},
		{...items["legs"]},
		{...items["legs"]},
		{...items["legs"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["weak_stick"]},
		{...items["hp_pot"], amount: 69},
		// {id: "dmgBooster", slot: "hotbarSlot5"},
	],
	currentSlot: "slot1",
	effects: [
		{id: "Poison", power: 1, duration: 4}
	],
	armor: {
		head: {},
		chest: {},
		legs: {},
	}
});


function Player(arr) {
	this.hp = arr.hp;
	this.mp = arr.mp;
	this.maxHp = arr.maxHp;
	this.maxHpF = () => {
		const extra = Object.values(this.armor).reduce((a, b) => a + (b?.healthBoostValue ?? 0), 0) || 0;
		return this.maxHp + extra;
	}

	this.calcDefenceValue = () => Object.values(this.armor).reduce((a, b) => a + (b?.defenceValue ?? 0), 0) || 0;
	this.calcDefencePercentage = () => {
		const total = Object.values(this.armor).reduce((a, b) => a + (b?.defencePercentage ?? 0), 0) || 0;
		return (100 - total) / 100;
	}
	
	this.maxMp = arr.maxMp;

	this.currentSlot = arr.currentSlot;

	this.effects = arr.effects?.map(effect => new Effect(effect)) || [];

	this.hotbar = {
		"slot1": {},
		"slot2": {},
		"slot3": {},
		"slot4": {},
		"slot5": {}
	};

	this.armor = {
		head: {},
		chest: {},
		legs: {},
	}

	for(const [slot, item] of Object.entries(arr?.armor ?? {})) {
		if(item?.id) this.armor[slot] = new Item(item); 
	}
	

	this.inventory = arr.inventory?.map(item => {
		const nItem = new Item(item, this);
		const slot = nItem.slot ?? "";
		if(slot.startsWith("hotbarSlot")) this.hotbar["slot" + slot.substr(10)] = nItem;
		return nItem;
	}) ?? [];

	this.totalItemCounts = arr.inventory.reduce((ac, item) => {
		ac[item.id] ??= 0;
		ac[item.id] += (item.amount ?? 1);
		return ac;
	}, {});

	this.giveItem = itemData => {
		const item = new Item(itemData);
		const index = itemStackIndex(this.inventory, item);
		if(index == -1) this.inventory.push(item);
		else this.inventory[index].amount += item.amount;

		this.totalItemCounts[item.id] ??= 0;
		this.totalItemCounts[item.id] += item.amount ?? 1;
	}

	this.takeItem = (index, amount = 1) => {
		const item = this.inventory[index];
		if(!item) return;
		if(item.amount) item.amount -= amount;
		if(!item.amount || item.amount <= 0) {
			if(item.slot?.startsWith("hotbarSlot")) this.hotbar[`slot${item.slot.substr(10)}`] = {};
			else if(item.slot === "headSlot") this.armor.head = {}
			else if(item.slot === "chestSlot") this.armor.chest = {}
			else if(item.slot === "legsSlot") this.armor.legs = {}
			this.inventory.splice(index, 1);
		}

		this.totalItemCounts[item.id] = Math.max(this.totalItemCounts[item.id] - (amount ?? 1), 0);
	}
}

Player.prototype.effect = effect;