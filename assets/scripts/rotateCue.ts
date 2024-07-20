import { _decorator, Camera, Canvas, Component, director, EventTouch, Graphics, Input, input, instantiate, math, Node, Quat, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('rotateCue')
export class rotateCue extends Component {
    @property(Camera)
    cam: Camera;

    @property(Canvas)
    canvas: Canvas;

    @property(Node)
    target: Node;

    @property(Graphics)
    draw: Graphics;

    @property(Node)
    nodeTest: Node;

    private direction: Vec2 = new Vec2();
    private targetPos: Vec3 = new Vec3();

    start() {
        input.on(Input.EventType.TOUCH_START, this.rotateCue, this);
        input.on(Input.EventType.TOUCH_MOVE, this.rotateCue, this);
    }

    rotateCue(event: EventTouch) {
        const { width, height } = this.draw.getComponent(UITransform);
        console.log(`width: ${width} height: ${height}`);
        const touch = event.getUILocation();

        const direction = this.calculateDirection(touch);
        const angle = this.calculateAngle(direction);
        this.rotateAround(this.target.position, Vec3.UP, angle);


        const ballTest = instantiate(this.nodeTest);
        ballTest.setPosition(new Vec3(this.targetPos.x - width / 2, this.targetPos.y - height / 2));
        director.getScene().getChildByName("Canvas").addChild(ballTest);

        /* const touchTest = instantiate(this.nodeTest);
        touchTest.setPosition(new Vec3(touch.x - width / 2, touch.y - height / 2));
        director.getScene().getChildByName("Canvas").addChild(touchTest); */


        this.draw.clear();
        this.draw.moveTo(this.targetPos.x - width / 2, this.targetPos.y - height / 2);
        this.draw.lineTo(touch.x - width / 2, touch.y - height / 2);
        this.draw.stroke();

    }

    calculateDirection(touch: Vec2) {
        let target = this.target.getWorldPosition();
        console.log(target);
        this.cam.worldToScreen(target, this.targetPos);
        console.log(this.targetPos);

        return new Vec2(touch.x - this.targetPos.x, touch.y - this.targetPos.y);
    }

    calculateAngle(vector: Vec2): number {
        let radian = Vec2.angle(vector, new Vec2(1, 0));
        if (vector.y < 0) radian = -radian;
        return radian;
    }

    rotateAround(point: Vec3, axis: Vec3, angle: number) {
        const newRotation = new Quat();
        Quat.rotateAround(newRotation, Quat.IDENTITY, axis, angle);
        this.node.setRotation(newRotation);
    }
}


