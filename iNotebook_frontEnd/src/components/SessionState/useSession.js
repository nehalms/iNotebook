import { useSelector } from 'react-redux';

const useSession = () => {
  const isLoggedIn = useSelector((state) => state.session.isLoggedIn);
  const isAdmin = useSelector((state) => state.session.isAdmin);
  const permissions_ = useSelector((state) => state.session.permissions);
  const secretKey = useSelector((state) => state.session.secretKey);

  return {
    isLoggedIn,
    isAdmin,
    permissions_,
    secretKey,
  };
};

export default useSession;