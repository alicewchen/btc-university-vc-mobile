import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Copy, CheckCircle, Wallet, Mail } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface ClaimedWallet {
  id: number;
  address: string;
  privateKey: string;
  claimedByEmail: string;
  claimedAt: Date;
  claimed: boolean;
}

export function EmailWalletOnboarding() {
  const [claimedWallet, setClaimedWallet] = useState<ClaimedWallet | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Check if user already has a wallet
  const email = form.watch("email");
  const { data: existingWallet } = useQuery<ClaimedWallet | null>({
    queryKey: ["/api/wallets/by-email", email],
    enabled: !!email && z.string().email().safeParse(email).success,
  });

  // Get an unclaimed wallet
  const { data: unclaimedWallet } = useQuery<ClaimedWallet | null>({
    queryKey: ["/api/wallets/unclaimed"],
  });

  const claimWalletMutation = useMutation({
    mutationFn: async (data: { email: string; walletAddress: string }): Promise<ClaimedWallet> => {
      const response = await fetch("/api/wallets/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to claim wallet");
      return response.json();
    },
    onSuccess: (wallet: ClaimedWallet) => {
      setClaimedWallet(wallet);
      queryClient.invalidateQueries({ queryKey: ["/api/wallets/by-email", email] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallets/unclaimed"] });
      toast({
        title: "Wallet Claimed!",
        description: "Your wallet has been successfully set up.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to claim wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    if (existingWallet) {
      setClaimedWallet(existingWallet);
      return;
    }

    if (!unclaimedWallet) {
      toast({
        title: "No Wallets Available",
        description: "No pregenerated wallets available. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    claimWalletMutation.mutate({
      email: data.email,
      walletAddress: unclaimedWallet.address,
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (claimedWallet || existingWallet) {
    const wallet = claimedWallet || existingWallet;
    if (!wallet) return null;
    return (
      <Card className="w-full max-w-md mx-auto" data-testid="card-wallet-claimed">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Wallet Ready!</CardTitle>
          <CardDescription>
            Your Sepolia testnet wallet has been set up for {wallet.claimedByEmail}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
            <div className="flex items-center gap-2">
              <Input 
                value={wallet.address} 
                readOnly 
                className="font-mono text-xs"
                data-testid="input-wallet-address"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(wallet.address, "Wallet Address")}
                data-testid="button-copy-address"
              >
                {copiedField === "Wallet Address" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Private Key</label>
            <div className="flex items-center gap-2">
              <Input 
                value={wallet.privateKey} 
                readOnly 
                type="password"
                className="font-mono text-xs"
                data-testid="input-private-key"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(wallet.privateKey, "Private Key")}
                data-testid="button-copy-private-key"
              >
                {copiedField === "Private Key" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Important:</strong> Save your private key securely. This wallet is funded on Sepolia testnet and ready for testing Bitcoin University features.
            </p>
          </div>

          <Button 
            onClick={() => {
              setClaimedWallet(null);
              form.reset();
            }}
            variant="outline"
            className="w-full"
            data-testid="button-setup-another"
          >
            Set up another wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto" data-testid="card-email-onboarding">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Wallet className="h-6 w-6 text-orange-600" />
        </div>
        <CardTitle>Get Started with Bitcoin University</CardTitle>
        <CardDescription>
          Enter your email to get a free Sepolia testnet wallet and start exploring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Enter your email address" 
                        className="pl-10"
                        data-testid="input-email"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {unclaimedWallet && (
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ Wallet available: {unclaimedWallet.address.slice(0, 6)}...{unclaimedWallet.address.slice(-4)}
                </p>
              </div>
            )}
            
            {!unclaimedWallet && (
              <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  ⚠️ No pregenerated wallets available. Contact support.
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={claimWalletMutation.isPending || !unclaimedWallet}
              data-testid="button-claim-wallet"
            >
              {claimWalletMutation.isPending ? "Setting up wallet..." : 
               existingWallet ? "Access Your Wallet" : 
               "Get My Free Wallet"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our terms of service and privacy policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
}