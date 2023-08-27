import { ChevronDown, CloseSquare, Setting, VolumeOff, VolumeUp } from "react-iconly";
import { CiMaximize2 } from "react-icons/ci";
import { MdMinimize } from "react-icons/md";
import { useAppTitle } from "./Context/TitleConext";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import audioNotif from "../utils/ring";
import { translation, useTranslation } from "../utils/translations/Context";
import NavArrows from "./Ui/button/back";
import { useSession } from "./Context/SessionConext";
import { config } from "../utils/fetch";
import IpSettings from "./IpSettings";
import { useAppSelector } from "../redux/hooks";

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
            <div className={"flex items-center flex-1 ".concat(title && title.trim()!="" ? " ltr:ml-40 rtl:mr-40 " :"")}>

                <NavArrows />
                <div
                    onDoubleClick={() => ipcRenderer.send("maximizeAppOnly")}
                    className={" flex-1  appDrag h-6 flex "}>
                    <h1 className={"font-semibold flex items-center my-auto  capitalize text-xs  tracking-wide "}>
                        {title}
                    </h1>
                </div>
            </div>
            <div className=" gap-2 divide-x flex items-center">


                <AppConnectedTo />
                <div className="">
                    <select className="text-xs outline-none" value={code} onChange={e => {
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
                        <option value={"sp"}>
                            sp
                        </option>
                        <option value={"de"}>
                            de
                        </option>

                    </select>
                </div>
                <button
                    onClick={() => setmuted(e => {
                        !e ? audioNotif.mute() : audioNotif.unmute()
                        return !e
                    })}
                    className="   w-6 h-6 text-xs cursor-pointer   flex justify-center items-center">
                    {!muted ? <VolumeUp size={"small"} /> : <VolumeOff size={"small"} />}
                </button>
                {user && <div className=" grid  bg-blue-100  rounded-lg  ">
                    <div className="flex bgbl justify-center w-full  items-center">
                        <div className=" uppercase bg-blue-200  text-blue-800 w-4 h-4 text-[10pt]  rounded-full flex justify-center items-center">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="px-2 flex-1 grid">
                            <p className=" text-xs line-clamp-2 w-full ">
                                {user?.name}
                            </p>
                        </div>

                    </div>

                </div>}
                <div className="  flex justify-center items-center  text-center w-16 ">
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
        </div>
    )
}

function AppConnectedTo() {
    const {nudedHost,online}=useAppSelector(e=>e.config)

    const [openConfigs, setopenConfigs] = useState(false)
  

    return (
        <div className="flex gap-2">
            {nudedHost && 
                <div className="flex gap-1 items-center">
                   <div className={" p-[5px] rounded-full ".concat(online? "bg-green-500":"bg-red-500")}/> {nudedHost}
            </div>
            }
           {openConfigs && <IpSettings
                open={openConfigs}
                setOpen={setopenConfigs}
            />}
            <button
            onClick={()=>setopenConfigs(true)}
            >
                 <Setting size={"small"} />
            </button>
        </div>
    )
}