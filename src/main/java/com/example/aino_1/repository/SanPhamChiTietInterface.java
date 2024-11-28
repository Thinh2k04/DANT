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
            "SELECT  new com.example.aino_1.dto.SanPhamChiTietDto(" +
                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu,spct.gioiThieu, " +
                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
                    "cpu.ten, spct.maSpct, " +
                    "spct.hinhAnhMinhHoa, " +
                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong , sp.pin, sp.thoiHanBaoHanh" +
                    ") " +
                    "FROM SanPhamChiTiet spct " +
                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id "
    )
    List<SanPhamChiTietDto> getAllDTO();


    @Query(
            "SELECT  new com.example.aino_1.dto.SanPhamChiTietDto(" +
                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu, " +
                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
                    "cpu.ten, spct.maSpct,  " +
                    "spct.hinhAnhMinhHoa, " +
                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong, sp.pin, sp.thoiHanBaoHanh" +
                    ") " +
                    "FROM SanPhamChiTiet spct " +
                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
                    " where spct.id = :id"
    )
    SanPhamChiTietDto getSanPhamChiTietById(@Param("id") Integer id);


    @Query("SELECT ha.duongDanHinhAnh FROM SanPhamChiTiet spct " +
            "JOIN HinhAnh ha on ha.sanPhamChiTiet.id = spct.id  where spct.id = :id")
    List<String> findImagePathsByProductDetailId(@Param("id") Integer id);
}


//    @Query(
//            """
//                    SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(
//                    spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,,
//                    ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
//                    mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
//                    cpu.ten, spct.maSpct,
//                    spct.hinhAnhMinhHoa,
//                    spct.donGia, sp.id, gpu.ten, sp.trongLuong
//                    )
//                    FROM SanPhamChiTiet spct
//                    JOIN SanPham sp ON spct.sanPham.id = sp.id
//                    INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
//                    INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
//                    INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
//                    INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
//                    INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
//                    INNER JOIN Ram ram ON ram.id = spct.ram.id
//                    INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
//                    INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
//                    INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
//                    WHERE sp.tenSanPham LIKE %:tuKhoaTimKiem%
//                    OR sp.gioiThieu LIKE %:tuKhoaTimKiem%
//                    OR CAST(ram.dungLuong AS string) LIKE %:tuKhoaTimKiem%
//                    OR CAST(olt.dungLuong AS string) LIKE %:tuKhoaTimKiem%
//                    OR mh.doPhanGiai LIKE %:tuKhoaTimKiem%
//                    OR CAST(ktlt.kichThuoc AS string) LIKE %:tuKhoaTimKiem%
//                    OR mh.tamNen LIKE %:tuKhoaTimKiem%
//                    OR CAST(mh.tanSoQuet AS string) LIKE %:tuKhoaTimKiem%
//                    OR CAST(cpu.soNhan AS string) LIKE %:tuKhoaTimKiem%
//                    OR spct.maSpct LIKE %:tuKhoaTimKiem%
//                    OR cpu.ten LIKE %:tuKhoaTimKiem%
//                    """)
//    List<SanPhamChiTietDto> timSanPhamTheoTuKhoa(@Param("tuKhoaTimKiem") String tuKhoaTimKiem);
//
//    @Query(
//            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
//                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu, " +
//                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
//                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
//                    "cpu.ten, spct.maSpct, " +
//                    "spct.hinhAnhMinhHoa, " +
//                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong" +
//                    ") " +
//                    "FROM SanPhamChiTiet spct " +
//                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
//                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
//                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
//                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
//                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
//                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
//                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
//                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
//                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
//                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
//                    "WHERE spct.donGia between :minPrice and :maxPrice "
//    )
//    List<SanPhamChiTietDto> locTheoGia(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
//
//    @Query(
//            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
//                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu, " +
//                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
//                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
//                    "cpu.ten, spct.maSpct, " +
//                    "spct.hinhAnhMinhHoa, " +
//                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong" +
//                    ") " +
//                    "FROM SanPhamChiTiet spct " +
//                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
//                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
//                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
//                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
//                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
//                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
//                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
//                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
//                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
//                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
//                    "WHERE ram.dungLuong = :dungLuongRam "
//    )
//    List<SanPhamChiTietDto> locTheoDungLuongRam(@Param("dungLuongRam") Integer dungLuongRam);
//
//    @Query(
//            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
//                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu, " +
//                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
//                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
//                    "cpu.ten, spct.maSpct, " +
//                    "spct.hinhAnhMinhHoa, " +
//                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong" +
//                    ") " +
//                    "FROM SanPhamChiTiet spct " +
//                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
//                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
//                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
//                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
//                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
//                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
//                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
//                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
//                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
//                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
//                    "WHERE spct.sanPham.nguonNhap.tenNhaCungUng = :hangSanXuat"
//    )
//    List<SanPhamChiTietDto> locTheoHangSanXuat(@Param("hangSanXuat") String hangSanXuat);
//
//    @Query(
//            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
//                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu, " +
//                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
//                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
//                    "cpu.ten, spct.maSpct, " +
//                    "spct.hinhAnhMinhHoa, " +
//                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong" +
//                    ") " +
//                    "FROM SanPhamChiTiet spct " +
//                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
//                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
//                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
//                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
//                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
//                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
//                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
//                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
//                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
//                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
//                    "WHERE mh.tamNen = :tamNen"
//    )
//    List<SanPhamChiTietDto> locTheoTamNen(@Param("tamNen") String tamNen);
//    @Query(
//            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
//                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu, " +
//                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
//                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
//                    "cpu.ten, spct.maSpct, " +
//                    "spct.hinhAnhMinhHoa, " +
//                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong" +
//                    ") " +
//                    "FROM SanPhamChiTiet spct " +
//                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
//                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
//                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
//                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
//                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
//                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
//                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
//                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
//                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
//                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
//                    "WHERE cpu.kienTrucCongNghe = :congNgheCPU"
//    )
//    List<SanPhamChiTietDto> locTheoCongNgheCPU(@Param("congNgheCPU") String congNgheCPU);
//    @Query(
//            "SELECT DISTINCT new com.example.aino_1.dto.SanPhamChiTietDto(" +
//                    "spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu, " +
//                    "ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc, " +
//                    "mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe, " +
//                    "cpu.ten, spct.maSpct, " +
//                    "spct.hinhAnhMinhHoa, " +
//                    "spct.donGia, sp.id, gpu.ten, sp.trongLuong" +
//                    ") " +
//                    "FROM SanPhamChiTiet spct " +
//                    "JOIN SanPham sp ON spct.sanPham.id = sp.id " +
//                    "INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id " +
//                    "INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id " +
//                    "INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id " +
//                    "INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id " +
//                    "INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id " +
//                    "INNER JOIN Ram ram ON ram.id = spct.ram.id " +
//                    "INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id " +
//                    "INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id " +
//                    "INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id " +
//                    "WHERE ktlt.kichThuoc = :kichThuoc"
//    )
//    List<SanPhamChiTietDto> locTheoKichThuoc(@Param("kichThuoc") Double kichThuoc);
//}
