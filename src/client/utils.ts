import * as PIXI from "pixi.js";
import { Renderer } from "pixi.js";

export function generateCircleTexture(renderer: Renderer, color: number, radius: number) {
    const gr = new PIXI.Graphics();
    gr.beginFill(color);
    gr.drawCircle(radius, radius, radius);
    gr.endFill();
    return renderer.generateTexture(gr);
}

export function generateRectTexture(renderer: Renderer, color: number, width: number) {
    const gr = new PIXI.Graphics();
    gr.beginFill(color);
    gr.drawRect(0, 0, width, width);
    gr.endFill();
    return renderer.generateTexture(gr);
}
  
export function colorNumToStr(num: number) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
    return "rgb(" + [r, g, b].join(",") + ")";
}