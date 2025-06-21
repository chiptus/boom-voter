
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Link, Copy, Trash2, Calendar, Users } from "lucide-react";
import { inviteService } from "@/services/inviteService";
import type { GroupInvite } from "@/types/invites";

interface InviteManagementProps {
  groupId: string;
  groupName: string;
}

export const InviteManagement = ({ groupId, groupName }: InviteManagementProps) => {
  const [invites, setInvites] = useState<GroupInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expirationDays, setExpirationDays] = useState<string>("");
  const [maxUses, setMaxUses] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchInvites();
  }, [groupId]);

  const fetchInvites = async () => {
    try {
      const data = await inviteService.getGroupInvites(groupId);
      setInvites(data);
    } catch (error) {
      console.error('Error fetching invites:', error);
      toast({
        title: "Error",
        description: "Failed to load invites",
        variant: "destructive",
      });
    }
  };

  const generateInvite = async () => {
    setGenerating(true);
    try {
      const options: any = {};
      
      if (expirationDays) {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + parseInt(expirationDays));
        options.expiresAt = expireDate;
      }
      
      if (maxUses) {
        options.maxUses = parseInt(maxUses);
      }

      const inviteUrl = await inviteService.generateInviteLink(groupId, options);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(inviteUrl);
      
      toast({
        title: "Invite Created",
        description: "Invite link has been copied to your clipboard!",
      });
      
      // Reset form
      setExpirationDays("");
      setMaxUses("");
      
      // Refresh invites list
      fetchInvites();
    } catch (error) {
      console.error('Error generating invite:', error);
      toast({
        title: "Error",
        description: "Failed to generate invite link",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyInviteLink = async (token: string) => {
    const inviteUrl = `${window.location.origin}/?invite=${token}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast({
        title: "Copied!",
        description: "Invite link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const deleteInvite = async (inviteId: string) => {
    if (!window.confirm("Are you sure you want to delete this invite?")) return;
    
    try {
      await inviteService.deleteInvite(inviteId);
      toast({
        title: "Success",
        description: "Invite deleted successfully",
      });
      fetchInvites();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invite",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) <= new Date();
  };

  const isOverused = (invite: GroupInvite) => {
    return invite.max_uses !== null && invite.used_count >= invite.max_uses;
  };

  return (
    <div className="space-y-6">
      {/* Generate New Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5" />
            <span>Generate Invite Link</span>
          </CardTitle>
          <CardDescription>
            Create a new invite link for {groupName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiration">Expires in (days)</Label>
              <Input
                id="expiration"
                type="number"
                placeholder="Leave empty for no expiration"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="maxUses">Max uses</Label>
              <Input
                id="maxUses"
                type="number"
                placeholder="Leave empty for unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <Button 
            onClick={generateInvite} 
            disabled={generating}
            className="w-full"
          >
            {generating ? "Generating..." : "Generate Invite Link"}
          </Button>
        </CardContent>
      </Card>

      {/* Active Invites */}
      <Card>
        <CardHeader>
          <CardTitle>Active Invites</CardTitle>
          <CardDescription>
            Manage your group's invite links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invites.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No active invites. Generate one above to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        !invite.is_active ? "destructive" :
                        isExpired(invite.expires_at) ? "destructive" :
                        isOverused(invite) ? "destructive" :
                        "default"
                      }>
                        {!invite.is_active ? "Inactive" :
                         isExpired(invite.expires_at) ? "Expired" :
                         isOverused(invite) ? "Overused" :
                         "Active"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Created {formatDate(invite.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyInviteLink(invite.invite_token)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteInvite(invite.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{invite.used_count} uses</span>
                      {invite.max_uses && (
                        <span>/ {invite.max_uses}</span>
                      )}
                    </div>
                    {invite.expires_at && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Expires {formatDate(invite.expires_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
