package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.Cpu;
import com.example.aino_1.repository.CpuInterface;
import com.example.aino_1.serviceInter.CpuServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
//dựa trên cách quản lý bean của spring thì service phải đặt annotation ở tầng implements
@Service
public class CpuServiceImpl implements CpuServiceInter {
    @Autowired
    CpuInterface ci;

    @Override
    public List<Cpu> read() {
        return ci.findAll();
    }

    @Override
    public Cpu create(Cpu cpu) {
        return ci.save(cpu);
    }

    @Override
    public Cpu update(Cpu cpu) {
        return ci.save(cpu);
    }

    @Override
    public void delete(Integer maSo) {
        ci.deleteById(maSo);
    }
}
