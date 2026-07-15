const queryInput = document.getElementById("query");
const modeSelect = document.getElementById("mode");
const preferenceSelect = document.getElementById("preference");
const askBtn = document.getElementById("askBtn");
const exampleBtn = document.getElementById("exampleBtn");
const resultBox = document.getElementById("result");

const knowledgeItems = [
  {
    id: "password-reset",
    mode: "support",
    keywords: ["password", "reset", "login"],
    confidence: 0.94,
    recommendedFormats: ["text", "image"],
    reason: "Step-based user action is fastest with text plus visual guidance.",
    responses: {
      text: "Go to Settings → Security → Reset Password. You will receive a one-time OTP and must create a new strong password.",
      image: "UI guide: Reset screen with highlighted OTP and password policy fields.",
      audio: "Voice walkthrough explaining each reset step and OTP verification.",
      video: "45-second product walkthrough video for password reset flow."
    },
    sources: ["text: FAQ-102", "image: UI Screenshot Set B", "video: Onboarding Clip 01"]
  },
  {
    id: "invoice-download",
    mode: "support",
    keywords: ["invoice", "billing", "receipt", "download"],
    confidence: 0.9,
    recommendedFormats: ["text", "video"],
    reason: "Billing tasks often need exact click path and short confirmation demo.",
    responses: {
      text: "Open Billing → Invoices → Select month → Download PDF.",
      image: "Billing tab map with navigation highlights.",
      audio: "Narration describing invoice export and email fallback.",
      video: "30-second video showing invoice export and download validation."
    },
    sources: ["text: Billing KB-14", "video: Billing Training Snippet", "image: Billing UI map"]
  },
  {
    id: "api-timeout",
    mode: "developer",
    keywords: ["api", "timeout", "latency", "retry", "gateway"],
    confidence: 0.88,
    recommendedFormats: ["image", "text", "video"],
    reason: "Flow diagnostics are easier with architecture diagrams + concise explanation.",
    responses: {
      text: "Timeout occurs at API Gateway after 15s; retry policy is exponential backoff with max 3 attempts.",
      image: "Architecture sequence diagram: Client → Gateway → Service → Queue fallback.",
      audio: "Audio brief on timeout thresholds, retries, and queue failover.",
      video: "Technical screencast reviewing request trace and failure path."
    },
    sources: ["text: Tech Spec API-09", "image: Sequence Diagram v4", "audio: Incident Postmortem Brief", "video: Engineering Deep Dive"]
  },
  {
    id: "auth-flow",
    mode: "developer",
    keywords: ["auth", "token", "jwt", "oauth", "backend", "flow"],
    confidence: 0.92,
    recommendedFormats: ["video", "image", "text"],
    reason: "Security flows are best understood via sequence visuals and guided narration.",
    responses: {
      text: "Auth flow: OAuth callback → token exchange → JWT issuance → role-based policy check at gateway.",
      image: "Token lifecycle diagram with refresh and revocation checkpoints.",
      audio: "Narrated security flow summary and token expiry rules.",
      video: "3-minute backend auth flow walkthrough with sequence animation."
    },
    sources: ["text: Security Design Doc 2026", "image: Auth Sequence 2.3", "video: Internal Architecture Session"]
  }
];

const sampleQueries = [
  "How do I reset my password?",
  "Where can I download an invoice receipt?",
  "Show API timeout flow and retry behavior.",
  "Explain backend auth token lifecycle."
];

let sampleIndex = 0;

const findKnowledge = (query, mode) => {
  const lower = query.toLowerCase();
  const modeCandidates = knowledgeItems.filter((item) => item.mode === mode);

  let best = null;
  let bestScore = 0;

  modeCandidates.forEach((item) => {
    const score = item.keywords.reduce(
      (acc, keyword) => acc + (lower.includes(keyword) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  });

  return bestScore > 0 ? best : null;
};

const chooseFormats = (knowledge, preference) => {
  if (preference === "mixed") return knowledge.recommendedFormats.slice(0, 3);
  if (preference !== "auto") return [preference];
  return knowledge.recommendedFormats.slice(0, 2);
};

const clearResult = () => {
  while (resultBox.firstChild) {
    resultBox.removeChild(resultBox.firstChild);
  }
};

const renderResult = (payload) => {
  resultBox.classList.remove("hidden");
  clearResult();

  if (!payload) {
    const message = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = "No confident match found.";
    message.appendChild(strong);
    message.append(" Try using keywords like password, invoice, timeout, or auth flow.");
    resultBox.appendChild(message);
    return;
  }

  const formats = chooseFormats(payload, preferenceSelect.value);
  const confidenceLabel = `${Math.round(payload.confidence * 100)}%`;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `Decision: ${payload.reason} | Confidence: ${confidenceLabel} | Active mode: ${modeSelect.value}`;
  resultBox.appendChild(meta);

  const cards = document.createElement("div");
  cards.className = "cards";

  formats.forEach((format) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = format.toUpperCase();
    card.appendChild(title);

    const content = document.createElement("p");
    content.textContent = payload.responses[format];
    card.appendChild(content);

    cards.appendChild(card);
  });

  resultBox.appendChild(cards);

  const sources = document.createElement("div");
  sources.className = "sources";

  const sourcesTitle = document.createElement("strong");
  sourcesTitle.textContent = "Knowledge sources used:";
  sources.appendChild(sourcesTitle);
  sources.appendChild(document.createElement("br"));

  payload.sources.forEach((source) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = source;
    sources.appendChild(tag);
  });

  resultBox.appendChild(sources);
};

askBtn.addEventListener("click", () => {
  const query = queryInput.value.trim();
  if (!query) {
    resultBox.classList.remove("hidden");
    clearResult();
    const promptMessage = document.createElement("p");
    promptMessage.textContent = "Please enter a query.";
    resultBox.appendChild(promptMessage);
    return;
  }

  const mode = modeSelect.value;
  const found = findKnowledge(query, mode);

  if (!found && mode === "support") {
    const technicalHint = ["api", "backend", "auth", "token", "retry", "latency"];
    const maybeTechnical = technicalHint.some((key) => query.toLowerCase().includes(key));
    if (maybeTechnical) {
      resultBox.classList.remove("hidden");
      clearResult();
      const restrictionMessage = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = "Support Mode restriction:";
      restrictionMessage.appendChild(strong);
      restrictionMessage.append(" This query appears technical. Switch to Developer Mode for backend/code-flow details.");
      resultBox.appendChild(restrictionMessage);
      return;
    }
  }

  renderResult(found);
});

exampleBtn.addEventListener("click", () => {
  queryInput.value = sampleQueries[sampleIndex];
  sampleIndex += 1;
  if (sampleIndex >= sampleQueries.length) sampleIndex = 0;
});
