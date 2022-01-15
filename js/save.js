var items = {
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
	"wooden_dagger": {
		id: "wooden_dagger",
		name: "Wooden dagger",
		tags: ["weapon", "dagger", "material"],
		minMeleDmg: 2,
		maxMeleDmg: 3,
		useTime: 1,
		particle: "stab",
		image: "wooden-dagger.png",
		craftingRecipes: [
			{
				items: [
					{item: "wood", amount: 7},
					{item: "rope", amount: 2},
				],
				craftingAmount: 1
			}
		]
	},
	"weak_monster_core": {
		id: "weak_monster_core",
		name: "Weak monster core",
		tags: ["material", "core"],
		canEquipTo: "none",
		image: "weak_monster_core.png",
		amount: 1,
	},
	"sharp_bone": {
		id: "sharp_bone",
		name: "Sharp fractured bone",
		tags: ["material"],
		canEquipTo: "none",
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
		canEquipTo: "none",
		image: "shattered_bone.png",
		amount: 1,
	},
	"bone": {
		id: "bone",
		name: "Bone",
		tags: ["material"],
		canEquipTo: "none",
		image: "bone.png",
		amount: 1,
	},
	"skeleton_skull": {
		id: "skeleton_skull",
		name: "Skeleton skull",
		tags: ["material"],
		canEquipTo: "none",
		image: "skeleton_skull.png",
		amount: 1,
	},
	"skeleton_skull_helmet": {
		id: "skeleton_skull_helmet",
		name: "Skeleton skull helmet",
		tags: ["armor", "helmet", "material"],
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
	"skeleton_skull_staff": {
		id: "skeleton_skull_staff",
		name: "Skeleton skull staff",
		minMagicDmg: 9,
		maxMagicDmg: 12,
		useTime: 2,
		particle: "boneExplosion",
		mana: 10,
		tags: ["weapon", "mana", "material"],
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
	"rope": {
		id: "rope",
		name: "Rope",
		amount: 1,
		canEquipTo: "none",
		tags: ["material"],
		image: "rope.png",
	},
	"bone_bow": {
		id: "bone_bow",
		name: "Bone bow",
		useAmmoType: "arrow",
		tags: ["weapon", "bow"],
		image: "bone_bow.png",
		useTime: 2,
		minRangeDmg: 6,
		maxRangeDmg: 7,
		animationDelay: 200,
		craftingRecipes: [
			{
				items: [
					{item: "rope", amount: 10},
					{item: "bone", amount: 3},
					{item: "shattered_bones", amount: 2},
				],
				craftingAmount: 1
			}
		]
	},
	"bone_arrow": {
		id: "bone_arrow",
		name: "Bone arrow",
		ammoType: "arrow",
		tags: ["ammo", "arrow"],
		image: "bone_arrow.png",
		amount: 1,
		bulletRotate: 45,
		isNotUsable: true,
		minArrowDmg: 3,
		craftingRecipes: [
			{
				items: [
					{item: "sharp_bone", amount: 3},
				],
				craftingAmount: 4
			},
			{
				items: [
					{item: "bone", amount: 2},
				],
				craftingAmount: 5
			},
		]
	},
	"leather": {
		id: "leather",
		name: "Leather",
		tags: ["material"],
		canEquipTo: "none",
		image: "leather.png",
		amount: 1,
	},
	"wood": {
		id: "wood",
		name: "Wood",
		tags: ["material"],
		canEquipTo: "none",
		image: "wood.png",
		amount: 1,
	},
	"lether_helmet": {
		id: "lether_helmet",
		name: "Leather helmet",
		tags: ["armor", "helmet"],
		image: "lether_helmet.png",
		canEquipTo: "armorhead",
		armorSet: "leatherArmor",
		healthBoostValue: 6,
		meleDmgValue: 2,
		craftingRecipes: [
			{
				items: [
					{item: "sharp_bone", amount: 2},
					{item: "leather", amount: 6},
					{item: "rope", amount: 3},
				],
				craftingAmount: 1
			}
		]
	},
	"lether_chest_plate": {
		id: "lether_chest_plate",
		name: "Leather chestplate",
		tags: ["armor", "chestplate"],
		image: "lether_chest_plate.png",
		canEquipTo: "armorchest",
		healthBoostValue: 10,
		armorSet: "leatherArmor",
		craftingRecipes: [
			{
				items: [
					{item: "leather", amount: 10},
					{item: "rope", amount: 7},
				],
				craftingAmount: 1
			}
		]
	},
	"leather_pants": {
		id: "leather_pants",
		name: "Leather pants",
		tags: ["armor", "legs"],
		image: "leather_pants.png",
		canEquipTo: "armorlegs",
		healthBoostValue: 10,
		armorSet: "leatherArmor",
		craftingRecipes: [
			{
				items: [
					{item: "leather", amount: 8},
					{item: "rope", amount: 5},
				],
				craftingAmount: 1
			}
		]
	},
	"common_monster_core": {
		id: "common_monster_core",
		name: "Common monster core",
		tags: ["material", "core"],
		canEquipTo: "none",
		image: "common_monster_core.png",
		amount: 1,
	},
	"wooden_bow": {
		id: "wooden_bow",
		name: "Wooden bow",
		useAmmoType: "arrow",
		tags: ["weapon", "bow"],
		image: "bow.png",
		useTime: 1,
		minRangeDmg: 5,
		maxRangeDmg: 6,
		animationDelay: 200,
		craftingRecipes: [
			{
				items: [
					{item: "rope", amount: 2},
					{item: "wood", amount: 5},
				],
				craftingAmount: 1
			}
		]
	},
	"powerful_skeleton_skull_staff": {
		id: "powerful_skeleton_skull_staff",
		name: "Powerful skeleton skull staff",
		minMagicDmg: 12,
		maxMagicDmg: 15,
		useTime: 1,
		particle: "boneExplosion",
		mana: 20,
		tags: ["weapon", "mana"],
		image: "skeleton_skull_staff_2.png",
		craftingRecipes: [
			{
				items: [
					{item: "skeleton_skull", amount: 1},
					{item: "skeleton_skull_staff", amount: 1},
					{item: "rope", amount: 2},
					{item: "common_monster_core", amount: 2},
				],
				craftingAmount: 1
			}
		]
	},
	"weak_core_dagger": {
		id: "weak_core_dagger",
		name: "weak core dagger",
		minMeleDmg: 8,
		maxMeleDmg: 11,
		useTime: 1,
		particle: "stab",
		tags: ["weapon", "dagger"],
		image: "weak_core_dagger.png",
		craftingRecipes: [
			{
				items: [
					{item: "weak_monster_core", amount: 2},
					{item: "wood", amount: 5},
					{item: "rope", amount: 1},
					{item: "leather", amount: 1},
				],
				craftingAmount: 1
			}
		]
	},
	"low_tier_healing_potion": {
		id: "low_tier_healing_potion",
		name: "Low tier healing potion",
		useTime: 1,
		healV: 10,
		mana: 10,
		amount: 5,
		needTarget: false,
		tags: ["consumable", "material", "healing"],
		image: "low_tier_hp_pot.png",
		craftingRecipes: [
			{
				items: [
					{item: "life_essence", amount: 3},
				],
				craftingAmount: 1
			},
			{
				items: [
					{item: "life_essence", amount: 5},
				],
				craftingAmount: 2
			},
			{
				items: [
					{item: "life_essence", amount: 10},
				],
				craftingAmount: 5
			},
		]
	},
	"lowest_tier_potion": {
		id: "lowest_tier_potion",
		name: "Lowest tier healing potion",
		useTime: 1,
		healV: 7,
		mana: 5,
		amount: 5,
		needTarget: false,
		tags: ["consumable", "healing"],
		image: "lowest_tier_potion.png",
		craftingRecipes: [
			{
				items: [
					{item: "low_tier_healing_potion", amount: 3},
					{item: "slime_ball", amount: 2},
				],
				craftingAmount: 5
			}
		]
	},
	"life_essence": {
		id: "life_essence",
		name: "Life essence",
		amount: 1,
		tags: ["material"],
		image: "life_essence.png",
	},
	"magical_bone_tiara": {
		id: "magical_bone_tiara",
		name: "Magical bone tiara",
		tags: ["armor", "helmet"],
		image: "magical_bone_tiara.png",
		canEquipTo: "armorhead",
		healthBoostValue: 3,
		manaBoostValue: 25,
		magicDmgValue: 3,
		craftingRecipes: [
			{
				items: [
					{item: "skeleton_skull_helmet", amount: 1},
					{item: "common_monster_core", amount: 2},
				],
				craftingAmount: 1
			}
		]
	},
	"slime_ball": {
		id: "slime_ball",
		name: "Slime ball",
		amount: 1,
		tags: ["material"],
		image: "slime_ball.png",
	},
	"glass": {
		id: "glass",
		name: "Glass",
		amount: 1,
		tags: ["material"],
		image: "glass.png",
	},
	"goblin_meat": {
		id: "goblin_meat",
		name: "Goblin meat",
		useTime: 1,
		healV: 5,
		amount: 5,
		needTarget: false,
		tags: ["consumable", "healing"],
		image: "goblin_meat_v2.png",
		selfEffect: [
			{id: "Regeneration", power: 1, duration: 3, effectStatus: "good"},
		],
	},
};

var levels = {
	"level_1": {
		"num": 1,
		"name": "The beginning",
		"enemies": ["weak_skeleton"],
		"cords": {"y": -933, "x": -4167}
	},
	"level_2": {
		"num": 2,
		"name": "First challenge",
		"enemies": ["normal_skeleton"],
		"cords": {"y": -914, "x": -3867}
	},
	"level_3": {
		"num": 3,
		"name": "More than one?",
		"enemies": ["weak_skeleton", "weak_skeleton"],
		"cords": {"y": -730, "x": -3660},
		"drops": [
			{"item": items["rope"], "amount": [1, 3], "chance": 100}
		]
	},
	"level_4": {
		"num": 4,
		"name": "Level 4",
		"enemies": ["normal_skeleton", "weak_skeleton"],
		"cords": {"y": -652, "x": -3907},
		"drops": [
			{"item": items["leather"], "amount": [3, 6], "chance": 60},
			{"item": items["wood"], "amount": [2, 4], "chance": 60}
		]
	},
	"level_5": {
		"num": 5,
		"name": "Level 5",
		"enemies": ["strong_skeleton"],
		"cords": {"y": -649, "x": -4157},
		"drops": [
			{"item": items["leather"], "amount": [1, 2], "chance": 80},
			{"item": items["wood"], "amount": [3, 5], "chance": 70},
			{"item": items["rope"], "amount": [2, 3], "chance": 50}
		]
	},
	"level_6": {
		"num": 6,
		"name": "Level 6",
		"enemies": ["slime", "slime"],
		"cords": {"y": -403, "x": -4258}
	},
	"level_7": {
		"num": 7,
		"name": "Level 7",
		"enemies": ["goblin", "slime"],
		"cords": {"y": -384, "x": -3939}
	},
	"level_8": {
		"num": 8,
		"name": "Level 8",
		"enemies": ["normal_skeleton", "strong_skeleton", "normal_skeleton"],
		"cords": {"y": -104, "x": -3912},
		"drops": [
			{"item": items["glass"], "amount": [1, 2], "chance": 80},
		]
	},
	"level_9": {
		"num": 9,
		"name": "Level 9",
		"enemies": ["strong_skeleton", "goblin"],
		"cords": {"y": -325, "x": -3682}
	},
	// "level_10": {
	// 	"num": 10,
	// 	"name": "Level 10",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": -523, "x": -3500}
	// },
	// "level_11": {
	// 	"num": 11,
	// 	"name": "Level 11",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": -338, "x": -3221}
	// },
	// "level_12": {
	// 	"num": 12,
	// 	"name": "Level 12",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": -160, "x": -3349}
	// },
	// "level_13": {
	// 	"num": 13,
	// 	"name": "Level 13",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": -474, "x": -3039}
	// },
	// "level_14": {
	// 	"num": 14,
	// 	"name": "Level 14",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": -629, "x": -2845}
	// },
	// "level_15": {
	// 	"num": 15,
	// 	"name": "Level 15",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": 18, "x": -3479}
	// },
	// "level_16": {
	// 	"num": 16,
	// 	"name": "Level 16",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": -69, "x": -4167}
	// },
	// "level_17": {
	// 	"num": 17,
	// 	"name": "Level 17",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": 234, "x": -4082}
	// },
	// "level_18": {
	// 	"num": 18,
	// 	"name": "Level 18",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": 410, "x": -3914}
	// },
	// "level_19": {
	// 	"num": 19,
	// 	"name": "Level 19",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": 402, "x": -3588}
	// },
	// "level_20": {
	// 	"num": 20,
	// 	"name": "Level 20",
	// 	"enemies": ["weak_skeleton"],
	// 	"cords": {"y": 300, "x": -3296}
	// }
}

var enemies = {
	"weak_skeleton": {
		id: "weak_skeleton",
		name: "Weak skeleton",
		maxHp: 10,
		maxMp: 10,
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
		name: "Normal skeleton",
		maxHp: 20,
		maxMp: 15,
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
		name: "Strong skeleton",
		maxHp: 31,
		maxMp: 20,
		img: "strong-skeleton.png",
		items: [
			{...items["skeleton_skull_staff"]},
			{...items["bone_sword"]},
		],
		drops: [
			{
				"type": "one",
				"chance": 90,
				"items": [
					{"item": items["bone"], "amount": [2, 4], "chance": 80},
					{"item": items["skeleton_skull"], "amount": [1], "chance": 20}
				]
			},
			{"item": items["common_monster_core"], "amount": [1], "chance": 30}
		]
	},
	"slime": {
		id: "slime",
		name: "Slime",
		maxHp: 20,
		maxMp: 20,
		img: "slime.png",
		items: [
			{...items["low_tier_healing_potion"]},
			{...items["bone_sword"]},
		],
		drops: [
			{"item": items["life_essence"], "amount": [1, 3], "chance": 75},
			{"item": items["slime_ball"], "amount": [1, 2], "chance": 50},
			{"item": items["low_tier_healing_potion"], "amount": [1, 2], "chance": 20}
		]
	},
	"goblin": {
		id: "goblin",
		name: "Goblin",
		maxHp: 30,
		maxMp: 20,
		img: "virgin_goblin.png",
		items: [
			{...items["bone_bow"]},
			{...items["bone_arrow"], amount: 5},
			{...items["wooden_dagger"]},
			{...items["low_tier_healing_potion"], amount: 1},
		],
		drops: [
			{"item": items["life_essence"], "amount": [3, 5], "chance": 100},
			{"item": items["common_monster_core"], "amount": [1], "chance": 30},
			{"item": items["goblin_meat"], "amount": [1, 2], "chance": 45}
		]
	},
};

var player = {
	maxHp: 15,
	maxMp: 25,
	inventory: [
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
	}, "\t").replaceAll(`'`, `"`).replaceAll(`"§"`, ""));
}