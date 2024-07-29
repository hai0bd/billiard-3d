import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Aim')
export class Aim extends Component {
    offset: Vec3 = new Vec3();
    angle: number = 0;
    power: number = 0;
    pos: Vec3 = new Vec3();
    i = 0;
}