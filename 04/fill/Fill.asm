// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

// Screen starts at RAM[16384]
// ends at RAM[24575]
// keyboard stored at RAM[24576]

// initiate position at first pixel
  @16384
  D=A
  @0
  M=D
// check keyboard
  @CHECK
  0;JMP
// have a blackening loop
(FILL)
  // skip logic if screen is already full
  @0
  D=M
  @24575
  D=D-A
  @CHECK
  D;JGT
  // if not, fill next spot
  @0
  D=M
  A=D
  M=-1
  @0
  M=M+1
  // and then check keyboard
  @CHECK
  0;JMP
// have a clearning loop
(CLEAR)
  // skip logic if screen is already empty
  @0
  D=M
  @16384
  D=D-A
  @CHECK
  D;JLT
  // if not, clear previous spot
  @0
  D=M
  A=D
  M=0
  @0
  M=M-1
  // and then check keyboard
  @CHECK
  0;JMP
// jumps to one or the other depending on keyboard input
(CHECK)
  @24576
  D=M
  @FILL
  D;JNE
  @CLEAR
  D;JEQ
