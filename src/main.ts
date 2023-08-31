import { ErrorMapper } from "utils/ErrorMapper";
import { roleBuilder } from "role.builder";
import { roleUpgrader } from "role.upgrader";
import { roleHarvester } from "role.harvester";
import { roleRepairer } from "role.repairer";
import operateSpawn from "spawn";
import "./types";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  const roomName = "W14N37";
  const spawn1 = Game.spawns["Spawn1"];
  const energy = spawn1.room.energyAvailable;
  const room = Game.rooms[roomName];

  if (!Memory.tally) {
    Memory.tally = {
      builders: 0,
      harvesters: 0,
      upgraders: 0
    };
  }

  function attackHostileCreeps(tower: StructureTower) {
    const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);

    if (hostiles.length > 0) {
      const target = hostiles[0];
      tower.attack(target);
    }
  }

  const healDamagedCreeps = (tower: StructureTower) => {
    const damagedCreeps = tower.room.find(FIND_CREEPS, {
      filter: creep => {
        return creep.hits < creep.hitsMax;
      }
    });
   damagedCreeps.forEach(creep => {
    tower.heal(creep);
   })
  };

  const myTowers = room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_TOWER }
  });

  myTowers.forEach(tower => {
    attackHostileCreeps(tower as StructureTower);
    healDamagedCreeps(tower as StructureTower);
  });

  // const towers: StructureTower[] = room.find(FIND_STRUCTURES, {
  //   filter: structure => {
  //     return structure.structureType == STRUCTURE_TOWER;
  //   }
  // });
  // attackHostileCreeps(towers)

  // const towers = room.find(FIND_STRUCTURES, {
  //   filter: structure => {
  //     return structure.structureType == STRUCTURE_TOWER;
  //   }
  // });

  // towers.forEach(tower => {
  //   var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  //   if (closestHostile) {
  //     tower.attack(closestHostile);
  //   }

  // })

  // const tower = Game.getObjectById<StructureTower>("64b3c0bd249477e805953d05");
  // const [tower] = room.find(FIND_MY_STRUCTURES, {
  //     filter: structure => structure.id === "64b3c0bd249477e805953d05"
  //   });
  //   // var tower = Game.rooms["W14N37"].getObjectById('4bbd46dea9dc677e8ba64954');
  //   if (tower) {
  //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
  //       filter: structure => structure.hits < structure.hitsMax
  //     });
  //     if (closestDamagedStructure) {

  //       //tower.repair(closestDamagedStructure);
  //     }

  // var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  // if (closestHostile) {
  //   tower.attack(closestHostile);
  // }

  // function defendRoom(roomName: string) {
  //   var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
  //   if (hostiles.length > 0) {
  //     var username = hostiles[0].owner.username;
  //     Game.notify(`User ${username} spotted in room ${roomName}`);
  //     var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
  //       filter: { structureType: STRUCTURE_TOWER }
  //     }) as StructureTower[];

  //     towers.forEach(tower => tower.attack(hostiles[0]));
  //   }
  // }

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
    if (creep.memory.role == "repairer") {
      roleRepairer.run(creep);
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
