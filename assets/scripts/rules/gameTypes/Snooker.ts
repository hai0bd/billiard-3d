import { Vec3 } from "cc";
import { GameControl } from "../../GameControl";
import { Ball } from "../../node/ball/Ball";
import { Table } from "../../node/table/Table";
import { TableGeometry } from "../../node/table/TableGeometry";
import { newTable } from "../../utils/constructor";
import { Rules } from "../Rules";
import { Rack } from "../Rack";

export class Snooker implements Rules{
    readonly game: GameControl;

    cueball: Ball
    previousPotRed = false
    targetIsRed = true
    currentBreak = 0
    previousBreak = 0
    foulPoints = 0
    score = 0
    rulename = "snooker"

    static readonly tablemodel = "models/d-snooker.min.gltf"

    constructor(game: GameControl) {
        this.game = game;
    }

    rack(): Ball[] {
        throw new Error("Method not implemented.");
    }
    tableGeometry() {
        TableGeometry.hasPockets = true;
    }
    table(): Table {
        const table = newTable(this.rack())
        this.cueball = table.cueBall
        return table
    }
    secondToPlay() {
        // only for three cushion
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
            // constrain to "D"
            const centre = new Vec3(Rack.baulk, 0, 0)
            const radius = Rack.sixth
            const distance = Vec3.distance(target, centre);
            if (target.x >= Rack.baulk) {
                target.x = Rack.baulk
            }
            if (distance > radius) {
                const direction = target.clone().subtract(centre).normalize()
                return centre.add(direction.multiplyScalar(radius))
            } else {
                return target
            }
        }
        return new Vec3(Rack.baulk, -Rack.sixth / 2.6, 0)
    }
    asset(): string {
        return Snooker.tablemodel;
    }
    nextCandidateBall() {
        throw new Error("Method not implemented.");
    }
    startTurn() {
        this.previousPotRed = false
        // this.targetIsRed = SnookerUtils.redsOnTable(this.game.table).length > 0
        this.previousBreak = this.currentBreak
        this.score += this.currentBreak
        this.currentBreak = 0
        // this.game.hud.updateBreak(this.currentBreak)
    }
    
}