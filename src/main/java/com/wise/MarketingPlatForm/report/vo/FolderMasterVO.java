package com.wise.MarketingPlatForm.report.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
public class FolderMasterVO {
	int fldId;	
	int userNo;
	String fldNm;
	int fldOrdinal;
	int fldParentId;
	int fldLvl;
}
