package com.example.aino_1.restController;

import com.example.aino_1.dto.MessageDTO;
import com.example.aino_1.entity.PhienChat;
import com.example.aino_1.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * API gửi tin nhắn qua WebSocket.
     *
     * @param messageDTO Tin nhắn từ client.
     * @return Tin nhắn đã gửi.
     */
    @Autowired
    private SimpMessagingTemplate getMessagingTemplate;

    @MessageMapping("/send") // WebSocket
    public void sendMessage(MessageDTO messageDTO) {
        // Lưu tin nhắn vào cơ sở dữ liệu
        MessageDTO savedMessage = chatService.sendMessage(messageDTO);

        // Gửi tin nhắn tới các client qua WebSocket
        getMessagingTemplate.convertAndSend("/topic/chat/" + savedMessage.getIdPhienChat(), savedMessage);
    }

    /**
     * API bắt đầu một phiên chat mới.
     *
     * @param idNguoiDung ID người dùng.
     * @param idNhanVien  ID nhân viên (tùy chọn).
     * @return Phiên chat mới hoặc đã tồn tại.
     */
    @PostMapping("/start")
    public PhienChat startChat(@RequestParam("idNguoiDung") int idNguoiDung,
                               @RequestParam(required = false) Integer idNhanVien) {
        return chatService.startChat(idNguoiDung, idNhanVien);
    }

    /**
     * API lấy lịch sử tin nhắn của một phiên chat.
     *
     * @param idPhienChat ID phiên chat.
     * @return Danh sách tin nhắn của phiên chat.
     */
    @GetMapping("/{idPhienChat}/messages")
    public List<MessageDTO> getChatMessages(@PathVariable("idPhienChat") int idPhienChat) {
        return chatService.getMessagesByPhienChat(idPhienChat);
    }
}
