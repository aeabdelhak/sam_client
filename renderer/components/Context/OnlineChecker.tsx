import { toast } from "react-hot-toast";
import { config } from "../../utils/fetch";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useAppContext } from "./AppContext";
import { useAppSelector } from "../../redux/hooks";
import { useSession } from "./SessionConext";
import { store } from "../../redux/store";
import { setOnline } from "../../redux/reducers/config";
export default function OnlineChecker({ children }: { children: ReactNode }) {
    const {online} = useAppSelector(e=>e.config)
    const timer = useRef<NodeJS.Timer>(null)
    const socket = useRef<WebSocket>(null)
    const isMounted = useRef<boolean>(true)
    const host = useAppSelector(e => e.config.host)
    const { getAuthUser } = useSession()
    function connectToWs() {
        socket.current = new WebSocket(config.getremoteAddress().replace("http", "ws"));
        socket.current.addEventListener('open', (event) => {
            store.dispatch(setOnline(true))
            getAuthUser();
            toast("connected to remote server")

        });
        socket.current.addEventListener('close', (event) => {
            store.dispatch(setOnline(false))
            if (isMounted.current)
                timer.current = setTimeout(() => {
                    connectToWs()
                }, 2000);
        });
    }
    function removeWsEvents() {
        socket.current?.removeEventListener('open', (event) => {
            store.dispatch(setOnline(true))
            toast("connected to remote server")
        });

        socket.current?.removeEventListener('close', (event) => {
            store.dispatch(setOnline(false))
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
    }, [host])

    if(online==null) return null

    return (
        <div
            key={host}
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