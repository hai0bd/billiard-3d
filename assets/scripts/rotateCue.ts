import { _decorator, Camera, Component, EColliderType, Enum, EventTouch, geometry, Input, input, Line, Node, PhysicsSystem, Quat, Vec2, Vec3 } from 'cc';
import { AimLine } from './aimLine';
const { ccclass, property } = _decorator;

@ccclass('RotateCue')
export class RotateCue extends Component {
    @property(Camera)
    cam: Camera;

    @property(Node)
    cueBall: Node;

    @property(AimLine)
    aim: AimLine;

    private targetPos: Vec3 = new Vec3();

    start() {
        input.on(Input.EventType.TOUCH_START, this.rotateCue, this);
        input.on(Input.EventType.TOUCH_MOVE, this.rotateCue, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.schedule(() => {
            this.node.setPosition(this.cueBall.position);
        }, 1);
    }

    rotateCue(event: EventTouch) {
        this.aim.node.active = true;
        const touch = event.getUILocation();

        const direction = this.calculateDirection(touch);
        const angle = this.calculateAngle(direction);
        this.rotateAround(this.cueBall.position, Vec3.UP, angle);
        this.aim.drawAimLine();
    }

    onTouchEnd() {
        this.aim.node.active = false;
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

    rotateAround(point: Vec3, axis: Vec3, angle: number) {
        const newRotation = new Quat();
        Quat.rotateAround(newRotation, Quat.IDENTITY, axis, angle);
        this.node.setRotation(newRotation);
    }


}


