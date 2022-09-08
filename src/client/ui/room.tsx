import React, { useEffect, useMemo, useState } from "react";
import { GameAppClient } from "../app";

function RoomPlayer(props: { name: string }) {

    return (
        <div className="room-player">
            <canvas className=""></canvas>
            <style jsx>{`

            `}</style>
        </div>
    )
}

export function Room(props: { app: GameAppClient, roomId: string }) {
    const [roomReady, setRoomReady] = useState(false);
    const [playerList, setPlayerList] = useState<string[]>([]);

    const onStartClicked = () => {
        props.app.serverEmit("start-game");
    }
    
    useEffect(() => {
        let onUpdatedList;
        props.app.serverOn("room-update", onUpdatedList = (playerList, roomReady) => {
            setRoomReady(roomReady);
            setPlayerList(playerList);
        });
        return () => {
            props.app.serverOff("room-update", onUpdatedList);
        }
    }, []);

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