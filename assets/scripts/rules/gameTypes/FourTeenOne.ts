import { GameControl } from "../../GameControl";
import { Ball } from "../../node/ball/Ball";
import { Table } from "../../node/table/Table";
import { Rack } from "../Rack";
import { Rules } from "../Rules";
import { NineBall } from "./NineBall";

export class FourteenOne extends NineBall implements Rules{    
    constructor(game: GameControl){
        super(game);
        this.rulename = "fourteenone";
    }

    override asset(): string {
        return "models/p8.min.gltf";
    }
    override rack(): Ball[] {
        return Rack.triangle();
    }
}