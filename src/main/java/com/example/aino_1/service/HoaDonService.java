package com.example.aino_1.service;


import com.example.aino_1.entity.*;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

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

    @Autowired
    ImeiService imeiService;

    @Autowired
    GioHangChiTietInterface gioHangChiTietInterface;

    @Autowired
    ThongTinTaiKhoaninterface thongTinTaiKhoaninterface;

    @Autowired
    OrderCodeGenerator orderCodeGenerator;

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

            // Lưu thông tin tài khoản vào hóa đơn
            ThongTinTaiKhoan tttkSaveToDB = tttksi.save(tttk);
            hd.setThongTinTaiKhoan(tttkSaveToDB);

            // Lưu voucher vào hóa đơn (nếu có)
            hd.setVoucher(voucher);

            String maHoaDon = orderCodeGenerator.generateUniqueOrderCode();
            hd.setMaHoaDon(maHoaDon);

            // Lưu hóa đơn
            HoaDon savedHoaDon = hdsi.save(hd);

            for (HoaDonChiTiet hdct : lhdct) {
                Integer idSanPhamChiTiet = hdct.getSanPhamChiTiet().getId();
                Integer soLuong = hdct.getSoLuong();

                // Lấy danh sách IMEI khả dụng
                List<Imei> listImei = imeiRepository.findAllBySpctIdAndTrangThai(idSanPhamChiTiet, 0);
                if (soLuong > listImei.size()) {
                    throw new RuntimeException("Số lượng IMEI cho sản phẩm ID: " + idSanPhamChiTiet + " không đủ, hiện còn: " + listImei.size());
                }

                hdct.setHoaDon(savedHoaDon);
                HoaDonChiTiet hdcts = hdctsi.save(hdct);

                // Gán IMEI cho chi tiết hóa đơn và cập nhật trạng thái
                List<Imei> imeisToUpdate = listImei.subList(0, soLuong);
                for (Imei imei : imeisToUpdate) {
                    imei.setTrangThai(1); // Đã bán
                    imei.setHdct(hdcts); // Gắn IMEI với hóa đơn chi tiết
                    imeiRepository.save(imei); // Lưu trạng thái mới và liên kết
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
                    "hoaDon", savedHoaDon
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

}
