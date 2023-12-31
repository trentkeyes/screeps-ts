import { findClosestDeposit, withdrawEnergy } from "generalCreepFuncs";

export const roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.hits < creep.hitsMax) {
      // creep is hurt, run to tower
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION;
        }
      });
      creep.moveTo(targets[0]);
    } else {
      const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: site => {
          return site;
        }
      });
      // building and empty store, set building to false
      if (
        (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) ||
        (creep.memory.building && !constructionSites.length)
      ) {
        creep.memory.building = false;
        creep.say("🔄 harvest");
      }
      // not building, full store, construction sites available, set building to true
      if (!creep.memory.building && creep.store.getFreeCapacity() == 0 && constructionSites.length) {
        creep.memory.building = true;
        creep.say("🚧 build");
      }
      // building and constructions sites available, go build
      if (creep.memory.building) {
        if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(constructionSites[0], {
            visualizePathStyle: { stroke: "#ffffff" }
          });
        }
      }
      if (!creep.memory.building && creep.store.getFreeCapacity() > 0) {
        // if builders have nothing to build, they just go in circles withdrawing and depositing enery from storage
        if (!withdrawEnergy(creep)) {
          var sources = creep.room.find(FIND_SOURCES);
          if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
          }
        }
      }
      if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
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
