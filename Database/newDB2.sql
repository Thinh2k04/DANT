USE [testAINO]
GO
/****** Object:  Table [dbo].[card_do_hoa]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[card_do_hoa](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_card] [varchar](255) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[chat_lieu]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[chat_lieu](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_chat_lieu] [nvarchar](50) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[chuc_vu]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[chuc_vu](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[vai_tro] [nvarchar](30) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cpu]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cpu](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hang_san_xuat] [nvarchar](20) NOT NULL,
	[kien_truc_cong_nghe] [nvarchar](30) NULL,
	[toc_do_toi_thieu] [int] NULL,
	[toc_do_toi_da] [int] NULL,
	[so_nhan] [int] NULL,
	[so_luong] [int] NULL,
	[bo_nho_dem] [int] NULL,
	[ten] [nvarchar](20) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[cua_hang]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cua_hang](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_cua_hang] [nvarchar](250) NULL,
	[tinh] [nvarchar](20) NULL,
	[huyen] [nvarchar](20) NULL,
	[phuong] [nvarchar](20) NULL,
	[so_nha] [nvarchar](50) NULL,
	[thoi_gian_mo_cua] [nvarchar](5) NULL,
	[thoi_gian_dong_cua] [nvarchar](5) NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gio_hang]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gio_hang](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_tai_khoan] [int] NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [uq_id_tai_khoan] UNIQUE NONCLUSTERED 
(
	[id_tai_khoan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gio_hang_chi_tiet]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gio_hang_chi_tiet](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_gio_hang] [int] NULL,
	[id_spct] [int] NULL,
	[so_luong] [int] NOT NULL,
	[don_gia] [float] NOT NULL,
	[trang_thai] [int] NULL,
	[soLuong] [int] NULL,
	[donGia] [real] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [uq_gio_hang_spct] UNIQUE NONCLUSTERED 
(
	[id_gio_hang] ASC,
	[id_spct] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[gpu]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[gpu](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hang_san_xuat] [nvarchar](20) NOT NULL,
	[xung_nhip_toi_thieu] [int] NULL,
	[xung_nhip_toi_da] [int] NULL,
	[vram] [int] NULL,
	[dien_ap] [int] NULL,
	[kien_truc_cong_nghe] [nvarchar](30) NULL,
	[ten] [nvarchar](20) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hinh_anh]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hinh_anh](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_san_pham_chi_tiet] [int] NULL,
	[duong_dan_hinh_anh] [varchar](250) NOT NULL,
	[mo_ta] [nvarchar](255) NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hinh_thuc_thanh_toan]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hinh_thuc_thanh_toan](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_hinh_thuc] [nvarchar](50) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hoa_don]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hoa_don](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_ttkh] [int] NULL,
	[thoi_gian_lap_hoa_don] [datetime] NULL,
	[tong_tien] [float] NULL,
	[id_hinh_thuc_thanh_toan] [int] NULL,
	[dia_chi_nhan_hang] [nvarchar](255) NULL,
	[id_cua_hang] [int] NULL,
	[id_voucher] [int] NULL,
	[trang_thai_thanh_toan] [int] NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[hoa_don_chi_tiet]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[hoa_don_chi_tiet](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_hoa_don] [int] NULL,
	[id_san_pham_chi_tiet] [int] NULL,
	[so_luong] [int] NULL,
	[gia] [float] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[imei]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[imei](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_spct] [int] NULL,
	[imei] [varchar](20) NOT NULL,
	[id_hoa_don_chi_tiet] [int] NULL,
	[trang_thai] [tinyint] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[imei] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[kich_thuoc_laptop]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[kich_thuoc_laptop](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[kich_thuoc] [int] NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[loai_san_pham]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[loai_san_pham](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_loai] [nvarchar](50) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[man_hinh]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[man_hinh](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[do_phan_giai] [varchar](20) NULL,
	[tan_so_quet] [int] NULL,
	[do_sang] [int] NULL,
	[do_phu_mau] [float] NULL,
	[tam_nen] [varchar](10) NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mau_sac]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mau_sac](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_mau] [nvarchar](100) NOT NULL,
	[ma_hex] [nvarchar](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[nguon_nhap]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[nguon_nhap](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_nha_cung_ung] [nvarchar](30) NOT NULL,
	[sdt] [nvarchar](15) NOT NULL,
	[email] [varchar](30) NOT NULL,
	[dia_chi] [nvarchar](255) NOT NULL,
	[ghi_chu] [nvarchar](255) NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[o_luu_tru]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[o_luu_tru](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[dung_luong] [int] NULL,
	[loai_o_cung] [varchar](20) NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ram]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ram](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[dung_luong] [int] NULL,
	[toc_do] [int] NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[san_pham]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[san_pham](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[id_loai] [int] NULL,
	[id_nguon_nhap] [int] NULL,
	[id_chat_lieu] [int] NOT NULL,
	[id_thuong_hieu] [int] NOT NULL,
	[kich_thuoc_laptop_id] [int] NULL,
	[ten_san_pham] [nvarchar](50) NOT NULL,
	[nam_san_xuat] [int] NOT NULL,
	[trong_luong] [float] NOT NULL,
	[thoi_han_bao_hanh] [int] NULL,
	[pin] [int] NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[san_pham_chi_tiet]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[san_pham_chi_tiet](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hinh_anh_minh_hoa] [varchar](250) NULL,
	[so_luong] [int] NOT NULL,
	[trang_thai] [int] NOT NULL,
	[don_gia] [float] NOT NULL,
	[ma_spct] [varchar](20) NOT NULL,
	[gioi_thieu] [nvarchar](300) NULL,
	[id_mau_sac] [int] NULL,
	[id_sp] [int] NULL,
	[id_ram] [int] NULL,
	[id_o_luu_tru] [int] NULL,
	[id_man_hinh] [int] NULL,
	[id_cpu] [int] NULL,
	[id_gpu] [int] NULL,
	[id_card_do_hoa] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tai_khoan_nguoi_dung]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tai_khoan_nguoi_dung](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten_tai_khoan] [varchar](50) NOT NULL,
	[mat_khau] [varchar](50) NOT NULL,
	[id_chuc_vu] [int] NULL,
	[id_cua_hang] [int] NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[thong_tin_tai_khoan]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[thong_tin_tai_khoan](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ho_ten] [nvarchar](50) NULL,
	[dia_chi] [nvarchar](255) NULL,
	[so_cccd] [varchar](20) NULL,
	[so_dien_thoai] [varchar](11) NULL,
	[email] [varchar](50) NULL,
	[id_tai_khoan] [int] NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[thuong_hieu]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[thuong_hieu](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ten] [nvarchar](200) NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[voucher]    Script Date: 18/12/2024 10:29:07 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[voucher](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ma_voucher] [varchar](100) NOT NULL,
	[so_luong] [int] NOT NULL,
	[thoi_gian_hen_ket] [datetime] NOT NULL,
	[so_tien_toi_da] [float] NULL,
	[dieu_kien_ap_dung] [float] NOT NULL,
	[so_tien_ap_dung] [float] NULL,
	[phan_tram_ap_dung] [float] NULL,
	[thoi_gian_ap_dung] [datetime] NOT NULL,
	[trang_thai] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[kich_thuoc_laptop] ADD  DEFAULT ((1)) FOR [trang_thai]
GO
ALTER TABLE [dbo].[gio_hang]  WITH CHECK ADD  CONSTRAINT [fk_id_tai_khoan_gio_hang] FOREIGN KEY([id_tai_khoan])
REFERENCES [dbo].[tai_khoan_nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[gio_hang] CHECK CONSTRAINT [fk_id_tai_khoan_gio_hang]
GO
ALTER TABLE [dbo].[gio_hang_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_gio_hang] FOREIGN KEY([id_gio_hang])
REFERENCES [dbo].[gio_hang] ([id])
GO
ALTER TABLE [dbo].[gio_hang_chi_tiet] CHECK CONSTRAINT [fk_id_gio_hang]
GO
ALTER TABLE [dbo].[gio_hang_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_spct_gio_hang_chi_tiet] FOREIGN KEY([id_spct])
REFERENCES [dbo].[san_pham_chi_tiet] ([id])
GO
ALTER TABLE [dbo].[gio_hang_chi_tiet] CHECK CONSTRAINT [fk_id_spct_gio_hang_chi_tiet]
GO
ALTER TABLE [dbo].[hinh_anh]  WITH CHECK ADD  CONSTRAINT [fk_id_san_pham_chi_tiet] FOREIGN KEY([id_san_pham_chi_tiet])
REFERENCES [dbo].[san_pham_chi_tiet] ([id])
GO
ALTER TABLE [dbo].[hinh_anh] CHECK CONSTRAINT [fk_id_san_pham_chi_tiet]
GO
ALTER TABLE [dbo].[hoa_don]  WITH CHECK ADD  CONSTRAINT [fk_id_cua_hang_hoa_don] FOREIGN KEY([id_cua_hang])
REFERENCES [dbo].[cua_hang] ([id])
GO
ALTER TABLE [dbo].[hoa_don] CHECK CONSTRAINT [fk_id_cua_hang_hoa_don]
GO
ALTER TABLE [dbo].[hoa_don]  WITH CHECK ADD  CONSTRAINT [fk_id_hinh_thuc_thanh_toan] FOREIGN KEY([id_hinh_thuc_thanh_toan])
REFERENCES [dbo].[hinh_thuc_thanh_toan] ([id])
GO
ALTER TABLE [dbo].[hoa_don] CHECK CONSTRAINT [fk_id_hinh_thuc_thanh_toan]
GO
ALTER TABLE [dbo].[hoa_don]  WITH CHECK ADD  CONSTRAINT [fk_id_ttkh_hd] FOREIGN KEY([id_ttkh])
REFERENCES [dbo].[thong_tin_tai_khoan] ([id])
GO
ALTER TABLE [dbo].[hoa_don] CHECK CONSTRAINT [fk_id_ttkh_hd]
GO
ALTER TABLE [dbo].[hoa_don]  WITH CHECK ADD  CONSTRAINT [fk_id_voucher] FOREIGN KEY([id_voucher])
REFERENCES [dbo].[voucher] ([id])
GO
ALTER TABLE [dbo].[hoa_don] CHECK CONSTRAINT [fk_id_voucher]
GO
ALTER TABLE [dbo].[hoa_don_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_hoa_don] FOREIGN KEY([id_hoa_don])
REFERENCES [dbo].[hoa_don] ([id])
GO
ALTER TABLE [dbo].[hoa_don_chi_tiet] CHECK CONSTRAINT [fk_id_hoa_don]
GO
ALTER TABLE [dbo].[hoa_don_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_san_pham_chi_tiet_hdct] FOREIGN KEY([id_san_pham_chi_tiet])
REFERENCES [dbo].[san_pham_chi_tiet] ([id])
GO
ALTER TABLE [dbo].[hoa_don_chi_tiet] CHECK CONSTRAINT [fk_id_san_pham_chi_tiet_hdct]
GO
ALTER TABLE [dbo].[imei]  WITH CHECK ADD FOREIGN KEY([id_hoa_don_chi_tiet])
REFERENCES [dbo].[hoa_don_chi_tiet] ([id])
GO
ALTER TABLE [dbo].[imei]  WITH CHECK ADD FOREIGN KEY([id_spct])
REFERENCES [dbo].[san_pham_chi_tiet] ([id])
GO
ALTER TABLE [dbo].[san_pham]  WITH CHECK ADD  CONSTRAINT [fk_id_chat_lieu] FOREIGN KEY([id_chat_lieu])
REFERENCES [dbo].[chat_lieu] ([id])
GO
ALTER TABLE [dbo].[san_pham] CHECK CONSTRAINT [fk_id_chat_lieu]
GO
ALTER TABLE [dbo].[san_pham]  WITH CHECK ADD  CONSTRAINT [fk_id_loai] FOREIGN KEY([id_loai])
REFERENCES [dbo].[loai_san_pham] ([id])
GO
ALTER TABLE [dbo].[san_pham] CHECK CONSTRAINT [fk_id_loai]
GO
ALTER TABLE [dbo].[san_pham]  WITH CHECK ADD  CONSTRAINT [fk_id_nguon_nhap] FOREIGN KEY([id_nguon_nhap])
REFERENCES [dbo].[nguon_nhap] ([id])
GO
ALTER TABLE [dbo].[san_pham] CHECK CONSTRAINT [fk_id_nguon_nhap]
GO
ALTER TABLE [dbo].[san_pham]  WITH CHECK ADD  CONSTRAINT [fk_id_thuong_hieu_san_pham] FOREIGN KEY([id_thuong_hieu])
REFERENCES [dbo].[thuong_hieu] ([id])
GO
ALTER TABLE [dbo].[san_pham] CHECK CONSTRAINT [fk_id_thuong_hieu_san_pham]
GO
ALTER TABLE [dbo].[san_pham]  WITH CHECK ADD  CONSTRAINT [fk_kich_thuoc_laptop] FOREIGN KEY([kich_thuoc_laptop_id])
REFERENCES [dbo].[kich_thuoc_laptop] ([id])
GO
ALTER TABLE [dbo].[san_pham] CHECK CONSTRAINT [fk_kich_thuoc_laptop]
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD FOREIGN KEY([id_mau_sac])
REFERENCES [dbo].[mau_sac] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_card_do_hoa] FOREIGN KEY([id_card_do_hoa])
REFERENCES [dbo].[card_do_hoa] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet] CHECK CONSTRAINT [fk_id_card_do_hoa]
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_cpu] FOREIGN KEY([id_cpu])
REFERENCES [dbo].[cpu] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet] CHECK CONSTRAINT [fk_id_cpu]
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_gpu] FOREIGN KEY([id_gpu])
REFERENCES [dbo].[gpu] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet] CHECK CONSTRAINT [fk_id_gpu]
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_man_hinh] FOREIGN KEY([id_man_hinh])
REFERENCES [dbo].[man_hinh] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet] CHECK CONSTRAINT [fk_id_man_hinh]
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_o_luu_tru] FOREIGN KEY([id_o_luu_tru])
REFERENCES [dbo].[o_luu_tru] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet] CHECK CONSTRAINT [fk_id_o_luu_tru]
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_ram] FOREIGN KEY([id_ram])
REFERENCES [dbo].[ram] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet] CHECK CONSTRAINT [fk_id_ram]
GO
ALTER TABLE [dbo].[san_pham_chi_tiet]  WITH CHECK ADD  CONSTRAINT [fk_id_sp] FOREIGN KEY([id_sp])
REFERENCES [dbo].[san_pham] ([id])
GO
ALTER TABLE [dbo].[san_pham_chi_tiet] CHECK CONSTRAINT [fk_id_sp]
GO
ALTER TABLE [dbo].[tai_khoan_nguoi_dung]  WITH CHECK ADD  CONSTRAINT [fk_id_chuc_vu] FOREIGN KEY([id_chuc_vu])
REFERENCES [dbo].[chuc_vu] ([id])
GO
ALTER TABLE [dbo].[tai_khoan_nguoi_dung] CHECK CONSTRAINT [fk_id_chuc_vu]
GO
ALTER TABLE [dbo].[tai_khoan_nguoi_dung]  WITH CHECK ADD  CONSTRAINT [fk_id_cua_hang_tai_khao] FOREIGN KEY([id_cua_hang])
REFERENCES [dbo].[cua_hang] ([id])
GO
ALTER TABLE [dbo].[tai_khoan_nguoi_dung] CHECK CONSTRAINT [fk_id_cua_hang_tai_khao]
GO
ALTER TABLE [dbo].[thong_tin_tai_khoan]  WITH CHECK ADD  CONSTRAINT [fk_id_tai_khoan] FOREIGN KEY([id_tai_khoan])
REFERENCES [dbo].[tai_khoan_nguoi_dung] ([id])
GO
ALTER TABLE [dbo].[thong_tin_tai_khoan] CHECK CONSTRAINT [fk_id_tai_khoan]
GO
ALTER TABLE [dbo].[voucher]  WITH CHECK ADD  CONSTRAINT [chk_voucher] CHECK  (([so_tien_ap_dung] IS NOT NULL AND [phan_tram_ap_dung] IS NULL OR [so_tien_ap_dung] IS NULL AND [phan_tram_ap_dung] IS NOT NULL))
GO
ALTER TABLE [dbo].[voucher] CHECK CONSTRAINT [chk_voucher]
GO
