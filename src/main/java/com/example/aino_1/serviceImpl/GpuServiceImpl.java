package com.example.aino_1.serviceImpl;

import com.example.aino_1.entity.Gpu;
import com.example.aino_1.repository.GpuInterface;
import com.example.aino_1.serviceInter.GpuServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GpuServiceImpl implements GpuServiceInter {
    @Autowired
    GpuInterface gi;

    @Override
    public List<Gpu> read() {
        return gi.findAll();
    }

    @Override
    public Gpu create(Gpu gpu) {
        return gi.save(gpu);
    }

    @Override
    public Gpu update(Gpu gpu) {
        return gi.save(gpu);
    }

    @Override
    public void delete(Integer maSo) {
        gi.deleteById(maSo);
    }
}
