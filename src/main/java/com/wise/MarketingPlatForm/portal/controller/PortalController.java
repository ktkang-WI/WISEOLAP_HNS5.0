package com.wise.MarketingPlatForm.portal.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.wise.MarketingPlatForm.mart.vo.PortalDataDTO;
import com.wise.MarketingPlatForm.mart.vo.PortalFilterDTO;
import com.wise.MarketingPlatForm.portal.service.PortalService;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/portal")
public class PortalController {
    private final PortalService portalServie;
    private final Gson gson = new Gson();

    PortalController (PortalService portalService) {
        this.portalServie = portalService;
    }

    @GetMapping("/card-data")
    public ResponseEntity<List<Map<String, Object>>> getCardData(
        @RequestParam("auth") String auth,
        @RequestParam("date") String date,
        @RequestParam("type") String type,
        @RequestParam(value = "team", required = false) String team) {
        List<Map<String, Object>> cardList = new ArrayList<>();

        PortalFilterDTO filter = new PortalFilterDTO(auth, type, date, team);

        try {
            cardList = portalServie.getCardData(filter);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().body(cardList);
    }

    
    @GetMapping("/admin-card-data")
    public ResponseEntity<List<Map<String, Object>>> getAdminCardData(
        @RequestParam("date") String date,
        @RequestParam("type") String type,
        @RequestParam("team") String team) {
        List<Map<String, Object>> cardList = new ArrayList<>();

        try {
            cardList = portalServie.getAdminCardData(date, type, team);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().body(cardList);
    }

    @GetMapping("/max-date")
    public ResponseEntity<String> getMaxDate() {
        String date = portalServie.getMaxDate();

        return ResponseEntity.ok().body(date);
    }

    @GetMapping("/portal-info")
    public ResponseEntity<Map<String, Object>> getPortalInfo(@RequestParam("auth") String auth) {
        Map<String, Object> result = portalServie.getPortalInfo(auth);

        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/portal-config")
    public ResponseEntity<PortalDataDTO> getPortalConfig() {
        PortalDataDTO result = portalServie.getPortalConfig();

        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/team-list")
    public ResponseEntity<List<Map<String, Object>>> getTeamList(
        @RequestParam("date") String date,
        @RequestParam("auth") String auth
    ) {
        PortalFilterDTO filter = new PortalFilterDTO(auth, null, date, null);

        List<Map<String, Object>> list = portalServie.getTeamList(filter);

        return ResponseEntity.ok().body(list);
    }
    
    @PutMapping("/portal-config")
    public ResponseEntity<String> setPortalConfig(@RequestBody Map<String, Object> body) {
        String data = body.get("data").toString();

        if (data == null) {
            return ResponseEntity.internalServerError().body("전송된 데이터가 없습니다.");
        }

        PortalDataDTO portalDataDTO = gson.fromJson(data, PortalDataDTO.class);
        
        try {
            portalServie.setPortalConfig(portalDataDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
        
        
        return ResponseEntity.ok().body("");
    }
}
