package com.wise.MarketingPlatForm.dataset.domain.upload.store;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.json.JSONObject;

public interface UploadGenerator {

    ArrayList<JSONObject> getUploadColumnList(ArrayList<JSONObject> uploadDataColumnList, File uploadFolder, String filename) throws UnsupportedEncodingException, FileNotFoundException, IOException;

}
