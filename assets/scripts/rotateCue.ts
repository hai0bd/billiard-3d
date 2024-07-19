import { _decorator, Camera, Component, EventTouch, Input, input, math, Node, Quat, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('rotateCue')
export class rotateCue extends Component {
    @property(Node)
    public target: Node | null = null; // Node để quay quanh

    @property(Camera)
    cam: Camera;

    private angle: number = 10; // Góc hiện tại

    start() {
        // this.angle = this.angle * Math.PI / 180;

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch) {
        this.angle += 2;
        const radian = this.angle * Math.PI / 180;
        console.log(event.getUILocation());
        this.calculateAngle();
        // console.log(radian);
        this.rotateAround(this.node, this.target.position, Vec3.UP, radian);
    }

    calculateAngle() {
        const targetPos = this.target.getWorldPosition();
        const screenPos: Vec3 = new Vec3();
        this.cam.worldToScreen(targetPos, screenPos);
        console.log(screenPos);
    }

    rotateAround(node: Node, point: Vec3, axis: Vec3, angle: number) {

        // Tạo quaternion cho phép quay
        let rotation = new Quat();
        Quat.rotateAround(rotation, Quat.IDENTITY, axis, angle);

        // Đặt góc quay mới của node mà không phụ thuộc vào góc quay hiện tại
        // Đảm bảo rằng rotation node không bị ảnh hưởng bởi góc quay trước đó
        const newRotation = new Quat();
        Quat.rotateAround(newRotation, Quat.IDENTITY, axis, angle);
        node.setRotation(newRotation);
    }
}


