import { findClosestDeposit, withdrawEnergy } from "generalCreepFuncs";

export const roleRepairer = {
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
      const repairSites = creep.room.find(FIND_STRUCTURES, {
        filter: site => {
          return site.hitsMax > site.hits && site.hits < 1000000;
        }
      });
      // repairing and empty store, set repairing to false
      if (
        (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) ||
        (creep.memory.repairing && !repairSites.length)
      ) {
        creep.memory.repairing = false;
        creep.say("🔄 harvest");
      }
      // not repairing, full store, repair sites available, set repairing to true
      if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0 && repairSites.length) {
        creep.memory.repairing = true;
        creep.say("🚧 build");
      }
      // repairing and repairs sites available, go build
      if (creep.memory.repairing) {
        if (creep.repair(repairSites[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(repairSites[0], {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }

      if (!creep.memory.repairing && creep.store.getFreeCapacity() > 0) {
        if (!withdrawEnergy(creep)) {
          var sources = creep.room.find(FIND_SOURCES);
          if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
          }
        }
      }
      if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
        // if creep has energy, deposit
        findClosestDeposit(creep);
      }
    }
  }
};
