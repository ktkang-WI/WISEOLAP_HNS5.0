package com.wise.MarketingPlatForm.account.controller.group;

import java.lang.reflect.Type;
import java.util.ArrayList;
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
import com.wise.MarketingPlatForm.account.model.groups.measure.GroupMeasureModel;
import com.wise.MarketingPlatForm.account.service.group.GroupMeasureService;
import com.wise.MarketingPlatForm.account.vo.RestAPIVO;

@RestController
@RequestMapping("/account/group/measure")
public class GroupMeasureController {
    @Autowired
    GroupMeasureService groupMeasureService;

    private Type groupDataModelType = new TypeToken<List<GroupMeasureModel>>() {
    }.getType();
    private Gson gson = new Gson();

    @GetMapping
    public ResponseEntity<RestAPIVO> getGroupData() throws Exception {

        List<GroupMeasureModel> model = groupMeasureService.getGroupMeasure();

        if (model == null)
            return RestAPIVO.conflictResponse(null);

        return RestAPIVO.okResponse(model);
    }

    @PutMapping
    public ResponseEntity<RestAPIVO> putGroupData(
            @RequestParam(required = false, defaultValue = "data") String key,
            @RequestBody Map<String, Object> body) throws Exception {

        String grpDataPutData = gson.toJson(body.get(key));

        if (!body.containsKey(key)) {
            return RestAPIVO.badRequest(false);
        }

        List<GroupMeasureModel> groupDataModel = gson.fromJson(grpDataPutData, groupDataModelType);

        boolean result = groupMeasureService.putGroupData(groupDataModel);

        return RestAPIVO.okResponse(result);
    }
}
