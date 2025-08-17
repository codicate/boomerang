import { LucideIcon } from "lucide-react";

/**
 * A reusable metric card component for displaying statistics with icons and gradients
 *
 * @example
 * <MetricCard
 *   title="Total Users"
 *   value={1234}
 *   subtitle="Active community members"
 *   icon={Users}
 *   iconBgColor="bg-blue-600/20"
 *   iconTextColor="text-blue-400"
 *   gradientFrom="from-blue-600/10"
 *   gradientTo="to-blue-600/5"
 *   borderColor="border-blue-600/20"
 *   isLoading={false}
 * />
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconTextColor: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  isLoading?: boolean;
}

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconTextColor,
  gradientFrom,
  gradientTo,
  borderColor,
  isLoading = false,
}: MetricCardProps) => {
  return (
    <div
      className={`p-6 bg-gradient-to-br ${gradientFrom} ${gradientTo} border ${borderColor} rounded-lg flex justify-between items-center`}
    >
      <div className="flex items-center gap-3">
        <div
          className={` ${iconBgColor} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`${iconTextColor}`} />
        </div>
        <span className="text-gray-300 text-sm font-medium">{title}</span>
      </div>

      {isLoading ? (
        <div className="bg-gray-600 rounded animate-pulse "></div>
      ) : (
        <div className="text-2xl font-bold text-white ">{value}</div>
      )}
    </div>
  );
};
