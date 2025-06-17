import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserX, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Card className="text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <UserX className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-2xl">User Not Found</CardTitle>
                    {
                        // eslint-disable-next-line
                        <CardDescription>The user you're looking for doesn't exist or may have been deleted.</CardDescription>}
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/customers">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Users
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
