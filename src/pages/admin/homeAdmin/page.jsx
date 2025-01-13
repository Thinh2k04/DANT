import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [currentDate] = useState(new Date());
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [yearlyStats, setYearlyStats] = useState(null);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [viewType, setViewType] = useState('day'); // 'day', 'month' hoặc 'year'
  const [revenueChartData, setRevenueChartData] = useState({
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [{
      label: 'Doanh thu (VND)',
      data: Array(12).fill(0),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.4,
      fill: true,
    }]
  });
  const [dailyStats, setDailyStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(currentDate.toISOString().split('T')[0]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Doanh thu (VND)',
      data: [],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      tension: 0.4,
      fill: true,
    }]
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Doanh thu ${
          viewType === 'day' ? 'theo ngày' : 
          viewType === 'month' ? 'theo tháng' : 'theo năm'
        }`,
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'VND'
        }
      }
    }
  };

 // Fetch thống kê theo tháng
const fetchMonthlyStats = async (year, month) => {
  try {
    const formattedMonth = month.toString().padStart(2, '0');
    const token = localStorage.getItem('Authorization'); // Lấy token từ localStorage
    const response = await axios.get(`http://localhost:8080/rest/thong_ke/thang/${year}-${formattedMonth}`, {
      headers: {
        Authorization: `${token}` // Thêm header Authorization
      }
    });

    if (response.data) {
      const newData = [...revenueChartData.datasets[0].data];
      newData[month - 1] = response.data.tongTien;

      setRevenueChartData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: newData
        }]
      }));

      setMonthlyStats(response.data);
    } else {
      setMonthlyStats(null);
    }
  } catch (error) {
    console.error('Error fetching monthly statistics:', error);
    setMonthlyStats(null);
  }
};

  // Fetch thống kê theo năm
  const fetchYearlyStats = async (year) => {
    try {
      const token = localStorage.getItem('Authorization');
      const response = await axios.get(`http://localhost:8080/rest/thong_ke/nam/${year}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setYearlyStats(response.data);
    } catch (error) {
      console.error('Error fetching yearly statistics:', error);
    }
  };

  // Thêm hàm fetch thống kê theo ngày
  const fetchDailyStats = async (date) => {
    try {
      const token = localStorage.getItem('Authorization');
      const response = await axios.get(`http://localhost:8080/rest/thong_ke/getToday/${date}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      // Kiểm tra nếu response.data là mảng rỗng hoặc không có dữ liệu
      if (response.data && response.data.length > 0) {
        setDailyStats(response.data[0]);
      } else {
        // Nếu không có dữ liệu, set dailyStats về null
        setDailyStats(null);
      }
    } catch (error) {
      console.error('Error fetching daily statistics:', error);
      setDailyStats(null);
    }
  };

  // Thêm hàm fetch tổng doanh thu
  const fetchTotalRevenue = async () => {
    try {
      const token = localStorage.getItem('Authorization');
      const response = await axios.get('http://localhost:8080/rest/thong_ke/tongDoanhThu', {
        headers: {
          Authorization: `${token}`
        }
      });
      setTotalRevenue(response.data);
    } catch (error) {
      console.error('Error fetching total revenue:', error);
    }
  };

  // Thêm hàm để cập nhật dữ liệu biểu đồ theo tháng
  const updateMonthlyChartData = async (year) => {
    try {
      const labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const data = Array(12).fill(0);
      const token = localStorage.getItem('Authorization');

      // Lấy dữ liệu cho từng tháng trong năm
      for (let month = 1; month <= 12; month++) {
        const formattedMonth = month.toString().padStart(2, '0');
        try {
          const response = await axios.get(`http://localhost:8080/rest/thong_ke/thang/${year}-${formattedMonth}`, {
            headers: {
              Authorization: `${token}`
            }
          });
          if (response.data && response.data.tongTien) {
            data[month - 1] = response.data.tongTien;
          }
        } catch (err) {
          console.error(`Error fetching data for month ${month}:`, err);
        }
      }

      setChartData({
        labels,
        datasets: [{
          label: 'Doanh thu (VND)',
          data,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.4,
          fill: true,
        }]
      });
    } catch (error) {
      console.error('Error fetching monthly chart data:', error);
    }
  };

  // Thêm hàm để cập nhật dữ liệu biểu đồ theo năm
  const updateYearlyChartData = async () => {
    try {
      // Lấy dữ liệu từ năm 2020 đến năm hiện tại
      const currentYear = new Date().getFullYear();
      const years = Array.from(
        { length: currentYear - 2020 + 1 },
        (_, i) => 2020 + i
      );
      
      const data = [];
      const token = localStorage.getItem('Authorization');
      for (const year of years) {
        try {
          const response = await axios.get(`http://localhost:8080/rest/thong_ke/nam/${year}`, {
            headers: {
              Authorization: `${token}`
            }
          });
          data.push(response.data?.tongTien || 0);
        } catch (err) {
          data.push(0);
        }
      }

      setChartData({
        labels: years.map(year => year.toString()),
        datasets: [{
          label: 'Doanh thu (VND)',
          data,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.4,
          fill: true,
        }]
      });
    } catch (error) {
      console.error('Error fetching yearly chart data:', error);
    }
  };

  // Cập nhật useEffect
  useEffect(() => {
    if (viewType === 'day') {
      fetchDailyStats(selectedDate);
    } else if (viewType === 'month') {
      fetchMonthlyStats(selectedYear, selectedMonth);
    } else {
      fetchYearlyStats(selectedYear);
    }
  }, [selectedYear, selectedMonth, selectedDate, viewType]);

  // Cập nhật useEffect để fetch tổng doanh thu khi component mount
  useEffect(() => {
    fetchTotalRevenue();
  }, []);

  // Cập nhật useEffect để load dữ liệu biểu đồ
  useEffect(() => {
    if (viewType === 'month') {
      updateMonthlyChartData(selectedYear);
    } else if (viewType === 'year') {
      updateYearlyChartData();
    }
  }, [viewType, selectedYear]);

  // Tạo danh sách năm từ 2020 đến năm hiện tại
  const yearOptions = Array.from(
    { length: currentDate.getFullYear() - 2020 + 1 }, 
    (_, i) => 2020 + i
  ).filter(year => year <= currentDate.getFullYear());

  // Tạo danh sách tháng dựa trên năm được chọn
  const getMonthOptions = (year) => {
    const months = [
      { value: 1, label: "Tháng 1" },
      { value: 2, label: "Tháng 2" },
      { value: 3, label: "Tháng 3" },
      { value: 4, label: "Tháng 4" },
      { value: 5, label: "Tháng 5" },
      { value: 6, label: "Tháng 6" },
      { value: 7, label: "Tháng 7" },
      { value: 8, label: "Tháng 8" },
      { value: 9, label: "Tháng 9" },
      { value: 10, label: "Tháng 10" },
      { value: 11, label: "Tháng 11" },
      { value: 12, label: "Tháng 12" }
    ];

    // Nếu là năm hiện tại, chỉ hiển thị các tháng đến tháng hiện tại
    if (year === currentDate.getFullYear()) {
      return months.filter(month => month.value <= currentDate.getMonth() + 1);
    }
    return months;
  };

  // Xử lý khi thay đổi năm
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
    
    // Nếu đang chọn tháng lớn hơn tháng hiện tại của năm hiện tại
    if (newYear === currentDate.getFullYear() && selectedMonth > currentDate.getMonth() + 1) {
      setSelectedMonth(currentDate.getMonth() + 1);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <NavbarAdmin />
      <main className="flex-1 p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Thống kê doanh thu</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Ngày hiện tại: {currentDate.toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
                <p className="text-sm opacity-90 mb-1">Tổng doanh thu</p>
                <p className="text-2xl font-bold">
                  {totalRevenue.toLocaleString('vi-VN')} VND
                </p>
              </div>
            </div>
          </div>

          {/* View Type Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex gap-2">
                {['day', 'month', 'year'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    className={`px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                      viewType === type
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type === 'day' ? 'Theo ngày' : type === 'month' ? 'Theo tháng' : 'Theo năm'}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                {viewType === 'day' ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Chọn ngày:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      max={currentDate.toISOString().split('T')[0]}
                      className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Năm:</span>
                      <select 
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      >
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    
                    {viewType === 'month' && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">Tháng:</span>
                        <select 
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        >
                          {getMonthOptions(selectedYear).map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {viewType === 'day' ? 'Doanh thu ngày' : 
                   viewType === 'month' ? `Doanh thu tháng ${selectedMonth}/${selectedYear}` :
                   `Doanh thu năm ${selectedYear}`}
                </h3>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  Thống kê
                </span>
              </div>
              <p className={`text-3xl font-bold ${
                viewType === 'day' ? 
                  (dailyStats ? 'text-green-600' : 'text-orange-500') :
                viewType === 'month' ?
                  (monthlyStats ? 'text-green-600' : 'text-orange-500') :
                  'text-green-600'
              }`}>
                {viewType === 'day' ? 
                  (dailyStats ? `${dailyStats.tongTien.toLocaleString('vi-VN')}` : '0') :
                viewType === 'month' ?
                  (monthlyStats ? `${monthlyStats.tongTien.toLocaleString('vi-VN')}` : '0') :
                  (yearlyStats ? yearlyStats.tongTien.toLocaleString('vi-VN') : '0')} VND
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Thời gian</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  Khoảng thời gian
                </span>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {viewType === 'day' ? 
                  new Date(selectedDate).toLocaleDateString('vi-VN') :
                viewType === 'month' ?
                  (monthlyStats ? monthlyStats.mocTG : '-') :
                  (yearlyStats ? yearlyStats.mocTG : '-')}
              </p>
            </div>
          </div>

          {/* Warning Message */}
          {((viewType === 'day' && !dailyStats) || (viewType === 'month' && !monthlyStats)) && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-orange-700">
                  {viewType === 'day' ? 
                    `Ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')} chưa có doanh thu!` :
                    `Tháng ${selectedMonth}/${selectedYear} chưa có doanh thu!`}
                </p>
              </div>
            </div>
          )}

          {/* Revenue Chart */}
          {viewType !== 'day' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
