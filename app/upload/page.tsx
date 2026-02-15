// src/app/upload/page.tsx
"use client";

import { useState } from "react";
import { processPdfFile } from "./action";
import { Card, CardContent } from "@/components/ui/card";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, FileText, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
              <FileText className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Upload Medical Documents
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Upload your cancer-related medical documents for AI-powered analysis and personalized guidance
          </p>
          
          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Instant Processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Upload Card */}
          <Card className="border-2 border-gray-200 shadow-2xl shadow-indigo-500/10 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 p-1">
              <CardContent className="pt-8 pb-8 bg-white">
                <div className="space-y-6">
                  {/* Drag and Drop Area */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                      ${
                        dragActive
                          ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                          : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/50"
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

                    <div className="flex flex-col items-center gap-4">
                      {isLoading ? (
                        <>
                          <div className="rounded-full bg-indigo-100 p-6">
                            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-semibold text-gray-700">
                              Processing your document...
                            </p>
                            <p className="text-sm text-gray-500">
                              This may take a few moments
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg shadow-indigo-500/30">
                            <Upload className="h-12 w-12 text-white" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-semibold text-gray-700">
                              {dragActive ? "Drop your file here" : "Drag & drop your PDF here"}
                            </p>
                            <p className="text-sm text-gray-500">
                              or click to browse files
                            </p>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-600 font-medium">
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
                      <div className="flex items-start gap-3">
                        {message.type === "error" ? (
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <AlertTitle className="text-base font-semibold">
                            {message.type === "error" ? "Upload Failed" : "Success!"}
                          </AlertTitle>
                          <AlertDescription className="text-sm mt-1">
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
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="rounded-lg bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Private & Secure</h3>
              <p className="text-sm text-gray-600">
                Your documents are encrypted and processed securely. We never share your data.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="rounded-lg bg-indigo-100 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">
                Advanced AI analyzes your documents in seconds for quick insights.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="rounded-lg bg-purple-100 w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Information</h3>
              <p className="text-sm text-gray-600">
                All insights are based on trusted medical sources and guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}