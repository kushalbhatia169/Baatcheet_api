import { useContext } from 'react';
import { context } from '../store/store';

const useGetRoute = () => {
  const { state: { routesUrl } } = useContext(context);

  const getRoute = (route) => {
    let foundUrl = null;
    for (let item in routesUrl) {
      if (item.toLowerCase() === route.toLowerCase() && !foundUrl) {
        foundUrl = routesUrl[item];
        return foundUrl;
      }
    }
    return foundUrl;
  };
  return { getRoute };
};

export default useGetRoute;
