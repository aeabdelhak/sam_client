import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react"
import fetchApi from "../../utils/fetch";
import { useRouter } from "next/router";

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


export const useSession = () => useContext(Context)
export default function SessionConext({ children }) {
    const [user, setuser] = useState()
    const router = useRouter()
    async function getAuthUser() {
        if (router.pathname !== "/home") {
            const data = await fetchApi("/auth/user")
            if (data) setuser(data)
        }
    }

    useEffect(() => {
        getAuthUser()
    }, [router.pathname])



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