package com.wise.MarketingPlatForm.portal.dao;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.mart.vo.PortalCardQueryMstrVO;
import com.wise.MarketingPlatForm.mart.vo.PortalFilterDTO;
import com.wise.MarketingPlatForm.mart.vo.PortalReportMstrVO;
import com.wise.MarketingPlatForm.mart.vo.PortalTypeMstrVO;

@Mapper
public interface PortalDAO {
  public PortalCardQueryMstrVO selectPortalCardQueryMstr(PortalFilterDTO filter);

  public List<PortalTypeMstrVO> selectPortalTypeMstr(String auth);

  public List<PortalReportMstrVO> selectPortalReportMstr(String auth);    
}
