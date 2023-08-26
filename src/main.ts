import { ErrorMapper } from "utils/ErrorMapper";
import { roleBuilder } from "role.builder";
import { roleUpgrader } from "role.upgrader";
import { roleHarvester } from "role.harvester";
import operateSpawn from "spawn";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  interface MyCreepMemory extends CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  const roomName = "W14N37";

  // var tower = Game.getObjectById('4bbd46dea9dc677e8ba64954');
  // if (tower) {
  //   var closestDamagedStructure = tower.pos.findClosestByRange(
  //     FIND_STRUCTURES,
  //     {
  //       filter: (structure) => structure.hits < structure.hitsMax,
  //     }
  //   );
  //   if (closestDamagedStructure) {
  //     tower.repair(closestDamagedStructure);
  //   }

  //   var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  //   if (closestHostile) {
  //     tower.attack(closestHostile);
  //   }
  // }

  function defendRoom(roomName: string) {
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0) {
      var username = hostiles[0].owner.username;
      Game.notify(`User ${username} spotted in room ${roomName}`);
      var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
      }) as StructureTower[];

      towers.forEach(tower => tower.attack(hostiles[0]));
    }
  }

  operateSpawn();

  //console.log(JSON.stringify(Room));
  // console.log(JSON.stringify(Memory));
  // change all creeps roles
  // for (name in Game.creeps) {
  //   Game.creeps[name].memory.role = 'harvester';
  // }

  // Set a specific creep's role
  //Game.creeps['Creep7873'].memory.role = 'harvester';

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
  }

  // var energyAvailable = 0;
  // energyAvailable += Game.spawns.Spawn1.energy;
  // _.filter(Game.structures, function (structure) {
  //   if (structure.structureType == STRUCTURE_EXTENSION) {
  //     energyAvailable += structure.energy;
  //   }
  // });

  // Shows energy available to Spawn1 plus extensions
  // console.log('Available energy:', energyAvailable);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
