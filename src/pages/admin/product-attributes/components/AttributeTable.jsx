import React from 'react';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';

const AttributeTable = ({ 
  attributes, 
  editingAttribute, 
  setEditingAttribute, 
  handleEdit, 
  handleDelete,
  attributeType,
  showTrash,
  handleRestore
}) => {

  const renderTableHeaders = () => {
    switch(attributeType) {
      case 'brand':
        return (
          <>
            <th>Tên thương hiệu</th>
            <th>Trạng thái</th>
          </>
        );
      case 'ram':
        return (
          <>
            <th>Dung lượng (GB)</th>
            <th>Tốc độ (MHz)</th>
            <th>Trạng thái</th>
          </>
        );
      case 'storage':
        return (
          <>
            <th>Dung lượng (GB)</th>
            <th>Loại ổ cứng</th>
            <th>Trạng thái</th>
          </>
        );
      case 'cpu':
        return (
          <>
            <th>Tên CPU</th>
            <th>Hãng sản xuất</th>
            <th>Kiến trúc</th>
            <th>Tốc độ (GHz)</th>
            <th>Nhân/Luồng</th>
            <th>Bộ nhớ đệm (MB)</th>
          </>
        );
      case 'screen':
        return (
          <>
            <th>Độ phân giải</th>
            <th>Tần số quét (Hz)</th>
            <th>Độ sáng (nits)</th>
            <th>Độ phủ màu (%)</th>
            <th>Tấm nền</th>
          </>
        );
      case 'gpu':
        return (
          <>
            <th>Tên GPU</th>
            <th>Hãng sản xuất</th>
            <th>Xung nhịp (MHz)</th>
            <th>VRAM (GB)</th>
            <th>Điện áp (V)</th>
            <th>Kiến trúc</th>
          </>
        );
      case 'graphicsCard':
        return (
          <>
            <th>Tên card đồ họa</th>
            <th>Trạng thái</th>
          </>
        );
      case 'material':
        return (
          <>
            <th>Tên chất liệu</th>
            <th>Trạng thái</th>
          </>
        );
      case 'size':
        return (
          <>
            <th>Kích thước (inch)</th>
            <th>Trạng thái</th>
          </>
        );
      case 'productType':
        return (
          <>
            <th>Tên loại sản phẩm</th>
            <th>Trạng thái</th>
          </>
        );
      case 'color':
        return (
          <>
            <th>Tên màu</th>
            <th>Mã màu</th>
            <th>Màu hiển thị</th>
          </>
        );
      case 'supplier':
        return (
          <>
            <th>Tên nhà cung ứng</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Địa chỉ</th>
            <th>Ghi chú</th>
            <th>Trạng thái</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableCells = (attr) => {
    switch(attributeType) {
      case 'brand':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.ten}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    ten: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.ten
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      case 'ram':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.dungLuong || ''}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    dungLuong: e.target.value ? parseInt(e.target.value) : ''
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.dungLuong
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.tocDo || ''}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tocDo: e.target.value ? parseInt(e.target.value) : ''
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.tocDo
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      case 'storage':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.dungLuong}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    dungLuong: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.dungLuong
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.loaiOCung}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    loaiOCung: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.loaiOCung
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      case 'cpu':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.ten}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    ten: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.ten
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.hangSanXuat}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    hangSanXuat: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.hangSanXuat
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.kienTrucCongNghe}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    kienTrucCongNghe: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.kienTrucCongNghe
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.tocDoToiThieu}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tocDoToiThieu: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.tocDoToiThieu
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.tocDoToiDa}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tocDoToiDa: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.tocDoToiDa
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.boNhoDem}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    boNhoDem: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.boNhoDem
              )}
            </td>
          </>
        );
      case 'screen':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.doPhanGiai}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    doPhanGiai: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.doPhanGiai
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.tanSoQuet}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tanSoQuet: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.tanSoQuet
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.doSang}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    doSang: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.doSang
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.doPhuMau}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    doPhuMau: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.doPhuMau
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.tamNen}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tamNen: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.tamNen
              )}
            </td>
          </>
        );
      case 'gpu':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.ten}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    ten: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.ten
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.hangSanXuat}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    hangSanXuat: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.hangSanXuat
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.xungNhipToiThieu}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    xungNhipToiThieu: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.xungNhipToiThieu
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.xungNhipToiDa}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    xungNhipToiDa: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.xungNhipToiDa
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.vram}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    vram: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.vram
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.dienAp}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    dienAp: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.dienAp
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.kienTrucCongNghe}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    kienTrucCongNghe: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.kienTrucCongNghe
              )}
            </td>
          </>
        );
      case 'graphicsCard':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.tenCard}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tenCard: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.tenCard
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      case 'material':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.tenChatLieu}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tenChatLieu: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.tenChatLieu
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      case 'size':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="number"
                  value={editingAttribute.kichThuoc}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    kichThuoc: parseInt(e.target.value)
                  })}
                  className="w-full border rounded px-2 py-1"
                  min="1"
                />
              ) : (
                attr.kichThuoc
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      case 'productType':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.tenLoai}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tenLoai: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.tenLoai
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      case 'color':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.tenMau}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tenMau: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.tenMau
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.maHex}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    maHex: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.maHex
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div 
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: attr.maHex }}
              />
            </td>
          </>
        );
      case 'supplier':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.tenNhaCungUng}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    tenNhaCungUng: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.tenNhaCungUng
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.sdt}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    sdt: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.sdt
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="email"
                  value={editingAttribute.email}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    email: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.email
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.diaChi}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    diaChi: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.diaChi
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {editingAttribute?.id === attr.id ? (
                <input
                  type="text"
                  value={editingAttribute.ghiChu}
                  onChange={(e) => setEditingAttribute({
                    ...editingAttribute,
                    ghiChu: e.target.value
                  })}
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                attr.ghiChu
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
      default:
        return null;
    }
  };

  const renderActions = (attr) => {
    if ((attributeType === 'brand' || attributeType === 'ram' || attributeType === 'storage' || 
         attributeType === 'cpu' || attributeType === 'screen' || attributeType === 'gpu' || 
         attributeType === 'graphicsCard' || attributeType === 'material' || attributeType === 'size' ||
         attributeType === 'productType' || attributeType === 'color' || attributeType === 'supplier') && showTrash) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleRestore(attr.id)}
            className="text-green-600 hover:text-green-900"
            title="Khôi phục"
          >
            <FaUndo />
          </button>
        </div>
      );
    }

    if (editingAttribute?.id === attr.id) {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(attr.id)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Lưu
          </button>
          <button
            onClick={() => setEditingAttribute(null)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <button
          onClick={() => setEditingAttribute(attr)}
          className="text-blue-600 hover:text-blue-900"
          title="Sửa"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => handleDelete(attr.id)}
          className="text-red-600 hover:text-red-900"
          title="Xóa"
        >
          <FaTrash />
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            {renderTableHeaders()}
            <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {attributes.map((attr) => (
            <tr key={attr.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {attr.id}
              </td>
              {renderTableCells(attr)}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {renderActions(attr)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {attributes.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          Không có dữ liệu
        </div>
      )}
    </div>
  );
};

export default AttributeTable;