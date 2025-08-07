import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      className={`flex items-center space-x-1 text-sm text-purple-200 ${className}`}
    >
      <Link
        to="/"
        className="flex items-center hover:text-white transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-white transition-colors truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium truncate">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
