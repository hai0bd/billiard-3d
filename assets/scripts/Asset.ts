import { RuleFactory } from "../src/rules/rulefactory"
import { Rules } from "../src/rules/rules"

export class Assets {
    ready
    rules: Rules
    background
    table
    cue

    constructor(ruletype) {
        this.rules = RuleFactory.create(ruletype, null) // ? Rules : NineBall/ThreeCushion/Snooker
        this.rules.tableGeometry()  //tableGeometry ? null
    }

    loadFromWeb(ready) {
        this.ready = ready;
        this.loadBackGround();
        this.loadTable();
        this.loadCue();
    }

    loadBackGround() {
        // this.background = ...
        this.done();
    }

    loadTable() {
        // this.table = ...
        this.done();
    }

    loadCue() {
        // this.cue = ...
        this.done();
    }

    private done() {
        if (this.background && this.table && this.cue) {
            this.ready()
        }
    }
}
