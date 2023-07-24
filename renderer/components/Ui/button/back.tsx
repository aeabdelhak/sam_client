import { ipcMain, ipcRenderer } from "electron";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-iconly"

export default function NavArrows() {
    const [canGoForward, setcanGoForward] = useState(false);
    const [canGoBack, setcanGoBack] = useState(false);
    const router = useRouter();
    function goBack() {
        ipcRenderer.send("goBack");
    }
    function goForward() {
        ipcRenderer.send("goForward");

    }
    useEffect(() => {
        ipcRenderer.on("canGoForward", (ev, data: boolean) => setcanGoForward(data))
        ipcRenderer.on("canGoBack", (ev, data: boolean) => setcanGoBack(data))
        return () => {
            ipcRenderer.off("canGoForward", (ev, data: boolean) => setcanGoForward(data))
            ipcRenderer.off("canGoBack", (ev, data: boolean) => setcanGoBack(data))
        }
    }, [])

    useEffect(() => {
        ipcRenderer.send("routeChange")
        return () => {

        }
    }, [router.pathname])


    return (
        <div className="flex border rounded-lg space-x-1 mx-2 overflow-hidden items-center  ">

            <button
                disabled={!canGoBack}
                onClick={goBack} className=" disabled:text-gray-400 w-6 h-6 flex justify-center gap-2 items-center hover:bg-gray-100/40">
                <ChevronLeft size={"small"} />
            </button>
            <button
                disabled={!canGoForward}
                onClick={goForward} className="disabled:text-gray-400 w-6 h-6 flex justify-center gap-2 items-center hover:bg-gray-100/40">
                <ChevronRight size={"small"} />
            </button>
        </div>
    )
}