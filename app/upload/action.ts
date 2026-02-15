"use server";

import { PDFParse } from "pdf-parse";
import { getData as getPdfWorkerDataUrl } from "pdf-parse/worker";
import { index } from "@/lib/pinecone";
import { generateEmbeddings } from "@/lib/embedding";
import { chunkContent } from "@/lib/chunking";

let isPdfWorkerConfigured = false;

function configurePdfWorker() {
  if (isPdfWorkerConfigured) {
    return;
  }

  PDFParse.setWorker(getPdfWorkerDataUrl());
  isPdfWorkerConfigured = true;
}

export async function processPdfFile(formData: FormData) {
  try {
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return {
        success: false,
        error: "No file uploaded",
      };
    }

    // Convert File to Uint8Array
    const bytes = await file.arrayBuffer();
    const data = new Uint8Array(bytes);

    configurePdfWorker();

    let parsedText = "";
    const parser = new PDFParse({ data });

    try {
      const result = await parser.getText();
      parsedText = result.text;
    } finally {
      await parser.destroy();
    }

    if (!parsedText || parsedText.trim().length === 0) {
      return {
        success: false,
        error: "No text found in PDF",
      };
    }

    const chunks = await chunkContent(parsedText);
    const embeddings = await generateEmbeddings(chunks);

    if (embeddings.length !== chunks.length) {
      return {
        success: false,
        error: "Embedding generation mismatch",
      };
    }

    const timestamp = Date.now();

    const vectors = chunks.map((chunk, i) => ({
      id: `pdf-${timestamp}-${i}`,
      values: embeddings[i],
      metadata: {
        text: chunk,
        source: file.name,
        chunkIndex: i,
      },
    }));

    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      await index.upsert({
        records: vectors.slice(i, i + batchSize),
      });
    }

    return {
      success: true,
      message: `Created ${vectors.length} searchable chunks`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown PDF parsing error";
    console.error("PDF processing error:", error);
    return {
      success: false,
      error: `Failed to process PDF: ${message}`,
    };
  }
}
