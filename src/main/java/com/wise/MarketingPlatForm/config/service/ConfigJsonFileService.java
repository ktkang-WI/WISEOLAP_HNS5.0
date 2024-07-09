package com.wise.MarketingPlatForm.config.service;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ConfigJsonFileService {
  
  private final ObjectMapper objectMapper;

  @Value("$(config.json)")
  private String jsonFilePath;

  public ConfigJsonFileService(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public <T> T readJsonFromFile(Class<T> valueType) throws IOException {
        return objectMapper.readValue(new File(jsonFilePath), valueType);
    }

    public <T> void writeJsonToFile(T data) throws IOException {
        objectMapper.writeValue(new File(jsonFilePath), data);
    }

}
