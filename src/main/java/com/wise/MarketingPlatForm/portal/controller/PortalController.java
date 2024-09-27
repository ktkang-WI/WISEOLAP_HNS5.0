package com.wise.MarketingPlatForm.portal.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wise.MarketingPlatForm.mart.vo.MartResultDTO;
import com.wise.MarketingPlatForm.portal.service.PortalService;
import com.wise.MarketingPlatForm.portal.vo.CardDataDTO;

@RestController
@RequestMapping("/portal")
public class PortalController {
    private final PortalService portalServie;

    PortalController (PortalService portalService) {
        this.portalServie = portalService;
    }

    @GetMapping("/card-data")
    public ResponseEntity<List<Map<String, Object>>> getCardData(@RequestParam("date") String date) {
        List<Map<String, Object>> cardList = new ArrayList<>();

        try {
            cardList = portalServie.getCardData(date);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().body(cardList);
    }
}
