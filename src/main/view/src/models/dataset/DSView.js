import instance from 'models/instance';

const path = '/dataset';

export const getByUserId = (userId) => {
  return instance.post(path + '/ds-views', {
    userId: userId
  });
};
