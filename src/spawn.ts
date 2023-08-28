const roomName = "W14N37";

export default function operateSpawn(spawn) {
  const energy = spawn.room.energyAvailable;
  const roomName = "W14N37";
  console.log("Spawn1 Energy Available:", energy);
  if (energy >= 750) {
    console.log("energy is greater or equal to 750");
    let builders = 0;
    let upgraders = 0;
    let harvesters = 0;
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
      // console.log(`builders: ${builders}, upgraders: ${upgraders}, harvesters: ${harvesters}`);
    }
    if (builders >= harvesters && upgraders >= harvesters && harvesters < 7) {
      spawnHarvester(spawn);
    } else if (harvesters >= builders && upgraders >= builders) {
      spawnBuilder(spawn);
    } else {
      spawnUpgrader(spawn);
    }
  }
}

const spawnActions = () => {
  // check totals of each role
};

// util function
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const spawnHarvester = spawn => {
  const body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
  const memory: HarvesterMemory = {
    role: "harvester",
    room: roomName,
    harvesting: false
  };
  const result = spawn.spawnCreep(body, `Harvester${getRandomInt(10000)}`, {
    memory
  });
  console.log("Harvesters in Memory:", Memory.tally.harvesters);
  if (result === OK) {
    console.log("Creep successfully spawned harvester.", result);
  } else {
    console.log("Failed to spawn creep.", result);
  }
};

const spawnUpgrader = spawn => {
  const body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
  const memory: UpgraderMemory = {
    role: "upgrader",
    room: roomName,
    upgrading: false
  };
  spawn.spawnCreep(body, `Upgrader${getRandomInt(10000)}`, {
    memory
  });
  Memory.tally.upgraders++;
};

const spawnBuilder = spawn => {
  const body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
  const memory: BuilderMemory = {
    role: "builder",
    room: roomName,
    building: false
  };
  spawn.spawnCreep(body, `Builder${getRandomInt(10000)}`, {
    memory
  });
  Memory.tally.builders++;
};
