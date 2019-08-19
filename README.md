* https://webrtc.org/

# Documentation

* https://en.wikibooks.org/wiki/Super_NES_Programming/SNES_memory_map
* http://assassin17.brinkster.net/thegun.htm
* http://6502.org/tutorials/65c816opcodes.html
* https://wiki.superfamicom.org/65816-reference
* http://old.smwiki.net/wiki/65c816
* http://www.defence-force.org/computing/oric/coding/annexe_2/index.htm
* http://www.chibiakumas.com/6502/snes.php
* http://problemkaputt.de/fullsnes.htm#snesmemory
* https://github.com/Emu-Docs/Emu-Docs/tree/master/Super%20Nintendo%20Entertainment%20System
* https://github.com/Emu-Docs/Emu-Docs/blob/master/Super%20Nintendo%20Entertainment%20System/snes.txt#L892


[^1]: Add 1 cycle if m=0 (16-bit memory/accumulator)
[^4]: Add 2 cycles if m=0 (16-bit memory/accumulator)

[^7]: Add 1 cycle for 65816 native mode (e=0)

[^5]: Add 1 cycle if branch is taken
[^6]: Add 1 cycle if branch taken crosses page boundary in emulation mode (e=1)

[^2]: Add 1 cycle if low byte of Direct Page Register is non-zero
[^3]: Add 1 cycle if adding index crosses a page boundary or x=0 (16-bit index registers)

[^8]: Add 1 cycle if x=0 (16-bit index registers)




[^9]: Uses 3 cycles to shut the processor down: additional cycles are required by reset to restart it
[^10]: Uses 3 cycles to shut the processor down: additional cycles are required by interrupt to restart it

[^11]: Byte and cycle counts subject to change in future processors which expand WDM into 2-byte opcode portions of instructions of varying lengths

[^14]: Add 1 byte if x=0 (16-bit index registers)
[^12]: Add 1 byte if m=0 (16-bit memory/accumulator)
[^13]: Opcode is 1 byte, but program counter value pushed onto stack is incremented by 2 allowing for optional signature byte

