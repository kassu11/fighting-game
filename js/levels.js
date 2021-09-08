const currentLevel = {
	id: "",
	enemies: new Map(),
	roundNum: 1,
	enemyRounds: 0,
	drops: []
}

const levels = {
	"level_1": {
		"enemies": ["week_slime"],
		"cords": {
			"y": -3982,
			"x": -3242
		}
	},
	"level_2": {
		"enemies": ["red_guy"],
		"cords": {
			"y": -3819,
			"x": -3437
		}
	},
	"level_3": {
		"enemies": ["week_slime", "week_slime", "week_slime"],
		"cords": {
			"y": -3655,
			"x": -3602
		}
	},
	"level_4": {
		"enemies": ["octopus", "red_guy"],
		"cords": {
			"y": -3284,
			"x": -3536
		}
	},
	"level_5": {
		"enemies": ["week_slime", "fish_dude", "week_slime"],
		"cords": {
			"y": -2903,
			"x": -3576
		}
	},
	"level_6": {
		"enemies": ["devil", "fish_dude"],
		"cords": {
			"y": -2606,
			"x": -3713
		}
	},
	"level_7": {
		"enemies": ["tongue_monster", "tongue_monster", "devil"],
		"cords": {
			"y": -2445,
			"x": -3829
		}
	}
}