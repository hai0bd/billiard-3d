import { _decorator, Component, geometry, Input, input, Line, Node, PhysicsSystem, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('aimLine')
export class aimLine extends Component {
    @property(Node)
    target: Node;

    @property(Line)
    line: Line;

    start() {
        /* input.on(Input.EventType.TOUCH_START, this.drawAimLine, this);
        input.on(Input.EventType.TOUCH_MOVE, this.drawAimLine, this); */
        this.schedule(this.drawAimLine, 1);
    }

    drawAimLine() {
        const startPos = this.target.getWorldPosition();
        const endPos = this.checkRaycast(Vec3.RIGHT);
        this.line.positions = [
            new Vec3(this.convertToNodePos(this.node, startPos)),
            new Vec3(this.convertToNodePos(this.node, endPos))
        ];
    }
    checkRaycast(direction: Vec3) {
        const startPos = this.target.getWorldPosition();
        let ray = new geometry.Ray(startPos.x, startPos.y, startPos.z, direction.x, direction.y, direction.z);

        if (PhysicsSystem.instance.raycast(ray, 0xffffffff, 1000, true)) {
            let results = PhysicsSystem.instance.raycastResults;
            let min = 10000;
            let result = results[0];
            for (let i = 0; i < results.length; i++) {
                if (min > results[i].distance && results[i].collider.node.name != 'Cue Ball') {
                    min = results[i].distance;
                    result = results[i];
                }
            }
            return result.hitPoint;
            /* for (let i = 0; i < results.length; i++) {
                if (this.node.name == 'Cue Ball') continue;
                return results[i].hitPoint;
            } */
        }

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


