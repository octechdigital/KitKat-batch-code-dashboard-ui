import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useAuthentication = () => {
  const accessDetails = useSelector((state: RootState) => state.auth);
  const userDetails = useSelector((state: RootState) => state.user);
  return {
    isLoggedIn: !!accessDetails.accessToken,
    accessToken: accessDetails.accessToken,
    user: userDetails,
  } as const;
};
