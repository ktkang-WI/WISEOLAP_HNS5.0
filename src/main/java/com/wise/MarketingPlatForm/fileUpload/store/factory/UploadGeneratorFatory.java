package com.wise.MarketingPlatForm.fileUpload.store.factory;

import com.wise.MarketingPlatForm.fileUpload.store.UploadGenerator;
import com.wise.MarketingPlatForm.fileUpload.store.datastore.CsvColumnGenerator;
import com.wise.MarketingPlatForm.fileUpload.store.datastore.XlsColumnGenerator;
import com.wise.MarketingPlatForm.fileUpload.store.datastore.XlsxColumnGenerator;

public class UploadGeneratorFatory {
    public UploadGenerator getDataStore(String fileType) {
        if (fileType.equalsIgnoreCase("csv")) {
            return new CsvColumnGenerator();
        }
        if (fileType.equalsIgnoreCase("xls")) {
            return new XlsColumnGenerator();
        }
        if (fileType.equalsIgnoreCase("xlsx")) {
            return new XlsxColumnGenerator();
        }

        return null;
    }
    
}
