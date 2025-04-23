import {Metadata} from "next";
import {CalendarDateRangePicker} from "@/app/dashboard/components/date-range-picker";
import {Button} from "@/components/ui/button";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import OverviewTabContent from "@/app/dashboard/overview/overview";
import AnalyticsTabContent from "@/app/dashboard/overview/analytics";


export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard for administration",
}
export default function OverviewPage() {
    return (
        <>
            <div className="flex-1 space-y-4 p-5 pt-6">
                <div className="flex flex-wrap items-center justify-between space-y-2">
                    <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
                    <div className="flex items-center justify-between w-full">
                        <CalendarDateRangePicker/>
                        <Button className="max-w-[80px]">Download</Button>
                    </div>
                </div>
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="flex">
                        <TabsTrigger value="overview" className="flex-grow min-w-0 text-center">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex-grow min-w-0 text-center">
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="flex-grow min-w-0 text-center">
                            Reports
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex-grow min-w-0 text-center">
                            Notifications
                        </TabsTrigger>
                    </TabsList>
                    <OverviewTabContent/>
                    <AnalyticsTabContent/>
                </Tabs>
            </div>
        </>
    )
}