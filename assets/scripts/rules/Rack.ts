import { Vec3 } from "cc"
import { R } from "../node/physics/constants"
import { Ball } from "../node/ball/Ball"
import { roundVec, vec } from "../utils/utils"
import { Table } from "../node/table/Table"
import { BallState } from "../Enum"
import { GameManager } from "../GameManager"
import { TableGeometry } from "../node/table/TableGeometry"

export class Rack {
    static readonly noise = R * 0.024
    static readonly gap = 2 * R + 2 * Rack.noise
    static readonly up = new Vec3(0, 0, -1)
    static readonly spot = new Vec3(-TableGeometry.X / 2, 0.0, 0)
    static readonly across = new Vec3(0, Rack.gap, 0)
    static readonly down = new Vec3(Rack.gap, 0, 0)
    static readonly diagonal = Rack.across.clone().applyAxisAngle(Rack.up, (Math.PI * 1) / 3)

    private static jitter(pos) {
        return roundVec(
            pos.clone().add(
                new Vec3(
                    Rack.noise * (Math.random() - 0.5),
                    Rack.noise * (Math.random() - 0.5),
                    0
                )
            )
        )
    }

    static cueBall(pos) {
        const ballMatls = GameManager.instance.ballMaterials;
        // return new Ball(Rack.jitter(pos), 0xfaebd7) // kem nhạt (bi cái)
        return new Ball(pos, ballMatls.white);
    }

    static diamond() {
        const pos = new Vec3(TableGeometry.tableX / 2, 0, 0)
        const diamond: Ball[] = []
        const ballMatls = GameManager.instance.ballMaterials;
        diamond.push(Rack.cueBall(Rack.spot))
        // diamond.push(new Ball(Rack.jitter(pos), 0xe0de36)) // vàng chanh
        diamond.push(new Ball(pos, ballMatls.yellow));
        pos.add(Rack.diagonal)
        // diamond.push(new Ball(Rack.jitter(pos), 0xff9d00)) // cam cháy
        diamond.push(new Ball(pos, ballMatls.orange));
        pos.subtract(Rack.across)
        // diamond.push(new Ball(Rack.jitter(pos), 0x521911)) // nâu đỏ
        diamond.push(new Ball(pos, ballMatls.red));
        pos.add(Rack.diagonal)
        // diamond.push(new Ball(Rack.jitter(pos), 0x595200)) // xanh lá sẫm
        diamond.push(new Ball(pos, ballMatls.green));
        pos.subtract(Rack.across)
        // diamond.push(new Ball(Rack.jitter(pos), 0xff0000)) // đỏ lửa
        diamond.push(new Ball(pos, ballMatls.red));
        pos.addScaledVector(Rack.across, 2)
        // diamond.push(new Ball(Rack.jitter(pos), 0x050505)) // đen
        diamond.push(new Ball(pos, ballMatls.black));
        pos.add(Rack.diagonal).subtract(Rack.across)
        // diamond.push(new Ball(Rack.jitter(pos), 0x0a74c2)) // xanh dương đậm
        diamond.push(new Ball(pos, ballMatls.darkBlue));
        pos.subtract(Rack.across)
        // diamond.push(new Ball(Rack.jitter(pos), 0x087300)) // xanh lá đậm
        diamond.push(new Ball(pos, ballMatls.darkGreen));
        pos.add(Rack.diagonal)
        // diamond.push(new Ball(Rack.jitter(pos), 0x3e009c)) // tím than
        diamond.push(new Ball(pos, ballMatls.purple));
        return diamond
    }

    static triangle() {
        const tp = Rack.trianglePositions()
        const cueBall = Rack.cueBall(Rack.spot)
        const triangle = tp.map((p) => new Ball(Rack.jitter(p)))
        triangle.unshift(cueBall)
        return triangle.slice(0, 5)
    }

    static trianglePositions() {
        const triangle: Vec3[] = []
        const pos = new Vec3(TableGeometry.X / 2, 0, 0)
        triangle.push(vec(pos))
        // row 2
        pos.add(this.diagonal)
        triangle.push(vec(pos))
        pos.subtract(this.across)
        triangle.push(vec(pos))
        // row 3
        pos.add(this.diagonal)
        triangle.push(vec(pos))
        pos.subtract(this.across)
        triangle.push(vec(pos))
        pos.addScaledVector(this.across, 2)
        triangle.push(vec(pos))
        // row 4
        pos.add(this.diagonal)
        triangle.push(vec(pos))
        pos.subtract(this.across)
        triangle.push(vec(pos))
        pos.subtract(this.across)
        triangle.push(vec(pos))
        pos.subtract(this.across)
        triangle.push(vec(pos))
        // row 5
        pos.add(this.diagonal).subtract(this.across)
        triangle.push(vec(pos))
        pos.add(this.across)
        triangle.push(vec(pos))
        pos.add(this.across)
        triangle.push(vec(pos))
        pos.add(this.across)
        triangle.push(vec(pos))
        pos.add(this.across)
        triangle.push(vec(pos))

        return triangle
    }

    static rerack(key: Ball, table: Table) {
        const tp = Rack.trianglePositions()
        const first = tp.shift()!
        table.balls
            .filter((b) => b !== table.cueBall)
            .filter((b) => b !== key)
            .forEach((b) => {
                b.pos = new Vec3(Rack.jitter(tp.shift()))
                b.state = BallState.Stationary
            })
        if (table.overlapsAny(key.pos, key)) {
            key.pos = new Vec3(first)
        }
        if (table.overlapsAny(table.cueBall.pos)) {
            table.cueBall.pos = new Vec3(Rack.spot)
        }
    }

    static three() {
        const threeballs: Ball[] = []
        const dx = TableGeometry.X / 2
        const dy = TableGeometry.Y / 4

        const ballMatls = GameManager.instance.ballMaterials;
        threeballs.push(Rack.cueBall(Rack.jitter(new Vec3(-dx, -dy, 0))))
        // threeballs.push(new Ball(Rack.jitter(new Vec3(-dx, 0, 0)), 0xe0de36)) // vàng chanh
        threeballs.push(new Ball(Rack.jitter(new Vec3(-dx, 0, 0)), ballMatls.yellow))
        // threeballs.push(new Ball(Rack.jitter(new Vec3(dx, 0, 0)), 0xff0000)) // đỏ lửa
        threeballs.push(new Ball(Rack.jitter(new Vec3(dx, 0, 0)), ballMatls.red))
        return threeballs
    }

    static readonly sixth = (TableGeometry.Y * 2) / 6
    static readonly baulk = (-1.5 * TableGeometry.X * 2) / 5

    static snooker() {
        const balls: Ball[] = []
        const dy = TableGeometry.Y / 4
        balls.push(Rack.cueBall(Rack.jitter(new Vec3(Rack.baulk, -dy * 0.5, 0))))

        const ballMatls = GameManager.instance.ballMaterials;
        const colours = Rack.snookerColourPositions()
        // balls.push(new Ball(Rack.jitter(colours[0]), 0xeede36)) // vàng chanh
        balls.push(new Ball(Rack.jitter(colours[0]), ballMatls.yellow)) 
        // balls.push(new Ball(Rack.jitter(colours[1]), 0x0c9664)) // xanh lá đậm
        balls.push(new Ball(Rack.jitter(colours[1]), ballMatls.darkGreen)) 
        // balls.push(new Ball(Rack.jitter(colours[2]), 0xbd723a)) // nâu đỏ
        balls.push(new Ball(Rack.jitter(colours[2]), ballMatls.brown)) 
        // balls.push(new Ball(Rack.jitter(colours[3]), 0x0883ee)) // xanh dương
        balls.push(new Ball(Rack.jitter(colours[3]), ballMatls.blue)) 
        // balls.push(new Ball(Rack.jitter(colours[4]), 0xffaacc)) // hồng nhạt
        balls.push(new Ball(Rack.jitter(colours[4]), ballMatls.pink)) 
        // balls.push(new Ball(Rack.jitter(colours[5]), 0x010101)) // đen
        balls.push(new Ball(Rack.jitter(colours[5]), ballMatls.black)) 

        // change to 15 red balls
        const triangle = Rack.trianglePositions().slice(0, 15)
        triangle.forEach((p) => {
            // balls.push(new Ball(Rack.jitter(p.add(Rack.down)), 0xee0000)) // đỏ lửa
            balls.push(new Ball(Rack.jitter(p.add(Rack.down)), ballMatls.red))
        })
        return balls
    }

    static snookerColourPositions() {
        const dx = TableGeometry.X / 2
        const black = TableGeometry.X - (TableGeometry.X * 2) / 11
        const positions: Vec3[] = []
        positions.push(new Vec3(Rack.baulk, -Rack.sixth, 0))
        positions.push(new Vec3(Rack.baulk, Rack.sixth, 0))
        positions.push(new Vec3(Rack.baulk, 0, 0))
        positions.push(new Vec3(0, 0, 0))
        positions.push(new Vec3(dx, 0, 0))
        positions.push(new Vec3(black, 0, 0))
        return positions
    }
}
