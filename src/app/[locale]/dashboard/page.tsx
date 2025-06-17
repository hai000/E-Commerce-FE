import {Metadata} from "next";
import OverviewPage from "@/app/[locale]/dashboard/overview/page";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard for administration",
}
export default async function DefaultPage() {
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        redirect("/sign-in?callbackUrl=/dashboard");
    }
    return <OverviewPage/>
}