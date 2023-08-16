import { ReactNode, useEffect, useState } from "react"
import fetchApi from "../utils/fetch"
import { LoaderIcon } from "react-hot-toast"
import { useAppContext } from "./Context/AppContext"
import Sidebar from "./Sidebar"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"
import { ipcRenderer } from "electron"

export default function Layout({ children }: { children: ReactNode }) {
    const {
        user,
        getAuthUser, classes: {
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


        return () => { }
    }, [])

    function getdata() {
        !loading && setloading(true)
        getAuthUser().then(e => {
            setloading(false)
        })
    }


    if (!user) {
        getdata()
    }


    if (loading) return <div className="w-screen  h-screen  flex">
        <div className="m-auto scale-150">
            <LoaderIcon />
        </div>
    </div>

    return (
        <div className=" flex  flex-1  h-full ">
            <Sidebar />
            <AnimatePresence
                mode="popLayout"
            >
                <motion.div
                    key={router.pathname}
                    transition={{
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


                    }}
                    className="   h-full ml-24 flex-1 flex flex-col ">
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>

    )
}