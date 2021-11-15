// const vihu1 = new Player(player);
// const vihu2 = new TestiVihu(player);

// Player.prototype.test1 = function() {
// 	console.log("Test 1")
// }

// function TestiVihu(arr) {
// 	Player.call(this, arr)
// 	this.hp = "RUN";
// }

// Object.setPrototypeOf(TestiVihu.prototype, Player.prototype);
// console.log(vihu1)
// console.log(vihu2)

function LitePlayer(arr) {
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
	this.effects = arr.effects?.map(effect => new Effect(effect)) || [];

	this.hotbar = {};
	for(const [slot, item] of Object.entries(arr?.hotbar ?? {})) {
		if(item?.id) this.hotbar[slot] = new Item(item, this); 
	}

	this.armor = arr.armor;
	this.totalItemCounts = arr.totalItemCounts;
}

Object.setPrototypeOf(LitePlayer.prototype, Player.prototype);