import React, { useState, useEffect } from 'react';
import { FaTimes, FaFileExcel, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ImeiModal = ({ isOpen, onClose, selectedVariant }) => {
  const [imeis, setImeis] = useState([]);
  const [isManualInput, setIsManualInput] = useState(true);
  const [imeiStatus, setImeiStatus] = useState(null);

  useEffect(() => {
    if (selectedVariant) {
      checkImeiStatus();
    }
  }, [selectedVariant]);

  const checkImeiStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/rest/imei/checkidSPCT/${selectedVariant.id}`);
      const data = response.data;
      setImeiStatus(data);
      
      if (data.success) {
        const emptyImeis = Array(data.soLuongBoSung).fill('');
        setImeis(emptyImeis);
        
        if (data.soLuongBoSung > 0) {
          toast.info(data.message);
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái IMEI:', error);
      toast.error('Có lỗi xảy ra khi kiểm tra IMEI');
    }
  };

  const handleImeiChange = (index, value) => {
    const newImeis = [...imeis];
    newImeis[index] = value;
    setImeis(newImeis);
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const excelImeis = data.slice(1).flat()
          .filter(imei => imei)
          .map(String);

        if (excelImeis.length === 0) {
          toast.error('Không tìm thấy IMEI trong file Excel');
          return;
        }

        if (excelImeis.length > selectedVariant.soLuong) {
          toast.error(`Số lượng IMEI (${excelImeis.length}) vượt quá số lượng sản phẩm (${selectedVariant.soLuong})`);
          return;
        }

        setImeis(excelImeis);
        setIsManualInput(false);
        toast.success('Đã tải IMEI từ file Excel');
      } catch (error) {
        console.error('Error reading Excel:', error);
        toast.error('Lỗi khi đọc file Excel');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (imeis.some(imei => !imei.trim())) {
      toast.error('Vui lòng nhập đầy đủ IMEI');
      return;
    }

    const uniqueImeis = new Set(imeis);
    if (uniqueImeis.size !== imeis.length) {
      toast.error('Có IMEI bị trùng lặp');
      return;
    }

    try {
      const payload = {
        spct: {
          id: selectedVariant.id
        },
        listImei: imeis.map(imei => ({
          id: "",
          imei: imei.trim(),
          hdct: null,
          trangThai: 1
        }))
      };

      const response = await axios.post('http://localhost:8080/rest/imei/createOrUpdate', payload);
      
      if (response.data.success) {
        toast.success('Thêm IMEI thành công');
        onClose();
        setImeis([]);
      } else {
        toast.error(response.data.message || 'Thêm IMEI thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi thêm IMEI:', error);
      toast.error('Có lỗi xảy ra khi thêm IMEI');
    }
  };

  const downloadTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      const wsData = [
        ['IMEI'],
        ['Ví dụ: IMEI123456789'],
        ['']
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      XLSX.utils.book_append_sheet(wb, ws, 'Template IMEI');

      XLSX.writeFile(wb, `Template_IMEI_${selectedVariant?.maSpct || 'template'}.xlsx`);
      
      toast.success('Đã tải xuống template Excel');
    } catch (error) {
      console.error('Lỗi khi tạo template:', error);
      toast.error('Có lỗi xảy ra khi tải template');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">
              Thêm IMEI cho sản phẩm {selectedVariant?.maSpct}
            </h3>
            {imeiStatus && (
              <p className={`text-sm mt-1 ${imeiStatus.soLuongBoSung > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                {imeiStatus.message}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setIsManualInput(true)}
              className={`px-4 py-2 rounded ${
                isManualInput 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Nhập thủ công
            </button>
            
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
            >
              <FaDownload /> Tải template Excel
            </button>

            <label className={`px-4 py-2 rounded cursor-pointer ${
              !isManualInput 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}>
              <FaFileExcel className="inline mr-2" />
              Nhập từ Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleExcelUpload}
              />
            </label>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Hướng dẫn nhập IMEI:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Tải template Excel mẫu bằng cách click vào nút "Tải template Excel"</li>
              <li>Mỗi IMEI nên được nhập trên một dòng riêng trong cột A</li>
              <li>Không thay đổi cấu trúc của file template</li>
              <li>Số lượng IMEI cần bổ sung: {imeiStatus?.soLuongBoSung || 0}</li>
              <li>Mỗi IMEI phải là duy nhất và không được trùng lặp</li>
            </ul>
          </div>

          {imeiStatus?.soLuongBoSung > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {imeis.map((imei, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">
                      IMEI {index + 1}
                    </label>
                    <input
                      type="text"
                      value={imei}
                      onChange={(e) => handleImeiChange(index, e.target.value)}
                      className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Nhập IMEI ${index + 1}`}
                      disabled={!isManualInput}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-green-500 py-4">
              Đã đủ số lượng IMEI cho sản phẩm này
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Hủy
          </button>
          {imeiStatus?.soLuongBoSung > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lưu
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImeiModal; 