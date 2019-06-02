/**
 * Action to hover over a web element
 */

import {BrowseTheWeb, Interaction, SppWebElementFinder} from "../../../index";
import {stepDetails}                                    from "../../lib/decorators/StepDecorators";
import {SppWebElementListFinder}                        from "../SppWebElements";
import {UsesAbilities}                                  from "../../Actor";

export class Hover implements Interaction<void, void> {

    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`hover over element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return BrowseTheWeb.as(actor).findElement(this.element).hover();
    }

    /**
     * specify which element should be hovered over
     * @param element - the SPP Element
     */
    public static over(element: SppWebElementFinder | SppWebElementListFinder): Hover {
        return new Hover(element as SppWebElementFinder);
    }

    /**
     * @ignore
     */
    private constructor(public element: SppWebElementFinder) {
    }
}