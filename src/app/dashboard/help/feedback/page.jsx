"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Lightbulb, Bug, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

export const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState("feature-requests");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for your feedback! We'll review it shortly.");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 text-foreground bg-background">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#D99A25] to-[#F2B84B] bg-clip-text text-transparent">
          Feedback & Feature Requests
        </h1>
        <p className="text-[#8FA0B5]">
          Help us improve Splash AI Studio with your suggestions
        </p>
      </div>

      {/* Feedback Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Lightbulb,
            title: "Feature Requests",
            description: "Suggest new features",
            color: "from-[#D99A25] to-[#F2B84B]",
            value: "feature-requests",
          },
          {
            icon: Bug,
            title: "Bug Reports",
            description: "Report issues",
            color: "from-[#FF6565] to-[#D99A25]",
            value: "bug-reports",
          },
          {
            icon: Sparkles,
            title: "General Feedback",
            description: "Share your thoughts",
            color: "from-[#D99A25] to-[#F2B84B]",
            value: "general-feedback",
          },
        ].map((type, idx) => {
          const isActive = feedbackType === type.value;

          return (
            <div
              key={idx}
              onClick={() => setFeedbackType(type.value)}
              className={`cursor-pointer border rounded-xl p-6 text-center transition-all duration-300 shadow-md hover:-translate-y-1 ${
                isActive
                  ? "ring-2 ring-[#D99A25] bg-[#2A2114] border-[#D99A25]"
                  : "bg-[#171613] border-[#3A2A12] hover:border-[#D99A25]/60"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-gradient-to-r ${type.color} text-[#11100D]`}
              >
                <type.icon className="w-6 h-6" />
              </div>

              <h3 className="font-semibold mb-1 text-[#F4F1E9]">
                {type.title}
              </h3>

              <p className="text-sm text-[#8FA0B5]">
                {type.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Feedback Form */}
      <div className="bg-[#171613] rounded-xl shadow-lg border border-[#3A2A12]">
        <div className="p-6 border-b border-[#3A2A12]">
          <h2 className="text-xl font-semibold text-[#F4F1E9]">
            Submit Your Feedback
          </h2>
          <p className="text-sm text-[#8FA0B5] mt-1">
            We read every submission and use your feedback to improve.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-[#F4F1E9]">
                Feedback Type
              </Label>

              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger
                  id="type"
                  className="border-[#3A2A12] bg-[#11100D] text-[#F4F1E9] focus:ring-[#D99A25]"
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-[#3A2A12] bg-[#171613] text-[#F4F1E9]">
                  <SelectItem value="feature-requests">Feature Request</SelectItem>
                  <SelectItem value="bug-reports">Bug Report</SelectItem>
                  <SelectItem value="general-feedback">General Feedback</SelectItem>
                  {/* <SelectItem value="ui-ux">UI/UX Improvement</SelectItem>
                  <SelectItem value="performance">Performance Issue</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-[#F4F1E9]">
                Subject *
              </Label>
              <Input
                id="subject"
                placeholder="Brief summary of your feedback"
                required
                className="border-[#3A2A12] bg-[#11100D] text-[#F4F1E9] placeholder:text-[#6F7D8F] focus-visible:ring-[#D99A25] focus-visible:border-[#D99A25]"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#F4F1E9]">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information..."
                rows={6}
                required
                className="border-[#3A2A12] bg-[#11100D] text-[#F4F1E9] placeholder:text-[#6F7D8F] focus-visible:ring-[#D99A25] focus-visible:border-[#D99A25]"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#F4F1E9]">
                Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="border-[#3A2A12] bg-[#11100D] text-[#F4F1E9] placeholder:text-[#6F7D8F] focus-visible:ring-[#D99A25] focus-visible:border-[#D99A25]"
              />
              <p className="text-xs text-[#8FA0B5]">
                We'll reach out if we need more information about your feedback.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#D99A25] hover:bg-[#F2B84B] text-[#11100D] font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition"
              size="lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </form>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-[#171613] border border-[#3A2A12] rounded-xl shadow-md">
        <div className="p-6">
          <h3 className="font-semibold mb-3 text-[#F4F1E9]">
            Recent Updates Based on Your Feedback
          </h3>

          <ul className="space-y-2 text-sm text-[#8FA0B5]">
            <li className="flex items-start gap-2">
              <span className="text-[#D99A25] mt-1">✓</span>
              <span>
                Added human model upload feature with auto-background detection
              </span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-[#D99A25] mt-1">✓</span>
              <span>Improved generation speed by 40% across all image types</span>
            </li>

            <li className="flex items-start gap-2">
              <span className="text-[#D99A25] mt-1">✓</span>
              <span>Introduced project collaboration with role-based permissions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feedback;