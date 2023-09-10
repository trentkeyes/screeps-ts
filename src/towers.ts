const operateTowers = (room: Room) => {
  const attackHostileCreeps = (tower: StructureTower) => {
    const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      const username = hostiles[0].owner.username;
      Game.notify(`User ${username} spotted in room ${room.name}`);
      const target = hostiles[0];
      tower.attack(target);
    }
  };

  const healDamagedCreeps = (tower: StructureTower) => {
    const damagedCreeps = tower.room.find(FIND_CREEPS, {
      filter: creep => {
        return creep.hits < creep.hitsMax;
      }
    });
    damagedCreeps.forEach(creep => {
      tower.heal(creep);
    });
  };

  const myTowers = room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_TOWER }
  });
  myTowers.forEach(tower => {
    attackHostileCreeps(tower as StructureTower);
    healDamagedCreeps(tower as StructureTower);
  });
};

export default operateTowers;
