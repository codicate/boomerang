import { CheckCircle, Circle, LucideIcon } from "lucide-react";

interface StepIndicatorProps {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isInProgress?: boolean;
  children?: React.ReactNode;
  icon?: LucideIcon;
  completedColor?: string;
  backgroundColor?: string;
}

export function StepIndicator({
  stepNumber,
  title,
  description,
  isCompleted,
  isInProgress = false,
  children,
  icon: CustomIcon,
  completedColor = "text-blue-400",
  backgroundColor = "bg-blue-900",
}: StepIndicatorProps) {
  const IconComponent = CustomIcon || (isCompleted ? CheckCircle : Circle);

  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center mb-4">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${backgroundColor} mr-3`}
        >
          <IconComponent className={`w-5 h-5 ${completedColor}`} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-white">
            Step {stepNumber}: {title}
          </h4>
          {isCompleted && (
            <span className="text-sm text-green-400 font-medium">
              Completed
            </span>
          )}
          {isInProgress && !isCompleted && (
            <span className="text-sm text-yellow-400 font-medium">
              In Progress
            </span>
          )}
        </div>
      </div>

      <div className="ml-11">
        <p className="text-gray-400 mb-4">{description}</p>
        {children}
      </div>
    </div>
  );
}
