// TODO 19/03/2018 Fix test
/* import * as sinon from "sinon";
import { should } from "fuse-test-runner";
import { Sparky } from "../../sparky/Sparky";
import { CLI } from "../../cli/Cli";
Sparky.testMode = true;

export class CLITest {
    cli = null

    afterEach() {
        Sparky.flush();

        if (this.cli) {
            this.cli.shutDown();
            this.cli = null;
        }
    }

    "Should block multiple instances"() {
        should().throwException(() => {
            this.cli = CLI();
            this.cli = CLI();
        });
    }

    "Should work with 0 configuration"() {
        return new Promise(resolve => {
            this.cli = CLI();
            Sparky.task("test:all", () => {});

            const logStub = sinon.stub(console, "log", function(txt) {
                logStub.restore();
                should(txt).findString("test:all");
                resolve();
            });
            
            this.cli.showHelp();
        });
    }

    "Should initialize options"() {
        this.cli = CLI({
            options: {
                test: {
                    type: "boolean",
                    default: true
                }
            }
        });

        should(this.cli.options.test).beTrue();
    }

    "Should initialize taskDescriptions"() {
        this.cli = CLI({
            taskDescriptions: {
                test: "This is a test!"
            }
        });

        should(this.cli.tasks.test.desc).equal("This is a test!");
    }

    "Should set taskDescription"() {
        this.cli = CLI().addTaskDescription("test", "Nice test :)");
        should(this.cli.tasks.test.desc).equal("Nice test :)");
    }

    "Should set taskDescriptions"() {
        this.cli = CLI().addTaskDescriptions({
            test1: "First test",
            test2: "Second test xD"
        });
        
        should(this.cli.tasks.test1.desc).equal("First test");
        should(this.cli.tasks.test2.desc).equal("Second test xD");
    }

    "Should set option"() {
        this.cli = CLI().addOption("test", {
            type: "boolean",
            default: true
        });

        should(this.cli.options.test).beTrue();
    }

    "Should set options"() {
        this.cli = CLI().addOptions({
            test: {
                type: "boolean",
                default: false
            },
            test2: {
                type: "string",
                default: "Just some string"
            }
        });
        
        should(this.cli.options.test).beFalse();
        should(this.cli.options.test2).equal("Just some string");
    }

    "Should resolve option properly"() {
        this.cli = CLI().addOption("test", {
            type: "boolean",
            default: false
        });

        should(this.cli.options.test).beFalse();
        this.cli.parse(["--test"]);
        should(this.cli.options.test).beTrue();
    }

    "Should show help properly"() {
        return new Promise(done => {
            const logStub = sinon.stub(console, "log", function(txt) {
                logStub.restore();
                should(txt).findString("--test");
                done();
            });
            
            this.cli = CLI().addOption("test", {
                type: "boolean",
                default: false
            });
            this.cli.showHelp();
        });
    }
    
    "Should show task properly"() {
        return new Promise(done => {
            this.cli = CLI();
            this.cli.parse(["--help"]);
            
            const logStub = sinon.stub(console, "log", function(txt) {
                logStub.restore();
                should(txt).findString("test:task");
                done();
            });
            const helpStub = sinon.stub(this.cli, "showHelp", function() {
                helpStub.restore();
                this.showHelp();
            });
            
            Sparky.task("test:task", () => {});
            Sparky.start("test:task");
        });
    }
} */
