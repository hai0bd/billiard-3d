import { Vec3 } from "cc";
import { Ball } from "../node/ball/Ball";
import { Table } from "../node/table/Table";

export interface Rules{
    cueball: Ball;
    currentBreak: number;
    previousBreak: number;
    score: number;
    rulename: string;
    // update(outcome: Outcome[]): Controller;
    rack(): Ball[];
    tableGeometry();
    table(): Table;
    secondToPlay();
    otherPlayersCueBall(): Ball;
    // isPartOfBreak(outcome: Outcome[]): boolean;
    // isEndOfGame(outcome: Outcome[]): boolean;
    allowsPlaceBall(): boolean;
    placeBall(target?): Vec3;
    asset(): string;
    nextCandidateBall();
    startTurn();
}