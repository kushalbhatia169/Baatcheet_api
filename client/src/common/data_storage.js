/* currenly using local storage */
/* main setValue funtion to set localStorage Value*/

export const setValue = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return true;
};

/* main getValue funtion to get localStorage Value*/
export const getValue = (key) => {
  const userStr = JSON.parse(localStorage.getItem(key));
  if (userStr) return userStr;
  else return null;
};

/* main removeValue funtion */
export const removeValue = (key) => {
  localStorage.removeItem(key);
  return true;
};


