import inquirer from "inquirer";

export type Step = {
  name?: string,
  choices: Array<Step | any> | any,
  type?: string,
  message?: string,
  default?: boolean,
  when?: Function,
  value?: any,
  checked?: boolean,
}

class Data {
  // @TODO: connect to github api
  public static availableDemos = {
    react: ["react-seed"],
  };
  public static demos = Object.keys(Data.availableDemos);
  public static hasDemo = (view) => Data.demos.forEach(demo => demo.includes(view));

  public static choices = {
    view: [
      new inquirer.Separator(' = View / Presentation = '),
      {
        name: "React",
        value: "react",
      },
      {
        name: "Inferno",
        value: "inferno",
      },
      {
        name: "Vue",
        value: "vue",
      },
      {
        name: "Angular",
        value: "angular",
      },
      {
        // input...
        name: "Other",
        value: "other",
      },
    ],

    target: [
      // if browser, ask about inline svg and html, and styles
      new inquirer.Separator(' = Environment? ='),
      {
        name: "Server",
        value: "server",
        checked: true,
      },
      {
        name: "Browser",
        value: "browser",
        checked: true,
      },
      {
        name: "Electron",
        value: "electron",
      },
      // {
      //   name: "HotReloading",
      //   value: "hmr",
      //   checked: true,
      // },
    ],

    exporting: [
      {
        type: "confirm",
        name: "exporting",
        message: "Exporting anything?",
        default: false,
      },
      {
        type: "input",
        name: "pkgname",
        message: "Package name?",
        when: answers => answers.exporting,
        // default: false,
      },
      {
        type: "input",
        name: "pkgname",
        message: "modules to export?",
        default: "*",
        when: answers => answers.exporting,
      },
    ],

    env: [
      new inquirer.Separator(' = Production? = '),
      {
        name: "DefinePlugin",
        checked: true,
      },
      {
        name: "Uglify",
        checked: true,
      },
      {
        name: "SourceMaps",
        checked: true,
      },
    ],

    syntax: [
      new inquirer.Separator(' = Syntax? = '),
      {
        name: "TypeScript",
        value: "ts",
        checked: true,
      },
      {
        name: "Babel es6",
        value: "babel",
      },
      {
        name: "None - es5",
        value: "es5",
      },
      {
        name: "CoffeeScript",
        value: "cs",
      },
      {
        name: "Other",
        value: "other",
      },
    ],
  };

  public static _steps = {
    aliases: {
      type: "confirm",
      name: "aliases",
      message: "Do you use aliases?",
      default: false,
    },
    target: {
      type: "checkbox",
      name: "target",
      message: "Target env(s)?",
      choices: Data.choices.target,
    },
    syntax: {
      type: "checkbox",
      name: "syntax",
      message: "Syntax used?",
      choices: Data.choices.syntax,
    },
    bundles: {
      // then go to their names...
      // and go to alias interactive...
      // and save the data in case they exit...
      // and ask if they want to resume...
      type: "confirm",
      name: "bundles",
      message: "Multiple bundles?",
      default: false,
    },
    targetThenView: [
      {
        type: "checkbox",
        name: "target",
        message: "Env target(s)?",
        choices: Data.choices.target,
      },
      {
        type: "list",
        name: "view",
        message: "View framework?",
        choices: Data.choices.view,
        when: answers => answers.target.includes("browser"),
      },
      {
        type: "confirm",
        message: "Start with an existing demo?",
        name: "downloaddemo",
        default: false,
        when: answers => true || Data.hasDemo(answers.view),
      },
    ],
  };
}

// const availableDemos = Data.availableDemos
// const demos = Data.hasDemo
const choices = Data.choices
const _steps = Data._steps

// @TODO:
// finish this,
// map to config,
// would be helpful to have chaining first though
// because it would be simpler
class Builder {
  public config: any = {};
  public Fluent: any = {};
  public gatherer: Gatherer = new Gatherer();
  constructor(fsbx) {
    this.Fluent = fsbx.Fluent;
  }

  public stepper() {
    this.gatherer.stepper();
  }
}

class Gatherer {
  public data: Object = {};
  public steps: Array<Step> | any = [];
  public indx: number = 0;
  public stepper() {
    const steps = [
      _steps.targetThenView,
      _steps.aliases,
      choices.exporting,
      _steps.bundles,
      _steps.syntax,
    ];
    this.steps = steps;
    this.thenner();
  }

  public thenner() {
    const steps = this.steps[this.indx];
    if (!steps) {
      // console.log(inspector(this.data));
      return;
    }
    if (steps.type === "checkbox") steps.message += " (use [spacebar])";
    inquirer.prompt(steps).then(answers => {
      Object.assign(this.data, answers);
      this.indx++;
      setTimeout(() => this.thenner(), 1);
    });
  }
}

export default Builder;
