import { useEffect, useRef, useState } from "react";
import fetchApi, { config } from "../../../../utils/fetch";
import Button from "../../../../components/Ui/button/Button";
import type { Class, StudentsEntity } from "../../../../types/class";
import { useRouter } from "next/router";
import { LoaderIcon, toast } from "react-hot-toast";
import Title from "../../../../components/Title";
import Student from "../../../../components/class/Student";
import { Schedule, useAppContext } from "../../../../components/Context/AppContext";
import Classes from "..";
import { useTranslation } from "../../../../utils/translations/Context";
export default function RouterReady() {
    const router = useRouter();
    if (!router.isReady) return null;
    return <Class id={ router.query.id as string } label={router.query.label as string} />
}
export  function Class({id,label}:{id:string,label:string}) {
    const socket = useRef<WebSocket>(null)
    const isMounted = useRef(true)
    const [currentSession, setcurrentSession] = useState<Schedule>()
    const [loading, setLoading] = useState(true)
    const translations=useTranslation()
    const {
        classes: {
            getClass,
            classes
        },
        scheduls: {
            data: schedules,
            getSchedule
        },
        attendance: { appendRequest, dismissionRequests,dismissClass } } = useAppContext()
    const theClass = classes?.get(id as string)

    const dissRequests = dismissionRequests.get(id as string)
    if (dissRequests?.size && dissRequests?.size > 0) {
        (import("../../../../utils/ring")).then((d) => (d.default.play()))
    } else {
        (import("../../../../utils/ring")).then((d) => (d.default.stop()))

    }

    function connectToWs() {
        socket.current = new WebSocket(config.getremoteAddress().replace("http", "ws"), []);

        socket.current.addEventListener("open", () => {
            socket.current.send(JSON.stringify({ classId: id }));

        })
        socket.current.addEventListener('message', async (event) => {
            await getClass(id as string)
            const data = JSON.parse(event.data)
            if (data.classId == id) {
                data.studentId && appendRequest(data.classId, data.studentId)
            }
        });
        socket.current.addEventListener("close", (ev) => {
            if (isMounted.current) {
                connectToWs()
            }
        })
    }

    useEffect(() => {
        let intervale: NodeJS.Timer
        let getCurrentSessionintervale: NodeJS.Timer
            getCurrentSession()
        getCurrentSessionintervale = setInterval(() => {
             getClass(id as string)
                
                getCurrentSession()
            }, 1000 * 60);

            connectToWs();

            (async () => {

                !classes?.has(id as string) && setLoading(true)
                await getClass(id as string);

                setLoading(false)


            })()



        return () => {
            intervale && clearInterval(intervale)
            isMounted.current = false;
            getCurrentSessionintervale && clearInterval(getCurrentSessionintervale)
            socket.current?.removeEventListener("open", () => {
                toast.success("Connected to the server");
            })
            socket.current?.removeEventListener('message', (event) => {
                console.log((event.data))
            });
            (import("../../../../utils/ring")).then((d) => (d.default.stop()))

        }
    }, [])
    function stringToHoursAndMins(string: string) {
        return string.split(":").map(e => parseInt(e))
    }




    async function getCurrentSession() {
        const todayNumber = new Date().getDay()
        const schedus = await getSchedule(id?.toString());
        const schedule = schedus.get(id?.toString())
        const thiscurrentSession = schedule?.data?.find(e => {
            if (e.weekDay.toString() !== todayNumber.toString())
                return false
            const [startHour, startMin] = stringToHoursAndMins(e.startTime)
            const firstDate = new Date()
            firstDate.setHours(startHour, startMin, 0)

            const [endHour, endMin] = stringToHoursAndMins(e.endTime)
            const endDate = new Date()
            endDate.setHours(endHour, endMin, 0)

            const now = new Date().getTime()

            if (firstDate.getTime() <= now && now < endDate.getTime())
                return true
            return false
        }
        )
        setcurrentSession(thiscurrentSession)
    }


    if (loading) return <div className="w-screen h-screen flex">
        <div className="m-auto scale-150">
            <LoaderIcon />
        </div>
    </div>

    return (
        <div className="flex  flex-col p-4">
            <Title
                title={label as string ?? ''}
            />
            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                    {label}
                </h1>
                <div className="flex justify-between">
                    <p className="text-xs">
                        {translations.classPageDesc}
                    </p>
                    <Button
                        onClick={()=>dismissClass(id)}
                        disabled={theClass?.Students.flatMap(e => e.Attendances).find(e => e.dismission_date == null) ? false : true}
                        className="!text-xs disabled:!bg-sky-200 !bg-sky-500">
                        {translations.dismissAll}
                    </Button>
                </div>
                {currentSession &&
                    <div className=" flex border shadow-xl shadow-blue-400  rounded-full p-1 ">
                        <p className="px-4 py-1 text-xs bg-blue-500 text-white font-bold uppercase  rounded-full">

                            {currentSession?.subjectLabel}
                        </p>
                        <div className="flex-1" />
                        <div className="flex gap-2">
                            <p className="px-4 py-1 text-xs bg-gray-100 text-gray-600 font-bold uppercase  rounded-full">
                                {currentSession?.startTime}
                            </p>
                            <p className="px-4 py-1 text-xs bg-blue-100 text-blue-600 font-bold uppercase  rounded-full">
                                {currentSession?.endTime}
                            </p>
                        </div>
                    </div>}

            </div>
            <div className="py-4 flex   gap-4">
                {theClass?.Students?.map(student => (
                    <Student
                        requested={dissRequests?.has(student.id)}
                        student={student}
                        key={student.id}
                    />
                ))}
            </div>
        </div>
    )
}

