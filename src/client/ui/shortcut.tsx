import React from "react";

export function Shortcut() {
    
    return (
        <div id="shortcut-container">
            <div id="shortcut">
                <div className="shortcut-item"></div>
                <div className="shortcut-item"></div>
                <div className="shortcut-item"></div>
                <div className="shortcut-item"></div>
                <div className="shortcut-item"></div>
                
            </div>
            <style jsx>{`
                #shortcut-container{
                    bottom: 0px;
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    position: absolute;
                }
                
                #shortcut{
                    position: absolute;
                    bottom: 10px;
                    height: 60px;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                    box-sizing: border-box;
                    border-radius: 5px;
                    background: #CCC;
                    border: 1px solid #FFF;
                }
                
                .shortcut-item{
                    background-color: #999;
                    width: 48px;
                    height: 48px;
                    border-radius: 3px;
                    margin-right: 6px;
                    border: 1px solid #888;
                    box-sizing: border-box;
                }
                .shortcut-item:last-child{
                    margin-right: 0px;
                }
            `}</style>
        </div>
    )
}