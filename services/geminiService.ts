
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { QuizQuestion, CurriculumTopic } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Spreadsheet ID cho Lộ trình học tập (Cột F, Cột D...)
const CURRICULUM_SPREADSHEET_ID = '1txcpaEw_KS3767EX4SBqd7OM5XhI6dNPoMo-h5tnFiY';

// Spreadsheet ID mới cho phần Luyện tập (Trắc nghiệm) theo yêu cầu của Khang
const QUIZ_SPREADSHEET_ID = '1dVuq6_6MM6WeemMwTKyVwAMujf_hthZ1XLSRdfFe-z4';

// Cấu trúc URL xuất CSV
const CURRICULUM_SHEET_URL = `https://docs.google.com/spreadsheets/d/${CURRICULUM_SPREADSHEET_ID}/export?format=csv&gid=0`;
// Sử dụng gid=0 cho file trắc nghiệm mới để lấy dữ liệu từ trang tính đầu tiên
const QUIZ_SHEET_URL = `https://docs.google.com/spreadsheets/d/${QUIZ_SPREADSHEET_ID}/export?format=csv&gid=0`;

export const formatScientificText = (text: string): string => {
  if (!text) return "";
  return text.replace(/([A-Z][a-z]?)(\d+)/g, "$1<sub>$2</sub>")
             .replace(/\$([^$]+)\$/g, (match, formula) => {
               return formula.replace(/(\d+)/g, "<sub>$1</sub>");
             });
};

const parseCSV = (text: string): string[][] => {
  const result: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        i++; 
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field.trim());
        field = '';
      } else if (char === '\n' || char === '\r') {
        row.push(field.trim());
        if (row.length > 0) result.push(row);
        row = [];
        field = '';
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        field += char;
      }
    }
  }
  if (row.length > 0 || field !== '') {
    row.push(field.trim());
    result.push(row);
  }
  return result;
};

export const fetchCurriculumFromSheet = async (): Promise<CurriculumTopic[]> => {
  try {
    const response = await fetch(`${CURRICULUM_SHEET_URL}&t=${Date.now()}`, { 
      method: 'GET',
      headers: { 'Accept': 'text/csv' },
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Lỗi kết nối Sheet Lộ trình (${response.status}).`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];

    return rows.slice(1).map((cols, idx) => {
      const rawGrade = cols[0] || '';
      const rawTitle = cols[2] || '';
      
      return {
        id: `cur-${idx}-${Date.now()}`,
        grade: (rawGrade.includes('9') ? 9 : 8) as 8 | 9,
        title: rawTitle,
        mainContent: cols[3] || '',
        knowledgeSummary: '', 
        detailLink: cols[5] || '',
        category: rawGrade.includes('9') ? 'Di truyền' : 'Hệ cơ quan'
      };
    }).filter(t => t.title.trim() !== '');
  } catch (error: any) {
    console.error("Lỗi đồng bộ danh mục:", error);
    throw error;
  }
};

export const fetchQuestionsFromSheet = async (): Promise<QuizQuestion[]> => {
  try {
    const syncUrl = `${QUIZ_SHEET_URL}&t=${Date.now()}`;
    const response = await fetch(syncUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Lỗi kết nối Trắc nghiệm.`);
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];

    return rows.slice(1).map((cols) => {
      const rawCorrect = (cols[9] || '').trim().toUpperCase();
      let correctIdx = 0;
      if (rawCorrect === 'A') correctIdx = 0;
      else if (rawCorrect === 'B') correctIdx = 1;
      else if (rawCorrect === 'C') correctIdx = 2;
      else if (rawCorrect === 'D') correctIdx = 3;

      return {
        question: cols[4] || '',
        options: [cols[5] || '', cols[6] || '', cols[7] || '', cols[8] || ''],
        correctAnswer: correctIdx,
        explanation: cols[10] || 'Hãy ôn lại bài giảng nhé!',
        grade: (cols[1]?.includes('9') ? 9 : 8) as 8 | 9,
        topic: cols[2] || 'Chung',
        level: (cols[3]?.includes('Nâng cao') ? 'ADVANCED' : 'BASIC') as any
      };
    }).filter(q => q.question.trim().length > 2);
  } catch (error: any) {
    throw error;
  }
};

export const chatWithTutor = async (history: any[], message: string, imageBase64?: string, audioBase64?: string): Promise<GenerateContentResponse> => {
  const ai = getAI();
  const parts: any[] = [];
  if (message) parts.push({ text: message });
  if (imageBase64) {
    const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    parts.push({ inlineData: { data, mimeType: 'image/jpeg' } });
  }
  if (audioBase64) {
    const data = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
    parts.push({ inlineData: { data, mimeType: 'audio/wav' } });
  }
  
  const illustrationTool: FunctionDeclaration = {
    name: 'generate_biology_illustration',
    parameters: {
      type: Type.OBJECT,
      description: 'Vẽ sơ đồ hoặc hình minh họa sinh học.',
      properties: {
        prompt: { type: Type.STRING, description: 'Mô tả hình ảnh bằng tiếng Anh.' },
        caption: { type: Type.STRING, description: 'Chú thích bằng tiếng Việt.' }
      },
      required: ['prompt', 'caption']
    }
  };

  return await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts }],
    config: {
      systemInstruction: `Bạn là gia sư chuyên bồi dưỡng HSG Sinh học. Luôn gọi học sinh là Khang. Phân tích sâu sắc bản chất vấn đề.`,
      tools: [{ functionDeclarations: [illustrationTool] }]
    }
  });
};

export const summarizeBankItem = async (content: string, type: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tóm tắt nội dung này thật súc tích để lưu vào ngân hàng tài liệu. \n\n ${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
        required: ['title', 'description']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateIllustration = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  return part?.inlineData ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
};
