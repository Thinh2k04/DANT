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
            @RequestParam MultipartFile file) {
        try {
            // Lấy nội dung file từ request
            byte[] fileBytes = file.getBytes();
            String fileName = file.getOriginalFilename();

            // Gửi email kèm file
            emailService.sendEmailWithAttachment(to, subject, text, fileBytes, fileName);
            return "Email được gửi thành công";
        } catch (Exception e) {
            e.printStackTrace();
            return "lỗi khi gửi mail";
        }
    }


}
