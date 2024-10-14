package com.wise.MarketingPlatForm.account.controller.user;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.wise.MarketingPlatForm.account.model.user.measure.UserMeasureModel;
import com.wise.MarketingPlatForm.account.service.user.UserMeasureService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/user/measure")
public class UserMeasureController {
    @Autowired
    UserMeasureService userMeasureService;

    private Type userDataModelType = new TypeToken<List<UserMeasureModel>>() {
    }.getType();
    private Gson gson = new Gson();

    @GetMapping
    public ResponseEntity<RestAPIVO> getUserData() throws Exception {

        List<UserMeasureModel> model = userMeasureService.getUserMeasure();

        if (model == null)
            return RestAPIVO.conflictResponse(null);

        return RestAPIVO.okResponse(model);
    }

    @PutMapping
    public ResponseEntity<RestAPIVO> putUserData(
            @RequestParam(required = false, defaultValue = "data") String key,
            @RequestBody Map<String, Object> body) throws Exception {

        String grpDataPutData = gson.toJson(body.get(key));

        if (!body.containsKey(key)) {
            return RestAPIVO.badRequest(false);
        }

        List<UserMeasureModel> userDataModel = gson.fromJson(grpDataPutData, userDataModelType);

        boolean result = userMeasureService.putUserMeasure(userDataModel);

        return RestAPIVO.okResponse(result);
    }
}
