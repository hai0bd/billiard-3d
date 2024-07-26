import { Rules } from "./rules/Rules";
import { RuleFactory } from "./rules/RulesFactory";
import { Table } from "./Table";

export class Container {
    rules: Rules;
    table: Table;

    constructor(asset, ruleType) {
        this.rules = RuleFactory.create(ruleType);
    }
}