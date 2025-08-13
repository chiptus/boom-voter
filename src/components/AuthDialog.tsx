import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, Users, ArrowLeft } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  inviteToken?: string;
  groupName?: string;
}

export function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
  inviteToken,
  groupName,
}: AuthDialogProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const { toast } = useToast();

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: inviteToken
          ? `${window.location.origin}/?invite=${inviteToken}`
          : `${window.location.origin}/`,
        shouldCreateUser: true,
        data: {
          invite_token: inviteToken,
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email!",
        description:
          "We've sent you a magic link and a 6-digit code. Click the link or enter the code below.",
      });
      setStep("otp");
    }
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Welcome! You're now signed in.",
      });
      onSuccess();
    }
    setLoading(false);
  }

  async function handleResend() {
    await handleSendMagicLink({ preventDefault: () => {} } as React.FormEvent);
  }

  function handleBack() {
    setStep("email");
    setOtp("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {step === "otp" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mr-2 p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {inviteToken && groupName ? (
              <>
                <Users className="h-5 w-5" />
                <span>Join {groupName}</span>
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                <span>Join the Festival!</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "email"
              ? inviteToken && groupName
                ? `Enter your email to join ${groupName} - we'll send you a magic link and verification code!`
                : "Enter your email to sign in or create an account - no password needed!"
              : "Check your email! Click the magic link or enter the 6-digit code below."}
          </DialogDescription>
        </DialogHeader>

        {step === "email" ? (
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Magic Link & Code"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter 6-digit code</Label>
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  className="w-full justify-center"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResend}
                disabled={loading}
                className="text-sm"
              >
                Resend code
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
