import {
    Browser,
    DesiredCapabilities,
    ServerConfig,
    Actor,
    RunningBrowser,
    BrowseTheWeb,
    Navigate,
    Drag,
    SppWebElementFinder,
    By,
    element,
    See, Expected, Text, UntilElement
} from "../../..";
import {standardCapabilities, standardServerConfig} from "../../0_helper/config";

describe(`Drag an Element`, (): void => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

    const conf: ServerConfig = standardServerConfig;
    const caps: DesiredCapabilities = standardCapabilities;

    let theBrowser: Browser;
    let Donnie: Actor;

    let element0: SppWebElementFinder,
        element1: SppWebElementFinder,
        dragIndicator: SppWebElementFinder;

    beforeAll((): void => {
        theBrowser = RunningBrowser.startedOn(conf).withCapabilities(caps);
        Donnie = Actor.named(`Donnie`);
        Donnie.whoCan(BrowseTheWeb.using(theBrowser));

        element0 = element(By.css(`[data-test-id='item-0']`)).called(`draggable item 0`);
        element1 = element(By.css(`[data-test-id='item-1']`)).called(`draggable item 1`);
        dragIndicator = element(By.css(`[data-text-id='EventDetails']`))
            .called(`The dragNDrop Indicator`)
            .shallWait(UntilElement.is.visible());
    });

    afterAll((): Promise<void[]> => {
        return RunningBrowser.cleanup();
    });

    describe(`onto another element`, (): void => {
        it(`should move the element to the new position 
        - (test case id: 17daa294-72a1-421a-a4c1-a8c3821b1a37)`, async (): Promise<void> => {

            await Navigate.to(`/dragndrop`).performAs(Donnie);

            await Drag.element(element0).toElement(element1).performAs(Donnie);

            await See.if(Text.of(dragIndicator))
                .is(Expected.toBe(`Element item-0 was moved from position 0 to position 1`))
                .repeatFor(5, 1000)
                .performAs(Donnie)
        });
    });
});