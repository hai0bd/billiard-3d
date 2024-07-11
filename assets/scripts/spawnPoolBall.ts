import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpawnPoolBall')
export class SpawnPoolBall extends Component {
    @property(Prefab)
    ballPrefab: Prefab;

    balls: Node[] = [];
    ballAmount: number = 0;
    scale: number = 1.5;
    pos: Vec3 = new Vec3();

    start() {
        for (let i = 0; i < 6; i++) {
            console.log(this.pos.z);
            const posJ = this.pos.clone();
            for (let j = 5 - i; j >= 0; j--) {
                const ball = instantiate(this.ballPrefab);
                const ballPos = ball.getPosition();
                ballPos.z = posJ.z;
                ballPos.x = posJ.x;
                posJ.z += 1.5;
                ball.setPosition(ballPos);
                this.node.addChild(ball);
            }
            this.pos.z += (this.scale / 2);
            this.pos.x += (this.scale * Math.sqrt(3) / 2);
        }
    }
    createBall(pos: Vec3, posLeft: boolean) {
        /* if (this.ballAmount > 15) return;
        console.log(pos);
        const ball = instantiate(this.ballPrefab);
        const ballPos = ball.getPosition();
        ballPos.x = pos.x + (this.scale * Math.sqrt(3) / 2);
        if (posLeft) {
            ballPos.z = pos.z - (this.scale / 2);
        }
        else {
            ballPos.z = pos.z + (this.scale / 2);
        }

        ball.setPosition(ballPos);
        ball.name = this.ballAmount.toString() + " " + posLeft;
        this.node.addChild(ball);

        this.ballAmount++;

        this.createBall(ballPos, posLeft);
        this.createBall(ballPos, !posLeft); */
    }
}


