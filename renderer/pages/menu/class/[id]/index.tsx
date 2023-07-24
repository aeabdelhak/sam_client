import { useEffect, useState } from "react";
import fetchApi, { config } from "../../../../utils/fetch";
import Button from "../../../../components/Ui/button/Button";
import type { Class, StudentsEntity } from "../../../../types/class";
import { useRouter } from "next/router";
import { LoaderIcon, toast } from "react-hot-toast";
import Title from "../../../../components/Title";
import Student from "../../../../components/class/Student";
import { useAppContext } from "../../../../components/Context/AppContext";

export default function Class() {
    const [data, setdata] = useState<Class>()
    const [loading, setLoading] = useState(true)
    const { attendance: { appendRequest, dismissionRequests } }=useAppContext()
    const router = useRouter();
    const dissRequests = dismissionRequests.get(router.query.id as string)
    if (dissRequests?.size && dissRequests?.size > 0) {
        ( import("../../../../utils/ring")).then((d)=>(d.default.play()))
    } else {
        ( import("../../../../utils/ring")).then((d)=>(d.default.stop()))

    }
    useEffect(() => {
        let socket: WebSocket
        if (router.isReady) {
            socket = new WebSocket(config.remoteAddress.replace("http", "ws"),[]);

            socket.addEventListener("open", () => {
                socket.send(JSON.stringify({classId:router.query.id}));

            })
            socket.addEventListener('message', (event) => {
                const data = JSON.parse(event.data)
                if (data.classId == router.query.id) {
                    appendRequest(data.classId,data.studentId)
                }
            });



            (async () => {
                setLoading(true);
                setdata(await fetchApi('/get/class/' + router.query.id))
                setLoading(false);
            }

            )()
        }

        return () => {
            socket?.removeEventListener("open", () => {
                toast.success("Connected to the server");
            })
            socket?.removeEventListener('message', (event) => {
                console.log((event.data))
            });
            ( import("../../../../utils/ring")).then((d)=>(d.default.stop()))

        }
    }, [router.isReady])




    if (loading) return <div className="w-screen h-screen flex">
        <div className="m-auto scale-150">
            <LoaderIcon />
        </div>
    </div>

    return (
        <div className="flex  flex-col p-4">
            <Title
                title={router.query.label as string ?? ''}
            />
            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                    {router.query.label}
                </h1>
                <p className="text-xs">
                    keep this screen open to get updated about attendance
                </p>
            </div>
            <div className="py-4 flex  gap-4">
                {data.students?.map(student => (
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

