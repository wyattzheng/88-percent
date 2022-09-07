import React from "react";
import type { GameAppClient } from "../app";

export function Controller(props: { app: GameAppClient, gameStarted: boolean }) {
    return (
        <div className="controller">
            <style jsx>{`
                .controller{
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </div>
    )
}