import { NextRequest, NextResponse } from 'next/server'
import { analyzeWithClaude, AnalysisRequest } from '@/lib/claude'

const TERM_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bAcme Corp\b/gi, 'Target Foods Pvt. Ltd.'],
  [/\bDFM Foods Ltd\. \(Crax Portfolio\)\b/gi, 'Target Foods Pvt. Ltd.'],
  [/\bDFM Foods Ltd\.\b/gi, 'Target Foods Pvt. Ltd.'],
  [/\bDFM Foods\b/gi, 'Target Foods'],
  [/\bZest Soda\b/gi, 'Target Crunch'],
  [/\bCrax\b/gi, 'Target Crunch'],
  [/\bGeneric_FMCG_Sales\.csv\b/gi, 'Target_Foods_Sales_2024_2025.csv'],
  [/\bDFM_Bizom_Sales_2024_2025\.csv\b/gi, 'Target_Foods_Sales_2024_2025.csv'],
]

function normalizeTerms<T>(value: T): T {
  if (typeof value === 'string') {
    return TERM_REPLACEMENTS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), value as string) as T
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeTerms(item)) as T
  }
  if (value && typeof value === 'object') {
    const normalized: Record<string, unknown> = {}
    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      normalized[key] = normalizeTerms(nestedValue)
    }
    return normalized as T
  }
  return value
}

export async function POST(request: NextRequest) {
  let message = '';
  try {
    const body = await request.json()
    message = body.message

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const analysisRequest: AnalysisRequest = {
      query: message,
      context: {
        company: 'Target Foods Pvt. Ltd.',
        brand: 'Target Crunch',
        dataSource: 'Target_Foods_Sales_2024_2025.csv',
        dateRange: '2024-2025'
      }
    }

    const response = normalizeTerms(await analyzeWithClaude(analysisRequest))

    // --- Orchestration Layer ---
    // 1. Claude ALWAYS runs first and generates a context-aware RCA tree natively.
    // 2. Python PVM engine is ONLY called for pure revenue/margin variance math.
    // 3. Python overrides Claude's RCA only when it has algebraically exact PVM data.
    // For all other scenarios (supply chain, coverage, NPS, market share),
    // Claude's AI-generated RCA (Fishbone, MECE, 5-Whys etc.) is used as-is.
    const queryLower = message.toLowerCase()
    let insightMessage = response.answer;
    let rcaData = response.rca ?? undefined;   // Claude-generated AI-RCA
    let scenarioData = undefined;

    // Only activate Python for pure revenue/margin PVM math verification
    const needsPvmMath = (
      queryLower.includes("margin dip") ||
      queryLower.includes("revenue drop") ||
      queryLower.includes("pvm") ||
      queryLower.includes("price volume") ||
      (queryLower.includes("margin") && (queryLower.includes("diagnose") || queryLower.includes("why")))
    );
    const needsScenario = (
      queryLower.includes("fix") ||
      queryLower.includes("optimize") ||
      queryLower.includes("scenario") ||
      queryLower.includes("what if")
    );

    if (needsPvmMath || needsScenario) {
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 8000);
        const pythonResponse = await fetch("http://127.0.0.1:8001/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
          signal: ctrl.signal
        });
        clearTimeout(tid);

        if (pythonResponse.ok) {
          const pyData = normalizeTerms(await pythonResponse.json());
          // PVM math overrides Claude's RCA only for revenue/margin queries
          if (pyData.rca && needsPvmMath) {
            rcaData = {
              title: "Mathematical PVM Diagnostic",
              rootNode: pyData.rca,
              conclusion: pyData.insight || "Root causes isolated algebraically into Price, Volume, and Mix impacts."
            };
          }
          if (pyData.scenario) {
            scenarioData = pyData.scenario;
            insightMessage = `${insightMessage}\n\n**Optimization Engine:** ${pyData.insight}`;
          }
        }
      } catch (e) {
        // Python is optional — Claude's AI-RCA is already available
        console.error("Python Engine Unreachable (non-blocking):", e);
      }
    }

    return NextResponse.json({
      message: insightMessage,
      insights: response.insights,
      recommendations: response.recommendations,
      briefCard: response.briefCard,
      rca: rcaData,
      scenario: scenarioData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Fallback response for demo purposes
    const fallbackInsights = [
      {
        title: "Target Crunch Brand Performance Analysis",
        takeaway: "Based on the sales data pattern, Target Crunch shows strong performance in key markets with opportunities for expansion.",
        chartType: "bar" as const,
        data: [
          { name: 'North', value: 2400 },
          { name: 'South', value: 1800 },
          { name: 'East', value: 2200 },
          { name: 'West', value: 2600 }
        ],
        confidence: "high" as const
      },
      {
        title: "Sales Trend Analysis",
        takeaway: "Monthly sales trends indicate seasonal patterns with peak performance in Q2 and Q4.",
        chartType: "line" as const,
        data: [
          { name: 'Jan', value: 1200 },
          { name: 'Feb', value: 1400 },
          { name: 'Mar', value: 1800 },
          { name: 'Apr', value: 2200 },
          { name: 'May', value: 2400 },
          { name: 'Jun', value: 2100 }
        ],
        confidence: "medium" as const
      }
    ]

    const queryLower = message.toLowerCase()
    let rcaData = undefined;
    let scenarioData = undefined;
    let insightMessage = "I'm analyzing Target Foods Target Crunch sales data. Here's what I found based on the sales patterns...";

    if (
      queryLower.includes("diagnose") || 
      queryLower.includes("why") || 
      queryLower.includes("margin") ||
      queryLower.includes("fix") ||
      queryLower.includes("optimize") ||
      queryLower.includes("scenario")
    ) {
      try {
        const pythonResponse = await fetch("http://127.0.0.1:8001/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message })
        });
        
        if (pythonResponse.ok) {
          const pyData = normalizeTerms(await pythonResponse.json());
          if (pyData.rca) {
            rcaData = {
              title: "Mathematical PVM Diagnostic",
              rootNode: pyData.rca,
              conclusion: pyData.insight || "The root causes of the variance have been algebraically isolated into price, volume, and mix impacts."
            };
          }
          if (pyData.scenario) {
            scenarioData = pyData.scenario;
            insightMessage = `${insightMessage}\n\n**System Recommendation:** ${pyData.insight}`;
          }
          if (pyData.rca && !pyData.scenario) {
            insightMessage = `${insightMessage}\n\n**Diagnostic Engine:** ${pyData.insight}`;
          }
        }
      } catch (e) {
        console.error("Python Engine Unreachable in fallback:", e);
      }
    }

    return NextResponse.json({
      message: insightMessage,
      insights: fallbackInsights,
      recommendations: [
        "Increase marketing spend in North region during Q4",
        "Optimize inventory levels for seasonal peaks",
        "Consider expanding product line in high-performing regions"
      ],
      rca: rcaData,
      scenario: scenarioData,
      timestamp: new Date().toISOString()
    })
  }
}
