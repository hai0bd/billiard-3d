import { _decorator, Component, Node, Vec3 } from 'cc';
import { Ball } from './Ball';
import { R } from '../src/model/physics/constants';
import { TableGeometry } from '../src/view/tablegeometry';
import { Cushion } from '../src/model/physics/cushion';
import { Outcome } from '../src/model/outcome';
import { Knuckle } from '../src/model/physics/knuckle';
import { Pocket } from '../src/model/physics/pocket';
import { PocketGeometry } from '../src/view/pocketgeometry';
import { Collision } from '../src/model/physics/collision';
import { Cue } from '../src/view/cue';
import { bounceHanBlend } from '../src/model/physics/physics';
const { ccclass, property } = _decorator;

interface Pair {
    a: Ball
    b: Ball
}

@ccclass('Table')
export class Table extends Component {
    balls: Ball[]
    // cue = new Cue()
    pairs: Pair[]
    // outcome: Outcome[] = []
    cueball: Ball
    cushionModel = bounceHanBlend
    mesh

    init(balls: Ball[]) {
        this.cueball = balls[0]
        this.initialiseBalls(balls)
    }

    initialiseBalls(balls: Ball[]) {
        this.balls = balls
        this.pairs = []
        for (let a = 0; a < balls.length; a++) {
            for (let b = 0; b < balls.length; b++) {
                if (a < b) {
                    this.pairs.push({ a: balls[a], b: balls[b] })
                }
            }
        }
    }

    updateBallMesh(t) {
        this.balls.forEach((a) => {
            a.updateMesh(t)
        })
    }

    advance(t: number) {
        let depth = 0
        while (!this.prepareAdvanceAll(t)) {
            if (depth++ > 100) {
                throw new Error("Depth exceeded resolving collisions")
            }
        }
        this.balls.forEach((a) => {
            a.update(t)
        })
    }

    /*
     * Returns true if all balls can advance by t without collision
     *
     */
    prepareAdvanceAll(t: number) {
        return (
            this.pairs.every((pair) => this.prepareAdvancePair(pair.a, pair.b, t)) &&
            this.balls.every((ball) => this.prepareAdvanceToCushions(ball, t))
        )
    }

    /**
     * Returns true if a pair of balls can advance by t without any collision.
     * If there is a collision, adjust velocity appropriately.
     *
     */
    private prepareAdvancePair(a: Ball, b: Ball, t: number) {
        // if (Collision.willCollide(a, b, t)) {
        //     const incidentSpeed = Collision.collide(a, b)
        //     // this.outcome.push(Outcome.collision(a, b, incidentSpeed))
        //     return false
        // }
        return true
    }

    /**
     * Returns true if ball can advance by t without hitting cushion, knuckle or pocket.
     * If there is a collision, adjust velocity appropriately.
     *
     */
    private prepareAdvanceToCushions(a: Ball, t: number): boolean {
        if (!a.onTable()) {
            return true
        }
        const futurePosition = a.futurePosition(t)
        if (Math.abs(futurePosition.y) < TableGeometry.tableY && Math.abs(futurePosition.x) < TableGeometry.tableX) {
            return true
        }

        //     const incidentSpeed = Cushion.bounceAny(
        //         a,
        //         t,
        //         TableGeometry.hasPockets,
        //         this.cushionModel
        //     )
        //     if (incidentSpeed) {
        //         // this.outcome.push(Outcome.cushion(a, incidentSpeed))
        //         return false
        //     }

        //     const k = Knuckle.findBouncing(a, t)
        //     if (k) {
        //         const knuckleIncidentSpeed = k.bounce(a)
        //         // this.outcome.push(Outcome.cushion(a, knuckleIncidentSpeed))
        //         return false
        //     }
        //     const p = Pocket.findPocket(PocketGeometry.pocketCenters, a, t)
        //     if (p) {
        //         const pocketIncidentSpeed = p.fall(a, t)
        //         // this.outcome.push(Outcome.pot(a, pocketIncidentSpeed))
        //         return false
        //     }

        //     return true
        // }

        allStationary() {
            return this.balls.every((b) => !b.inMotion())
        }

        inPockets(): number {
            return this.balls.reduce((acc, b) => (b.onTable() ? acc : acc + 1), 0)
        }

        // hit() {
        //     // this.cue.hit(this.cueball)
        //     this.balls.forEach((b) => {
        //         b.ballmesh.trace.reset()
        //     })
        // }

        // serialise() {
        //     return {
        //         balls: this.balls.map((b) => b.serialise()),
        //         // aim: this.cue.aim.copy(),
        //     }
        // }

        // /* static fromSerialised(data) {
        //   const table = new Table(data.balls.map((b) => Ball.fromSerialised(b)))
        //   table.updateFromSerialised(data)
        //   return table
        // } */


        // shortSerialise() {
        //     return this.balls
        //         .map((b) => [b.pos.x, b.pos.y])
        //         .reduce((acc, val) => acc.concat(val), [])
        // }

        // updateFromShortSerialised(data) {
        //     this.balls.forEach((b, i) => {
        //         b.pos.x = data[i * 2]
        //         b.pos.y = data[i * 2 + 1]
        //         b.pos.z = 0
        //         b.vel = new Vec3();
        //         b.rvel = new Vec3();
        //         b.state = State.Stationary
        //     })
        // }
        // halt() {
        //     this.balls.forEach((b) => {
        //         b.vel = new Vec3();
        //         b.rvel = new Vec3();
        //         b.state = State.Stationary
        //     })
        // }
        // overlapsAny(pos, excluding = this.cueball) {
        //     return this.balls
        //         .filter((b) => b !== excluding)
        //         // .some((b) => b.pos.distanceTo(pos) < 2 * R)
        //         .some((b) => Vec3.distance(b.pos, pos) < 2 * R);
        // }
    }


