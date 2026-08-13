import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import RootLanding from "./components/root-landing"

export default async function RootPage() {
    const { userId } = await auth()
    if (userId) redirect("/home")
    return <RootLanding />
}
