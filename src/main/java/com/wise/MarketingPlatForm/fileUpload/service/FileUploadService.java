package com.wise.MarketingPlatForm.fileUpload.service;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import com.wise.MarketingPlatForm.global.util.WebFileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

	private final File spreadReportFolder;

	private FileUploadService() {
		spreadReportFolder = new File(new File("UploadFiles"), "spread_reports");
		if (!this.spreadReportFolder.isDirectory()) {
	        this.spreadReportFolder.mkdirs();
	    }
	}
	
	public void saveFile(MultipartFile file, String fileName) throws Exception {
        try (InputStream input = file.getInputStream()) {
        	File sysFile = WebFileUtils.getFile(spreadReportFolder, fileName);
        	if(sysFile == null) new Exception("spread File create Error");
			Files.copy(input, sysFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        }
    }

	public void deleteFile(String fileName) throws Exception {
		File file = WebFileUtils.getFile(spreadReportFolder, fileName);
		if (!file.delete()) {
			new Exception("spread File delete Exception");
		}
		
	}
	
	public byte[] fileImport(String fileName) throws Exception {
		byte[] fileByte = null;
		File file = WebFileUtils.getFile(spreadReportFolder, fileName);
		Path filePath = file.toPath();
		fileByte = Files.readAllBytes(filePath);

		return fileByte;
	}
}