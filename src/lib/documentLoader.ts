import {
  PlaywrightWebBaseLoader,
  Page,
  Browser,
} from "@langchain/community/document_loaders/web/playwright";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Load multiple documentation pages
export async function loadDocuments() {
  try {
    // Andromeda Documentation URLs
    const urls = [
      "https://docs.andromedaprotocol.io/andromeda/",
      "https://docs.andromedaprotocol.io/andromeda/andromeda-digital-objects/introduction-to-ados",
      "https://docs.andromedaprotocol.io/andromeda/andromeda-digital-objects/address-list",
      "https://docs.andromedaprotocol.io/andromeda/platform-and-framework/ado-classes",
      "https://docs.andromedaprotocol.io/andromeda/platform-and-framework/andromeda-messaging-protocol",
      "https://docs.andromedaprotocol.io/andromeda/getting-started/introduction",
      "https://docs.andromedaprotocol.io/andromeda/getting-started/quick-start",
      "https://docs.andromedaprotocol.io/andromeda/getting-started/installation",
      "https://docs.andromedaprotocol.io/andromeda/concepts/what-is-andromeda",
      "https://docs.andromedaprotocol.io/andromeda/concepts/ado-architecture",
    ];

    const allDocs = await Promise.all(
      urls.map(async (url) => {
        const loader = new PlaywrightWebBaseLoader(url, {
          launchOptions: {
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Added for better compatibility
          },
          gotoOptions: {
            waitUntil: "domcontentloaded",
            timeout: 30000, // Increased timeout
          },
          async evaluate(page: Page, browser: Browser) {
            await page.waitForSelector(".docs-content", { timeout: 10000 });
            return page.evaluate(() => {
              // Get main content
              const content = document.querySelector(
                ".docs-content"
              ) as HTMLElement;
              if (!content) return "";

              // Remove any unnecessary elements
              const elementsToRemove = content.querySelectorAll(
                "nav, footer, .edit-page-link"
              );
              elementsToRemove.forEach((el) => el.remove());

              // Get clean text content
              return content.innerText;
            });
          },
        });

        try {
          return await loader.load();
        } catch (error) {
          console.error(`Error loading ${url}:`, error);
          return [];
        }
      })
    );

    // Filter out empty results and flatten
    const validDocs = allDocs
      .flat()
      .filter((doc) => doc.pageContent?.trim().length > 0);

    // Split into smaller chunks for better processing
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", "! ", "? "], // Better text splitting
    });

    const splits = await splitter.splitDocuments(validDocs);
    console.log(`Successfully loaded ${splits.length} document chunks`);
    return splits;
  } catch (error) {
    console.error("Error loading documentation:", error);
    return [];
  }
}
