export class SparkTask {
    public parallelDependencies: string[] = [];
    public waterfallDependencies: string[] = [];

    constructor(public name: string, dependencies: string[], public fn: any) {
        dependencies.forEach(dependency => {
            if (dependency.charAt(0) === "&") {
                dependency = dependency.slice(1);
                this.parallelDependencies.push(dependency);
            } else {
                this.waterfallDependencies.push(dependency);
            }
        });
    }
}
