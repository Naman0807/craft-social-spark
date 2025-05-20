
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

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
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // If login event, fetch profile data
        if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('remaining_free_posts, is_subscribed')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setRemainingFreePosts(data.remaining_free_posts);
        setIsSubscribed(data.is_subscribed);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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

  const decrementRemainingPosts = async () => {
    if (!isSubscribed && remainingFreePosts > 0) {
      const newCount = remainingFreePosts - 1;
      
      setRemainingFreePosts(newCount);
      
      if (user) {
        try {
          await supabase
            .from('profiles')
            .update({ remaining_free_posts: newCount })
            .eq('id', user.id);
        } catch (error) {
          console.error('Error updating remaining posts:', error);
        }
      }
      
      if (newCount === 0) {
        toast({
          title: "Free trial completed",
          description: "You've used all your free posts. Subscribe to continue using PostCraft.",
          variant: "default",
        });
      }
    }
  };

  const canGeneratePost = (): boolean => {
    return isSubscribed || remainingFreePosts > 0;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRemainingFreePosts(3);
    setIsSubscribed(false);
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
    session,
    user,
    signOut,
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
