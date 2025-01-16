package com.example.aino_1.service;

import com.example.aino_1.dto.SanPhamChiTietDto;
import com.example.aino_1.entity.HinhAnh;
import com.example.aino_1.entity.ProductDiscount;
import com.example.aino_1.entity.SanPham;
import com.example.aino_1.entity.SanPhamChiTiet;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class SanPhamChiTietService {

    @Autowired
    SanPhamInterface spsi;

    @Autowired
    SanPhamChiTietInterface sanPhamChiTietInterface;

    @Autowired
    ImeiInterface imsi;

    @Autowired
    ProductDiscountInterface productDiscountInterface;

    @Autowired
    HinhAnhInterface hasi;
    @Autowired
    private ImeiInterface imeiInterface;

    public Boolean saveSanPhamChiTietWithImage(SanPhamChiTiet spct, SanPham sp, List<String> urlImg) {
        try {
            // Kiểm tra sản phẩm và sản phẩm chi tiết
            if (spct == null || sp == null) {
                throw new IllegalArgumentException("Sản phẩm chi tiết hoặc sản phẩm không được để trống");
            }

            // Kiểm tra ID sản phẩm
            Integer idSanPham = sp.getId();
            if (idSanPham == null) {
                throw new IllegalArgumentException("ID sản phẩm không được để trống");
            }

            // Tìm sản phẩm trong cơ sở dữ liệu
            SanPham sanPham = spsi.findById(idSanPham)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + idSanPham));

            // Gán sản phẩm vào sản phẩm chi tiết và lưu
            spct.setTrangThai(0);
            spct.setSanPham(sanPham);
            SanPhamChiTiet savedSpct = sanPhamChiTietInterface.save(spct);

            // Lưu hình ảnh nếu danh sách URL hợp lệ
            if (urlImg != null && !urlImg.isEmpty()) {
                urlImg.stream()
                        .filter(url -> url != null && !url.isEmpty()) // Loại bỏ URL null hoặc rỗng
                        .forEach(url -> {
                            HinhAnh hinhAnh = new HinhAnh();
                            hinhAnh.setDuongDanHinhAnh(url);
                            hinhAnh.setSanPhamChiTiet(savedSpct);
                            hasi.save(hinhAnh);
                        });
            }

            return true;
        } catch (Exception e) {
            // Log lỗi
            System.err.println("Lỗi khi lưu sản phẩm chi tiết hoặc hình ảnh: " + e.getMessage());
            e.printStackTrace();
            return false;
        }

}
    @Transactional
    public void updateSanPhamChiTietWithImage(SanPhamChiTiet sp, List<String> urlImg) {
        sanPhamChiTietInterface.save(sp);

        // Nếu có danh sách URL hình ảnh mới, cập nhật hình ảnh
        if (urlImg != null && !urlImg.isEmpty()) {
            // Xóa các ảnh cũ liên quan đến sản phẩm này (nếu cần thiết)
            hasi.deleteBySanPhamId(sp.getId());

            // Thêm các ảnh mới
            for (String url : urlImg) {
                HinhAnh hinhAnh = new HinhAnh();
                hinhAnh.setDuongDanHinhAnh(url);
                hinhAnh.setSanPhamChiTiet(sp);
                hasi.save(hinhAnh);
            }
        }

    }

    public List<SanPhamChiTietDto> getListForHome() {
        List<SanPhamChiTietDto> listSPCTDTO = sanPhamChiTietInterface.getAllDTO();
        List<SanPhamChiTietDto> listHome1 = new ArrayList<>();
        for (SanPhamChiTietDto spctdto : listSPCTDTO) {
            System.out.println("Trạng Thái của SPCT DTO: " + spctdto.getTrangThai());
            if (spctdto.getTrangThai() == 1) {
                listHome1.add(spctdto);
            }
        }
        return listHome1;
    }



    public List<SanPhamChiTietDto> getListThungRac(){
        List<SanPhamChiTietDto> listSPCTDTO = sanPhamChiTietInterface.getAllDTO();
        List<SanPhamChiTietDto> listHome = new ArrayList<>()    ;
        for (SanPhamChiTietDto spctdto : listSPCTDTO
        ) {
            if(spctdto.getTrangThai() == 0){
                listHome.add(spctdto);
            }
        }
        return listHome;
    }

    public List<SanPhamChiTietDto> getListDelay(){
        List<SanPhamChiTietDto> listSPCTDTO = sanPhamChiTietInterface.getAllDTO();
        List<SanPhamChiTietDto> listHome = new ArrayList<>()    ;
        for (SanPhamChiTietDto spctdto : listSPCTDTO
        ) {
            if(spctdto.getTrangThai() == 2){
                listHome.add(spctdto);
            }
        }
        return listHome;
    }

    public SanPhamChiTietDto getSanPhamChiTietById(Integer id) {
        List<SanPhamChiTietDto> listSPCTDTO = sanPhamChiTietInterface.getAllDTO();
        for (SanPhamChiTietDto spctdto : listSPCTDTO
        ) {
            if(spctdto.getId() == id){
               return spctdto;
            }
        }
        return null;
    }

}
