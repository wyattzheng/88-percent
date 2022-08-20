import * as PIXI from "pixi.js";
import { GameAppClient } from "./app";
import { PaintBall } from "./ball";
import { Player } from "./player";
import { CompositeRectTileLayer } from "@pixi/tilemap";
import { generateCircleTexture } from "./utils";

interface Updateable extends PIXI.DisplayObject {
    update?(): void;
}

export const entityFactory = [Player, PaintBall];

export class Panel extends CompositeRectTileLayer{
    private colors = new Map<number, PIXI.Texture>();
    private tick = 0;
    private queuedTiles = [];
    constructor(colors: number[], private tileWidth: number, private world: World) {
        super();
        for(const color of colors) {
            this.colors.set(color, generateCircleTexture(world.renderer, color, tileWidth ));
        }
    }

    paint(color: number, ix: number, iy: number) {
        this.queuedTiles.push([this.tick + 5, color, ix, iy]);
    }

    update() {
        const newQueue = [];
        for(const item of this.queuedTiles) {
            const [tickAt, color, ix, iy] = item;
            if (this.tick > tickAt) {
                const texture = this.colors.get(color);
                this.tile(texture, ix * this.tileWidth, iy * this.tileWidth);        
            } else {
                newQueue.push(item);
            }
        }
        this.queuedTiles = newQueue;
        this.tick++;
    }
}

export class World extends PIXI.Container{
    private entities = new PIXI.Container<Updateable>();
    private panel: Panel;
    public renderer: PIXI.Renderer;
    public player: Player;

    constructor(public client: GameAppClient) {
        super();

        this.renderer = client.renderer;
        this.entities.zIndex = 2;
        this.addChild(this.entities);
        this.client.serverOn("add-entity", (type: string, x, y, attrs) => {
            entityFactory.forEach((entityClass) => {
                if (entityClass.name === type) {
                    const entity = new entityClass(client, x, y, attrs);
                    this.entities.addChild(entity);
                }
            })
        });
        this.client.serverOn("paint", (color: number, ix: number, iy: number) => {
            this.panel.paint(color, ix, iy);
        })
        this.client.serverOn("reset-world", this.onResetWorld.bind(this));
    }

    private onResetWorld(colors: number[], tileWidth: number) {
        this.panel = new Panel(colors, tileWidth, this);
        this.panel.zIndex = 1;
        this.addChild(this.panel);
        this.sortChildren();
    }

    setPlayer(player: Player) {
        this.player = player;
    }

    update() {
        this.entities.children.forEach((entity) => {
            entity.update && entity.update();
        })
        this.panel?.update()
    }
}