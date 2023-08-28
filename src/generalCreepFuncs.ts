// find closest energy deposit, go deposit or upgrade controller
const findClosestDeposit = (creep: Creep) => {
  var targets = creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_TOWER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    }
  });
  const closestDeposit = creep.pos.findClosestByRange(targets);
  const closestDepositPath = creep.pos.findClosestByPath(targets);
  if (closestDepositPath) {
    if (creep.transfer(closestDepositPath, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(closestDepositPath, {
        visualizePathStyle: { stroke: "#ffffff" }
      });
    }
  } else {
    var controller = creep.room.controller;
    creep.moveTo(controller);
    creep.upgradeController(controller);
  }
};

// harvest, then deposit or upgrade

// name new creep

// find closest source and not busy

// have builder or upgrader creeps withdraw from sources
//const creep = Game.creeps.builder; // Assuming you have a builder creep

// Find the closest extension with energy
// const extensionWithEnergy = creep.pos.findClosestByRange(FIND_STRUCTURES, {
//   filter: structure =>
//     structure.structureType === STRUCTURE_EXTENSION && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
// });

// if (extensionWithEnergy) {
//   if (creep.withdraw(extensionWithEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
//     creep.moveTo(extensionWithEnergy);
//   }
// }

// builders and upgraders should be adjacent to source if they're currently building/upgrading

// check if energy sources are being harvested

// Inside the main loop or the logic where you manage creeps
// for (const source of sources) {
//   const isSourceBeingHarvested = _.some(
//     Game.creeps,
//     creep => creep.memory.harvesting && creep.memory.targetSource === source.id
//   );

//   if (!isSourceBeingHarvested) {
//     // Spawn a creep to harvest this source
//     // Update the creep's memory to mark it as harvesting from this source
//   }
// }

// Check if Creep is in an Adjacent Square:

// const creep = Game.creeps.builder; // Replace with your creep
// const targetSource = sources[0]; // Replace with your target source

// if (creep.pos.isNearTo(targetSource)) {
//   creep.harvest(targetSource);
// } else {
//   creep.moveTo(targetSource);
// }

// withdraw energy

// filter through closest structure with energy

const withdrawEnergy = (creep: Creep) => {
  const test = creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 50
      );
    }
  });
  console.log("Withdraw structures array", test);
  // is this just giving me the first option of an array (ie spawn). yes. sort it to get the closest
  const [storage] = creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 50
      );
    }
  });
  if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(storage);
  }
  return storage;
};

export { findClosestDeposit, withdrawEnergy };
