export declare type Step = {
    name?: string;
    choices: Array<Step | any> | any;
    type?: string;
    message?: string;
    default?: boolean;
    when?: Function;
    value?: any;
    checked?: boolean;
};
export declare class Builder {
    config: any;
    Fluent: any;
    gatherer: Gatherer;
    constructor(fsbx: any);
    stepper(): void;
}
export declare class Gatherer {
    data: Object;
    steps: Array<Step> | any;
    indx: number;
    stepper(): void;
    thenner(): void;
}
export default Builder;
