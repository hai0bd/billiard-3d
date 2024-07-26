import { State } from "../model/ball"
import { Ball } from "../../scripts/Ball"
import { TableGeometry } from "../view/tablegeometry"
import { Vec3 } from "cc"
import { addScaledVector, roundVec, vec } from "./utils"
import { R } from "../model/physics/constants"
import { Table } from "../model/table"

export class Rack {
  static readonly noise = R * 0.024
  static readonly gap = 2 * R + 2 * Rack.noise
  static readonly up = new Vec3(0, 0, -1)
  static readonly spot = new Vec3(-TableGeometry.X / 2, 0.0, 0)
  static readonly across = new Vec3(0, Rack.gap, 0)
  static readonly down = new Vec3(Rack.gap, 0, 0)
  static readonly diagonal = Rack.across
    .clone()
    .applyAxisAngle(Rack.up, (Math.PI * 1) / 3)

  private static jitter(pos) {
    return roundVec(
      pos.clone().add(new Vec3(Rack.noise * (Math.random() - 0.5), Rack.noise * (Math.random() - 0.5), 0))
    )
  }

  static cueBall(pos) {
    return new Ball(Rack.jitter(pos), 0xfaebd7)
  }

  static diamond() {
    const pos = new Vec3(TableGeometry.tableX / 2, 0, 0)
    const diamond: Ball[] = []
    diamond.push(Rack.cueBall(Rack.spot))
    diamond.push(new Ball(Rack.jitter(pos), 0xe0de36))
    pos.add(Rack.diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 0xff9d00))
    pos.subtract(Rack.across)
    diamond.push(new Ball(Rack.jitter(pos), 0x521911))
    pos.add(Rack.diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 0x595200))
    pos.subtract(Rack.across)
    diamond.push(new Ball(Rack.jitter(pos), 0xff0000))
    addScaledVector(pos, Rack.across, 2)
    diamond.push(new Ball(Rack.jitter(pos), 0x050505))
    pos.add(Rack.diagonal).subtract(Rack.across)
    diamond.push(new Ball(Rack.jitter(pos), 0x0a74c2))
    pos.subtract(Rack.across)
    diamond.push(new Ball(Rack.jitter(pos), 0x087300))
    pos.add(Rack.diagonal)
    diamond.push(new Ball(Rack.jitter(pos), 0x3e009c))
    return diamond
  }

  static triangle() {
    const tp = Rack.trianglePositions()
    const cueball = Rack.cueBall(Rack.spot)
    const triangle = tp.map((p) => new Ball(Rack.jitter(p)))
    triangle.unshift(cueball)
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
    addScaledVector(pos, this.across, 2)
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
      .filter((b) => b !== table.cueball)
      .filter((b) => b !== key)
      .forEach((b) => {
        b.pos.copy(Rack.jitter(tp.shift()))
        b.state = State.Stationary
      })
    if (table.overlapsAny(key.pos, key)) {
      key.pos.copy(first)
    }
    if (table.overlapsAny(table.cueball.pos)) {
      table.cueball.pos.copy(Rack.spot)
    }
  }

  static three() {
    const threeballs: Ball[] = []
    const dx = TableGeometry.X / 2
    const dy = TableGeometry.Y / 4
    threeballs.push(Rack.cueBall(Rack.jitter(new Vec3(-dx, -dy, 0))))
    threeballs.push(new Ball(Rack.jitter(new Vec3(-dx, 0, 0)), 0xe0de36))
    threeballs.push(new Ball(Rack.jitter(new Vec3(dx, 0, 0)), 0xff0000))
    return threeballs
  }

  static readonly sixth = (TableGeometry.Y * 2) / 6
  static readonly baulk = (-1.5 * TableGeometry.X * 2) / 5

  static snooker() {
    const balls: Ball[] = []
    const dy = TableGeometry.Y / 4
    balls.push(Rack.cueBall(Rack.jitter(new Vec3(Rack.baulk, -dy * 0.5, 0))))

    const colours = Rack.snookerColourPositions()
    balls.push(new Ball(Rack.jitter(colours[0]), 0xeede36))
    balls.push(new Ball(Rack.jitter(colours[1]), 0x0c9664))
    balls.push(new Ball(Rack.jitter(colours[2]), 0xbd723a))
    balls.push(new Ball(Rack.jitter(colours[3]), 0x0883ee))
    balls.push(new Ball(Rack.jitter(colours[4]), 0xffaacc))
    balls.push(new Ball(Rack.jitter(colours[5]), 0x010101))

    // change to 15 red balls
    const triangle = Rack.trianglePositions().slice(0, 15)
    triangle.forEach((p) => {
      balls.push(new Ball(Rack.jitter(p.add(Rack.down)), 0xee0000))
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
