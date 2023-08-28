declare global {
  /*
      Example types, expand on these or remove them and add your own.
      Note: Values, properties defined here do no fully *exist* by this type definiton alone.
            You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

      Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
      Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
    */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
    tally: {
      harvesters: number;
      upgraders: number;
      builders: number;
    };
  }

  interface CreepMemory {
    role: string;
    room: string;
  }

  interface HarvesterMemory extends CreepMemory {
    harvesting: boolean;
  }

  interface BuilderMemory extends CreepMemory {
    building: boolean;
  }

  interface UpgraderMemory extends CreepMemory {
    upgrading: boolean;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

export {};
