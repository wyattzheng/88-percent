import { BoomBall, PaintBall } from "../ball";
import type { Player } from "../player";
import { Vector2 } from "../utils";
import { Item } from "./item";

export class PopGun extends Item {
    constructor(player: Player) {
        super(player);
        this.texture = 'popgun';
    }

    startUsing(pointer: Vector2, direction: number) {
        this.world.addEntity(new BoomBall({
            life: 30,
            paintColor: this.player.paintColor, 
            direction, 
            speed: 10, 
            x: this.player.x, 
            y: this.player.y,
            generation: 0
        }, this.world));
    }

    endUsing(pointer: Vector2, direction: number) {
        
    }
}