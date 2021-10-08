function jsonToData(lootTable = []) {
	const items = [];

	lootTable?.forEach(drop => {
		const r = random(1, 100);
		if(r > drop.chance || drop.chance == null) return;
		if(drop?.type == "all") typeAll(drop);
		else if(drop?.type == "one") typeOne(drop);
		else items.push(drop)
	});

	function typeAll(arr) {
		arr.items.forEach(drop => {
			if(drop?.type == "all") typeAll(drop);
			else if(drop?.type == "one") typeOne(drop);
			else items.push(drop);
		});
	}

	function typeOne(arr) {
		const combinedChances = arr.items.map(item => item.chance ?? 0).reduce((acc, v) => [...acc, (acc[acc.length - 1] || 0) + v], []);
		const totalChance = Math.max(...combinedChances);
		const r = random(1, totalChance || 1);
		const index = combinedChances.findIndex(chance => r <= chance);
		const drop = arr.items[index];
		if(drop == null) return;
		else if(drop?.type == "all") typeAll(drop);
		else if(drop?.type == "one") typeOne(drop);
		else items.push(drop);
	}

	return items;
}