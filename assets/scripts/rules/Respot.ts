import { Vec3 } from "cc"
import { Ball } from "../node/ball/Ball"
import { Table } from "../node/table/Table"
import { Rack } from "./Rack"
import { BallState } from "../Enum"
import { TableGeometry } from "../node/table/TableGeometry"
import { R } from "../node/physics/constants"

export class Respot {
    static respot(ball: Ball, table: Table) {
        const positions = Rack.snookerColourPositions()
        positions.push(positions[ball.id - 1])
        positions.reverse()

        const placed = positions.some((p) => {
            if (!table.overlapsAny(p, ball)) {
                ball.pos = new Vec3(p);
                ball.state = BallState.Stationary
                return true
            }
            return false
        })
        if (!placed) {
            Respot.respotBehind(positions[0], ball, table)
        }
        return ball
    }

    static respotBehind(targetpos, ball, table) {
        const pos = targetpos.clone()
        while (pos.x < TableGeometry.tableX && table.overlapsAny(pos, ball)) {
            pos.x += R / 8
        }
        while (pos.x > -TableGeometry.tableX && table.overlapsAny(pos, ball)) {
            pos.x -= R / 8
        }
        ball.pos.copy(pos)
        ball.state = BallState.Stationary
    }

    static closest(cueball: Ball, balls: Ball[]) {
        const onTable = balls
            .filter((ball) => ball.onTable())
            .filter((ball) => ball !== cueball)
        if (onTable.length === 0) {
            return
        }
        const distanceToCueBall = (b) => {
            // return cueball.pos.distanceTo(b.pos)
            return Vec3.distance(cueball.pos, b.pos);
        }
        return onTable.reduce(
            (a, b) => (distanceToCueBall(a) < distanceToCueBall(b) ? a : b),
            onTable[0]
        )
    }
}
