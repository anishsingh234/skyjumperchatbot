// src/app/upload/page.tsx
"use client";

import { useState } from "react";
import { processPdfFile } from "./action";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, FileText, CheckCircle2, XCircle, Sparkles, Shield, Zap } from "lucide-react";

export default function PDFUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await processFile(file);
    e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      await processFile(file);
    } else {
      setMessage({
        type: "error",
        text: "Please upload a PDF file",
      });
    }
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const result = await processPdfFile(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "PDF processed successfully",
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to process PDF",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred while processing the PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white blur-2xl opacity-30 rounded-full"></div>
              <div className="relative rounded-2xl bg-white/20 p-3 sm:p-4 backdrop-blur-sm shadow-2xl">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg px-4">
            Upload Your Documents
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-orange-100 max-w-2xl mx-auto px-4">
            Share your event details, requirements, or any documents for personalized assistance
          </p>
          
          {/* Trust Badges */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-6 px-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/95 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/95 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Fast Processing</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/95 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Instant Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="py-8 sm:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Upload Card */}
          <Card className="border-2 border-orange-200 shadow-2xl shadow-orange-500/10 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500/5 via-orange-400/5 to-orange-500/5 p-0.5 sm:p-1">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 bg-white">
                <div className="space-y-4 sm:space-y-6">
                  {/* Drag and Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300
                      ${
                        dragActive
                          ? "border-orange-500 bg-orange-50 scale-[1.02]"
                          : "border-orange-300 bg-orange-50/50 hover:border-orange-400 hover:bg-orange-50"
                      }
                      ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />

                    <div className="flex flex-col items-center gap-3 sm:gap-4">
                      {isLoading ? (
                        <>
                          <div className="rounded-full bg-orange-100 p-4 sm:p-6">
                            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-orange-600 animate-spin" />
                          </div>
                          <div className="space-y-1 sm:space-y-2">
                            <p className="text-base sm:text-lg font-semibold text-gray-800">
                              Processing your document...
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              This may take a few moments
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 blur-xl opacity-30 rounded-full"></div>
                            <div className="relative rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-4 sm:p-6 shadow-xl shadow-orange-500/30">
                              <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                            </div>
                          </div>
                          <div className="space-y-1 sm:space-y-2">
                            <p className="text-base sm:text-lg font-semibold text-gray-800 px-4">
                              {dragActive ? "Drop your file here" : "Drag & drop your PDF here"}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              or click to browse files
                            </p>
                          </div>
                          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-orange-200 rounded-lg shadow-sm">
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                            <span className="text-xs sm:text-sm text-gray-700 font-medium">
                              Supported format: PDF
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Messages */}
                  {message && (
                    <Alert
                      variant={message.type === "error" ? "destructive" : "default"}
                      className={`
                        border-2 shadow-lg
                        ${
                          message.type === "error"
                            ? "border-red-200 bg-red-50"
                            : "border-green-200 bg-green-50"
                        }
                      `}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        {message.type === "error" ? (
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <AlertTitle className="text-sm sm:text-base font-semibold">
                            {message.type === "error" ? "Upload Failed" : "Success!"}
                          </AlertTitle>
                          <AlertDescription className="text-xs sm:text-sm mt-1">
                            {message.text}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Info Section */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border-2 border-orange-100 hover:shadow-xl hover:border-orange-200 transition-all">
              <div className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Private & Secure</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Your documents are encrypted and processed securely. We never share your data with third parties.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border-2 border-orange-100 hover:shadow-xl hover:border-orange-200 transition-all">
              <div className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Fast Processing</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Advanced AI analyzes your documents in seconds for quick insights and personalized responses.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border-2 border-orange-100 hover:shadow-xl hover:border-orange-200 transition-all sm:col-span-2 lg:col-span-1">
              <div className="rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Personalized Support</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Get tailored recommendations and assistance based on your specific needs and requirements.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 sm:p-6 border-2 border-orange-200">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-orange-500 p-2 sm:p-2.5">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                  What can you upload?
                </h4>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Event requirements and planning documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Corporate event proposals or RFPs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Birthday party planning documents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>School trip authorization forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>Any other relevant documents for your booking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}