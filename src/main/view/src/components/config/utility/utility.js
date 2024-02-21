export const handleRowClick = (data, setRow) => {
  setRow(_.cloneDeep(data));
};

export const duplicateValidation = (value, list) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!list.includes(value));
    }, 500);
  });
};

export const getRefInstance = (component, classNm) => {
  const element = Array.from(document.querySelectorAll('[role="tabpanel"]'))
      .filter((row) => row.className.includes('dx-item-selected'))[0]
      .getElementsByClassName(classNm);
  return component.getInstance(element[0]);
};
