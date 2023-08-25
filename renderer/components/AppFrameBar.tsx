import { ChevronDown, CloseSquare, VolumeOff, VolumeUp } from "react-iconly";
import { CiMaximize2 } from "react-icons/ci";
import { MdMinimize } from "react-icons/md";
import { useAppTitle } from "./Context/TitleConext";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import audioNotif from "../utils/ring";
import { translation, useTranslation } from "../utils/translations/Context";
import NavArrows from "./Ui/button/back";
import { useSession } from "./Context/SessionConext";

export default function AppFrameBar() {
    const { title } = useAppTitle()
    const [curreTime, setcurreTime] = useState<Date>(new Date())
    const [muted, setmuted] = useState(audioNotif.muted)
    const { code } = useTranslation()
    const { user } = useSession()

    useEffect(() => {
        const interval = setInterval(() => {
            setcurreTime(new Date())
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className=" z-[40] text-xs inset-x-0 fixed   top-0 justify-between items-center bg-white border-b flex ">
            <div className="ltr:ml-36 rtl:mr-36 flex items-center flex-1">

                <NavArrows />
                <div
                    onDoubleClick={() => ipcRenderer.send("maximizeAppOnly")}
                    className={" flex-1  appDrag h-6 flex "}>
                    <h1 className={"font-semibold flex items-center my-auto  capitalize text-xs  tracking-wide "}>
                        {title}
                    </h1>
                </div>
            </div>

            <div className="">
                <select className="text-xs" value={code} onChange={e => {
                    translation.set(e.target.value)
                }}>
                    <option value={"en"}>
                        en
                    </option>
                    <option value={"ar"}>
                        ar
                    </option>
                    <option value={"fr"}>
                        fr
                    </option>

                </select>
            </div>
            <button
                onClick={() => setmuted(e => {
                    !e ? audioNotif.mute() : audioNotif.unmute()
                    return !e
                })}
                className="  w-6 h-6 text-xs cursor-pointer  rounded-full flex justify-center items-center">
                {!muted ? <VolumeUp size={"small"} /> : <VolumeOff size={"small"} />}
            </button>
            {user && <div className=" grid  bg-gray-200 px-2 rounded-lg  ">
                <div className="flex w-full gap-2 items-center">
                    <div className=" uppercase bg-blue-200  text-blue-800 w-4 h-4 text-[6pt]  rounded-full flex justify-center items-center">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className=" flex-1 grid">
                        <p className=" text-xs line-clamp-2 w-full ">
                            {user?.name}
                        </p>
                    </div>

                </div>

            </div>}
            <div className="  text-center w-16 ">
                <p className="  ">
                    {curreTime?.toLocaleTimeString("fr", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "2-digit"
                    })}
                </p>
            </div>
            <div className="flex border-l rounded">
                <button
                    onClick={e => ipcRenderer.send("minimizeApp")}
                    className="  w-6 h-6 cursor-pointer text-xs hover:bg-gray-100  rounded flex justify-center items-center">
                    <MdMinimize

                    />
                </button>
                <button
                    onClick={e => ipcRenderer.send("maximizeApp")}
                    className="  w-6 h-6 cursor-pointer text-xs hover:bg-gray-100  rounded flex justify-center items-center">
                    <CiMaximize2

                    />
                </button>

                <button
                    onClick={e => ipcRenderer.send("closeApp")}
                    className="  w-6 h-6 cursor-pointer text-xs hover:bg-gray-100  rounded flex justify-center items-center">
                    <CloseSquare
                        size={"small"}
                    />
                </button>
            </div>
        </div>
    )
}