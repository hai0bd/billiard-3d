import { Vec3 } from "cc"
import { Ball, State } from "../ball"
import { R } from "./constants"
import { addScaledVector } from "../../utils/utils"

export class Collision {
  static willCollide(a: Ball, b: Ball, t: number): boolean {
    const futurePositionA = a.futurePosition(t);
    const futurePositionB = b.futurePosition(t);

    const distanceSquared = futurePositionA.subtract(futurePositionB).lengthSqr();
    const radiusSquared = 4 * R * R;

    return a.inMotion() && b.inMotion() && a.onTable() && b.onTable() && distanceSquared < radiusSquared;
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
      /* a: a.pos.clone().addScaledVector(a.vel, t),
      b: b.pos.clone().addScaledVector(b.vel, t), */
      a: addScaledVector(a.pos, a.vel, t),
      b: addScaledVector(b.pos, b.vel, t)
    }
  }

  private static updateVelocities(a: Ball, b: Ball) {
    const contact = Collision.positionsAtContact(a, b)
    a.ballmesh.trace.forceTrace(contact.a)
    b.ballmesh.trace.forceTrace(contact.b)
    const ab = contact.b.subtract(contact.a).normalize()
    const aDotCenters = ab.dot(a.vel)
    const bDotCenters = ab.dot(b.vel)
    // a.vel.addScaledVector(ab, bDotCenters).addScaledVector(ab, -aDotCenters)
    a.vel = addScaledVector(addScaledVector(a.vel, ab, bDotCenters), ab, -aDotCenters);
    // b.vel.addScaledVector(ab, aDotCenters).addScaledVector(ab, -bDotCenters)
    b.vel = addScaledVector(addScaledVector(b.vel, ab, aDotCenters), ab, -bDotCenters);
    a.state = State.Sliding
    b.state = State.Sliding
    return Math.abs(aDotCenters) + Math.abs(bDotCenters)
  }
}
