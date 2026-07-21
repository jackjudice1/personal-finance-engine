import { ChatWindow } from "@/components/assistant/ChatWindow";
import { PremiumGateOverlay } from "@/components/billing/PremiumGateOverlay";

export default function AssistantPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Assistant</h1>
        <p className="text-sm text-muted-foreground">Grounded in your actual numbers — not generic advice.</p>
      </div>
      <PremiumGateOverlay title="AI Assistant is a Premium feature" description="Upgrade to ask unlimited questions.">
        <ChatWindow />
      </PremiumGateOverlay>
    </div>
  );
}
