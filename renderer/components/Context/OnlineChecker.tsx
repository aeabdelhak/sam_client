import { toast } from "react-hot-toast";
import { config } from "../../utils/fetch";
import { ReactNode, useEffect, useState } from "react";

export default function OnlineChecker({ children }: { children: ReactNode }) {
    const [working, setworking] = useState<boolean>()
    useEffect(() => {
        let socket = new WebSocket(config.remoteAddress.replace("http", "ws"));
      
        socket.addEventListener('open', (event) => {
            setworking(true)
        });
        socket.addEventListener('error', (event) => {
            setworking(false)
        });
        socket.addEventListener('close', (event) => {
            setworking(false)
        });

        return () => {
            socket.removeEventListener('open', (event) => {
                setworking(true)
            });
            socket.removeEventListener('error', (event) => {
                setworking(false)
               socket= new WebSocket(config.remoteAddress.replace("http", "ws"));
            });
            socket.removeEventListener('close', (event) => {
                setworking(false)
                socket= new WebSocket(config.remoteAddress.replace("http", "ws"));

            });
        }
    }, [])

    return (
        <div
            className="flex flex-col flex-1 "

        >
     
            {children}
        </div>
    )
}