package com.wise.MarketingPlatForm.fileUpload.store.token;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

// NOTE: 추후 해당 파일 로직 DB로 전환 가능성 있음.
public class TokenStorage<T> {
    private static final File FOLDER_PATH =  new File("UploadFiles/token");
    private final File file;
    private ObjectMapper objectMapper = new ObjectMapper();
    private Map<String, TokenEntry<T>> tokenMap;
    private final Class<T> valueType;

    public TokenStorage(String fileName, Class<T> valueType) {
        this.valueType = valueType;
        objectMapper.registerModule(new JavaTimeModule());
        this.file = new File(FOLDER_PATH, fileName + ".json");
        ensureFolderExists(FOLDER_PATH);
        loadTokens();
    }

    private void ensureFolderExists(File folder) {
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }

    private void loadTokens() {
        try {
            if (file.exists()) {
                TypeFactory typeFactory = objectMapper.getTypeFactory();
                tokenMap = objectMapper.readValue(
                    file, 
                    typeFactory.constructMapType(
                        Map.class, 
                        typeFactory.constructType(String.class), 
                        typeFactory.constructParametricType(TokenEntry.class, valueType)
                    )
                );
            } else {
                tokenMap = new HashMap<>();
                if (file.createNewFile()) {
                    objectMapper.writeValue(file, tokenMap);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            tokenMap = new HashMap<>();
        }
    }


    public String saveToken(T value) {
        String token = UUID.randomUUID().toString();
        tokenMap.put(token, new TokenEntry<>(value));
        try {
            objectMapper.writeValue(file, tokenMap);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return token;
    }

    public T getValue(String token) {
        TokenEntry<T> entry = tokenMap.get(token);
        if (entry != null) {
            entry.updateLastAccessed();
            try {
                objectMapper.writeValue(file, tokenMap);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return entry.getValue();
        }
        return null;
    }

    public void removeExpiredTokens(int months) {
        LocalDateTime now = LocalDateTime.now();
        tokenMap.entrySet().removeIf(entry -> ChronoUnit.MONTHS.between(entry.getValue().getLastAccessed(), now) >= months);
        try {
            objectMapper.writeValue(file, tokenMap);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}