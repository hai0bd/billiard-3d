import { Vec3 } from "cc";
import { GameControl } from "../../GameControl";
import { Ball } from "../../node/ball/Ball";
import { Rules } from "../Rules";
import { Table } from "../../node/table/Table";
import { Respot } from "../Respot";
import { TableGeometry } from "../../node/table/TableGeometry";
import { R } from "../../node/physics/constants";
import { newTable } from "../../utils/constructor";

export class ThreeCushion implements Rules{
    readonly game: GameControl;

    cueball: Ball
    currentBreak = 0
    previousBreak = 0
    score = 0
    rulename = "snooker"

    constructor(game: GameControl){
        this.game = game;
    }

    rack(): Ball[] {
        throw new Error("Method not implemented.");
    }
    tableGeometry() {
        TableGeometry.tableX = R * 49
        TableGeometry.tableY = R * 24
        TableGeometry.X = TableGeometry.tableX + R
        TableGeometry.Y = TableGeometry.tableY + R
        TableGeometry.hasPockets = false
    }
    table(): Table {
        this.tableGeometry()
        // CameraTop.zoomFactor = 0.92
        const table = newTable(this.rack())
        this.cueball = table.cueBall
        return table
    }
    secondToPlay() {
        this.cueball = this.game.table.balls[1]
    }
    otherPlayersCueBall(): Ball {
        const balls = this.game.table.balls
        return this.cueball === balls[0] ? balls[1] : balls[0]
    }
    allowsPlaceBall(): boolean {
        return false;
    }
    placeBall(target?: Vec3): Vec3 {
        return Vec3.ZERO;
    }
    asset(): string {
        return "models/threecushion.min.gltf"
    }
    nextCandidateBall() {
        return Respot.closest(
            this.game.table.cueBall,
            this.game.table.balls
        )
    }
    startTurn() {
        // not used
    }
    
}