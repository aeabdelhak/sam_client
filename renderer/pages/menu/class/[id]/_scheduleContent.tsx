
import { useRouter } from "next/router"
import Title from "../../../../components/Title"
import { Delete, Plus } from "react-iconly"
import { FormEventHandler, useEffect, useState, useTransition } from "react"
import { randomUUID } from "crypto"
import { useAppContext } from "../../../../components/Context/AppContext"
import Button from "../../../../components/Ui/button/Button"
import { LoaderIcon } from "react-hot-toast"
import { translation, useTranslation } from "../../../../utils/translations/Context"
import Input from "../../../../components/Ui/Input/Input"

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

export default function ScheduleContent() {
    const router = useRouter()
    const [fetching, setfetching] = useState(true)
    const [loading, start] = useState(false)
    const [render, rerender] = useState(0)
    const translations = useTranslation()

    const {
        scheduls: {
            getSchedule,
            data,
            upsertschedule
        }

    } = useAppContext()

    useEffect(() => {
        if (router.isReady) {

            getSchedule(router.query.id as string ?? "").then(e => {
                rerender(render + 1)
                setfetching(false)
            }).catch(e => {
                setfetching(false)
            });
        }

        return () => {

        }
    }, [router.isReady])
    const schedule = data.get(router.query.id as string)

    const save: FormEventHandler<HTMLFormElement> = async ev => {
        ev.preventDefault()
        const formdata = new FormData(ev.currentTarget)
        const startTimes = formdata.getAll("startTime[]")
        const endTimes = formdata.getAll("endTime[]")
        const subjectLabel = formdata.getAll("subjectLabel[]")
        const ids = formdata.getAll("id")
        const weekDays = formdata.getAll("weekDay")

        const data = startTimes.map((v, i) => ({
            id: ids.at(i).toString() == "" ? undefined : ids.at(i).toString(),
            startTime: v.toString(),
            weekDay: Number(weekDays.at(i).toString()),
            endTime: endTimes.at(i).toString(),
            subjectLabel: subjectLabel.at(i).toString(),
        }))
        start(true)
        const res = await upsertschedule({
            classId: router.query.id as string,
            schedules: data
        });
        res && rerender(e => e + 1)
        start(false)

    }
    return (

        <form
            key={render}
            onSubmit={save}
        >

            <Title
                title={(router.query.label as string ?? '').concat("-", translations.schedule)}
            />
            {loading
                &&
                <div className="fixed inset-0 flex justify-center items-center bg-white/20">
                    <div className="scale-[4]">
                        <LoaderIcon className="" />
                    </div>
                </div>

            }

            <div className=" flex flex-col   ">
                {fetching && !schedule?.data ?
                    weekdays.map((e) => (
                        <WeekDayPlaceHolder
                            key={e}
                            label={e}
                        />
                    ))

                    : weekdays.map((e, index) => (
                        <WeekDay
                            savedSchedule={(schedule?.data as any[])?.filter(e => e?.weekDay == index)}
                            n={index}
                            key={e}
                            label={e}
                        />
                    ))}
            </div>
            <SaveBtn />
        </form>
    )
}
function SaveBtn() {
    const [enabled, setenabled] = useState(false)
    const translations = useTranslation()
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

function WeekDay({ label, savedSchedule, n }: {
    savedSchedule: {
        id: string;
        weekDay: number;
        classId: string;
        subjectLabel: string;
        startTime: string;
        endTime: string;
    }[],
    label: string, n: number
}) {
    const [savedschedules, setsavedschedules] = useState(savedSchedule)
    const [schedule, setschedule] = useState<Set<string>>(new Set())
    const translations = useTranslation()

    function newSc() {
        setschedule(e => {
            const d = new Set(e)
            d.add(randomUUID())
            return d
        })
    }



    return <div
        className="  rounded p-4">
        <div className="flex py-2 justify-between">
            <b className="text-blue-800">
                {translations[label]}
            </b>
            <button
                type="button"
                onClick={newSc}
                className="text-blue-700 p-1 rounded hover:bg-blue-100">
                <Plus size={"small"} />
            </button>
        </div>


        <div className={" divide-y px-2 rounded-lg ".concat((savedschedules.length > 0 || Array.from(schedule).length > 0) ? "shadow-lg" : "")}>
            {savedschedules?.map(e => (
                (
                    <div
                        key={e.id}
                        className=" text-sm p-2  grid grid-cols-4  ">
                        <input type="hidden" name="weekDay" value={n} />
                        <input type="hidden" name="id" value={e.id} />
                        <label className=" flex gap-2 items-center">
                            <b className="text-xs text-gray-500 font-medium ">
                                {translations.startsAt}
                            </b>
                            <Input
                                bodered

                                onChange={() => document.dispatchEvent(new Event("touched"))}
                                defaultValue={e.startTime} required className=" " type="time" name="startTime[]" id="" />
                        </label>
                        <label className=" flex gap-2 items-center">
                            <b className="text-xs text-gray-500 font-medium ">
                                {translations.endsAt}
                            </b>
                            <Input
                                bodered

                                onChange={() => document.dispatchEvent(new Event("touched"))}

                                defaultValue={e.endTime} required className="bg-transparent px-4 py-1 border rounded-md outline-none " type="time" name="endTime[]" id="" />
                        </label>
                        <label className=" flex gap-2 items-center">
                            <b className="text-xs text-gray-500 font-medium ">
                                {translations.subject}

                            </b>
                            <Input
                                bodered
                                onChange={() => document.dispatchEvent(new Event("touched"))}
                                placeholder={e.subjectLabel}
                                defaultValue={e.subjectLabel} required className="bg-transparent px-4 py-1 border rounded-md outline-none " type="text" name="subjectLabel[]" id="" />
                        </label>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    document.dispatchEvent(new Event("touched"))
                                    setsavedschedules(sc => sc.filter(sc => sc.id != e.id))
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
                    <input type="hidden" name="weekDay" value={n} />
                    <label className=" flex gap-2 items-center">

                        <b className="text-xs text-gray-500 font-medium ">
                            {translations.startsAt}

                        </b>
                        <Input
                            bodered

                            onChange={() => document.dispatchEvent(new Event("touched"))}

                            required className="bg-transparent px-4 py-1 border rounded-md outline-none " type="time" name="startTime[]" id="" />
                    </label>
                    <label className=" flex gap-2 items-center">
                        <b className="text-xs text-gray-500 font-medium ">
                            {translations.endsAt}

                        </b>
                        <Input
                            bodered

                            onChange={() => document.dispatchEvent(new Event("touched"))}

                            required className="bg-transparent px-4 py-1 border rounded-md outline-none " type="time" name="endTime[]" id="" />
                    </label>
                    <label className=" flex gap-2 items-center">
                        <b className="text-xs text-gray-500 font-medium ">
                            {translations.subject}

                        </b>
                        <Input
                            placeholder={translations.subject}
                            bodered
                            required className="bg-transparent px-4 py-1 border rounded-md outline-none " type="text" name="subjectLabel[]" id="" />
                    </label>
                    <div className="flex justify-end">
                        <button
                            type="submit"
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
function WeekDayPlaceHolder({ label }: {
    label: string,
}) {

    const translations = useTranslation()


    return <div
        className="">
        <div className="flex justify-between">
            <b className="text-blue-800">
                {translations[label]}
            </b>
        </div>
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