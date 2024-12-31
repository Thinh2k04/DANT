import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "", 
    confirmPassword: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState(0);
  const navigate = useNavigate();

  const funnyPlaceholders = {
    username: [
      "Siêu nhân Gao đã có người lấy rồi 😅",
      "Doremon có phải bạn không? 🤖",
      "Tên càng độc đáo càng tốt! 🌟"
    ],
    password: [
      "Mật khẩu mạnh như Hulk nhé! 💪",
      "123456 là một ý tưởng tồi đấy 😅",
      "Đừng đặt là password nhé! 🙈"
    ],
    email: [
      "batman@gotham.com đã có người đăng ký rồi 🦇",
      "ironman@stark.com cũng không được đâu 🤖",
      "Email thật thôi nhé! ✉️"
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Tính toán tiến độ đăng ký
    const fields = ['username', 'password', 'confirmPassword', 'email'];
    const filledFields = fields.filter(field => formData[field].length > 0).length;
    setRegistrationProgress((filledFields / fields.length) * 100);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập đâu rồi bạn ơi? 🤔";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên ngắn quá, thêm vài ký tự nữa đi! 📏";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu đâu? Đừng bảo quên đặt! 🔑";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu yếu quá! Thêm cho nó mạnh lên 💪";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu giúp mình nhé! 🎯";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hai mật khẩu không giống nhau kìa! 🤦‍♂️";
    }

    if (!formData.email) {
      newErrors.email = "Email quan trọng lắm đó! 📧";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ! Kiểm tra lại nào 🔍";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error('Ôi không! Có gì đó sai sai... 🤔', {
        position: "top-center",
        autoClose: 2000
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/rest/tai_khoan/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email
        })
      });

      if (response.ok) {
        toast.success('🎉 Chúc mừng! Bạn đã chính thức gia nhập đội quân của chúng tôi!', {
          position: "top-center",
          autoClose: 2000
        });
        
        // Animation trước khi chuyển trang
        setTimeout(() => {
          toast.info('🚀 Chuẩn bị cất cánh đến trang đăng nhập...', {
            position: "top-center",
            autoClose: 1500
          });
        }, 1000);
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Oops! Có gì đó không ổn 😅', {
          position: "top-center", 
          autoClose: 3000
        });
      }
    } catch (error) {
      toast.error('Máy chủ đang ngủ quên rồi! 😴', {
        position: "top-center",
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300">
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Tham gia cùng chúng tôi! 🚀
          </motion.h2>
          <div className="relative h-2 bg-gray-200 rounded-full mb-6">
            <motion.div 
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${registrationProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 border-b-2 border-transparent hover:border-blue-600"
            >
              Đăng nhập ngay nào! 🎮
            </motion.a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field */}
          <motion.div 
            className="relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder={funnyPlaceholders.username[Math.floor(Math.random() * funnyPlaceholders.username.length)]}
            />
            {errors.username && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <span className="inline-block animate-bounce">⚠️</span>
                {errors.username}
              </motion.p>
            )}
          </motion.div>

          {/* Password field */}
          <motion.div 
            className="relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaLock className="text-blue-600" />
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder={funnyPlaceholders.password[Math.floor(Math.random() * funnyPlaceholders.password.length)]}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </motion.button>
            </div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <span className="inline-block animate-bounce">⚠️</span>
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Confirm Password field */}
          <motion.div 
            className="relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaLock className="text-blue-600" />
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder="Nhập lại mật khẩu giống như trên nhé! 🎯"
            />
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <span className="inline-block animate-bounce">⚠️</span>
                {errors.confirmPassword}
              </motion.p>
            )}
          </motion.div>

          {/* Email field */}
          <motion.div 
            className="relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaEnvelope className="text-blue-600" />
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`block w-full px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              placeholder={funnyPlaceholders.email[Math.floor(Math.random() * funnyPlaceholders.email.length)]}
            />
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 flex items-center gap-1"
              >
                <span className="inline-block animate-bounce">⚠️</span>
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            } transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang xử lý...
              </>
            ) : (
              <>
                <FaRocket className="text-xl" />
                Bắt đầu hành trình! 🚀
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
