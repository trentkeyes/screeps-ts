import { ErrorMapper } from "utils/ErrorMapper";
import { roleBuilder } from "role.builder";
import { roleUpgrader } from "role.upgrader";
import { roleHarvester } from "role.harvester";
import { roleRepairer } from "role.repairer";
import operateSpawn from "spawn";
import operateTowers from "towers";
import "./types";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  const roomName = "W14N37";
  const spawn1: StructureSpawn = Game.spawns["Spawn1"];
  const energy = spawn1.room.energyAvailable;
  const room = Game.rooms[roomName];

  if (!Memory.count) {
    Memory.count = {
      builders: 0,
      harvesters: 0,
      upgraders: 0,
      repairers: 0
    };
  }

  operateSpawn(spawn1);
  operateTowers(room);

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

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      const role = Memory.creeps[name].role;
      Memory.count[`${role}s`]--;
      delete Memory.creeps[name];
    }
  }
});
