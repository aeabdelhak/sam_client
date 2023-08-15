import { Delete, Edit, TimeCircle } from "react-iconly";
import { Class } from "../Context/AppContext";
import { useState } from "react";
import Modal from "../Ui/Modal";
import EditClass from "./EditClass";
import DeleteClass from "./DeleteClass";
import Router from "next/router";
import { ipcRenderer } from "electron";

export default function TheClass(data: Class) {
    const [showDelete, setshowDelete] = useState(false)
    const [showEdit, setshowEdit] = useState(false)
    return (
        <div

            key={data.id}
            className="flex w-full group transition-all disabled:bg-blue-700  items-center disabled:text-white space-x-2 p-4 bg-white rounded-md border">
              <Modal handler={setshowDelete} shown={showDelete}>
              <DeleteClass
              {...data}
              />
          </Modal>
          <Modal handler={setshowEdit} shown={showEdit}>
              <EditClass
              {...data}
              />
          </Modal>
            
            <div className="bg-blue-800 flex  text-white rounded-full w-8 h-8  justify-center items-center">
            </div>
            <div className="flex flex-1 items-start space-y-1 flex-col">
                <p className="text-sm ">
                    {data.label}
                </p>
            </div>
      
            <div className="flex gap-2 items-center">
                <button
                    onClick={() => setshowEdit(true)}
                    className="text-blue-700 p-1 rounded hover:bg-blue-100">
                    <Edit size={"small"} />
                </button>
                <button
                    onClick={() => {
                        ipcRenderer.send("zoom",true)
                        Router.push('/'.concat("menu/", "class/", data.id, "/schedule?label=", data.label))
                    }}
                    className="text-green-700 p-1 rounded hover:bg-green-100">
                    <TimeCircle size={"small"} />
                </button>
                <button
                    onClick={() => setshowDelete(true)}
                    className="text-red-700 p-1 rounded hover:bg-red-100">
                    <Delete size={"small"} />
                </button>
               
            </div>
        </div>)
}