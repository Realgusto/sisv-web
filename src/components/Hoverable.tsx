import { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoverableProps {
    children: ReactNode;
    renderHoverContent: () => ReactNode;
    className?: string;
}

export default function Hoverable({ children, renderHoverContent, className }: HoverableProps) {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative"
        >
            {children}
            {isHovering && (
                <div className={cn(className, "text-nowrap text-center absolute p-4 rounded-lg shadow-md transition-opacity duration-500 opacity-100")}>
                    {renderHoverContent()}
                </div>
            )}
        </div>
    );
} 