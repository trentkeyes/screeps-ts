import { withdrawEnergy } from "generalCreepFuncs";

export const roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.hits < creep.hitsMax) {
      // creep is hurt, run to tower
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_TOWER;
        }
      });
      creep.moveTo(targets[0]);
    } else {
      if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.upgrading = false;
        creep.say("🔄 harvest");
      }
      if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
        creep.memory.upgrading = true;
        creep.say("⚡ upgrade");
      }

      if (creep.memory.upgrading) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller, {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }
      if (!creep.memory.upgrading) {
        if (!withdrawEnergy(creep)) {
          var sources = creep.room.find(FIND_SOURCES);
          if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
          }
        }
      }
    }
  }
};
