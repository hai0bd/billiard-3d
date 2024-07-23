import { _decorator, Camera, Component, EventMouse, EventTouch, Input, input, math, Node, RigidBody, Vec2, Vec3 } from 'cc';
import { RotateCue } from './rotateCue';
import { CustomRigidbody } from './customRigidbody';
const { ccclass, property } = _decorator;

@ccclass('BallControl')
export class BallControl extends Component {
    @property(CustomRigidbody)
    rigidBody: CustomRigidbody;

    @property(Camera)
    mainCam: Camera;

    @property({ type: Vec3 })
    forcePoint: Vec3 = new Vec3(-1.5, -1.5, 0);

    // @property({ type: Vec2 })
    startPoint: Vec2 = new Vec2();
    direction: Vec3 = new Vec3();
    isStart: boolean = true;

    start() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    init() {
    }

    onMouseMove(event: EventMouse) {
    }
    onTouchStart(event: EventTouch) {
        this.startPoint = event.getUILocation();
    }
    onTouchMove(event: EventTouch) {
    }
    onTouchEnd(event: EventTouch) {
        this.calculateDirection(event.getUILocation());
        this.hitBall();
    }

    calculateDirection(touch: Vec2) {
        const direction = new Vec2(touch.x - this.startPoint.x, touch.y - this.startPoint.y);
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            this.direction.x = direction.x / Math.abs(direction.x) /* * Math.random() */;
            this.direction.z = 0;
        }
        else {
            this.direction.x = 0;
            this.direction.z = (direction.y / Math.abs(direction.y))/*  * Math.random() */;
        }
        // console.log(this.direction);
    }

    forceStrength: number = -150;
    radius: number = 1.5;
    hitBall() {
        /* let worldForcePoint = this.forcePoint;
        const force = new Vec3(180 * (1 + 1) * this.direction.x, 0, -180 * (1 + 1) * this.direction.z)
        this.rigidBody.applyImpulse(force, worldForcePoint);
        // console.log(force); */

        const tangentialForce = new Vec3(0, this.forceStrength, 0);
        const inwardForce = new Vec3(-this.forceStrength, 0, 0);
        const combinedForce = new Vec3(inwardForce.x + tangentialForce.x, inwardForce.y + tangentialForce.y, 0);
        const point = new Vec3(-this.radius, 0, 0);
        this.rigidBody.rigidBody.applyImpulse(combinedForce, point);
    }
}
