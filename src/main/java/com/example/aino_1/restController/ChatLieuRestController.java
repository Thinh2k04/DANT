package com.example.aino_1.restController;


import com.example.aino_1.entity.CardDoHoa;
import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.Cpu;
import com.example.aino_1.repository.ChatLieuInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/chat_lieu") //đường dẫn chung cho các phương thức http bên dưới
public class ChatLieuRestController {

    @Autowired
    ChatLieuInterface clsi;

    @GetMapping("/getAll")
    public List<ChatLieu> getAll() {
        return clsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public ChatLieu getAll(@PathVariable Integer id) {
        return clsi.findById(id).get();
    }

    @PostMapping("/add")
    public ChatLieu create(@RequestBody ChatLieu ChatLieu) {
        return clsi.save(ChatLieu);
    }

    @PostMapping("/update")
    public ChatLieu update(@RequestBody ChatLieu ChatLieu) {
        return clsi.save(ChatLieu);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<ChatLieu> optionalChatLieu = clsi.findById(id);

        if (!optionalChatLieu.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Ram with ID " + id + " not found");
        }

        ChatLieu chatLieu = optionalChatLieu.get();
        chatLieu.setTrangThai(0);
        ChatLieu saved = clsi.save(chatLieu);

        return ResponseEntity.ok(saved);
    }


    @GetMapping("/getThungRac")
    public List<ChatLieu> getThungRac(){
        return clsi.findAllByTrangThai(0);
    }
}
