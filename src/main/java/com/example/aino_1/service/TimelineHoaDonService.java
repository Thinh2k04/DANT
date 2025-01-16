package com.example.aino_1.service;

import com.example.aino_1.dto.TimelineHoaDonDTO;
import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.TimelineHoaDon;
import com.example.aino_1.repository.HoaDonInterface;
import com.example.aino_1.repository.TimelineHoaDonInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Timestamp;
import java.util.List;
import org.springframework.http.HttpStatus;

@Service
public class TimelineHoaDonService {

    @Autowired
    private TimelineHoaDonInterface timelineRepository;

    @Autowired
    private HoaDonInterface hoaDonRepository;

    @Autowired
    private HoaDonService hoaDonService; // Inject thêm HoaDonService

    // Danh sách trạng thái hợp lệ
    private static final List<Integer> VALID_STATES = List.of(0, 1, 2, 3, 4, 5, 6, 7, 8);

    // Lấy danh sách timeline của hóa đơn theo ID
    public List<TimelineHoaDon> getTimelineByHoaDonId(Integer hoaDonId) {
        return timelineRepository.findAllByHoaDon_Id(hoaDonId);
    }

    // Thêm timeline mới
    public ResponseEntity<?> addTimeline(TimelineHoaDonDTO timelineDTO) {
        // Kiểm tra trạng thái hợp lệ
        if (!VALID_STATES.contains(timelineDTO.getTrangThai())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Trạng thái không hợp lệ: " + timelineDTO.getTrangThai());
        }

        // Lấy trạng thái hiện tại của hóa đơn
        TimelineHoaDon lastTimeline = timelineRepository.findTopByHoaDon_IdOrderByThoiGianCapNhatDesc(timelineDTO.getHoaDonId());
        Integer currentStatus = (lastTimeline != null) ? lastTimeline.getTrangThai() : null;

        // Kiểm tra trạng thái hiện tại và trạng thái mới
        if (currentStatus != null && currentStatus.equals(timelineDTO.getTrangThai())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Không thể chuyển từ trạng thái " + currentStatus + " sang " + timelineDTO.getTrangThai());
        }

        if (!isValidTransition(currentStatus, timelineDTO.getTrangThai())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Không thể chuyển từ trạng thái " + currentStatus + " sang " + timelineDTO.getTrangThai());
        }

        // Lấy thông tin hóa đơn
        HoaDon hoaDon = hoaDonRepository.findHoaDonById(timelineDTO.getHoaDonId());
        if (hoaDon == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy hóa đơn với ID: " + timelineDTO.getHoaDonId());
        }

        // Nếu trạng thái mới là 0 (hủy đơn hàng)
        if (timelineDTO.getTrangThai() == 0) {
            // Nếu trạng thái hiện tại là 3 (đơn vị vận chuyển đang giao), không cho phép hủy
            if (currentStatus != null && currentStatus == 3) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Không thể hủy hóa đơn khi đơn vị vận chuyển đang giao.");
            }

            // Gọi hàm huyHoaDon
            hoaDonService.huyHoaDon(timelineDTO.getHoaDonId());
        }

        // Tạo đối tượng TimelineHoaDon và gán giá trị từ DTO
        TimelineHoaDon timeline = new TimelineHoaDon();
        timeline.setHoaDon(hoaDon);
        timeline.setTrangThai(timelineDTO.getTrangThai());
        timeline.setThoiGianCapNhat(new Timestamp(System.currentTimeMillis())); // Thời gian hiện tại
        timeline.setNguoiCapNhat(timelineDTO.getNguoiCapNhat());
        timeline.setLyDo(timelineDTO.getLyDo());
        timeline.setRole(timelineDTO.getRole());

        // Cập nhật trạng thái hóa đơn và lưu dữ liệu
        hoaDon.setTrangThai(timelineDTO.getTrangThai());
        hoaDonRepository.save(hoaDon);
        timelineRepository.save(timeline);

        return new ResponseEntity<>(timeline, HttpStatus.OK); // Trả về đối tượng timeline
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
                return newStatus == 4; // Không cho phép hủy, chỉ được chuyển sang trạng thái 4
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
