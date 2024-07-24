import { _decorator, Component, geometry, Input, input, Line, Node, PhysicsSystem, Vec3 } from 'cc';
import { Layer } from './enum';
import { BallControl } from './ballControl';
const { ccclass, property } = _decorator;

@ccclass('AimLine')
export class AimLine extends Component {
    @property(BallControl)
    cueBall: BallControl;

    @property(Line)
    line: Line;

    @property(Line)
    reflexLine: Line;

    @property(Line)
    cueBallOut: Line;

    @property(Node)
    ghostBall: Node;

    @property(Node)
    nextPos: Node;

    drawAimLine() {
        const startPoint = this.cueBall.node.getWorldPosition();
        const endPoint = this.nextPos.getWorldPosition();
        let direction = new Vec3();
        Vec3.subtract(direction, endPoint, startPoint);
        direction.normalize();
        this.cueBall.direction = direction;

        const result = this.checkRaycast(startPoint, direction);
        const hitPoint = result.hitPoint;
        /* this.line.positions = [
            new Vec3(this.convertToNodePos(startPoint)),
            new Vec3(this.convertToNodePos(hitPoint))
        ]; */


        const layer = result.collider.node.layer;
        if (layer == Layer.HOLE) {
            this.ghostBall.active = false;
            this.line.positions = [
                new Vec3(this.convertToNodePos(this.line.node, startPoint)),
                new Vec3(this.convertToNodePos(this.line.node, hitPoint))
            ];
            this.reflexLine.positions = [];
            this.cueBallOut.positions = [];
        }
        else {
            let reflex: Vec3 = new Vec3();
            if (layer == Layer.TABLE) {
                reflex = this.calculateReflex(direction, result.hitNormal, hitPoint, 2);
                this.cueBallOut.positions = [];
            }
            else {
                reflex = this.calculateReflexCueBall(result.collider.node, hitPoint, 1.5);
                const reflexCueBall = this.calculateReflexBall(result.collider.node, hitPoint, 2);
                this.cueBallOut.positions = [
                    this.convertToNodePos(this.cueBallOut.node, hitPoint),
                    this.convertToNodePos(this.cueBallOut.node, reflexCueBall)
                ]
            }
            this.ghostBall.active = true;
            this.ghostBall.setPosition(this.convertToNodePos(this.node, hitPoint));
            this.line.positions = [
                new Vec3(this.convertToNodePos(this.line.node, startPoint)),
                new Vec3(this.convertToNodePos(this.line.node, hitPoint))
            ];
            this.reflexLine.positions = [
                this.convertToNodePos(this.reflexLine.node, hitPoint),
                this.convertToNodePos(this.reflexLine.node, reflex)
            ];

        }
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
            else return;
        }
    }
    calculateReflex(direction: Vec3, normal: Vec3, hitPoint: Vec3, distance: number): Vec3 {
        const reflexDir = direction.clone().subtract(normal.clone().multiplyScalar(2 * direction.dot(normal))).normalize();
        return new Vec3(hitPoint.clone().add(reflexDir.multiplyScalar(distance)));
    }
    calculateReflexBall(ball: Node, hitPoint: Vec3, distance: number): Vec3 {
        const pos = ball.getPosition();
        const reflexDir = new Vec3(pos.x - hitPoint.x, pos.y - hitPoint.y, pos.z - hitPoint.z);
        return new Vec3(hitPoint.clone().add(reflexDir.multiplyScalar(distance)));
    }
    calculateReflexCueBall(ball: Node, hitPoint: Vec3, distance: number): Vec3 {
        const pos = ball.getPosition();
        const direction = new Vec3(1, 0, -(pos.x - hitPoint.x) / (pos.z - hitPoint.z)).normalize();
        return new Vec3(hitPoint.clone().add(direction.multiplyScalar(distance)))
    }
    convertToNodePos(node: Node, worldPos: Vec3) {
        const localHitPoint = new Vec3();
        // Lấy ma trận world-to-local của targetNode
        const worldToLocalMatrix = node.worldMatrix.clone().invert();

        // Chuyển đổi hitPoint sang tọa độ local của targetNode
        Vec3.transformMat4(localHitPoint, worldPos, worldToLocalMatrix);
        return localHitPoint;
    }
}


