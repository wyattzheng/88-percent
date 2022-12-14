import * as PIXI from "pixi.js";
import { GameAppClient } from "./app";
import { SmoothMoveManager } from "./move";
import { generateCircleTexture } from "./utils";
import type { Entity } from "./world";

export class PaintBall extends PIXI.Sprite implements Entity{
    private moveManager: SmoothMoveManager;
    constructor(private client: GameAppClient, public id: number, x: number, y: number, attrs: any) {
        super(generateCircleTexture(client.renderer, 0x00FF00, attrs.radius))
        this.position.set(x, -y);
        this.anchor.set(0.5, 0.5);
        this.moveManager = new SmoothMoveManager({ x, y });
        this.moveManager.on("newPos", ({x, y}) => {
            this.position.set(x, -y);
        })

        this.client.serverOn("entity-move", (id, x, y) => {
            if (id !== this.id) {
                return;                
            }
            this.moveManager.ackInput(x, y);
        })
    }

    update() {
        this.moveManager.update();
    }
    
}