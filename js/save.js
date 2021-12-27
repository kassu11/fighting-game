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
		tags: ["weapon", "dagger"],
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
	"skeleton_skull_staff": {
		id: "skeleton_skull_staff",
		name: "Skeleton skull staff",
		minMagicDmg: 9,
		maxMagicDmg: 12,
		useTime: 2,
		particle: "boneExplosion",
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
		bulletRotate: 50,
		isNotUsable: true,
		minRangeDmg: 3,
		animationDelay: 200,
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
		"cords": {"y": -867, "x": -3886}
	},
	"level_3": {
		"num": 3,
		"name": "More then one?",
		"enemies": ["weak_skeleton", "weak_skeleton"],
		"cords": {"y": -633, "x": -4061},
		"drops": [
			{"item": items["rope"], "amount": [1, 3], "chance": 100}
		]
	},
	"level_4": {
		"num": 4,
		"name": "Level 4",
		"enemies": ["normal_skeleton", "weak_skeleton"],
		"cords": {"y": -567, "x": -3822},
		"drops": [
			{"item": items["leather"], "amount": [3, 6], "chance": 60},
			{"item": items["wood"], "amount": [2, 4], "chance": 60}
		]
	},
	"level_5": {
		"num": 5,
		"name": "Level 5",
		"enemies": ["strong_skeleton"],
		"cords": {"y": -360, "x": -4036},
		"drops": [
			{"item": items["leather"], "amount": [1, 2], "chance": 80},
			{"item": items["wood"], "amount": [3, 5], "chance": 70},
			{"item": items["rope"], "amount": [2, 3], "chance": 50}
		]
	},
	"level_6": {
		"num": 6,
		"name": "Level 6",
		"enemies": ["strong_skeleton"],
		"cords": {"y": -298, "x": -3720},
		"drops": [
			{"item": items["leather"], "amount": [1, 2], "chance": 80},
			{"item": items["wood"], "amount": [3, 5], "chance": 70},
			{"item": items["rope"], "amount": [2, 3], "chance": 50}
		]
	}
}

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
					{"item": items["bone"], "amount": [2, 4], "chance": 100},
					{"item": items["skeleton_skull"], "amount": [1], "chance": 20}
				]
			},
			{"item": items["common_monster_core"], "amount": [1], "chance": 30}
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