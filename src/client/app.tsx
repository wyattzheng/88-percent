import * as PIXI from "pixi.js";
import { TileRenderer } from "@pixi/tilemap";
import React from "react";
import io, { Socket } from "socket.io-client"
import { World } from "./world";
import { createRoot, Root } from "react-dom/client";
import { Entry } from "./ui/entry";
import { EventEmitter } from "eventemitter3";
import { HTMLController } from "./controller";

export class GameAppClient extends EventEmitter{
    public world: World;
    public controller = new HTMLController();
    private name: string;
    private client: Socket;
    private gameApp: PIXI.Application;
    private gameContainer: HTMLElement;
    private uiRoot: Root;

    constructor(wsUrl: string) {
        super();
        this.client = io(wsUrl);
        this.client.onAny((event, ...args) => {
            console.debug(event, args)
        })
        this.client.on("start-game", this.onStartGame.bind(this));
        this.client.on("player-logined", this.onPlayerLogined.bind(this));
        this.initGameApp();
    }
    private initGameApp() {
        this.gameApp = new PIXI.Application({
            width: 600,
            height: 400,
        });
        this.gameApp.ticker.add(() => {
            this.world?.update();
        });
        this.gameApp.renderer.plugins.tilemap = new TileRenderer(this.renderer);
    }

    get renderer() {
        return this.gameApp.renderer as PIXI.Renderer;
    }

    mount(selector: string) {
        if (this.gameContainer) {
            throw new Error("already mounted");
        }
        const wrapper = document.querySelector(selector) as HTMLElement;
        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.display = "inline-flex";
        container.appendChild(this.gameApp.view);
        wrapper.appendChild(container);

        const uiContainer = document.createElement("div");
        uiContainer.classList.add("ui-container");
        uiContainer.style.position = "absolute";
        uiContainer.style.inset = "0px";

        this.uiRoot = createRoot(uiContainer);
        this.uiRoot.render(<Entry app={this} />)
        container.appendChild(uiContainer);

        this.gameContainer = container;

        this.controller.mount();
    }

    unmount() {
        this.gameContainer.parentElement.removeChild(this.gameContainer);
        this.controller.unmount();
    }

    private onStartGame() {
        this.world = new World(this);
        this.gameApp.stage.addChild(this.world);
    }

    private onPlayerLogined(name) {
        this.name = name;
    }

    getPlayerName() {
        return this.name;
    }

    getPlayer() {
        return this.world.player;
    }

    serverEmit(event: string, ...args: any[]) {
        this.client.emit(event, ...args);
    }

    serverOn(event: string, listener: (...args: any[]) => void) {
        this.client.on(event, listener);
    }
    
    serverOff(event: string, listener: (...args: any[]) => void) {
        this.client.off(event, listener);
    }

}