import { findClosestDeposit } from "generalCreepFuncs";

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
          return site.hitsMax > site.hits && site.structureType == STRUCTURE_CONTAINER;
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
        const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      }
      if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
        // if creep has energy, deposit
        findClosestDeposit(creep);

        // no construction sites, find sources
        // const targets = creep.room.find(FIND_STRUCTURES, {
        //   filter: structure => {
        //     return (
        //       (structure.structureType == STRUCTURE_EXTENSION ||
        //         structure.structureType == STRUCTURE_SPAWN ||
        //         structure.structureType == STRUCTURE_TOWER) &&
        //       structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        //     );
        //   }
        // });
        // if (targets.length > 0) {
        //   if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(targets[0], {
        //       visualizePathStyle: { stroke: "#ffffff" }
        //     });
        //   }
        // } else {
        //   var controller = creep.room.controller;
        //   creep.moveTo(controller);
        //   creep.upgradeController(controller);
        // }

        // const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        // if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        // }
      }
    }
  }
};
