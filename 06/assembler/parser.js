class Parser {
  constructor(fileText) {
    this.nextLine = 0;
    this.currentCommand = null;
    this.fileText = fileText.split('\n')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.slice(0, 2) !== '//' && cmd.length);
    // Doesn't trim comments that start mid-line
  }

  hasMoreCommands() {
    return this.nextLine < this.fileText.length;
  }

  advance() {
    this.currentCommand = this.fileText[this.nextLine];
    this.nextLine += 1;
  }

  commandType() {
    if (this.currentCommand[0] === '@'){
      return 'A_COMMAND';
    } else if (this.currentCommand[0] === '(') {
      return 'L_COMMAND';
    } else {
      return 'C_COMMAND';
    }
    // HANDLE INVALID COMMAND?
  }

  symbol() {
    if (this.commandType() === 'A_COMMAND') {
      return this.currentCommand.slice(1);
    } else if (this.commandType() === 'L_COMMAND') {
      return this.currentCommand.slice(1, -1);
    } else {
      throw new Error('Symbol should only be called with A or L command. Current Command: ' + this.currentCommand);
    }
  }

  dest() {
    const equalIndex = this.currentCommand.indexOf('=');
    if (equalIndex < 0) return null;
    return this.currentCommand.slice(0, equalIndex);
  }

  comp() {
    // between the equals sign and semi-colon (both optional)
    const equalIndex = this.currentCommand.indexOf('=');
    const potentialSemiIndex = this.currentCommand.indexOf(';');
    const semiIndex = potentialSemiIndex > -1 ? potentialSemiIndex : undefined;
    return this.currentCommand.slice(equalIndex + 1, semiIndex);
  }

  jump() {
    const semiIndex = this.currentCommand.indexOf(';');
    if (semiIndex < 0) return null;
    return this.currentCommand.slice(semiIndex + 1);
  }
}

module.exports = Parser;
