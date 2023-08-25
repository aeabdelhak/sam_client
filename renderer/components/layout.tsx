import { ReactNode, useEffect, useState } from "react"
import fetchApi from "../utils/fetch"
import { LoaderIcon } from "react-hot-toast"
import { useAppContext } from "./Context/AppContext"
import Sidebar from "./Sidebar"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"
import { ipcRenderer } from "electron"
import { useSession } from "./Context/SessionConext"

export default function Layout({ children }: { children: ReactNode }) {
    const {user,getAuthUser}=useSession()
    const { classes: {
            getData,
        } } = useAppContext()
    const router = useRouter();
    const [zoom, setzoom] = useState(true)
    const [loading, setloading] = useState(true)
    useEffect(() => {
        ipcRenderer.on("zoom", (event, data) => {
            setzoom(data);
        })
        getData();

        if (!user) {
            getdata()
        } else {
            setloading(false)
        }
        return () => { }
    }, [])

    function getdata() {
        !loading && setloading(true)
        getAuthUser().then(e => {
            setloading(false)
        })
    }





    if (loading) return <div className="w-screen pt-10  h-screen  flex">
        <div className="m-auto scale-150">
            <LoaderIcon />
        </div>
    </div>

    return (
        <div className=" flex pt-10  flex-1  h-full ">
            <Sidebar />
            <
            >
                <div
                    key={router.pathname}
                /*     transition={{
                        duration: 0.5
                    }}
                    animate={{
                        translateX: 0,
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0rem)"

                    }}
                    initial={{
                        translateX: !zoom ? "-100%" : "100%",
                        opacity: 0,
                        scale: 1,
                        filter: "blur(0.5rem)"


                    }}
                    exit={{
                        translateX: !zoom ? "100%" : "-100%",
                        opacity: 0,
                        filter: "blur(1.5rem)"


                    }} */
                    className="   h-full ltr:ml-36 rtl:mr-36 flex-1 flex flex-col ">
                    {children}
                </div>
            </>
        </div>

    )
}