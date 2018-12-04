import {
    Actor, BrowserFactory, BrowseTheWeb, By, Click, Config, element, Enter, Key, Navigate, See, Text, UntilElement
} from "../..";

class GooglePgo {
    // define your elements in a page object
    public static searchField = element(By.css("[name='q']"))
        .shallWait(UntilElement.isVisible().forAsLongAs(5000))
        .called("The Google search field");

    public static submitSearch = element(By.css(".FPdoLc [name='btnK']"))
        .called("The Google Submit Search button on the main Page");

    public static calculatorInput = element(By.css("#cwos"))
        .called("Google calculator input field")
        .shallWait(UntilElement.isVisible().forAsLongAs(5000));
}

describe('Using Google Search to find an online calculator', () => {
    const conf: Config = {
        browserName: "chrome",
        serverUrl: "http://localhost:4444/wd/hub",
    };
    describe('with the screenplay pattern implementation,', () => {
        // define your actor
        const philipp = Actor.named("Philipp");
        // and give him the ability to browse the web using a browser of your choice
        philipp.whoCan(BrowseTheWeb.using(BrowserFactory.create(conf)));

        // using the jasmine matcher for our checks on the UI
        const match = (expected: string) => (actual: string) => expect(actual).toEqual(expected);

        it('the google calculator should be loaded', async () => {
            return philipp.attemptsTo(
                Navigate.to("http://www.google.com"),
                Enter.value("calculator").into(GooglePgo.searchField),
                Enter.value(Key.TAB).into(GooglePgo.searchField),
                Click.on(GooglePgo.submitSearch),
                See.if(Text.of(GooglePgo.calculatorInput)).fulfills(match("0"))
            )
        }, 20000);
    });

    afterAll(async () => {
        // close all Browsers which were created during the test
        await BrowserFactory.cleanup();
    })
});
