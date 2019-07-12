import { Chars } from './chars';
import { CharFlags, CharTypes } from './charClassifier';

enum CommentType {
  SingleLineComment = 1,
  MultiLineComment = 2,
}

class State {
  public index: number;
  public length: number;
  public commentType: CommentType;
  constructor(public source: string) {
    this.index = 0;
    this.length = this.source.length;
  }
  public next() {
    this.index++;
  }
  public isCurrent(char: Chars) {
    return this.source.charCodeAt(this.index) === char;
  }
  public isNext(char: Chars) {
    return this.source.charCodeAt(this.index + 1) === char;
  }
}
export function createState(source: string) {
  return new State(source);
}

const ChatIdentifier = {
  Start: 0x7a,
  End: 0x61,
};

export function onChar(state) {
  const current = state.source.charCodeAt(state.index);
  if (state.commentType) {
    if (state.commentType === CommentType.SingleLineComment) {
      if (current === Chars.LineFeed) {
        state.commentType = 0;
        state.index++;
      }
    } else if (state.commentType === CommentType.MultiLineComment) {
      const nextChar = state.source.charCodeAt(state.index);
      if (current === Chars.Asterisk && nextChar === Chars.Forwardslash) {
        state.commentType = 0;
        state.index++;
      }
    }
    return;
  }
  switch (current) {
    case Chars.Forwardslash:
      const nextChar = state.source.charCodeAt(state.index);
      if (nextChar === Chars.Forwardslash) {
        state.commentType = CommentType.SingleLineComment;
        state.index++;
      } else if (nextChar === Chars.Asterisk) {
        state.index++;
        state.commentType = CommentType.MultiLineComment;
      }
      break;
    default:
      if (CharTypes[current] & CharFlags.KeywordCandidate) {
        console.log(state.source[state.index]);
      }
    //if (state.currentToken === undefined) state.currentToken = '';
    //state.currentToken += state.source[state.index];
    //} //else if (state.currentToken) {
    //state.tokens.push(state.currentToken);
    //state.currentToken = undefined;
    //}
  }
}

const FUNCTIONS = ['import', 'require'];

function scanUntil(state, str) {
  while (true) {
    if (state.source[state.index] === str || state.length <= state.index) {
      return;
    }
    state.index++;
  }
}
function onState(state) {
  const char = state.source[state.index];
  // if (state.ignoreUntil) {
  //   if (state.ignoreUntil === char) {
  //     state.ignoreUntil = 0;
  //     state.index++;
  //   }
  //   return;
  // }

  // if (char === Chars.Forwardslash) {
  // }
  // if (char === Chars.Forwardslash) {
  //   if (state.source.charCodeAt(state.index + 1) === Chars.Forwardslash) {
  //     state.index++;
  //     scanUntil(state, Chars.LineFeed);
  //   }
  // }
  // switch (char) {
  //   case Chars.Forwardslash:
  //   // if (state.source.charCodeAt(state.index + 1) === Chars.Forwardslash) {
  //   //   scanUntil(state, Chars.LineFeed);
  //   // }
  // }
  // if (CharTypes[char] & CharFlags.KeywordCandidate) {
  //   if (!state.startValidIndex) state.startValidIndex = state.index;
  // } else if (state.startValidIndex) {
  //   state.onToken(state.source.slice(state.startValidIndex, state.index));
  //   state.startValidIndex = 0;
  // }
}

function validKeywordToken(x) {
  return (x <= 122 && x >= 97) || (x >= 65 && x <= 90);
}

const declarations = ['var', 'const', 'let', 'import', 'from'];
function isVariableDeclarator(input, index) {
  let word = '';
  for (let i = 0; i < 4; i++) {
    word += input[i + index];
    if (declarations.indexOf(word) > -1) {
      return [index + 1, word];
    }
  }
  return [index];
}
export function scanner(input: string) {
  let valid = '';
  let index = 0;
  let iterations = input.length / 6;
  let pos = 0;

  for (let index = 0; index < input.length / 5; index++) {
    index += 4;

    if (input[index] === '/') {
      if (input[index + 1] === '/') {
        index++;
        for (let j = index; j < input.length; j++) {
          if (input[j] === '\n' || j >= input.length) {
            index = ++j;
            break;
          }
        }
      } else if (input[index + 1] === '*') {
        index++;
        for (let j = index; j < input.length; j++) {
          if ((input[j] === '*' && input[j + 1] === '/') || j >= input.length) {
            index = j + 2;
            break;
          }
        }
      }
    }
  }

  //console.log(state);
  //console.log(res);
}

scanner(`
  // foo!
  /* 22 */
  import "foo"
  var pukka = 1;
`);
