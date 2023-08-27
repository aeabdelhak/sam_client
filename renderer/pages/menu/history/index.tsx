import { useState } from "react"
import History from "../../../components/Presence/History"
import Title from "../../../components/Title"
import { useTranslation } from "../../../utils/translations/Context"
import Absence from "../../../components/Presence/Absence"
import { useAppContext } from "../../../components/Context/AppContext"


export default function Index() {
    const translations = useTranslation()
    const [showHistory, setshowHistory] = useState(false)
    const { attendance: {
        absence
    }}=useAppContext()
    return (
        <div>
            <Title
                title={translations.presenceHistory}
            />

            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                    {translations.presenceHistory}
                </h1>
                <p className="text-xs">
                    {translations.presenceHistoryDesc}
                </p>
            </div>
            <div className="flex mb-6 gap-2">
                <button
                    onClick={() => setshowHistory(false)}
                    className={" flex gap-2 items-center font-bold px-2 border-b-2 ".concat(!showHistory ? " text-blue-500 border-blue-500" : "text-gray-400 border-gray-400")}>
                    {translations.absence}
                    <p className="h-4 w-4 rounded-full text-white text-xs font-bold shrink-0 bg-blue-600">
                        {absence.data?.flatMap(e=>e.data).length>9 ? "+9" :absence.data?.flatMap(e=>e.data).length}
                    </p>
                </button>
                <button
                    onClick={() => setshowHistory(true)}
                    className={" font-bold px-2 border-b-2 ".concat(showHistory ? " text-blue-500 border-blue-500" : "text-gray-400 border-gray-400")}>
                    {translations.history}
                </button>
            </div>
            {showHistory ?

                <History />
                :
                <Absence />
            }

        </div>
    )
}