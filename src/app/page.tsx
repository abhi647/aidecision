"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Plus } from "lucide-react";
import Sidebar, { AnalysisHistoryView } from "@/components/Sidebar";
import { getAllSessions, saveSession, deleteSession, StoredSession } from "@/lib/session-history";
import SmartPrompts from "@/components/SmartPrompts";
import BriefCard from "@/components/BriefCard";
import InsightCard from "@/components/InsightCard";
import ScenarioModeling from "@/components/ScenarioModeling";
import AssumptionsDrawer from "@/components/AssumptionsDrawer";
import RCACard, { RCANode } from "@/components/RCACard";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  analysis?: AnalysisResult;
}

interface AnalysisResult {
  message: string;
  insights: {
    title: string;
    takeaway: string;
    chartType:
      | "bar"
      | "pie"
      | "line"
      | "area"
      | "scatter"
      | "heatmap"
      | "radar"
      | "donut"
      | "histogram"
      | "bubble";
    data: any[];
    confidence: "high" | "medium" | "low";
  }[];
  recommendations: string[];
  timestamp: string;
  rca?: {
    title: string;
    rootNode: RCANode;
    conclusion: string;
  };
  briefCard?: {
    headline: string;
    keyDrivers: string[];
    recommendations: string[];
    sentiment: "positive" | "negative" | "neutral";
  };
}

// Simple markdown renderer for AI answer text
function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n').filter(Boolean);
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Bullet points
        if (line.match(/^[-•*]\s/)) {
          const content = line.replace(/^[-•*]\s/, '');
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)', marginTop: '0.45rem' }} />
              <span dangerouslySetInnerHTML={{ __html: boldify(content) }} />
            </div>
          );
        }
        // Numbered list
        if (line.match(/^\d+\.\s/)) {
          const num = line.match(/^(\d+)\./)![1];
          const content = line.replace(/^\d+\.\s/, '');
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="font-semibold flex-shrink-0" style={{ color: 'var(--primary)', minWidth: '1.2rem' }}>{num}.</span>
              <span dangerouslySetInnerHTML={{ __html: boldify(content) }} />
            </div>
          );
        }
        // Normal paragraph
        return <p key={i} dangerouslySetInnerHTML={{ __html: boldify(line) }} />;
      })}
    </div>
  );
}

function boldify(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// Generate query-contextual loading steps so the indicator feels specific to what's being computed
function getLoadingSteps(query: string): string[] {
  const q = query.toLowerCase();

  // PVM / revenue / margin diagnosis
  if (q.includes('margin') || q.includes('revenue') || q.includes('pvm') || q.includes('price volume')) {
    return [
      'Scanning H1 vs H2 revenue records...',
      'Computing price realization per SKU...',
      'Isolating volume and mix effects...',
      'Running PVM decomposition...',
      'Quantifying regional variance drivers...',
      'Drafting diagnostic conclusions...',
    ];
  }

  // Distribution / outlet / coverage
  if (q.includes('outlet') || q.includes('distribution') || q.includes('coverage') || q.includes('beat')) {
    return [
      'Pulling outlet master data...',
      'Computing active vs inactive outlet counts...',
      'Measuring beat-level productivity...',
      'Identifying coverage gaps by region...',
      'Benchmarking against numeric distribution targets...',
      'Composing outlet health scorecard...',
    ];
  }

  // Brand / SKU performance
  if (q.includes('brand') || q.includes('sku') || q.includes('product') || q.includes('target crunch') || q.includes('target foods')) {
    return [
      'Loading SKU-level transaction data...',
      'Computing brand contribution margins...',
      'Benchmarking against category average...',
      'Analysing SKU velocity by channel...',
      'Identifying portfolio mix shifts...',
      'Generating brand health summary...',
    ];
  }

  // Channel / trade / modern trade
  if (q.includes('channel') || q.includes('trade') || q.includes('wholesaler') || q.includes('ecommerce')) {
    return [
      'Aggregating sales by trade channel...',
      'Computing channel-wise contribution margins...',
      'Mapping transaction frequency per channel...',
      'Identifying high-value vs declining channels...',
      'Running channel mix trend analysis...',
      'Composing channel strategy insights...',
    ];
  }

  // Regional / geography
  if (q.includes('region') || q.includes('north') || q.includes('south') || q.includes('east') || q.includes('west')) {
    return [
      'Filtering region-level transaction data...',
      'Computing revenue and volume per region...',
      'Benchmarking regions against national average...',
      'Identifying top and bottom performers...',
      'Mapping seasonal patterns by geography...',
      'Generating regional action plan...',
    ];
  }

  // Causal / root cause / why
  if (q.includes('why') || q.includes('diagnose') || q.includes('root cause') || q.includes('reason')) {
    return [
      'Scanning for anomaly signals in the data...',
      'Mapping causal factors to business metrics...',
      'Decomposing variance using MECE framework...',
      'Validating hypotheses against transaction data...',
      'Ranking root causes by impact magnitude...',
      'Preparing diagnostic brief...',
    ];
  }

  // Scenario / optimization / what-if
  if (q.includes('scenario') || q.includes('optimize') || q.includes('what if') || q.includes('fix')) {
    return [
      'Loading current performance baseline...',
      'Defining constraint parameters...',
      'Running supply-demand equilibrium model...',
      'Evaluating pricing and volume lever combinations...',
      'Computing expected revenue improvement...',
      'Generating prescriptive action plan...',
    ];
  }

  // Trend / forecast / seasonal
  if (q.includes('trend') || q.includes('forecast') || q.includes('seasonal') || q.includes('growth')) {
    return [
      'Loading 12-month time-series data...',
      'Detecting seasonality patterns...',
      'Fitting trend line using regression...',
      'Computing month-over-month deltas...',
      'Projecting forward trajectory...',
      'Generating trend narrative...',
    ];
  }

  // Default / general overview
  return [
    'Connecting to FMCG sales database...',
    'Aggregating KPI metrics...',
    'Cross-referencing distributor and outlet data...',
    'Identifying key performance drivers...',
    'Structuring analytical narrative...',
    'Finalising board-ready insights...',
  ];
}

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState<string[]>(getLoadingSteps(''));
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(
    null,
  );
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isExporting, setIsExporting] = useState(false);
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => Date.now().toString());
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    setSessions(getAllSessions());
  }, []);

  // Auto-save session whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (!firstUserMsg) return;
    const session: StoredSession = {
      id: currentSessionId,
      title: firstUserMsg.content.slice(0, 80),
      createdAt: firstUserMsg.timestamp instanceof Date
        ? firstUserMsg.timestamp.toISOString()
        : new Date().toISOString(),
      messageCount: messages.length,
      messages: messages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : String(m.timestamp),
        analysis: m.analysis,
      })),
    };
    saveSession(session);
    setSessions(getAllSessions());
  }, [messages, currentSessionId]);

  // Cycle through loading steps — loops until API responds
  useEffect(() => {
    if (!isLoading) { setLoadingStep(0); return; }
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingSteps.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [isLoading, loadingSteps]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoadingSteps(getLoadingSteps(message));
    setIsLoading(true);


    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const analysisResult: AnalysisResult = await response.json();
      setCurrentAnalysis(analysisResult);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: analysisResult.message,
        timestamp: new Date(),
        analysis: analysisResult,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentAnalysis(analysisResult);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, I encountered an error analyzing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setMessages([]);
    setCurrentSessionId(Date.now().toString());
    setCurrentSection("dashboard");
  };

  const handleLoadSession = (session: StoredSession) => {
    const restored = session.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
    setMessages(restored as ChatMessage[]);
    setCurrentSessionId(session.id);
    setCurrentSection('dashboard');
  };

  const handleDeleteSession = (id: string) => {
    deleteSession(id);
    setSessions(getAllSessions());
  };

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };
  const handleDrillDown = (insightTitle: string, dataPoint: any) => {
    const drillDownQuery = `Drill down into ${dataPoint.name || dataPoint.x || dataPoint.range || 'this item'} for ${insightTitle}`;
    handleSendMessage(drillDownQuery);
  };

  const handleDiagnose = (insightTitle: string) => {
    const diagnoseQuery = `Diagnose the root cause for: ${insightTitle}`;
    handleSendMessage(diagnoseQuery);
  };

  const getNextQuestions = (query: string) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("target crunch") || lowerQuery.includes("target foods") || lowerQuery.includes("brand")) {
      return [
        "Show Target Crunch regional performance breakdown",
        "Compare Target Crunch vs competitor brands",
        "What's driving Target Crunch growth?",
        "Diagnose the root cause for Target Crunch margin dip",
      ];
    }
    if (lowerQuery.includes("region") || lowerQuery.includes("sales")) {
      return [
        "Which regions have highest margins?",
        "Show seasonal trends by region",
        "Region-wise distributor performance",
        "Diagnose root cause of South region decline",
      ];
    }
    if (lowerQuery.includes("sku") || lowerQuery.includes("product")) {
      return [
        "Top 10 performing SKUs",
        "SKU profitability analysis",
        "New product launch opportunities",
        "Diagnose root cause of underperforming SKUs",
      ];
    }
    // Default next questions
    return [
      "Break down by region",
      "Show seasonal patterns",
      "Compare channel performance",
      "Diagnose root cause of margin dip",
    ];
  };


  const handleNavigate = (section: string) => {
    const quickActionPrompts: Record<string, string> = {
      'margins': 'Show me a detailed margin analysis and explain any dips.',
      'brands': 'How is the Target Crunch brand performing overall?',
      'channels': 'Provide a breakdown of our channel mix performance.',
      'outlets': 'Analyze our outlet coverage and performance.'
    };

    if (quickActionPrompts[section]) {
      // Trigger chat for quick action and stay on dashboard
      handleSendMessage(quickActionPrompts[section]);
      setCurrentSection("dashboard");
    } else {
      // Normal navigation
      setCurrentSection(section);
    }
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("chat-container");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const doc = new jsPDF("p", "mm", "a4");
      let position = 0;

      doc.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
        );
        heightLeft -= pageHeight;
      }

      doc.save("Boardroom_Copilot_Report.pdf");
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar
        onNewAnalysis={handleNewAnalysis}
        onNavigate={handleNavigate}
        onLoadSession={handleLoadSession}
        currentSection={currentSection}
        sessions={sessions}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="main-header border-b flex items-center justify-between px-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center space-x-4">
            <h2
              className="text-[var(--text-title)] font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              {currentSection === "dashboard" && "Data Analysis Dashboard"}
              {currentSection === "analysis-history" && "Analysis History"}
              {currentSection === "saved-insights" && "Saved Insights"}
              {currentSection === "settings" && "Settings"}
              {![
                "dashboard",
                "analysis-history",
                "saved-insights",
                "settings",
              ].includes(currentSection) && "Analysis Results"}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            {messages.length > 0 && (
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className="btn-secondary"
              >
                {isExporting ? "Exporting..." : "📄 Export PDF"}
              </button>
            )}
            <button onClick={handleNewAnalysis} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          </div>
        </header>

        {/* Content Area - Extra bottom padding so content never hides behind the sticky input + assumptions bar */}
        <div
          className="flex-1 overflow-auto p-6"
          id="chat-container"
          style={{ paddingBottom: currentSection === "dashboard" ? "200px" : "80px" }}
        >
          {/* Welcome State */}
          {messages.length === 0 && currentSection === "dashboard" && (
            <div className="max-w-6xl mx-auto">
              <SmartPrompts onPromptSelect={handlePromptSelect} />
            </div>
          )}

          {/* Analysis History full-page view */}
          {currentSection === "analysis-history" && (
            <AnalysisHistoryView
              sessions={sessions}
              onLoadSession={handleLoadSession}
              onNavigate={handleNavigate}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {/* Other placeholder sections */}
          {(currentSection === "saved-insights" || currentSection === "settings") && (
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">
                {currentSection === "saved-insights" && "Saved Insights"}
                {currentSection === "settings" && "Settings"}
              </h2>
              <p className="text-slate-500 max-w-md">
                This section is under construction. More tools and configurations will be available here soon.
              </p>
            </div>
          )}


          {/* Chat History */}
          {messages.length > 0 && currentSection === "dashboard" && (
            <div className="max-w-6xl mx-auto space-y-8">
              {messages.map((message, index) => {
                const isLatestAssistant = message.role === 'assistant' && index === messages.length - 1;
                const isOldAssistant = message.role === 'assistant' && index < messages.length - 1;
                return (<div key={message.id} className="space-y-6">
                  {/* User Message */}
                  {message.role === "user" && (
                    <div className="chat-message user">
                      <div className="flex items-start space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          <User
                            className="w-4 h-4"
                            style={{ color: "var(--primary-foreground)" }}
                          />
                        </div>
                        <div>
                          <div
                            className="font-medium mb-1"
                            style={{ color: "var(--text-primary)" }}
                          >
                            You
                          </div>
                          <div style={{ color: "var(--text-secondary)" }}>
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Assistant Response - COLLAPSED for old messages, EXPANDED for latest */}
                  {message.role === "assistant" && message.analysis && (
                    isOldAssistant ? (
                      // Collapsed view for old messages
                      <div className="chat-message assistant opacity-70">
                        <div className="flex items-start space-x-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, var(--peacock) 0%, var(--true-turquoise) 100%)" }}
                          >
                            <Bot className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium mb-1 text-sm" style={{ color: "var(--text-primary)" }}>Copilot</div>
                            <div className="text-sm line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                              {message.analysis.briefCard?.headline || message.analysis.message.slice(0, 120) + '...'}
                            </div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              {message.analysis.insights.slice(0, 2).map((ins, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--primary-light, #e0f2fe)', color: 'var(--primary)' }}>
                                  {ins.title}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Full expanded view for latest message
                      <div className="space-y-6">
                        <div className="chat-message assistant">
                          <div className="flex items-start space-x-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "linear-gradient(135deg, var(--peacock) 0%, var(--true-turquoise) 100%)" }}
                            >
                              <Bot className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>Copilot</div>
                              <div style={{ color: "var(--text-secondary)", lineHeight: '1.7' }}>
                                <MarkdownText text={message.analysis.message} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Brief Card */}
                        {message.analysis.briefCard && (
                          <BriefCard
                            headline={message.analysis.briefCard.headline}
                            keyDrivers={message.analysis.briefCard.keyDrivers}
                            recommendations={message.analysis.briefCard.recommendations}
                            sentiment={message.analysis.briefCard.sentiment}
                            confidence="high"
                          />
                        )}

                        {/* Insight Cards */}
                        {message.analysis.insights.map((insight, idx) => (
                          <InsightCard
                            key={idx}
                            title={insight.title}
                            takeaway={insight.takeaway}
                            chartType={insight.chartType}
                            data={insight.data}
                            confidence={insight.confidence}
                            sentiment={insight.takeaway.toLowerCase().includes("decline") || insight.takeaway.toLowerCase().includes("drop") || insight.takeaway.toLowerCase().includes("negative") || insight.title.toLowerCase().includes("dip") ? "negative" : "neutral"}
                            onDrillDown={(dataPoint) => handleDrillDown(insight.title, dataPoint)}
                            onDiagnose={() => handleDiagnose(insight.title)}
                          />
                        ))}

                        {/* RCA Card */}
                        {message.analysis.rca && (
                          <RCACard
                            title={message.analysis.rca.title}
                            rootNode={message.analysis.rca.rootNode}
                            conclusion={message.analysis.rca.conclusion}
                          />
                        )}
                      </div>
                    )
                  )}

                  {/* "What's Next?" follow-up questions - only below the latest assistant message */}
                  {isLatestAssistant && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>🤔 Explore further</p>
                      <div className="flex flex-wrap gap-2">
                        {getNextQuestions(
                          messages.filter((m) => m.role === "user").pop()?.content || "",
                        ).map((question, qIndex) => (
                          <button
                            key={qIndex}
                            onClick={() => handleSendMessage(question)}
                            className="skill-chip text-left justify-start text-sm"
                          >
                            🔍 {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={isLatestAssistant ? chatBottomRef : undefined} />
                </div>
                );
              })}


              {/* Loading State — animated multi-step progress */}
              {isLoading && (
                <div className="chat-message assistant">
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse"
                      style={{ background: "linear-gradient(135deg, var(--peacock) 0%, var(--true-turquoise) 100%)" }}
                    >
                      <Bot className="w-4 h-4" style={{ color: "var(--primary-foreground)" }} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-3" style={{ color: "var(--text-primary)" }}>Copilot</div>
                      <div className="space-y-2">
                        {loadingSteps.map((step: string, i: number) => {
                          const isActive = i === loadingStep;
                          return (
                            <div key={i} className={`flex items-center gap-2 text-sm transition-all duration-400 ${isActive ? 'opacity-100' : 'opacity-35'}`}>
                              <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center" style={{
                                border: isActive ? 'none' : '1.5px solid var(--border)',
                                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                              }}>
                                {isActive && (
                                  <svg className="animate-spin w-3 h-3 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                  </svg>
                                )}
                              </div>
                              <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive ? 500 : 400 }}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={isLoading ? chatBottomRef : undefined} />
            </div>
          )}
        </div>

        {/* Question Input (Static at bottom of main content) */}
        {currentSection === "dashboard" && (
          <div
            className="w-full shrink-0 border-t bg-white z-10"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              paddingBottom: "72px", // Space for the Assumptions Drawer
            }}
          >
            <div className="max-w-6xl mx-auto px-6 py-4">
              <div className="input-container shadow-sm border rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          input.trim() &&
                          handleSendMessage(input.trim())
                        }
                        placeholder="Ask your Target Foods / Target Crunch analysis question here... e.g., 'Show me regional performance breakdown'"
                        className="input-field h-14 text-base"
                        disabled={isLoading}
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        input.trim() && handleSendMessage(input.trim())
                      }
                      disabled={!input.trim() || isLoading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed h-14 px-6"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </main>

      {/* Assumptions Drawer */}
      <AssumptionsDrawer
        dataSources={["Target_Foods_Sales_2024_2025.csv", "Nielsen_Snack_Category_Tracker_2025.csv"]}
        dateRange={{
          start: "Jan 2024",
          end: "Dec 2025",
        }}
        recordCount={6552374}
        coverage={{
          outlets: 1247,
          skus: 156,
          regions: 12,
        }}
        methodology={[
          "Statistical outlier detection (>3σ)",
          "Seasonal adjustment applied",
          "Time-series trend analysis",
          "Cross-validation with external benchmarks",
        ]}
        confidence="high"
        limitations={[
          "External market factors not included",
          "Limited competitive intelligence data",
          "Some regional data gaps in Q1",
        ]}
      />
    </div>
  );
}
