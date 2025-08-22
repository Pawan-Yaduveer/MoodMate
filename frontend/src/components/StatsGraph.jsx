import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const StatsGraph = ({ moods = [], type = 'bar' }) => {
  const [chartType, setChartType] = useState(type);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // Process real mood data
  useEffect(() => {
    if (moods && moods.length > 0) {
      // Process data for line/bar charts (last 7 days)
      const last7Days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayMoods = moods.filter(mood => {
          const moodDate = new Date(mood.date);
          return moodDate.toDateString() === date.toDateString();
        });
        
        const avgMood = dayMoods.length > 0 
          ? dayMoods.reduce((sum, m) => sum + (m.intensity || 5), 0) / dayMoods.length 
          : 0;
        
        last7Days.push({
          name: dayName,
          mood: Math.round(avgMood * 10) / 10,
          count: dayMoods.length
        });
      }
      
      setChartData(last7Days);
      
      // Process data for pie chart (mood type distribution)
      const moodCounts = {};
      moods.forEach(mood => {
        moodCounts[mood.moodType] = (moodCounts[mood.moodType] || 0) + 1;
      });
      
      const pieChartData = Object.entries(moodCounts).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value: count,
        color: getMoodColor(type)
      }));
      
      setPieData(pieChartData);
    }
  }, [moods]);

  const getMoodColor = (moodType) => {
    const colors = {
      happy: '#fbbf24',    // Yellow
      sad: '#3b82f6',      // Blue
      angry: '#ef4444',    // Red
      anxious: '#8b5cf6',  // Purple
      excited: '#ec4899',  // Pink
      calm: '#10b981',     // Green
      stressed: '#f97316', // Orange
      grateful: '#06b6d4', // Cyan
      lonely: '#6366f1',   // Indigo
      confident: '#84cc16', // Lime
      other: '#9ca3af'     // Gray
    };
    return colors[moodType] || colors.other;
  };

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: '📊' },
    { id: 'line', label: 'Line Chart', icon: '📈' },
    { id: 'pie', label: 'Pie Chart', icon: '🥧' }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#0ea5e9" strokeWidth={2} />
          </LineChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      
      default:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="mood" fill="#0ea5e9" />
          </BarChart>
        );
    }
  };

  if (moods.length === 0) {
    return (
      <div className="space-y-4">
        {/* Chart Type Selector */}
        <div className="flex justify-center space-x-2">
          {chartTypes.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setChartType(chart.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                chartType === chart.id
                  ? 'bg-primary-100 text-primary-700 border border-primary-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{chart.icon}</span>
              {chart.label}
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">
            <BarChart className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
          <p className="text-gray-600">
            Start recording your moods to see beautiful charts and insights here.
          </p>
        </div>

        {/* Sample Chart for Demo */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Sample Chart (Demo)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex justify-center space-x-2">
        {chartTypes.map((chart) => (
          <button
            key={chart.id}
            onClick={() => setChartType(chart.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              chartType === chart.id
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{chart.icon}</span>
            {chart.label}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsGraph;
