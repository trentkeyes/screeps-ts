export default function operateSpawn(spawn: StructureSpawn) {
  const energy = spawn.room.energyAvailable;
  const { harvesters, upgraders, builders, repairers } = Memory.count;
  const total = harvesters + upgraders + builders + repairers;
  console.log("Operating spawn with energy:", energy);
  const small = bodyGenerator([
    { type: WORK, count: 1 },
    { type: CARRY, count: 1 },
    { type: MOVE, count: 2 }
  ]);
  const medium = bodyGenerator([
    { type: WORK, count: 3 },
    { type: CARRY, count: 3 },
    { type: MOVE, count: 6 }
  ]);
  const large = bodyGenerator([
    { type: WORK, count: 4 },
    { type: CARRY, count: 4 },
    { type: MOVE, count: 8 }
  ]);
  const xl = bodyGenerator([
    { type: WORK, count: 6 },
    { type: CARRY, count: 6 },
    { type: MOVE, count: 12 }
  ]);

  // write switch statements
  if (energy >= 250 && harvesters < 3) {
    spawnHarvester(spawn, small);
  }
  if (energy >= 750 && repairers < 2) {
    spawnRepairer(spawn, medium);
  }
  if (total < 18) {
    if (energy >= 1500 && harvesters <= total / 2) {
      spawnHarvester(spawn, xl);
    } else if (energy >= 1500) {
      if (upgraders <= builders) {
        spawnUpgrader(spawn, xl);
      } else if (builders < upgraders) {
        spawnBuilder(spawn, xl);
      }
    }
  }
  // creep spawning plan

  console.log(JSON.stringify(Memory.count));
}

// const spawnActions = ({builders, upgraders, harvesters}) => {
//   // check totals of each role
//   if (builders >= harvesters && upgraders >= harvesters && harvesters < 7) {
//     spawnHarvester(spawn);
//   } else if (harvesters >= builders && upgraders >= builders) {
//     spawnBuilder(spawn);
//   } else {
//     spawnUpgrader(spawn);
//   }
// };

// util function
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const spawnHarvester = (spawn: StructureSpawn, body) => {
  const memory: HarvesterMemory = {
    role: "harvester",
    room: spawn.room.name,
    harvesting: false,
    sourceId: null,
    depositId: null
  };
  const result = spawn.spawnCreep(body, `Harvester${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  if (result === OK) {
    Memory.count.harvesters++;
  }
  console.log("Harvesters in Memory:", Memory.count.harvesters);
  if (result === OK) {
    console.log("Creep successfully spawned harvester.", result);
  } else {
    console.log("Failed to spawn creep.", result);
  }
  return result;
};

const spawnUpgrader = (spawn: StructureSpawn, body: BodyPartConstant[]) => {
  const memory: UpgraderMemory = {
    role: "upgrader",
    room: spawn.room.name,
    upgrading: false,
    sourceId: null,
    depositId: null
  };
  const result = spawn.spawnCreep(body, `Upgrader${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  if (result === OK) {
    Memory.count.upgraders++;
  }
  return result;
};

const spawnBuilder = (spawn: StructureSpawn, body: BodyPartConstant[]) => {
  const memory: BuilderMemory = {
    role: "builder",
    room: spawn.room.name,
    building: false,
    sourceId: null,
    depositId: null
  };
  const result = spawn.spawnCreep(body, `Builder${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  if (result === OK) {
    Memory.count.builders++;
  }
};

const spawnRepairer = (spawn: StructureSpawn, body: BodyPartConstant[]) => {
  const memory: RepairerMemory = {
    role: "repairer",
    room: spawn.room.name,
    repairing: false,
    sourceId: null,
    depositId: null
  };
  const result = spawn.spawnCreep(body, `Repairer${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  if (result === OK) {
    Memory.count.repairers++;
  }
};

const bodyGenerator = (parts: BodyPartConfig[]): BodyPartConstant[] => {
  let body: BodyPartConstant[] = [];
  for (const part of parts) {
    for (let i = 0; i < part.count; i++) {
      body.push(part.type);
    }
  }
  return body;
};

// // make small harvesters if colony is dying
// if (energy >= 250 && harvesters < 3 && total < 6) {
//   spawnHarvester(spawn, small);
// }
// if (energy >= 750 && repairers < 3) {
//   spawnRepairer(spawn, medium);
// }
// // make an even split of medium creeps with 3 roles
// if (energy >= 750 && total < 8) {
//   if (builders >= harvesters && upgraders >= harvesters && harvesters < 7) {
//     spawnHarvester(spawn, medium);
//   } else if (harvesters >= builders && upgraders >= builders) {
//     spawnBuilder(spawn, medium);
//   } else {
//     spawnUpgrader(spawn, medium);
//   }
// }
// // even split of larger creeps
// if (energy >= 1000 && total < 12) {
//   if (builders >= harvesters && upgraders >= harvesters && harvesters < 7) {
//     spawnHarvester(spawn, large);
//   } else if (harvesters >= builders && upgraders >= builders) {
//     spawnBuilder(spawn, large);
//   } else {
//     spawnUpgrader(spawn, large);
//   }
// }
// if (energy >= 1500) {
//   if (builders >= harvesters && upgraders >= harvesters && harvesters < 7) {
//     spawnHarvester(spawn, xl);
//   } else if (harvesters >= builders && upgraders >= builders) {
//     spawnBuilder(spawn, xl);
//   } else {
//     spawnUpgrader(spawn, xl);
//   }
// }
