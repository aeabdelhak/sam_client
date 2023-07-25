import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { AddUser, Delete, MoreCircle, User } from 'react-iconly';
import { guardian } from '../Context/AppContext';
import Modal from '../Ui/Modal';
import NewStudent from './NewStudent';
import Updateguardian from './UpdateGuardian';
import DeleteGuardian from './DeleteGuardian';

function GuardianMenu(guardian: guardian) {
    const [deleteGuardian, setdeleteGuardian] = useState(false)
    const [Editguardiant, setEditguardiant] = useState(false)
    const [openStudent, setopenStudent] = useState(false)


    return (<>
        <Modal w="max-w-xl" rounded="rounded-3xl" shown={Editguardiant} handler={setEditguardiant}>
            <Updateguardian
                {...guardian}
            />
        </Modal>
        <Modal w="max-w-xl" rounded="rounded-3xl" shown={deleteGuardian} handler={setdeleteGuardian}>
            <DeleteGuardian
                {...guardian}
            />
        </Modal>
        <Modal w="max-w-xl" rounded="rounded-3xl" shown={openStudent} handler={setopenStudent}>
            <NewStudent
                guardianId={guardian?.id}
            />
        </Modal>
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) =>
                <>


                    <div className='z-0'>
                        <Menu.Button
                            disabled={open}
                            className={"relative  font-light !text-blue-700 active:!bg-blue-200 hover:bg-blue-100 bg-transparent disabled:bg-blue-50 active:scale-95 transition-all bg-blue-700 tracking-wide  px-4 py-2 rounded-lg   text-sm "}>
                            <MoreCircle />
                        </Menu.Button>
                    </div>
                    <Menu.Items className="absolute z-50 right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">

                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setopenStudent(true)}
                                        className={`${active ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                                            } flex items-center gap-2 w-full text-left px-4 py-2 text-sm`}
                                    >
                                        <div className=" p-1 bg-blue-100 rounded-full text-blue-700">

                                            <AddUser size={'small'} />
                                        </div>
                                        Add a Student
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setEditguardiant(true)}
                                        className={`${active ? 'bg-green-100 text-green-700' : 'text-gray-700'
                                            } flex items-center gap-2 w-full text-left px-4 py-2 text-sm`}
                                    >
                                        <div className=" p-1 bg-green-100 rounded-full text-green-700">

                                            <User size={'small'} />
                                        </div>
                                        update informations
                                    </button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => setdeleteGuardian(true)}
                                        className={`${active ? 'bg-red-100 text-red-700' : 'text-gray-700'
                                            } flex items-center gap-2 w-full text-left px-4 py-2 text-sm`}
                                    >
                                        <div className=" p-1 bg-red-100 rounded-full text-red-700">

                                            <Delete size={'small'} />
                                        </div>
                                        Delete
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </>
            }
        </Menu>
    </>
    );
}

export default GuardianMenu;
