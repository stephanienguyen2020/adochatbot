import { FloatingChatbot } from "../components/FloatingChatbot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div>
      <FloatingChatbot />
    </div>
  );
}
