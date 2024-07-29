import { _decorator, Vec3, Material } from 'cc';
import { forceRoll, rollingFull, sliding, surfaceVelocityFull } from '../physics/physics';
import { BallState } from '../../Enum';
import { passesThroughZero } from '../../utils/utils';
import { Pocket } from '../physics/pocket';
import { BallMesh } from './BallMesh';
import { GameManager } from '../../GameManager';
import { instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball{
    @property(BallMesh)
    ballMesh: BallMesh;

    pos: Vec3;
    vel: Vec3 = new Vec3();
    rvel: Vec3 = new Vec3();
    futurePos: Vec3 = new Vec3();
    pocket: Pocket;
    state: BallState = BallState.Stationary;

    public static id = 0
    readonly id = Ball.id++

    static readonly transition = 0.05   

    constructor(pos: Vec3, material?: Material) {
        this.pos = pos.clone();
        this.createBallMesh(pos, material)
        this.ballMesh.mesh.materials[0] = material;
    }
    
    createBallMesh(pos: Vec3, material?: Material){
        const ballPrefab = GameManager.instance.ballPrefab;
        const ball = instantiate(ballPrefab);
        ball.setPosition(pos);
        this.ballMesh = ball.getComponent(BallMesh);

    }

    updateBall(time) {
        this.updatePosition(time)
        if (this.state == BallState.Falling) {
            this.pocket.updateFall(this, time)
        } else {
            this.updateVelocity(time)
        }
    }

    updateMesh(time){
        this.ballMesh.updateAll(this, time);
    }

    private updatePosition(t: number) {
        this.pos.addScaledVector(this.vel, t)
    }

    private updateVelocity(t: number) {
        if (this.inMotion()) {
            if (this.isRolling()) {
                this.state = BallState.Rolling
                forceRoll(this.vel, this.rvel)
                this.addDelta(t, rollingFull(this.rvel))
            } else {
                this.state = BallState.Sliding
                this.addDelta(t, sliding(this.vel, this.rvel))
            }
        }
    }
    isRolling() {
        return (
            this.vel.lengthSqr() !== 0 &&
            this.rvel.lengthSqr() !== 0 &&
            surfaceVelocityFull(this.vel, this.rvel).length() < Ball.transition
        )
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
        const halts = this.state === BallState.Rolling ? vz || wz : vz && wz
        if (halts && Math.abs(this.rvel.z) < 0.01) {
            this.setStationary()
            return true
        }
        return false
    }

    setStationary() {
        this.vel = Vec3.ZERO;
        this.rvel = Vec3.ZERO;
        this.state = BallState.Stationary;
    }

    inMotion() {
        return (
            this.state === BallState.Rolling ||
            this.state === BallState.Sliding ||
            this.isFalling()
        )
    }

    isFalling() {
        return this.state === BallState.Falling
    }

    onTable() {
        return this.state !== BallState.Falling && this.state !== BallState.InPocket
    }
    futurePosition(t) {
        this.futurePos = (this.pos).addScaledVector(this.vel, t)
        return this.futurePos
    }
}


