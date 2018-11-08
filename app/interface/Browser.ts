import {WebFinder} from "./WebElements";
import {Condition} from "../src/lib/Condition";

export interface Browser extends WebFinder{
    get(url: string): Promise<any>;
    quit(): Promise<void>;
    wait(condition: Condition, timeout?: number, errorMessage?: string): Promise<string>;
}

