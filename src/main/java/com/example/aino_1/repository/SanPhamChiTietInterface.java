package com.example.aino_1.repository;

//import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamChiTietInterface extends JpaRepository<SanPhamChiTiet, Integer> {


    @Query(
            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, sp.gioiThieu, " +
                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
                    "cpu.ten, spct.maSpct, ha.duongDanHinhAnh, spct.donGia, sp.id" +
                    ") " +
                    "FROM SanPhamChiTiet spct " +
                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
                    "INNER JOIN HinhAnh ha ON ha.sanPham.id = sp.id " +
                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id"
    )
    List<SanPhamChiTietDto> getAllDTO();



    @Query(
            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, sp.gioiThieu, " +
                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
                    "cpu.ten, spct.maSpct, ha.duongDanHinhAnh, spct.donGia,sp.id" +
                    ") " +
                    "FROM SanPhamChiTiet spct " +
                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
                    "INNER JOIN HinhAnh ha ON ha.sanPham.id = sp.id " +
                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
                    "WHERE spct.id = :id"
    )
    SanPhamChiTietDto getSanPhamChiTietById(@Param("id") Integer id);

    @Query("SELECT ha.duongDanHinhAnh FROM SanPhamChiTiet spct " +
            "JOIN SanPham sp on spct.sanPham.id = sp.id JOIN HinhAnh ha on ha.sanPham.id = sp.id  where spct.id = :id")
    List<String> findImagePathsByProductDetailId(@Param("id") Integer id);


}


//    @Query("""
//        SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//        spct.id,
//        spct.donGia,
//        spct.tenSpct,
//        spct.sanPham.hangSanXuat,
//        spct.sanPham.mauSac,
//        spct.sanPham.gioiThieu,
//        spct.ram.dungLuong,
//        spct.oLuuTru.dungLuong,
//        spct.manHinh.doPhanGiai,
//        spct.manHinh.kichThuoc,
//        spct.manHinh.tamNen,
//        spct.manHinh.tanSoQuet,
//        spct.cpu.soNhan,
//        spct.cpu.kienTrucCongNghe,
//        spct.cpu.ten
//        ) FROM SanPhamChiTiet spct
//       WHERE spct.tenSpct LIKE %:tuKhoaTimKiem%
//                   OR spct.cpu.ten LIKE %:tuKhoaTimKiem%
//                   OR spct.manHinh.tamNen LIKE %:tuKhoaTimKiem%
//                   OR CAST(spct.ram.dungLuong AS string) LIKE %:tuKhoaTimKiem%
//                   OR spct.manHinh.doPhanGiai LIKE %:tuKhoaTimKiem%
//                   OR CAST(spct.manHinh.tanSoQuet AS string) LIKE %:tuKhoaTimKiem%
//                   OR CAST(spct.cpu.boNhoDem AS string) LIKE %:tuKhoaTimKiem%
//                   OR spct.sanPham.gioiThieu LIKE %:tuKhoaTimKiem%
//
//""")
//    List<SanPhamChiTietDto> timSanPhamTheoTuKhoa(@Param("tuKhoaTimKiem") String tuKhoaTimKiem);
//    @Query("""
//        SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//        spct.id,
//        spct.donGia,
//        spct.tenSpct,
//        spct.sanPham.hangSanXuat,
//        spct.sanPham.gioiThieu,
//        spct.ram.dungLuong,
//        spct.oLuuTru.dungLuong,
//        spct.manHinh.doPhanGiai,
//        spct.manHinh.kichThuoc,
//        spct.manHinh.tamNen,
//        spct.manHinh.tanSoQuet,
//        spct.cpu.soNhan,
//        spct.cpu.kienTrucCongNghe,
//        spct.cpu.ten
//        ) FROM SanPhamChiTiet spct
//       WHERE spct.donGia between :minPrice and :maxPrice
//
//""")
//    List<SanPhamChiTietDto> locTheoGia(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
//    @Query("""
//        SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//        spct.id,
//        spct.donGia,
//        spct.tenSpct,
//        spct.sanPham.hangSanXuat,
//        spct.sanPham.mauSac,
//        spct.sanPham.gioiThieu,
//        spct.ram.dungLuong,
//        spct.oLuuTru.dungLuong,
//        spct.manHinh.doPhanGiai,
//        spct.manHinh.kichThuoc,
//        spct.manHinh.tamNen,
//        spct.manHinh.tanSoQuet,
//        spct.cpu.soNhan,
//        spct.cpu.kienTrucCongNghe,
//        spct.cpu.ten
//        ) FROM SanPhamChiTiet spct
//       WHERE spct.ram.dungLuong = :dungLuongRam
//
//""")
//    List<SanPhamChiTietDto> locTheoDungLuongRam(@Param("dungLuongRam") Integer dungLuongRam);
//    @Query("""
//        SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//        spct.id,
//        spct.donGia,
//        spct.tenSpct,
//        spct.sanPham.hangSanXuat,
//        spct.sanPham.mauSac,
//        spct.sanPham.gioiThieu,
//        spct.ram.dungLuong,
//        spct.oLuuTru.dungLuong,
//        spct.manHinh.doPhanGiai,
//        spct.manHinh.kichThuoc,
//        spct.manHinh.tamNen,
//        spct.manHinh.tanSoQuet,
//        spct.cpu.soNhan,
//        spct.cpu.kienTrucCongNghe,
//        spct.cpu.ten
//        ) FROM SanPhamChiTiet spct
//       WHERE spct.sanPham.hangSanXuat = :hangSanXuat
//
//""")
//    List<SanPhamChiTietDto> locTheoHangSanXuat(@Param("hangSanXuat") String hangSanXuat);
//    @Query("""
//        SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//        spct.id,
//        spct.donGia,
//        spct.tenSpct,
//        spct.sanPham.hangSanXuat,
//        spct.sanPham.mauSac,
//        spct.sanPham.gioiThieu,
//        spct.ram.dungLuong,
//        spct.oLuuTru.dungLuong,
//        spct.manHinh.doPhanGiai,
//        spct.manHinh.kichThuoc,
//        spct.manHinh.tamNen,
//        spct.manHinh.tanSoQuet,
//        spct.cpu.soNhan,
//        spct.cpu.kienTrucCongNghe,
//        spct.cpu.ten
//        ) FROM SanPhamChiTiet spct
//       WHERE spct.manHinh.tamNen = :tamNen
//
//""")
//    List<SanPhamChiTietDto> locTheoTamNen(@Param("tamNen") String tamNen);
//    @Query("""
//        SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//        spct.id,
//        spct.donGia,
//        spct.tenSpct,
//        spct.sanPham.hangSanXuat,
//        spct.sanPham.mauSac,
//        spct.sanPham.gioiThieu,
//        spct.ram.dungLuong,
//        spct.oLuuTru.dungLuong,
//        spct.manHinh.doPhanGiai,
//        spct.manHinh.kichThuoc,
//        spct.manHinh.tamNen,
//        spct.manHinh.tanSoQuet,
//        spct.cpu.soNhan,
//        spct.cpu.kienTrucCongNghe,
//        spct.cpu.ten
//        ) FROM SanPhamChiTiet spct
//       WHERE spct.cpu.kienTrucCongNghe = :congNgheCPU
//
//""")
//    List<SanPhamChiTietDto> locTheoCongNgheCPU(@Param("congNgheCPU") String congNgheCPU);
//    @Query("""
//        SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//        spct.id,
//        spct.donGia,
//        spct.tenSpct,
//        spct.sanPham.hangSanXuat,
//        spct.sanPham.mauSac,
//        spct.sanPham.gioiThieu,
//        spct.ram.dungLuong,
//        spct.oLuuTru.dungLuong,
//        spct.manHinh.doPhanGiai,
//        spct.manHinh.kichThuoc,
//        spct.manHinh.tamNen,
//        spct.manHinh.tanSoQuet,
//        spct.cpu.soNhan,
//        spct.cpu.kienTrucCongNghe,
//        spct.cpu.ten
//        ) FROM SanPhamChiTiet spct
//       WHERE spct.manHinh.kichThuoc = :kichThuoc
//
//""")
//    List<SanPhamChiTietDto> locTheoKichThuoc(@Param("kichThuoc") Double kichThuoc);
//}
