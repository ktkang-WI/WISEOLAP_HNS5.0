const test = (value) => {
  const ids = ['admin', 'test', 'yglee'];
  if (ids.includes(value)) {
    return false;
  } else {
    return true;
  }
};
export default test;
