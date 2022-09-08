import * as PIXI from "pixi.js"
import type { GameAppClient } from "./app";
import { generateRectTexture } from "./utils";

export class Obstacle extends PIXI.Sprite{
    constructor(
        private client: GameAppClient,
        public id: number,
        x: number, y: number,
        private attrs: any
    ) {
        super();
        this.x = x;
        this.y = -y;
        this.texture = generateRectTexture(this.client.renderer, 0x55DDAA, this.attrs.width, 5);
        this.anchor.set(0.5, 0.5)
        this.rotation = -this.attrs.panelRad;
    }
   
}