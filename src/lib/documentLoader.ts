import { MultiFileLoader } from "langchain/document_loaders/fs/multi_file";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Configure the document loader
export async function loadDocuments() {
  try {
    const loader = new MultiFileLoader(
      [
        "src/document_loaders/marginfi.txt",
        // Add more file paths as needed
      ],
      {
        ".txt": (path) => new TextLoader(path),
      }
    );

    const docs = await loader.load();

    // Split documents into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splits = await splitter.splitDocuments(docs);
    return splits;
  } catch (error) {
    console.error("Error loading documents:", error);
    return [];
  }
}

// Optional: Load all documents from a directory
export async function loadDirectoryDocuments() {
  try {
    const loader = new DirectoryLoader("src/document_loaders", {
      ".txt": (path) => new TextLoader(path),
    });

    const docs = await loader.load();

    // Split documents into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splits = await splitter.splitDocuments(docs);
    return splits;
  } catch (error) {
    console.error("Error loading directory documents:", error);
    return [];
  }
}
