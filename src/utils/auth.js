import {jwtDecode} from 'jwt-decode';  // Sử dụng đúng cách khi import jwtDecode

const login = async (tenTaiKhoan, matKhau, navigate) => {
  try {
    const response = await fetch('http://localhost:8080/rest/tai_khoan_nguoi_dung/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tenTaiKhoan, matKhau }),
    });

    if (response.status === 401) {
      return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    }

    if (!response.ok) {
      throw new Error(`Đăng nhập thất bại với mã trạng thái: ${response.status}`);
    }

    const token = await response.text();
    if (!token) {
      throw new Error('Không nhận được token từ máy chủ');
    }

    const decodedToken = jwtDecode(token);
    const { roles, sub } = decodedToken;

    if (!roles || !roles.includes('ADMIN')) {
      return { success: false, message: 'Bạn không có quyền truy cập vào trang quản trị' };
    }

    localStorage.setItem('authToken', token);
    localStorage.setItem('sub', sub);

    navigate('/admin');
    return { success: true };

  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error);
    return { success: false, message: 'Đã xảy ra lỗi khi đăng nhập' };
  }
};

export default login;
