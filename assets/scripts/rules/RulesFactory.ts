import { RulesType } from "../Enum";
import { FourteenOne } from "./gameTypes/FourTeenOne";
import { GameControl } from "../GameControl";
import { NineBall } from "./gameTypes/NineBall";
import { Snooker } from "./gameTypes/Snooker";
import { ThreeCushion } from "./gameTypes/ThreeCushion";

export class RuleFactory{
    static create(ruleType: RulesType, game: GameControl){
        switch(ruleType){
            case "threecushion":
                return new ThreeCushion(game)
            case "fourteenone":
                return new FourteenOne(game)
            case "snooker":
                return new Snooker(game)
            default:
                return new NineBall(game)
        }
    }
}