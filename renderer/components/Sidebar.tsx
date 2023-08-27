import { useRouter } from "next/router"
import { ReactNode, useEffect, useRef } from "react"
import { TimeCircle, Calendar, Category, Home, Logout, People, ShieldDone } from "react-iconly"
import { useAppContext } from "./Context/AppContext"
import { ipcRenderer } from "electron"
import { useTranslation } from "../utils/translations/Context"
import { Roles, useSession } from "./Context/SessionConext"


export default function Sidebar() {
    const translation = useTranslation()
    const { attendance: {
        absence
    } } = useAppContext()
    async function logout() {
        ipcRenderer.send("logoutSuccess")
    }
    const { user } = useSession()

    const { attendance: { getUnreviewd } } = useAppContext()
    const timer = useRef<NodeJS.Timer>()
    function getAbseces() {
        if (user && [Roles.Administrator, Roles.SuperUser].includes(user.role)) {
            getUnreviewd()
        }
        timer.current = setTimeout(() => {
            getAbseces()
        }, 1000 * 60)
    }
    useEffect(() => {
        getAbseces()
        return () => {
            clearTimeout(timer.current)
        }
    }, [])


    return (
        <div className="z-50">

            <div className="  flex-col w-36 fixed  top-0 h-screen    space-y-4  shrink-0  flex  items-center bg-gradient-to-br  bg-gray-100 text-gray-600 px-2 pb-2">
                <div className=" pt-8  font-mono flex justify-center items-center flex-col space-y-2">
                    <div className=" font-mono text-2xl font-bold ">
                        SAM
                    </div>
                </div>
                <hr />
                <div className="space-y-2 flex w-full flex-col  flex-1">


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
                        badge={absence.data?.flatMap(e => e.data).length}
                        label={translation.attendances}
                        profiles={[Roles.SuperUser, Roles.Administrator]}
                        activeOn="equal"
                        link="/menu/history"
                        icon={<TimeCircle size={"small"} />
                        }
                    />
                    <Item
                        label={translation.holidays}
                        profiles={[Roles.SuperUser, Roles.Administrator]}
                        activeOn="equal"
                        link="/menu/vacances"
                        icon={<Calendar size={"small"} />
                        }
                    />
                </div>
                <button
                    className="hover:bg-white/10 capitalize text-xs w-full disabled:bg-blue-700 font-light flex items-center gap-2 rounded-lg p-2 "
                    onClick={logout}>
                    <Logout size={"small"} />
                    {translation.logout}
                </button>
            </div>
        </div>
    )
}

function Item({ badge, icon, link, activeOn, profiles, label }: { badge?: number, profiles?: Roles[], label: string, activeOn: "equal" | "startWith", link: string, icon: ReactNode }) {
    const router = useRouter()
    const { user } = useSession();
    if (!profiles || (profiles.includes(user.role)))
        return (
            <button
                onClick={() => {
                    ipcRenderer.send("zoom", true)
                    router.push(link)
                }}
                disabled={activeOn == "equal" ? router.pathname == link : router.pathname.startsWith(link)} className="hover:bg-blue-700/10 capitalize  disabled:text-blue-700 text-sm flex justify-between items-center  font-extralight gap-2 rounded-lg p-2 ">
                <div className="flex items-center gap-2">
                    {icon}
                    {label}
                </div>
                {badge &&
                    <p className="h-4 w-4 rounded-full text-white text-xs font-bold shrink-0 bg-blue-600">
                        {badge > 9 ? "+9" : badge}
                    </p>
                }
            </button>
        )
    return null
}