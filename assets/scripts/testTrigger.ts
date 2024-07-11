import { _decorator, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testTrigger')
export class testTrigger extends Component {
    start() {
        this.node.getComponent(BoxCollider).on('onTriggerEnter', this.onTriggerEnter, this);
    }

    onTriggerEnter(event: ITriggerEvent) {
        const other = event.otherCollider;
        other.node.destroy();
    }
}


