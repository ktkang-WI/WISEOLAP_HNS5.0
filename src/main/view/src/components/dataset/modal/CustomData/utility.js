export const customDataInitial = () => {
  return {
    fieldId: 1,
    fieldName: '',
    expression: '',
    type: 'decimal'
  };
};

export const handleException = (customDataList) => {
  const isok = false;
  // 사용자 정의 데이터 NULL 체크
  if (customDataList.length == 0) return isok;
  customDataList.forEach((item)=>{
    if (item?.fieldName && item?.expression && item?.type) {
      return isok;
    }
  });

  return !isok;
};
