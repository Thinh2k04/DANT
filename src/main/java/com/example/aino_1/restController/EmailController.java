package com.example.aino_1.restController;

import com.example.aino_1.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class EmailController {

    @Autowired
    private EmailService emailService ;

    @PostMapping("/send-email")
    public String sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String text,
            @RequestParam(required = false) MultipartFile file) { // Make 'file' parameter optional
        try {
            // Lấy nội dung file từ request (kiểm tra nếu file có được đính kèm)
            byte[] fileBytes = null;
            String fileName = null;
            if (file != null && !file.isEmpty()) {
                fileBytes = file.getBytes();
                fileName = file.getOriginalFilename();
            }

            // Gửi email kèm file (kiểm tra nếu fileBytes != null)
            emailService.sendEmailWithAttachment(to, subject, text, fileBytes, fileName);
            return "Email được gửi thành công";
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi khi gửi mail";
        }
    }


}
