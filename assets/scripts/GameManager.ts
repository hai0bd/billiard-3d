import { _decorator, Component, Prefab, Material, Enum } from 'cc';
import { RulesType } from './Enum';
import { Asset } from './Asset';
import { GameControl } from './GameControl';
import { ballMaterial } from './node/ball/ballMaterial';
import { bounceHanBlend } from './node/physics/physics';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;
    
    @property(GameControl)
    gameControl: GameControl;
    
    @property(Prefab)
    ballPrefab: Prefab;
    
    @property(Prefab)
    tablePrefab: Prefab;

    @property(ballMaterial)
    ballMaterials: ballMaterial = new ballMaterial;

    // @property({type: Enum(RulesType)})
    rulesType: RulesType = RulesType.NineBall;

    now: number;
    asset: Asset;    
    cushionModel = bounceHanBlend;      

    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager;
        }
        return this._instance;
    }
    onLoad() {
        if (!GameManager._instance) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }
    }

    start() {
        this.now = Date.now();
        this.asset = new Asset(this.rulesType);
        this.asset.loadFromInput(() => {
            this.onAssetReady();
        })
    }
    onAssetReady() {
        this.gameControl.init(this.rulesType);
        // this.gameControl.table.cushionModel = this.cushionModel
    }
}


