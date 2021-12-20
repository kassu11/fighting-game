var levels = {
	"The beginning": {
		num: 1,
		enemies: ["weak_skeleton"],
		cords: {y: -1868, x: -1613}
	}
}

var items = {
	helmet: {
		id: "helmet",
		name: "Helmet",
		tags: ["armor", "helmet"],
		image: "helmet.png",
		canEquipTo: "armorhead",
		healthBoostValue: 50,
		craftingRecipes: [
			{
				items: [
					{
						item: "miekka",
						amount: 5
					}
				],
				craftingAmount: 1
			}
		]
	},
	miekka: {
		id: "miekka",
		name: "Wooden sword",
		tags: ["weapon", "sword"],
		minMeleDmg: 12,
		useTime: 2,
		image: "miekka1.png",
		craftingRecipes: [
			{
				items: [
					{
						item: "miekka",
						amount: 1
					}
				],
				craftingAmount: 2
			}
		]
	},
	haarniska: {
		id: "haarniska",
		name: "Helmet",
		tags: ["armor", "chestplate"],
		image: "iron-chestplate.png",
		canEquipTo: "armorchest",
		healthBoostValue: 50,
	},
	jalat: {
		id: "jalat",
		name: "Helmet",
		tags: ["armor", "chestplate"],
		image: "iron-leggins.png",
		canEquipTo: "armorlegs",
		healthBoostValue: 50,
	},
};

var enemies = {
	"weak_skeleton": {
		id: "weak_skeleton",
		maxHp: 31,
		maxMp: 30,
		items: [
			{...items["miekka"]},
		],
		img: "skeleton.png"
	},
};

var player = {
	hp: 25,
	mp: 45,
	maxHp: 25,
	maxMp: 45,
	inventory: [
		{...items["miekka"], slot: "hotbarSlot1"},
		{...items["miekka"], slot: "hotbarSlot2"},
		{id: "helmet"},
		{id: "haarniska"},
		{id: "haarniska"},
		{id: "jalat"},
	],
	currentSlot: "hotbarSlot1",
};

function printPlayer() {
	console.log(JSON.stringify(player, (key, value) => {
		if(key === "armor" || key === "hotbar" || key == "totalItemCounts") return undefined;
		if(key === "inventory") return value.map(({id, slot, amount}) => {
			if(amount == null && slot == null) return `{id: '${id}'}`;
			return `{id: '${id}'${amount != null ? `, amount: ${amount}` : ''}${slot != null ? `, slot: '${slot}'` : ''}}`;
		});
		return value;
	}, "\t"));
}