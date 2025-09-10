export interface ChatFeedProps {
    initialMessage: string | null;
    onClose: () => void;
    url?: string;
  }
  
export interface BrowserStep {
    text: string;
    reasoning: string;
    tool: "MESSAGE" | string;
    instruction: string;
    stepNumber?: number;
    messageId?: string;
    actionArgs?: unknown;
}
  
export interface AgentState {
    sessionId: string | null;
    sessionUrl: string | null;
    connectUrl: string | null;
    steps: BrowserStep[];
    isLoading: boolean;
}