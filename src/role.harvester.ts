import { findClosestDeposit } from "generalCreepFuncs";

export const roleHarvester = {
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
      // creep.memory.harvesting && freecapacity > 0, harvest
      if (creep.memory.harvesting && creep.store.getFreeCapacity() > 0) {
        if (!creep.memory.sourceId) {
          creep.memory.sourceId = creep.pos.findClosestByRange(FIND_SOURCES).id;
        }
        const source = Game.getObjectById(creep.memory.sourceId);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      }
      // creep.memory.harvesting and freecapacity == 0, set harvesting to false
      if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
        creep.memory.harvesting = false;
        creep.say("Depositing energy");
      }
      // if !harvesting && getUsedCapacity < 50, set harvesting to true
      if (!creep.memory.harvesting && creep.store.getUsedCapacity() < 50) {
        creep.memory.harvesting = true;
        creep.say("Harvesting");
        creep.memory.sourceId = creep.pos.findClosestByPath(FIND_SOURCES).id;
      }
      // if !harvesting , go deposit
      if (!creep.memory.harvesting) {
        findClosestDeposit(creep);
      }
    }
  }
};
