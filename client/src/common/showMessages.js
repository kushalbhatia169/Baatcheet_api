
import { notification } from 'antd';
import { getNotificationStyle } from './getNotificarionStyle';

export const showMessage = (message, isCallbackCall, type, setIsOtp, setCaptchaContainer, history) => {

    notification[type]({
        message: (type === 'error' && 'An Error occurred') || 'Success',
        description: message,
        style: getNotificationStyle(type),
        duration: 10,
        onClose: () => {
            if (isCallbackCall) {
                setIsOtp(false);
                setCaptchaContainer();
                history.push('/login');
            }
        },
    });
};

export const checkConfirmPassword = (password, confirmPasssword) => {
    if (password !== confirmPasssword) {
        notification['error']({
            message: 'An Error occurred',
            description: 'Password and Confirm Password shoulde be same.',
            style: getNotificationStyle('error'),
            duration: 10,
        });
    }
    else {
        return true;
    }
};