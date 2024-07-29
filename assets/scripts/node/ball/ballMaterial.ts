import { Material } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ballMaterial')
export class ballMaterial {
    @property(Material)
    white: Material

    @property(Material)
    yellow: Material;

    @property(Material)
    orange: Material;

    @property(Material)
    brown: Material;

    @property(Material)
    green: Material

    @property(Material)
    darkGreen: Material;

    @property(Material)
    blue: Material

    @property(Material)
    darkBlue: Material;

    @property(Material)
    red: Material;

    @property(Material)
    purple: Material;

    @property(Material)
    pink: Material

    @property(Material)
    black: Material;
}


