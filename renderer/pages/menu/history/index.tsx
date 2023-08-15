import { FormEventHandler, useEffect, useState, useTransition } from "react";
import { PresenceHistory, useAppContext } from "../../../components/Context/AppContext";
import Title from "../../../components/Title";
import Input from "../../../components/Ui/Input/Input";
import Button from "../../../components/Ui/button/Button";
import { Search } from "react-iconly";
import { LoaderIcon } from "react-hot-toast";
import { config } from "../../../utils/fetch";
const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]

export default function Index() {
    const [selectedClass, setSelectedClass] = useState<string>()
    const [isgetting, start] = useState(false)
    const [history, sethistory] = useState<PresenceHistory>()
    const {
        students: {

        },
        classes: {

            data, getData, getPresenceHistory
        }
    } = useAppContext()
    if (!data) {
        getData()
    }
    const students = data?.find(e => e.id == selectedClass)?.Students ?? []
    function formatDate() {
        const date = new Date()
        return date.getFullYear().toString().concat(
            "-",
            (date.getMonth() + 1).toString().padStart(2, "0"),
            "-",
            date.getDate().toString().padStart(2, "0"),
        )
    }
    useEffect(() => {
        if (!selectedClass && data) {
            setSelectedClass(data?.[0]?.id)
        }
    }, [data])

    const get: FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault()
        const formData = new FormData(ev.currentTarget)
        const studentId = formData.get("studentId") as string
        const from = new Date(formData.get("from") as string)
        const to = new Date(formData.get("to") as string)
        start(true)
        const data = await getPresenceHistory(studentId, from, to)
        sethistory(data)
        start(false)

    }
    return (
        <div>
            <Title
                title="history"
            />
            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                    Presence History
                </h1>
                <p className="text-xs">
                    manage students attendance history
                </p>
            </div>

            <form
                onSubmit={get}
                className="flex gap-2">
                <div className="px-2 bg-slate-100  grow flex">
                    <select
                        disabled={isgetting}
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value ?? undefined)}
                        className="  text-sm  py-1  w-full bg-transparent " name="classId" id="">
                        {
                            data?.map(e => (
                                <option value={e.id} key={e.id} className="">
                                    {
                                        e.label
                                    }
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="px-2 bg-slate-100  grow flex">
                    <select
                        disabled={isgetting}
                        className="  text-sm  py-1  w-full bg-transparent " name="studentId" id="">
                        {
                            students?.map(e => (
                                <option value={e.id} key={e.id} className="">
                                    {
                                        e.firstName + " " + e.lastName
                                    }
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="   grow" >
                    <Input
                        disabled={isgetting}
                        name="from"
                        defaultValue={formatDate()}
                        type="date"
                        placeholder="start time"
                    />
                </div>
                <div className="   grow" >
                    <Input
                        disabled={isgetting}
                        name="to"
                        defaultValue={formatDate()}
                        type="date"
                        placeholder="end time"
                    />
                </div>
                <div className="flex justify-center items-center">
                    <Button
                        disabled={isgetting || students.length === 0}
                        className="!bg-blue-200 !text-blue-700 hover:!bg-blue-300 "
                        type="submit"
                    >

                        {isgetting ?

                            <LoaderIcon />
                            : <Search
                                size={"small"}
                            />}
                    </Button>
                </div>
            </form>



            <hr className="my-4" />
           {isgetting && <div className="">
                <div className=" z-0 p-1 bg-gradient-to-br  flex items-center rounded-lg gap-4">
                    <div
                    
                        className="   flex aspect-square bg-slate-200 animate-pulse w-28 h-w-28  overflow-hidden shrink-0  text-white rounded   justify-center items-center">
                    </div>
                    <div className="flex flex-1 items-start grow text-blue-900 space-y-1 flex-col">
                        <span
                          style={{
                            animationDelay:.2+"s"
                        }}
                            className="p-3 rounded-lg w-full max-w-xs bg-slate-200 " />
                        <span
                          style={{
                            animationDelay:.4+"s"
                        }}
                            className="p-2 rounded-lg px-10 bg-slate-200 " />

                    </div>
                </div>
                {Array.from(Array(1).keys()).map((i) => (
                    <div
                        style={{
                        animationDelay:i*.3+"s"
                    }}
                        key={i} className="p-4 my-2 animate-pulse bg-slate-100 rounded-lg h-52 ">

                    </div>
                ))}
            </div>}
            {!isgetting && history?.student?.Image &&
                <div className="flex">
                    <div className=" z-0 p-1 bg-gradient-to-br bg-white flex items-center rounded-lg gap-4">
                        <div className="   flex aspect-square w-28 h-w-28  overflow-hidden shrink-0  text-white rounded   justify-center items-center">
                            <img className="object-cover h-full w-full" src={config.remoteAddress.concat("/", history.student.Image.url)} alt="" />
                        </div>
                        <div className="flex flex-1 items-start text-blue-900 space-y-1 flex-col">
                            <p className="font-bold text-lg ">
                                {history.student.firstName.concat(" ", history.student.lastName)}
                            </p>
                            <p
                                className=" font-extralight  text-blue-900/80 ">
                                {history.student.Class.label}
                            </p>
                        </div>
                    </div>
                </div>
            }

            {
              !isgetting &&  history?.presence?.map(e => (
                    <div key={e.date?.toString()} className="p-4 my-1 bg-slate-100 rounded-lg ">
                        <h1 className="font-bold uppercase text-blue-800">
                            {weekdays[new Date(e.date).getDay()]} {new Date(e.date).toLocaleDateString('fr')}
                        </h1>
                       {e.data.length > 0 ? <div className="bg-white p-2 rounded-lg mt-2">

                            {e.data.map(e => (
                                <div
                                    key={e.id}
                                    className="grid bg-slate -50 text-sm items-center hover:bg-gray-100  p-1  font-extralight grid-cols-4">
                                    <div className="">
                                        {e.subjectLabel}
                                    </div>
                                    <div className="text-center">
                                        {new Date(e.startTime).toLocaleTimeString("fr", {
                                            hour: "numeric",
                                            hourCycle: "h24",
                                            minute: "numeric"
                                        })}
                                    </div>
                                    <div className="text-center">
                                        {new Date(e.endTime).toLocaleTimeString("fr", {
                                            hour: "numeric",
                                            hourCycle: "h24",
                                            minute: "numeric"
                                        })}
                                    </div>
                                    <div className="font-bold justify-end text-xs flex">
                                        {e.attended ?
                                            <div className="bg-blue-100 px-2 py-2 rounded-2xl  text-blue-500 ">
                                                attended
                                            </div> :
                                            <div className="bg-red-100 px-2 py-2 rounded-2xl  text-red-500">
                                                not attended
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                      </div> : 
                          <p className="text-xs text-gray-700">
                              no data 
                        </p>
                        }

                    </div>
                ))
            }
        </div>
    )
}