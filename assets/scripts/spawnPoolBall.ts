import { _decorator, Component, instantiate, Material, MeshRenderer, Node, Prefab, RigidBody, Vec3 } from 'cc';
import { CustomRigidbody } from './customRigidbody';
const { ccclass, property } = _decorator;

@ccclass('SpawnPoolBall')
export class SpawnPoolBall extends Component {
    @property(Prefab)
    ballPrefab: Prefab;

    @property({ type: Material })
    ballMtl: Material[] = [];

    balls: Node[] = [];
    ballAmount: number = 0;
    ballRigidBody: CustomRigidbody[] = [];
    ballScale: number = 1.5;
    pos: Vec3 = new Vec3(17, 20.8, -3);

    start() {
        this.createBall();
    }
    createBall() {
        for (let i = 0; i < 5; i++) {
            const posJ = this.pos.clone();
            for (let j = 4 - i; j >= 0; j--) {
                this.ballAmount++;

                const ball = instantiate(this.ballPrefab);
                ball.name = `ball ${this.ballAmount}`;
                ball.getComponent(MeshRenderer).materials[0] = this.ballMtl[this.ballAmount];
                this.ballRigidBody.push(ball.getComponent(CustomRigidbody));

                const ballPos = ball.getPosition();
                ballPos.z = posJ.z;
                ballPos.x = posJ.x;
                ball.setPosition(ballPos);

                this.node.addChild(ball);
                this.balls.push(ball);

                posJ.z += this.ballScale;
            }
            this.pos.z += (this.ballScale / 2);
            this.pos.x -= (this.ballScale * Math.sqrt(3) / 2);
        }
    }

    update() {
        // if (this.checkBallStop()) console.log("can hit");
        // else console.log("can't hit");
    }
    checkBallStop() {
        for (let i = 0; i < this.ballRigidBody.length; i++) {
            if (this.ballRigidBody[i].isStop == false) {
                console.log(this.ballRigidBody[i].node.name);
                return false;
            }
        }
        return true;
    }
}


