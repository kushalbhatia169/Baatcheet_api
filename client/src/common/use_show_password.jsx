import { useState } from 'react';

const useShowPassword = () => {
  const [showPassword, setShowPassword] = useState(false),
        handleClickShowPassword = () => { setShowPassword(!showPassword) },
        handleMouseDownPassword = () => setShowPassword(!showPassword);

  return {
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
  };
};

export default useShowPassword;