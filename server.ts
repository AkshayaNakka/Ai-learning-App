import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini API client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI Client initialized successfully with model gemini-3.8-flash.');
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
} else {
  console.log('No valid GEMINI_API_KEY found. BioSphere AI is running in Demo & Fallback Intelligence Mode.');
}

// Fallback educational data for organelles
const ORGANELLE_FALLBACKS: Record<string, any> = {
  nucleus: {
    whatIsIt: "The nucleus is the membrane-enclosed command center of the eukaryotic cell containing the genetic blueprint (DNA).",
    whatDoesItDo: "It orchestrates all cellular activities including gene expression, DNA replication during cell division, and ribosome synthesis inside the nucleolus.",
    whyIsItImportant: "Without the nucleus, the cell loses its biological instruction manual, cannot synthesize new regulatory proteins, and cannot undergo mitosis.",
    analogy: "Think of the nucleus as City Hall or the CEO's office of a mega-corporation, keeping the master architectural blueprints safe in the central vault.",
    memoryTrick: "Nucleus = 'Nucle-US' (Directs US!) or 'Nuclear Powerhouse of Instructions'.",
    simpleSummary: "The command center that holds DNA instructions for making proteins and running the entire cell."
  },
  mitochondria: {
    whatIsIt: "Double-membrane oval organelles with folded inner cristae, celebrated as the power plants of animal and plant cells.",
    whatDoesItDo: "They break down glucose metabolites through the citric acid cycle and oxidative phosphorylation to generate massive quantities of ATP (cellular energy currency).",
    whyIsItImportant: "Every muscular contraction, neural impulse, and biochemical reaction requires ATP energy produced inside the mitochondria.",
    analogy: "The power plant / turbine generator of the city that converts raw fuel into electrical electricity for every neighborhood.",
    memoryTrick: "Mighty Mitochondria Makes ATP!",
    simpleSummary: "The powerhouse of the cell that converts food into usable cellular energy called ATP."
  },
  ribosomes: {
    whatIsIt: "Non-membrane molecular nanomachines composed of ribosomal RNA (rRNA) and proteins, found floating free or studded on the Rough ER.",
    whatDoesItDo: "They read messenger RNA (mRNA) transcripts and assemble chains of amino acids to construct precise three-dimensional proteins.",
    whyIsItImportant: "Proteins form enzymes, structural scaffolding, antibodies, and signaling hormones. Life cannot function without continuous protein synthesis.",
    analogy: "3D printers or robotic factory assembly line workers assembling products according to digital blueprints.",
    memoryTrick: "Ribosomes = 'Ribs' are protein-rich meat -> Ribosomes build proteins!",
    simpleSummary: "Tiny cellular factories that read genetic codes and build all the proteins the body needs."
  },
  endoplasmic_reticulum: {
    whatIsIt: "A vast interconnected network of folded membranous sacs and tubules extending directly from the outer nuclear envelope, divided into Rough ER and Smooth ER.",
    whatDoesItDo: "Rough ER folds and quality-checks newly synthesized proteins; Smooth ER synthesizes vital lipids, phospholipids, steroids, and detoxifies chemicals.",
    whyIsItImportant: "It provides the internal highway and manufacturing conveyor belt for proteins and cell membranes.",
    analogy: "An industrial manufacturing highway with conveyor belts, assembly tables (Rough ER), and oil/chemical refinement rooms (Smooth ER).",
    memoryTrick: "ER = 'Emergency Room' for protein folding and transport highways!",
    simpleSummary: "A folded membranous network that folds proteins and produces cell fats and membranes."
  },
  golgi_apparatus: {
    whatIsIt: "A stack of flattened membranous sacs called cisternae, acting as the distribution and shipping warehouse of the cell.",
    whatDoesItDo: "Receives transport vesicles from the ER, chemically modifies proteins (adding carbohydrate tags), packages them, and dispatches them to their exact destinations.",
    whyIsItImportant: "Ensures cellular products, digestive enzymes, and export hormones reach the right organelles or the extracellular matrix without misplacement.",
    analogy: "The central FedEx or Amazon fulfillment center where packages are sorted, labeled with barcoded shipping tags, and loaded onto delivery vans.",
    memoryTrick: "Golgi = 'Golden Post Office' / 'Go-Pack-Ship' apparatus!",
    simpleSummary: "The packaging and postal center of the cell that sorts and ships proteins to where they are needed."
  },
  lysosomes: {
    whatIsIt: "Spherical hydrolytic vesicles containing over 50 acidic digestive enzymes, active at pH 4.5 to 5.0.",
    whatDoesItDo: "Breaks down worn-out cellular organelles (autophagy), digests engulfed bacteria/viruses (phagocytosis), and recycles raw biomolecules.",
    whyIsItImportant: "Prevents toxic buildup of metabolic waste and cellular debris, functioning as essential quality control and immunity defense.",
    analogy: "The cellular municipal recycling center, garbage disposal, and hazmat incinerator all in one.",
    memoryTrick: "Lysosome = 'Lysol' disinfectant cleaning up cell messes and digesting trash!",
    simpleSummary: "The recycling and waste disposal sacs that digest worn-out parts and foreign invaders."
  },
  cell_membrane: {
    whatIsIt: "A selectively permeable phospholipid bilayer embedded with cholesterol, transport channel proteins, and glycoprotein surface receptors.",
    whatDoesItDo: "Regulates what enters and exits the cell (ions, nutrients, waste), protects cellular contents, and enables communication with neighboring cells.",
    whyIsItImportant: "Maintains biological homeostasis; without it, cell contents would spill out and toxic substances would enter freely.",
    analogy: "The security gates and walls of a gated smart city with biometric scanners and guarded entry checkpoints.",
    memoryTrick: "Membrane = 'Members Only' boundary guard!",
    simpleSummary: "The flexible outer boundary that controls what enters and leaves the cell to keep it safe."
  },
  cytoplasm: {
    whatIsIt: "The entire interior region of the cell between the cell membrane and nuclear envelope, consisting of jelly-like cytosol, cytoskeletal filaments, and suspended organelles.",
    whatDoesItDo: "Provides physical suspension for organelles, facilitates intracellular transport and molecular diffusion, and hosts fundamental metabolic pathways like glycolysis.",
    whyIsItImportant: "Maintains cell volume and structural turgidity while providing the aqueous chemical medium necessary for millions of enzymatic reactions per second.",
    analogy: "The clear gelatin mold or ocean water that suspends everything inside a bustling marine biosphere.",
    memoryTrick: "Cytoplasm = 'Cell Plasma Jelly' that cushions all organelles!",
    simpleSummary: "The fluid jelly that fills the cell and gives it shape while holding all organelles."
  }
};

// API Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!ai,
    model: 'gemini-3.8-flash',
    features: ['3d-cell-explorer', 'ai-explanations', 'ai-quiz-generation', 'ai-biology-tutor', 'division-simulation', 'activities']
  });
});

// 1. Organelle Explanation API
app.post('/api/gemini/explain', async (req, res) => {
  const { organelleId, organelleName, level = 'Intermediate', promptType = 'standard' } = req.body;
  const key = (organelleId || '').toLowerCase().replace(/\s+/g, '_');
  const fallback = ORGANELLE_FALLBACKS[key] || ORGANELLE_FALLBACKS.nucleus;

  if (!ai) {
    return res.json({
      organelleName: organelleName || 'Organelle',
      level,
      ...fallback,
      isFallback: true,
      aiModel: 'Predefined Biological Corpus'
    });
  }

  try {
    const prompt = `You are BioSphere AI, an expert cellular biology educator for students.
Explain the organelle "${organelleName}" at a ${level} education level.
Requirements:
1. whatIsIt: 1-2 clear, scientifically precise sentences.
2. whatDoesItDo: 2 concise sentences explaining its biochemical and cellular mechanism.
3. whyIsItImportant: Why life or the cell fails without it.
4. analogy: An imaginative, vivid real-world analogy (e.g. city, factory, computer, spaceship).
5. memoryTrick: A catchy mnemonic or memory trick students will remember on exams.
6. simpleSummary: 1 punchy sentence for quick revision.

Return the response in strictly valid JSON format matching this schema:
{
  "whatIsIt": string,
  "whatDoesItDo": string,
  "whyIsItImportant": string,
  "analogy": string,
  "memoryTrick": string,
  "simpleSummary": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        systemInstruction: 'You are BioSphere AI, an interactive 3D human cell biology teaching engine. Always return clean JSON without markdown ticks if possible.'
      }
    });

    const text = response.text?.trim() || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return res.json({
      organelleName,
      level,
      ...parsed,
      isFallback: false,
      aiModel: 'Gemini 3.8 Flash'
    });
  } catch (error: any) {
    console.warn('Gemini explain error, returning fallback:', error.message);
    return res.json({
      organelleName: organelleName || 'Organelle',
      level,
      ...fallback,
      isFallback: true,
      aiModel: 'Biological Intelligence Fallback'
    });
  }
});

// 2. AI Biology Tutor Q&A
app.post('/api/gemini/tutor', async (req, res) => {
  const { question, contextTopic = 'Cell Organelles', currentOrganelle, chatHistory = [] } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!ai) {
    // High quality contextual fallback answers
    let answer = `Great question! In cellular biology regarding ${contextTopic}, this is a foundational concept.`;
    const qLower = question.toLowerCase();

    if (qLower.includes('control center') || qLower.includes('nucleus')) {
      answer = "The nucleus is called the control center because it stores DNA—the master genetic code. Just like software code directs a computer's processors, nuclear DNA encodes instructions for transcribing mRNA, which directs ribosomes to produce specific proteins that carry out every metabolic, structural, and regulatory function in the cell.";
    } else if (qLower.includes('powerhouse') || qLower.includes('mitochondria')) {
      answer = "Mitochondria earn the title 'powerhouse of the cell' because they generate over 90% of cellular adenosine triphosphate (ATP) through cellular respiration (specifically the Krebs cycle and electron transport chain along the cristae folds). ATP is the universal chemical battery that powers muscle contraction, nerve firing, and macromolecule assembly.";
    } else if (qLower.includes('simple') || qLower.includes('simply')) {
      answer = `To put it very simply: Every cell is like a high-tech microscopic city. The nucleus is City Hall with blueprints, mitochondria are the power generators, ribosomes are the manufacturing workers, and the cell membrane is the security perimeter wall.`;
    } else if (qLower.includes('exam') || qLower.includes('remember')) {
      answer = `High-yield exam pointers for ${contextTopic}: 1) Know the distinction between Rough ER (protein synthesis via ribosomes) and Smooth ER (lipid synthesis & detoxification). 2) Remember Golgi packages into vesicles using cis/trans faces. 3) Mitochondria have their own circular mtDNA and double membrane.`;
    } else if (qLower.includes('division') || qLower.includes('mitosis')) {
      answer = `Remember the acronym 'PMAT' for mitosis stages: Prophase (chromosomes condense), Metaphase (chromosomes align in the middle), Anaphase (chromatids pull apart), Telophase (two new nuclear envelopes reform), followed by Cytokinesis (cytoplasm splits).`;
    } else {
      answer = `Regarding your inquiry on "${question}": In ${contextTopic}, cellular structures coordinate continuously. For instance, instructions flow from DNA in the nucleus, are transcribed to mRNA, translated by ribosomes on the ER, modified and tagged in the Golgi apparatus, and fueled throughout by ATP generated in the mitochondria.`;
    }

    return res.json({
      answer,
      suggestedQuestions: [
        "Explain this in simple terms",
        "Give me a real-world analogy",
        "What should I remember for an exam?",
        "Quiz me on this organelle"
      ],
      isFallback: true,
      aiModel: 'BioSphere Knowledge Base'
    });
  }

  try {
    const prompt = `You are BioSphere AI Tutor, an interactive biology tutor specializing in cell biology, organelles, and cell division.
Current context topic: "${contextTopic}".
Selected organelle: "${currentOrganelle || 'General Cell'}".
Student question: "${question}".

Recent conversation context:
${chatHistory.slice(-4).map((m: any) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n')}

Guidelines:
- Explain clearly, engagingly, and accurately for secondary/undergraduate biology students.
- Use formatting with bullet points or bold text where it aids understanding.
- Keep response between 2 to 4 concise paragraphs.
- Provide 3 smart follow-up questions the student might want to ask next.

Return response strictly as JSON:
{
  "answer": string,
  "suggestedQuestions": [string, string, string]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4
      }
    });

    const text = response.text?.trim() || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return res.json({
      ...parsed,
      isFallback: false,
      aiModel: 'Gemini 3.8 Flash'
    });
  } catch (error: any) {
    console.warn('Gemini tutor error, using fallback:', error.message);
    return res.json({
      answer: `In cellular biology, ${question.toLowerCase().includes('why') ? 'this process exists because' : 'the key mechanism is that'} each organelle maintains metabolic compartmentalization so conflicting biochemical reactions happen efficiently without interfering with one another.`,
      suggestedQuestions: [
        "Explain this in simpler words",
        "What is the real-world analogy?",
        "What is high-yield for exams?"
      ],
      isFallback: true,
      aiModel: 'BioSphere Knowledge Base'
    });
  }
});

// 3. AI Quiz Generation
app.post('/api/gemini/quiz', async (req, res) => {
  const { topic = 'Cell Organelles', difficulty = 'Medium', count = 5 } = req.body;
  const numQuestions = Math.min(Math.max(Number(count) || 5, 3), 10);

  // Predefined fallback banks for instant and offline support
  const FALLBACK_QUIZZES: Record<string, any[]> = {
    'Cell Organelles': [
      {
        id: 'q1',
        question: "Which organelle is responsible for synthesizing adenosine triphosphate (ATP) via aerobic cellular respiration?",
        options: ["Golgi Apparatus", "Mitochondria", "Lysosome", "Peroxisome"],
        correctAnswer: 1,
        explanation: "Mitochondria produce the vast majority of ATP through the citric acid cycle and oxidative phosphorylation across their inner cristae."
      },
      {
        id: 'q2',
        question: "Where in the cell are ribosomal subunits assembled prior to protein synthesis?",
        options: ["Nucleolus", "Smooth ER", "Centrosome", "Vacuole"],
        correctAnswer: 0,
        explanation: "The nucleolus is the dense sub-nuclear structure where ribosomal RNA (rRNA) is transcribed and combined with proteins to form ribosomal subunits."
      },
      {
        id: 'q3',
        question: "What is the primary function of the Golgi apparatus?",
        options: ["Replicating genomic DNA", "Modifying, sorting, and packaging proteins", "Synthesizing glucose", "Degrading cellular glycogen"],
        correctAnswer: 1,
        explanation: "The Golgi apparatus receives proteins from the rough ER, adds carbohydrate post-translational modifications, and sorts them into targeted vesicles."
      },
      {
        id: 'q4',
        question: "Which organelle contains acid hydrolase enzymes operating optimally at pH ~4.5 to break down cellular waste?",
        options: ["Ribosome", "Endosome", "Lysosome", "Centriole"],
        correctAnswer: 2,
        explanation: "Lysosomes maintain an acidic lumen packed with hydrolytic enzymes designed to safely digest macromolecules and worn-out organelles."
      },
      {
        id: 'q5',
        question: "What distinguishes the Rough Endoplasmic Reticulum from the Smooth Endoplasmic Reticulum?",
        options: ["Presence of membrane-bound ribosomes", "Production of steroid lipids", "Absence of a phospholipid membrane", "Location outside the plasma membrane"],
        correctAnswer: 0,
        explanation: "The Rough ER gets its pebbled appearance from ribosomes actively translating proteins directly into the ER lumen."
      }
    ],
    'Cell Structure': [
      {
        id: 'qs1',
        question: "According to the fluid mosaic model, what forms the structural foundation of the plasma membrane?",
        options: ["Peptidoglycan mesh", "Phospholipid bilayer", "Pure cholesterol sheet", "Fibrous cellulose strands"],
        correctAnswer: 1,
        explanation: "The plasma membrane is composed of an amphipathic phospholipid bilayer with hydrophobic fatty acid tails pointing inward and hydrophilic phosphate heads facing the aqueous cytosol and exterior."
      },
      {
        id: 'qs2',
        question: "What is the primary role of cholesterol embedded within the human cell membrane?",
        options: ["Store genetic information", "Regulate membrane fluidity across changing temperatures", "Catalyze protein phosphorylation", "Pump sodium ions against their gradient"],
        correctAnswer: 1,
        explanation: "Cholesterol acts as a bidirectional fluidity buffer: it prevents fatty acids from packing too tightly at low temperatures and restricts excessive fluidity at warm temperatures."
      },
      {
        id: 'qs3',
        question: "Which cytoskeletal component provides mechanical strength and forms the mitotic spindle during cell division?",
        options: ["Microtubules", "Microfilaments (Actin)", "Intermediate Filaments", "Collagen fibers"],
        correctAnswer: 0,
        explanation: "Microtubules composed of alpha and beta tubulin dimers form the structural tracks for motor proteins and assemble into the mitotic spindle."
      },
      {
        id: 'qs4',
        question: "The aqueous component of cytoplasm excluding organelles is properly termed:",
        options: ["Cytoplasm", "Cytosol", "Nucleoplasm", "Protoplast"],
        correctAnswer: 1,
        explanation: "Cytosol is the liquid electrolyte and protein-rich matrix of the cytoplasm in which organelles are suspended."
      },
      {
        id: 'qs5',
        question: "Which cellular feature is characteristic of eukaryotic animal cells but ABSENT in bacterial cells?",
        options: ["Ribosomes", "Plasma membrane", "Membrane-bound nucleus", "DNA genetic material"],
        correctAnswer: 2,
        explanation: "Eukaryotes possess a membrane-enclosed nucleus and compartmentalized organelles, whereas prokaryotes maintain circular DNA in an unmembraned nucleoid."
      }
    ],
    'Cell Division': [
      {
        id: 'qd1',
        question: "During which mitotic phase do sister chromatids separate and move toward opposite centrosome poles?",
        options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        correctAnswer: 2,
        explanation: "In anaphase, cohesin proteins are cleaved by separase, allowing spindle fibers to reel sister chromatids toward opposing poles."
      },
      {
        id: 'qd2',
        question: "In what phase of the eukaryotic cell cycle does DNA replication occur?",
        options: ["G1 phase", "S phase (Synthesis)", "G2 phase", "M phase"],
        correctAnswer: 1,
        explanation: "DNA synthesis occurs exclusively during S phase of interphase, duplicating every chromosome into identical sister chromatids."
      },
      {
        id: 'qd3',
        question: "At which stage do chromosomes align along the equatorial plate of the cell?",
        options: ["Interphase", "Metaphase", "Cytokinesis", "Telophase"],
        correctAnswer: 1,
        explanation: "Metaphase is defined by chromosomes lining up at the metaphase plate (cell equator), verified by the spindle assembly checkpoint."
      },
      {
        id: 'qd4',
        question: "The physical division of the cytoplasm into two distinct daughter cells is termed:",
        options: ["Karyokinesis", "Cytokinesis", "Apoptosis", "Crossing over"],
        correctAnswer: 1,
        explanation: "Cytokinesis involves an actomyosin contractile ring pinching animal cells into two independent daughter cells."
      },
      {
        id: 'qd5',
        question: "What happens to the nuclear envelope during prophase/prometaphase?",
        options: ["It replicates twice", "It disintegrates to allow spindle microtubules access to kinetochores", "It thickens into a cell wall", "It fuses with the mitochondria"],
        correctAnswer: 1,
        explanation: "The nuclear envelope phosphorylates and breaks down into small vesicles so spindle fibers can attach to chromosome kinetochores."
      }
    ]
  };

  if (!ai) {
    const list = FALLBACK_QUIZZES[topic] || FALLBACK_QUIZZES['Cell Organelles'];
    const selected = list.slice(0, numQuestions);
    return res.json({
      topic,
      difficulty,
      questions: selected,
      isFallback: true,
      aiModel: 'Curated Biological Exam Bank'
    });
  }

  try {
    const prompt = `Generate an accurate, educational biology quiz for students.
Topic: "${topic}"
Difficulty: "${difficulty}" (Easy = foundational definitions, Medium = mechanisms and functions, Hard = biochemical pathways and comparative biology).
Total questions: ${numQuestions}.

Return strictly valid JSON with an array of objects matching this exact schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // 0-based integer index (0, 1, 2, or 3)
      "explanation": "Clear explanation of why this is correct and why other options are incorrect."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const text = response.text?.trim() || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return res.json({
      topic,
      difficulty,
      questions: parsed.questions || parsed,
      isFallback: false,
      aiModel: 'Gemini 3.8 Flash'
    });
  } catch (error: any) {
    console.warn('Gemini quiz generation error, using fallback:', error.message);
    const list = FALLBACK_QUIZZES[topic] || FALLBACK_QUIZZES['Cell Organelles'];
    return res.json({
      topic,
      difficulty,
      questions: list.slice(0, numQuestions),
      isFallback: true,
      aiModel: 'Curated Biological Exam Bank'
    });
  }
});

// 4. Personalized Learning Recommendations API
app.post('/api/gemini/recommendations', async (req, res) => {
  const { score, total, topic, wrongAnswers = [] } = req.body;
  const percentage = Math.round((score / (total || 1)) * 100);

  if (!ai) {
    let recSummary = '';
    let weaknesses = wrongAnswers.map((w: any) => w.question?.substring(0, 45) + '...').filter(Boolean);
    let nextTopic = 'Cell Organelles';

    if (percentage >= 80) {
      recSummary = `Outstanding work! You scored ${percentage}% in ${topic}. You demonstrate strong conceptual mastery.`;
      nextTopic = topic === 'Cell Structure' ? 'Cell Organelles' : (topic === 'Cell Organelles' ? 'Cell Division' : 'Cell Structure');
    } else if (percentage >= 50) {
      recSummary = `Solid effort! You scored ${percentage}% in ${topic}. Reviewing key mechanisms and organelle interactions will solidify your understanding for exam perfection.`;
      nextTopic = topic;
    } else {
      recSummary = `You scored ${percentage}% in ${topic}. Let's revisit the 3D model and review organelle functions before re-attempting the quiz.`;
      nextTopic = topic;
    }

    return res.json({
      score,
      total,
      percentage,
      summary: recSummary,
      strengths: percentage >= 50 ? ["Understands core cellular functions", "Identifies major organelles"] : ["Great initiative exploring cellular biology"],
      weaknesses: weaknesses.length > 0 ? weaknesses : ["Review minor biochemical pathways"],
      recommendations: [
        `Re-explore the 3D cell visualization and click on organs related to missed questions.`,
        `Complete the Drag-and-Drop Organelle matching activity to reinforce spatial memory.`,
        `Ask BioSphere AI Tutor: "Explain the difference between Rough ER and Golgi apparatus".`
      ],
      recommendedTopic: nextTopic,
      isFallback: true,
      aiModel: 'BioSphere Recommendation Engine'
    });
  }

  try {
    const prompt = `Analyze this student's quiz performance and provide personalized biology learning recommendations:
Topic: ${topic}
Score: ${score} out of ${total} (${percentage}%)
Missed Questions Details: ${JSON.stringify(wrongAnswers.slice(0, 5))}

Provide a supportive, encouraging, pedagogical response in strict JSON:
{
  "summary": string, // Direct personal evaluation, e.g. "You scored 60% in Cell Organelles..."
  "strengths": [string, string],
  "weaknesses": [string, string],
  "recommendations": [string, string, string],
  "recommendedTopic": string // one of 'Cell Structure', 'Cell Organelles', 'Cell Division'
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const text = response.text?.trim() || '';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return res.json({
      score,
      total,
      percentage,
      ...parsed,
      isFallback: false,
      aiModel: 'Gemini 3.8 Flash'
    });
  } catch (err: any) {
    console.warn('Gemini recommendations error, using fallback:', err.message);
    return res.json({
      score,
      total,
      percentage,
      summary: `You scored ${percentage}% in ${topic}. Review the missed concepts in the interactive 3D explorer to boost your score!`,
      strengths: ["Strong engagement with interactive learning"],
      weaknesses: ["Detailed organelle biochemistry"],
      recommendations: [
        "Explore 3D organelles interactively",
        "Test yourself with the identify organelle activity",
        "Retake the quiz on Medium difficulty"
      ],
      recommendedTopic: topic,
      isFallback: true,
      aiModel: 'BioSphere Recommendation Engine'
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BioSphere AI server running on http://localhost:${PORT}`);
  });
}

startServer();
