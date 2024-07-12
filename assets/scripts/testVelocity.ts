import { _decorator, Component, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testVelocity')
export class testVelocity extends Component {
    rb: RigidBody;
    start() {
        this.rb = this.node.getComponent(RigidBody);
    }

    update(deltaTime: number) {
        // console.log("linearVel: " + this.rb.linearFactor + "angularVel: " + this.rb.angularFactor);
    }
}


