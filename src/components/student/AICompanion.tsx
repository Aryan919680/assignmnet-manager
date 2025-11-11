import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bot, Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AICompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI study companion. I can help you with your assignments, answer questions, and provide study tips. What would you like help with today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Simulated AI response - replace with actual AI integration
      setTimeout(() => {
        const assistantMessage: Message = {
          role: "assistant",
          content: "I'm here to help! This is a simulated response. To enable real AI features, integrate with an AI service like OpenAI or use Lovable AI."
        };
        setMessages(prev => [...prev, assistantMessage]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Failed to get response");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">AI Study Companion</h2>
          <p className="text-muted-foreground">
            Your personal assistant for academic success
          </p>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Chat with AI
          </CardTitle>
          <CardDescription>
            Ask questions, get study tips, or discuss your assignments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg px-4 py-2">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
