import { toast } from "react-hot-toast";
import { config } from "../../utils/fetch";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useSession } from "./SessionConext";
import { store } from "../../redux/store";
import { setOnline } from "../../redux/reducers/config";
export default function OnlineChecker({ children }: { children: ReactNode }) {
    const { online } = useAppSelector(e => e.config)
    const timer = useRef<NodeJS.Timer>(null)
    const socket = useRef<WebSocket>(null)
    const isMounted = useRef<boolean>(true)
    const host = useAppSelector(e => e.config.host)
    const { getAuthUser } = useSession()

    function onConnect() {
        store.dispatch(setOnline(true))
        getAuthUser();
    }
    function onClose() {
        store.dispatch(setOnline(false))
        if (isMounted.current)
            timer.current = setTimeout(() => {
                connectToWs()
            }, 2000);
    }

    function connectToWs() {
        socket.current = new WebSocket(config.getremoteAddress().replace("http", "ws"));
        socket.current.addEventListener('open', (event) => onConnect());
        socket.current.addEventListener('close', (event) => onClose());
        socket.current.addEventListener('error', (event) => onClose());
    }
    function removeWsEvents() {
        socket.current?.close()
        socket.current?.removeEventListener('open', (event) => onConnect());
        socket.current?.removeEventListener('close', (event) => onClose());
        socket.current?.removeEventListener('error', (event) => onClose());

    }


    useEffect(() => {
        connectToWs()
        window.addEventListener('focus', () => connectToWs());
        return () => {
            window.removeEventListener('focus', () => connectToWs());
            removeWsEvents()
            isMounted.current = true;
            clearTimeout(timer.current)
        }
    }, [host])

    if (online == null) return null


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