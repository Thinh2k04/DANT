import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [funnyMessage, setFunnyMessage] = useState('');

  const navigate = useNavigate();

  const funnyMessages = [
    "Đừng lo, ai cũng quên mật khẩu... trừ tôi 😎",
    "Bạn gõ sai mật khẩu nhiều quá, máy tính sắp khóc rồi 😢", 
    "Thử lại nào! Tôi tin bạn có thể làm được 💪",
    "Có vẻ như hôm nay không phải ngày may mắn của bạn 🎲",
    "Mật khẩu đúng ở ngay đây thôi, cố lên! 🎯"
  ];

  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { username, rememberMe } = JSON.parse(savedCredentials);
      setFormData(prev => ({
        ...prev,
        username,
        rememberMe
      }));
    }

    // Easter egg animation
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

      if (response.ok) {
        if (formData.rememberMe) {
          localStorage.setItem('savedCredentials', JSON.stringify({
            username: formData.username,
            rememberMe: true
          }));
        } else {
          localStorage.removeItem('savedCredentials');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        toast.success('🎉 Chào mừng trở lại! Nhớ bạn ghê 💖', {
          position: "top-center",
          autoClose: 1500,
        });

        setTimeout(() => {
          if (data.role === 'ROLE_ADMIN') {
            navigate('/admin');
          } else {
            navigate('/');
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
    >
      <div className="max-w-md w-full mx-4">
        <motion.div 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 space-y-6"
        >
          <div className="text-center space-y-2">
            <motion.div
              className="relative w-40 h-40 mx-auto"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
              <motion.img
                src="https://i.imgur.com/IXnvGqg.png"
                alt="Laptop Store Logo"
                className="absolute inset-2 object-contain rounded-full bg-white p-2"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -inset-4"
                style={{
                  background: "radial-gradient(circle, rgba(168,85,247,0.4), rgba(236,72,153,0.4))",
                  filter: "blur(20px)",
                  zIndex: -1
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Laptop Store
            </h1>
            <p className="text-sm text-gray-600">Laptop chất lượng - Giá cả hợp lý</p>
            {funnyMessage && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 italic"
              >
                {funnyMessage}
              </motion.p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaUser className="text-purple-500" />
                Tên đăng nhập
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaLock className="text-purple-500" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500 transition"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-600">Nhớ tớ nhé! 🤗</span>
              </label>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-800 hover:underline">
                Quên mật khẩu? 😅
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } transition duration-200`}
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

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản? {' '}
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="/register" 
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Đăng ký ngay! 🚀
              </motion.a>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
