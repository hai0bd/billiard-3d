import { _decorator, Camera, Canvas, Component, director, ECollider2DType, EColliderType, EventTouch, geometry, Graphics, Input, input, instantiate, Line, math, Node, physics, PhysicsSystem, Quat, SphereCollider, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('rotateCue')
export class rotateCue extends Component {
    @property(Camera)
    cam: Camera;

    @property(Node)
    target: Node;

    @property(Line)
    line: Line;

    @property(Node)
    ghostBall: Node;

    @property(Node)
    nextPos: Node;

    @property(Node)
    nodeTest: Node;

    private direction: Vec2 = new Vec2();
    private targetPos: Vec3 = new Vec3();

    start() {
        this.drawAimLine();
        input.on(Input.EventType.TOUCH_START, this.rotateCue, this);
        input.on(Input.EventType.TOUCH_MOVE, this.rotateCue, this);
    }

    rotateCue(event: EventTouch) {
        const touch = event.getUILocation();

        const direction = this.calculateDirection(touch);
        const angle = this.calculateAngle(direction);
        this.rotateAround(this.target.position, Vec3.UP, angle);

        this.drawAimLine();
    }

    drawAimLine() {
        const startPoint = this.target.getWorldPosition();
        const endPoint = this.nextPos.getWorldPosition();
        let direction = new Vec3();
        Vec3.subtract(direction, endPoint, startPoint);
        direction.normalize();

        const result = this.checkRaycast(startPoint, direction);
        this.line.positions = [
            new Vec3(this.convertToNodePos(startPoint)),
            new Vec3(this.convertToNodePos(result.hitPoint)),
            new Vec3(this.convertToNodePos(result.hitNormal)),
        ];
        /* if (result.collider.type == EColliderType.SPHERE) {

            this.ghostBall.setPosition(this.calculateGhostBall(result.hitPoint, result.collider.node.position));
            this.line.positions = [
                new Vec3(this.convertToNodePos(startPoint)),
                new Vec3(this.convertToNodePos(this.ghostBall.position))
            ];
        }
        else {
            const length = new Vec3(result.hitPoint.x - startPoint.x, result.hitPoint.y - startPoint.y, result.hitPoint.z - startPoint.z).length();
            const point = new Vec3(result.hitPoint.x + 0.7 * (startPoint.x - result.hitPoint.x) / length, result.hitPoint.y + 0.7 * (startPoint.y - result.hitPoint.y) / length, result.hitPoint.z + 0.7 * (startPoint.z - result.hitPoint.z) / length);
            this.line.positions = [
                new Vec3(this.convertToNodePos(startPoint)),
                new Vec3(this.convertToNodePos(point))
            ]
            this.ghostBall.setPosition(point);
        } */

    }
    checkRaycast(startPoint: Vec3, direction: Vec3) {
        let ray = new geometry.Ray(startPoint.x, startPoint.y, startPoint.z, direction.x, direction.y, direction.z);

        if (PhysicsSystem.instance.raycast(ray, 0xffffffff, 1000, true)) {
            let results = PhysicsSystem.instance.raycastResults;
            let minDistance = 10000;
            let result = results[0];
            for (let i = 0; i < results.length; i++) {
                if (minDistance > results[i].distance && results[i].collider.node.name != 'Cue Ball') {
                    minDistance = results[i].distance;
                    result = results[i];
                }
            }
            if (result) {
                return result;
            }
        }
    }

    calculateGhostBall(hitPoint: Vec3, center: Vec3): Vec3 {
        return new Vec3(2 * hitPoint.x - center.x, 2 * hitPoint.y - center.y, 2 * hitPoint.z - center.z);
    }

    calculateDirection(touch: Vec2) {
        let target = this.target.getWorldPosition();
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
    convertToNodePos(worldPos: Vec3) {
        const localHitPoint = new Vec3();
        // Lấy ma trận world-to-local của targetNode
        const worldToLocalMatrix = this.node.worldMatrix.clone().invert();

        // Chuyển đổi hitPoint sang tọa độ local của targetNode
        Vec3.transformMat4(localHitPoint, worldPos, worldToLocalMatrix);
        return localHitPoint;
    }
}


