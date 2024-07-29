import { _decorator, Component, Node } from 'cc';
import { RulesType } from './Enum';
import { Rules } from './rules/Rules';
import { RuleFactory } from './rules/RulesFactory';
const { ccclass, property } = _decorator;

@ccclass('Asset')
export class Asset{
    ready;
    rules: Rules;
    constructor(ruleType: RulesType){
        this.rules = RuleFactory.create(ruleType, null);
        this.rules.tableGeometry();
    }

    loadFromInput(ready){
        this.ready = ready;
        this.done()
    }
    done(){
        this.ready()
    }
}


