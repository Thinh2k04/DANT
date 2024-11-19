package com.example.aino_1.service;

import com.example.aino_1.entity.*;
import com.example.aino_1.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class SanPhamService {



    @Autowired
    private SanPhamChiTietInterface spctInterface;

    @Autowired
    private NguonNhapInterface nguonNhapInterface; // Repository cho HinhAnh
    @Autowired
    private ChatLieuInterface chatLieuInterface; // Repository cho HinhAnh

    @Autowired
    private KichThuocLaptopInterface kichThuocLaptopInterface; // Repository cho HinhAnh

    @Autowired
    private LoaiSanPhamInterface loaiSanPhamInterface; // Repository cho HinhAnh

    @Autowired
    private HinhAnhInterface hinhAnhInterface; // Repository cho HinhAnh



    }

