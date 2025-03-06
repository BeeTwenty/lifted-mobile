
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { KeyRound, RefreshCw, Copy, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApiKeysManagerProps {
  user: User;
}

interface ApiKey {
  id: string;
  key_name: string;
  api_key: string;
  created_at: string;
  revoked: boolean;
}

const ApiKeysManager = ({ user }: ApiKeysManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, [user]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setApiKeys(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Error fetching API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    
    try {
      setCreating(true);
      
      const { data, error } = await supabase.rpc('create_user_api_key', {
        name_param: newKeyName,
        permissions_param: ['read']
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Store only the newly created key for display
        setNewlyCreatedKey(data[0].api_key);
        setShowKeyDialog(true);
        toast.success('API key created successfully');
        setNewKeyName("");
        fetchApiKeys();
      }
    } catch (error: any) {
      toast.error(error.message || 'Error creating API key');
    } finally {
      setCreating(false);
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('api_keys')
        .update({ revoked: true })
        .eq('id', keyId)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('API key revoked successfully');
      fetchApiKeys();
    } catch (error: any) {
      toast.error(error.message || 'Error revoking API key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const toggleKeyVisibility = () => {
    setIsKeyVisible(!isKeyVisible);
  };

  const closeKeyDialog = () => {
    setShowKeyDialog(false);
    setNewlyCreatedKey(null);
    setIsKeyVisible(false);
  };

  return (
    <>
      <Card className="border-t shadow-sm">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Create and manage your API keys to access the Workoutorium API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Key name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <Button 
              onClick={createApiKey} 
              disabled={creating || !newKeyName.trim()}
            >
              {creating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4 mr-2" />}
              Create API Key
            </Button>
          </div>
          
          {apiKeys.length > 0 ? (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key name</TableHead>
                    <TableHead className="hidden sm:table-cell">Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id} className={key.revoked ? "opacity-50" : ""}>
                      <TableCell className="font-medium">
                        {key.key_name}
                        {key.revoked && (
                          <span className="ml-2 text-xs text-red-500">(Revoked)</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{formatDate(key.created_at)}</TableCell>
                      <TableCell>
                        {!key.revoked ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeApiKey(key.id)}
                          >
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Revoked</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-muted/50">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">No API keys</h3>
              <p className="text-sm text-muted-foreground">
                You haven't created any API keys yet
              </p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
            <h4 className="font-semibold">API Documentation</h4>
            <p>Use your API key in the X-API-Key header to authenticate requests. Available endpoints:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>GET /api/workouts - List all workouts</li>
              <li>POST /api/workouts - Create a new workout</li>
              <li>GET /api/exercises - List all exercises</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showKeyDialog} onOpenChange={closeKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your New API Key</DialogTitle>
            <DialogDescription>
              This is the only time your API key will be displayed. Copy it now and store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="apikey" className="sr-only">API Key</Label>
              <div className="relative">
                <Input
                  id="apikey"
                  type={isKeyVisible ? "text" : "password"}
                  value={newlyCreatedKey || ''}
                  readOnly
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={toggleKeyVisibility}
                >
                  {isKeyVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isKeyVisible ? "Hide" : "Show"} API key
                  </span>
                </Button>
              </div>
            </div>
            <Button 
              size="sm"
              className="px-3"
              onClick={() => newlyCreatedKey && copyToClipboard(newlyCreatedKey)}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={closeKeyDialog}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeysManager;
