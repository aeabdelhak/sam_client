import { Dispatch, SetStateAction, createContext, useContext, useState } from "react"
import fetchApi from "../../utils/fetch";

export enum Roles {
    Administrator = "Administrator",
    ClassTeacher = "ClassTeacher",
    SuperUser = "SuperUser"
}
export type User = {
    id: string;
    name: string;
    username: string;
    passwordHash: string;
    passwordSalt: string;
    role: Roles;
    fileId: string | null;
}
const Context = createContext<{
    user: User,
    setUser: Dispatch<SetStateAction<User>>,
    getAuthUser: () => Promise<void>

}>({
    async getAuthUser() {
    },
    setUser: () => { },
    user: null as never
})


export const useSession=()=>useContext(Context)
export default function SessionConext({ children }) {
    const [user, setuser] = useState()
    async function getAuthUser() {

        const data = await fetchApi("/auth/user")
        if (data) setuser(data)


    }
    return (
        <Context.Provider value={{
            setUser: setuser,
            getAuthUser,
            user
        }}>
            {children}
        </Context.Provider>
    )
}