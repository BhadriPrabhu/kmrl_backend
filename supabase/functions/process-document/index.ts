import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DocumentMetadata {
  title: string;
  department: string;
  documentType: string;
  language: string;
  tags: string[];
  description: string;
  extractedText: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface DepartmentRoute {
  department: string;
  confidence: number;
}

interface ProcessingResult {
  summary: string;
  keywords: string[];
  isCritical: boolean;
  criticalityReason: string;
  departmentRoute: DepartmentRoute;
  aiConfidence: number;
}

const CRITICAL_KEYWORDS = [
  'urgent', 'emergency', 'critical', 'immediate', 'safety hazard',
  'accident', 'injury', 'failure', 'breach', 'violation',
  'deadline', 'overdue', 'compliance required', 'regulatory'
];

const DEPARTMENT_KEYWORDS = {
  'Operations': ['operations', 'train', 'schedule', 'maintenance', 'station', 'service'],
  'Engineering': ['engineering', 'technical', 'design', 'construction', 'infrastructure', 'system'],
  'Finance': ['finance', 'budget', 'cost', 'payment', 'invoice', 'accounting', 'expenditure'],
  'Human Resources': ['hr', 'human resources', 'employee', 'recruitment', 'payroll', 'benefits'],
  'IT': ['it', 'information technology', 'software', 'hardware', 'network', 'system', 'database'],
  'Procurement': ['procurement', 'purchase', 'vendor', 'supplier', 'contract', 'tender'],
  'Safety': ['safety', 'security', 'hazard', 'risk', 'protocol', 'emergency', 'accident']
};

function detectCriticality(text: string): { isCritical: boolean; reason: string } {
  const lowerText = text.toLowerCase();
  const foundKeywords = CRITICAL_KEYWORDS.filter(keyword => lowerText.includes(keyword));

  if (foundKeywords.length >= 2) {
    return {
      isCritical: true,
      reason: `Document contains critical keywords: ${foundKeywords.join(', ')}`
    };
  }

  return { isCritical: false, reason: '' };
}

function routeDepartment(text: string, userSelectedDept: string): DepartmentRoute {
  const lowerText = text.toLowerCase();
  const scores: { [key: string]: number } = {};

  for (const [dept, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
    scores[dept] = keywords.filter(keyword => lowerText.includes(keyword)).length;
  }

  const suggestedDept = Object.keys(scores).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const maxScore = Math.max(...Object.values(scores));
  const confidence = maxScore > 0 ? Math.min(maxScore / 5, 1) : 0.5;

  if (confidence > 0.7 && suggestedDept !== userSelectedDept) {
    return { department: suggestedDept, confidence };
  }

  return { department: userSelectedDept, confidence: 0.8 };
}

function generateSummary(text: string, maxLength: number = 500): string {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  if (sentences.length === 0) {
    return "Document summary not available - insufficient text content.";
  }

  let summary = "";
  for (const sentence of sentences.slice(0, 5)) {
    if ((summary + sentence).length > maxLength) break;
    summary += sentence.trim() + ". ";
  }

  return summary.trim() || sentences[0].trim() + ".";
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);

  const frequency: { [key: string]: number } = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

function processDocument(metadata: DocumentMetadata): ProcessingResult {
  const { extractedText, department } = metadata;

  const summary = generateSummary(extractedText);
  const keywords = extractKeywords(extractedText);
  const { isCritical, reason } = detectCriticality(extractedText);
  const departmentRoute = routeDepartment(extractedText, department);

  const aiConfidence = 0.85;

  return {
    summary,
    keywords,
    isCritical,
    criticalityReason: reason,
    departmentRoute,
    aiConfidence
  };
}

async function checkWorkingHours(): Promise<boolean> {
  const now = new Date();
  const hour = now.getUTCHours() + 5.5;
  const adjustedHour = hour >= 24 ? hour - 24 : hour;
  const day = now.getUTCDay();

  const isWeekday = day >= 1 && day <= 5;
  const isWorkingHours = adjustedHour >= 9 && adjustedHour < 18;

  return isWeekday && isWorkingHours;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const metadata: DocumentMetadata = await req.json();

    if (!metadata.extractedText || metadata.extractedText.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: "No text content to process"
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = processDocument(metadata);

    const isWorkingHours = await checkWorkingHours();
    const shouldSendImmediateAlert = result.isCritical && !isWorkingHours;

    return new Response(
      JSON.stringify({
        ...result,
        shouldSendImmediateAlert,
        processedAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to process document"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
