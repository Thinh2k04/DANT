package com.example.aino_1.service;

import com.example.aino_1.dto.TimelineHoaDonDTO;
import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.TimelineHoaDon;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.repository.TimelineHoaDonInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TimelineHoaDonService {


    @Autowired
    private TimelineHoaDonInterface timelineRepository;

    @Autowired
    private HoaDonInterface hoaDonRepository;

    // Danh sách trạng thái hợp lệ
    private static final List<Integer> VALID_STATES = List.of(0, 1, 2, 3, 4, 5, 6, 7, 8);

    // Lấy danh sách timeline của hóa đơn theo ID
    public List<TimelineHoaDon> getTimelineByHoaDonId(Integer hoaDonId) {
        return timelineRepository.findAllByHoaDon_Id(hoaDonId);
    }

    // Thêm timeline mới
    public ResponseEntity<?> addTimeline(TimelineHoaDonDTO timelineDTO) {
        // Kiểm tra trạng thái có hợp lệ không
        if (!VALID_STATES.contains(timelineDTO.getTrangThai())) {
            return new ResponseEntity<>("Trạng thái không hợp lệ: " + timelineDTO.getTrangThai(), HttpStatus.OK);
        }

        // Kiểm tra trạng thái hiện tại để đảm bảo tính hợp lệ khi chuyển trạng thái
        TimelineHoaDon lastTimeline = timelineRepository.findTopByHoaDon_IdOrderByThoiGianCapNhatDesc(timelineDTO.getHoaDonId());
        Integer currentStatus = (lastTimeline != null) ? lastTimeline.getTrangThai() : null;

        if (currentStatus != null && currentStatus.equals(timelineDTO.getTrangThai())) {
            return new ResponseEntity<>("Không thể chuyển từ trạng thái " + currentStatus + " sang " + timelineDTO.getTrangThai(), HttpStatus.OK);
        }

        if (!isValidTransition(currentStatus, timelineDTO.getTrangThai())) {
            return new ResponseEntity<>("Không thể chuyển từ trạng thái " + currentStatus + " sang " + timelineDTO.getTrangThai(), HttpStatus.OK);
        }

        // Tạo đối tượng HoaDon từ ID trong DTO
//        HoaDon hoaDon = new HoaDon();
//        hoaDon.setId(timelineDTO.getHoaDonId());


        HoaDon hoaDon = hoaDonRepository.findHoaDonById(timelineDTO.getHoaDonId());

        // Tạo đối tượng TimelineHoaDon và gán các giá trị từ DTO
        TimelineHoaDon timeline = new TimelineHoaDon();
        timeline.setHoaDon(hoaDon);
        timeline.setTrangThai(timelineDTO.getTrangThai());
        timeline.setThoiGianCapNhat(new Timestamp(System.currentTimeMillis())); // Ghi thời gian hiện tại
        timeline.setNguoiCapNhat(timelineDTO.getNguoiCapNhat());
        timeline.setLyDo(timelineDTO.getLyDo());
        timeline.setRole(timelineDTO.getRole()); // Gán giá trị role từ DTO

        hoaDon.setTrangThai(timelineDTO.getTrangThai());
        hoaDonRepository.save(hoaDon);
        // Lưu vào cơ sở dữ liệu
        timelineRepository.save(timeline);

        return new ResponseEntity<>(timeline, HttpStatus.OK); // Trả về đối tượng đã lưu với trạng thái OK
    }

    // Kiểm tra tính hợp lệ khi chuyển trạng thái
    private boolean isValidTransition(Integer currentStatus, Integer newStatus) {
        if (currentStatus == null) {
            return newStatus == 1; // Trạng thái đầu tiên phải là "Chờ xác nhận"
        }

        switch (currentStatus) {
            case 0: // Hủy đơn hàng
            case 7: // Hoàn thành đơn hàng
            case 8: // Yêu cầu hoàn trả hàng
                return false; // Không cho phép chuyển tiếp
            case 1: // Chờ xác nhận
                return newStatus == 2 || newStatus == 0;
            case 2: // Xác nhận đơn hàng
                return newStatus == 3 || newStatus == 0;
            case 3: // Đơn vị vận chuyển đang giao
                return newStatus == 4 || newStatus == 0;
            case 4: // Đang được giao tới bạn
                return newStatus == 5;
            case 5: // Đơn hàng đã được giao thành công
                return newStatus == 6;
            case 6: // Xác nhận giao hàng thành công
                return newStatus == 7;
            default:
                return false;
        }
    }
}
