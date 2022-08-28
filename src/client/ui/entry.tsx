import React, { useEffect, useMemo, useState } from "react";
import type { GameAppClient } from "../app";
import { Shortcut } from "./shortcut";
import { useDevAction } from "./devtools";

import "./entry.css";
import { wait } from "./utils";

export interface EntryProps{
    app: GameAppClient
}

export function getRandomName() {
    return "wyatt" + Math.floor(Math.random() * 100);
}

export function Entry(props: EntryProps) {
    const [roomEntered, setRoomEntered] = useState(false);
    const [roomReady, setRoomReady] = useState(false);
    const [playerName, setPlayerName] = useState(getRandomName());
    const [roomId, setRoomId] = useState("test");
    const [playerList, setPlayerList] = useState<string[]>([]);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        let onUpdatedList, onEnteredRoom, onStartGame;

        props.app.serverOn("entered-room", onEnteredRoom = () => {
            setRoomEntered(true);
        })
        
        props.app.serverOn("room-update", onUpdatedList = (playerList, roomReady) => {
            setRoomReady(roomReady);
            setPlayerList(playerList);
        });

        props.app.serverOn("start-game", onStartGame = () => {
            setGameStarted(true);
        })

        return () => {
            props.app.serverOff("entered-room", onEnteredRoom);
            props.app.serverOff("room-update", onUpdatedList);
            props.app.serverOff("start-game", onStartGame);
        }
    }, []);

    const onEnterClicked = () => {
        props.app.serverEmit("request-login", playerName);
        props.app.serverEmit("request-enter-room", roomId);
    }

    const onStartClicked = () => {
        props.app.serverEmit("start-game");
    }

    const playerListElems = useMemo(() => {
        return playerList.map((player) => (
            <div key={player}>{player}</div>
        ))
    }, [playerList]);

    useDevAction(async () => {
        onEnterClicked();
        await wait(500);
        onStartClicked();
        await wait(1500);

        return gameStarted;
    }, '自动进入游戏')

    return (
        <div className="entry">
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
                <div className="room">
                    <div>房间号:{roomId}</div>
                    <div>玩家列表:</div>
                    <div className="room-player-list">{playerListElems}</div>
                    <div><button onClick={onStartClicked}>🎮 开始游戏</button></div>
                </div>
            }
            <Shortcut></Shortcut>
        </div>
    )
}