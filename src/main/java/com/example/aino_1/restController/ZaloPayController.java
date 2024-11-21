package com.example.aino_1.restController;

import org.springframework.web.bind.annotation.*;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONObject;
import vn.zalopay.crypto.HMACUtil;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class ZaloPayController {

    private static final Map<String, String> config = new HashMap<String, String>() {{
        put("app_id", "2554");
        put("key1", "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn");
        put("key2", "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf");
        put("endpoint", "https://sb-openapi.zalopay.vn/v2/create");
    }};

    // Định dạng thời gian hiện tại
    private static String getCurrentTimeString(String format) {
        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat(format);
        fmt.setCalendar(cal);
        return fmt.format(cal.getTimeInMillis());
    }

    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> request) {
        try {
            Random rand = new Random();
            int random_id = rand.nextInt(1000000);
            final Map<String, Object> embed_data = new HashMap<>();

            // Chuyển đổi danh sách items thành List<Map<String, Object> >
            List<Map<String, Object>> itemList = new ArrayList<>();
            for (Object itemObj : (List<Map<String, Object>>) request.get("items")) {
                itemList.add((Map<String, Object>) itemObj);
            }

            // Chuyển itemList thành JSONArray
            JSONArray itemJSONArray = new JSONArray();
            for (Map<String, Object> itemMap : itemList) {
                itemJSONArray.put(new JSONObject(itemMap));
            }

            Map<String, Object> order = new HashMap<String, Object>() {{
                put("app_id", config.get("app_id"));
                put("app_trans_id", getCurrentTimeString("yyMMdd") + "_" + random_id);
                put("app_time", System.currentTimeMillis()); // miliseconds
                put("app_user", request.get("userId")); // userId từ request
                put("amount", request.get("totalAmount")); // tổng tiền từ request
                put("description", "LAPTOP AINO " + random_id);
                put("bank_code", "zalopayapp");
                put("item", itemJSONArray.toString()); // Chuyển đổi itemList thành JSON string
                put("embed_data", new JSONObject(embed_data).toString());
            }};

            // Tạo dữ liệu cho chữ ký HMAC
            String data = order.get("app_id") + "|" + order.get("app_trans_id") + "|" + order.get("app_user") + "|" + order.get("amount")
                    + "|" + order.get("app_time") + "|" + order.get("embed_data") + "|" + order.get("item");

            order.put("mac", HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.get("key1"), data));

            // Tạo HttpClient để gửi yêu cầu đến ZaloPay API
            CloseableHttpClient client = HttpClients.createDefault();
            HttpPost post = new HttpPost(config.get("endpoint"));

            List<NameValuePair> params = new ArrayList<>();
            for (Map.Entry<String, Object> e : order.entrySet()) {
                params.add(new BasicNameValuePair(e.getKey(), e.getValue().toString()));
            }

            post.setEntity(new UrlEncodedFormEntity(params));

            CloseableHttpResponse res = client.execute(post);
            BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
            StringBuilder resultJsonStr = new StringBuilder();
            String line;

            while ((line = rd.readLine()) != null) {
                resultJsonStr.append(line);
            }

            // Lấy kết quả trả về từ ZaloPay và trả về cho frontend mà không kiểm tra điều kiện
            JSONObject result = new JSONObject(resultJsonStr.toString());

            // Chuyển JSONObject thành Map<String, Object> bằng cách lặp qua các khóa
            Map<String, Object> response = new HashMap<>();
            Iterator<String> keys = result.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                response.put(key, result.get(key));
            }

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("error", "An error occurred: " + e.getMessage());
        }
    }
}
