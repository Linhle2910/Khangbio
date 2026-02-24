
import { BiologyTopic, ExamPaper, QuizQuestion, StudyPlanItem, BankItem } from './types';

export const GRADE_8_TOPICS: BiologyTopic[] = [
  {
    id: 'g8-1',
    title: 'Hệ vận động',
    grade: 8,
    icon: '🦴',
    description: 'Cấu tạo bộ xương, bắp cơ và cơ chế vận động chuyên sâu.',
    checklist: ['Thành phần hóa học của xương', 'Sự to ra và dài ra của xương', 'Cơ chế co cơ và công của cơ', 'Vệ sinh hệ vận động'],
    summary: 'Hệ vận động gồm xương và cơ. Xương là khung nâng đỡ, cơ co giúp xương di chuyển.',
    lecturePrompt: 'Giảng chi tiết về hệ vận động lớp 8 chuyên sâu.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-2',
    title: 'Hệ tuần hoàn',
    grade: 8,
    icon: '🫀',
    description: 'Máu, môi trường trong cơ thể và chu kì hoạt động của tim.',
    checklist: ['Cấu tạo máu và chức năng các thành phần', 'Sơ đồ truyền máu và đông máu', 'Chu kì tim và biến đổi huyết áp', 'Hệ mạch và điều hòa tim mạch'],
    summary: 'Tim co bóp đẩy máu lưu thông liên tục qua hệ mạch kín để cung cấp oxy và dưỡng chất.',
    lecturePrompt: 'Phân tích sâu về chu kì tim và cơ chế truyền máu lớp 8.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-3',
    title: 'Hệ hô hấp',
    grade: 8,
    icon: '🫁',
    description: 'Cơ chế trao đổi khí ở phổi và tế bào.',
    checklist: ['Cấu tạo cơ quan hô hấp', 'Cơ chế hít vào - thở ra', 'Khuếch tán khí tại phế nang', 'Điều hòa hô hấp'],
    summary: 'Hô hấp giúp lấy O2 và thải CO2 thông qua khuếch tán tại phế nang và tế bào.',
    lecturePrompt: 'Giảng về cơ chế trao đổi khí lớp 8 chuyên sâu.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-4',
    title: 'Hệ tiêu hóa',
    grade: 8,
    icon: '🍕',
    description: 'Biến đổi lý học và hóa học thức ăn.',
    checklist: ['Enzyme tiêu hóa (Amilaza, Pepsin...)', 'Tiêu hóa ở khoang miệng, dạ dày, ruột non', 'Hấp thụ chất dinh dưỡng', 'Vai trò của gan và mật'],
    summary: 'Tiêu hóa biến thức ăn phức tạp thành chất đơn giản để cơ thể hấp thụ được.',
    lecturePrompt: 'Phân tích sâu về các loại enzyme tiêu hóa và cơ chế hấp thụ.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-5',
    title: 'Hệ bài tiết',
    grade: 8,
    icon: '💧',
    description: 'Cấu tạo Nephron và cơ chế lọc máu tạo nước tiểu.',
    checklist: ['Cấu tạo Nephron của thận', 'Quá trình lọc máu và hấp thụ lại', 'Quá trình bài tiết tiếp', 'Vệ sinh hệ bài tiết'],
    summary: 'Thận lọc máu hình thành nước tiểu giúp duy trì cân bằng nội môi.',
    lecturePrompt: 'Giảng về 3 quá trình tạo thành nước tiểu chuyên sâu.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-6',
    title: 'Hệ thần kinh',
    grade: 8,
    icon: '🧠',
    description: 'Điều khiển và phối hợp các hoạt động cơ thể.',
    checklist: ['Cấu tạo Nơron và Cung phản xạ', 'Các phần của não bộ', 'Thần kinh trung ương và ngoại biên', 'Phản xạ có điều kiện và không điều kiện'],
    summary: 'Hệ thần kinh tiếp nhận và xử lý kích thích thông qua xung thần kinh.',
    lecturePrompt: 'Phân tích sâu về cấu tạo đại não và các vùng chức năng.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-7',
    title: 'Hệ giác quan',
    grade: 8,
    icon: '👁️',
    description: 'Cơ chế nhìn của mắt và nghe của tai.',
    checklist: ['Cấu tạo màng lưới và tế bào thụ cảm', 'Cơ chế điều tiết mắt', 'Cấu tạo tai và cơ chế truyền âm', 'Vệ sinh giác quan'],
    summary: 'Giác quan giúp cơ thể nhận biết các biến đổi từ môi trường ngoài.',
    lecturePrompt: 'Giảng về cơ chế tạo ảnh trên màng lưới và dẫn truyền âm thanh.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-8',
    title: 'Hệ nội tiết',
    grade: 8,
    icon: '🧪',
    description: 'Vai trò của Hormone trong điều hòa sinh lý.',
    checklist: ['Tuyến yên, tuyến giáp, tuyến tụy', 'Điều hòa đường huyết bằng Insulin/Glucagon', 'Tuyến trên thận và hormone sinh dục', 'Cơ chế điều hòa ngược (Feedback)'],
    summary: 'Hormone được tiết vào máu giúp điều chỉnh các hoạt động sinh lý kéo dài.',
    lecturePrompt: 'Phân tích cơ chế feedback âm tính trong hệ nội tiết chuyên sâu.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-9',
    title: 'Hệ sinh sản',
    grade: 8,
    icon: '👶',
    description: 'Cơ quan sinh sản và duy trì nòi giống.',
    checklist: ['Cấu tạo cơ quan sinh sản nam nữ', 'Thụ tinh, thụ thai và phát triển thai nhi', 'Chu kì kinh nguyệt và hormone liên quan', 'Sức khỏe sinh sản'],
    summary: 'Đảm bảo sự duy trì nòi giống thông qua quá trình tạo giao tử và thụ tinh.',
    lecturePrompt: 'Giảng về chu kì kinh nguyệt và vai trò hormone buồng trứng.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-10',
    title: 'Trao đổi chất và năng lượng',
    grade: 8,
    icon: '⚡',
    description: 'Đồng hóa, dị hóa và chuyển hóa cấp độ tế bào.',
    checklist: ['Đồng hóa và dị hóa', 'Chuyển hóa vật chất và năng lượng', 'Điều hòa thân nhiệt', 'Vitamin và muối khoáng'],
    summary: 'Sự cân bằng giữa tổng hợp và phân giải chất giúp duy trì sự sống.',
    lecturePrompt: 'Phân tích mối quan hệ giữa đồng hóa và dị hóa lớp 8 chuyên sâu.',
    category: 'Hệ cơ quan'
  },
  {
    id: 'g8-11',
    title: 'Sinh vật và môi trường',
    grade: 8,
    icon: '🌍',
    description: 'Tương tác giữa sinh vật và các nhân tố sinh thái.',
    checklist: ['Nhân tố vô sinh và hữu sinh', 'Giới hạn sinh thái', 'Quần thể và Quần xã', 'Hệ sinh thái và Chuỗi thức ăn'],
    summary: 'Sinh vật và môi trường luôn tác động qua lại tạo thành một hệ thống thống nhất.',
    lecturePrompt: 'Giảng về lưới thức ăn và dòng năng lượng trong hệ sinh thái.',
    category: 'Sinh thái'
  }
];

export const GRADE_9_TOPICS: BiologyTopic[] = [
  {
    id: 'g9-1',
    title: 'Quy luật di truyền Mendel',
    grade: 9,
    icon: '🧬',
    description: 'Lai một cặp và hai cặp tính trạng.',
    checklist: ['Quy luật phân li', 'Quy luật phân li độc lập', 'Lai phân tích', 'Xác suất trong di truyền'],
    summary: 'Cơ sở của di truyền học hiện đại dựa trên các quy luật của Mendel.',
    lecturePrompt: 'Giảng sâu về bài tập lai 2 cặp tính trạng và cách tính xác suất.',
    category: 'Di truyền'
  }
];

export const BIOLOGY_TOPICS = [...GRADE_8_TOPICS, ...GRADE_9_TOPICS];

export const QUESTION_POOL: QuizQuestion[] = [
  {
    question: "Tế bào xương được sinh ra từ đâu giúp xương phát triển về bề ngang?",
    options: ["Sụn đầu xương", "Màng xương", "Tủy xương", "Sụn tăng trưởng"],
    correctAnswer: 1,
    explanation: "Sự phân chia của các tế bào màng xương giúp xương to ra về bề ngang.",
    grade: 8, topic: "Hệ vận động", level: "BASIC"
  },
  {
    question: "Đơn vị cấu trúc và chức năng của hệ cơ là:",
    options: ["Sợi cơ", "Tơ cơ", "Đơn vị co cơ (Sarcomere)", "Nơron vận động"],
    correctAnswer: 2,
    explanation: "Sarcomere là đơn vị nằm giữa hai vạch Z, chứa các tơ cơ dày (myosin) và mảnh (actin).",
    grade: 8, topic: "Hệ vận động", level: "ADVANCED"
  },
  {
    question: "Chu kì tim ở người trưởng thành kéo dài 0.8s, trong đó tâm thất co trong bao lâu?",
    options: ["0.1s", "0.3s", "0.4s", "0.5s"],
    correctAnswer: 1,
    explanation: "Pha nhĩ co (0.1s), pha thất co (0.3s), pha dãn chung (0.4s).",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Enzyme nào sau đây có vai trò phân giải Protein tại dạ dày?",
    options: ["Amilaza", "Pepsin", "Tripsin", "Lipaza"],
    correctAnswer: 1,
    explanation: "Trong môi trường axit của dịch vị, enzyme Pepsin biến đổi protein thành các chuỗi ngắn.",
    grade: 8, topic: "Hệ tiêu hóa", level: "BASIC"
  },
  {
    question: "Sự trao đổi khí ở phổi diễn ra theo cơ chế nào?",
    options: ["Vận chuyển chủ động", "Khuếch tán", "Thẩm thấu", "Ẩm bào"],
    correctAnswer: 1,
    explanation: "Khí O2 và CO2 khuếch tán từ nơi có nồng độ cao đến nơi có nồng độ thấp.",
    grade: 8, topic: "Hệ hô hấp", level: "BASIC"
  },
  {
    question: "Đơn vị chức năng của thận (Nephron) bao gồm các thành phần:",
    options: ["Cầu thận và nang cầu thận", "Cầu thận, nang cầu thận và ống thận", "Ống thận và bể thận", "Cầu thận và ống dẫn nước tiểu"],
    correctAnswer: 1,
    explanation: "Một Nephron gồm cầu thận, nang cầu thận bao quanh và hệ thống ống thận.",
    grade: 8, topic: "Hệ bài tiết", level: "GENERAL"
  },
  {
    question: "Bộ phận nào của não bộ điều khiển các hoạt động phản xạ có điều kiện?",
    options: ["Tiểu não", "Trụ não", "Não trung gian", "Đại não"],
    correctAnswer: 3,
    explanation: "Vỏ đại não là trung tâm của các phản xạ có điều kiện.",
    grade: 8, topic: "Hệ thần kinh", level: "BASIC"
  },
  {
    question: "Tuyến nào được coi là tuyến nội tiết 'chỉ huy' vì điều khiển các tuyến khác?",
    options: ["Tuyến giáp", "Tuyến tụy", "Tuyến yên", "Tuyến thượng thận"],
    correctAnswer: 2,
    explanation: "Tuyến yên tiết ra các hormone kích thích hoạt động của các tuyến nội tiết khác.",
    grade: 8, topic: "Hệ nội tiết", level: "BASIC"
  },
  {
    question: "Sự thụ tinh thường diễn ra ở vị trí nào trong cơ quan sinh sản nữ?",
    options: ["Tử cung", "Âm đạo", "1/3 phía ngoài ống dẫn trứng", "Buồng trứng"],
    correctAnswer: 2,
    explanation: "Trứng gặp tinh trùng và thụ tinh tại đoạn đầu của ống dẫn trứng.",
    grade: 8, topic: "Hệ sinh sản", level: "GENERAL"
  },
  {
    question: "Giới hạn sinh thái là gì?",
    options: ["Nơi sinh vật sinh sống", "Khoảng giá trị xác định của nhân tố sinh thái mà sinh vật có thể tồn tại", "Mức độ thuận lợi nhất", "Mối quan hệ sinh vật"],
    correctAnswer: 1,
    explanation: "Vượt ra ngoài giới hạn này sinh vật sẽ chết.",
    grade: 8, topic: "Sinh vật và môi trường", level: "GENERAL"
  }
];

export const EXAM_PAPERS: ExamPaper[] = [];

export const STUDY_PLAN_DATA: StudyPlanItem[] = [
  {
    week: 1,
    title: "Hệ Vận Động & Hệ Tiêu Hóa",
    topics: ["Xương & Cơ", "Enzyme tiêu hóa", "Cơ chế hấp thụ"],
    exercises: ["Trắc nghiệm cơ bản 8", "Tính công cơ"],
    reference: "SGK Sinh học 8 chuyên sâu"
  }
];

export const BANK_DATA: BankItem[] = [];
