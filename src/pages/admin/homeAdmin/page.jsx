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

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu theo tháng',
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
      const response = await axios.get(`http://localhost:8080/rest/thong_ke/thang/${year}-${formattedMonth}`);
      
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
      }
    } catch (error) {
      console.error('Error fetching monthly statistics:', error);
    }
  };

  // Fetch thống kê theo năm
  const fetchYearlyStats = async (year) => {
    try {
      const response = await axios.get(`http://localhost:8080/rest/thong_ke/nam/${year}`);
      setYearlyStats(response.data);
    } catch (error) {
      console.error('Error fetching yearly statistics:', error);
    }
  };

  // Thêm hàm fetch thống kê theo ngày
  const fetchDailyStats = async (date) => {
    try {
      const response = await axios.get(`http://localhost:8080/rest/thong_ke/getToday/${date}`);
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
      const response = await axios.get('http://localhost:8080/rest/thong_ke/tongDoanhThu');
      setTotalRevenue(response.data);
    } catch (error) {
      console.error('Error fetching total revenue:', error);
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
    <div className="min-h-screen flex">
      <NavbarAdmin />
      <main className="flex-1 bg-gray-50 p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Thống kê doanh thu</h2>
            <p className="text-gray-600 mt-1">
              Ngày hiện tại: {currentDate.toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString('vi-VN')} VND
            </p>
          </div>
        </div>

        {/* View Type Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex gap-3">
              <button
                onClick={() => setViewType('day')}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  viewType === 'day'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Theo ngày
              </button>
              <button
                onClick={() => setViewType('month')}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  viewType === 'month'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Theo tháng
              </button>
              <button
                onClick={() => setViewType('year')}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  viewType === 'year'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Theo năm
              </button>
            </div>

            <div className="flex gap-4 items-center">
              {viewType === 'day' ? (
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">Chọn ngày:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={currentDate.toISOString().split('T')[0]}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <label className="font-medium text-gray-700">Năm:</label>
                    <select 
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  
                  {viewType === 'month' && (
                    <div className="flex items-center gap-3">
                      <label className="font-medium text-gray-700">Tháng:</label>
                      <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Statistics Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Chi tiết doanh thu</h3>
          <div className="space-y-6">
            {viewType === 'day' ? (
              <>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Doanh thu ngày</p>
                    <p className={`text-2xl font-bold ${dailyStats ? 'text-green-600' : 'text-orange-500'}`}>
                      {dailyStats ? `${dailyStats.tongTien.toLocaleString('vi-VN')} VND` : 'Chưa có doanh thu'}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Thời gian</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Date(selectedDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                {!dailyStats && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg">
                    <p className="text-center">
                      Ngày {new Date(selectedDate).toLocaleDateString('vi-VN')} chưa bán được sản phẩm nào!
                    </p>
                  </div>
                )}
              </>
            ) : viewType === 'month' ? (
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Doanh thu tháng {selectedMonth}/{selectedYear}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {monthlyStats ? monthlyStats.tongTien.toLocaleString('vi-VN') : '0'} VND
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Thời gian</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {monthlyStats ? monthlyStats.mocTG : '-'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Doanh thu năm {selectedYear}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {yearlyStats ? yearlyStats.tongTien.toLocaleString('vi-VN') : '0'} VND
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Năm</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {yearlyStats ? yearlyStats.mocTG : '-'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        {viewType === 'month' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Line data={revenueChartData} options={revenueChartOptions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
