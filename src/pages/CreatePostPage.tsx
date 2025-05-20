
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

const CreatePostPage = () => {
  const { apiKey, canGeneratePost, decrementRemainingPosts } = useAppContext();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");

  const handleGeneratePost = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings to generate content.",
        variant: "destructive",
      });
      return;
    }

    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your LinkedIn post.",
        variant: "destructive",
      });
      return;
    }

    if (!canGeneratePost()) {
      toast({
        title: "Free Trial Expired",
        description: "You've used all your free posts. Please subscribe to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call to OpenAI - In a real app, you'd make an actual API call
      setTimeout(() => {
        // Simulated response
        const samplePosts = [
          `🚀 Excited to share insights on ${topic}!\n\nIn today's rapidly evolving ${industry || "industry"}, understanding ${topic} is crucial for growth and innovation.\n\nHere are 3 key takeaways I've learned:\n\n1️⃣ The foundation of success starts with a clear vision\n2️⃣ Continuous learning is non-negotiable\n3️⃣ Building meaningful connections amplifies your impact\n\nWhat strategies have helped you navigate this area? Share your thoughts below! 👇\n\n#ProfessionalDevelopment #${topic.replace(/\s+/g, '')} #${industry.replace(/\s+/g, '')}`,
          
          `📈 I've been exploring ${topic} recently, and wanted to share some valuable lessons.\n\nThrough my journey in the ${industry || "field"}, I've realized that mastering ${topic} isn't just about technical knowledge—it's about applying principles consistently.\n\nMy top 3 insights:\n• Embrace challenges as opportunities\n• Focus on solutions, not problems\n• Measure progress with meaningful metrics\n\nHas anyone else been working with ${topic}? What's been your experience?\n\n#Innovation #${topic.replace(/\s+/g, '')} #${industry.replace(/\s+/g, '')}`,
          
          `💡 A thought on ${topic}...\n\nAfter years in ${industry || "this industry"}, I've noticed that success with ${topic} comes down to three fundamental principles:\n\n𝟭. 𝗖𝗼𝗻𝘀𝗶𝘀𝘁𝗲𝗻𝗰𝘆: Small daily improvements lead to remarkable results\n𝟮. 𝗔𝗱𝗮𝗽𝘁𝗮𝗯𝗶𝗹𝗶𝘁𝘆: The landscape is always changing; those who adapt thrive\n𝟯. 𝗖𝗼𝗹𝗹𝗮𝗯𝗼𝗿𝗮𝘁𝗶𝗼𝗻: The best innovations come from diverse perspectives\n\nWhat principle would you add to this list?\n\n#ProfessionalInsights #${topic.replace(/\s+/g, '')} #CareerDevelopment`
        ];
        
        const randomPost = samplePosts[Math.floor(Math.random() * samplePosts.length)];
        setGeneratedPost(randomPost);
        setLoading(false);
        decrementRemainingPosts();
        
        toast({
          title: "Post Generated",
          description: "Your LinkedIn post has been successfully created!",
        });
      }, 2000);
    } catch (error) {
      console.error("Error generating post:", error);
      toast({
        title: "Error",
        description: "Failed to generate post. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key in Settings to generate content.",
        variant: "destructive",
      });
      return;
    }

    if (!topic) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your image.",
        variant: "destructive",
      });
      return;
    }

    if (!canGeneratePost()) {
      toast({
        title: "Free Trial Expired",
        description: "You've used all your free posts. Please subscribe to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setImageLoading(true);
      
      // Simulate API call to OpenAI - In a real app, you'd make an actual API call
      setTimeout(() => {
        // Simulated image URLs - in a real app these would come from DALL-E API
        const placeholderImages = [
          "https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000",
          "https://images.unsplash.com/photo-1661956602944-249bcd04b63f?q=80&w=1000",
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000"
        ];
        
        const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
        setGeneratedImage(randomImage);
        setImageLoading(false);
        decrementRemainingPosts();
        
        toast({
          title: "Image Generated",
          description: "Your LinkedIn post image has been successfully created!",
        });
      }, 3000);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      setImageLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    toast({
      title: "Copied to clipboard",
      description: "Your post has been copied to clipboard.",
    });
  };

  return (
    <div className="container py-8 px-4 md:px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create LinkedIn Post</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Post Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                    Topic or Main Idea *
                  </label>
                  <Input
                    id="topic"
                    placeholder="e.g., Leadership in Remote Teams"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Industry (Optional)
                  </label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Finance, Healthcare"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                    Tone
                  </label>
                  <select
                    id="tone"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="conversational">Conversational</option>
                    <option value="inspirational">Inspirational</option>
                    <option value="educational">Educational</option>
                    <option value="thought-leadership">Thought Leadership</option>
                  </select>
                </div>
                
                <Tabs defaultValue="post">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="post">Generate Post</TabsTrigger>
                    <TabsTrigger value="image">Generate Image</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="post" className="pt-4">
                    <Button 
                      onClick={handleGeneratePost}
                      disabled={loading || !topic}
                      className="w-full bg-postcraft-primary hover:bg-postcraft-accent"
                    >
                      {loading ? "Generating..." : "Generate LinkedIn Post"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="image" className="pt-4">
                    <Button 
                      onClick={handleGenerateImage}
                      disabled={imageLoading || !topic}
                      className="w-full bg-postcraft-primary hover:bg-postcraft-accent"
                    >
                      {imageLoading ? "Generating..." : "Generate Post Image"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-7">
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated Content</h2>
                {generatedPost && (
                  <Button variant="outline" onClick={copyToClipboard} size="sm">
                    Copy
                  </Button>
                )}
              </div>
              
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-10/12" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : generatedPost ? (
                <Textarea 
                  className="min-h-[300px] linkedin-post resize-none" 
                  value={generatedPost}
                  readOnly
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Your generated post will appear here</p>
                </div>
              )}
              
              {imageLoading ? (
                <div className="mt-6">
                  <Skeleton className="h-[200px] w-full rounded-md" />
                </div>
              ) : generatedImage ? (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Generated Image</h3>
                  <img 
                    src={generatedImage} 
                    alt="Generated post image" 
                    className="w-full rounded-md shadow-sm image-preview"
                  />
                  <div className="mt-2 text-right">
                    <a 
                      href={generatedImage} 
                      download="linkedin-post-image.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-postcraft-primary hover:underline"
                    >
                      Download Image
                    </a>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Usage Tips */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Tips for Effective LinkedIn Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Start with a Hook</h3>
              <p className="text-sm text-gray-600">Begin your post with an attention-grabbing first line that makes readers want to click "see more".</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Use Short Paragraphs</h3>
              <p className="text-sm text-gray-600">Break up your text into 1-2 sentence paragraphs for better readability on mobile devices.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Include a Call to Action</h3>
              <p className="text-sm text-gray-600">End with a question or invitation for comments to boost engagement with your post.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
