import axios from 'axios';
import config from '../config.json';
import $$ from 'jquery';
import { notification } from 'antd';
import { getNotificationStyle } from '../common/getNotificarionStyle.ts';
import { getCookie } from '../common/globalCookies';

const webMessageData = {
  webMessage: [],
};

const myApi = axios.create();

export const ApiWebMessage = async (props) => {
  const { webMessage, success } = props;
  const type = success ? 'info' : 'error';
  notification[type]({
    message: type === 'error' ? 'An Error occurred' : 'Info',
    description: webMessage,
    style: getNotificationStyle(type),
    duration: 0,
  });
};

const token = Buffer.from(`${config.USERNAME}:${config.PASSWORD}`, 'utf8').toString('base64');

const APICallManager = {
  getCall: (obj, data, callback) => {
    const Baseauth = data && Buffer.from(`${data.username}:${data.password}`, 'utf8').toString('base64');
    if (token) {
      myApi.defaults.headers.common['Authorization'] = `Basic ${Baseauth}`;
      myApi.defaults.headers.common['cookies'] = getCookie('token');
    }
    (async () => {
      $$('div').css('cursor', 'wait');
      await new Promise(resolve => {
        setTimeout(function() {
          resolve((async () => {
            await myApi
              .get(obj.url, { credecredentials: 'include' })
              .then(response => {
                const response_data = response.data;
                // if (response_data.success) {
                callback(response_data);
                // }
                if (!response_data.success) {
                  const message = response_data.message;
                  webMessageData.webMessage = message;
                  webMessageData.success = false;
                  ApiWebMessage({ ...webMessageData });
                }
                $$('div').css('cursor', '');
              })
              .catch((e) => {
                webMessageData.webMessage = e.message;
                webMessageData.success = false;
                ApiWebMessage({ ...webMessageData });
                $$('div').css('cursor', '');
              });
          })(),
          );
        }, 200);
      });
    })()
      .catch(() => {});
  },
  postCall: (obj, data, callback) => {
    if (token) {
      myApi.defaults.headers.common['Authorization'] = `Basic ${token}`;
      myApi.defaults.headers.common['cookies'] = getCookie('token');
    }
    const payload = data;
    (async () => {
      $$('div').css('cursor', 'wait');
      await new Promise((resolve) => {
        setTimeout(function() {
          resolve((async () => {
            await myApi
              .post(obj.url, payload, { credecredentials: 'include' })
              .then(response => {
                const response_data = response.data;
                if (response_data.success) {
                  callback(response_data);
                  const message = response_data.message;
                  webMessageData.webMessage = message;
                  webMessageData.success = true;
                  if (message) {
                    ApiWebMessage({ ...webMessageData });
                  }
                }
                else {
                  const message = response_data.message;
                  throw new Error(message);
                }
                $$('div').css('cursor', '');
              })
              .catch((e) => {
                webMessageData.webMessage = e.message;
                webMessageData.success = false;
                ApiWebMessage({ ...webMessageData });
                $$('div').css('cursor', '');
              });
          })(),
          );
        }, 1000);
      });
    })()
      .catch(() => {});
  },
  putCall: (obj, data, callback) => {
    if (token) {
      myApi.defaults.headers.common['Authorization'] = `Basic ${token}`;
      myApi.defaults.headers.common['cookies'] = getCookie('token');
    }
    const payload = data;
    (async () => {
      $$('div').css('cursor', 'wait');
      await new Promise((resolve) => {
        setTimeout(function() {
          resolve((async () => {
            await myApi
              .put(obj.url, payload)
              .then(response => {
                const response_data = response.data;
                if (response_data.success) {
                  callback(response_data);
                }
                else {
                  const message = response_data.message;
                  throw new Error(message);
                }
                $$('div').css('cursor', '');
              })
              .catch((error) => {
                const message = `${error}`;
                webMessageData.webMessage = message;
                webMessageData.success = false;
                ApiWebMessage({ ...webMessageData });
                $$('div').css('cursor', '');
              });
          })(),
          );
        }, 1000);
      });
    })()
      .catch(() => {});
  },
  deleteCall: (obj, data, callback) => {
    if (token) {
      myApi.defaults.headers.common['Authorization'] = `Basic ${token}`;
      myApi.defaults.headers.common['cookies'] = getCookie('token');
    }
    const payload = {};
    (async () => {
      $$('div').css('cursor', 'wait');
      await new Promise((resolve) => {
        setTimeout(function() {
          resolve((async () => {
            await myApi
              .delete(obj.url, data && payload)
              .then(response => {
                const response_data = response.data;
                if (response_data.success) {
                  callback(response_data);
                }
                else {
                  const message = response_data.message;
                  throw new Error(message);
                }
                $$('div').css('cursor', '');
              })
              .catch((error) => {
                const message = `${error}`;
                webMessageData.webMessage = message;
                webMessageData.success = false;
                ApiWebMessage({ ...webMessageData });
                $$('div').css('cursor', '');
              });
          })(),
          );
        }, 1000);
      });
    })()
      .catch(() => {});
  },
};

export default APICallManager;
