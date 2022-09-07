import React from "react";

export function Shortcut() {
    
    return (
        <div id="shortcut-container">
            <div id="shortcut">
                <div className="shortcut-item">
                    
                </div>
            </div>
            <style jsx>{`
                #shortcut-container{
                    bottom: 0px;
                    display: flex;
                    justify-content: center;
                }
                
                #shortcut{
                    position: absolute;
                    bottom: 10px;
                    height: 80px;
                    padding: 5px;
                    display: flex;
                    flex-direction: row;
                }
                
                .shortcut-item{
                    width: 60px;
                    background-color: brown;
                }
            `}</style>
        </div>
    )
}