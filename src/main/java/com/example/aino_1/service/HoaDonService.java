package com.example.aino_1.service;


import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.*;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class HoaDonService {

    @Autowired
    ThongTinTaiKhoaninterface tttksi;

    @Autowired
    HoaDonInterface hdsi;

    @Autowired
    HDCTInterFace hdctsi;


    @Autowired
    VoucherInterface vcsi;

    @Autowired
    TaiKhoanNguoiDungInterface tksi;

    @Autowired
    ImeiInterface imeiRepository;

    @Lazy
    @Autowired
    ImeiService imeiService;

    @Autowired
    GioHangChiTietInterface gioHangChiTietInterface;

    @Autowired
    ThongTinTaiKhoaninterface thongTinTaiKhoaninterface;

    @Autowired
    HinhThucThanhToanInterface hinhThucThanhToanInterface;

    @Autowired
    OrderCodeGenerator orderCodeGenerator;

    @Autowired
    SanPhamChiTietInterface sanPhamChiTietInterface;

    @Autowired
    SanPhamChiTietService sanPhamChiTietService;

    @Transactional
    public Map<String, Object> hamXuLiHoaDon(String username, ThongTinTaiKhoan tttk, HoaDon hd, List<HoaDonChiTiet> lhdct, Voucher voucher) {
        try {
            if (username == null) {
                System.out.println("Người dùng không đăng nhập mua hàng.");
            } else {
                // Lấy tài khoản người dùng từ username
                TaiKhoanNguoiDung tknd = tksi.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với username: " + username));
                // Gắn tài khoản người dùng vào thông tin tài khoản
                tttk.setTaiKhoanNguoiDung(tknd);
                System.out.println("Người dùng " + username + " đăng nhập mua hàng.");
            }

            HinhThucThanhToan httt = hinhThucThanhToanInterface.findByid(hd.getHinhThucThanhToan().getId());
            hd.setHinhThucThanhToan(httt);

            // Lưu thông tin tài khoản vào hóa đơn
            ThongTinTaiKhoan tttkSaveToDB = tttksi.save(tttk);
            hd.setThongTinTaiKhoan(tttkSaveToDB);

            // Lưu voucher vào hóa đơn (nếu có)
            hd.setVoucher(voucher);

            String maHoaDon = orderCodeGenerator.generateUniqueOrderCode();
            hd.setMaHoaDon(maHoaDon);

            // Lưu hóa đơn
            HoaDon savedHoaDon = hdsi.save(hd);

            List<SanPhamChiTietDto> listspctFeetback = new ArrayList<>();

            for (HoaDonChiTiet hdct : lhdct) {
                Integer idSanPhamChiTiet = hdct.getSanPhamChiTiet().getId();
                String tenSPCT  = sanPhamChiTietService.getSanPhamChiTietById(idSanPhamChiTiet).getTenSanPhamChiTiet();
                Integer soLuong = hdct.getSoLuong();

                // Lấy danh sách IMEI khả dụng
                List<Imei> listImei = imeiRepository.findAllBySpctIdAndTrangThai(idSanPhamChiTiet, 0);
                if (soLuong > listImei.size()) {
                    return Map.of(
                            "success", false,
                            "message", "Chúng tôi chân thành xin lỗi, số lượng sản phẩm " + tenSPCT + "bạn yêu cầu không đủ. Hiện chỉ còn " + listImei.size() + " sản phẩm khả dụng."
                    );
                }

                hdct.setHoaDon(savedHoaDon);
                HoaDonChiTiet hdcts = hdctsi.save(hdct);
                int idSPCT = hdcts.getSanPhamChiTiet().getId();

                SanPhamChiTietDto spctDTO = sanPhamChiTietService.getSanPhamChiTietById(idSPCT);

                if (spctDTO != null) {
                    spctDTO.setSoLuong(hdcts.getSoLuong());
                    listspctFeetback.add(spctDTO);
                    System.out.println("Số lượng là: " + spctDTO.getSoLuong());
                } else {
                    System.err.println("Không tìm thấy sản phẩm có ID: " + idSPCT);
                }

                // Gán IMEI cho chi tiết hóa đơn và cập nhật trạng thái
                List<Imei> imeisToUpdate = listImei.subList(0, soLuong);
                for (Imei imei : imeisToUpdate) {
                    imei.setTrangThai(1); // Đã bán
                    imei.setHdct(hdcts); // Gắn IMEI với hóa đơn chi tiết
                    imeiRepository.save(imei); // Lưu trạng thái mới và liên kết
                }

                // Hàm chuyển trang_thái = 0 nếu như hết hàng
                if (imeiService.checkTinhTrang(idSanPhamChiTiet)) {
                    System.out.println("chạy hàm kiểm tra hết hàng");
                    // Cập nhật trạng thái sản phẩm chi tiết thành 0 (hết hàng)
                    SanPhamChiTiet spct = sanPhamChiTietInterface.findById(idSanPhamChiTiet)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm chi tiết với ID: " + idSanPhamChiTiet));
                    spct.setTrangThai(0); // Đặt trạng thái thành hết hàng
                    sanPhamChiTietInterface.save(spct);
                    System.out.println("Đã cập nhật trạng thái sản phẩm chi tiết ID: " + idSanPhamChiTiet + " thành hết hàng.");
                }

                // Nếu người dùng đăng nhập, xóa giỏ hàng chi tiết
                if (username != null) {
                    GioHangChiTiet ghctUser = gioHangChiTietInterface.findGioHangChiTietByTaiKhoanNguoiDungUsernameAndSanPhamChiTiet_Id(username, idSanPhamChiTiet);
                    if (ghctUser != null) {
                        gioHangChiTietInterface.delete(ghctUser);
                    }
                }
            }

            // Trả về trạng thái thành công và thông tin hóa đơn
            return Map.of(
                    "success", true,
                    "hoaDon", savedHoaDon,
                    "listHDCT", listspctFeetback
            );

        } catch (Exception e) {
            e.printStackTrace();
            // Trả về trạng thái thất bại và thông báo lỗi
            return Map.of(
                    "success", false,
                    "message", e.getMessage()
            );
        }
    }

    public Object traCuuDonHang(String soDienThoai, String maHoaDon) {
        // Trường hợp tìm kiếm chỉ theo mã hóa đơn
        if (maHoaDon != null && !maHoaDon.isBlank() && (soDienThoai == null || soDienThoai.isBlank())) {
            HoaDon hoaDon = hdsi.findHoaDonByMaHoaDon(maHoaDon);
            if (hoaDon == null) {
                throw new NoSuchElementException("Không tìm thấy hóa đơn với mã: " + maHoaDon);
            }
            return hoaDon;
        }

        // Trường hợp tìm kiếm theo cả số điện thoại và mã hóa đơn
        if (soDienThoai != null && !soDienThoai.isBlank() && maHoaDon != null && !maHoaDon.isBlank()) {
            List<HoaDon> listHoaDon = hdsi.findHoaDonByThongTinTaiKhoan_SoDienThoai(soDienThoai);
            if (listHoaDon.isEmpty()) {
                throw new NoSuchElementException("Không tìm thấy hóa đơn với số điện thoại: " + soDienThoai);
            }

            // Lọc kết quả theo mã hóa đơn
            return listHoaDon.stream()
                    .filter(hoaDon -> hoaDon.getMaHoaDon().equals(maHoaDon))
                    .findFirst()
                    .orElseThrow(() -> new NoSuchElementException(
                            "Không tìm thấy hóa đơn với mã: " + maHoaDon + " trong danh sách hóa đơn của số điện thoại: " + soDienThoai));
        }

        // Trường hợp không hợp lệ (không xảy ra nhưng để an toàn)
        throw new IllegalArgumentException("Dữ liệu đầu vào không hợp lệ.");
    }


}
