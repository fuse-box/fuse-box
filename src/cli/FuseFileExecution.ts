export class FuseFileExecution {
    constructor(public args : any) {}

    public static test(){
        console.log(process.cwd());
    }
    public static init(args : any){
        return new FuseFileExecution(args);
    }
}