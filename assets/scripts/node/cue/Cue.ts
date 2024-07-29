import { _decorator, Component, Node, Vec3, input ,Input} from 'cc';
import { TableGeometry } from '../table/TableGeometry';
import { Table } from '../table/Table';
import { Aim } from './Aim';
import { R } from '../physics/constants';
import { Ball } from '../ball/Ball';
import { BallState } from '../../Enum';
import { norm, unitAtAngle, upCross } from '../../utils/utils';
import { cueToSpin } from '../physics/physics';
import { EventTouch } from 'cc';
import { Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Cue')
export class Cue extends Component {
    @property(Aim)
    aim: Aim;

    readonly offCenterLimit = 0.3;
    readonly maxPower = 150 * R;
    t = 0;
    lastTouch: Vec3 = new Vec3(-14, 0, 1.08);
    length = TableGeometry.tableX * 1;

    /* constructor() {
        this.mesh = CueMesh.createCue(
            (R * 0.05) / 0.5,
            (R * 0.15) / 0.5,
            this.length
        )
        this.helperMesh = CueMesh.createHelper()
        this.placerMesh = CueMesh.createPlacer()
    } */

    start() {
        input.on(Input.EventType.TOUCH_START, this.rotateCue, this);
        input.on(Input.EventType.TOUCH_MOVE, this.rotateCue, this);
    }

    rotateCue(event: EventTouch){
        const touch = event.getUILocation();    
    }
    calculateDirection(touch: Vec2) {
        let target = this.cueBall.getWorldPosition();
        this.cam.worldToScreen(target, this.targetPos);

        return new Vec2(touch.x - this.targetPos.x, touch.y - this.targetPos.y);
    }

    calculateAngle(vector: Vec2): number {
        let radian = Vec2.angle(vector, new Vec2(1, 0));
        if (vector.y < 0) radian = -radian;
        return radian;
    }

    rotateAim(angle: number, table: Table) {
        this.aim.angle += angle;
        // this.mesh.rotation.z = this.aim.angle
        this.setZ(this.node, this.aim.angle);
        /* this.helperMesh.rotation.z = this.aim.angle
        this.aimInputs.showOverlap() */
        this.avoidCueTouchingOtherBall(table)
    }

    adjustPower(delta: number) {
        this.aim.power = Math.min(this.maxPower, this.aim.power + delta)
        this.updateAimInput()
    }

    setPower(value: number) {
        this.aim.power = value * this.maxPower
    }

    hit(ball: Ball) {
        const aim = this.aim
        this.t = 0
        ball.state = BallState.Sliding
        ball.vel.set(unitAtAngle(aim.angle).multiplyScalar(aim.power))
        ball.rvel.set(cueToSpin(aim.offset, ball.vel))
    }

    aimAtNext(cueball, ball) {
        if (!ball) {
            return
        }
        const lineTo = norm(ball.pos.clone().sub(cueball.pos))
        this.aim.angle = Math.atan2(lineTo.y, lineTo.x)
    }

    adjustSpin(delta: Vec3, table: Table) {
        const originalOffset = this.aim.offset.clone()
        const newOffset = originalOffset.clone().add(delta)
        this.setSpin(newOffset, table)
    }

    setSpin(offset: Vec3, table: Table) {
        if (offset.length() > this.offCenterLimit) {
            offset.normalize().multiplyScalar(this.offCenterLimit)
        }
        this.aim.offset.set(offset)
        this.avoidCueTouchingOtherBall(table)
        this.updateAimInput()
    }

    avoidCueTouchingOtherBall(table: Table) {
        let n = 0
        while (n++ < 20 && this.intersectsAnything(table)) {
            this.aim.offset.y += 0.1
            if (this.aim.offset.length() > this.offCenterLimit) {
                this.aim.offset.normalize().multiplyScalar(this.offCenterLimit)
            }
        }

        if (n > 1) {
            this.updateAimInput()
        }
    }

    updateAimInput() {
        /* this.aimInputs?.updateVisualState(this.aim.offset.x, this.aim.offset.y)
        this.aimInputs?.updatePowerSlider(this.aim.power / this.maxPower)
        this.aimInputs?.showOverlap() */
    }

    moveTo(pos) {
        this.aim.pos.set(pos)
        this.setZ(this.node, this.aim.angle)
        // this.helperMesh.rotation.z = this.aim.angle
        const offset = this.spinOffset()
        const swing = (Math.sin(this.t + Math.PI / 2) - 1) * 2 * R * (this.aim.power / this.maxPower)
        const distanceToBall = unitAtAngle(this.aim.angle).clone().multiplyScalar(swing)
        this.node.setPosition(pos.clone().add(offset).add(distanceToBall))
        /* this.helperMesh.position.copy(pos)
        this.placerMesh.position.copy(pos)
        this.placerMesh.rotation.z = this.t */
    }
    setZ(node: Node, angle: number) {
        const rotation = this.node.getRotation();
        rotation.z = angle;
        node.setRotation(rotation);
    }

    update(t) {
        this.t += t
        this.moveTo(this.aim.pos)
    }

    placeBallMode() {
        /* this.mesh.visible = false
        this.placerMesh.visible = true */
        this.aim.angle = 0
    }

    aimMode() {
        /* this.mesh.visible = true
        this.placerMesh.visible = false */
    }

    spinOffset() {
        return upCross(unitAtAngle(this.aim.angle))
            .multiplyScalar(this.aim.offset.x * 2 * R)
            .setZ(this.aim.offset.y * 2 * R)
    }

    intersectsAnything(table: Table) {
        const offset = this.spinOffset()
        const origin = table.cueBall.pos.clone().add(offset)
        const direction = norm(unitAtAngle(this.aim.angle + Math.PI).setZ(0.1))
        /* const raycaster = new Raycaster(origin, direction)
        const items = table.balls.map((b) => b.ballmesh.mesh)
        if (table.mesh) {
            items.push(table.mesh)
        }
        const intersections = raycaster.intersectObjects(items, true)
        return intersections.length > 0 */
        return true;
    }

    showHelper(b) {
        // this.helperMesh.visible = b
    }

    toggleHelper() {
        // this.showHelper(!this.helperMesh.visible)
    }
}


