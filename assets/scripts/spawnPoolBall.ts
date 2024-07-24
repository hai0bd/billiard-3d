import { _decorator, Component, game, instantiate, Material, MeshRenderer, Node, Prefab, RigidBody, Vec3 } from 'cc';
import { CustomRigidbody } from './customRigidbody';
const { ccclass, property } = _decorator;

@ccclass('SpawnPoolBall')
export class SpawnPoolBall extends Component {
    @property(Prefab)
    ballPrefab: Prefab;

    @property({ type: Material })
    ballMtl: Material[] = [];

    @property(CustomRigidbody)
    cueBall: CustomRigidbody;

    @property(Node)
    cue: Node;

    ballAmount: number = 0;
    ballScale: number = 1.5;
    balls: Node[] = [];
    ballRigidBody: CustomRigidbody[] = [];
    pos: Vec3 = new Vec3(17, 20.8, -3);

    start() {
        this.ballRigidBody.push(this.cueBall);
        this.balls.push(this.cueBall.node);
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

    setCuePos: boolean = false;
    update() {
        if (this.checkBallStop()) {
            if (!this.setCuePos) {
                game.emit("SetCuePos");
                this.cue.active = true;
                this.setCuePos = true;
            }
        }
        else {
            this.cue.active = false;
            this.setCuePos = false;
        }
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


