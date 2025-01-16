package com.example.aino_1.dto;

import com.example.aino_1.entity.Imei;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImeiDTO {
    private Integer id;
    private String imei;
    private Integer spctId;

    // Phương thức tĩnh chuyển đổi từ Imei sang ImeiDTO
    public static ImeiDTO fromEntity(Imei imei) {
        ImeiDTO dto = new ImeiDTO();
        dto.setId(imei.getId());
        dto.setImei(imei.getImei());
        dto.setSpctId(imei.getSpct() != null ? imei.getSpct().getId() : null);
        return dto;
    }

}
