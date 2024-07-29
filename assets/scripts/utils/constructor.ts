import { instantiate } from "cc";
import { GameManager } from "../GameManager";
import { Ball } from "../node/ball/Ball";
import { Table } from "../node/table/Table";

/* export function newBall(pos: Vec3, material: Material){
    const ballPrefab = GameManager.instance.ballPrefab;
    const ballNode = instantiate(ballPrefab);
    const ball = ballNode.getComponent(Ball);
    
    ballNode.setPosition(pos);
    ball.init(material);
    
    return ball;
} */
export function newTable(balls: Ball[]){
    const tablePrefab = GameManager.instance.tablePrefab;
    const tableNode = instantiate(tablePrefab);
    const table = tableNode.getComponent(Table);

    table.init(balls);

    return table;
}