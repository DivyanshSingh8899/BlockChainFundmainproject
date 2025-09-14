import React from 'react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

// Fund Distribution Over Time Chart
export const FundDistributionChart = ({ data = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Fund Distribution Over Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`${value} ETH`, name]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="deposited" 
              stackId="1" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              name="Deposited"
            />
            <Area 
              type="monotone" 
              dataKey="released" 
              stackId="1" 
              stroke="#10B981" 
              fill="#10B981" 
              name="Released"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Project Status Distribution Chart
export const ProjectStatusChart = ({ data = [] }) => {
  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']

  // Filter out invalid data entries
  const validData = data.filter(item => 
    item && 
    typeof item.name === 'string' && 
    item.name !== 'undefined' && 
    item.name !== 'null' &&
    typeof item.value === 'number' && 
    item.value > 0
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Project Status Distribution</h3>
      <div className="h-80">
        {validData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={validData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {validData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">No project data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Monthly Budget Allocation Chart
export const BudgetAllocationChart = ({ data = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Monthly Budget Allocation</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`${value} ETH`, name]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar dataKey="allocated" fill="#3B82F6" name="Allocated" />
            <Bar dataKey="spent" fill="#10B981" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Milestone Completion Trend Chart
export const MilestoneTrendChart = ({ data = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Milestone Completion Trend</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelFormatter={(label) => `Week: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Completed"
            />
            <Line 
              type="monotone" 
              dataKey="pending" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Pending"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Revenue vs Expenses Chart
export const RevenueExpensesChart = ({ data = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Revenue vs Expenses</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`${value} ETH`, name]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stackId="1" 
              stroke="#10B981" 
              fill="#10B981" 
              name="Revenue"
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stackId="1" 
              stroke="#EF4444" 
              fill="#EF4444" 
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Simple Stats Cards
export const StatsCards = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.color || 'bg-primary-500'}`}>
              {stat.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
              {stat.change && (
                <p className={`text-sm ${stat.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}% from last month
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
