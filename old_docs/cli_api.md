# CLI API

Just like FuseBox, the CLI API is easy to use and works with 0 configuration!  
Your code could look like this:

```js
const { Sparky, CLI } = require("fuse-box");
CLI();

Sparky.task("clean:all", () => {});
```

Now if you run this command:

```bash
node fuse --help
```

your console will print this:

```bash
Usage: fuse <task> [options]

Tasks:
  clean:all

Options:
  --help, -h  Show help                                                [boolean]
```

## Task Description

Since we want users to know, what a task does, we can provide a
taskDescription.  
There are multiple ways to define them:

```js
// Define taskDescriptions in the initialization
CLI({
  taskDescriptions: {
    "clean:all": "This task will clean some things!",
  },
});

// Define taskDescription after initialization
CLI().addTaskDescription("clean:all", "This task will clean some things!");
// or
CLI().addTaskDescriptions({
  "clean:all": "This task will clean some things!",
});
```

This will make the console output look like this:

```bash
Usage: fuse <task> [options]

Tasks:
  clean:all  This task will clean some things!

Options:
  --help, -h  Show help                                                [boolean]
```

## Options

With [yargs](http://yargs.js.org/), we provide an powerful option parser!  
For defining options, you can use the yargs schema for options.
[See here](http://yargs.js.org/docs/#api-optionkey-opt)

Here some ways to define options:

```js
CLI({
  options: {
    alert: { type: "boolean", default: false },
  },
});
// ..
CLI().addOption("alert", { type: "boolean", default: false });
// or
CLI().addOptions({
  alert: { type: "boolean", default: false },
});
```

### Parsing options

Every call of CLI(), returns an new instance.  
And every CLI instance, has an "options" property, which holds all parsed  
options.  
Here a simple example of parsing/using an option:

```js
const { options } = CLI().addOption("alert", {
  type: "boolean",
  default: false,
});

if (options.alert) {
  console.log("ALLEEERRT!");
}
```

Its that simple!

```bash
node fuse --alert // This makes options.alert to be true
node fuse // This makes options.alert false, because default
```

## CLI API

You can use CLI in a fluent style, since every method returns its own
instance.  
Example:

```ts
CLI()
    .addOption(name: String, option: Object)
    .addOptions(options: Object)
    .addTaskDescription(name: String, desc: String)
    .addTaskDescriptions(descriptions: Object)
    .showHelp(exitProcess: Boolean = false)
    .parse(arguments: Array<string>)
    .shutDown();
```

### CLI API - Functions

| Name                                             | Description                      |
| ------------------------------------------------ | -------------------------------- |
| `addOption(name: String, option: Object)`        | Adds a single option             |
| `addOptions(options: Object)`                    | Adds multiple options            |
| `addTaskDescription(name: String, desc: String)` | Adds a task description          |
| `addTaskDescriptions(descriptions: Object)`      | Adds multiple task descriptions  |
| `showHelp(exitProcess: Boolean = false)`         | Displays the help                |
| `parse(arguments: Array<string>)`                | Parse a given array of arguments |
| `shutDown()`                                     | Stop the CLI                     |

### CLI API - Properties

| Name      | Description                                          |
| --------- | ---------------------------------------------------- |
| `tasks`   | An object with the registered tasks                  |
| `options` | An object with the parsed options                    |
| `$yargs`  | reference to yargs (If you like to hack some things) |
