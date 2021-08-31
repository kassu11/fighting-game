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
      "x": 5645,
      "y": 858
    }
  },
  "level_2": {
    "enemies": ["red_guy"],
    "cords": {
      "x": 5416,
      "y": 883
    }
  },
  "level_3": {
    "enemies": ["week_slime", "week_slime", "week_slime"],
    "cords": {
      "x": 5282,
      "y": 985
    }
  },
  "level_4": {
    "enemies": ["octopus", "red_guy"],
    "cords": {
      "x": 5432,
      "y": 1097
    }
  },
  "level_5": {
    "enemies": ["week_slime", "fish_dude", "week_slime"],
    "cords": {
      "x": 5549,
      "y": 1158
    }
  },
  "level_6": {
    "enemies": ["devil", "fish_dude"],
    "cords": {
      "x": 5458,
      "y": 1211
    }
  },
  "level_7": {
    "enemies": ["tongue_monster", "tongue_monster", "devil"],
    "cords": {
      "x": 5334,
      "y": 1341
    }
  }
}