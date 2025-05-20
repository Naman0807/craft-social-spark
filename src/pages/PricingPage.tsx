import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useAppContext } from "@/contexts/AppContext";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PricingPage = () => {
  const { isSubscribed, setIsSubscribed, remainingFreePosts, user } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    try {
      // In a real app, this would redirect to a payment processor
      const { error } = await supabase
        .from('profiles')
        .update({ is_subscribed: true })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsSubscribed(true);
      toast({
        title: "Subscription Activated",
        description: "Thank you for subscribing to PostCraft Premium!",
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to activate subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-12 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that's right for you and start creating engaging LinkedIn content today.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Trial */}
        <Card className={`border ${remainingFreePosts > 0 && !isSubscribed ? 'border-postcraft-primary shadow-md' : 'border-gray-200'}`}>
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold">Free Trial</h2>
            <p className="text-gray-600">Try before you buy</p>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <div className="my-4">
              <span className="text-4xl font-bold">$0</span>
            </div>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>3 LinkedIn Posts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>3 Custom Images</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Basic AI Templates</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            {remainingFreePosts > 0 && !isSubscribed ? (
              <div className="w-full text-center">
                <p className="text-sm mb-2">
                  <span className="font-semibold">{remainingFreePosts}</span> posts remaining
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                {isSubscribed ? "Upgrade from Premium" : "No posts remaining"}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Premium Monthly */}
        <Card className={`border ${isSubscribed ? 'border-postcraft-primary shadow-md' : 'border-gray-200'}`}>
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center">
              <h2 className="text-2xl font-bold">Premium</h2>
              {isSubscribed && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                  Your Plan
                </span>
              )}
            </div>
            <p className="text-gray-600">Monthly subscription</p>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <div className="my-4">
              <span className="text-4xl font-bold">$15</span>
              <span className="text-gray-600 ml-1">/month</span>
            </div>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Unlimited LinkedIn Posts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Unlimited Custom Images</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Advanced AI Templates</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Cancel Anytime</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            {isSubscribed ? (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button 
                className="w-full bg-postcraft-primary hover:bg-postcraft-accent"
                onClick={handleSubscribe}
              >
                {user ? "Subscribe Now" : "Sign In to Subscribe"}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Annual Plan */}
        <Card className="border border-gray-200">
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold">Premium Annual</h2>
            <p className="text-gray-600">Save 17%</p>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <div className="my-4">
              <span className="text-4xl font-bold">$149</span>
              <span className="text-gray-600 ml-1">/year</span>
            </div>
            <ul className="space-y-3 text-left mb-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Unlimited LinkedIn Posts</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Unlimited Custom Images</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Advanced AI Templates</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                <span><strong>2 months free</strong></span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast({
                title: "Coming Soon",
                description: "Annual subscriptions will be available soon!",
              })}
            >
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Do I need my own OpenAI API key?</h3>
            <p className="text-gray-600">Yes, PostCraft requires you to use your own OpenAI API key. This ensures you have full control over your API usage and costs.</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">How are OpenAI API costs handled?</h3>
            <p className="text-gray-600">You'll be billed separately by OpenAI for your API usage. PostCraft subscription only covers access to our platform features.</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-gray-600">We offer a 14-day money-back guarantee if you're not satisfied with your subscription.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
