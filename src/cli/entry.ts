#!/usr/bin/env node

import * as yargs from "yargs";
import { FuseFileExecution } from './FuseFileExecution';

const SYSTEM_ARGS = ["boostrap", "snippet", "run"];

function extractParams(args){
    const primaryArgs = args._;
    const firstPrimaryArg = primaryArgs[0];
    return {
        primary : firstPrimaryArg,
        args : args,
        isSystemArgument : () => SYSTEM_ARGS.indexOf(firstPrimaryArg) > -1
    }
}
function initCLI() {
    const args = extractParams(yargs.args);
    if( !args.primary || !args.isSystemArgument() && FuseFileExecution.test()){
        return FuseFileExecution.init(args);
    }
}
initCLI();
