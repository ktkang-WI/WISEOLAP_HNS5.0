package com.wise.MarketingPlatForm.global.util;
import java.io.File;
import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.context.ServletContextAware;

@Component
public final class WebFileUtils implements ServletContextAware{
	
	private static ServletContext servletContext;
    private WebFileUtils() {
    	
    }
    
    @Override
    public void setServletContext(ServletContext servletContext) {
        WebFileUtils.servletContext = servletContext;
    }

    /**
     * Get the subfolder, located under the web root folder, by the {@code folderNames}. If {@code create} is
     * {@code true} and the subfolder designated by the folderNames doesn't exist yet, then this will create the
     * subfolder automatically.
     * <P>
     * For example, if {@code folderNames} is <code>{ "folder1", "folder2" }</code>, then <code>folder1/folder2</code>
     * subfolder will be retrieved. If the subfolder doesn't exist yet and {@code create} is true, then it will be
     * created automatically.
     * </P>
     * 
     * @param request servlet request
     * @param create flag whether or not to create the subfolder if it doesn't exist yet
     * @param folderNames subfolder name(s)
     * @return the subfolder, located under the web root folder, by the subfolder names
     * @throws IOException if the subfolder cannot be created
     */
    public static File getWebFolder(final boolean create, String... folderNames) throws IOException {
    	final String webRootPath = servletContext.getRealPath("/");
        final File webRootFolder = new File(webRootPath);
        final File folder = FileUtils.getFile(webRootFolder, folderNames);

        if (create && !folder.isDirectory()) {
            FileUtils.forceMkdir(folder);
        }

        return folder;
    }
    
    public static File getFile(final File folder, final String fileName) {
    	if (folder == null || fileName == null) return null;
    	final File file = FileUtils.getFile(folder, fileName);
    	return file;
    }
}