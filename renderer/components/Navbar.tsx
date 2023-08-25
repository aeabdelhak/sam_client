import NavArrows from "./Ui/button/back";
import { useAppContext } from "./Context/AppContext";

import { useAppTitle } from "./Context/TitleConext";
import { useSession } from "./Context/SessionConext";

export default function Navbar() {
    const { title}=useAppTitle()
    const {  user } = useSession()
   


    return (
        <div className=" ltr:ml-32 rtl:mr-32 mt-4 top-4 sticky   bg-white z-20 ">
            
            <div className="flex   mx-auto p-4 items-center container">
                <div className="flex-1 flex items-center">
                    <div className="">
                        <h1 className="font-semibold capitalize text-lg tracking-wide text-gray-600">
                            {title}
                        </h1>
                    </div>
                </div>
                <div className=" grid   overflow-hidden ">
                    <div className="flex w-full space-x-2 items-center">
                        <div className=" uppercase bg-blue-700 text-white w-6 h-6 text-xs  rounded-full flex justify-center items-center">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className=" flex-1 grid">
                            <p className=" text-xs line-clamp-2 w-full ">
                                {user?.name}
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}