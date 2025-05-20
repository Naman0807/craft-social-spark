
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  remainingFreePosts: number;
  setRemainingFreePosts: (count: number) => void;
  isSubscribed: boolean;
  setIsSubscribed: (status: boolean) => void;
  checkApiKeyValidity: () => Promise<boolean>;
  decrementRemainingPosts: () => void;
  canGeneratePost: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem("openai_api_key") || "");
  const [remainingFreePosts, setRemainingFreePosts] = useState<number>(() => {
    const stored = localStorage.getItem("remaining_free_posts");
    return stored ? parseInt(stored) : 3;
  });
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    return localStorage.getItem("is_subscribed") === "true";
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("openai_api_key", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("remaining_free_posts", remainingFreePosts.toString());
  }, [remainingFreePosts]);

  useEffect(() => {
    localStorage.setItem("is_subscribed", isSubscribed.toString());
  }, [isSubscribed]);

  const checkApiKeyValidity = async (): Promise<boolean> => {
    if (!apiKey) return false;
    
    try {
      // Simple check if it looks like an OpenAI API key
      if (!apiKey.startsWith("sk-") || apiKey.length < 30) {
        return false;
      }
      
      // In a real app, you'd validate the key by making a small request to OpenAI
      // This is a simplified check
      return true;
    } catch (error) {
      console.error("Error validating API key:", error);
      return false;
    }
  };

  const decrementRemainingPosts = () => {
    if (!isSubscribed && remainingFreePosts > 0) {
      setRemainingFreePosts(prev => {
        const newCount = prev - 1;
        if (newCount === 0) {
          toast({
            title: "Free trial completed",
            description: "You've used all your free posts. Subscribe to continue using PostCraft.",
            variant: "default",
          });
        }
        return newCount;
      });
    }
  };

  const canGeneratePost = (): boolean => {
    return isSubscribed || remainingFreePosts > 0;
  };

  const value = {
    apiKey,
    setApiKey,
    remainingFreePosts,
    setRemainingFreePosts,
    isSubscribed,
    setIsSubscribed,
    checkApiKeyValidity,
    decrementRemainingPosts,
    canGeneratePost,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
