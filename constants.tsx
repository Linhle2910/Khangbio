
import { BiologyTopic, ExamPaper, QuizQuestion, StudyPlanItem, BankItem } from './types';

export const GRADE_8_TOPICS: BiologyTopic[] = [
  {
    id: 'g8-musculoskeletal',
    title: 'Hệ Cơ - Xương - Khớp',
    grade: 8,
    icon: '🦴',
    description: 'Cấu tạo bộ xương, bắp cơ và cơ chế vận động của cơ thể.',
    checklist: ['Cấu tạo & thành phần hóa học của xương', 'Sự to ra và dài ra của xương', 'Cấu tạo bắp cơ và nơron điều khiển', 'Cơ chế co cơ và công của cơ'],
    summary: 'Hệ vận động gồm xương và cơ. Xương làm khung nâng đỡ và bảo vệ, cơ co giúp xương cử động.',
    lecturePrompt: 'Giảng chi tiết về hệ cơ xương khớp lớp 8 chuyên sâu cho thi HSG.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-circulatory',
    title: 'Hệ Tuần Hoàn',
    grade: 8,
    icon: '🫀',
    description: 'Máu, môi trường trong cơ thể và chu kì hoạt động của tim.',
    checklist: ['Thành phần và chức năng của máu', 'Sơ đồ truyền máu và nguyên tắc truyền máu', 'Cấu tạo tim và hệ mạch chuyên sâu', 'Chu kì tim và điều hòa hoạt động tim'],
    summary: 'Máu gồm huyết tương và các tế bào máu. Tim hoạt động theo chu kì 3 pha giúp máu lưu thông liên tục.',
    lecturePrompt: 'Giảng chi tiết về hệ tuần hoàn và cơ chế đông máu lớp 8 chuyên sâu.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-digestive',
    title: 'Hệ Tiêu Hóa',
    grade: 8,
    icon: '🍕',
    description: 'Biến đổi lý học và hóa học thức ăn chuyên sâu.',
    checklist: [
      'Cấu tạo chi tiết ống tiêu hóa và các tuyến tiêu hóa',
      'Biến đổi lý học và hóa học ở khoang miệng, dạ dày, ruột non',
      'Cơ chế hoạt động của các Enzyme (Amilaza, Pepsin, Tripsin, Lipaza)',
      'Sự hấp thụ chất dinh dưỡng qua hệ thống lông cực đại ở ruột non',
      'Vai trò của gan và mật trong tiêu hóa lipid'
    ],
    summary: 'Thức ăn được biến đổi thành chất đơn giản nhờ các enzyme tiêu hóa và được hấp thụ chủ yếu tại ruột non.',
    lecturePrompt: 'Phân tích sâu về hoạt động của các enzyme trong ống tiêu hóa và cơ chế hấp thụ chất dinh dưỡng.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-respiratory',
    title: 'Hệ Hô Hấp',
    grade: 8,
    icon: '🫁',
    description: 'Cơ chế thông khí ở phổi và trao đổi khí ở tế bào.',
    checklist: ['Cấu tạo cơ quan hô hấp', 'Cơ chế hít vào - thở ra', 'Trao đổi khí ở phổi và tế bào'],
    summary: 'Hô hấp cung cấp O2 cho tế bào và loại bỏ CO2 thông qua cơ chế khuếch tán tại phế nang.',
    lecturePrompt: 'Giảng chi tiết về cơ chế thông khí và trao đổi khí ở phế nang.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-excretory',
    title: 'Hệ Bài Tiết',
    grade: 8,
    icon: '💧',
    description: 'Cấu tạo thận và cơ chế lọc máu tạo thành nước tiểu.',
    checklist: [
      'Cấu tạo hệ bài tiết nước tiểu',
      'Cấu trúc đơn vị chức năng của thận (Nephron)',
      'Quá trình lọc máu ở nang cầu thận (nước tiểu đầu)',
      'Quá trình hấp thụ lại và bài tiết tiếp ở ống thận (nước tiểu chính thức)',
      'Các bệnh về thận và vệ sinh hệ bài tiết'
    ],
    summary: 'Hệ bài tiết lọc các chất thừa, độc hại khỏi máu để duy trì tính ổn định của môi trường trong cơ thể qua Nephron.',
    lecturePrompt: 'Giải thích chi tiết 3 giai đoạn hình thành nước tiểu tại Nephron.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-nervous',
    title: 'Hệ Thần Kinh',
    grade: 8,
    icon: '🧠',
    description: 'Cấu tạo nơron, trung ương thần kinh và cơ chế phản xạ.',
    checklist: ['Cấu tạo nơron và cung phản xạ', 'Phân tích các vùng chức năng của đại não', 'Phản xạ có điều kiện & không điều kiện', 'Cơ chế dẫn truyền xung qua Xináp'],
    summary: 'Hệ thần kinh điều khiển, điều hòa mọi hoạt động cơ thể thông qua các cung phản xạ phức tạp.',
    lecturePrompt: 'Giảng chi tiết về các vùng chức năng của đại não và cung phản xạ.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-endocrine',
    title: 'Hệ Nội Tiết',
    grade: 8,
    icon: '🧬',
    description: 'Các tuyến nội tiết và vai trò của Hormone trong điều hòa cơ thể.',
    checklist: [
      'Phân biệt tuyến nội tiết và tuyến ngoại tiết',
      'Tuyến yên - Tuyến chỉ huy toàn bộ hệ nội tiết',
      'Tuyến giáp (Thyroxin) và Tuyến tụy (Insulin/Glucagon)',
      'Tuyến trên thận và Hormone Adrenalin',
      'Cơ chế điều hòa ngược (Feedback loop) trong hệ nội tiết'
    ],
    summary: 'Hệ nội tiết điều hòa các quá trình sinh lý bằng cách giải phóng Hormone trực tiếp vào máu.',
    lecturePrompt: 'Phân tích cơ chế điều hòa đường huyết và vai trò của Feedback Loop.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-reproductive',
    title: 'Hệ Sinh Dục & Sinh Sản',
    grade: 8,
    icon: '🍼',
    description: 'Cơ quan sinh sản, sự thụ tinh, thụ thai và phát triển.',
    checklist: [
      'Cấu tạo cơ quan sinh dục nam và nữ',
      'Quá trình sinh tinh và sinh trứng',
      'Hiện tượng thụ tinh, thụ thai và phát triển của thai nhi',
      'Hormone sinh dục và cơ chế chu kỳ kinh nguyệt',
      'Các bệnh lây qua đường tình dục và biện pháp tránh thai'
    ],
    summary: 'Sinh sản giúp duy trì nòi giống thông qua sự phối hợp phức tạp của hệ thần kinh và nội tiết.',
    lecturePrompt: 'Giảng chi tiết về cơ chế nội tiết điều khiển chu kỳ kinh nguyệt và sự thụ tinh.',
    category: 'Hệ cơ quan'
  }
];

export const GRADE_9_TOPICS: BiologyTopic[] = [
  {
    id: 'g9-genetics-mendel',
    title: 'Quy luật Di truyền Mendel',
    grade: 9,
    icon: '🧬',
    description: 'Lai một cặp tính trạng và lai hai cặp tính trạng.',
    checklist: ['Quy luật phân li', 'Quy luật phân li độc lập', 'Biến dị tổ hợp', 'Cách tính xác suất trong di truyền'],
    summary: 'Mendel khám phá ra các quy luật di truyền cơ bản thông qua thí nghiệm lai đậu Hà Lan.',
    lecturePrompt: 'Giảng sâu về các bài tập lai 2 cặp tính trạng và cách tính xác suất kiểu hình.',
    category: 'Di truyền'
  },
  {
    id: 'g9-molecular',
    title: 'Cơ sở Phân tử của Di truyền',
    grade: 9,
    icon: '🧪',
    description: 'Cấu trúc ADN, ARN và quá trình tổng hợp Protein.',
    checklist: ['Cấu trúc và nhân đôi ADN', 'Quá trình phiên mã và dịch mã', 'Mã di truyền', 'Bài tập tính toán cấu trúc ADN'],
    summary: 'ADN lưu trữ thông tin di truyền, được truyền đạt qua nhân đôi và biểu hiện qua tổng hợp protein.',
    lecturePrompt: 'Giảng chi tiết cơ chế nhân đôi ADN và mối quan hệ Gen -> ARN -> Protein.',
    category: 'Di truyền'
  },
  {
    id: 'g9-variation',
    title: 'Biến dị',
    grade: 9,
    icon: '⚡',
    description: 'Đột biến gen, đột biến NST và thường biến.',
    checklist: ['Đột biến điểm', 'Đột biến cấu trúc & số lượng NST', 'Thường biến', 'Ứng dụng trong chọn giống'],
    summary: 'Biến dị là những thay đổi ở kiểu hình hoặc kiểu gen, là nguyên liệu cho tiến hóa.',
    lecturePrompt: 'Giảng chi tiết về các dạng đột biến NST và hậu quả của chúng.',
    category: 'Di truyền'
  }
];

export const BIOLOGY_TOPICS = [...GRADE_8_TOPICS, ...GRADE_9_TOPICS];

export const BANK_DATA: BankItem[] = [
  { id: 'b1', title: 'Phân tích phả hệ nâng cao 2024', type: 'LECTURE', topicId: 'g9-genetics-mendel', grade: 9, source: 'Gia sư AI Chuyên sâu', dateAdded: '2024-03-20' },
  { id: 'b2', title: 'Cơ chế tháo xoắn ADN chi tiết', type: 'LECTURE', topicId: 'g9-molecular', grade: 9, source: 'Đại học Sư phạm', dateAdded: '2024-03-15' },
  { id: 'b3', title: 'Đề chuyên Lê Hồng Phong - Sinh 2023', type: 'EXAM', topicId: 'g9-genetics-mendel', grade: 9, source: 'Sở GD&ĐT', dateAdded: '2024-01-10' },
];

export const QUESTION_POOL: QuizQuestion[] = [
  {
    question: "Tế bào xương được sinh ra từ đâu giúp xương phát triển về bề ngang?",
    options: ["Sụn đầu xương", "Màng xương", "Tủy xương", "Sụn tăng trưởng"],
    correctAnswer: 1,
    explanation: "Sự phân chia của các tế bào màng xương giúp xương to ra về bề ngang, trong khi sụn tăng trưởng giúp xương dài ra.",
    grade: 8,
    topic: "Hệ cơ xương khớp",
    level: "BASIC"
  },
  {
    question: "Thành phần hóa học nào của xương giúp xương có tính mềm dẻo và đàn hồi?",
    options: ["Muối Canxi", "Muối Photpho", "Chất hữu cơ (cốt giao)", "Chất vô cơ"],
    correctAnswer: 2,
    explanation: "Chất hữu cơ (cốt giao) đảm bảo tính mềm dẻo; chất vô cơ (muối khoáng) đảm bảo tính bền chắc.",
    grade: 8,
    topic: "Hệ cơ xương khớp",
    level: "BASIC"
  },
  {
    question: "Đặc điểm nào của bộ xương người thích nghi với tư thế đứng thẳng và đi bằng hai chân?",
    options: ["Lồng ngực phát triển theo hướng lưng bụng", "Cột sống hình cung", "Xương chậu hẹp, xương đùi ngắn", "Bàn chân hình vòm, xương gót phát triển về phía sau"],
    correctAnswer: 3,
    explanation: "Bàn chân hình vòm giúp giảm sang chấn, xương gót phát triển giúp nâng đỡ trọng lượng cơ thể khi đứng thẳng.",
    grade: 8,
    topic: "Hệ cơ xương khớp",
    level: "GENERAL"
  },
  {
    question: "Khi cơ co, năng lượng cung cấp cho hoạt động co cơ được giải phóng từ quá trình nào?",
    options: ["Quá trình đồng hóa", "Oxy hóa chất dinh dưỡng (chủ yếu là Glucozo)", "Quá trình bài tiết", "Quá trình khuếch tán khí"],
    correctAnswer: 1,
    explanation: "Năng lượng co cơ lấy từ sự oxy hóa chất dinh dưỡng trong tế bào cơ (phản ứng hô hấp tế bào).",
    grade: 8,
    topic: "Hệ cơ xương khớp",
    level: "GENERAL"
  },
  {
    question: "Khớp xương nào sau đây thuộc loại khớp động?",
    options: ["Khớp giữa các xương sọ", "Khớp giữa các đốt sống", "Khớp gối", "Khớp háng (khớp bán động)"],
    correctAnswer: 2,
    explanation: "Khớp gối là khớp động điển hình có bao hoạt dịch và sụn đầu khớp, cho phép cử động linh hoạt.",
    grade: 8,
    topic: "Hệ cơ xương khớp",
    level: "BASIC"
  },
  {
    question: "Ở người, tim hoạt động suốt đời không mệt mỏi là nhờ:",
    options: ["Tim có cấu tạo cơ đặc biệt", "Thời gian nghỉ của các ngăn tim xen kẽ thời gian làm việc", "Tim được cung cấp nhiều máu O2", "Cơ tim không bao giờ bị mỏi"],
    correctAnswer: 1,
    explanation: "Chu kì tim 0.8s: tâm nhĩ co 0.1s nghỉ 0.7s; tâm thất co 0.3s nghỉ 0.5s; giãn chung 0.4s. Thời gian nghỉ đủ để phục hồi.",
    grade: 8,
    topic: "Hệ tuần hoàn"
  },
  {
    question: "Phép lai AaBb x aabb (phân li độc lập) cho tỉ lệ kiểu hình ở đời con là:",
    options: ["1:1:1:1", "9:3:3:1", "3:1", "1:1"],
    correctAnswer: 0,
    explanation: "Đây là phép lai phân tích cá thể dị hợp 2 cặp gen, tỉ lệ kiểu hình bằng tỉ lệ giao tử của cá thể đó: 1AB : 1Ab : 1aB : 1ab.",
    grade: 9,
    topic: "Di truyền"
  }
];

export const EXAM_PAPERS: ExamPaper[] = [
  { id: 'e1', title: 'Đề thi vào 10 Chuyên Sinh - Phổ Thông Năng Khiếu 2024', type: 'CHUYEN_10', year: '2024', description: 'Đề thi cực khó, tập trung vào bài tập di truyền phả hệ.' },
  { id: 'e2', title: 'Đề thi vào 10 Chuyên Sinh - Hà Nội Amsterdam 2024', type: 'CHUYEN_10', year: '2024', description: 'Nhiều câu hỏi về thực hành và thí nghiệm.' },
];

export const STUDY_PLAN_DATA: StudyPlanItem[] = [
  {
    week: 1,
    title: "Hệ Vận Động & Hệ Tiêu Hóa",
    topics: ["Xương & Cơ", "Enzyme tiêu hóa", "Cơ chế hấp thụ"],
    exercises: ["Trắc nghiệm cơ bản 8", "Tính công cơ"],
    reference: "SGK Sinh học 8 chuyên sâu"
  }
];
