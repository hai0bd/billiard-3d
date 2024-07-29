import { Vec3 } from "cc";
import { GameControl } from "../../GameControl";
import { Ball } from "../../node/ball/Ball";
import { Table } from "../../node/table/Table";
import { TableGeometry } from "../../node/table/TableGeometry";
import { newTable } from "../../utils/constructor";
import { Rack } from "../Rack";
import { Rules } from "../Rules";
import { R } from "../../node/physics/constants";
import { Respot } from "../Respot";

export class NineBall implements Rules{
    readonly game: GameControl;

    cueball: Ball
    currentBreak = 0
    previousBreak = 0
    score = 0
    rulename = "nineball"

    constructor(game){
        this.game = game;
    }
    rack(): Ball[] {
        return Rack.diamond();
    }
    tableGeometry() {
        TableGeometry.hasPockets = true;
    }
    table(): Table {
        const table = newTable(this.rack());
        this.cueball = table.cueBall;
        return table;
    }
    secondToPlay() {
        // only for ThreeCushion 
    }
    otherPlayersCueBall(): Ball {
        // only for three cushion
        return this.cueball
    }
    allowsPlaceBall(): boolean {
        return true;
    }
    placeBall(target?: Vec3): Vec3 {
        if (target) {
            const max = new Vec3(-TableGeometry.X / 2, TableGeometry.tableY)
            const min = new Vec3(-TableGeometry.tableX, -TableGeometry.tableY)
            return target.clampf(min, max);
        }
        return new Vec3((-R * 11) / 0.5, 0, 0)
    }
    asset(): string {
        return "models/p8.min.gltf";
    }
    nextCandidateBall() {
        return Respot.closest(
            this.game.table.cueBall,
            this.game.table.balls
        )
    }
    startTurn() {
        this.previousBreak = this.currentBreak;
        this.currentBreak = 0;
    }

}