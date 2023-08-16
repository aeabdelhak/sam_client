import { toast } from "react-hot-toast";
import { config } from "../../utils/fetch";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useAppContext } from "./AppContext";
export default function OnlineChecker({ children }: { children: ReactNode }) {
    const [online, setonline] = useState(true)

    const timer = useRef<NodeJS.Timer>(null)
    const socket = useRef<WebSocket>(null)
    const isMounted = useRef<boolean>(true)

    function connectToWs() {

        socket.current = new WebSocket(config.getremoteAddress().replace("http", "ws"));

        socket.current.addEventListener('open', (event) => {
                toast("connected to remote server")
                setonline(true)

        });
        socket.current.addEventListener('close', (event) => {
            setonline(false)
            if (isMounted.current)
                timer.current = setTimeout(() => {
                    connectToWs()
                }, 2000);
        });
    }
    function removeWsEvents() {
        socket.current?.removeEventListener('open', (event) => {
            setonline(true)
            toast("connected to remote server")
        });

        socket.current?.removeEventListener('close', (event) => {
                if (isMounted.current)
                    timer.current = setTimeout(() => {
                        connectToWs()
                    }, 2000);
        });
    }


    useEffect(() => {
        connectToWs()

        return () => {
            removeWsEvents()
            isMounted.current = true;
            clearTimeout(timer.current)
        }
    }, [])

    return (
        <div

            className="flex flex-col flex-1 "

        >

            {online ?
                children :
                <div className="h-screen w-screen flex justify-center items-center flex-col">
                    <p className="text-red-700 bg-red-100 text-sm font-semibold px-4 py-2">
                        lost connection to remote server
                    </p>
                </div>
            }
        </div>
    )
}