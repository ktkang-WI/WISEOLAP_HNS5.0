export const customDataInitial = () => {
  return {
    fieldId: 1,
    fieldName: '',
    expression: '',
    type: 'decimal'
  };
};

export const handleException = (customDataList) => {
  let isok = true;
  // 사용자 정의 데이터 NULL 체크
  customDataList.forEach((item)=>{
    isok = item?.fieldName && item?.expression && item?.type;
    if (isok === false) {
      return isok;
    }
  });

  return isok;
};
