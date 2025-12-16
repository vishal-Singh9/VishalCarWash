import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import ChatBot with SSR disabled
const ChatBot = dynamic(() => import('../components/ChatBot'), {
  ssr: false,
});

export default function HelpPage() {
  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "We'll get back to you within 24 hours",
      details: "support@vishalcarwash.com",
      href: "mailto:support@vishalcarwash.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Mon-Sat from 8am to 8pm",
      details: "+91 98765 43210",
      href: "tel:+919876543210"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      description: "Come say hello at our office",
      details: "123 Car Care Street, Mumbai, 400001"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      description: "We're here to serve you",
      details: "8:00 AM - 8:00 PM, Daily"
    }
  ];

  const faqs = [
    {
      question: "How do I book a car wash?",
      answer: "Navigate to the 'Book Now' page, select your preferred service, choose a date and time, and complete the booking process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, and net banking. Cash on service is also available."
    },
    {
      question: "What are your working hours?",
      answer: "Our car wash services are available from 8:00 AM to 8:00 PM, seven days a week."
    },
    {
      question: "Do I need to be present during the car wash?",
      answer: "No, you don't need to be present. Just park your car at the designated spot and our team will take care of the rest."
    },
    {
      question: "How long does a standard car wash take?",
      answer: "A standard exterior wash typically takes about 30-45 minutes, while full detailing can take 2-4 hours depending on the package."
    },
    {
      question: "What safety measures do you have in place?",
      answer: "We follow strict safety protocols including regular sanitization of equipment, use of PPE by staff, and contactless payment options."
    }
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We are here to help and answer any questions you might have. 
          Look through our FAQs or contact our support team directly.
        </p>
      </div>

      {/* Contact Methods Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {contactMethods.map((method, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {method.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
              {method.href ? (
                <a 
                  href={method.href} 
                  className="text-primary hover:underline text-sm font-medium"
                >
                  {method.details}
                </a>
              ) : (
                <p className="text-sm font-medium">{method.details}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <Card className="mb-16">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <CardTitle>Send us a message</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Type your message here..." className="min-h-[120px]" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Find quick answers to common questions about our services</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-left font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      </div>
      
      {/* ChatBot Component */}
      <ChatBot />
    </>
  );
}
