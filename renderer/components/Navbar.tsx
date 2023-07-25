import { ipcRenderer } from "electron";
import { Logout, VolumeOff, VolumeUp } from "react-iconly";
import NavArrows from "./Ui/button/back";
import { useAppContext } from "./Context/AppContext";
import { useState } from "react";
import audioNotif from "../utils/ring";

export default function Navbar() {
    const [muted, setmuted] = useState(audioNotif.muted)
    const { title, user } = useAppContext()

    return (
        <div className="  sticky top-0 bg-white z-20 ">
            <div className="flex ml-24  mx-auto p-4 items-center container">
                <div className="flex-1 flex items-center">
                    <NavArrows />
                    <div className="">
                        <h1 className="font-semibold capitalize text-lg tracking-wide text-gray-600">
                            {title}
                        </h1>
                    </div>
                </div>
                <div className=" grid   overflow-hidden ">
                    <div className="flex w-full space-x-2 items-center">
                        <button
                            onClick={() => setmuted(e => {
                                !e ? audioNotif.mute() : audioNotif.unmute()
                                return !e
                            })}
                            className="  w-6 h-6 text-xs  rounded-full flex justify-center items-center">
                            {!muted ? <VolumeUp size={"small"} /> : <VolumeOff size={"small"} />}
                        </button>
                        <div className=" uppercase bg-blue-700 text-white w-6 h-6 text-xs  rounded-full flex justify-center items-center">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className=" flex-1 grid">
                            <p className=" text-xs line-clamp-2 w-full ">
                                {user?.name}
                            </p>
                        </div>
                        <div className="flex">
                         
                        </div>
                    </div>

                </div>
            </div></div>
    )
}