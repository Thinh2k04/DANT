package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.Ram;
import com.example.aino_1.repository.RamInterface;
import com.example.aino_1.serviceInter.RamServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class RamServiceImpl implements RamServiceInter {
    @Autowired
    RamInterface ri;

    @Override
    public List<Ram> read() {
        return ri.findAll();
    }

    @Override
    public Ram create(Ram ram) {
        return ri.save(ram);
    }

    @Override
    public Ram update(Ram ram) {
        return ri.save(ram);
    }

    @Override
    public void delete(Integer maSo) {
        ri.deleteById(maSo);
    }
}
