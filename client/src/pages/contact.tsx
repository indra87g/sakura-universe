import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, MessageSquare, Clock, Twitter, Youtube, Twitch } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="contact-title">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="contact-description">
            Have questions, suggestions, or need support? We're here to help and would love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-card rounded-xl border border-border pixel-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-card-foreground" data-testid="contact-info-title">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4" data-testid="contact-email">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">Email Support</h4>
                      <p className="text-muted-foreground text-sm mb-1">For general inquiries and support</p>
                      <a href="mailto:support@sakurauniverse.net" className="text-primary hover:text-accent transition-colors" data-testid="email-link">
                        support@sakurauniverse.net
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4" data-testid="contact-discord">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">Discord Community</h4>
                      <p className="text-muted-foreground text-sm mb-1">Join our active Discord server</p>
                      <a href="#" className="text-primary hover:text-accent transition-colors" data-testid="discord-link">
                        discord.gg/sakurauniverse
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4" data-testid="contact-hours">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">Support Hours</h4>
                      <p className="text-muted-foreground text-sm">Available 7 days a week</p>
                      <p className="text-muted-foreground">9:00 AM - 11:00 PM (UTC)</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4 text-card-foreground" data-testid="social-title">Follow Us</h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground" data-testid="social-twitter">
                      <Twitter className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground" data-testid="social-youtube">
                      <Youtube className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-primary hover:text-primary-foreground" data-testid="social-twitch">
                      <Twitch className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-card rounded-xl border border-border pixel-shadow">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-card-foreground" data-testid="contact-form-title">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-2">
                    Subject
                  </Label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="appeal">Ban Appeal</SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="resize-none"
                    required
                    data-testid="textarea-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 font-semibold pixel-shadow transition-all hover:translate-y-[-2px] hover:shadow-lg"
                  disabled={contactMutation.isPending}
                  data-testid="button-send-message"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
