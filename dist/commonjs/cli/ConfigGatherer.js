"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
class Data {
}
Data.availableDemos = {
    react: ["react-seed"],
};
Data.demos = Object.keys(Data.availableDemos);
Data.hasDemo = (view) => Data.demos.forEach(demo => demo.includes(view));
Data.choices = {
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
            name: "Other",
            value: "other",
        },
    ],
    target: [
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
Data._steps = {
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
const choices = Data.choices;
const _steps = Data._steps;
class Builder {
    constructor(fsbx) {
        this.config = {};
        this.Fluent = {};
        this.gatherer = new Gatherer();
        this.Fluent = fsbx.Fluent;
    }
    stepper() {
        this.gatherer.stepper();
    }
}
exports.Builder = Builder;
class Gatherer {
    constructor() {
        this.data = {};
        this.steps = [];
        this.indx = 0;
    }
    stepper() {
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
    thenner() {
        const steps = this.steps[this.indx];
        if (!steps) {
            return;
        }
        if (steps.type === "checkbox")
            steps.message += " (use [spacebar])";
        inquirer.prompt(steps).then(answers => {
            Object.assign(this.data, answers);
            this.indx++;
            setTimeout(() => this.thenner(), 1);
        });
    }
}
exports.Gatherer = Gatherer;
exports.default = Builder;
