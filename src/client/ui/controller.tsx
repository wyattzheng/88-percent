import React, { useEffect } from "react";
import keyboardJs from "keyboardjs";
import type { GameAppClient } from "../app";

export function Controller(props: { app: GameAppClient, gameStarted: boolean }) {
    
    useEffect(() => {
        if(!props.gameStarted) {
            return;
        }
    }, [props.gameStarted]);

    return <></>
}