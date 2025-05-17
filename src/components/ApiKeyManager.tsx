
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { KeyRound, Save } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'pollinationApiKey';

const ApiKeyManager: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      toast({ title: "API Key Saved", description: "Your Pollination AI API key has been saved to localStorage.", variant: "default" });
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      toast({ title: "API Key Cleared", description: "Your Pollination AI API key has been cleared from localStorage.", variant: "default" });
    }
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-2 flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary" /> Pollination AI API Key</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Enter your Pollination AI API key. It will be stored locally in your browser.
        This key is required for the AI features to work.
      </p>
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="bg-input border-border"
        />
        <Button onClick={handleSaveKey}>
          <Save className="mr-2 h-4 w-4" /> Save Key
        </Button>
      </div>
      {!apiKey && (
         <p className="text-xs text-destructive mt-2">
           API key is not set. AI features may not work.
         </p>
      )}
       <p className="text-xs text-muted-foreground mt-3">
        <strong>Security Note:</strong> Storing API keys in browser localStorage is not recommended for production.
      </p>
    </div>
  );
};

export default ApiKeyManager;
