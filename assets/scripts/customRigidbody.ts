import { _decorator, CCFloat, Component, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomRigidbody')
export class CustomRigidbody extends Component {
    @property(RigidBody)
    rigidBody: RigidBody;

    @property(CCFloat)
    stopThreshold: number = 0.8;

    public isStop: boolean = false;

    private _previousVelocity: number = 0;

    start() {
        this.rigidBody.useCCD = true;
    }

    update(deltaTime: number) {
        if (this.isStop) return;
        let velocity = new Vec3();
        this.rigidBody.getLinearVelocity(velocity);

        const velocityLength = velocity.length();

        if (this._previousVelocity > velocityLength) {
            // console.log(this.node.name + " Vận tốc giảm dần");
            if (velocityLength < 0.7) {
                this.rigidBody.clearVelocity();
                this.isStop = true;
            }
        }
        /* else if (this._previousVelocity < velocityLength) {
            console.log(this.node.name + " Vận tốc tăng dần");
        }
        else {
            // this.isStop = true;
            console.log(this.node.name + " Vận tốc không đổi");
        } */

        this._previousVelocity = velocityLength;
    }
}


