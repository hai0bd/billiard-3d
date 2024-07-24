import { _decorator, CCFloat, Component, Node, RigidBody, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CustomRigidbody')
export class CustomRigidbody extends Component {
    @property(RigidBody)
    rigidBody: RigidBody;

    @property(CCFloat)
    stopThreshold: number = 0.8;

    public isStop: boolean = false;
    public setCuePos: boolean = false;

    private _previousVelocity: number = 0;

    start() {
        this.rigidBody.useCCD = true;
    }

    update(deltaTime: number) {
        let velocity = new Vec3();
        this.rigidBody.getLinearVelocity(velocity);

        const velocityLength = velocity.length();

        if (this._previousVelocity > velocityLength) {
            if (velocityLength < 0.5) {
                this.rigidBody.clearVelocity();
                this.isStop = true;
            }
            else {
                this.isStop = false;
            }
        }

        this._previousVelocity = velocityLength;
    }
}


