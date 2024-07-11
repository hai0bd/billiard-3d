import { _decorator, Camera, Component, EventMouse, EventTouch, Input, input, math, Node, RigidBody, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testRigibody')
export class testRigibody extends Component {
    @property(RigidBody)
    rb: RigidBody;

    @property(Camera)
    mainCam: Camera;

    // @property({ type: Vec2 })
    startPoint: Vec2 = new Vec2();
    direction: Vec3 = new Vec3();
    isStart: boolean = true;

    start() {
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMouse, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    init() {
        if (this.isStart) {
            this.direction.x = .8;
            this.direction.z = 0;
            this.isStart = false;
        }
        else {
            this.direction.x = math.randomRange(-1, 1);
            this.direction.z = math.randomRange(-1, 1);
        }
        this.rb.applyImpulse(new Vec3(12 * (1 + 1) * this.direction.x, 0, 12 * (1 + 1) * this.direction.z));
    }

    onMouseMove(event: EventMouse) {
    }
    onTouchStart(event: EventTouch) {
        console.log("touch start");
        this.startPoint = event.getUILocation();
    }
    onTouchMouse(event: EventTouch) {
    }
    onTouchEnd(event: EventTouch) {
        console.log("touch end");
        this.calculateDirection(event.getUILocation());
        this.hitBall();
    }

    calculateDirection(touch: Vec2) {
        const direction = new Vec2(touch.x - this.startPoint.x, touch.y - this.startPoint.y);
        console.log(direction);
        if (Math.abs(direction.x) > Math.abs(direction.y)) {
            this.direction.x = direction.x / Math.abs(direction.x);
            this.direction.z = 0;
        }
        else {
            this.direction.x = 0;
            this.direction.z = direction.y / Math.abs(direction.y);
        }
        console.log(this.direction);
    }

    hitBall() {
        this.rb.applyImpulse(new Vec3(200 * (1 + 1) * this.direction.x, 0, -200 * (1 + 1) * this.direction.z));
    }
    /* 
            update(deltaTime: number) {
                
            } */
}
