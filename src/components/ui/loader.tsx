import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Loader2 className="h-20 w-20 text-primary animate-spin"  />
        </div>
    )
}