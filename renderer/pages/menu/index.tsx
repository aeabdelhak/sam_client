
import Link from "next/link"
import Title from "../../components/Title"
import { useAppContext } from "../../components/Context/AppContext"
import { useEffect, useState } from "react"
import { translation, useTranslation } from "../../utils/translations/Context";
import { useSession } from "../../components/Context/SessionConext";


function getGreetingSText() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return translation.getCurrent().haveawonderfulday;
    } else if (currentHour >= 12 && currentHour < 17) {
        return translation.getCurrent().enjoyyourafternoon;
    } else if (currentHour >= 17 && currentHour < 21) {
        return translation.getCurrent().havealovelyevening;
    } else {
        return translation.getCurrent().goodNight;
    }
}

export default function HomePage() {
    const { user } = useSession()
    const translations=useTranslation()
    const { classes: {
        data, getData, loading
    } } = useAppContext()
    const [greeting, setgreeting] = useState<string>()
    useEffect(() => {
        getData();
        const interval = setInterval(() => setgreeting(getGreetingSText())
            , 0)
        return () => {
            clearInterval(interval)
        }
    }, [])


    return (

        <div className=" flex flex-col flex-1  ">
            <Title
                title={translations.home}
            />
            <div className="flex   mb-6 flex-col ">

                <h1 className="font-semibold mb-4 text-3xl">
                    {greeting ?? getGreetingSText()} <br /> <b className="text-blue-700">
                        {user.name}
                    </b>
                </h1>
                <p className="text-xs">
                    {translations.selectTheClassPls}
                </p>
            </div>
            <div className="col-span-2 rounded-lg bg-slate-50 p-6">
                <div className="flex justify-between pb-6">
                    <h1 className="font-semibold text-xl">
                        {translations.classes}
                    </h1>
                </div>
                {loading ?
                    <div className="space-y-1">
                        {Array.from(Array(6).keys()).map(e => (
                            <div
                                key={e} style={{
                                    animationDelay: e * .3 + "s"
                                }} className=" p-6 rounded-lg animate-pulse bg-gray-200">

                            </div>
                        ))}
                    </div>
                    : <div className="space-y-1">
                        {data?.map(e => (
                            <Link
                                href={"/menu/class/" + e.id + "?label=" + e.label}
                                key={e.id}
                            >
                                <a className="flex w-full group transition-all disabled:bg-blue-700  items-center disabled:text-white gap-2 p-2 bg-white rounded-md hover:text-blue-600 hover:bg-blue-100">

                                    <div className="flex flex-1 items-start space-y-1 flex-col">
                                        <p className="text-sm ">
                                            {e.label}
                                        </p>
                                    </div>
                                    <div className="text-xs">
                                        {e.Students?.length} {translations.students}
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>}
            </div>

        </div>
    )
}