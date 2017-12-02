const Parser = require('./parser');
const Code = require('./code');
const SymbolTable = require('./symbolTable');
const fs = require('fs');

const filePaths = [
  '../add/Add.asm',
  '../max/Max.asm',
  '../pong/Pong.asm',
  '../rect/Rect.asm',
];

const filepath = filePaths[2];

fs.readFile(filepath, (err, data) => {
  if (err) {
    console.error(err);
    throw new Error(err.message);
  }
  const binaryCmds = [];
  const parser = new Parser(data.toString());
  const decoder = new Code();
  const symbolTable = new SymbolTable();

  // First pass to handle all labels
  let romAddress = 0;
  while (parser.hasMoreCommands()) {
    parser.advance();
    const type = parser.commandType();
    if (type === 'A_COMMAND') {
      romAddress++;
    } else if (type === 'L_COMMAND') {
      symbolTable.addEntry(parser.symbol(), romAddress);
    } else if (type === 'C_COMMAND') {
      romAddress++;
    } else {
      throw new Error('Unknown command: ' + parser.currentCommand);
    }
  }

  // reset for second pass
  parser.nextLine = 0;
  parser.currentCommand = null;

  // Second pass to write hack program
  while (parser.hasMoreCommands()) {
    let binary = '';
    parser.advance();
    const type = parser.commandType();
    if (type === 'A_COMMAND') {
      let address = Number(parser.symbol());
      if (Number.isNaN(address)) { // then it must be a symbol
        const symbol = parser.symbol();
        address = symbolTable.contains(symbol) ?
          symbolTable.getAddress(symbol) :
          symbolTable.addEntry(symbol);
      }
      binary = address.toString(2);
    } else if (type === 'L_COMMAND') {
      continue; // no write to hack file
      // will have to store location using .symbol()
    } else if (type === 'C_COMMAND') {
      const destBinary = decoder.toBinary(parser.dest(), 'dest');
      const compBinary = decoder.toBinary(parser.comp(), 'comp');
      const jumpBinary = decoder.toBinary(parser.jump(), 'jump');
      binary = compBinary + destBinary + jumpBinary;
    } else {
      throw new Error('Unknown command. Current command: ' + parser.currentCommand);
    }
    const newHackLine = decoder.addPrefix(binary, type);
    binaryCmds.push(newHackLine);
  }
  const hackFilePath = filepath.replace('asm', 'hack');
  fs.writeFile(hackFilePath, binaryCmds.join('\n'), (err) => {
    if (err) {
      console.error(err);
      throw new Error(err.message);
    }
    console.log('done')
  })
});
