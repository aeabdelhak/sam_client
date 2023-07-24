import { Delete, Edit } from "react-iconly";
import { User } from "../Context/AppContext";
import Modal from "../Ui/Modal";
import { useState } from "react";
import DeleteUser from "./DeleteUser";
import EditUser from "./EditUser";

export default function UserData(data: User) {
    const [showDelete, setshowDelete] = useState(false)
    const [showEdit, setshowEdit] = useState(false)
  return (
    <div
      >
          <Modal handler={setshowDelete} shown={showDelete}>
              <DeleteUser
              {...data}
              />
          </Modal>
          <Modal handler={setshowEdit} shown={showEdit}>
              <EditUser
              {...data}
              />
          </Modal>
    <a className="flex w-full group transition-all disabled:bg-blue-700  items-center  disabled:text-white space-x-2 p-4 bg-white rounded-md hover:outline outline-gray-200">
        <div className=" uppercase bg-blue-700 text-white w-6 h-6 text-xs  rounded-full flex justify-center items-center">
            {data.name?.charAt(0)}
        </div>
        <div className="flex flex-1 items-start  flex-col">
            <p className="text-sm ">
                {data.name}
            </p>
            <span className="text-xs">
                {data.username}
            </span>
        </div>
        <>
            <p className="text-xs">
            {data.role=="ClassTeacher" ? "Class teacher" :data.role}
            </p>
        </>
        <div className="flex gap-2 items-center">
                  <button
                onClick={()=>setshowEdit(true)}
                className="text-blue-700 p-1 rounded hover:bg-gray-100">
                <Edit size={"small"}/>
            </button>
                  <button
                onClick={()=>setshowDelete(true)}
                      className="text-red-700 p-1 rounded hover:bg-gray-100">
                <Delete size={"small"}/>
            </button>
        </div>

    </a>
</div>
  )
}