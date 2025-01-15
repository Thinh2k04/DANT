// Import các thư viện cần thiết
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Hook điều hướng trang
import { toast } from 'react-toastify'; // Thông báo toast
import 'react-toastify/dist/ReactToastify.css'; // Style cho toast
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa'; // Icons
import { motion } from 'framer-motion'; // Animation
import axios from 'axios'; // HTTP client

const LoginPage = () => {
  // Các state quản lý form
  const [showPassword, setShowPassword] = useState(false); // Hiển thị/ẩn mật khẩu
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  }); // Dữ liệu form
  const [errors, setErrors] = useState({}); // Lỗi validation
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [loginAttempts, setLoginAttempts] = useState(0); // Số lần đăng nhập thất bại
  const [funnyMessage, setFunnyMessage] = useState(''); // Thông điệp vui nhộn

  const navigate = useNavigate();

  // Mảng thông điệp vui nhộn
  const funnyMessages = [
    "Chào mừng bạn đến với thế giới công nghệ cao cấp 💻",
    "Khám phá những chiếc laptop đẳng cấp cùng chúng tôi ✨",
    "Trải nghiệm công nghệ đỉnh cao chỉ một chạm 🚀",
    "Đăng nhập để khám phá bộ sưu tập laptop độc đáo 🌟",
    "Công nghệ hiện đại, giá trị đích thực 💎"
  ];


  // Effect xử lý khi component mount
  useEffect(() => {
    // Kiểm tra thông tin đăng nhập đã lưu
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { username, rememberMe } = JSON.parse(savedCredentials);
      setFormData(prev => ({
        ...prev,
        username,
        rememberMe
      }));
    }

    // Easter egg - Xử lý chuỗi phím đặc biệt
    const easterEggSequence = "↑↑↓↓←→←→BA";
    let keys = '';
    const handleKeydown = (e) => {
      keys += e.key;
      if (keys.length > easterEggSequence.length) {
        keys = keys.slice(1);
      }
      if (keys.includes(easterEggSequence)) {
        toast.info('🎮 Cheat code activated! Nhưng vẫn phải đăng nhập bình thường nhé 😅', {
          position: "top-center",
          autoClose: 3000
        });
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Kiểm tra form hợp lệ
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập đâu rồi? 🤔";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu đâu rồi bạn ơi? 🔑";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu ngắn quá! Thêm vài ký tự nữa đi 📏";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setLoginAttempts(prev => prev + 1);
      if (loginAttempts > 2) {
        setFunnyMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
      }
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API đăng nhập
      const response = await fetch('http://localhost:8080/rest/tai_khoan/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      console.log('Tên đăng nhập: ' + data.username)

      if (response.ok) {
        // Lưu thông tin đăng nhập nếu chọn "Remember me"
        if (formData.rememberMe) {
          localStorage.setItem('savedCredentials', JSON.stringify({
            username: formData.username,
            rememberMe: true
          }));
        } else {
          localStorage.removeItem('savedCredentials');
        }

        // Lưu token và thông tin người dùng
        localStorage.setItem('Authorization', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username);
        
        // Lưu thông tin user với format phù hợp cho timeline
        localStorage.setItem('userInfo', JSON.stringify({
          username: data.username,
          role: data.role === 'ADMIN' ? 'Admin' : 'User'  // Format role cho đúng với API timeline
        }));

        // Cấu hình axios header
        axios.defaults.headers.common['Authorization'] = `${data.token}`;
        
        // Thông báo thành công
        toast.success('🎉 Đăng nhập thành công! Chào mừng trở lại! 💖', {
          position: "top-center",
          autoClose: 1500,
        });

        // Chuyển hướng theo role
        setTimeout(() => {
          if (data.role === 'ADMIN') {
            navigate('/admin');
          } else if (data.role === 'USER') {
            navigate('/home');
          }
        }, 1500);
      } else {
        setLoginAttempts(prev => prev + 1);
        toast.error('Sai mất rồi! Kiểm tra lại thông tin nha 🔍', {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Oops! Có gì đó không ổn. Thử lại nhé! 🛠️', {
        position: "top-center"
      });
    } finally {
      setIsLoading(false);
    }
  };





  // Render giao diện
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      <div className="max-w-md w-full mx-4">
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6"
        >
          {/* Phần logo và tiêu đề */}
          <div className="text-center space-y-2">
            <motion.div
              className="relative w-40 h-40 mx-auto"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src="https://res.cloudinary.com/dmtek0eaq/image/upload/v1736695132/aahoalljunxjpdy65uqu.png"
                alt="Premium Laptop Store"
                className="w-full h-full object-contain"
                initial={{ rotate: 0 }}
                animate={{ 
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -inset-4"
                style={{
                  background: "radial-gradient(circle, rgba(88,28,135,0.2), rgba(30,41,59,0.2))",
                  filter: "blur(20px)",
                  zIndex: -1
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-800 to-slate-900 bg-clip-text text-transparent">
              Premium Laptop Store
            </h1>
            <p className="text-sm text-gray-600 font-medium">Đẳng Cấp - Công Nghệ - Sang Trọng</p>
            {funnyMessage && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 italic font-light"
              >
                {funnyMessage}
              </motion.p>
            )}
          </div>

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input username */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaUser className="text-purple-800" />
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-800 focus:border-transparent transition bg-gray-50"
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && (
                <motion.p 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {errors.username}
                </motion.p>
              )}
            </motion.div>

            {/* Input password */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaLock className="text-purple-800" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-800 focus:border-transparent transition bg-gray-50"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-800 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Remember me và Quên mật khẩu */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-800 border-gray-300 rounded focus:ring-purple-800"
                />
                <span className="text-sm text-gray-600">Nhớ tớ nhé! 🤗</span>
              </label>
              <a href="#" className="text-sm text-purple-800 hover:text-purple-900 hover:underline">
                Quên mật khẩu? 😅
              </a>
            </div>

            {/* Nút đăng nhập */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-800 to-slate-900 hover:from-purple-900 hover:to-black'
              } transition duration-300 shadow-lg`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSignInAlt />
                  </motion.div>
                  Đang xử lý...
                </div>
              ) : (
                <>
                  <FaSignInAlt />
                  Đăng nhập nào!
                </>
              )}
            </motion.button>
          </form>

          {/* Link đăng ký */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản? {' '}
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="/register" 
                className="text-purple-800 hover:text-purple-900 font-medium"
              >
                Tham gia ngay
              </motion.a>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
