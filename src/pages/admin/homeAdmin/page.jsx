import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../Navbar/NavbarAdmin'; // Import NavbarAdmin

const AdminDashboard = () => {
  const [username, setUsername] = useState(""); // State để lưu tên tài khoản
  const [timeFrame, setTimeFrame] = useState("daily"); // State để lưu khoảng thời gian lọc
  const [filteredSalesData, setFilteredSalesData] = useState({}); // State để lưu dữ liệu bán hàng đã lọc
  const [currentDate, setCurrentDate] = useState(new Date()); // State để lưu ngày hiện tại
  const [selectedDate, setSelectedDate] = useState(currentDate.toISOString().split('T')[0]); // State để lưu ngày đã chọn

  useEffect(() => {
    // Lấy tên tài khoản từ localStorage khi component được render
    const storedUsername = localStorage.getItem("sub");
    if (storedUsername) {
      setUsername(storedUsername);  // Lưu tên tài khoản vào state
    } else {
      console.log("Không tìm thấy tên tài khoản trong localStorage");
    }
  }, []);

  // Fake data for analytics
  const salesData = {
    daily: {
      productsSold: 50,
      totalRevenue: 1000000, // in VND
      newCustomers: 5,
      profitGrowth: 10, // in percentage
      returningCustomers: 3,
      profit: 200000 // in VND
    },
    monthly: {
      productsSold: 150,
      totalRevenue: 3000000, // in VND
      newCustomers: 25,
      profitGrowth: 15, // in percentage
      returningCustomers: 10,
      profit: 500000 // in VND
    },
    yearly: {
      productsSold: 1800,
      totalRevenue: 36000000, // in VND
      newCustomers: 300,
      profitGrowth: 20, // in percentage
      returningCustomers: 150,
      profit: 6000000 // in VND
    }
  };

  useEffect(() => {
    setFilteredSalesData(salesData[timeFrame]); // Cập nhật dữ liệu bán hàng đã lọc theo khoảng thời gian
  }, [timeFrame]);

  // Update current date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    // Logic to filter sales data based on selected date can be added here
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    if (timeFrame === "daily") {
      return maxDate.toISOString().split('T')[0];
    } else if (timeFrame === "monthly") {
      maxDate.setDate(1); // Set to the first day of the month
      return maxDate.toISOString().split('T')[0];
    } else if (timeFrame === "yearly") {
      maxDate.setMonth(0, 1); // Set to the first day of the year
      return maxDate.toISOString().split('T')[0];
    }
    return maxDate.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 3); // 3 years ago
    return minDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen flex">
      <NavbarAdmin /> {/* Gọi NavbarAdmin ở đây */}
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Dashboard</h2>
        
            {/* Current Date Display */}
        <div className="mt-2 text-gray-600">
          <p>Ngày hiện tại: {currentDate.toLocaleDateString()} {currentDate.toLocaleTimeString()}</p>
        </div>
        </div>

        {/* Time Frame Selection */}
        <div className="mt-4">
          <label className="mr-2">Lọc theo:</label>
          <select
            value={timeFrame}
            onChange={(e) => {
              setTimeFrame(e.target.value);
              setSelectedDate(getMaxDate()); // Reset selected date to max date based on time frame
            }}
            className="p-2 border rounded"
          >
            <option value="daily">Hàng ngày</option>
            <option value="monthly">Hàng tháng</option>
            <option value="yearly">Hàng năm</option>
          </select>
        </div>

        {/* Date Selection */}
        <div className="mt-4">
          <label className="mr-2">Chọn ngày:</label>
          {timeFrame === "daily" && (
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={getMinDate()} // Set minimum date to 3 years ago
              max={getMaxDate()} // Set maximum date to current date
              className="p-2 border rounded"
            />
          )}
          {timeFrame === "monthly" && (
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="p-2 border rounded"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={`${new Date().getFullYear()}-${(i + 1).toString().padStart(2, '0')}`}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          )}
          {timeFrame === "yearly" && (
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className="p-2 border rounded"
            >
              {Array.from({ length: 4 }, (_, i) => (
                <option key={i} value={`${new Date().getFullYear() - i}`}>
                  Năm {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          )}
        </div>

      

        {/* Analytics Section */}
        <section className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl">Số sản phẩm đã bán</h3>
              <p className="text-2xl font-bold">{filteredSalesData.productsSold || 0}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl">Tổng doanh thu</h3>
              <p className="text-2xl font-bold">{filteredSalesData.totalRevenue ? filteredSalesData.totalRevenue.toLocaleString() : 0} VND</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl">Số khách hàng mới</h3>
              <p className="text-2xl font-bold">{filteredSalesData.newCustomers || 0}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl">Tăng trưởng lợi nhuận</h3>
              <p className="text-2xl font-bold">{filteredSalesData.profitGrowth || 0}%</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl">Số khách quay lại</h3>
              <p className="text-2xl font-bold">{filteredSalesData.returningCustomers || 0}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl">Lợi nhuận</h3>
              <p className="text-2xl font-bold">{filteredSalesData.profit ? filteredSalesData.profit.toLocaleString() : 0} VND</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold">Sales Analytics</h3>
            <div className="mt-4 h-64 bg-gray-200 flex justify-center items-center">
              <p>Cần api</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
