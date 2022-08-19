import * as PIXI from "pixi.js";
import { GameAppClient } from "./app";
import { PaintBall } from "./ball";
import { Player } from "./player";

interface Updateable extends PIXI.DisplayObject {
    update?(): void;
}

export const entityFactory = [Player, PaintBall];

export class World extends PIXI.Container{
    private entities = new PIXI.Container<Updateable>();
    public player: Player;

    constructor(private client: GameAppClient) {
        super();

        console.log("add-world")
        this.addChild(this.entities);
        this.client.serverOn("add-entity", (type: string, x, y, attrs) => {
            entityFactory.forEach((entityClass) => {
                if (entityClass.name === type) {
                    const entity = new entityClass(client, x, y, attrs);
                    this.entities.addChild(entity);
                }
            })
        });
    }

    setPlayer(player: Player) {
        this.player = player;
    }

    update() {
        this.entities.children.forEach((entity) => {
            entity.update && entity.update();
        })
    }
}