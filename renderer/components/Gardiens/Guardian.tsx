import { Dispatch, SetStateAction, useState } from "react";
import { People, Search, User } from "react-iconly";
import Modal from "../Ui/Modal";
import {  guardian } from "../Context/AppContext";
import NewGuardian from "./NewGuardian";
import { config } from "../../utils/fetch";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Ui/button/Button";
import EditAStudent from "./EditAStudent";
import GuardianMenu from "./GuardianMenu";
import Input from "../Ui/Input/Input";



export default function Guardians({ data }: { data: guardian[] }) {
    const [query, setquery] = useState("")
    const [selectedStudent, setselectedStudent] = useState<string>()
    const student = data?.flatMap(e => e?.Students).find(e => e.id == selectedStudent);
    const [openguardian, setopenguardian] = useState(false)
    const filtered = data?.filter(e => e.name.toLowerCase().includes(query?.toLowerCase()) || e.phoneNumber.includes(query?.toLowerCase()) || e.Students.filter(e => e.firstName.toLowerCase().includes(query?.toLowerCase()) || e.lastName.toLowerCase().includes(query?.toLowerCase())).length>0).map(e => ({...e,Students:e.Students.filter(e => e.firstName.toLowerCase().includes(query?.toLowerCase()) || e.lastName.toLowerCase().includes(query?.toLowerCase()))}));
    
    return (
        <div className="">
            <Modal w="max-w-xl" rounded="rounded-3xl" shown={openguardian} handler={setopenguardian}>
                <NewGuardian />
            </Modal>

            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                    guardians and students
                </h1>
                <p className="text-xs">
                    manage both guardians and students
                </p>
            </div>
            <div className=" max-w-sm pb-4">
                <Input
                    value={query}
                onChange={e=>setquery(e.target.value ?? "")}
                placeholder="search"
                icon={<Search
                    size={"small"}
                />}
            />
        </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 rounded-lg bg-slate-50 p-6">
                    <div className="flex justify-between pb-6">
                        <h1 className="font-semibold text-xl">
                            guardians
                        </h1>
                        <div className="">
                            <Button
                                onClick={() => setopenguardian(true)}>
                                Create a guardian
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-1">


                        {filtered?.map((e, index) => (
                            <Guardian
                                setselectedStudent={setselectedStudent}
                                selectedStudent={selectedStudent}
                                guardian={e}
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

function Guardian({ index, guardian, setselectedStudent, selectedStudent }: { setselectedStudent: Dispatch<SetStateAction<string>>, selectedStudent: string, index: number, guardian: guardian }) {

    return (
        <motion.div
            exit={{ opacity: 0 }}
            animate={{
                opacity: 1, transition: {
                    delay: index * .2
                }
            }}
            initial={{ opacity: 0 }}
            className="border relative  bg-white">
         
            <div
                key={guardian.id}
                className="flex w-full group transition-all disabled:bg-blue-700  items-center disabled:text-white space-x-2 p-4 bg-white rounded-md ">
                <div className="bg-blue-800 flex text-xs  text-white rounded-full w-8 h-8  justify-center items-center">
                {guardian.name.split(" ").map(a=>a.at(0)).join("")}
                    
                </div>
                <div className="flex flex-1 items-start space-y-1 flex-col">
                    <p className="text-sm ">
                        {guardian.name}
                    </p>
                    <p
                        className="text-xs font-extralight group-disabled:text-white/60 text-gray-500 ">
                        {guardian.phoneNumber}
                    </p>
                </div>
                <div className=" ">
                    <GuardianMenu
                    {...guardian}
                    />
                   
                </div>
            </div>
            <div className="text-xs text-end px-4 p-1">
                {guardian.Students.length} students
            </div>
            <div className="px-10">
                <hr />
            </div>
            <div
                className="pt-4 px-2"
            >

                <>
                    {guardian.Students?.map((student, index) =>
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
                                <img className="  object-cover h-full w-full" src={config.remoteImageUrl(student.Image)} alt="" />
                            </div>
                            <div className="flex flex-1 items-start space-y-1 flex-col">
                                <p className="text-sm ">
                                    {student.firstName.concat(" ", student.lastName)}
                                </p>
                                <p
                                    className="text-xs font-extralight group-disabled:text-white/60 text-gray-500 ">
                                    {student.Class.label}
                                </p>
                            </div>
                        </motion.button>)}
                </>
            </div>
        </motion.div>
    )
}