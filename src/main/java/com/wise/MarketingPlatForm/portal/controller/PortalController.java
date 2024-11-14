package com.wise.MarketingPlatForm.portal.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.portal.service.PortalService;

@RestController
@RequestMapping("/portal")
public class PortalController {
    private final PortalService portalServie;

    PortalController (PortalService portalService) {
        this.portalServie = portalService;
    }

    @GetMapping("/card-data")
    public ResponseEntity<List<Map<String, Object>>> getCardData(@RequestParam("date") String date, @RequestParam("type") String type) {
        List<Map<String, Object>> cardList = new ArrayList<>();

        try {
            cardList = portalServie.getCardData(date, type);
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

    @GetMapping("/team-list")
    public ResponseEntity<List<Map<String, Object>>> getTeamList(@RequestParam("date") String date) {
        List<Map<String, Object>> list = portalServie.getTeamList(date);

        return ResponseEntity.ok().body(list);
    }
    
    
}
