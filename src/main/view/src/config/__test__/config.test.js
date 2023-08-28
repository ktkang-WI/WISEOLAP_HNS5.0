import {getConfig, getConfigAll} from 'config/config';

describe('Config', () => {
  it('Config Test', () => {
    const config = getConfigAll();

    expect(getConfig('test')).toEqual('TEST');

    expect(config.test).toEqual('TEST');
  });
});
