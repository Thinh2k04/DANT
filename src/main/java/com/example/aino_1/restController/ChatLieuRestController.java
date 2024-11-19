package com.example.aino_1.restController;


import com.example.aino_1.entity.ChatLieu;
import com.example.aino_1.entity.ChucVu;
import com.example.aino_1.repository.ChatLieuInterface;
import com.example.aino_1.repository.ChucVuInterface;
import org.springframework.beans.factory.annotation.Autowired;
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

@CrossOrigin("*") //cho phép tất cả các miền khác truy cập tài nguyên server (end point api)
@RestController
@RequestMapping("/rest/chat_lieu") //đường dẫn chung cho các phương thức http bên dưới
public class ChatLieuRestController {

    @Autowired
    ChatLieuInterface clsi;

    @GetMapping("/getAll")
    public List<ChatLieu> getAll() {
        return clsi.findAll();
    }

    @PostMapping("/add")
    public ChatLieu create(@RequestBody ChatLieu ChatLieu) {
        return clsi.save(ChatLieu);
    }

    @PutMapping("/update/{id}")
    public ChatLieu update(@RequestBody ChatLieu ChatLieu) {
        return clsi.save(ChatLieu);
    }

    @DeleteMapping("/del/{id}")
    public void delete(@PathVariable Integer id) {
        clsi.deleteById(id);
    }
}
