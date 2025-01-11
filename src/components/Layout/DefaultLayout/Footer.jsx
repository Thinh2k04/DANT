import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">{t('aboutUs')}</h3>
            <p className="text-gray-300 leading-relaxed">
              Chúng tôi cung cấp các sản phẩm laptop chất lượng cao với dịch vụ khách hàng tuyệt vời. 
              Sự hài lòng của khách hàng là ưu tiên hàng đầu của chúng tôi.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">{t('contactUs')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <MdLocationOn className="text-blue-400 text-xl" />
                <span className="text-gray-300">134/44 Nguyên xa , Bắc từ liêm , Hà Nội</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdPhone className="text-blue-400 text-xl" />
                <span className="text-gray-300">+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                <MdEmail className="text-blue-400 text-xl" />
                <span className="text-gray-300">contact@laptopshop.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">{t('followUs')}</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400">{t('termsConditions')}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Laptop Shop. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
