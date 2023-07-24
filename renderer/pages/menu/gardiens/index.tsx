import { useEffect, useState } from "react";
import Title from "../../../components/Title";
import fetchApi from "../../../utils/fetch";
import { LoaderIcon, toast } from "react-hot-toast";
import Gardiens from "../../../components/Gardiens/Gardiens";
import { useAppContext } from "../../../components/Context/AppContext";



export default function Page() {
    const { gardiens: {
        data, error, loading, refreshing, getData
    } } = useAppContext();

    useEffect(() => {

        getData()
        return () => {

        }
    }, [])

    return (
        <>
            <Title
                title="Gardiens and students"
            />
            {
                loading ? <div className="flex h-screen w-screen scale-150 justify-center items-center">
                    <LoaderIcon />
                </div> :
                    <div className="">
                        <Gardiens
                            data={data as any}
                        />
                    </div>
            }
        </>
    )
}