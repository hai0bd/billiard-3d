import { _decorator, CCString, Component, Node } from 'cc';
import { bounceHanBlend } from '../src/model/physics/physics';
import { Assets } from '../src/view/assets';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(CCString)
    params: string;
    
    @property(CCString)
    ruleType: string;

    @property(CCString)
    playerName: string;

    @property(CCString)
    tableId: string;

    now: number;
    asset: Assets;
    cushinModel;

    onLoad() {
        this.now = Date.now();
        this.cushinModel = bounceHanBlend;
    }

    start() {
        this.asset = new Assets(this.ruleType);
        this.asset.loadFromWeb(() => {
            this.onAssetReady();
        })
    }

    onAssetReady(){

    }
}


