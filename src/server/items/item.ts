import { AttributeMap } from "../attribute";
import type { Player } from "../player";
import type { Vector2 } from "../utils";
import type { World } from "../world";

export class Item{
    protected texture: string = ''
    protected world: World;
    public attrs = new AttributeMap();
    constructor(protected player: Player) {
        this.world = player.world;
    }

    startUsing(pointer: Vector2, direction: number) {
        
    }

    endUsing(pointer: Vector2, direction: number) {

    }

    getAttrs() {
        this.updateAttrs();
        return this.attrs.getAll();
    }
    
    updateAttrs() {
        this.attrs.set('texture', this.texture);
    }

    update() {
        this.updateAttrs();

    }
}