package com.example.aino_1.service;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.*;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class SanPhamService {

    @Autowired
    private ImeiInterface imsi;

    @Autowired
    private SanPhamChiTietInterface spctInterface;

    @Autowired
    private NguonNhapInterface nguonNhapInterface; // Repository cho HinhAnh

    @Autowired
    private ChatLieuInterface chatLieuInterface; // Repository cho HinhAnh

    @Autowired
    private SanPhamInterface spsi;

    @Autowired
    private SanPhamChiTietInterface spctsi;

    @Autowired
    private HinhAnhInterface hasi;


    @Autowired
    private KichThuocLaptopInterface kichThuocLaptopInterface; // Repository cho HinhAnh

    @Autowired
    private LoaiSanPhamInterface loaiSanPhamInterface; // Repository cho HinhAnh

    @Autowired
    private HinhAnhInterface hinhAnhInterface; // Repository cho HinhAnh


    public Boolean addSanPham(SanPhamChiTiet spct, SanPham sp, List<String> urlImg) {
        try {
            // Bước 1: Lưu sản phẩm
            if (sp == null) {
                throw new IllegalArgumentException("Thông tin sản phẩm không được để trống.");
            }
            SanPham savedSanPham = spsi.save(sp);

            // Bước 2: Liên kết sản phẩm với sản phẩm chi tiết và lưu
            if (spct == null) {
                throw new IllegalArgumentException("Thông tin sản phẩm chi tiết không được để trống.");
            }
            spct.setTrangThai(2);
            spct.setSanPham(savedSanPham);
            SanPhamChiTiet savedSanPhamCT = spctsi.save(spct);

            // Bước 3: Lưu hình ảnh nếu danh sách URL không rỗng
            if (urlImg != null && !urlImg.isEmpty()) {
                for (String url : urlImg) {
                    if (url != null && !url.isEmpty()) {
                        HinhAnh hinhAnh = new HinhAnh();
                        hinhAnh.setDuongDanHinhAnh(url);
                        hinhAnh.setSanPhamChiTiet(savedSanPhamCT);
                        hasi.save(hinhAnh);
                    }
                }
            }

            return true; // Thành công
        } catch (Exception e) {
            // Ghi log lỗi (nếu có hệ thống log)
            System.err.println("Lỗi khi thêm sản phẩm: " + e.getMessage());
            return false; // Thất bại
        }
    }

    public List<SanPham> getListForHome(){
        List<SanPham> listsp = spsi.findAll();
        List<SanPham> listSpHome = new ArrayList<>();
        for (SanPham sp : listsp
        ) {
            if(sp.getTrangThai() == 1){
                listSpHome.add(sp);
            }
        }
        return listSpHome;
    }

    public List<SanPham> getListThungRac(){
        List<SanPham> listsp = spsi.findAll();
        List<SanPham> listSpHome = new ArrayList<>();
        for (SanPham sp : listsp
        ) {
            if(sp.getTrangThai() == 0){
                listSpHome.add(sp);
            }
        }
        return listSpHome;
    }


}

