import { _decorator, BoxCollider, Component, CylinderCollider, ITriggerEvent, Node, RigidBody, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testTrigger')
export class testTrigger extends Component {
    start() {
        this.node.getComponent(CylinderCollider).on('onTriggerEnter', this.onTriggerEnter, this);
    }

    onTriggerEnter(event: ITriggerEvent) {
        const other = event.otherCollider;
        /*  tween(other.node)
             .to(5, { position: this.node.position })
             .start(); */
        // other.node.getComponent(RigidBody).linearFactor.y = 1;
        // other.node.destroy();
    }
}


