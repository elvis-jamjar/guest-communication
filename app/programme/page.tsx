import { ScheduleList } from "@/components/schedule-list";
import { getConferenceSchedule } from "../actions/timeline";


export default async function Home() {
    const data = await getConferenceSchedule();
    return <div className="h-screen">
        <ScheduleList schedules={data} />
    </div>
}