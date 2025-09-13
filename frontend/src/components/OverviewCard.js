import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, CheckCircle } from 'lucide-react'

const OverviewCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary',
  trend = null,
  trendValue = null 
}) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }

  const iconMap = {
    trendingUp: TrendingUp,
    trendingDown: TrendingDown,
    dollar: DollarSign,
    users: Users,
    clock: Clock,
    check: CheckCircle
  }

  const IconComponent = typeof Icon === 'string' ? iconMap[Icon] : Icon

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && trendValue && (
              <div className={`ml-2 flex items-center text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {trendValue}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {IconComponent && (
          <div className={`${colorClasses[color]} p-3 rounded-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewCard
