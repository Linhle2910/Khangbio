
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { QuizQuestion } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// URL xuất CSV từ Google Sheet của Khang
const SHEET_BASE_URL = 'https://docs.google.com/spreadsheets/d/1yv7v4SDoi3gwGuUnloZEmtuDdvlMWY_sn4sL80sPOd4/export?format=csv&gid=0';

export const formatScientificText = (text: string): string => {
  if (!text) return "";
  return text.replace(/([A-Z][a-z]?)(\d+)/g, "$1<sub>$2</sub>")
             .replace(/\$([^$]+)\$/g, (match, formula) => {
               return formula.replace(/(\d+)/g, "<sub>$1</sub>");
             });
};

/**
 * CSV Parser xử lý được các ô chứa dấu phẩy và xuống dòng
 */
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

export const fetchQuestionsFromSheet = async (): Promise<QuizQuestion[]> => {
  try {
    const syncUrl = `${SHEET_BASE_URL}&t=${Date.now()}`;
    const response = await fetch(syncUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Lỗi kết nối (${response.status}). Khang hãy kiểm tra quyền chia sẻ của Sheet.`);
    }
    
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    
    if (rows.length < 2) return [];

    // Map dữ liệu theo cấu trúc 11 cột Khang cung cấp
    // 0: ID, 1: Lớp, 2: Chủ đề, 3: Mức độ, 4: Câu hỏi, 5: A, 6: B, 7: C, 8: D, 9: Đ/án, 10: G/thích
    const questions: QuizQuestion[] = rows.slice(1).map((cols) => {
      // Xử lý cột Lớp (Ví dụ: "Sinh học 8" -> 8)
      const gradeStr = cols[1] || "";
      const gradeMatch = gradeStr.match(/\d+/);
      const gradeNum = gradeMatch ? parseInt(gradeMatch[0]) : 0;

      // Xử lý đáp án đúng (A, B, C, D)
      const rawCorrect = (cols[9] || '').trim().toUpperCase();
      let correctIdx = 0;
      if (rawCorrect === 'A' || rawCorrect === '0') correctIdx = 0;
      else if (rawCorrect === 'B' || rawCorrect === '1') correctIdx = 1;
      else if (rawCorrect === 'C' || rawCorrect === '2') correctIdx = 2;
      else if (rawCorrect === 'D' || rawCorrect === '3') correctIdx = 3;

      return {
        question: cols[4] || '', // Cột 5 (E)
        options: [
          cols[5] || '', // F
          cols[6] || '', // G
          cols[7] || '', // H
          cols[8] || ''  // I
        ],
        correctAnswer: correctIdx,
        explanation: cols[10] || 'Xem lại kiến thức trọng tâm nhé!', // K
        grade: (gradeNum === 8 ? 8 : 9) as 8 | 9,
        topic: cols[2] || 'Chung', // Cột 3 (C)
        level: (cols[3]?.toUpperCase() as any) || 'GENERAL'
      };
    }).filter(q => q.question.trim().length > 2);

    return questions;
  } catch (error: any) {
    console.error("Lỗi fetch:", error);
    throw error;
  }
};

export const chatWithTutor = async (history: any[], message: string, imageBase64?: string, audioBase64?: string): Promise<GenerateContentResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = [];
  if (message) parts.push({ text: message });
  if (imageBase64) {
    const data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    parts.push({ inlineData: { data, mimeType: 'image/jpeg' } });
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
      systemInstruction: `Bạn là giáo viên bồi dưỡng HSG Sinh học. Luôn gọi học sinh là Khang.`,
      tools: [{ functionDeclarations: [illustrationTool] }]
    }
  });
};

export const summarizeBankItem = async (content: string, type: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tóm tắt nội dung để lưu vào ngân hàng tài liệu. \n\n ${content}`,
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "1:1" } }
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  return part?.inlineData ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
};

export const generateLectureOutline = async (topic: string, grade: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tạo dàn ý bài giảng "${topic}" lớp ${grade}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateSectionContent = async (topic: string, sectionTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Viết nội dung bồi dưỡng HSG mục "${sectionTitle}" của "${topic}".`,
  });
  return response.text || '';
};

export const generateTopicSummary = async (topic: string, fullContent: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hệ thống hóa kiến thức chủ đề "${topic}": \n\n ${fullContent}`,
  });
  return response.text || '';
};
