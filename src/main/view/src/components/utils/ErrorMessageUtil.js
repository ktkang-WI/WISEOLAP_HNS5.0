export let newMsg = '';
export let newServerMsg = '';
// eslint-disable-next-line prefer-const
let messageQue = [];

export const ErrorMessageUtil = (
    errorMsg,
    serverDetailMsg,
    cnt
) => {
  if (errorMsg && errorMsg !== 'noDisplayMsg') {
    if (!messageQue.includes(newMsg)) {
      newMsg = newMsg + errorMsg;
      messageQue.push(newMsg);
    }
  }

  if (serverDetailMsg && serverDetailMsg !== 'noDisplayMsg') {
    newServerMsg = newServerMsg + serverDetailMsg;
  }

  if (cnt == 1) {
    if (newServerMsg) {
      const messages = {newMsg, newServerMsg};
      return messages;
    } else if (newMsg) {
      const messages = {newMsg};
      return messages;
    }
  }
};

export const initParams = (requestPath) => {
  newMsg = '';
  newServerMsg ='';
  requestPath = [];
  messageQue = [];
};
