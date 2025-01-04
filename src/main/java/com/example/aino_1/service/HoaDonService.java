package com.example.aino_1.service;


import com.example.aino_1.entity.*;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

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

    @Transactional
    public String hamXuLiHoaDon(ThongTinTaiKhoan ttk, HoaDon hd, List<HoaDonChiTiet> lhdct, Voucher voucher) {
        // Xử lý thông tin tài khoản
        ThongTinTaiKhoan savedThongTinTaiKhoan;
        if (ttk.getTaiKhoanNguoiDung() == null) {
            savedThongTinTaiKhoan = tttksi.save(ttk);
        } else {
            TaiKhoanNguoiDung savedTaiKhoanNguoiDung = tksi.save(ttk.getTaiKhoanNguoiDung());
            ttk.setTaiKhoanNguoiDung(savedTaiKhoanNguoiDung);
            savedThongTinTaiKhoan = tttksi.save(ttk);
        }
        hd.setThongTinTaiKhoan(savedThongTinTaiKhoan);

        // Xử lý địa chỉ nhận hàng
        if (hd.getDiaChiNhanHang() == null || hd.getDiaChiNhanHang().isEmpty()) {
            String diaChiCuaHang = String.join(" ", hd.getCuaHang().getTinh(), hd.getCuaHang().getHuyen(),
                    hd.getCuaHang().getPhuong(), hd.getCuaHang().getSoNha());
            hd.setDiaChiNhanHang(diaChiCuaHang);
        }

        hd.setVoucher(voucher);
        HoaDon savedHoaDon = hdsi.save(hd);

        // Xử lý danh sách chi tiết hóa đơn
        for (HoaDonChiTiet hdct : lhdct) {
            Integer idSanPhamChiTiet = hdct.getSanPhamChiTiet().getId();
            Integer soLuong = hdct.getSoLuong();

            // Lấy danh sách IMEI theo số lượng yêu cầu
            List<Imei> imeiList = imeiRepository.findTopImeiBySanPhamChiTietIdAndTrangThaiNative(idSanPhamChiTiet);
            if (imeiList.size() < soLuong) {
                throw new RuntimeException("Không đủ IMEI để đáp ứng số lượng yêu cầu cho sản phẩm ID: " + idSanPhamChiTiet);
            }

            // Cập nhật trạng thái của IMEI và liên kết với chi tiết hóa đơn
            for (int i = 0; i < soLuong; i++) {
                imeiList.get(i).setTrangThai(1);
                imeiList.get(i).setHDCT(hdct); // Liên kết IMEI với hóa đơn chi tiết
            }
            imeiRepository.saveAll(imeiList);
            hdct.setHoaDon(savedHoaDon);
            hdctsi.save(hdct);
        }

        return "Hóa đơn và chi tiết hóa đơn đã được xử lý thành công!";
    }

}
