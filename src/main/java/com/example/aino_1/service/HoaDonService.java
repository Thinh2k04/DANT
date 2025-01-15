package com.example.aino_1.service;


import com.example.aino_1.dto.HoaDonChiTietDTO;
import com.example.aino_1.dto.HoaDonDTO;
import com.example.aino_1.dto.ThongTinTaiKhoanDTO;
import com.example.aino_1.dto.TimelineHoaDonDTO;
import com.example.aino_1.entity.*;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
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

    @Autowired
    TimelineHoaDonInterface timelineHoaDonInterface;

    @Transactional
    public Map<String, Object> hamXuLiHoaDon(
            String username, ThongTinTaiKhoan tttk, HoaDon hd, List<HoaDonChiTiet> lhdct, Voucher voucher, List<Imei> listImei) {
        try {
            // Xử lý tài khoản người dùng
            if (username != null) {
                TaiKhoanNguoiDung tknd = tksi.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với username: " + username));
                tttk.setTaiKhoanNguoiDung(tknd);
                System.out.println("Người dùng " + username + " đăng nhập mua hàng.");
            } else {
                System.out.println("Người dùng không đăng nhập mua hàng.");
            }

            // Xử lý hình thức thanh toán
            HinhThucThanhToan httt = hinhThucThanhToanInterface.findByid(hd.getHinhThucThanhToan().getId());
            hd.setHinhThucThanhToan(httt);

            // Lưu thông tin tài khoản vào hóa đơn
            ThongTinTaiKhoan tttkSaveToDB = tttksi.save(tttk);
            hd.setThongTinTaiKhoan(tttkSaveToDB);

            // Lưu voucher (nếu có)
            hd.setVoucher(voucher);

            // Tạo mã hóa đơn và lưu hóa đơn
            String maHoaDon = orderCodeGenerator.generateUniqueOrderCode();
            hd.setMaHoaDon(maHoaDon);
            HoaDon savedHoaDon = hdsi.save(hd);

            // Chuyển đổi HoaDon sang DTO
            HoaDonDTO hoaDonDTO = HoaDonDTO.fromEntity(savedHoaDon);

            List<HoaDonChiTietDTO> listhdctDTO = new ArrayList<>();

            // Xử lý từng chi tiết hóa đơn
            for (HoaDonChiTiet hdct : lhdct) {
                Integer idSanPhamChiTiet = hdct.getSanPhamChiTiet().getId();
                hdct.setHoaDon(savedHoaDon);
                HoaDonChiTiet savedHdct = hdctsi.save(hdct);

                HoaDonChiTietDTO hdctDTO = new HoaDonChiTietDTO();
                hdctDTO.setSoLuong(savedHdct.getSoLuong());
                hdctDTO.setDonGia(savedHdct.getGia());
                hdctDTO.setHinhAnhMinhHoa(hdct.getSanPhamChiTiet().getHinhAnhMinhHoa());
                String tenSanPham = sanPhamChiTietInterface.getSanPhamChiTietById(idSanPhamChiTiet).getTenSanPhamChiTiet();
                hdctDTO.setTenSanPham(tenSanPham);

                // Nếu có IMEI, xử lý danh sách IMEI liên kết
                if (listImei != null && !listImei.isEmpty()) {
                    List<String> imeiCodes = new ArrayList<>();
                    for (Imei imei : listImei) {
                        if (imei.getSpct().getId().equals(idSanPhamChiTiet)) {
                            imei.setHdct(savedHdct); // Gán HoaDonChiTiet đã lưu vào IMEI
                            imei.setTrangThai(1); // Đánh dấu IMEI đã được sử dụng
                            imeiRepository.save(imei); // Lưu IMEI vào cơ sở dữ liệu
                            imeiCodes.add(imei.getImei());
                        }
                    }
                    hdctDTO.setListImei(imeiCodes);
                }

                listhdctDTO.add(hdctDTO);

                // Nếu người dùng đăng nhập, xóa sản phẩm khỏi giỏ hàng
                if (username != null) {
                    GioHangChiTiet ghctUser = gioHangChiTietInterface.findGioHangChiTietByTaiKhoanNguoiDungUsernameAndSanPhamChiTiet_Id(username, idSanPhamChiTiet);
                    if (ghctUser != null) {
                        gioHangChiTietInterface.delete(ghctUser);
                    }
                }
            }

            // Tạo và lưu timeline
            TimelineHoaDon timeline = new TimelineHoaDon();
            timeline.setHoaDon(savedHoaDon);
            timeline.setThoiGianCapNhat(new Timestamp(System.currentTimeMillis()));
            timeline.setNguoiCapNhat(username);

            if (listImei != null && !listImei.isEmpty()) {
                timeline.setTrangThai(1); // Đã xác nhận
                timeline.setLyDo("Đơn hàng đã được xác nhận vì có IMEI.");
            } else {
                timeline.setTrangThai(0); // Chờ xác nhận
                timeline.setLyDo("Chờ xác nhận đơn hàng.");
            }

            timelineHoaDonInterface.save(timeline);

            // Chuyển đổi TimelineHoaDon sang DTO
            TimelineHoaDonDTO timelineDTO = TimelineHoaDonDTO.fromEntity(timeline);

            // Trả về kết quả thành công
            return Map.of(
                    "success", true,
                    "hoaDon", hoaDonDTO, // Trả về hóa đơn dạng DTO
                    "listHDCT", listhdctDTO,
                    "timeline", timelineDTO
            );

        } catch (Exception e) {
            e.printStackTrace();
            // Trả về lỗi
            return Map.of(
                    "success", false,
                    "message", e.getMessage()
            );
        }
    }






    public Map<String, Object> xacNhanDonHang(String maHoaDon, List<Imei> imeiList) {
        // Tìm hóa đơn theo mã hóa đơn
        System.out.println("================"+ maHoaDon);
        HoaDon hd = hdsi.findHoaDonByMaHoaDon(maHoaDon);
        if (hd == null) {
            throw new NoSuchElementException("Không tìm thấy hóa đơn với mã: " + maHoaDon);
        }
        // Lấy danh sách hóa đơn chi tiết của hóa đơn
        List<HoaDonChiTiet> listHoaDonChiTiet = hdctsi.findAllByHoaDon_MaHoaDon(maHoaDon);
        // Tạo lhdctDTO trả về cho fe
        List<HoaDonChiTietDTO> lhdctdto = new ArrayList<>();
        for (HoaDonChiTiet hdct : listHoaDonChiTiet) {
            System.out.println("Chạy vào hàm for xử lí hóa đơn chi tiết");
            int idspct = hdct.getSanPhamChiTiet().getId();
            // Tạo đối tượng HDCTDTO để lưu thông tin chi tiết hóa đơn
            HoaDonChiTietDTO hdctDTO = new HoaDonChiTietDTO();
            hdctDTO.setTenSanPham(sanPhamChiTietInterface.getSanPhamChiTietById(idspct).getTenSanPhamChiTiet());
            hdctDTO.setSoLuong(hdct.getSoLuong());
            hdctDTO.setDonGia(hdct.getSanPhamChiTiet().getDonGia());

            // Xử lý danh sách IMEI liên kết với hóa đơn chi tiết
            List<String> listImeiToHDCTDTO = new ArrayList<>();
            for (Imei imei : imeiList) {
                System.out.println("Chạy hàm for xử lí List Imei");
                if (imei.getSpct().getId() == idspct) {
                    System.out.println("ID spct trong imei trùng với ID SPCT");
                    imei.setHdct(hdct);
                    imei.setTrangThai(1);
                    System.out.println("IMEI được lấy ra là:" + imei.getImei());
                    imeiRepository.save(imei);
                    listImeiToHDCTDTO.add(imei.getImei());
                }
                System.out.println("ID spct trong imei Không trùng với ID SPCT");
            }

            hdctDTO.setListImei(listImeiToHDCTDTO);
            lhdctdto.add(hdctDTO);


            // Kiểm tra và cập nhật trạng thái sản phẩm chi tiết nếu hết hàng
            if (imeiService.checkTinhTrang(idspct)) {
                SanPhamChiTiet spct = sanPhamChiTietInterface.findById(idspct)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm chi tiết với ID: " + idspct));
                spct.setTrangThai(0); // Đặt trạng thái thành hết hàng
                sanPhamChiTietInterface.save(spct);
            }
        }

        // Cập nhật trạng thái hóa đơn là "Đã xác nhận"
        hd.setTrangThai(1);
        hdsi.save(hd);

        // Trả về kết quả
        return Map.of(
                "hoaDon", hd,
                "listHDCTDTO", lhdctdto
        );
    }


    // Hàm tra cứu đơn hàng
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
