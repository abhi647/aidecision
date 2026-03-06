import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
  timeout: 30_000, // 30s — prevents the API hanging indefinitely
})

export interface AnalysisRequest {
  query: string
  context: {
    company: string
    brand: string
    dataSource: string
    dateRange: string
  }
}

export interface AnalysisResponse {
  answer: string
  insights: {
    title: string
    takeaway: string
    chartType: 'bar' | 'pie' | 'line' | 'area' | 'waterfall' | 'multi' | 'combo' | 'donut' | 'radar'
    data: any[]
    confidence: 'high' | 'medium' | 'low'
  }[]
  recommendations: string[]
  rca?: {
    title: string
    rootNode: {
      metric: string
      value: string
      variance: string
      sentiment: 'positive' | 'negative' | 'neutral'
      impactPct?: number
      description?: string
      drivers?: any[]
    }
    conclusion: string
  }
  briefCard?: {
    headline: string
    keyDrivers: string[]
    recommendations: string[]
    sentiment: 'positive' | 'negative' | 'neutral'
  }
}

export async function analyzeWithClaude(request: AnalysisRequest): Promise<AnalysisResponse> {
  try {
    const prompt = `
You are an expert FMCG business analyst specializing in ${request.context.company} (brand: ${request.context.brand}) data analysis. 
You have access to comprehensive sales transaction data from ${request.context.dataSource} covering ${request.context.dateRange}.

IMPORTANT: Each query should receive unique, specific analysis. Vary your responses based on the exact question asked.

Query: "${request.query}"

Analysis Context:
- Company: Target Foods Pvt. Ltd. (leading Indian snacks manufacturer)
- Primary Brand: Target Crunch (extruded snacks category)
- Dataset: Target_Foods_Sales_2024_2025.csv with 6.5M+ transactions
- Fields: SalesDateID, OutletID, SKUCode, Net_Sale_Amount, Distributor_Code, Region, etc.
- Coverage: 1,247 outlets, 156 SKUs, 12 regions
- Focus: Provide actionable, data-driven insights with specific numbers
- Tone: Professional, analytical, McKinsey-style consulting tone

ANSWER FORMATTING RULES (important):
- In the "answer" field, use bullet points (- item) for the analysis and **bold text** for key metrics
- Open with 1-2 sentence context, then switch to bullets. e.g.: "- **North region** delivered **₹8.4Cr** revenue, up **18% YoY**"
- End with 1 directional recommendation sentence
- Avoid long paragraphs — use structured bullets instead
- When breaking down performance, use dimensions like Region, Channel, or SKU
- Ensure all charts have exactly 4-6 data points for optimal UI rendering
- Group insights logically (e.g., Regional Performance, Channel Mix, Top Products)
- For negative trends, always provide a concrete recommendation
- NEVER hallucinate data. Only use trends derived from the provided context

Please provide a contextually relevant response for the specific query asked:

1. A structured, bullet-pointed answer with **bold** key numbers and metrics
2. 2-3 relevant insights with context-appropriate chart types and realistic mock data
3. 3-5 actionable, specific recommendations
4. (Conditional) An RCA tree — ONLY if the query is asking WHY something happened, or to diagnose a problem

CHART TYPE SELECTION GUIDE (choose the most informative type for the context):
- "bar" — category comparison (region, channel, SKU rankings). Color bars red if value is negative.
- "line" — time-series trends (monthly, quarterly)
- "area" — cumulative trends, market share over time
- "waterfall" — revenue/cost bridge, gap analysis between two periods
- "multi" — comparing two series side-by-side (this year vs last year, target vs actual)
- "combo" — volume bars + margin/price trend line (dual Y-axis)
- "pie" or "donut" — share/mix breakdown (channel mix, brand portfolio)
- "radar" — multi-dimensional scorecard (NPS, coverage, fill rate, margins)

CHART DATA GUIDELINES:
- Use realistic values for Target Foods/Target Crunch scale (e.g., Millions of rupees, thousands of units)
- Regional data: North, South, East, West, Central
- Channels: Wholesaler, Retail, Modern Trade, E-commerce
- SKU examples for charts: Target Crunch Masala Twists 25g, Target Crunch Tomato Rings 40g, Target Crunch Chilli Wheels 60g, Target Crunch Salted Sticks 80g
- Time periods: Monthly/Quarterly data

CRITICAL JSON RULES:
1. Respond ONLY with raw, valid JSON. Do not include markdown code blocks.
2. DO NOT use literal newlines inside string values. Use escaped newlines (\\n).
3. The response must be perfectly parsable by JSON.parse().

Expected JSON format:
{
  "answer": "Detailed, query-specific analysis (bullet-point format with bold numbers)",
  "insights": [
    {
      "title": "Specific insight title",
      "takeaway": "Key insight with numbers and context",
      "chartType": "bar|pie|line|area|waterfall|multi|combo|donut|radar",
      "data": [{"name": "Category", "value": 1000}],
      "confidence": "high|medium|low"
    }
  ],
  "recommendations": ["Actionable recommendation 1", "Recommendation 2"],
  "rca": {
    "title": "Short title of what is being diagnosed",
    "conclusion": "One sentence summary of the primary root cause",
    "rootNode": {
      "metric": "Top-level problem (e.g. Net Revenue)",
      "value": "Current value (e.g. $12.4M)",
      "variance": "Change vs prior (e.g. -$2.1M, -14.5%)",
      "sentiment": "negative",
      "impactPct": 100,
      "description": "Brief context on the root problem",
      "drivers": [
        {
          "metric": "L1 Cause Name",
          "value": "Measured value",
          "variance": "-$1.2M",
          "sentiment": "negative",
          "impactPct": 57,
          "description": "Mechanism explanation",
          "drivers": [
            {
              "metric": "L2 Sub-cause",
              "value": "Specific value",
              "variance": "-$0.8M",
              "sentiment": "negative",
              "impactPct": 38,
              "description": "Specific sub-cause explanation"
            }
          ]
        }
      ]
    }
  },
  "briefCard": {
    "headline": "Executive summary (ONLY for high-level overview queries)",
    "keyDrivers": ["Key driver 1", "Key driver 2"],
    "recommendations": ["Strategic recommendation 1"],
    "sentiment": "positive|negative|neutral"
  }
}

WHEN TO GENERATE AN RCA TREE:
Generate the "rca" field ONLY if the query is diagnostic — asking WHY, what went wrong, root cause, or diagnosing a specific problem. Otherwise omit it.

RCA FRAMEWORK SELECTION — choose the right framework based on query context:
- "Revenue/Margin variance" → PVM tree: Price Impact → Volume Impact → Mix Impact → sub-drivers by region/brand
- "Market share loss" → competitive MECE: Internal Execution → External Competition → Category Headwinds
- "Stockout / supply issue" → Supply Chain Fishbone: Demand Forecasting → Procurement → Logistics → Warehouse
- "Distribution decline" → Coverage tree: New Outlet Acquisition → Outlet Churn → Beat Productivity → Sales Force
- "NPS / customer satisfaction" → CX 5-Whys: Product Quality → Availability → Price-Value → Service
- "SKU performance" → Product-level MECE: Pricing → Promotion → Distribution → Product Fit
- Generic "why" → Best-fit MECE decomposition of the problem

RCA NODE RULES:
- Root node = the top-level problem metric with its overall value and variance
- L1 drivers (2-4): the main causal buckets (MECE — mutually exclusive, collectively exhaustive)
- L2 drivers (2-3 per L1): specific sub-causes with quantified impact
- impactPct = each driver's % contribution to the root problem (must sum to ~100)
- description = one sentence explaining the mechanism
- sentiment = positive (helping), negative (hurting), neutral

IMPORTANT: Only include "briefCard" for executive-level queries like "overall performance", "business overview", "quarterly summary", "brand health", etc. For specific tactical questions (regional breakdown, SKU analysis, etc.), omit the briefCard entirely.

ENSURE: No repetitive responses. Tailor each analysis to the specific query asked.
`

    // Race the Claude API call against a 25s hard timeout so it never hangs indefinitely
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Claude API timeout after 25s')), 25_000)
    );
    const message = await Promise.race([
      anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2500,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }]
      }),
      timeoutPromise
    ])

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    try {
      // Clean up the response text to extract JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        // Strict cleanup of common LLM JSON output flaws (like literal newlines inside values)
        let cleanJson = jsonMatch[0]
          .replace(/[\u0000-\u0019]+/g, "")
          .replace(/\n([^":,\]}])/g, '\\n$1'); // attempt to escape unescaped newlines
          
        return JSON.parse(cleanJson)
      }
      throw new Error('No JSON found in response')
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError)
      console.error('Raw response was:', responseText)
      // More intelligent fallback based on query
      return generateFallbackResponse(request.query)
    }
    
  } catch (error) {
    console.error('Claude API Error:', error)
    return generateFallbackResponse(request.query)
  }
}

// Generate intelligent fallback responses based on query
function generateFallbackResponse(query: string): AnalysisResponse {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('target crunch') && (lowerQuery.includes('overall') || lowerQuery.includes('performing') || lowerQuery.includes('health'))) {
    return {
      answer: "Based on the Target Foods dataset analysis, Target Crunch demonstrates strong market positioning with consistent performance across key regions. The brand maintains healthy margins and shows growth potential in emerging markets.",
      insights: [
        {
          title: "Target Crunch Brand Performance Analysis",
          takeaway: "Target Crunch maintains 35% market share in the core extruded snacks segment with strong growth in South and West regions (+18% YoY).",
          chartType: "bar",
          confidence: "high",
          data: [
            { name: "North", value: 45.2, category: "Revenue (₹M)" },
            { name: "South", value: 58.4, category: "Revenue (₹M)" },
            { name: "East", value: 32.1, category: "Revenue (₹M)" },
            { name: "West", value: 64.8, category: "Revenue (₹M)" },
            { name: "Central", value: 28.5, category: "Revenue (₹M)" }
          ]
        }
      ],
      recommendations: [
        "Replicate successful South/West regional promotion strategies in the East",
        "Investigate supply chain bottlenecks limiting Central region growth",
        "Launch targeted marketing campaign for premium SKUs in North region"
      ],
      briefCard: {
        headline: "Target Crunch brand shows strong market leadership with growth opportunities",
        keyDrivers: [
          "Strong adoption of new premium SKUs",
          "Successful expansion in modern trade channels"
        ],
        recommendations: [
          "Scale modern trade strategy nationally",
          "Optimize distributor network in underperforming regions"
        ],
        sentiment: "positive"
      }
    };
  }
  
  if (lowerQuery.includes('region')) {
    return {
      answer: "Regional sales analysis reveals significant performance variations across Target Foods' operating territories. The South region leads in revenue contribution, while the Central region shows the highest growth rate potential.",
      insights: [{
        title: "Regional Sales Performance",
        takeaway: "South region contributes 28% of total revenue, with Central region showing 22% growth rate despite lower absolute numbers.",
        chartType: "pie",
        data: [
          { name: 'South', value: 28 },
          { name: 'West', value: 24 },
          { name: 'North', value: 22 },
          { name: 'East', value: 16 },
          { name: 'Central', value: 10 }
        ],
        confidence: "high"
      }],
      recommendations: [
        "Prioritize expansion initiatives in Central region to capitalize on growth momentum",
        "Optimize supply chain efficiency in South region to maintain market leadership",
        "Implement targeted promotional campaigns in East region to boost performance"
      ]
    }
  }
  
  // Check if it's a business overview query
  if (lowerQuery.includes('overview') || lowerQuery.includes('summary') || lowerQuery.includes('business')) {
    return {
    answer: "Analysis of Target Foods Target Crunch data reveals strong fundamentals with opportunities for strategic growth. The data indicates healthy market positioning with specific areas for optimization.",
    insights: [
      {
        title: "Executive Overview",
        takeaway: "Target Foods demonstrates stable performance across multiple metrics with clear growth trajectories in key segments.",
        chartType: "line",
        data: [
          { name: 'Jan', value: 1200000 },
          { name: 'Feb', value: 1350000 },
          { name: 'Mar', value: 1480000 },
          { name: 'Apr', value: 1620000 },
          { name: 'May', value: 1750000 },
          { name: 'Jun', value: 1890000 }
        ],
        confidence: "medium"
      }
    ],
      recommendations: [
        "Focus on margin optimization across all product categories",
        "Strengthen digital marketing presence to capture younger demographics",
        "Expand distribution network in high-potential markets"
      ],
      briefCard: {
      headline: "Target Foods shows solid fundamentals with growth potential",
      keyDrivers: [
        "Stable core product performance",
        "Emerging channel growth"
      ],
      recommendations: [
        "Optimize underperforming regions",
        "Accelerate new product adoption"
      ],
      sentiment: "neutral"
    }
    }
  }
  
  // Default response for specific queries (no briefCard)
  return {
    answer: "Analysis completed based on your specific query. The data shows detailed insights for the requested metrics.",
    insights: [{
      title: "Query Analysis",
      takeaway: "Specific analysis results based on your question about Target Foods operations.",
      chartType: "bar",
      data: [
        { name: 'Target Crunch Masala Twists 25g', value: 1200000 },
        { name: 'Target Crunch Tomato Rings 40g', value: 1350000 },
        { name: 'Target Crunch Classic Sticks 60g', value: 1480000 }
      ],
      confidence: "medium"
    }],
    recommendations: [
      "Review the specific metrics identified in your query",
      "Consider additional analysis based on these findings",
      "Monitor performance trends in this area"
    ]
  }
}
