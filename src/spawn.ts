const roomName = "W14N37";

export default function operateSpawn(spawn) {
  const energy = spawn.room.energyAvailable;
  const roomName = "W14N37";
  const { total, harvesters, upgraders, builders, repairers } = countCreeps();
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
      spawnUpgrader(spawn, xl);
    }
  }

  console.log(JSON.stringify(countCreeps()));
}

const countCreeps = () => {
  let builders = 0;
  let upgraders = 0;
  let harvesters = 0;
  let repairers = 0;
  for (const name in Game.creeps) {
    if (Game.creeps[name].memory.role === "builder") {
      builders++;
    }
    if (Game.creeps[name].memory.role === "upgrader") {
      upgraders++;
    }
    if (Game.creeps[name].memory.role === "harvester") {
      harvesters++;
    }
    if (Game.creeps[name].memory.role === "repairer") {
      repairers++;
    }
    // console.log(`builders: ${builders}, upgraders: ${upgraders}, harvesters: ${harvesters}`);
  }
  const total = builders + upgraders + harvesters + repairers;
  return { builders, upgraders, harvesters, repairers, total };
};

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

const spawnHarvester = (spawn, size) => {
  const memory: HarvesterMemory = {
    role: "harvester",
    room: roomName,
    harvesting: false,
    sourceId: null,
    depositId: null
  };
  const result = spawn.spawnCreep(size, `Harvester${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  console.log("Harvesters in Memory:", Memory.tally.harvesters);
  if (result === OK) {
    console.log("Creep successfully spawned harvester.", result);
  } else {
    console.log("Failed to spawn creep.", result);
  }
  return result;
};

const spawnUpgrader = (spawn, size) => {
  const memory: UpgraderMemory = {
    role: "upgrader",
    room: roomName,
    upgrading: false,
    sourceId: null,
    depositId: null
  };
  spawn.spawnCreep(size, `Upgrader${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  Memory.tally.upgraders++;
};

const spawnBuilder = (spawn, size) => {
  const memory: BuilderMemory = {
    role: "builder",
    room: roomName,
    building: false,
    sourceId: null,
    depositId: null
  };
  spawn.spawnCreep(size, `Builder${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  Memory.tally.builders++;
};

const spawnRepairer = (spawn, size) => {
  const memory: RepairerMemory = {
    role: "repairer",
    room: roomName,
    repairing: false,
    sourceId: null,
    depositId: null
  };
  spawn.spawnCreep(size, `Repairer${Game.time}-${getRandomInt(1000)}`, {
    memory
  });
  Memory.tally.builders++;
};

const bodyGenerator = (parts: BodyPartConfig[]): BodyPartConstant[] => {
  const body: BodyPartConstant[] = [];
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
