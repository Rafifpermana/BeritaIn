import React from "react";

const StatCard = ({
  value,
  title,
  description,
  Icon,
  iconColorClass = "text-gray-500",
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
        {Icon && <Icon size={20} className={`${iconColorClass} opacity-80`} />}
      </div>
      <div className="mt-2">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 truncate">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;
