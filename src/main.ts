import { ErrorMapper } from "utils/ErrorMapper";
import { roleBuilder } from "role.builder";
import { roleUpgrader } from "role.upgrader";
import { roleHarvester } from "role.harvester";
import operateSpawn from "spawn";
import "./types";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  const roomName = "W14N37";
  const spawn1 = Game.spawns["Spawn1"];
  const energy = spawn1.room.energyAvailable;

  if (!Memory.tally) {
    Memory.tally = {
      builders: 0,
      harvesters: 0,
      upgraders: 0
    };
  }

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

  operateSpawn(spawn1);

  //console.log(JSON.stringify(Room));
  // console.log(JSON.stringify(Memory));
  // change all creeps roles

  // Set a specific creep's role
  // Game.creeps["Builder9855"].memory.role = "harvester";

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
