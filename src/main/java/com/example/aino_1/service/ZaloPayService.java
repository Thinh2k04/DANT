package com.example.aino_1.service;

import com.example.aino_1.util.ZaloPayUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Hex;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import vn.zalopay.crypto.HMACUtil;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
public class ZaloPayService {
    private static final Map<String, String> config = new HashMap<String, String>() {{
        put("app_id", "2554");
        put("key1", "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn");
        put("key2", "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf");
        put("endpoint", "https://sb-openapi.zalopay.vn/v2/create");
        put("endpoint2", "https://sb-openapi.zalopay.vn/v2/query");

    }};

    // Định dạng thời gian hiện tại
    private String getCurrentTimeString(String format) {
        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat(format);
        fmt.setCalendar(cal);
        return fmt.format(cal.getTimeInMillis());
    }

    public Map<String, Object> createOrder(Map<String, Object> request) throws Exception {
        Random rand = new Random();
        int random_id = rand.nextInt(1000000);

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

        Map<String, Object> embed_data = new HashMap<>();
        Map<String, Object> order = new HashMap<String, Object>() {{
            put("app_id", config.get("app_id"));
            put("app_trans_id", getCurrentTimeString("yyMMdd") + "_" + random_id);
            put("app_time", System.currentTimeMillis()); // milliseconds
            put("app_user", request.get("userId")); // userId từ request
            put("amount", request.get("totalAmount")); // tổng tiền từ request
            put("description", "LAPTOP AINO " + random_id);
            put("bank_code", "");
            put("item", itemJSONArray.toString()); // Chuyển đổi itemList thành JSON string
            put("embed_data", new JSONObject(embed_data).toString());
            put("callback_url", "http://localhost:8080/api/payment/callback"); // URL callback
        }};

        // Tạo dữ liệu cho chữ ký HMAC
        String data = order.get("app_id") + "|" + order.get("app_trans_id") + "|" + order.get("app_user") + "|" + order.get("amount")
                + "|" + order.get("app_time") + "|" + order.get("embed_data") + "|" + order.get("item");

        order.put("mac", HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.get("key1"), data));

        System.out.println("Payload sent to ZaloPay: " + order);

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

        // Lấy kết quả trả về từ ZaloPay
        JSONObject result = new JSONObject(resultJsonStr.toString());

        // Chuyển JSONObject thành Map<String, Object>
        Map<String, Object> response = new HashMap<>();
        Iterator<String> keys = result.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            response.put(key, result.get(key));
        }

        return response;
    }


    public JSONObject getOrderStatus(String appTransId) throws Exception {
        String data = config.get("app_id") + "|" + appTransId + "|" + config.get("key1");
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.get("key1"), data);

        List<NameValuePair> params = new ArrayList<>();
        params.add(new BasicNameValuePair("app_id", config.get("app_id")));
        params.add(new BasicNameValuePair("app_trans_id", appTransId));
        params.add(new BasicNameValuePair("mac", mac));

        URIBuilder uri = new URIBuilder(config.get("endpoint2"));
        uri.addParameters(params);

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(uri.build());
        post.setEntity(new UrlEncodedFormEntity(params));

        BufferedReader rd = new BufferedReader(new InputStreamReader(client.execute(post).getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;

        while ((line = rd.readLine()) != null) {
            resultJsonStr.append(line);
        }

        return new JSONObject(resultJsonStr.toString());
    }

//    private static final String KEY2 = "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf"; // Key2 của bạn
//
//    // Hàm để tạo chữ ký HMAC từ dữ liệu
//    private String generateHMAC(String data) throws Exception {
//        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
//        hmacSHA256.init(new SecretKeySpec(KEY2.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
//        byte[] hashBytes = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
//        return Hex.encodeHexString(hashBytes).toLowerCase(); // Sử dụng Hex để mã hóa byte thành chuỗi hex
//    }
//
//    public boolean verifyCallback(Map<String, Object> payload) {
//        try {
//            String dataStr = (String) payload.get("data");
//            String reqMac = (String) payload.get("mac");
//
//            // Tính toán chữ ký từ dữ liệu nhận được
//            String computedMac = generateHMAC(dataStr);
//
//            // So sánh chữ ký đã nhận với chữ ký tính toán
//            return reqMac.equals(computedMac);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }
//
//    public void processCallback(Map<String, Object> payload) throws JSONException {
//        // Xử lý cập nhật đơn hàng trong database
//        JSONObject data = new JSONObject((String) payload.get("data"));
//        String orderId = data.getString("app_trans_id");
//        System.out.println("Đơn hàng đã thanh toán thành công: " + orderId);
//        // Thêm logic cập nhật trạng thái đơn hàng trong cơ sở dữ liệu nếu cần
//    }
}
