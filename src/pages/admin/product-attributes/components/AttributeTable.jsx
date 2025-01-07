import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AttributeTable = ({ 
  attributes, 
  editingAttribute, 
  setEditingAttribute, 
  handleEdit, 
  handleDelete,
  activeTab 
}) => {
  const isBrandTab = activeTab === 'thuongHieu';
  const isRamTab = activeTab === 'ram';
  const isStorageTab = activeTab === 'oCung';
  const isCpuTab = activeTab === 'cpu';
  const isManHinhTab = activeTab === 'manHinh';
  const isGpuTab = activeTab === 'gpu';
  const isCardDoHoaTab = activeTab === 'cardManHinh';
  const isChatLieuTab = activeTab === 'chatLieu';
  const isKichThuocTab = activeTab === 'kichThuoc';
  const isLoaiSanPhamTab = activeTab === 'loaisanpham';
  const isMauSacTab = activeTab === 'mausac';
  const isNguonNhapTab = activeTab === 'nguon';

  if (!isBrandTab && !isRamTab && !isStorageTab && !isCpuTab && !isManHinhTab && !isGpuTab && !isCardDoHoaTab && !isChatLieuTab && !isKichThuocTab && !isLoaiSanPhamTab && !isMauSacTab && !isNguonNhapTab) return null;

  const renderTableHeaders = () => {
    if (activeTab === 'kichThuoc') {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kích thước (inch)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </>
      );
    }
    if (activeTab === 'chatLieu') {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên chất liệu
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </>
      );
    }
    if (activeTab === 'cardManHinh') {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên Card đồ họa
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </>
      );
    }
    if (activeTab === 'gpu') {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên GPU
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Hãng sản xuất
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Xung nhịp (MHz)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            VRAM (GB)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Điện áp (V)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kiến trúc
          </th>
        </>
      );
    } else if (activeTab === 'cpu') {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên CPU
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Hãng sản xuất
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kiến trúc
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tốc độ (GHz)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nhân/Luồng
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Bộ nhớ đệm (MB)
          </th>
        </>
      );
    } else if (activeTab === 'oCung') {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Dung lượng (GB)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Loại ổ cứng
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </>
      );
    } else if (isBrandTab) {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên thương hiệu
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </>
      );
    } else if (isRamTab) {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Dung lượng (GB)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tốc độ (MHz)
          </th>
        </>
      );
    } else if (isManHinhTab) {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Độ phân giải
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tần số quét (Hz)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Độ sáng (nits)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Độ phủ màu (%)
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tấm nền
          </th>
        </>
      );
    } else if (isLoaiSanPhamTab) {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên loại sản phẩm
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </>
      );
    } else if (isMauSacTab) {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên màu
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Mã màu
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Màu hiển thị
          </th>
        </>
      );
    } else if (isNguonNhapTab) {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên nhà cung ứng
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Số điện thoại
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Địa chỉ
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ghi chú
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Trạng thái
          </th>
        </>
      );
    }
  };

  const renderTableCells = (attr) => {
    if (activeTab === 'kichThuoc') {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.kichThuoc}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  kichThuoc: parseFloat(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập kích thước"
                step="0.1"
                min="0"
              />
            ) : (
              attr.kichThuoc
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <select
                value={editingAttribute.trangThai}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  trangThai: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            ) : (
              attr.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'
            )}
          </td>
        </>
      );
    }
    if (activeTab === 'chatLieu') {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.tenChatLieu}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tenChatLieu: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập tên chất liệu"
              />
            ) : (
              attr.tenChatLieu
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {attr.trangThai === null ? 'Chưa có' : attr.trangThai}
          </td>
        </>
      );
    }
    if (activeTab === 'cardManHinh') {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.tenCard}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tenCard: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập tên card đồ họa"
              />
            ) : (
              attr.tenCard
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {attr.trangThai === null ? 'Chưa có' : attr.trangThai}
          </td>
        </>
      );
    }
    if (activeTab === 'gpu') {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.ten}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  ten: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="VD: RTX 3080"
              />
            ) : (
              attr.ten
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.hangSanXuat}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  hangSanXuat: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="VD: NVIDIA"
              />
            ) : (
              attr.hangSanXuat
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  value={editingAttribute.xungNhipToiThieu}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    xungNhipToiThieu: parseInt(e.target.value)
                  })}
                  className="border rounded px-2 py-1 w-20"
                  min="0"
                />
                <span>-</span>
                <input
                  type="number"
                  value={editingAttribute.xungNhipToiDa}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    xungNhipToiDa: parseInt(e.target.value)
                  })}
                  className="border rounded px-2 py-1 w-20"
                  min="0"
                />
              </div>
            ) : (
              `${attr.xungNhipToiThieu} - ${attr.xungNhipToiDa}`
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.vram}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  vram: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="1"
              />
            ) : (
              attr.vram
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.dienAp}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  dienAp: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="0"
              />
            ) : (
              attr.dienAp
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.kienTrucCongNghe}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  kienTrucCongNghe: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="VD: Ampere"
              />
            ) : (
              attr.kienTrucCongNghe
            )}
          </td>
        </>
      );
    } else if (activeTab === 'cpu') {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.ten}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  ten: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              attr.ten
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.hangSanXuat}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  hangSanXuat: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              attr.hangSanXuat
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.kienTrucCongNghe}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  kienTrucCongNghe: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              attr.kienTrucCongNghe
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  value={editingAttribute.tocDoToiThieu}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tocDoToiThieu: parseFloat(e.target.value)
                  })}
                  className="border rounded px-2 py-1 w-20"
                  min="0"
                  step="0.1"
                />
                <span>-</span>
                <input
                  type="number"
                  value={editingAttribute.tocDoToiDa}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tocDoToiDa: parseFloat(e.target.value)
                  })}
                  className="border rounded px-2 py-1 w-20"
                  min="0"
                  step="0.1"
                />
              </div>
            ) : (
              `${attr.tocDoToiThieu} - ${attr.tocDoToiDa}`
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  value={editingAttribute.soNhan}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    soNhan: parseInt(e.target.value)
                  })}
                  className="border rounded px-2 py-1 w-20"
                  min="1"
                />
                <span>/</span>
                <input
                  type="number"
                  value={editingAttribute.soLuong}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    soLuong: parseInt(e.target.value)
                  })}
                  className="border rounded px-2 py-1 w-20"
                  min="1"
                />
              </div>
            ) : (
              `${attr.soNhan}/${attr.soLuong}`
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.boNhoDem}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  boNhoDem: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="1"
              />
            ) : (
              attr.boNhoDem
            )}
          </td>
        </>
      );
    } else if (activeTab === 'oCung') {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.dungLuong}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  dungLuong: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="1"
              />
            ) : (
              attr.dungLuong
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <select
                value={editingAttribute.loaiOCung}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  loaiOCung: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="SSD">SSD</option>
                <option value="HDD">HDD</option>
              </select>
            ) : (
              attr.loaiOCung
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {attr.trangThai === null ? 'Chưa có' : attr.trangThai}
          </td>
        </>
      );
    } else if (isBrandTab) {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.ten}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  ten: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              attr.ten
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <select
                value={editingAttribute.trangThai}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  trangThai: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            ) : (
              attr.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'
            )}
          </td>
        </>
      );
    } else if (isRamTab) {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.dungLuong}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  dungLuong: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="1"
              />
            ) : (
              attr.dungLuong
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.tocDo}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tocDo: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="1"
              />
            ) : (
              attr.tocDo
            )}
          </td>
        </>
      );
    } else if (isManHinhTab) {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.doPhanGiai}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  doPhanGiai: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="VD: 1920x1080"
              />
            ) : (
              attr.doPhanGiai
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.tanSoQuet}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tanSoQuet: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="0"
              />
            ) : (
              attr.tanSoQuet
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.doSang}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  doSang: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="0"
              />
            ) : (
              attr.doSang
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="number"
                value={editingAttribute.doPhuMau}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  doPhuMau: parseFloat(e.target.value)
                })}
                className="border rounded px-2 py-1 w-full"
                min="0"
                max="1"
                step="0.1"
              />
            ) : (
              `${(attr.doPhuMau * 100).toFixed(0)}%`
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <select
                value={editingAttribute.tamNen}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tamNen: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="IPS">IPS</option>
                <option value="VA">VA</option>
                <option value="TN">TN</option>
                <option value="OLED">OLED</option>
              </select>
            ) : (
              attr.tamNen
            )}
          </td>
        </>
      );
    } else if (isLoaiSanPhamTab) {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.tenLoai}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tenLoai: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập tên loại sản phẩm"
              />
            ) : (
              attr.tenLoai
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <select
                value={editingAttribute.trangThai}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  trangThai: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            ) : (
              attr.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'
            )}
          </td>
        </>
      );
    } else if (isMauSacTab) {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.tenMau}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tenMau: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập tên màu"
              />
            ) : (
              attr.tenMau
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.maHex}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  maHex: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập mã màu (VD: #000000)"
              />
            ) : (
              attr.maHex
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div 
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: attr.maHex }}
            />
          </td>
        </>
      );
    } else if (isNguonNhapTab) {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.tenNhaCungUng}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  tenNhaCungUng: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập tên nhà cung ứng"
              />
            ) : (
              attr.tenNhaCungUng
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.sdt}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  sdt: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập số điện thoại"
              />
            ) : (
              attr.sdt
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="email"
                value={editingAttribute.email}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  email: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập email"
              />
            ) : (
              attr.email
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <input
                type="text"
                value={editingAttribute.diaChi}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  diaChi: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập địa chỉ"
              />
            ) : (
              attr.diaChi
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <textarea
                value={editingAttribute.ghiChu}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  ghiChu: e.target.value
                })}
                className="border rounded px-2 py-1 w-full"
                placeholder="Nhập ghi chú"
                rows="2"
              />
            ) : (
              attr.ghiChu
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingAttribute?.id === attr.id ? (
              <select
                value={editingAttribute.trangThai}
                onChange={(e) => setEditingAttribute({
                  ...editingAttribute,
                  trangThai: parseInt(e.target.value)
                })}
                className="border rounded px-2 py-1"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            ) : (
              attr.trangThai === 1 ? 'Hoạt động' : 'Không hoạt động'
            )}
          </td>
        </>
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            {renderTableHeaders()}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attributes.map((attr) => (
            <tr key={attr.id}>
              <td className="px-6 py-4 whitespace-nowrap">{attr.id}</td>
              {renderTableCells(attr)}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  {editingAttribute?.id === attr.id ? (
                    <>
                      <button
                        onClick={() => handleEdit(attr.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingAttribute(null)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingAttribute(attr)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(attr.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeTable;