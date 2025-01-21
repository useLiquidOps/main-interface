import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ao } from "@/utils/AO";
import { signer } from "@/utils/AO";
import { arweave } from "@/utils/Arweave";
import AOProfile from "@permaweb/aoprofile";
import { useWalletAddress } from "./useWalletAddress";
import { useAOProfile } from "./useAOProfile";

interface ProfileData {
  userName: string;
  displayName: string;
  description: string;
  thumbnail?: string;
  banner?: string;
}

interface UpdateProfileData extends ProfileData {
  profileId: string;
}

interface AOProfileResponse {
  id: string;
  walletAddress: string;
  displayName: string;
  username: string;
  description: string;
  thumbnail?: string;
  banner?: string;
  version: string;
  assets: string[];
}

export function useUpdateAOProfile() {
  const { data: walletAddress } = useWalletAddress();
  const { data: profile } = useAOProfile();
  const queryClient = useQueryClient();
  
  const { createProfile, updateProfile } = AOProfile.init({
    ao,
    signer,
    arweave
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: ProfileData) => {
      console.log("Creating new profile:", data);
      if (!walletAddress) throw new Error("Wallet address not available");
      return await createProfile(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ao-profile", walletAddress] })
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      console.log("Updating existing profile:", data);
      if (!walletAddress) throw new Error("Wallet address not available");
      return await updateProfile(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ao-profile", walletAddress] })
  });

  const handleProfileUpdate = (data: Omit<ProfileData, "profileId">) => {
    const existingProfile = profile as AOProfileResponse | undefined;
    
    console.log("Handle profile update:", { data, existingProfile });

    if (existingProfile?.id) {
      return updateProfileMutation.mutate({ ...data, profileId: existingProfile.id });
    }
    return createProfileMutation.mutate(data);
  };

  return {
    createProfile: handleProfileUpdate,
    updateProfile: handleProfileUpdate,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    createError: createProfileMutation.error,
    updateError: updateProfileMutation.error,
  };
}