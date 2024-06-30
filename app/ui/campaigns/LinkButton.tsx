import Link from "next/link";

export function LinkButton({
    href,
    children,
    icon,
}: {
    href: string;
    children: React.ReactNode;
    icon?: JSX.Element;
}) {
    return (
        <div className="flex items-center gap-5 self-start">
            <Link
                href={href}
                className="flex items-center gap-5 rounded-lg bg-blue-500 px-3 py-2.5 my-1 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
                <span> {children}</span> {icon}
            </Link>
        </div>
    );
}