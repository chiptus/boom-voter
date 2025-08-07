import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { InviteValidation } from "@/types/invites";

export const useInviteValidation = () => {
  const [searchParams] = useSearchParams();
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteValidation, setInviteValidation] =
    useState<InviteValidation | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get("invite");
    if (token) {
      setInviteToken(token);
      validateInvite(token);
    }
  }, [searchParams]);

  const validateInvite = async (token: string) => {
    setIsValidating(true);
    setValidationError(null);

    try {
      const { data, error } = await supabase.rpc("validate_invite_token", {
        token,
      });

      if (error) {
        console.error("Error validating invite:", error);
        setValidationError(error.message);
        return;
      }

      if (data && data.length > 0) {
        const validation = data[0] as InviteValidation;
        setInviteValidation(validation);

        if (!validation.is_valid) {
          let message = "This invite link is no longer valid";
          switch (validation.reason) {
            case "invite_expired":
              message = "This invite link has expired";
              break;
            case "invite_overused":
              message = "This invite link has reached its usage limit";
              break;
            case "invite_deactivated":
              message = "This invite link has been deactivated";
              break;
          }
          toast({
            title: "Invalid Invite",
            description: message,
            variant: "destructive",
          });
        }
      } else {
        setValidationError("Invite not found");
        toast({
          title: "Invalid Invite",
          description: "This invite link is not valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating invite:", error);
      setValidationError("Failed to validate invite");
    } finally {
      setIsValidating(false);
    }
  };

  const useInvite = async (userId: string) => {
    if (!inviteToken) return false;

    try {
      const { data, error } = await supabase.rpc("use_invite_token", {
        token: inviteToken,
        user_id: userId,
      });

      if (error) {
        console.error("Error using invite:", error);
        toast({
          title: "Error",
          description: "Failed to join group",
          variant: "destructive",
        });
        return false;
      }

      if (data && data.length > 0) {
        const result = data[0];
        if (result.success) {
          toast({
            title: "Success",
            description: `Welcome to ${inviteValidation?.group_name}!`,
          });
          return true;
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error("Error using invite:", error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearInvite = () => {
    setInviteToken(null);
    setInviteValidation(null);
    setValidationError(null);
  };

  return {
    inviteToken,
    inviteValidation,
    isValidating,
    validationError,
    useInvite,
    clearInvite,
    hasValidInvite: inviteValidation?.is_valid === true,
  };
};
