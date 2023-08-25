import { useRouter } from "next/router"
import { ReactNode } from "react"
import { TimeCircle, Calendar, Category, Home, Logout, People, ShieldDone } from "react-iconly"
import {  useAppContext } from "./Context/AppContext"
import { ipcRenderer } from "electron"
import { useTranslation } from "../utils/translations/Context"
import { Roles, useSession } from "./Context/SessionConext"


export default function Sidebar() {
    const translation=useTranslation()
    async function logout() {
        localStorage.removeItem("authToken")
        ipcRenderer.send("logoutSuccess")
    }
    return (
        <div className="z-50">

            <div className="  flex-col w-36 fixed  top-0 h-screen    space-y-4  shrink-0  flex  items-center bg-gradient-to-br  bg-gray-100 text-gray-600 px-2 pb-2">
                <div className=" pt-8  font-mono flex justify-center items-center flex-col space-y-2">
                    <div className=" font-mono text-2xl font-bold ">
                        SAM
                    </div>
                </div>
                <hr />
                <div className="space-y-2 flex flex-col  flex-1">


                    <Item
                        label={translation.home}
                        activeOn="equal"
                        link="/menu"
                        icon={<Home size={"small"} />}
                    />
                    <Item
                        label={translation.guardians}
                        profiles={[Roles.Administrator, Roles.SuperUser]}
                        activeOn="equal"
                        link="/menu/guardians"
                        icon={<People size={"small"} />}
                    />
                    <Item
                        label={translation.classes}
                        profiles={[Roles.Administrator, Roles.SuperUser]}
                        activeOn="equal"
                        link="/menu/class"
                        icon={<Category size={"small"} />}
                    />
                    <Item
                        label={translation.accesses}
                        profiles={[Roles.SuperUser, Roles.Administrator]}
                        activeOn="equal"
                        link="/menu/access"
                        icon={<ShieldDone size={"small"} />
                        }
                    />
                    <Item
                        label={translation.attendances}
                        profiles={[Roles.SuperUser, Roles.Administrator]}
                        activeOn="equal"
                        link="/menu/history"
                        icon={<TimeCircle size={"small"} />
                        }
                    />
                    <Item
                        label={translation.vacances}
                        profiles={[Roles.SuperUser, Roles.Administrator]}
                        activeOn="equal"
                        link="/menu/vacances"
                        icon={<Calendar size={"small"} />
                        }
                    />
                </div>
                <button
                    className="hover:bg-white/10 w-full disabled:bg-blue-700 text-sm flex items-center gap-2 rounded-lg p-2 "
                    onClick={logout}>
                    <Logout size={"small"} />
                    {translation.logout}
                </button>
            </div>
        </div>
    )
}

function Item({ icon, link, activeOn, profiles, label }: { profiles?: Roles[], label:string, activeOn: "equal" | "startWith", link: string, icon: ReactNode }) {
    const router = useRouter()
    const { user } = useSession();
    if (!profiles || (profiles.includes(user.role)))
        return (
            <button
                onClick={() => {
                    ipcRenderer.send("zoom", true)
                    router.push(link)
                }}
                disabled={activeOn == "equal" ? router.pathname == link : router.pathname.startsWith(link)} className="hover:bg-blue-700/10 w-full disabled:text-blue-700 disabled: text-sm flex items-center font-extralight gap-2 rounded-lg p-2 ">
                {icon}
                {label}
            </button>
        )
    return null
}