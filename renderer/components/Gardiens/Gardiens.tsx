import { Dispatch, SetStateAction, useState } from "react";
import { People, User } from "react-iconly";
import Modal from "../Ui/Modal";
import {  gardien } from "../Context/AppContext";
import NewGardien from "./NewGardien";
import NewStudent from "./NewStudent";
import { config } from "../../utils/fetch";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Ui/button/Button";
import EditAStudent from "./EditAStudent";



export default function Gardiens({ data }: { data: gardien[] }) {
    const [selectedStudent, setselectedStudent] = useState<string>()
    const student = data?.flatMap(e => e?.students).find(e => e.id == selectedStudent);
    const [openGardien, setopenGardien] = useState(false)
    return (
        <div className="">
            <Modal w="max-w-xl" rounded="rounded-3xl" shown={openGardien} handler={setopenGardien}>
                <NewGardien />
            </Modal>

            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                    Gardiens and students
                </h1>
                <p className="text-xs">
                    manage both gardiens and students
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-lg bg-slate-50 p-6">
                    <div className="flex justify-between pb-6">
                        <h1 className="font-semibold text-xl">
                            Gardiens
                        </h1>
                        <div className="">
                            <button
                                onClick={() => setopenGardien(true)}
                                className="bg-blue-700 tracking-wide text-sm text-white px-4 py-2 rounded-lg">
                                Create a gardien
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1">


                        {data?.map((e, index) => (
                            <Gardien
                                setselectedStudent={setselectedStudent}
                                selectedStudent={selectedStudent}
                                gardien={e}
                                key={e.id}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
                <div className=" ">
                    {!student ? <div className="flex sticky top-20 select-none py-16 text-gray-500 flex-col items-center">
                        <People
                            size={"large"} />
                        <p>
                            select a student
                        </p>
                    </div> : <AnimatePresence presenceAffectsLayout
                    mode="wait">
                        <EditAStudent
                            key={student?.id}
                            student={student}
                        />
                    </AnimatePresence>
                    }
                </div>
            </div>
        </div>

    )
}

function Gardien({ index, gardien, setselectedStudent, selectedStudent }: { setselectedStudent: Dispatch<SetStateAction<string>>, selectedStudent: string, index: number, gardien: gardien }) {
    const [openStudent, setopenStudent] = useState(false)

    return (
        <motion.div
            exit={{ opacity: 0 }}
            animate={{
                opacity: 1, transition: {
                    delay: index * .2
                }
            }}
            initial={{ opacity: 0 }}
            className="border bg-white">
            <Modal w="max-w-xl" rounded="rounded-3xl" shown={openStudent} handler={setopenStudent}>
                <NewStudent
                    gardienId={gardien?.id}
                />
            </Modal>
            <div
                key={gardien.id}
                className="flex w-full group transition-all disabled:bg-blue-700  items-center disabled:text-white space-x-2 p-4 bg-white rounded-md ">
                <div className="bg-blue-800 flex  text-white rounded-full w-8 h-8  justify-center items-center">
                    <User size={"small"} />
                </div>
                <div className="flex flex-1 items-start space-y-1 flex-col">
                    <p className="text-sm ">
                        {gardien.name}
                    </p>
                    <p
                        className="text-xs font-extralight group-disabled:text-white/60 text-gray-500 ">
                        {gardien.phoneNumber}
                    </p>
                </div>
                <div className="">

                    <Button
                        onClick={() => setopenStudent(true)}
                        className="font-light !text-blue-700 border-blue-700 border-2 bg-transparent"
                    >
                        add a student
                    </Button>
                </div>
            </div>
            <div className="text-xs text-end px-4 p-1">
                {gardien.students.length} students
            </div>
            <div className="px-10">
                <hr />
            </div>
            <div
                className="pt-4 px-2"
            >

                <>
                    {gardien.students?.map((student, index) =>
                        <motion.button
                            disabled={student.id == selectedStudent}
                            onClick={e => setselectedStudent(student.id)}
                            exit={{ y: -20, opacity: 0 }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: 0, opacity: 1,
                                transition: {
                                    delay: 0.2 * index
                                }
                            }}
                            key={student.id}
                            className="flex w-full rounded group hover:bg-gray-50 transition-all duration-500 disabled:bg-blue-700  disabled:text-white space-x-2 p-4 bg-white ">
                            <div className=" bg-gray-100 flex w-12 h-12  overflow-hidden shrink-0  text-white rounded-full   justify-center items-center">
                                <img className="  object-cover h-full w-full" src={config.remoteAddress.concat("/", student.image.url)} alt="" />
                            </div>
                            <div className="flex flex-1 items-start space-y-1 flex-col">
                                <p className="text-sm ">
                                    {student.firstName.concat(" ", student.lastName)}
                                </p>
                                <p
                                    className="text-xs font-extralight group-disabled:text-white/60 text-gray-500 ">
                                    {student.class.label}
                                </p>
                            </div>
                        </motion.button>)}
                </>
            </div>
        </motion.div>
    )
}