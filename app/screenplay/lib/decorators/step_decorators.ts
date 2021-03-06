import {getLogger, Logger}    from "@log4js-node/log4js-api";
import {Activity}             from "../../..";
import {ActivityLogEntryType} from "../../../packages/ActivityLog/ActivityLogEntry";
import {LogsActivity}         from "../../Actor";
import {stringReplace}        from "./decoratorStrings";

const createLogTask = <U extends LogsActivity, PT, RT>(
    description: string,
    activityDetails: string,
    activityType: ActivityLogEntryType) => {
    return function logTask(
        target: Activity<PT, RT>,
        propertyName: string,
        propertyDescriptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>): PropertyDescriptor {
        const logger: Logger = getLogger(target.constructor.name);
        const method = propertyDescriptor.value as () => Promise<RT>;

        target.toString = stringReplace(description);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // propertyDesciptor.value = function (...args: any): Promise<RT> {
        propertyDescriptor.value = function (actor: U, param?: PT): Promise<RT> {

            const logEntry = actor.activityLog.addActivityLogEntry(target.constructor.name,
                `${this.toString()}`,
                activityType, `running`);
            // @ts-ignore
            if (typeof logger.stepdetails == `function`) {
                // @ts-ignore
                logger.stepdetails(`${actor.name} ${activityDetails} ${this.toString()}`);
            } else {
                logger.debug(`${actor.name} ${activityDetails} ${this.toString()}`);
            }
            const arg = [actor, param];
            return method.apply(this, arg as [])
                .then((value: RT): RT => {
                    logEntry.status = `passed`;
                    actor.activityLog.reset(logEntry);
                    return value;
                })
                .catch((e: Error) => {
                    logEntry.status = `failed`;
                    return Promise.reject(e)
                });
        };

        return propertyDescriptor;
    }
};

export function stepDetails<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return createLogTask(text, `attempts to`, `Interaction`)
}

export function step<U extends LogsActivity, PT, RT>(text: string): (
    target: Activity<PT, RT>,
    propertyName: string,
    propertyDesciptor: TypedPropertyDescriptor<((actor: U, param?: PT) => Promise<RT>)>) => PropertyDescriptor {

    return createLogTask(text, `attempts to`, `Task`);
}