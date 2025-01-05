import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { embeddings } from "./embeddings";
import { loadDocuments } from "./documentLoader";

export const vectorStore = new MemoryVectorStore(embeddings);

// Initialize vector store with documents
export async function initializeVectorStore() {
  try {
    const docs = await loadDocuments();
    if (docs.length > 0) {
      await vectorStore.addDocuments(docs);
      console.log(`Loaded ${docs.length} documents into vector store`);
    }
    return true;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    return false;
  }
}

// Helper function to add documents to the vector store
export async function addDocumentsToVectorStore(texts: string[]) {
  try {
    await vectorStore.addDocuments(
      texts.map((text) => ({
        pageContent: text,
        metadata: {},
      }))
    );
    return true;
  } catch (error) {
    console.error("Error adding documents to vector store:", error);
    return false;
  }
}

// Helper function to perform similarity search
export async function performSimilaritySearch(query: string, k: number = 4) {
  try {
    const results = await vectorStore.similaritySearch(query, k);
    return results;
  } catch (error) {
    console.error("Error performing similarity search:", error);
    return [];
  }
}
