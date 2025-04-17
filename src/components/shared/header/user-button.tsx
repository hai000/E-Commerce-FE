import {auth, getInfo} from "@/lib/api/user";
import {cookies} from "next/headers";
import {IUser} from "@/lib/response/user";
import {UserButtonClient} from "@/components/shared/header/user-button-client";
import {getILogin} from "@/lib/utils";

export default async function UserButton() {
    const cook = await cookies()
    const iLogin = getILogin(cook);
    const session = await auth(iLogin)
    let acc;
    if (session) {
        acc = await getInfo({
            accessToken: cook.get('accessToken')?.value || "",
            refreshToken: ""
        }) as IUser
    }
    return (
        <UserButtonClient user={acc} />
    );
}