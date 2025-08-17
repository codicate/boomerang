import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

export const useCurrentUser = () => {
  const { user } = useDynamicContext();

  return {
    userId: user?.userId,
    user,
  };
};
