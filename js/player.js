if(typeof player !== "undefined") var player = new Player(player);
else var player = new Player({
	hp: 25,
	mp: 45,
	maxHp: 25,
	maxMp: 45,
	inventory: [
		{...items["filler1"], slot: "hotbarSlot1"},
		{...items["wooden_sword"], slot: "hotbarSlot2"},
		{...items["bow"], slot: "hotbarSlot3"},
		{...items["hp_pot"], slot: "hotbarSlot5"},
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
		// {...items["chestplate"]},
		// {...items["chestplate"]},
		// {...items["chestplate"]},
		// {...items["chestplate"]},
		// {...items["chestplate"]},
		// {...items["legs"]},
		// {...items["legs"]},
		// {...items["legs"]},
		// {...items["legs"]},
		// {...items["legs"]},
		// {...items["legs"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["weak_stick"]},
		// {...items["hp_pot"], amount: 69},
		// {id: "dmgBooster", slot: "hotbarSlot5"},
	],
	currentSlot: "slot1",
	effects: [
		{id: "Poison", power: 1, duration: 4}
	],
	armor: {
		head: {},
		// chest: {...items["chestplate2"]},
		chest: {},
		legs: {},
	}
});


function Player(arr) {
	this.hp = arr.hp;
	this.mp = arr.mp;
	this.maxHp = arr.maxHp;
	this.debug = true;
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
	this.maxMpF = () => {
		const extra = Object.values(this.armor).reduce((a, b) => a + (b?.manaBoostValue ?? 0), 0) || 0;
		return this.maxMp + extra;
	}

	this.currentSlot = arr.currentSlot;

	this.effects = arr.effects?.map(effect => new Effect(effect)) || [];

	this.hotbar = {
		"hotbarSlot1": {},
		"hotbarSlot2": {},
		"hotbarSlot3": {},
		"hotbarSlot4": {},
		"hotbarSlot5": {}
	};

	this.armor = {
		armorhead: {},
		armorchest: {},
		armorlegs: {},
	}

	this.inventory = arr.inventory?.map(item => {
		const nItem = new Item(item, this);
		const slot = nItem.slot ?? "";
		if(slot) {
			if(slot.startsWith("hotbarSlot")) this.hotbar[slot] = nItem;
			else if(slot.startsWith("armor")) this.armor[slot] = nItem;
		}
		return nItem;
	}) ?? [];

	this.totalItemCounts = arr.inventory.reduce((ac, item) => {
		ac[item.id] ??= 0;
		ac[item.id] += (item.amount ?? 1);
		return ac;
	}, {});

	this.giveItem = ({amount, ...itemData}) => {
		const item = new Item(itemData);
		const index = itemStackIndex(this.inventory, item);
		if(!item.amount && amount) {
			for(let i = 1; i < amount; i++) this.inventory.push(new Item(itemData));
		} else item.amount = amount;

		if(index == -1) this.inventory.push(item);
		else this.inventory[index].amount += item.amount;

		this.totalItemCounts[item.id] ??= 0;
		this.totalItemCounts[item.id] += amount ?? item.amount ?? 1;
	}

	this.takeItem = (index, amount = 1) => {
		const item = this.inventory[index];
		if(!item) return;
		if(item.amount) item.amount -= amount;
		if(!item.amount || item.amount <= 0) {
			if(item.slot?.startsWith("hotbarSlot")) this.hotbar[item.slot] = {};
			else if(item.slot?.startsWith("armor")) this.armor[item.slot] = {};
			this.inventory.splice(index, 1);
		}

		this.totalItemCounts[item.id] = Math.max(this.totalItemCounts[item.id] - (amount ?? 1), 0);
		if(this.totalItemCounts[item.id] === 0) delete this.totalItemCounts[item.id];
	}
}

Player.prototype.effect = effect;




// {
// 	"lisaaTavaroita": {
// 		"tavaraID": {

// 		}
// 	},
// 	"VähemmänTavaroita": {

// 	}
// }