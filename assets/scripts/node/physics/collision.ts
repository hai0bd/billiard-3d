
import { Vec3 } from "cc"
import { Ball } from "../ball/Ball"
import { R } from "./constants"
import { BallState } from "../../Enum"

export class Collision {
  static willCollide(a: Ball, b: Ball, t: number): boolean {
    return (
      (a.inMotion() || b.inMotion()) &&
      a.onTable() &&
      b.onTable() &&
      a.futurePosition(t).distanceToSquared(b.futurePosition(t)) < 4 * R * R
    )
  }

  static collide(a: Ball, b: Ball) {
    return Collision.updateVelocities(a, b)
  }

  static positionsAtContact(a: Ball, b: Ball) {
    // const sep = a.pos.distanceTo(b.pos)
    const sep = Vec3.distance(a.pos, b.pos);
    const rv = a.vel.clone().subtract(b.vel)
    const t = (sep - 2 * R) / rv.length() || 0
    return {
      a: a.pos.clone().addScaledVector(a.vel, t),
      b: b.pos.clone().addScaledVector(b.vel, t),
    }
  }

  private static updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b)
    // a.ballmesh.trace.forceTrace(contact.a)
    // b.ballmesh.trace.forceTrace(contact.b)
    const ab = contact.b.subtract(contact.a).normalize()
    const aDotCenters = ab.dot(a.vel)
    const bDotCenters = ab.dot(b.vel)
    a.vel.addScaledVector(ab, bDotCenters).addScaledVector(ab, -aDotCenters)
    b.vel.addScaledVector(ab, aDotCenters).addScaledVector(ab, -bDotCenters)
    a.state = BallState.Sliding
    b.state = BallState.Sliding
    return Math.abs(aDotCenters) + Math.abs(bDotCenters)
  }
}
