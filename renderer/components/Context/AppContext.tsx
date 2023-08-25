import { useContext, createContext, useState, Dispatch, SetStateAction, ReactNode } from "react"
import fetchApi from "../../utils/fetch";
import { toast } from "react-hot-toast";
import { convertBlobToBase64 } from "../../utils/fileToBase64";
import { AttendanceEntity } from "../../types/class";
import { Roles, User } from "./SessionConext";
import { useTranslation } from "../../utils/translations/Context";

export interface guardian {
    id: string;
    cardId: string;
    phoneNumber: string;
    name: string;
    Students?: (StudentsEntity)[] | null;
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
    Class: Class;
    Image?: File;
    Attendances?: AttendanceEntity[]

}
type studentState = {

    newStudent: (props: FormData) => Promise<boolean>,
    updateStudent: (props: FormData) => Promise<boolean>,
    deleteStudent: (props: { studentId: string }) => Promise<boolean>,
}
type ScheduleMap = {
    loading: boolean,
    data: Schedule[],
    error: boolean
}

export type Schedule = {
    id: string;
    weekDay: number
    classId: string
    subjectLabel: string
    startTime: string
    endTime: string
    readonly created_at: Date
}

type upsertscheduleType = {
    classId: string
    schedules: {
        weekDay: number
        id: string
        startTime: string
        endTime: string
        subjectLabel: string
    }[]
}
type upsertVacanceType = {
    id?: string
    startDate: Date,
    endDate: Date,
    label: string
}

export type Vacancy = {
    id: string
    startDate: Date,
    endDate: Date,
    label: string
}
type ScheduleState = {
    data: Map<string, ScheduleMap>
    getSchedule: (id: string) => Promise<ScheduleState['data']>
    upsertschedule: (props: upsertscheduleType) => Promise<boolean>
}
type VacanceState = {
    data: Vacancy[],
    loading: boolean,
    getVacances: () => Promise<void>
    upsertVacances: (props: upsertVacanceType[]) => Promise<boolean>
}
type DismissionRequests = Map<string, Set<string>>
type attendance = {
    dismissionRequests: DismissionRequests
    rejectRequest: (classId: string, studentId: string) => void,
    appendRequest: (classId: string, studentId: string) => void,
    dismiss: (classId: string, studentId: string) => Promise<boolean>,
    dismissClass: (classId: string) => Promise<boolean>,
}

export interface Class {
    id: string;
    label: string;
    Students: StudentsEntity[];
    _count: {
        students: number
    }
}
export interface Presence {
    id: string;
    weekDay: null;
    created_at: Date;
    subjectLabel: string;
    startTime: Date;
    endTime: Date;
    attended: boolean;
    scheduleId: string;
    studentId: string;
    Student: StudentsEntity
}
export interface PresenceHistory {
    student: StudentsEntity;
    presence: {
        date: string,
        data: Presence[]
    }[]
}
type classState = {
    refreshing: boolean,
    loading: boolean,
    error: boolean,
    data: Class[],
    getData: () => Promise<void>,
    classes: Map<string, Class>
    getClass: (id: string) => Promise<void>,
    getPresenceHistory: (id: string, from: Date, to: Date) => Promise<PresenceHistory>,
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

type state = {
    title: string,
    users: userState,
    setTitle: Dispatch<SetStateAction<string>>,
    guardians: guardianState,
    classes: classState,
    students: studentState,
    attendance: attendance,
    scheduls: ScheduleState,
    remoteServer: string,
    vacances: VacanceState
    setremoteServer: Dispatch<SetStateAction<string>>,

}

const Context = createContext<state>({
    title: "",
    remoteServer: "",
    setremoteServer: () => { },
    setTitle: null as never,
    guardians: {
        data: [],
        deleteGuardian: null as never,
        error: false,
        getData: null as never,
        loading: false,
        newGuardian: null as never,
        refreshing: false,
        updateGuardian: null as never
    },
    classes: {
        data: [],
        classes: new Map,
        getClass: null as never,
        deleteClass: null as never,
        getData: null as never,
        error: false,
        loading: false,
        newClass: null as never,
        refreshing: false,
        updateClass: null as never,
        getPresenceHistory: null as never,
    },
    students: {
        deleteStudent: null as never,
        newStudent: null as never,
        updateStudent: null as never
    },
    vacances: {
        data: [],
        loading: true,
        getVacances: async () => { },
        upsertVacances: null as never
    },
    users: {
        data: [],
        deleteUser: null as never,
        error: false,
        getData: null as never,
        loading: false,
        newUser: null as never,
        refreshing: false,
        updatePassword: null as never,
        updateUserData: null as never,
    },
    scheduls: {
        data: new Map(),
        getSchedule: async (id) => {
            return new Map()
        },
        upsertschedule: null as never
    },
    attendance: {
        dismissionRequests: new Map(),
        rejectRequest: () => { },
        appendRequest: () => { },
        dismiss: async () => false,
        dismissClass: async () => false,
    }
})

export const useAppContext = () => useContext(Context);
export default function AppContext({ children }: { children: ReactNode }) {
    const translations=useTranslation()
    const [classes, setclasses] = useState<classState>()
    const [dismissReqs, setdismissReqs] = useState<DismissionRequests>(new Map())
    const [users, setusers] = useState<userState>()
    const [guardian, setguardian] = useState<guardianState>()
    const [schedules, setschedules] = useState<ScheduleState['data']>(new Map())
    const [classesData, setclassesData] = useState<Map<string, Class>>(new Map());
    const [vacances, setvacances] = useState<Vacancy[]>()
    const [loadingvacances, setloadingvacances] = useState<boolean>(false)
    const [user, setUser] = useState<User>()
    const [title, setTitle] = useState("")
    const [remoteServer, setremoteServer] = useState("")

    async function getClasses() {
        const res = { ...classes }
        const init = { ...classes }

        try {
            res.data ? init.refreshing = true : init.loading = true;
            setclasses(init);
            res.data = (await fetchApi("/get/classes") as any[]).filter(e => e.id != null)
            res.data.forEach(e => {
                if (!schedules.has(e.id))
                    getSchedule(e.id)
            })
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
                toast.success(translations.newUserSuccess)
                return true;
            }
            if (res.exist) toast.error(translations.newUserExist)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

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
                toast.success(translations.newClassSuccess)
                return true;
            }
            if (res.exist) toast.error(translations.newClassExist)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

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
                toast.success(translations.newClassSuccess)
                return true;
            }
            if (res.exist) toast.error(translations.newGuardianExist)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

            return false;
        }
    }
    async function newStudent(params: FormData) {
        const firstName = params.get("firstName") as string
        const lastName = params.get("lastName") as string
        const classId = params.get("classId") as string
        const guardianId = params.get("guardianId") as string
        const image = await convertBlobToBase64(params.get("image") as Blob)

        try {
            const res = await fetchApi("/create/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    image,
                    firstName,
                    lastName,
                    classId,
                    guardianId
                })
            })
            if (res.studentId) {
                await getguardians();
                toast.success(translations.newStudentSuccess)
                return true;
            }
            if (res.exist) toast.error(translations.newStudentExist)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

            return false;
        }
    }
    async function updateStudent(params: FormData) {

        const studentId = params.get("studentId") as string
        const firstName = params.get("firstName") as string
        const lastName = params.get("lastName") as string
        const classId = params.get("classId") as string
        const image = params.get("image") && await convertBlobToBase64(params.get("image") as Blob)

        try {
            const res = await fetchApi("/update/student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId,
                    image,
                    firstName,
                    lastName,
                    classId,
                })
            })
            if (res.success) {
                await getguardians();
                toast.success(translations.newGuardianSuccess)
                return true;
            }
            if (res.exist) toast.error(translations.newGuardianExist)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

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
                toast.success(translations.deleteStudentSuccess)
                return true;
            }
            toast.error(translations.errorMsg)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

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
                toast.success(translations.deleteUserSuccess)
                return true;
            }
            toast.error(translations.errorMsg)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)
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
                toast.success(translations.deleteGuardianSuccess)
                return true;
            }
            toast.error(translations.errorMsg)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)
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
                toast.success(translations.updateUserPasswordSuccess)
                return true;
            }
            toast.error(translations.errorMsg)
            return false;


        } catch (error) {
            toast.error(translations.errorMsg)
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
                toast.success(translations.updateUserDataSuccess)
                return true;
            }
            if (res.notFound) {
                toast.error(translations.UserNotFound)
                return false;
            }
            if (res.exist) {
                toast.error(translations.newUserExist)
                return false;
            }


        } catch (error) {
            toast.error(translations.errorMsg)
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
                await getClasses();
                setdismissReqs(e => {
                    const map = new Map(e);
                    const students = new Set(map.get(classId));
                    students.delete(studentId);
                    map.set(classId, students)
                    return map;
                })
                toast(translations.studentDismissSuccess)
                return true;
            }
            toast.error(translations.errorMsg)
            return false;


        } catch (error) {
            toast.error(translations.errorMsg)
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
                toast.success(translations.classUpdatedSuccess)
                return true;
            }
            if (res.exist) toast.error(translations.newClassExist)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

            return false;
        }
    }

    async function getClass(id: string) {
        try {
            const data = new Map(classesData)
            const getData = await fetchApi('/get/class/' + id)
            data.set(id, getData)
            setclassesData(data)
        } catch (error) {
            toast.error("")
        }
    }
    async function dismissClass(id: string) {
        try {
            const res = await fetchApi('/attendance/dismissall/' + id, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res) {
                toast.success(translations.allDismissed)
                await getClass(id)
                dismissReqs.delete(id)
                return true
            }
            toast.error("")
        } catch (error) {
            toast.error("")
            return false
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
                toast.success(translations.deleteClassSuccess)
                return true;
            }
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)
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
                toast.success(translations.updateGuardianSuccess)
                return true;
            }
            if (res.notFound) {

                toast.success(translations.guardianNotFound)
                return true;
            }
            if (res.exist) toast.error(translations.newGuardianExist)
            return false;

        } catch (error) {
            toast.error(translations.errorMsg)

            return false;
        }

    }
    async function getSchedule(id: string) {
        const oldMap = new Map(schedules);
        const newMap = new Map(schedules);
        oldMap.set(id, {
            data: oldMap.get(id)?.data,
            error: false,
            loading: true,
        })
        setschedules(new Map(newMap))


        try {

            const data = (await fetchApi("/get/class/" + id + "/schedule"))
            const map = new Map().set(id, {
                loading: false,
                data: data,
                error: false
            })
            setschedules(map)
            return map;
        } catch (error) {
            const map = new Map().set(id, {
                loading: false,
                data: oldMap.get(id)?.data,
                error: true
            })
            setschedules(map)
            return map;

        }

    }
    async function upsertschedule(params: upsertscheduleType) {
        try {
            const res = await fetchApi("/upsert/schedule", {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.success) {
                toast.success("")
                await getSchedule(params.classId)
                return true
            }
        }
        catch {

        }
        return false


    }
    async function upsertVacances(params: upsertVacanceType[]) {
        try {
            const res = await fetchApi("/upsert/vacances", {
                method: "POST",
                body: JSON.stringify(params),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.success) {
                toast.success(translations.vacancesupdatedsuccess)
                await getVacances()
                return true
            }
        }
        catch {

        }
        return false


    }
    async function getPresenceHistory(id: string, from: Date, to: Date) {

        try {
            const res = await fetchApi(`/get/history/${id}`, {
                method: "POST",
                body: JSON.stringify({ from, to }),
                headers: {
                    "Content-Type": "application/json"
                }

            })
            return res
        }
        catch {

        }



    }

    async function getVacances() {
        if (loadingvacances) return
        setloadingvacances(true);
        try {

            const data = (await fetchApi("/get/vacances"))
            if (data)
                setvacances((data as Vacancy[]).map(e => ({
                    ...e,
                    endDate: new Date(e.endDate),
                    startDate: new Date(e.startDate)
                })))
        } catch (error) {


        }
        setloadingvacances(false);

    }

    return (
        <Context.Provider value={{
            title,
            setTitle,
            setremoteServer,
            remoteServer,
            vacances: {
                getVacances,
                data: vacances,
                loading: loadingvacances,
                upsertVacances
            },
            guardians: {
                ...guardian,
                getData: getguardians,
                newGuardian: newGardent,
                updateGuardian,
                deleteGuardian

            },
            classes: {
                ...classes,
                classes: classesData,
                getClass,
                getData: getClasses,
                newClass,
                updateClass,
                deleteClass,
                getPresenceHistory
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
                rejectRequest,
                dismissClass
            },
            users: {
                ...users,
                getData: getUsers,
                newUser,
                deleteUser,
                updatePassword,
                updateUserData
            },
            scheduls: {
                getSchedule,
                data: schedules,
                upsertschedule
            }


        }}>
            {children}
        </Context.Provider>
    )
}