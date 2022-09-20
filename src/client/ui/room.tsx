import React, { useEffect, useMemo, useState } from "react";
import { GameAppClient } from "../app";
import { useApp, useServerEvent } from "./utils";

function RoomPlayer(props: { name: string }) {

    return (
        <div className="room-player">
            <canvas className=""></canvas>
            <style jsx>{`

            `}</style>
        </div>
    )
}

export function Room(props: { roomId: string }) {
    const [roomReady, setRoomReady] = useState(false);
    const [playerList, setPlayerList] = useState<string[]>([]);
    const app = useApp();

    const onStartClicked = () => {
        app.serverEmit("start-game");
    }
    
    useServerEvent("room-update", () => {
        setRoomReady(roomReady);
        setPlayerList(playerList);
    })

    const playerListElems = useMemo(() => {
        return playerList.map((player) => (
            <div key={player}>{player}</div>
        ))
    }, [playerList]);

    return (
        <div className="room">
            <div>房间号:{props.roomId}</div>
            <div>玩家列表:</div>
            <div className="room-player-list">{playerListElems}</div>
            <div><button onClick={onStartClicked}>🎮 开始游戏</button></div>
        </div>
    )
}