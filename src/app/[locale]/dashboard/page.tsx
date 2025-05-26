import {Metadata} from "next";
import OverviewPage from "@/app/[locale]/dashboard/overview/page";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard for administration",
}
export default function DefaultPage() {
    return <OverviewPage/>
}