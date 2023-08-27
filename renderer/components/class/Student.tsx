import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "../Ui/Modal";
import Button from "../Ui/button/Button";
import { config } from "../../utils/fetch";
import { StudentsEntity, useAppContext } from "../Context/AppContext";
import { CloseSquare } from "react-iconly";
import ModalCloser from "../Ui/ModalCloser";
import { useTranslation } from "../../utils/translations/Context";

export default function Student({ student, requested }: { requested: boolean, student: StudentsEntity }) {
    const [open, setopen] = useState(false);
    const lastAttended = [...student.Attendances].pop()
    const [attended, setattended] = useState(student.Attendances.find(e => e.access_date != null && e.dismission_date == null))
    const translations = useTranslation()

    const router = useRouter();
    const { attendance: {
        dismiss, rejectRequest
    } } = useAppContext()
    useEffect(() => {
        const attended = student.Attendances.find(e => e.access_date != null && e.dismission_date == null)
        setattended(attended)
        return () => {

        }
    }, [student.Attendances])



    return (<>
        <Modal
            shown={open}
            handler={setopen}
            w="max-w-xl"
        >
            <div className={" z-0 p-10 bg-gradient-to-br bg-white flex flex-col  rounded-lg gap-4 "}>
                <div className="flex justify-between">
                    <h1 className="font-semibold text-xl">
                        {translations.dismissStudent}
                    </h1>
                    <ModalCloser />
                </div>
                <div className="flex items-center gap-2">

                    <div className="   flex aspect-square w-28 h-w-28  overflow-hidden shrink-0  text-white rounded-full   justify-center items-center">
                        <img className="object-cover h-full w-full" src={config.remoteImageUrl(student.Image)} alt="" />
                    </div>
                    <div className=" flex  text-blue-900 space-y-1 flex-col">
                        <p className="font-bold text-lg ">
                            {student.firstName.concat(" ", student.lastName)}
                        </p>
                        <p
                            className=" font-extralight  text-blue-900/80 ">
                            {router.query.label}
                        </p>
                        <p
                            className=" font-extralight text-xs  text-blue-900/80 ">
                            {new Date(attended?.access_date).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button
                        className="bg-gray-100 !text-gray-700 "
                        onClick={e => {
                            rejectRequest(student.classId, student.id)
                            setopen(false)
                        }}>
                        {translations.ignore}
                    </Button>
                    <Button
                        onClick={() => dismiss(student.classId, student.id).then(r => {
                            if (r) setopen(false);
                        })}
                    >
                        {translations.dismiss}
                    </Button>
                </div>
            </div>
        </Modal>
        <button
            disabled={!requested && !(lastAttended?.dismission_requested && !lastAttended?.dismission_date)}
            onClick={async e => {
                (await import("../../utils/ring")).default.play()
                setopen(true)
            }} className={"flex w-32 flex-col items-center   gap-2 p-2 ".concat(requested ? "animate-pulse bg-red-200" : lastAttended?.dismission_requested && !lastAttended?.dismission_date ? " bg-red-100" : attended ? " bg-green-100" : " grayscale bg-gray-100 ")}>
            <div className=" rounded overflow-hidden  h-20 w-20">
                <img className=" object-cover h-full w-full " src={config.remoteImageUrl(student.Image)} alt="" />
            </div>
            <div className="flex  flex-col text-xs items-center">
                <b>
                    {student.firstName.concat(' ', student.lastName)}
                </b>

            </div>
        </button>
    </>
    )
}