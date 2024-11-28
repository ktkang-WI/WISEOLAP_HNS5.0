package com.wise.MarketingPlatForm.portal.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.wise.MarketingPlatForm.mart.vo.PortalCardQueryMstrVO;
import com.wise.MarketingPlatForm.mart.vo.PortalFilterDTO;
import com.wise.MarketingPlatForm.mart.vo.PortalReportMstrVO;
import com.wise.MarketingPlatForm.mart.vo.PortalTeamQueryMstrVO;
import com.wise.MarketingPlatForm.mart.vo.PortalTypeMstrVO;

@Mapper
public interface PortalDAO {
    public PortalCardQueryMstrVO selectPortalCardQueryMstr(PortalFilterDTO filter);

    public PortalTeamQueryMstrVO selectPortalTeamQueryMstr(PortalFilterDTO filter);

    public List<PortalTypeMstrVO> selectPortalTypeMstr(String auth);

    public List<PortalReportMstrVO> selectPortalReportMstr(String auth);

    public List<PortalCardQueryMstrVO> selectAllPortalCardQueryMstr();

    public List<PortalTeamQueryMstrVO> selectAllPortalTeamQueryMstr();

    public List<PortalTypeMstrVO> selectAllPortalTypeMstr();

    public List<PortalReportMstrVO> selectAllPortalReportMstr();

    public void deleteAllPortalCardQueryMstr();

    public void deleteAllPortalTeamQueryMstr();

    public void deleteAllPortalTypeMstr();

    public void deleteAllPortalReportMstr();

    public void insertPortalCardQueryMstr(List<PortalCardQueryMstrVO> cards);

    public void insertPortalTypeMstr(List<PortalTypeMstrVO> types);

    public void insertPortalReportMstr(List<PortalReportMstrVO> reports);

    public void insertPortalTeamQueryMstr(List<PortalTeamQueryMstrVO> teams);
}
