import * as chroma from '../chroma';

const stringWithEscapeChars = (msg: String) => JSON.stringify(msg);

describe('chroma', () => {
  it('should be defined', () => {
    expect(chroma).toBeDefined();
  });

  describe('reset', () => {
    it('should be defined', () => {
      expect(chroma.reset).toBeDefined();
    });

    it('should reset the styles', () => {
      expect(stringWithEscapeChars(chroma.reset('RESET'))).toEqual(stringWithEscapeChars('\u001b[0mRESET\u001b[0m'));
    });
  });

  describe('bright', () => {
    it('should be defined', () => {
      expect(chroma.bright).toBeDefined();
    });

    it('should make the string bright', () => {
      expect(stringWithEscapeChars(chroma.bright("I'M BRIGHT"))).toEqual(
        stringWithEscapeChars("\u001b[1mI'M BRIGHT\u001b[0m"),
      );
    });
  });

  describe('dim', () => {
    it('should be defined', () => {
      expect(chroma.dim).toBeDefined();
    });

    it('should make the string dim', () => {
      expect(stringWithEscapeChars(chroma.dim("I'M dim"))).toEqual(stringWithEscapeChars("\u001b[2mI'M dim\u001b[0m"));
    });
  });

  describe('underscore', () => {
    it('should be defined', () => {
      expect(chroma.underscore).toBeDefined();
    });

    it('should make the string with an underscore', () => {
      expect(stringWithEscapeChars(chroma.underscore("I'M underscore"))).toEqual(
        stringWithEscapeChars("\u001b[4mI'M underscore\u001b[0m"),
      );
    });
  });

  describe('blink', () => {
    it('should be defined', () => {
      expect(chroma.blink).toBeDefined();
    });

    it('should make the string with a blink', () => {
      expect(stringWithEscapeChars(chroma.blink("I'M blink"))).toEqual(
        stringWithEscapeChars("\u001b[5mI'M blink\u001b[0m"),
      );
    });
  });

  describe('reverse', () => {
    it('should be defined', () => {
      expect(chroma.reverse).toBeDefined();
    });

    it('should make the string with a reverse', () => {
      expect(stringWithEscapeChars(chroma.reverse("I'M reverse"))).toEqual(
        stringWithEscapeChars("\u001b[7mI'M reverse\u001b[0m"),
      );
    });
  });

  describe('hidden', () => {
    it('should be defined', () => {
      expect(chroma.hidden).toBeDefined();
    });

    it('should make the string with a hidden', () => {
      expect(stringWithEscapeChars(chroma.hidden("I'M hidden"))).toEqual(
        stringWithEscapeChars("\u001b[8mI'M hidden\u001b[0m"),
      );
    });
  });

  describe('black', () => {
    it('should be defined', () => {
      expect(chroma.black).toBeDefined();
    });

    it('should make the string with a black', () => {
      expect(stringWithEscapeChars(chroma.black("I'M black"))).toEqual(
        stringWithEscapeChars("\u001b[30mI'M black\u001b[0m"),
      );
    });
  });

  describe('red', () => {
    it('should be defined', () => {
      expect(chroma.red).toBeDefined();
    });

    it('should make the string with a red', () => {
      expect(stringWithEscapeChars(chroma.red("I'M red"))).toEqual(stringWithEscapeChars("\u001b[31mI'M red\u001b[0m"));
    });
  });

  describe('green', () => {
    it('should be defined', () => {
      expect(chroma.green).toBeDefined();
    });

    it('should make the string with a green', () => {
      expect(stringWithEscapeChars(chroma.green("I'M green"))).toEqual(
        stringWithEscapeChars("\u001b[32mI'M green\u001b[0m"),
      );
    });
  });

  describe('yellow', () => {
    it('should be defined', () => {
      expect(chroma.yellow).toBeDefined();
    });

    it('should make the string with a yellow', () => {
      expect(stringWithEscapeChars(chroma.yellow("I'M yellow"))).toEqual(
        stringWithEscapeChars("\u001b[33mI'M yellow\u001b[0m"),
      );
    });
  });

  describe('blue', () => {
    it('should be defined', () => {
      expect(chroma.blue).toBeDefined();
    });

    it('should make the string with a blue', () => {
      expect(stringWithEscapeChars(chroma.blue("I'M blue"))).toEqual(
        stringWithEscapeChars("\u001b[34mI'M blue\u001b[0m"),
      );
    });
  });

  describe('magenta', () => {
    it('should be defined', () => {
      expect(chroma.magenta).toBeDefined();
    });

    it('should make the string with a magenta', () => {
      expect(stringWithEscapeChars(chroma.magenta("I'M magenta"))).toEqual(
        stringWithEscapeChars("\u001b[35mI'M magenta\u001b[0m"),
      );
    });
  });

  describe('cyan', () => {
    it('should be defined', () => {
      expect(chroma.cyan).toBeDefined();
    });

    it('should make the string with a cyan', () => {
      expect(stringWithEscapeChars(chroma.cyan("I'M cyan"))).toEqual(
        stringWithEscapeChars("\u001b[36mI'M cyan\u001b[0m"),
      );
    });
  });

  describe('white', () => {
    it('should be defined', () => {
      expect(chroma.white).toBeDefined();
    });

    it('should make the string with a white', () => {
      expect(stringWithEscapeChars(chroma.white("I'M white"))).toEqual(
        stringWithEscapeChars("\u001b[37mI'M white\u001b[0m"),
      );
    });
  });

  describe('bgBlack', () => {
    it('should be defined', () => {
      expect(chroma.bgBlack).toBeDefined();
    });

    it('should make the string with a bgBlack background', () => {
      expect(stringWithEscapeChars(chroma.bgBlack("I'm bgBlack"))).toEqual(
        stringWithEscapeChars("\u001b[40mI'm bgBlack\u001b[0m"),
      );
    });
  });

  describe('bgRed', () => {
    it('should be defined', () => {
      expect(chroma.bgRed).toBeDefined();
    });

    it('should make the string with a bgRed background', () => {
      expect(stringWithEscapeChars(chroma.bgRed("I'm bgRed"))).toEqual(
        stringWithEscapeChars("\u001b[41mI'm bgRed\u001b[0m"),
      );
    });
  });

  describe('bgGreen', () => {
    it('should be defined', () => {
      expect(chroma.bgGreen).toBeDefined();
    });

    it('should make the string with a bgGreen background', () => {
      expect(stringWithEscapeChars(chroma.bgGreen("I'm bgGreen"))).toEqual(
        stringWithEscapeChars("\u001b[42mI'm bgGreen\u001b[0m"),
      );
    });
  });

  describe('bgYellow', () => {
    it('should be defined', () => {
      expect(chroma.bgYellow).toBeDefined();
    });

    it('should make the string with a bgYellow background', () => {
      expect(stringWithEscapeChars(chroma.bgYellow("I'm bgYellow"))).toEqual(
        stringWithEscapeChars("\u001b[43mI'm bgYellow\u001b[0m"),
      );
    });
  });

  describe('bgBlue', () => {
    it('should be defined', () => {
      expect(chroma.bgBlue).toBeDefined();
    });

    it('should make the string with a bgBlue background', () => {
      expect(stringWithEscapeChars(chroma.bgBlue("I'm bgBlue"))).toEqual(
        stringWithEscapeChars("\u001b[44mI'm bgBlue\u001b[0m"),
      );
    });
  });

  describe('bgMagenta', () => {
    it('should be defined', () => {
      expect(chroma.bgMagenta).toBeDefined();
    });

    it('should make the string with a bgMagenta background', () => {
      expect(stringWithEscapeChars(chroma.bgMagenta("I'm bgMagenta"))).toEqual(
        stringWithEscapeChars("\u001b[45mI'm bgMagenta\u001b[0m"),
      );
    });
  });

  describe('bgCyan', () => {
    it('should be defined', () => {
      expect(chroma.bgCyan).toBeDefined();
    });

    it('should make the string with a bgCyan background', () => {
      expect(stringWithEscapeChars(chroma.bgCyan("I'm bgCyan"))).toEqual(
        stringWithEscapeChars("\u001b[46mI'm bgCyan\u001b[0m"),
      );
    });
  });

  describe('bgWhite', () => {
    it('should be defined', () => {
      expect(chroma.bgWhite).toBeDefined();
    });

    it('should make the string with a bgWhite background', () => {
      expect(stringWithEscapeChars(chroma.bgWhite("I'm bgWhite"))).toEqual(
        stringWithEscapeChars("\u001b[47mI'm bgWhite\u001b[0m"),
      );
    });
  });
});
