import { useSelector } from 'react-redux';

const useSession = () => {
  const isLoggedIn = useSelector((state) => state.session.isLoggedIn);
  const isAdmin = useSelector((state) => state.session.isAdmin);
  const email = useSelector((state) => state.session.email);
  const permissions_ = useSelector((state) => state.session.permissions);
  const secretKey = useSelector((state) => state.session.secretKey);
  const isLoading = useSelector((state) => state.session.isLoading);
  const isPinSet = useSelector((state) => state.session.isPinSet);
  const isPinVerified = useSelector((state) => state.session.isPinVerified);

  return {
    isLoggedIn,
    email,
    isAdmin,
    permissions_,
    secretKey,
    isLoading,
    isPinSet,
    isPinVerified,
  };
};

export default useSession;