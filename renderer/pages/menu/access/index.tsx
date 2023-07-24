import { useEffect, useState } from "react";
import { useAppContext } from "../../../components/Context/AppContext";
import Title from "../../../components/Title";
import Modal from "../../../components/Ui/Modal";
import NewUser from "../../../components/User/newUser";
import Button from "../../../components/Ui/button/Button";
import UserData from "../../../components/User/User";

export default function Access() {
    const [openNew, setopenNew] = useState(false)
    const { users: {
        loading, error, data, getData
    } } = useAppContext();
    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <Modal
                handler={setopenNew}
                shown={openNew}
            >
                <NewUser />
            </Modal>
            <Title
                title="users manager"
            />
            <div className="flex mb-6 flex-col gap-4">
                <h1 className="font-semibold text-3xl">
                    Users manager
                </h1>
                <p className="text-xs">
                    manage application accesses
                </p>
            </div>
            <div className="grid gap-4 grid-cols-3">
                <div className="col-span-2 rounded-lg bg-slate-50 p-6">
                    <div className="flex justify-between pb-6">
                        <h1 className="font-semibold text-xl">
                            Users
                        </h1>
                        <div className="">
                            <Button
                                onClick={() => setopenNew(true)}
                            >                                new user
                            </Button>
                        </div>
                    </div>
                    {loading ?
                        <div className="space-y-1">
                            {Array.from(Array(6).keys()).map(e => (
                                <div
                                    key={e} style={{
                                        animationDelay: e * .3 + "s"
                                    }} className=" p-6 rounded-lg animate-pulse bg-gray-200">

                                </div>
                            ))}
                        </div>
                        : <div className="space-y-1">
                            {data?.map(e => (
                                <UserData
                                    {...e}
                                    key={e.id}
                                />
                            ))}
                        </div>}
                </div>

            </div>
        </>
    )
}
