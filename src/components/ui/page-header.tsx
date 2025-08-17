import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-blue-600/20",
  iconTextColor = "text-blue-400",
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {Icon && (
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${iconTextColor}`} />
          </div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
      )}
      {subtitle && <p className="text-gray-400">{subtitle}</p>}
    </div>
  );
}
