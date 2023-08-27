import { FormEvent, useEffect } from "react"
import { Presence, useAppContext } from "../Context/AppContext"
import { config } from "../../utils/fetch"
import Button from "../Ui/button/Button"
import useLoading from "../../utils/Hooks/useLoading"
import { useTranslation } from "../../utils/translations/Context"
import { LoaderIcon } from "react-hot-toast"

export default function Absence() {
    const [saving, startTransition] = useLoading()
    const translations = useTranslation();
    const {
        attendance: {
            absence,
            getUnreviewd,
            absenceReview
        }
    } = useAppContext()
    useEffect(() => {
        getUnreviewd()
    }, [])
    async function save(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault()
        const formdata = new FormData(ev.currentTarget)
        const entries = (Object.entries(Object.fromEntries(formdata.entries())).map(e => ({
            id: e[0].split(":")[1],
            justified: e[1] == "true"
        })))
        await absenceReview(entries)
    }

    return (<>
       {saving && <div className="fixed inset-0 grid place-items-center">
            <div className="scale-[3]">
                <LoaderIcon />
            </div>
        </div>}
        <form onSubmit={async e => startTransition(async () => save(e))} className="space-y-1  divide-y">
            {absence.data && absence.data?.length > 0 &&
                <div className="flex justify-end">
                    <Button
                        disabled={saving}
                        type="submit"
                        className="text-xs !px-4 !py-1">
                        {translations.save}
                    </Button>
                </div>
            }
            {absence.data && absence.data?.length == 0 &&

                <div className="font-light">
                    {translations.noDataToReview}
                </div>
            }
              {!absence.data && absence.loading &&
                <div className="scale-[3]">
                    <LoaderIcon />
                </div>
            }

            {absence.data?.map((absence) => (
                <div key={absence.date} className=" rounded-lg overflow-hidden   ">
                    <div className="text-sm flex justify-between p-2 bg-gray-200 ">

                        <h1 className="">
                            {absence.date}
                        </h1>
                        <span className="px-6 ">
                            {translations.justified}
                        </span>
                    </div>
                    <div className="space-y-1 border-x border-b rounded-b-lg divide-y">

                        {absence.data.map(e => (
                            <StudentAbsence
                                key={e.id}
                                {...e}
                            />
                        ))}
                    </div>
                </div>

            ))}
        </form>
    </>
    )
}
function StudentAbsence(data: Presence) {
    const translations=useTranslation()
    return <div className="flex p-1 text-sm items-center gap-2">
        <div className="font-light bg-gray-100 h-4 aspect-square overflow-hidden  rounded-full" >
            <img className=" object-cover h-full w-full " src={config.remoteImageUrl(data.Student.Image)} alt="" />
        </div>
        <span className=" flex-1 font-light">
            {data.Student.firstName} {data.Student.lastName}
        </span>
        <div className="font-light text-xs">
            <span className="bg-gray-100  p-1 rounded-lg">{data.subjectLabel}</span>    {new Date(data.startTime).toLocaleTimeString("fr", {
                hour: "numeric",
                hourCycle: "h24",
                minute: "numeric"
            })} - {new Date(data.endTime).toLocaleTimeString("fr", {
                hour: "numeric",
                hourCycle: "h24",
                minute: "numeric"
            })}
        </div>
        <div className="flex text-xs border overflow-hidden rounded-full cursor-pointer ">
            <label className="flex px-2 py-1 cursor-pointer hover:bg-gray-100 items-center gap-2">
                <input type="radio" name={`justified:${data.id}`} value={"true"} />
                {translations.yes}
            </label>
            <label className="flex px-2 py-1 cursor-pointer hover:bg-gray-100 items-center gap-2">
                <input type="radio" name={`justified:${data.id}`} value={"false"} />
                {translations.no}
            </label>

        </div>
    </div>

}