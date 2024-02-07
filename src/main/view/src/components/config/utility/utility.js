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
