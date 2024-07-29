import { _decorator, Component, Node } from 'cc';
import { RuleFactory } from './rules/RulesFactory';
import { Table } from './node/table/Table';
import { Rules } from './rules/Rules';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    table: Table
    id: string = ""
    isSinglePlayer: boolean = true
    rules: Rules

    last = performance.now()
    readonly step = 0.001953125 * 1

    init(ruleType) {
        this.rules = RuleFactory.create(ruleType, this);
        console.log(ruleType);
        console.log(this.rules.rulename);
    }

    update(deltaTime: number) {
        if (this.rules) {
            const steps = Math.floor(deltaTime / this.step)
            const computedElapsed = steps * this.step
            const stateBefore = this.table.allStationary()
            for (let i = 0; i < steps; i++) {
                this.table.advance(this.step)
            }
            this.table.updateBallMesh(computedElapsed)
            /* this.view.update(computedElapsed, this.table.cue.aim)
            this.table.cue.update(computedElapsed)
            if (!stateBefore && this.table.allStationary()) {
                this.eventQueue.push(new StationaryEvent())
            } */
        }
    }
}


