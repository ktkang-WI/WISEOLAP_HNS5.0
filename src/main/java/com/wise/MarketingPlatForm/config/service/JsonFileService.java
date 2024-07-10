package com.wise.MarketingPlatForm.config.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

@Service
public class JsonFileService {
  private Gson gson = new Gson();
  private final ObjectMapper objectMapper;

  public JsonFileService(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public <T> T readJsonFromFile(Class<T> valueType, String jsonFilePath) throws Exception {
    InputStreamReader reader = new InputStreamReader(new FileInputStream(jsonFilePath), StandardCharsets.UTF_8);
    JSONParser parser = new JSONParser();
    return gson.fromJson(parser.parse(reader).toString(), valueType);
  }

  public <T> void writeJsonToFile(T data, String jsonFilePath) throws IOException {
    String json = objectMapper.writeValueAsString(data);
    objectMapper.writeValue(new File(jsonFilePath), json);
  }

}
