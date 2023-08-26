import { findClosestDeposit } from "generalCreepFuncs";

export const roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.hits < creep.hitsMax) {
      // creep is hurt, run to tower
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (
              structure.structureType == STRUCTURE_TOWER)
          );
        },
      });
      creep.moveTo(targets[0]);
    } else {


    if (creep.store.getFreeCapacity() > 0) {
      // has storage room to harvest
      var sources = creep.room.find(FIND_SOURCES);
      creep.memory.sourceId = creep.pos.findClosestByRange(FIND_SOURCES).id;
      const source = Game.getObjectById(creep.memory.sourceId);
      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    } else {
      // go deposit stored energy
      findClosestDeposit(creep);
    }
  }
  },
};
