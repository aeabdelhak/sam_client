import { useContext, createContext, useState, Dispatch, SetStateAction, ReactNode } from "react"
import fetchApi from "../../utils/fetch";
import { toast } from "react-hot-toast";
export enum Roles {
    Administrator = "Administrator",
    ClassTeacher = "ClassTeacher",
    SuperUser = "SuperUser"
}
export interface guardian {
    id: string;
    cardId: string;
    phoneNumber: string;
    name: string;
    students?: (StudentsEntity)[] | null;
}
export interface File {
    id: string
    path: string
    url: string
    name: string
    type: string
}

export interface StudentsEntity {
    id: string;
    firstName: string;
    lastName: string;
    guardianId: string;
    classId: string;
    fileId?: null;
    class: Class;
    image?: File;

}
type studentState = {

    newStudent: (props: FormData) => Promise<boolean>,
    updateStudent: (props: FormData) => Promise<boolean>,
    deleteStudent: (props: { studentId: string }) => Promise<boolean>,
}
type DismissionRequests = Map<string, Set<string>>
type attendance = {
    dismissionRequests: DismissionRequests
    rejectRequest: (classId: string, studentId: string) => void,
    appendRequest: (classId: string, studentId: string) => void,
    dismiss: (classId: string, studentId: string) => Promise<boolean>,
}

export interface Class {
    id: string;
    label: string;
    students: StudentsEntity[];
    _count: {
        students: number
    }
}
type classState = {
    refreshing: boolean,
    loading: boolean,
    error: boolean,
    data: Class[],
    getData: () => Promise<void>,
    updateClass: (p: { classId: string, label: string }) => Promise<boolean>
    deleteClass: (p: { classId: string }) => Promise<boolean>
    newClass: (props: { label: string }) => Promise<boolean>,
}
type guardianState = {
    refreshing: boolean,
    loading: boolean,
    error: boolean,
    data: guardian[],
    getData: () => Promise<void>,
    deleteGuardian: ({ id }: { id: string }) => Promise<boolean>,
    updateGuardian: (props: { name: string, cardId: string, phoneNumber: string, guardianId: string }) => Promise<boolean>,
    newGuardian: (props: { name: string, cardId: string, phoneNumber: string }) => Promise<boolean>,
}
type userState = {
    updateUserData: (params: { userId: string, username: string, name: string, role?: Roles }) => Promise<boolean>,
    updatePassword: ({ userId, password }: { userId: string, password: String }) => Promise<boolean>,
    deleteUser: ({ id }: { id: string }) => Promise<boolean>,
    newUser: ({ name, username, password, role }: { name: string, username: string, password: string, role?: string }) => Promise<boolean>,
    refreshing: boolean,
    loading: boolean,
    error: boolean,
    data: User[],
    getData: () => Promise<void>,
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
type state = {
    title: string,
    user?: User,
    users: userState,
    setUser: Dispatch<SetStateAction<User>>,
    setTitle: Dispatch<SetStateAction<string>>,
    guardians: guardianState,
    classes: classState,
    students: studentState,
    attendance: attendance

}

const Context = createContext<state>({
    title: "",
    setTitle: null as never,
    setUser: null as never,
    guardians: null as never,
    classes: null as never,
    students: null as never,
    users: null as never,
    attendance: {
        dismissionRequests: new Map(),
        rejectRequest: () => { },
        appendRequest: () => { },
        dismiss: async () => false,

    }

})

export const useAppContext = () => useContext(Context);
export default function AppContext({ children }: { children: ReactNode }) {
    const [classes, setclasses] = useState<classState>()
    const [dismissReqs, setdismissReqs] = useState<DismissionRequests>(new Map())
    const [users, setusers] = useState<userState>()
    const [guardian, setguardian] = useState<guardianState>()
    const [user, setUser] = useState<User>()
    const [title, setTitle] = useState("")

    async function getClasses() {
        const res = { ...classes }
        const init = { ...classes }

        try {
            res.data ? init.refreshing = true : init.loading = true;
            setclasses(init);
            res.data = await fetchApi("/get/classes")
            res.error = false;
        } catch (error) {
            res.error = true;
        }
        res.refreshing = false
        res.loading = false;
        setclasses(res);

    }
    async function getUsers() {
        const res = { ...users }
        const init = { ...users }

        try {
            res.data ? init.refreshing = true : init.loading = true;
            setusers(init);
            res.data = await fetchApi("/get/users")
            res.error = false;
        } catch (error) {
            res.error = true;
        }
        res.refreshing = false
        res.loading = false;
        setusers(res);
    }
    async function newUser(params: { name: string, password: string, username: string, role?: Roles }) {
        type response = {
            exist: boolean,
            success: string,
        }
        try {
            const res: response = await fetchApi("/auth/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(params)
            })
            if (res.success) {
                await getUsers();
                toast.success("new user created successfuly")
                return true;
            }
            if (res.exist) toast.error("a user with same username already exists")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }
    }
    async function newClass(params: { label: string }) {
        type response = {
            exist: boolean,
            classId: string,

        }
        try {
            const res: response = await fetchApi("/create/class", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(params)
            })
            if (res.classId) {
                await getClasses();
                toast.success("new class created successfuly")
                return true;
            }
            if (res.exist) toast.error("a class with same name already exists")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }
    }


    async function getguardians() {
        const res = { ...guardian }
        const init = { ...guardian }

        try {
            res.data ? init.refreshing = true : init.loading = true;
            setguardian(init);
            res.data = await fetchApi("/get/guardians")
            res.error = false;
        } catch (error) {
            res.error = true;
        }
        res.refreshing = false
        res.loading = false;
        setguardian(res);

    }
    async function newGardent(params: { name: string, cardId: string, phoneNumber: string }) {
        type response = {
            exist: boolean,
            guardianId: string,

        }
        try {
            const res: response = await fetchApi("/create/guardian", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(params)
            })
            if (res.guardianId) {
                await getguardians();
                toast.success("new gariden created successfuly")
                return true;
            }
            if (res.exist) toast.error("a guardian with same cardId already exists")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }
    }
    async function newStudent(params: FormData) {

        try {
            const res = await fetchApi("/create/student", {
                method: "POST",

                body: params
            })
            if (res.studentId) {
                await getguardians();
                toast.success("new student created successfuly")
                return true;
            }
            if (res.exist) toast.error("a student with same cardId already exists")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }
    }
    async function updateStudent(params: FormData) {

        try {
            const res = await fetchApi("/update/student", {
                method: "POST",
                body: params
            })
            if (res.success) {
                await getguardians();
                toast.success(" student data updated successfuly")
                return true;
            }
            if (res.exist) toast.error("something went wrong")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }
    }
    async function deleteStudent({ studentId }: { studentId: string }) {

        try {
            const res = await fetchApi("/delete/student/" + studentId, {
                method: "DELETE",
            })
            if (res) {
                await getguardians();
                toast.success(" student deleted successfuly")
                return true;
            }
            toast.error("something went wrong")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }
    }
    async function deleteUser({ id }: { id: string }) {

        try {
            const res = await fetchApi("/delete/user/" + id, {
                method: "DELETE",
            })
            if (res) {
                await getUsers();
                toast.success(" user deleted successfuly")
                return true;
            }
            toast.error("something went wrong")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")
            return false;
        }
    }
    async function deleteGuardian({ id }: { id: string }) {

        try {
            const res = await fetchApi("/delete/guardian/" + id, {
                method: "DELETE",
            })
            await getguardians();
            await getClasses();
            if (res.success) {
                toast.success(" guardian deleted successfuly")
                return true;
            }
            toast.error("something went wrong")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")
            return false;
        }
    }

    function appendRequest(classId: string, studentId: string) {
        setdismissReqs(e => {
            const map = new Map(e);
            const students = new Set(map.get(classId));
            students.add(studentId);
            map.set(classId, students)
            return map;
        })
    }

    async function updatePassword(params: { userId: string, password: string }) {
        try {
            const res = await fetchApi("/update/auth/password", {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res) {
                toast.success(" user password updated successfuly")
                return true;
            }
            toast.error("something went wrong")
            return false;


        } catch (error) {
            toast.error("somethong went wrong ,try again")
            return false;

        }
    }

    async function updateUserData(params: { userId: string, username: string, name: string, role?: Roles }) {
        try {
            const res = await fetchApi("/update/auth/data", {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            await getUsers();
            if (res.success) {
                toast.success(" user data updated successfuly")
                return true;
            }
            if (res.notFound) {
                toast.error("unable to find a user with that id")
                return false;
            }
            if (res.exist) {
                toast.error("another user with same username exists")
                return false;
            }


        } catch (error) {
            toast.error("somethong went wrong ,try again")
            return false;

        }
    }
    async function dismiss(classId: string, studentId: string) {
        try {
            const res = await fetchApi("/attendance/dismiss", {
                method: "POST",
                body: JSON.stringify({ studentId }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res) {
                setdismissReqs(e => {
                    const map = new Map(e);
                    const students = new Set(map.get(classId));
                    students.delete(studentId);
                    map.set(classId, students)
                    return map;
                })
                toast(" student dissmised successfuly")
                return true;
            }
            toast.error("something went wrong")
            return false;


        } catch (error) {
            toast.error("somethong went wrong ,try again")
            return false;

        }
    }
    async function rejectRequest(classId: string, studentId: string) {

        setdismissReqs(e => {
            const map = new Map(e);
            const students = new Set(map.get(classId));
            students.delete(studentId);
            map.set(classId, students)
            return map;
        })
    }
    async function updateClass({ classId, label }: { classId: string, label: string }) {
        try {
            const res = await fetchApi("/update/class", {
                method: "POST",
                body: JSON.stringify({ classId, label }),
                headers: {
                    "Content-Type": "application/json"
                }

            })
            if (res.success) {
                await getClasses();
                getguardians();
                toast.success(" class label updated successfuly")
                return true;
            }
            if (res.exist) toast.error("another class with same label exists")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }
    }
    async function deleteClass({ classId }: { classId: string }) {

        try {
            const res = await fetchApi("/delete/class/" + classId, {
                method: "DELETE",
            })
            if (res.success) {
                getguardians();
                await getClasses();
                toast.success(" class deleted successfuly")
                return true;
            }
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")
            return false;
        }
    }
    async function updateGuardian(params: { name: string, cardId: string, phoneNumber: string, guardianId: string }) {
        try {
            const res = await fetchApi("/update/guardian", {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json"
                }

            })
            await getguardians();
            await getClasses();

            if (res.success) {
                toast.success(" guardian data updated successfuly")
                return true;
            }
            if (res.notFound) {

                toast.success(" unable to find the desired guardian ")
                return true;
            }
            if (res.exist) toast.error("another class with same label exists")
            return false;

        } catch (error) {
            toast.error("somethong went wrong ,try again")

            return false;
        }

    }

    return (
        <Context.Provider value={{
            title,
            setTitle,
            user,
            setUser,
            guardians: {
                ...guardian,
                getData: getguardians,
                newGuardian: newGardent,
                updateGuardian,
                deleteGuardian

            },
            classes: {
                ...classes,
                getData: getClasses,
                newClass,
                updateClass,
                deleteClass
            },
            students: {
                newStudent,
                updateStudent,
                deleteStudent
            },
            attendance: {
                dismissionRequests: dismissReqs,
                appendRequest,
                dismiss,
                rejectRequest
            },
            users: {
                ...users,
                getData: getUsers,
                newUser,
                deleteUser,
                updatePassword,
                updateUserData
            }


        }}>
            {children}
        </Context.Provider>
    )
}