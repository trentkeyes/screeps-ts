const roomName = "W14N37";
const spawn1 = Game.spawns["Spawn1"];
const energy = spawn1.room.energyAvailable;

console.log("Spawn1 Energy Available:", spawn1.room.energyAvailable);

export default function operateSpawn() {
  if (energy >= 800) {
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
    if (builders >= upgraders && harvesters >= upgraders) {
      spawnUpgrader();
    } else if (harvesters >= builders && upgraders >= builders) {
      spawnBuilder();
    } else {
      spawnHarvester();
    }
  }
}

// util function
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const spawnHarvester = () => {
  spawn1.spawnCreep(
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    `Harvester${getRandomInt(10000)}`,
    {
      memory: { role: "harvester", room: roomName, working: false }
    }
  );
};

const spawnUpgrader = () => {
  spawn1.spawnCreep(
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    `Upgrader${getRandomInt(10000)}`,
    {
      memory: { role: "upgrader", room: roomName, working: false }
    }
  );
};

const spawnBuilder = () => {
  spawn1.spawnCreep(
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    `Builder${getRandomInt(10000)}`,
    {
      memory: { role: "builder", room: roomName, working: false }
    }
  );
};
