import { Vec3 } from 'cc';
import { Quat } from 'cc';
import { MeshRenderer } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { norm } from '../../utils/utils';
import { Ball } from './Ball';
const { ccclass, property } = _decorator;

@ccclass('BallMesh')
export class BallMesh extends Component {
    @property(MeshRenderer)
    mesh: MeshRenderer;

    updateAll(ball: Ball, t: number) {
        this.updatePosition(ball.pos)
        this.updateArrows(ball.pos, ball.rvel, ball.state)
        if (ball.rvel.lengthSqr() !== 0) {
            this.updateRotation(ball.rvel, t)
            // this.trace.addTrace(ball.pos, ball.vel)
        }
    }

    updatePosition(pos: Vec3 ) {
        this.node.setPosition(pos)
        // this.shadow.position.copy(pos)
    }

    // readonly m = new Matrix4()

    updateRotation(rvel: Vec3, t) {
        const angle = rvel.length() * t
        this.rotateOnWorldAxis(norm(rvel), angle)
    }

    rotateOnWorldAxis(axis: Vec3, angle: number){
        const quaternion = new Quat();
        Quat.fromAxisAngle(quaternion, axis, angle);
        const worldRotation = this.node.getWorldRotation(new Quat());
        const newWorldRotation = new Quat();
        Quat.multiply(newWorldRotation, worldRotation, quaternion);
        this.node.setWorldRotation(newWorldRotation);
    }

    updateArrows(pos, rvel, state) {
        /* this.spinAxisArrow.setLength(R + (R * rvel.length()) / 2, R, R)
        this.spinAxisArrow.position.copy(pos)
        this.spinAxisArrow.setDirection(norm(rvel))
        if (state == State.Rolling) {
            this.spinAxisArrow.setColor(0xcc0000)
        } else {
            this.spinAxisArrow.setColor(0x00cc00)
        } */
    }
}


