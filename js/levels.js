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
			"y": -1868,
			"x": -1613
		}
	},
	"level_2": {
		"enemies": ["red_guy"],
		"cords": {
			"y": -1741,
			"x": -1850
		}
	},
	"level_3": {
		"enemies": ["week_slime", "week_slime", "week_slime"],
		"cords": {
			"y": -1501,
			"x": -1887
		}
	},
	"level_4": {
		"enemies": ["octopus", "red_guy"],
		"cords": {
			"y": -1331,
			"x": -1719
		}
	},
	"level_5": {
		"enemies": ["week_slime", "fish_dude", "week_slime"],
		"cords": {
			"y": -1072,
			"x": -1615
		}
	},
	"level_6": {
		"enemies": ["devil", "fish_dude"],
		"cords": {
			"y": -849,
			"x": -1786
		}
	},
	"level_7": {
		"enemies": ["tongue_monster", "tongue_monster", "devil"],
		"cords": {
			"y": -646,
			"x": -1968
		}
	},
	"Effect test": {
		"enemies": ["filler1"],
		"cords": {
			"y": -400,
			"x": -1968
		}
	}
}