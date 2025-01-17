"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarAdmin from '../Navbar/NavbarAdmin'

export default function EmployeePage() {
  const token = localStorage.getItem('Authorization'); // Lấy token từ localStorage
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    hoTen: '',
    diaChi: '',
    soCCCD: '',
    soDienThoai: ''
  })
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    hoTen: '',
    diaChi: '',
    soCCCD: '',
    soDienThoai: ''
  })
  const [formError, setFormError] = useState('')

  const validateForm = () => {
    let errors = {
      username: '',
      email: '',
      password: '',
      hoTen: '',
      diaChi: '',
      soCCCD: '',
      soDienThoai: ''
    }
    let isValid = true

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Tên đăng nhập không được để trống'
      isValid = false
    } else if (formData.username.length < 3) {
      errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự'
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống'
      isValid = false
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Email không hợp lệ'
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Mật khẩu không được để trống'
      isValid = false
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      isValid = false
    }

    // Full name validation
    if (!formData.hoTen.trim()) {
      errors.hoTen = 'Họ tên không được để trống'
      isValid = false
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.hoTen)) {
      errors.hoTen = 'Họ tên chỉ được chứa chữ cái và khoảng trắng'
      isValid = false
    }

    // Address validation
    if (!formData.diaChi.trim()) {
      errors.diaChi = 'Địa chỉ không được để trống'
      isValid = false
    }

    // ID Card validation
    if (!formData.soCCCD.trim()) {
      errors.soCCCD = 'Số CCCD không được để trống'
      isValid = false
    } else if (!/^\d{12}$/.test(formData.soCCCD)) {
      errors.soCCCD = 'Số CCCD phải có đúng 12 chữ số'
      isValid = false
    }

    // Phone number validation
    if (!formData.soDienThoai.trim()) {
      errors.soDienThoai = 'Số điện thoại không được để trống'
      isValid = false
    } else if (!/^(0[0-9]{9})$/.test(formData.soDienThoai)) {
      errors.soDienThoai = 'Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 chữ số)'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    try {
      setIsLoading(true)
      await axios.post('http://localhost:8080/rest/tai_khoan/registerForStaff', formData)
      // Refresh employee list
      const response = await axios.get('http://localhost:8080/rest/tai_khoan/getAllNhanVien')
      setEmployees(response.data)
      setIsModalOpen(false)
      setFormData({
        username: '',
        email: '',
        password: '',
        hoTen: '',
        diaChi: '',
        soCCCD: '',
        soDienThoai: ''
      })
      setFormErrors({
        username: '',
        email: '',
        password: '',
        hoTen: '',
        diaChi: '',
        soCCCD: '',
        soDienThoai: ''
      })
      setFormError('')
    } catch (error) {
      console.error('Error creating employee:', error)
      setFormError('Không thể tạo nhân viên. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get('http://localhost:8080/rest/tai_khoan/getAllNhanVien')
        setEmployees(response.data)
        setError(null)
      } catch (error) {
        console.error('Error fetching employees:', error)
        setError('Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <NavbarAdmin />
      <div className="flex-1 p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý nhân viên</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý và phân quyền nhân viên trong hệ thống</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm nhân viên mới
              </button>
            </div>
          </div>

          {/* Modal for adding new employee */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Thêm nhân viên mới</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {formError && (
                  <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.username && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      name="hoTen"
                      value={formData.hoTen}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.hoTen ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.hoTen && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.hoTen}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      name="diaChi"
                      value={formData.diaChi}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.diaChi ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.diaChi && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.diaChi}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số CCCD</label>
                    <input
                      type="text"
                      name="soCCCD"
                      value={formData.soCCCD}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.soCCCD ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.soCCCD && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.soCCCD}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 border ${formErrors.soDienThoai ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    {formErrors.soDienThoai && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.soDienThoai}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang xử lý...' : 'Thêm nhân viên'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-4">
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Tất cả chức vụ</option>
                  <option value="manager">Quản lý</option>
                  <option value="staff">Nhân viên</option>
                </select>
                <select className="text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Trạng thái</option>
                  <option value="active">Đang làm việc</option>
                  <option value="inactive">Đã nghỉ việc</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">{employee.hoTen.charAt(0)}</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.hoTen}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            {employee.chucVu}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Đang làm việc
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              <span className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Sửa
                              </span>
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <span className="flex items-center bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
