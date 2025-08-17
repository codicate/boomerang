import { useAccount } from "wagmi";

export const useCurrentUser = () => {
  const { address, isConnected } = useAccount();

  return {
    userId: address, // Now using wallet address as userId
    user: { address, isConnected },
    isConnected,
  };
};
