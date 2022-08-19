import * as PIXI from "pixi.js";
import { Renderer } from "pixi.js";

export function generateCircleTexture(renderer: Renderer, color: number, radius: number) {
    const gr = new PIXI.Graphics();
    gr.beginFill(color);
    gr.drawCircle(radius, radius, radius);
    gr.endFill();
    return renderer.generateTexture(gr);
}
