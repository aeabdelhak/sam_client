import { useEffect, useState } from "react";
import Title from "../../../components/Title";
import fetchApi from "../../../utils/fetch";
import { LoaderIcon, toast } from "react-hot-toast";
import Gardiens from "../../../components/Gardiens/Gardiens";
import { useAppContext } from "../../../components/Context/AppContext";
import Button from "../../../components/Ui/button/Button";
import Router from "next/router";



export default function Page() {
    const { classes: {
        data:classes
    }, gardiens: {
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
            {classes.length > 0 ?
            
                loading ? <div className="flex h-screen w-screen scale-150 justify-center items-center">
                    <LoaderIcon />
                </div> :
                    <div className="">
                        <Gardiens
                            data={data as any}
                        />
                    </div>
                :
                <div className="flex py-32 gap-4 flex-col  justify-center items-center">
                    <h1 className="text-2xl font-bold text-gray-700">
                        you have not created classes yet 
                    </h1>
                  
                    <Button
                    onClick={()=>Router.push("/menu/class")}
                    >
                        open classes manager
                    </Button>
            </div>    
            }
            
        </>
    )
}