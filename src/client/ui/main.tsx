import React, { useEffect, useMemo, useState } from "react";
import type { GameAppClient } from "../app";
import { Shortcut } from "./shortcut";
import { useDevAction } from "./devtools";
import { UIContext, useApp, useServerEvent, wait } from "./utils";
import { Room } from "./room";

export interface BootstrapProps{
    app: GameAppClient
}

export function getRandomName() {
    return "wyatt" + Math.floor(Math.random() * 100);
}

export function Bootstrap(props: BootstrapProps) {
    return (
        <UIContext.Provider value={{ app: props.app }}>
            <Main></Main>
        </UIContext.Provider>
    )
}

export function Main() {
    const [roomEntered, setRoomEntered] = useState(false);
    const [playerName, setPlayerName] = useState(getRandomName());
    const [roomId, setRoomId] = useState("test");
    const [gameStarted, setGameStarted] = useState(false);
    const app = useApp();

    useServerEvent("entered-room", () => {
        setRoomEntered(true);
    })
        
    useServerEvent("start-game", () => {
        setGameStarted(true);
    })

    const onEnterClicked = () => {
        app.serverEmit("request-login", playerName);
        app.serverEmit("request-enter-room", roomId);
    }

    useDevAction(async () => {
        onEnterClicked();
        await wait(500);
        app.serverEmit("start-game");
        await wait(1500);

        return gameStarted;
    }, '自动进入游戏')

    return (
            <div className="main">
                {
                    !roomEntered && !gameStarted &&
                    <div className="room-enter">
                        <div>名字:</div>
                        <div><input placeholder="请填写名字" value={playerName} onChange={(e)=>setPlayerName(e.currentTarget.value)}></input></div>                    
                        <div>房间号:</div>
                        <div><input placeholder="请填写房间号" value={roomId} onChange={(e)=>setRoomId(e.currentTarget.value)}></input></div>
                        <div><button onClick={onEnterClicked}>🏠 进入房间</button></div>
                    </div>
                }
                {
                    roomEntered && !gameStarted &&
                    <Room roomId={roomId} ></Room>
                }
                <Shortcut></Shortcut>
                <style global jsx>{`
                    html, body{
                        overflow-x: hidden;
                        margin: 0;
                    }
                    .main{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        color: #FFF;
                    }
                    .room-enter input{
                        outline: 0;
                    }
                `}</style>
            </div>
    )
}