import {DesiredCapabilities, ServerConfig, Browser, ClientHelper, RunningBrowser} from "../../..";
import {setBrowserStackSessionName, standardCapabilities, standardServerConfig}   from "../../0_helper/config";
import {cloneDeep}                                                                from "lodash";

describe(`using the browser instance`, (): void => {

    const conf: ServerConfig = cloneDeep(standardServerConfig);
    const capabilities: DesiredCapabilities = cloneDeep(standardCapabilities);
    setBrowserStackSessionName(capabilities, `attach_session_spec.ts`);

    if (conf.serverAddress) {
        conf.serverAddress.path = `/wd/hub/`;
        conf.serverAddress.protocol = `http`;
        conf.serverAddress.port = 4444;
    }

    let origBrowser: Browser;

    beforeAll((): void => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
    });

    describe(`to attach to an existing session`, (): void => {
        beforeAll((): void => {
            origBrowser = ClientHelper.create(conf, capabilities)
        });

        afterAll(async (): Promise<void[]> => {
            await RunningBrowser.cleanup().catch((): Promise<void[]> => {
                return Promise.resolve([]);
            });

            return ClientHelper.cleanup([], true)
        });

        it(`should open a new URL an the existing session 
        - (test case id: cc3ff7b5-13c8-4870-9aed-545ad389a887)`, async (): Promise<void> => {
            const testUrl = `https://www.google.de/`;
            await origBrowser.get(testUrl);

            expect(await origBrowser.getCurrentUrl()).toEqual(testUrl);

            const session = await origBrowser.getSession();
            const id = await session.getId();

            const secondBrowser = ClientHelper.attachToSession(conf, capabilities, id, `test`,);

            const testUrl2 = `https://www.google.com/`;
            await secondBrowser.get(testUrl2);
            expect(await secondBrowser.getCurrentUrl()).toEqual(testUrl2);
            expect(await origBrowser.getCurrentUrl()).toEqual(testUrl2);
        });
    });
});