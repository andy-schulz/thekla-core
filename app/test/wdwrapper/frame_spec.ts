import {
    Browser, Config, BrowserFactory, By, UntilElement
} from "../..";

const conf: Config = {
    browserName: "chrome",
    serverUrl: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000"
};



describe('trying to access a Frame', () => {
    let browser: Browser;

    beforeAll(() => {
        browser = BrowserFactory.create(conf);
    });

    afterAll(async () => {
        await BrowserFactory.cleanup();
    });

    describe('on the first Level by', () => {

        it('css -> the frame should be found.', async () => {
            const frame = browser.frame(By.css(".button-in-single-frame"));
            const button = frame.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);

            expect(await button.getText()).toEqual("Button inside single frame");
        }, 20000);

        it('css and explicit waiting -> the frame should be found.', async () => {
            const frame = browser.frame(By.css(".button-in-single-frame"))
                .shallWait(UntilElement.isVisible().forAsLongAs(5000));
            const button = frame.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button.getText()).toEqual("Button inside single frame");
            // expect(await button.getText()).toEqual("Button inside single frame");
        }, 20000);
    });

    describe(`on the second Level by`, () => {

        it('css -> the button in frame of frame should be found.', async () => {
            const frame1 = browser.frame(By.css(".button-in-single-frame"));
            const frame21 = browser.frame(By.css(".button-in-two-frames"));
            const frame22 = frame21.frame(By.css(".button-in-single-frame"));

            const button1 = frame1.element(By.css(".btn-secondary"));
            const button2 = frame22.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button2.getText()).toEqual("Button nested inside frame of frame");

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual("Button inside single frame");
        }, 20000);


        it('css and explicit waiting -> the button in frame of frame should be found.', async () => {
            const frame1 = browser.frame(By.css(".button-in-single-frame"));
            const frame21 = browser.frame(By.css(".button-in-two-frames"));
            const frame22 = frame21.frame(By.css(".button-in-single-frame"))
                .shallWait(UntilElement.isVisible());

            const button1 = frame1.element(By.css(".btn-secondary"));
            const button2 = frame22.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button2.getText()).toEqual("Button nested inside frame of frame");

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual("Button inside single frame");
        }, 20000);

        it('css and explicit waiting -> all buttons, inside and outside of frames should be found.', async () => {
            const button = browser.element(By.css(".buttonoutsideframes button"));

            const frame1 = browser.frame(By.css(".button-in-single-frame"));
            const frame21 = browser.frame(By.css(".button-in-two-frames"));
            const frame22 = frame21.frame(By.css(".button-in-single-frame"))
                .shallWait(UntilElement.isVisible());

            const button1 = frame1.element(By.css(".btn-secondary"));
            const button2 = frame22.element(By.css(".btn-secondary"));

            await browser.get(`/nestedFrames`);
            expect(await button.getText()).toEqual("Button outside of Frame");
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button2.getText()).toEqual("Button nested inside frame of frame");

            // try to access the first button again to check that the frameswitch works
            expect(await button1.getText()).toEqual("Button inside single frame");
            expect(await button.getText()).toEqual("Button outside of Frame");
        }, 20000);


    });
});