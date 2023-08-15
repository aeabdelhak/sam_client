import { useRouter } from "next/router";
import ScheduleContent from "./_scheduleContent";

export default function Schedule() {
    const router = useRouter()
    if(!router.isReady) return null;
  return <ScheduleContent/>
}