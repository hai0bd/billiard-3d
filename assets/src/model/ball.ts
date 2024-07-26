import { Component, Vec3 } from "cc"
import { zero, vec, passesThroughZero, addScaledVector } from "../utils/utils"
import { forceRoll, rollingFull, sliding, surfaceVelocityFull, } from "../model/physics/physics"
import { BallMesh } from "../view/ballmesh"
import { Pocket } from "./physics/pocket"

export enum State {
  Stationary = "Stationary",
  Rolling = "Rolling",
  Sliding = "Sliding",
  Falling = "Falling",
  InPocket = "InPocket",
}

export class Ball extends Component {
  pos: Vec3;
  vel: Vec3 = new Vec3();
  rvel: Vec3 = new Vec3();
  futurePos: Vec3 = new Vec3();
  ballmesh: BallMesh
  state: State = State.Stationary
  pocket: Pocket

  public static id = 0
  readonly id = Ball.id++

  static readonly transition = 0.05

  /*   constructor(pos, color?) {
      this.pos = pos.clone()
      this.ballmesh = new BallMesh(color || 0xeeeeee * Math.random())
    }
   */
  init(pos, color) {
    this.pos = pos.clone()
    this.ballmesh = new BallMesh(color || 0xeeeeee * Math.random())

  }

  update(t) {
    this.updatePosition(t)
    if (this.state == State.Falling) {
      this.pocket.updateFall(this, t)
    } else {
      this.updateVelocity(t)
    }
  }

  updateMesh(t) {
    this.ballmesh.updateAll(this, t)
  }

  private updatePosition(t: number) {
    this.pos = addScaledVector(this.pos, this.vel, t);
  }

  private updateVelocity(t: number) {
    if (this.inMotion()) {
      if (this.isRolling()) {
        this.state = State.Rolling
        forceRoll(this.vel, this.rvel)
        this.addDelta(t, rollingFull(this.rvel))
      } else {
        this.state = State.Sliding
        this.addDelta(t, sliding(this.vel, this.rvel))
      }
    }
  }

  private addDelta(t, delta) {
    delta.v.multiplyScalar(t)
    delta.w.multiplyScalar(t)
    if (!this.passesZero(delta)) {
      this.vel.add(delta.v)
      this.rvel.add(delta.w)
    }
  }

  private passesZero(delta) {
    const vz = passesThroughZero(this.vel, delta.v)
    const wz = passesThroughZero(this.rvel, delta.w)
    const halts = this.state === State.Rolling ? vz || wz : vz && wz
    if (halts && Math.abs(this.rvel.z) < 0.01) {
      this.setStationary()
      return true
    }
    return false
  }

  setStationary() {
    this.vel = new Vec3();
    this.rvel = new Vec3();
    this.state = State.Stationary
  }

  isRolling() {
    return (
      this.vel.lengthSqr() !== 0 &&
      this.rvel.lengthSqr() !== 0 &&
      surfaceVelocityFull(this.vel, this.rvel).length() < Ball.transition
    )
  }

  onTable() {
    return this.state !== State.Falling && this.state !== State.InPocket
  }

  inMotion() {
    return (
      this.state === State.Rolling ||
      this.state === State.Sliding ||
      this.isFalling()
    )
  }

  isFalling() {
    return this.state === State.Falling
  }

  futurePosition(t) {
    this.futurePos = addScaledVector(this.pos.clone(), this.vel, t)
    return this.futurePos
  }

  serialise() {
    return {
      pos: this.pos.clone(),
      id: this.id,
    }
  }
}
