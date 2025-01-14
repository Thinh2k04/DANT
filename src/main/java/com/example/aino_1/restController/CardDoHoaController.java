package com.example.aino_1.restController;

import com.example.aino_1.entity.CardDoHoa;
import com.example.aino_1.entity.Cpu;
import com.example.aino_1.repository.CardDoHoaInterface;
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
@RequestMapping("/rest/card_do_hoa") //đường dẫn chung cho các phương thức http bên dưới
public class CardDoHoaController {
    @Autowired
    CardDoHoaInterface cdhsi;

    @GetMapping("/getAll")
    public List<CardDoHoa> getAll() {
        return cdhsi.findAllByTrangThai(1);
    }

    @GetMapping("/getByID/{id}")
    public CardDoHoa getAll(@PathVariable Integer id) {
        return cdhsi.findById(id).get();
    }

    @PostMapping("/add")
    public CardDoHoa create(@RequestBody CardDoHoa CardDoHoa) {
        return cdhsi.save(CardDoHoa);
    }

    @PostMapping("/update")
    public CardDoHoa update(@RequestBody CardDoHoa CardDoHoa) {
        return cdhsi.save(CardDoHoa);
    }

    @PostMapping("/del/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        Optional<CardDoHoa> optionalCardDoHoa = cdhsi.findById(id);

        if (!optionalCardDoHoa.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card với ID " + id + " không tìm thấy");
        }

        CardDoHoa cardDoHoa = optionalCardDoHoa.get();
        cardDoHoa.setTrangThai(0);
        CardDoHoa saved = cdhsi.save(cardDoHoa);

        return ResponseEntity.ok(saved);
    }


    @GetMapping("/getThungRac")
    public List<CardDoHoa> getThungRac(){
        return cdhsi.findAllByTrangThai(0);
    }
}
