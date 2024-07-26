import { FourteenOne } from "../../src/rules/fourteenone"
import { NineBall } from "../../src/rules/nineball"
import { Snooker } from "../../src/rules/snooker"
import { ThreeCushion } from "../../src/rules/threecushion"

export class RuleFactory {
    static create(ruletype, container) {
        switch (ruletype) {
            case "threecushion":
                return new ThreeCushion(container)
            case "fourteenone":
                return new FourteenOne(container)
            case "snooker":
                return new Snooker(container)
            default:
                return new NineBall(container)
        }
    }
}
