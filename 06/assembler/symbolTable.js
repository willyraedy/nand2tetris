class SymbolTable {
  constructor() {
    this.table = {
      SP: 0,
      LCL: 1,
      ARG: 2,
      THIS: 3,
      THAT: 4,
      R0: 0,
      R1: 1,
      R2: 2,
      R3: 3,
      R4: 4,
      R5: 5,
      R6: 6,
      R7: 7,
      R8: 8,
      R9: 9,
      R10: 10,
      R11: 11,
      R12: 12,
      R13: 13,
      R14: 14,
      R15: 15,
      SCREEN: 16384,
      KBD: 24576,
    };
    this.nextAvailable = 16;
  }

  addEntry (symbol, address) {
    if (!address && this.nextAvailable) {
      address = this.nextAvailable;
      this.table[symbol] = this.nextAvailable;
      this.nextAvailable =  this.nextAvailable < 16383 ?
        this.nextAvailable + 1 :
        null;
    } else if (!address && !this.nextAvailable) {
      throw new Error('RAM is full');
    }
    // check if already exists or if given address is valid?
    this.table[symbol] = address;
    return address;
  }

  contains (symbol) {
    return this.table.hasOwnProperty(symbol);
  }

  getAddress (symbol) {
    return this.table[symbol];
  }
}

module.exports = SymbolTable;
