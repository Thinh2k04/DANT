package com.example.aino_1.restController;

import com.example.aino_1.dto.TimelineHoaDonDTO;
import com.example.aino_1.entity.HoaDon;
import com.example.aino_1.entity.TimelineHoaDon;
import com.example.aino_1.service.TimelineHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/rest/timeline") // Đường dẫn chung cho các phương thức HTTP bên dưới
public class TimelineHoaDonController {

    @Autowired
    private TimelineHoaDonService timelineService;

    // Lấy timeline của hóa đơn
    @GetMapping("/getByHoaDonId/{hoaDonId}")
    public List<TimelineHoaDon> getTimelineByHoaDonId(@PathVariable Integer hoaDonId) {
        return timelineService.getTimelineByHoaDonId(hoaDonId);
    }

    // Thêm timeline mới
    @PostMapping("/add")
    public ResponseEntity<?> addTimeline(@RequestBody TimelineHoaDonDTO timelineDTO) {
        return timelineService.addTimeline(timelineDTO);
    }
}



