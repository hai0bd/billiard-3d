import { _decorator, Camera, CCFloat, Component, EventMouse, EventTouch, Input, input, math, Node, RigidBody, Vec2, Vec3 } from 'cc';
import { RotateCue } from './rotateCue';
import { CustomRigidbody } from './customRigidbody';
const { ccclass, property } = _decorator;

@ccclass('BallControl')
export class BallControl extends Component {
    @property(CustomRigidbody)
    rb: CustomRigidbody;

    @property(Camera)
    mainCam: Camera;

    @property(CCFloat)
    force: number = 120;

    @property({ type: Vec3 })
    forcePoint: Vec3 = new Vec3(-1.5, -1.5, 0);

    startPoint: Vec2 = new Vec2();
    direction: Vec3 = new Vec3();
    isStart: boolean = true;

    start() {
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    onTouchEnd(event: EventTouch) {
        this.hitBall();
    }

    hitBall() {
        // console.log(this.direction);
        const impluse = this.direction.clone().multiplyScalar(this.force);

        /* const radius = 0.7;
        const applicatinPoint = new Vec3(0, 0, 0); */

        this.rb.rigidBody.applyImpulse(impluse/* , applicatinPoint */);
    }
}
