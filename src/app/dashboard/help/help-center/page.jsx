"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, Book, Zap, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';

export const HelpCenter = () => {
  const categories = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      articles: 12
    },
    {
      icon: Book,
      title: 'Image Generation',
      description: 'Master all types of image generation',
      articles: 18
    },
    {
      icon: CreditCard,
      title: 'Billing & Credits',
      description: 'Manage your subscription and credits',
      articles: 8
    },
    {
      icon: Shield,
      title: 'Account & Security',
      description: 'Keep your account safe and secure',
      articles: 10
    },
  ];

  const faqs = [
    {
      question: 'How many credits does each generation cost?',
      answer: 'Plain images cost 5 credits, themed images cost 8 credits, model images cost 12 credits, and campaign images cost 15 credits.'
    },
    {
      question: 'Can I use my own model photos?',
      answer: 'Yes! You can upload human model photos with plain backgrounds and front or 3/4 angle poses for best results.'
    },
    {
      question: 'How long does image generation take?',
      answer: 'Generation times vary: plain images take 2-3 seconds, themed images 3-4 seconds, model images 4-5 seconds, and campaign images 5-6 seconds.'
    },
    {
      question: 'Can I collaborate with team members?',
      answer: 'Yes! You can invite collaborators to your projects with different roles: Owner, Editor, or Viewer permissions.'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          How can we help you?
        </h1>

        <p className="text-muted-foreground mb-6">
          Search our knowledge base or browse categories below
        </p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

          <Input
            placeholder="Search for articles, guides, or FAQs..."
            className="pl-12 h-12 text-base border-border bg-card text-foreground rounded-xl"
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {categories.map((category, idx) => (
          <Card
            key={idx}
            className="transition-all duration-300 hover:-translate-y-1 cursor-pointer group shadow-[0_16px_42px_rgba(0,0,0,0.28)] rounded-xl bg-card border border-border"
          >
            <CardContent className="p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 shadow-[0_8px_22px_rgba(205,150,57,0.16)] border border-gold-muted">
                <category.icon className="w-6 h-6 text-gold-solid" />
              </div>

              <h3 className="font-semibold text-foreground mb-2">
                {category.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-3">
                {category.description}
              </p>

              <p className="text-xs text-gold-solid font-medium">
                {category.articles} articles
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="shadow-[0_16px_42px_rgba(0,0,0,0.28)] rounded-xl bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Frequently Asked Questions
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Quick answers to common questions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`pb-6 ${idx !== faqs.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mt-1 border border-gold-muted">
                  <HelpCircle className="w-4 h-4 text-gold-solid" />
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">
                    {faq.question}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Support Card */}
      <Card className="shadow-[0_16px_42px_rgba(0,0,0,0.28)] rounded-xl bg-gradient-to-br from-gold-solid/10 to-card border border-gold-muted">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Still need help?
          </h3>

          <p className="text-muted-foreground mb-4">
            Our support team is here to assist you
          </p>

          <Button className="bg-gold-gradient hover:bg-gold-gradient/90 text-primary-foreground">
            <Link href="/dashboard/help/contact">
              Contact Support
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default HelpCenter;
