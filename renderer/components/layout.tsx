import { ReactNode, useEffect, useState } from "react"
import fetchApi from "../utils/fetch"
import { LoaderIcon } from "react-hot-toast"
import { useAppContext } from "./Context/AppContext"
import Sidebar from "./Sidebar"

export default function Layout({ children }: { children: ReactNode }) {
    const { setUser, classes: {
        getData,
    } } = useAppContext()
    const [loading, setloading] = useState(true)
    useEffect(() => {
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
    if (loading) return <div className="w-screen h-screen flex">
        <div className="m-auto scale-150">
            <LoaderIcon />
        </div>
    </div>

    return (
        <div className=" flex   h-screen ">
         <Sidebar/>
            <div className="  ml-10 flex-1 flex flex-col ">
                {children}
            </div>
        </div>

    )
}