import { PaintBall } from "../ball";
import type { Player } from "../player";
import { Vector2 } from "../utils";
import { Item } from "./item";

export class PopGun extends Item {
    constructor(player: Player) {
        super(player);
        this.texture = 'popgun';
    }

    startUsing(pointer: Vector2, direction: number) {
        this.world.addEntity(new PaintBall(this.player.paintColor, direction, 50, this.player.x, this.player.y, this.world));
    }

    endUsing(pointer: Vector2, direction: number) {
        
    }
}