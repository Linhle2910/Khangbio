
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { EssayExam, EssayGradingResult, HomeworkGradingResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (topicContext: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hãy tạo đúng 10 câu hỏi trắc nghiệm Sinh học chuyên sâu dành cho HSG dựa trên ngữ cảnh: ${topicContext}. 
    YÊU CẦU:
    1. Độ khó: Nâng cao, tư duy logic (Phân tích, So sánh, Dự đoán).
    2. Trả về JSON chuẩn theo schema.
    3. Ngôn ngữ: Tiếng Việt.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            level: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation", "level"]
        }
      }
    }
  });
  
  return JSON.parse(response.text.trim());
};

export const generateLectureOutline = async (topicTitle: string, grade: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Lập dàn ý bài giảng Sinh học chuyên sâu dành cho học sinh giỏi ôn thi vào lớp 10 chuyên. 
    Chủ đề: ${topicTitle} (Lớp ${grade}). 
    YÊU CẦU:
    1. Trả về danh sách các tiêu đề mục lục chính (array of strings).
    2. Nội dung phải nâng cao, bám sát các đề thi chuyên (VD: cơ chế phân tử, logic hệ thống).
    3. Chỉ tập trung chuyên môn, không chào hỏi, không ký tự trang trí.
    4. Trả về đúng định dạng JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateSectionContent = async (topicTitle: string, sectionTitle: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Viết nội dung bài giảng chi tiết cho phần "${sectionTitle}" trong chủ đề "${topicTitle}".
    ĐỐI TƯỢNG: Học sinh ôn thi chuyên Sinh lớp 10.
    YÊU CẦU:
    1. Trình bày sạch, tuyệt đối KHÔNG dùng ký tự trang trí như **, ---, #, ....
    2. KHÔNG khen ngợi, KHÔNG chào hỏi.
    3. Phân tích sâu thuật ngữ chuyên môn, giải thích cơ chế sinh học một cách logic.
    4. Trình bày theo phong cách giáo trình chuyên sâu, xuống dòng rõ ràng.`,
  });
  return response.text.trim();
};

export const generateSectionSummary = async (sectionTitle: string, sectionContent: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tóm tắt các ý chính quan trọng nhất của phần "${sectionTitle}" dựa trên nội dung sau:
    "${sectionContent}"
    
    YÊU CẦU:
    1. Chỉ trả về các gạch đầu dòng ngắn gọn, súc tích.
    2. Tuyệt đối KHÔNG dùng ký tự trang trí như **, #, ---.
    3. Tập trung vào từ khóa chuyên môn và cơ chế sinh học.`,
  });
  return response.text.trim();
};

export const generateTopicSummary = async (topicTitle: string, fullContent: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hãy tóm tắt và hệ thống hóa kiến thức cho chủ đề Sinh học: "${topicTitle}". 
    Dựa trên nội dung bài giảng chi tiết sau:
    "${fullContent}"
    
    YÊU CẦU:
    1. Trình bày dưới dạng các ý chính quan trọng, súc tích.
    2. TUYỆT ĐỐI KHÔNG dùng ký tự trang trí như **, #, ---.
    3. Phân chia các mảng kiến thức rõ ràng bằng xuống dòng.`,
  });
  return response.text.trim();
};

export const generate_illustration_tool: FunctionDeclaration = {
  name: 'generate_biology_illustration',
  parameters: {
    type: Type.OBJECT,
    description: 'Tạo sơ đồ sinh học hoặc hình minh họa khoa học có chú thích tiếng Việt. CHỈ sử dụng khi học sinh yêu cầu rõ ràng.',
    properties: {
      prompt: {
        type: Type.STRING,
        description: 'Mô tả chi tiết bằng tiếng Anh về sơ đồ (VD: "Cross-section of human heart, scientific diagram with Vietnamese labels").',
      },
      caption: {
        type: Type.STRING,
        description: 'Chú thích ngắn gọn bằng tiếng Việt cho sơ đồ.',
      }
    },
    required: ['prompt', 'caption'],
  },
};

export const generateEssayExam = async (): Promise<EssayExam> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Tạo đề thi Sinh học tự luận bám sát cấu trúc đề chuyên Sinh vào lớp 10. Trình bày khoa học, không dùng ký tự trang trí thừa.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          duration: { type: Type.NUMBER },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                point: { type: Type.NUMBER }
              },
              required: ["id", "text", "point"]
            }
          }
        },
        required: ["id", "title", "duration", "questions"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const gradeEssayExam = async (exam: EssayExam, answers: Record<string, string>): Promise<EssayGradingResult> => {
  const ai = getAI();
  const prompt = `Bạn là một giám khảo chấm thi kỳ thi tuyển sinh vào lớp 10 Chuyên Sinh. 
  Nhiệm vụ: Chấm điểm bài làm của học sinh một cách khắt khe.

  ĐỀ THI: ${JSON.stringify(exam)}
  BÀI LÀM: ${JSON.stringify(answers)}

  YÊU CẦU:
  1. Chỉ tập trung nội dung chuyên môn.
  2. Tuyệt đối KHÔNG dùng ký tự trang trí như **, ---, #, .... trong văn bản trả về.
  3. Trình bày các ý bằng cách xuống dòng rõ ràng thay vì dùng ký hiệu.
  
  Trả về JSON chuẩn.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalScore: { type: Type.NUMBER },
          overallReview: { type: Type.STRING },
          feedback: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionId: { type: Type.STRING },
                score: { type: Type.NUMBER },
                comment: { type: Type.STRING },
                suggestedAnswer: { type: Type.STRING }
              },
              required: ["questionId", "score", "comment", "suggestedAnswer"]
            }
          }
        },
        required: ["totalScore", "overallReview", "feedback"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const gradeHomework = async (question: string, answer: string, imageBase64?: string): Promise<HomeworkGradingResult> => {
  const ai = getAI();
  const parts: any[] = [
    { text: `Đánh giá bài tập Sinh học chuyên sâu. Yêu cầu: Trả lời ngắn gọn, KHÔNG dùng các ký tự trang trí **, ---, #, .... KHÔNG khen ngợi. Chỉ tập trung vào kiến thức.` }
  ];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          detailedFeedback: { type: Type.STRING },
          suggestedModelAnswer: { type: Type.STRING },
          terminologyCheck: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                status: { type: Type.STRING },
                note: { type: Type.STRING }
              }
            }
          }
        },
        required: ["score", "strengths", "weaknesses", "detailedFeedback", "suggestedModelAnswer", "terminologyCheck"]
      }
    }
  });
  
  return JSON.parse(response.text.trim());
};

export const summarizeBankItem = async (content: string, type: string, imageBase64?: string) => {
  const ai = getAI();
  const parts: any[] = [{
    text: `Tóm tắt nội dung tài liệu Sinh học: ${content}. Trả về JSON với tiêu đề và mô tả ngắn gọn.`
  }];

  if (imageBase64) {
    parts.push({
      inlineData: {
        data: imageBase64.split(',')[1] || imageBase64,
        mimeType: 'image/jpeg'
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const chatWithTutor = async (history: any[], message: string, imageBase64?: string, audioBase64?: string) => {
  const ai = getAI();
  const parts: any[] = [{ text: message || "Giải đáp giúp mình." }];

  if (imageBase64) {
    parts.push({ inlineData: { data: imageBase64.split(',')[1] || imageBase64, mimeType: 'image/jpeg' } });
  }

  if (audioBase64) {
    parts.push({ inlineData: { data: audioBase64.split(',')[1] || audioBase64, mimeType: 'audio/wav' } });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history,
      { role: 'user', parts }
    ],
    config: {
      systemInstruction: `Bạn là giáo viên bồi dưỡng học sinh giỏi Sinh học ôn thi vào lớp 10 chuyên. 
      
      NGUYÊN TẮC PHẢN HỒI:
      1. TUYỆT ĐỐI KHÔNG sử dụng các ký tự trang trí như **, ---, #, ....
      2. KHÔNG khen ngợi (Ví dụ: KHÔNG được nói "Khang làm tốt lắm").
      3. KHÔNG chào hỏi, KHÔNG kết bài xã giao.
      4. CHỈ CUNG CẤP KIẾN THỨC: Trình bày logic, chuyên sâu, bám sát kiến thức bồi dưỡng chuyên Sinh.
      5. CHỈ VẼ KHI ĐƯỢC YÊU CẦU cụ thể bằng 'generate_biology_illustration'.`,
      tools: [{ functionDeclarations: [generate_illustration_tool] }]
    }
  });
  
  return response;
};

export const generateIllustration = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Professional scientific biological diagram, high-resolution textbook style, clean white background, detailed anatomical labels in Vietnamese language only: ${prompt}.` }]
      },
      config: { 
        imageConfig: { 
          aspectRatio: "16:9" 
        } 
      }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};
