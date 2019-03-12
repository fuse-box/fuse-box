import { TerminalStyle } from './terminalStyles';

export function reset(message: string): string {
  return TerminalStyle.RESET + message + TerminalStyle.RESET;
}
export function bright(message: string): string {
  return TerminalStyle.BRIGHT + message + TerminalStyle.RESET;
}
export function dim(message: string): string {
  return TerminalStyle.DIM + message + TerminalStyle.RESET;
}
export function underscore(message: string): string {
  return TerminalStyle.UNDERSCORE + message + TerminalStyle.RESET;
}
export function blink(message: string): string {
  return TerminalStyle.BLINK + message + TerminalStyle.RESET;
}
export function reverse(message: string): string {
  return TerminalStyle.REVERSE + message + TerminalStyle.RESET;
}
export function hidden(message: string): string {
  return TerminalStyle.HIDDEN + message + TerminalStyle.RESET;
}
export function black(message: string): string {
  return TerminalStyle.FG_BLACK + message + TerminalStyle.RESET;
}
export function red(message: string): string {
  return TerminalStyle.FG_RED + message + TerminalStyle.RESET;
}
export function green(message: string): string {
  return TerminalStyle.FG_GREEN + message + TerminalStyle.RESET;
}
export function yellow(message: string): string {
  return TerminalStyle.FG_YELLOW + message + TerminalStyle.RESET;
}
export function blue(message: string): string {
  return TerminalStyle.FG_BLUE + message + TerminalStyle.RESET;
}
export function magenta(message: string): string {
  return TerminalStyle.FG_MAGENTA + message + TerminalStyle.RESET;
}
export function cyan(message: string): string {
  return TerminalStyle.FG_CYAN + message + TerminalStyle.RESET;
}
export function white(message: string): string {
  return TerminalStyle.FG_WHITE + message + TerminalStyle.RESET;
}
export function bgBlack(message: string): string {
  return TerminalStyle.BG_BLACK + message + TerminalStyle.RESET;
}
export function bgRed(message: string): string {
  return TerminalStyle.BG_RED + message + TerminalStyle.RESET;
}
export function bgGreen(message: string): string {
  return TerminalStyle.BG_GREEN + message + TerminalStyle.RESET;
}
export function bgYellow(message: string): string {
  return TerminalStyle.BG_YELLOW + message + TerminalStyle.RESET;
}
export function bgBlue(message: string): string {
  return TerminalStyle.BG_BLUE + message + TerminalStyle.RESET;
}
export function bgMagenta(message: string): string {
  return TerminalStyle.BG_MAGENTA + message + TerminalStyle.RESET;
}
export function bgCyan(message: string): string {
  return TerminalStyle.BG_CYAN + message + TerminalStyle.RESET;
}
export function bgWhite(message: string): string {
  return TerminalStyle.BG_WHITE + message + TerminalStyle.RESET;
}
export function colorize(message: string, style: TerminalStyle): string {
  return style + message + TerminalStyle.RESET;
}
