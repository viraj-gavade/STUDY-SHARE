import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
function Separator({ className, orientation = "horizontal", ...props }) {
    return (_jsx("div", { className: cn("shrink-0 bg-gray-200", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className), ...props }));
}
export { Separator };
