import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Clock, CheckCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const OverviewCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary',
  trend = null,
  trendValue = null 
}) => {
  const { isDark } = useTheme()
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
    <div 
      className="rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-200"
      style={{
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p 
            className="text-sm font-medium mb-1"
            style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
          >{title}</p>
          <div className="flex items-baseline">
            <p 
              className="text-2xl font-semibold"
              style={{ color: isDark ? '#f3f4f6' : '#111827' }}
            >{value}</p>
            {trend && trendValue && (
              <div className={`ml-2 flex items-center text-sm ${
                trend === 'up' 
                  ? (isDark ? 'text-green-400' : 'text-green-600')
                  : (isDark ? 'text-red-400' : 'text-red-600')
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
            <p 
              className="text-sm mt-1"
              style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
            >{subtitle}</p>
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
