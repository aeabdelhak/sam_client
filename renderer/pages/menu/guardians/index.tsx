import { useEffect, useState } from "react";
import Title from "../../../components/Title";
import fetchApi from "../../../utils/fetch";
import { LoaderIcon, toast } from "react-hot-toast";
import { useAppContext } from "../../../components/Context/AppContext";
import Button from "../../../components/Ui/button/Button";
import Router from "next/router";
import Guardians from "../../../components/Gardiens/Guardian";
import { useTranslation } from "../../../utils/translations/Context";



export default function Page() {
    const translations=useTranslation()
    const { classes: {
        data: classes,
        getData: getClasses,
        loading: loadingClasses
    }, guardians: {
        data, error, loading, refreshing, getData
    } } = useAppContext();

    useEffect(() => {
        if (!classes) {
            getClasses();
        }
        getData()
        return () => {

        }
    }, [])

    return (
        <>
            <Title
                title={translations.guarndiansAndStudents}
            />

            {(!classes && loadingClasses) ?
                <div className="flex h-screen w-screen scale-150 justify-center items-center">
                    <LoaderIcon />
                </div> :
                classes?.length > 0 ?

                    loading ? <div className="flex h-screen w-screen scale-150 justify-center items-center">
                        <LoaderIcon />
                    </div> :
                        <div className="">
                            <Guardians
                                data={data as any}
                            />
                        </div>
                    :
                    <div className="flex py-32 gap-4 flex-col  justify-center items-center">
                        <h1 className="text-2xl font-bold text-gray-700">
                            you have not created classes yet
                        </h1>

                        <Button
                            onClick={() => Router.push("/menu/class")}
                        >
                            open classes manager
                        </Button>
                    </div>
            }

        </>
    )
}