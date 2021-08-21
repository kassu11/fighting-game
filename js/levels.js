const currentLevel = {
  id: "",
  enemies: new Map(),
  roundNum: 1,
  enemyRounds: 0,
  drops: []
}

const levels = {
  level_1: {
    enemies: ["week_slime"]
  },
  level_2: {
    enemies: ["red_guy"]
  },
  level_3: {
    enemies: ["week_slime", "week_slime", "week_slime"]
  },
  level_4: {
    enemies: ["octopus", "red_guy"]
  },
  level_5: {
    enemies: ["week_slime", "fish_dude", "week_slime"]
  },
  level_6: {
    enemies: ["devil", "fish_dude"]
  },
  level_7: {
    enemies: ["tongue_monster", "tongue_monster", "devil"]
  },
}
