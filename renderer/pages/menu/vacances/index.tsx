import { useRouter } from "next/router"
import { FormEventHandler, useEffect, useState } from "react"
import { Vacancy, useAppContext } from "../../../components/Context/AppContext"
import Title from "../../../components/Title"
import { LoaderIcon } from "react-hot-toast"
import { Delete, Plus } from "react-iconly"
import { randomUUID } from "crypto"
import Button from "../../../components/Ui/button/Button"
import { useTranslation } from "../../../utils/translations/Context"

export default function ScheduleContent() {
    const [upserting, start] = useState(false)
    const router = useRouter()
    const [render, rerender] = useState(0)
    const {
        vacances: {
            getVacances,
            loading,
            data,
            upsertVacances
        }

    } = useAppContext()
    if (!loading && !data) getVacances();

   

    const save: FormEventHandler<HTMLFormElement> = async ev => {
        ev.preventDefault()
        const formdata = new FormData(ev.currentTarget)
        const startTimes = formdata.getAll("startTime[]")
        const endTimes = formdata.getAll("endTime[]")
        const labels = formdata.getAll("label[]")
        const ids = formdata.getAll("id")

        const data = startTimes.map((v, i) => ({
            id: ids.at(i).toString() == "" ? undefined : ids.at(i).toString(),
            startDate: new Date(v.toString()),
            endDate: new Date(endTimes.at(i).toString()),
            label: labels.at(i).toString(),
        }))
        
        const res = await upsertVacances(data);
        res && rerender(e => e + 1)
        start(false)

    }

const translations=useTranslation()
    return (

        <form
            key={render}
            onSubmit={save}
        >

            <Title
                title={translations.vacances}
            />
            {upserting
                &&
                <div className="fixed inset-0 flex justify-center items-center bg-white/20">
                    <div className="scale-[4]">
                        <LoaderIcon className="" />
                    </div>
                </div>

            }

            <div className="space-y-4 ">
                {loading && !data ?
                    <PlaceHolder
                            
                    />
                    

                    :
                    <Vacancies
                        saved={data}
              
                    />}
                    
            </div>
            <SaveBtn />
        </form>
    )
}
function SaveBtn() {
    const translations=useTranslation()
    const [enabled, setenabled] = useState(false)
    useEffect(() => {
        document.addEventListener("touched", () => setenabled(true))

        return () => {
            document.removeEventListener("touched", () => setenabled(true))
        }
    }, [])

    return <div className="flex  py-2 justify-end">
        <Button
            disabled={!enabled}
            type="submit"
            className="text-xs">
            {translations.save}
        </Button>
    </div>
}

function Vacancies({ saved }: {
    saved: Vacancy[],
}) {
    const [savedVacancies, setsavedVacancies] = useState(saved)
    const [schedule, setschedule] = useState<Set<string>>(new Set())
const translations=useTranslation()
    function newSc() {
        setschedule(e => {
            const d = new Set(e)
            d.add(randomUUID())
            return d
        })
    }

    function formatDate(thedate:any) {
        const date = new Date(thedate)
        return date.getFullYear().toString().concat(
            "-",
            (date.getMonth() + 1).toString().padStart(2, "0"),
            "-",
            date.getDate().toString().padStart(2, "0"),
        )
    }

    return <div
        className="">
        <div className="flex justify-between">
            <button
                type="button"
                onClick={newSc}
                className="text-blue-700 flex items-center text-xs gap-2 p-1 rounded hover:bg-blue-100">
                <Plus size={"small"} />
                {translations.newVacancy}
            </button>
        </div>
        <div className="shadow-xl divide-y p-2 rounded-lg">
            {savedVacancies?.map(e => (
                (
                    <div
                        key={e.id}
                        className=" text-sm p-2  grid grid-cols-4  ">
                        <input type="hidden" name="id" value={e.id} />
                        <label className=" flex gap-2 items-center">
                            <b className="text-xs text-gray-500 font-medium ">{translations.startsAt}</b>
                            <input
                                onChange={() => document.dispatchEvent(new Event("touched"))}
                                defaultValue={formatDate(e.startDate)} required className="bg-transparent px-4 py-1 border rounded-md" type="date" name="startTime[]" id="" />
                        </label>
                        <label className=" flex gap-2 items-center">
                            <b className="text-xs text-gray-500 font-medium ">
                                {translations.endsAt}
                            </b>
                            <input
                                onChange={() => document.dispatchEvent(new Event("touched"))}

                                defaultValue={formatDate(e.endDate)} required className="bg-transparent px-4 py-1 border rounded-md" type="date" name="endTime[]" id="" />
                        </label>
                        <label className=" flex gap-2 items-center">
                            <b className="text-xs text-gray-500 font-medium ">
                            {translations.name}
                            </b>
                            <input
                                onChange={() => document.dispatchEvent(new Event("touched"))}

                                defaultValue={e.label} required className="bg-transparent px-4 py-1 border rounded-md" type="text" name="label[]" id="" />
                        </label>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    document.dispatchEvent(new Event("touched"))
                                    setsavedVacancies(sc => sc.filter(sc => sc.id != e.id))
                                }}
                                className="text-red-700 p-1 rounded hover:bg-red-100">
                                <Delete size={"small"} />
                            </button>
                        </div>
                    </div>
                )
            ))}
            {Array.from(schedule).map(e => (
                <div
                    key={e}
                    className=" text-sm p-2  grid grid-cols-4  ">
                    <input type="hidden" name="id" value={""} />
                    <label className=" flex gap-2 items-center">

                        <b className="text-xs text-gray-500 font-medium ">
                        {translations.startsAt}
                        </b>
                        <input
                            onChange={() => document.dispatchEvent(new Event("touched"))}
                            required className="bg-transparent px-4 py-1 border rounded-md" type="date" name="startTime[]" id="" />
                    </label>
                    <label className=" flex gap-2 items-center">
                        <b className="text-xs text-gray-500 font-medium ">
                        {translations.endsAt}
                        </b>
                        <input
                            onChange={() => document.dispatchEvent(new Event("touched"))}

                            required className="bg-transparent px-4 py-1 border rounded-md" type="date" name="endTime[]" id="" />
                    </label>
                    <label className=" flex gap-2 items-center">
                        <b className="text-xs text-gray-500 font-medium ">
                        {translations.name}
                        </b>
                        <input required className="bg-transparent px-4 py-1 border rounded-md" type="text" name="label[]" id="" />
                    </label>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                document.dispatchEvent(new Event("touched"))

                                setschedule(a => {
                                    const d = new Set(a)
                                    d.delete(e)
                                    return d
                                })
                            }}
                            className="text-red-700 p-1 rounded hover:bg-red-100">
                            <Delete size={"small"} />
                        </button>
                    </div>
                </div>
            ))}
        </div>

    </div>
}
function PlaceHolder() {



    return <div
        className="">
        <div className="shadow-xl divide-y p-2 rounded-lg">
            {(Array.from(Array(8).keys()))?.map(e => (
                (
                    <div
                        key={e}
                        style={{
                            animationDelay: e * 0.2 + "s"
                        }}
                        className=" text-sm my-1 transition-all p-4 bg-blue-100 animate-pulse  ">

                    </div>
                )
            ))}

        </div>

    </div>
}