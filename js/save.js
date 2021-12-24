var levels = {
	"level_1": {
		num: 1,
		name: "The beginning",
		enemies: ["weak_skeleton"],
		cords: {y: -933, x: -4167}
	},
	"level_2": {
		num: 2,
		name: "First challenge",
		enemies: ["normal_skeleton"],
		cords: {y: -867, x: -3886}
	},
	"level_3": {
		num: 3,
		name: "More then one?",
		enemies: ["weak_skeleton", "weak_skeleton"],
		cords: {y: -633, x: -4061}
	},
}

var items = {
	"wooden_dagger": {
		id: "wooden_dagger",
		name: "Wooden dagger",
		tags: ["weapon", "dagger"],
		minMeleDmg: 2,
		maxMeleDmg: 3,
		useTime: 1,
		particle: "stab",
		image: "wooden-dagger.png",
	},
	"weak_monster_core": {
		id: "weak_monster_core",
		name: "Weak monster core",
		tags: ["material", "core"],
		image: "weak_monster_core.png",
		amount: 1,
	},
	"sharp_bone": {
		id: "sharp_bone",
		name: "Sharp fractured bone",
		tags: ["material"],
		image: "sharp_bone.png",
		amount: 1,
		craftingRecipes: [
			{
				items: [
					{item: "shattered_bones", amount: 5},
				],
				craftingAmount: 1
			}
		]
	},
	"shattered_bones": {
		id: "shattered_bones",
		name: "Shattered bones",
		tags: ["material"],
		image: "shattered_bone.png",
		amount: 1,
	},
	"bone": {
		id: "bone",
		name: "Bone",
		tags: ["material"],
		image: "bone.png",
		amount: 1,
	},
	"skeleton_skull": {
		id: "skeleton_skull",
		name: "Skeleton skull",
		tags: ["material"],
		image: "skeleton_skull.png",
		amount: 1,
	},
	"skeleton_skull_helmet": {
		id: "skeleton_skull_helmet",
		name: "Skeleton skull helmet",
		tags: ["armor", "helmet"],
		image: "skeleton_skull_helmet.png",
		canEquipTo: "armorhead",
		healthBoostValue: 5,
		craftingRecipes: [
			{
				items: [
					{item: "skeleton_skull", amount: 1},
				],
				craftingAmount: 1
			}
		]
	},
	"bone_sword": {
		id: "bone_sword",
		name: "Bone sword",
		minMeleDmg: 4,
		maxMeleDmg: 5,
		useTime: 1,
		tags: ["weapon", "sword"],
		image: "bone_sword.png",
		craftingRecipes: [
			{
				items: [
					{item: "wooden_dagger", amount: 1},
					{item: "sharp_bone", amount: 3},
					{item: "shattered_bones", amount: 1},
				],
				craftingAmount: 1
			}
		]
	},
	"skeleton_skull_staff": {
		id: "skeleton_skull_staff",
		name: "Skeleton skull staff",
		minMeleDmg: 9,
		maxMeleDmg: 12,
		useTime: 2,
		mana: 10,
		tags: ["weapon", "mana"],
		image: "skeleton_skull_staff.png",
		craftingRecipes: [
			{
				items: [
					{item: "skeleton_skull", amount: 1},
					{item: "weak_monster_core", amount: 1},
					{item: "bone", amount: 1},
					{item: "shattered_bones", amount: 10},
				],
				craftingAmount: 1
			}
		]
	},
	"helmet": {
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
						item: "weak_monster_core",
						amount: 5
					}
				],
				craftingAmount: 1
			}
		]
	},
	"miekka": {
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
	"haarniska": {
		id: "haarniska",
		name: "Helmet",
		tags: ["armor", "chestplate"],
		image: "iron-chestplate.png",
		canEquipTo: "armorchest",
		healthBoostValue: 50,
	},
	"jalat": {
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
		maxHp: 10,
		maxMp: 30,
		img: "weak-skeleton.png",
		items: [
			{...items["wooden_dagger"]},
		],
		drops: [
			{
				"type": "one",
				"chance": 100,
				"items": [
					{"item": items["sharp_bone"], "amount": [1, 3], "chance": 40},
					{"item": items["shattered_bones"],"amount": [2, 5], "chance": 60},
				]
			},
		],
	},
	"normal_skeleton": {
		id: "normal_skeleton",
		maxHp: 20,
		maxMp: 45,
		img: "skeleton.png",
		items: [
			{...items["wooden_dagger"]},
		],
		drops: [
			{
				"type": "one",
				"chance": 90,
				"items": [
					{"item": items["bone"], "amount": [1, 4], "chance": 80},
					{"item": items["skeleton_skull"], "amount": [1], "chance": 20},
				]
			},
			{"item": items["weak_monster_core"], "amount": [1], "chance": 10},
		],
	},
	"strong_skeleton": {
		id: "strong_skeleton",
		maxHp: 31,
		maxMp: 30,
		img: "strong-skeleton.png",
		items: [
			{...items["miekka"]},
		],
	},
};

var player = {
	maxHp: 15,
	maxMp: 25,
	inventory: [
		// {...items["miekka"], slot: "hotbarSlot1"},
		// {...items["miekka"], slot: "hotbarSlot2"},
		{...items["wooden_dagger"], slot: "hotbarSlot1"},
	],
	currentSlot: "hotbarSlot1",
};

function printPlayer() {
	console.log(JSON.stringify(player, (key, value) => {
		if(key === "armor" || key === "hotbar" || key == "totalItemCounts" || key == "effects") return undefined;
		if(key === "inventory") return value.map(({id, slot, amount}) => {
			if(amount == null && slot == null) return `{id: '${id}'}`;
			return `{id: '${id}'${amount != null ? `, amount: ${amount}` : ''}${slot != null ? `, slot: '${slot}'` : ''}}`;
		});
		return value;
	}, "\t"));
}