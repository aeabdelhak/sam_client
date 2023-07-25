import { useRouter } from "next/router"
import { ReactNode } from "react"
import { AddUser, Category, Home, Logout, People, ShieldDone } from "react-iconly"
import { Roles, useAppContext } from "./Context/AppContext"
import { ipcRenderer } from "electron"


export default function Sidebar() {
    async function logout() {
        localStorage.removeItem("authToken")
        ipcRenderer.send("logoutSuccess")
    }
    return (
        <div className="z-50">

            <div className="  flex-col w-14 fixed  top-0 h-screen   text-white space-y-4  shrink-0  flex  items-center bg-gradient-to-br  bg-blue-900 px-2 pb-2">
                <div className=" pt-8  font-mono flex justify-center items-center flex-col space-y-2">
                    <div className=" text-2xl font-bold ">
                        SAM
                    </div>
                </div>
                <hr />
                <div className="space-y-2 flex flex-col items-center flex-1">


                    <Item
                        activeOn="equal"
                        link="/menu"
                        icon={<Home size={"small"} />}
                    />
                    <Item
                        profiles={[Roles.Administrator, Roles.SuperUser]}
                        activeOn="equal"
                        link="/menu/guardians"
                        icon={<People size={"small"} />}
                    />
                    <Item
                        profiles={[Roles.Administrator, Roles.SuperUser]}
                        activeOn="equal"
                        link="/menu/class"
                        icon={<Category size={"small"} />}
                    />
                    <Item
                        profiles={[Roles.SuperUser, Roles.Administrator]}
                        activeOn="equal"
                        link="/menu/access"
                        icon={<ShieldDone size={"small"} />}
                    />        </div>
                <button
                className="p-2"
                    onClick={logout}>
                    <Logout size={"small"} />
                </button>
            </div>
        </div>
    )
}

function Item({ icon, link, activeOn, profiles }: { profiles?: Roles[], activeOn: "equal" | "startWith", link: string, icon: ReactNode }) {
    const router = useRouter()
    const { user } = useAppContext();
    if (!profiles || (profiles.includes(user.role)))
        return (
            <button
                onClick={() => {
                    ipcRenderer.send("zoom",true)
                    router.push(link)
                }}
                disabled={activeOn == "equal" ? router.pathname == link : router.pathname.startsWith(link)} className="hover:bg-white/10 disabled:bg-blue-700 rounded-lg p-2 ">
                {icon}
            </button>
        )
    return null
}