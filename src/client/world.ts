import * as PIXI from "pixi.js";
import { GameAppClient } from "./app";
import { PaintBall } from "./ball";
import { Player } from "./player";
import { colorNumToStr } from "./utils";

export interface Entity extends PIXI.DisplayObject {
    id: number;
    update?(): void;
}

export const entityFactory = [Player, PaintBall];

export class Panel extends PIXI.Sprite{
    private colors: PIXI.Texture[] = [];
    private tick = 0;
    private queuedTiles = [];
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    constructor(colors: number[], private tileWidth: number, width: number, height: number, private world: World) {
        super(PIXI.Texture.WHITE);
        this.canvas = document.createElement("canvas");
        this.canvas.width = tileWidth * width;
        this.canvas.height = tileWidth * height;
        this.texture = PIXI.Texture.from(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }

    paint(color: number, ix: number, iy: number) {
        this.queuedTiles.push([this.tick + 5, color, ix, iy]);
    }
    
    update() {
        const newQueue = [];
        for(const item of this.queuedTiles) {
            const [tickAt, color, ix, iy] = item;
            if (this.tick > tickAt) {
                this.ctx.fillStyle = colorNumToStr(color);
    //          this.ctx.beginPath();
    //          this.ctx.arc(ix * this.tileWidth, iy * this.tileWidth, this.tileWidth, 0, 2 * Math.PI);
    //          this.ctx.fill();
                this.ctx.fillRect(ix * this.tileWidth, iy * this.tileWidth, this.tileWidth, this.tileWidth);
            } else {
                newQueue.push(item);
            }
        }
        this.queuedTiles = newQueue;
        this.texture.update();
        this.tick++;
    }
}

export class World extends PIXI.Container{
    public entities = new PIXI.Container<Entity>();
    public panel: Panel;
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
        this.client.serverOn("remove-entity", (id: number) => {
            this.entities.removeChild(this.getEntity(id));
        })
        this.client.serverOn("paint", (paintings: number[][]) => {
            for(const painting of paintings) {
                this.panel.paint(painting[0], painting[1], painting[2]);
            }
        })
        this.client.serverOn("reset-world", this.onResetWorld.bind(this));
    }

    private onResetWorld(colors: number[], tileWidth: number, panelWidth: number, panelHeight: number) {
        this.panel = new Panel(colors, tileWidth, panelWidth, panelHeight, this);
        this.panel.zIndex = 1;
        this.addChild(this.panel);
        this.sortChildren();
    }

    private getEntity(id: number) {
        return this.entities.children.find((x) => x.id === id);
    }

    getPointer() {
        return this.client.controller.pointer;
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