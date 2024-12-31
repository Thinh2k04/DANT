package com.example.aino_1.repository;

//import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.SanPhamChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface SanPhamChiTietInterface extends JpaRepository<SanPhamChiTiet, Integer> {


    @Query(
            """
                    SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
                        spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
                        ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
                        mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
                        cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
                        sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
                        CONCAT(
                           'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
                        )
                    )
                    FROM SanPhamChiTiet spct
                    JOIN SanPham sp ON spct.sanPham.id = sp.id
                    INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
                    INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
                    INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
                    INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
                    INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
                    INNER JOIN Ram ram ON ram.id = spct.ram.id
                    INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
                    INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
                    INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
                    inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id
                
                    """
    )
    List<SanPhamChiTietDto> getAllDTO();


    @Query(
            """
                SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
                    spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
                    ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
                    mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
                    cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
                    sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
                    CONCAT(
                        'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
                    )
                )
                    FROM SanPhamChiTiet spct
                    JOIN SanPham sp ON spct.sanPham.id = sp.id
                    INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
                    INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
                    INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
                    INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
                    INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
                    INNER JOIN Ram ram ON ram.id = spct.ram.id
                    INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
                    INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
                    INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
                    inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id
                where spct.id = :id
                """
    )
    SanPhamChiTietDto getSanPhamChiTietById(@Param("id") Integer id);

    @Query(
            """
                SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
                spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
                ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
                mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
                cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
                sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
                CONCAT(
                'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
                )
                )
                    FROM SanPhamChiTiet spct
                    JOIN SanPham sp ON spct.sanPham.id = sp.id
                    INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
                    INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
                    INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
                    INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
                    INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
                    INNER JOIN Ram ram ON ram.id = spct.ram.id
                    INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
                    INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
                    INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
                    inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id                                                  
                where sp.id = :id
                 """
    )
    ArrayList<SanPhamChiTietDto> getSanPhamChiTietByIdSP(@Param("id") Integer id);

    @Query("SELECT ha.duongDanHinhAnh FROM SanPhamChiTiet spct " +
            "JOIN HinhAnh ha on ha.sanPhamChiTiet.id = spct.id  where spct.id = :id")
    List<String> findImagePathsByProductDetailId(@Param("id") Integer id);


    @Query(
            """
                SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
                spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
                ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
                mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
                cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
                sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
                CONCAT(
                'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
                )
                )
                FROM SanPhamChiTiet spct
                JOIN SanPham sp ON spct.sanPham.id = sp.id
                INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
                INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
                INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
                INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
                INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
                INNER JOIN Ram ram ON ram.id = spct.ram.id
                INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
                INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
                INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
                inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id
                WHERE sp.tenSanPham LIKE %:tuKhoaTimKiem%
                OR spct.gioiThieu LIKE %:tuKhoaTimKiem%
                OR CAST(ram.dungLuong AS string) LIKE %:tuKhoaTimKiem%
                OR CAST(olt.dungLuong AS string) LIKE %:tuKhoaTimKiem%
                OR mh.doPhanGiai LIKE %:tuKhoaTimKiem%
                OR CAST(ktlt.kichThuoc AS string) LIKE %:tuKhoaTimKiem%
                OR mh.tamNen LIKE %:tuKhoaTimKiem%
                OR CAST(mh.tanSoQuet AS string) LIKE %:tuKhoaTimKiem%
                OR CAST(cpu.soNhan AS string) LIKE %:tuKhoaTimKiem%
                OR spct.maSpct LIKE %:tuKhoaTimKiem%
                OR cpu.ten LIKE %:tuKhoaTimKiem%
                OR CONCAT(
                            'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
                        ) LIKE %:tuKhoaTimKiem%
                    """)
    List<SanPhamChiTietDto> timSanPhamTheoTuKhoa(@Param("tuKhoaTimKiem") String tuKhoaTimKiem);


    @Query(
            """
                    SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
                        spct.id,
                        spct.soLuong,
                        sp.tenSanPham,
                        cl.tenChatLieu,
                        spct.gioiThieu,
                        ram.dungLuong,
                        olt.dungLuong,
                        mh.doPhanGiai,
                        ktlt.kichThuoc,
                        mh.tamNen,
                        mh.tanSoQuet,
                        cpu.soNhan,
                        gpu.kienTrucCongNghe,
                        cpu.ten,
                        spct.maSpct,
                        spct.hinhAnhMinhHoa,
                        spct.donGia,
                        sp.id,
                        gpu.ten,
                        sp.trongLuong,
                        sp.pin,
                        sp.thoiHanBaoHanh,
                        spct.trangThai,
                        thuongHieu.ten,
                        CONCAT(
                            'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
                            ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
                            ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
                        )
                    )
                    FROM SanPhamChiTiet spct
                    JOIN SanPham sp ON spct.sanPham.id = sp.id
                    JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
                    JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
                    JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
                    JOIN ManHinh mh ON mh.id = spct.manHinh.id
                    JOIN Ram ram ON ram.id = spct.ram.id
                    JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
                    JOIN Cpu cpu ON cpu.id = spct.cpu.id
                    JOIN Gpu gpu ON gpu.id = spct.gpu.id
                    JOIN ThuongHieu thuongHieu ON thuongHieu.id = sp.thuongHieu.id
                    WHERE (:minPrice IS NULL OR spct.donGia >= :minPrice)
                          AND (:maxPrice IS NULL OR spct.donGia <= :maxPrice)
                          AND (:hangSanXuat IS NULL OR thuongHieu.id = :hangSanXuat)
                          AND (:oLuuTru IS NULL OR olt.id = :oLuuTru)
                          AND (:congNgheCPU IS NULL OR cpu.id = :congNgheCPU)
                          AND (:ram IS NULL OR ram.id = :ram)                                        
"""
    )
    List<SanPhamChiTietDto> loc(
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("hangSanXuat") Integer hangSanXuat,
            @Param("oLuuTru") Integer oLuuTru,
            @Param("congNgheCPU") Integer congNgheCPU,
            @Param("ram") Integer ram
    );

//    @Query(
//            """
//                    SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//                    spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
//                    ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
//                    mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
//                    cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
//                    sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
//                    CONCAT(
//                        'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
//                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
//                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
//                    )
//                    )
//                    FROM SanPhamChiTiet spct
//                     JOIN SanPham sp ON spct.sanPham.id = sp.id
//                     INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
//                     INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
//                     INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
//                     INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
//                     INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
//                     INNER JOIN Ram ram ON ram.id = spct.ram.id
//                     INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
//                     INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
//                     INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
//                     inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id
//                    WHERE thuongHieu.ten = :hangSanXuat
//
//"""
//    )
//    List<SanPhamChiTietDto> locTheoHangSanXuat(@Param("hangSanXuat") String hangSanXuat);
//
//    @Query(
//            """
//            SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//            spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
//            ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
//            mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
//            cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
//            sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
//                CONCAT(
//                        'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
//                ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
//                ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
//                )
//            )
//            FROM SanPhamChiTiet spct
//            JOIN SanPham sp ON spct.sanPham.id = sp.id
//            INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
//            INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
//            INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
//            INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
//            INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
//            INNER JOIN Ram ram ON ram.id = spct.ram.id
//            INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
//            INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
//            INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
//            inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id
//            WHERE olt.dungLuong = :oLuuTru
//    """
//    )
//    List<SanPhamChiTietDto> locTheoOLuuTru(@Param("oLuuTru") Integer oLuuTru);
//
//    @Query(
//            """
//                    SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//                    spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
//                    ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
//                    mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
//                    cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
//                    sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
//                    CONCAT(
//                        'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
//                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
//                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
//                    )
//                    )
//                    FROM SanPhamChiTiet spct
//                     JOIN SanPham sp ON spct.sanPham.id = sp.id
//                     INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
//                     INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
//                     INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
//                     INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
//                     INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
//                     INNER JOIN Ram ram ON ram.id = spct.ram.id
//                     INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
//                     INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
//                     INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
//                     inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id
//                    WHERE cpu.ten = :congNgheCPU
//                    """
//    )
//    List<SanPhamChiTietDto> locTheoCongNgheCPU(@Param("congNgheCPU") String congNgheCPU);
//
//    @Query(
//            """
//                    SELECT new com.example.aino_1.dto.SanPhamChiTietDto(
//                    spct.id, spct.soLuong, sp.tenSanPham, cl.tenChatLieu, spct.gioiThieu,
//                    ram.dungLuong, olt.dungLuong, mh.doPhanGiai, ktlt.kichThuoc,
//                    mh.tamNen, mh.tanSoQuet, cpu.soNhan, gpu.kienTrucCongNghe,
//                    cpu.ten, spct.maSpct, spct.hinhAnhMinhHoa, spct.donGia, sp.id, gpu.ten,
//                    sp.trongLuong, sp.pin, sp.thoiHanBaoHanh, spct.trangThai, thuongHieu.ten,
//                    CONCAT(
//                        'Laptop ', sp.tenSanPham, ' (', cpu.ten, ', ',
//                        ram.dungLuong, 'GB, ', olt.dungLuong, 'GB, ',
//                        ktlt.kichThuoc, ', ', mh.doPhanGiai, ', Win11)'
//                    )
//                    )
//                    FROM SanPhamChiTiet spct
//                     JOIN SanPham sp ON spct.sanPham.id = sp.id
//                     INNER JOIN ChatLieu cl ON cl.id = sp.chatLieu.id
//                     INNER JOIN LoaiSanPham lsp ON lsp.id = sp.loaiSanPham.id
//                     INNER JOIN KichThuocLapTop ktlt ON ktlt.id = sp.kichThuocLaptop.id
//                     INNER JOIN NguonNhap nn ON nn.id = sp.nguonNhap.id
//                     INNER JOIN ManHinh mh ON mh.id = spct.manHinh.id
//                     INNER JOIN Ram ram ON ram.id = spct.ram.id
//                     INNER JOIN OLuuTru olt ON olt.id = spct.oLuuTru.id
//                     INNER JOIN Cpu cpu ON cpu.id = spct.cpu.id
//                     INNER JOIN Gpu gpu ON gpu.id = spct.gpu.id
//                     inner join ThuongHieu thuongHieu on thuongHieu.id = sp.thuongHieu.id
//                    WHERE ram.dungLuong = :ram
//                    """
//    )
//    List<SanPhamChiTietDto> locTheoRam(@Param("ram") Integer ram);
}
