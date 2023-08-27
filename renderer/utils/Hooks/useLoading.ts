import { useState } from "react";

export default function useLoading(): [boolean, (callback: () => Promise<any>) => Promise<void>] {
    const [loading, setloading] = useState(false);

    async function asyncFunction(callback: () => Promise<any>) {
        setloading(true);
        await callback();
        setloading(false);
    }

    return [loading, asyncFunction];
}