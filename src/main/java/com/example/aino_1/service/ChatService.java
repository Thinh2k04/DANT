package com.example.aino_1.service;

import com.example.aino_1.dto.MessageDTO;
import com.example.aino_1.entity.Message;
import com.example.aino_1.entity.PhienChat;
import com.example.aino_1.repository.MessageInterface;
import com.example.aino_1.repository.PhienChatInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private MessageInterface messageInterface;

    @Autowired
    private PhienChatInterface phienChatInterface;

    /**
     * Gửi tin nhắn và lưu vào cơ sở dữ liệu.
     *
     * @param messageDTO Thông tin tin nhắn từ client.
     * @return MessageDTO đã được gửi.
     */
    public MessageDTO sendMessage(MessageDTO messageDTO) {
        saveMessageToDatabase(messageDTO);
        return messageDTO;
    }

    /**
     * Lưu tin nhắn vào cơ sở dữ liệu.
     *
     * @param messageDTO Thông tin tin nhắn từ client.
     */
    private void saveMessageToDatabase(MessageDTO messageDTO) {
        Message message = new Message();
        message.setIdPhienChat(messageDTO.getIdPhienChat());
        message.setTenNguoiGui(messageDTO.getSender());
        message.setNoiDung(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setNguoiGuiDi(messageDTO.isNguoiGuiDi());

        messageInterface.save(message);
    }

    /**
     * Khởi động một phiên chat mới hoặc trả về phiên chat hiện tại nếu đã tồn tại.
     *
     * @param idNguoiDung ID người dùng khởi động chat.
     * @param idNhanVien  ID nhân viên (tùy chọn).
     * @return PhienChat đã được khởi tạo hoặc tìm thấy.
     */
    public PhienChat startChat(int idNguoiDung, Integer idNhanVien) {
        Optional<PhienChat> existingPhienChat = phienChatInterface.findActiveChatByUserId(idNguoiDung);

        if (existingPhienChat.isPresent()) {
            return existingPhienChat.get();
        }

        PhienChat phienChat = new PhienChat();
        phienChat.setIdKhachHang(idNguoiDung);
        phienChat.setIdNhanVien(idNhanVien);
        phienChat.setTrangThai("Active");
        phienChat.setCreatedAt(LocalDateTime.now());
        phienChat.setUpdatedAt(LocalDateTime.now());

        return phienChatInterface.save(phienChat);
    }

    /**
     * Lấy danh sách tin nhắn của một phiên chat.
     *
     * @param idPhienChat ID phiên chat.
     * @return Danh sách MessageDTO.
     */
    public List<MessageDTO> getMessagesByPhienChat(int idPhienChat) {
        List<Message> messages = messageInterface.findByIdPhienChat(idPhienChat);
        return messages.stream().map(message -> new MessageDTO(
                message.getId(),
                message.getIdPhienChat(),
                message.getTenNguoiGui(),
                message.getNoiDung(),
                message.getTimestamp(),
                message.isNguoiGuiDi()
        )).collect(Collectors.toList());
    }
}
