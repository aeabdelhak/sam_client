import { ReactNode, useEffect, useState } from "react"
import fetchApi from "../utils/fetch"
import { LoaderIcon } from "react-hot-toast"
import { useAppContext } from "./Context/AppContext"
import Sidebar from "./Sidebar"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"
import { ipcRenderer } from "electron"

export default function Layout({ children }: { children: ReactNode }) {
    const { setUser, classes: {
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
        (
            async () => {
                setloading(true)
                try {

                    const data = await fetchApi('/auth/user')
                    setUser(data)
                } catch (error) {

                }
                setloading(false)
            }
        )()

        return () => {
            setUser(undefined)
        }
    }, [])
    if (loading) return <div className="w-screen h-full flex">
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
                        duration:0.3
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                    }}
                    initial={{
                        scale: !zoom ? 1.1:0.9,
                        opacity: 0,
                    }}
                    exit={{
                        scale:!zoom? 0.9:1.1,
                        opacity: 0,
                    }}
                    className="  h-full ml-24 flex-1 flex flex-col ">
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>

    )
}