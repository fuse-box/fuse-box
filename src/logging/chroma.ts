import { TerminalStyle } from './terminalStyles';

export function reset(message: String): String {
  return TerminalStyle.RESET + message + TerminalStyle.RESET;
}
export function bright(message: String): String {
  return TerminalStyle.BRIGHT + message + TerminalStyle.RESET;
}
export function dim(message: String): String {
  return TerminalStyle.DIM + message + TerminalStyle.RESET;
}
export function underscore(message: String): String {
  return TerminalStyle.UNDERSCORE + message + TerminalStyle.RESET;
}
export function blink(message: String): String {
  return TerminalStyle.BLINK + message + TerminalStyle.RESET;
}
export function reverse(message: String): String {
  return TerminalStyle.REVERSE + message + TerminalStyle.RESET;
}
export function hidden(message: String): String {
  return TerminalStyle.HIDDEN + message + TerminalStyle.RESET;
}
export function black(message: String): String {
  return TerminalStyle.FG_BLACK + message + TerminalStyle.RESET;
}
export function red(message: String): String {
  return TerminalStyle.FG_RED + message + TerminalStyle.RESET;
}
export function green(message: String): String {
  return TerminalStyle.FG_GREEN + message + TerminalStyle.RESET;
}
export function yellow(message: String): String {
  return TerminalStyle.FG_YELLOW + message + TerminalStyle.RESET;
}
export function blue(message: String): String {
  return TerminalStyle.FG_BLUE + message + TerminalStyle.RESET;
}
export function magenta(message: String): String {
  return TerminalStyle.FG_MAGENTA + message + TerminalStyle.RESET;
}
export function cyan(message: String): String {
  return TerminalStyle.FG_CYAN + message + TerminalStyle.RESET;
}
export function white(message: String): String {
  return TerminalStyle.FG_WHITE + message + TerminalStyle.RESET;
}
export function bgBlack(message: String): String {
  return TerminalStyle.BG_BLACK + message + TerminalStyle.RESET;
}
export function bgRed(message: String): String {
  return TerminalStyle.BG_RED + message + TerminalStyle.RESET;
}
export function bgGreen(message: String): String {
  return TerminalStyle.BG_GREEN + message + TerminalStyle.RESET;
}
export function bgYellow(message: String): String {
  return TerminalStyle.BG_YELLOW + message + TerminalStyle.RESET;
}
export function bgBlue(message: String): String {
  return TerminalStyle.BG_BLUE + message + TerminalStyle.RESET;
}
export function bgMagenta(message: String): String {
  return TerminalStyle.BG_MAGENTA + message + TerminalStyle.RESET;
}
export function bgCyan(message: String): String {
  return TerminalStyle.BG_CYAN + message + TerminalStyle.RESET;
}
export function bgWhite(message: String): String {
  return TerminalStyle.BG_WHITE + message + TerminalStyle.RESET;
}
