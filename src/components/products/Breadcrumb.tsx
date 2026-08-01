import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
    label: string;
    to?: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                            {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
                            {item.to && !isLast ? (
                                <Link to={item.to} className="hover:text-green-600 transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={isLast ? "font-medium text-gray-900" : undefined}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
