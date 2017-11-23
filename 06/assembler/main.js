const Parser = require('./parser');
const Code = require('./code');
const fs = require('fs');

const filePaths = [
  '../add/Add.asm',
  '../max/MaxL.asm',
  '../pong/PongL.asm',
  '../rect/RectL.asm',
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
  while (parser.hasMoreCommands()) {
    let binary = '';
    parser.advance();
    const type = parser.commandType();
    if (type === 'A_COMMAND') {
      const address = Number(parser.symbol());
      binary = address.toString(2);
      // will have to handle actual symbols here
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
  fs.writeFile(hackFilePath, binaryCmds.join('\n'), (err, result) => {
    if (err) {
      console.error(err);
      throw new Error(err.message);
    }
    console.log(result)
  })
});
