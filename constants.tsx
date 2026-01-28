
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
    description: 'Máu, môi trường trong cơ thể và chu kì hoạt động của tim chuyên sâu.',
    checklist: [
      'Thành phần và chức năng của máu (Huyết tương & các tế bào máu)',
      'Cơ chế đông máu và sơ đồ truyền máu (Kháng nguyên - Kháng thể)',
      'Môi trường trong cơ thể: Máu, nước mô và bạch huyết',
      'Cấu tạo chi tiết tim (Vách ngăn, các loại van nhĩ thất và van động mạch)',
      'Chu kì tim (3 pha: nhĩ co, thất co, dãn chung) và sự biến đổi huyết áp',
      'Hệ mạch: Cấu tạo phù hợp chức năng của động mạch, tĩnh mạch, mao mạch',
      'Điều hòa hoạt động tim mạch bằng cơ chế thần kinh và nội tiết'
    ],
    summary: 'Máu gồm huyết tương và các tế bào máu. Tim hoạt động theo chu kì 0.8s với 3 pha giúp máu lưu thông liên tục qua hệ thống mạch kín.',
    lecturePrompt: 'Phân tích sâu về chu kì tim, huyết áp và cơ chế điều hòa hoạt động tim mạch lớp 8 chuyên sâu.',
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
  }
];

export const BIOLOGY_TOPICS = [...GRADE_8_TOPICS, ...GRADE_9_TOPICS];

export const QUESTION_POOL: QuizQuestion[] = [
  // HỆ CƠ XƯƠNG KHỚP (30 CÂU)
  {
    question: "Tế bào xương được sinh ra từ đâu giúp xương phát triển về bề ngang?",
    options: ["Sụn đầu xương", "Màng xương", "Tủy xương", "Sụn tăng trưởng"],
    correctAnswer: 1,
    explanation: "Sự phân chia của các tế bào màng xương giúp xương to ra về bề ngang.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Chất hữu cơ trong xương (cốt giao) có vai trò gì?",
    options: ["Giúp xương cứng chắc", "Giúp xương dài ra", "Giúp xương có tính đàn hồi, mềm dẻo", "Tham gia vào quá trình lọc máu"],
    correctAnswer: 2,
    explanation: "Cốt giao tạo nên tính mềm dẻo, trong khi muối khoáng tạo nên tính bền chắc cho xương.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Cấu tạo của một bắp cơ điển hình bao gồm:",
    options: ["Bó cơ và sợi cơ", "Sợi cơ và tơ cơ", "Sụn và dây chằng", "Xương và khớp"],
    correctAnswer: 0,
    explanation: "Bắp cơ gồm nhiều bó cơ, mỗi bó gồm nhiều sợi cơ (tế bào cơ).",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Đơn vị cấu trúc và chức năng của hệ cơ là:",
    options: ["Sợi cơ", "Tơ cơ", "Đơn vị co cơ (Sarcomere)", "Nơron vận động"],
    correctAnswer: 2,
    explanation: "Sarcomere là đơn vị nằm giữa hai vạch Z, chứa các tơ cơ dày (myosin) và mảnh (actin).",
    grade: 8, topic: "Hệ cơ xương khớp", level: "ADVANCED"
  },
  {
    question: "Hiện tượng 'mỏi cơ' chủ yếu do sự tích tụ của chất nào sau đây?",
    options: ["Khí Oxy", "Axit Lactic", "Đường Glucozo", "Muối Canxi"],
    correctAnswer: 1,
    explanation: "Khi thiếu oxy, tế bào cơ phân giải glucozo không hoàn toàn tạo ra axit lactic gây mỏi cơ.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Sụn tăng trưởng nằm ở vị trí nào của xương dài?",
    options: ["Trong ống xương", "Hai đầu xương", "Giữa thân xương và hai đầu xương", "Bọc ngoài màng xương"],
    correctAnswer: 2,
    explanation: "Sụn tăng trưởng nằm giữa thân và đầu xương giúp xương dài ra.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Khớp xương nào cho phép cử động linh hoạt nhất?",
    options: ["Khớp bán động", "Khớp bất động", "Khớp động", "Khớp sụn"],
    correctAnswer: 2,
    explanation: "Khớp động (như khớp vai, khớp gối) có bao hoạt dịch cho phép cử động linh hoạt.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Xương người già thường giòn và dễ gãy vì:",
    options: ["Tỷ lệ chất hữu cơ tăng", "Tỷ lệ chất hữu cơ giảm, chất vô cơ chiếm ưu thế", "Màng xương bị dày lên", "Lượng canxi trong máu quá cao"],
    correctAnswer: 1,
    explanation: "Ở người già, cốt giao giảm khiến xương mất tính mềm dẻo và trở nên giòn.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Khi cơ co, tơ cơ mảnh và tơ cơ dày trượt lên nhau làm cho đơn vị co cơ:",
    options: ["Dài ra", "Ngắn lại", "Không đổi", "Biến mất"],
    correctAnswer: 1,
    explanation: "Sự trượt lên nhau của actin và myosin làm sarcomere ngắn lại, dẫn đến co cơ.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Lồng ngực của người phát triển theo hướng nào để thích nghi đứng thẳng?",
    options: ["Lưng - bụng", "Trái - phải (mở rộng sang hai bên)", "Dọc theo cột sống", "Hẹp về phía trước"],
    correctAnswer: 1,
    explanation: "Ở người, lồng ngực mở rộng sang hai bên, khác với thú phát triển theo hướng lưng-bụng.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "ADVANCED"
  },
  {
    question: "Xương chậu của người có đặc điểm gì so với thú?",
    options: ["Hẹp và dài", "Rộng và ngắn", "Không có xương chậu", "Gắn chặt vào xương đùi"],
    correctAnswer: 1,
    explanation: "Xương chậu rộng giúp nâng đỡ các nội quan khi đứng thẳng.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Bàn chân hình vòm ở người có tác dụng:",
    options: ["Giúp chạy nhanh hơn", "Giảm sang chấn cho cơ thể khi di chuyển", "Dễ mang giày dép", "Tăng diện tích tiếp xúc với đất"],
    correctAnswer: 1,
    explanation: "Cấu tạo hình vòm giúp phân tán lực và giảm chấn động lên đại não.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Cơ nhị đầu và cơ tam đầu ở cánh tay hoạt động theo nguyên tắc:",
    options: ["Cùng co", "Cùng giãn", "Đối kháng (một co, một giãn)", "Độc lập hoàn toàn"],
    correctAnswer: 2,
    explanation: "Đây là cặp cơ đối kháng giúp gập và duỗi cánh tay.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Hệ thống ống Havers trong xương chứa gì bên trong?",
    options: ["Tủy đỏ", "Mạch máu và dây thần kinh", "Không khí", "Nước mô"],
    correctAnswer: 1,
    explanation: "Ống Havers chạy dọc trong mô xương cứng, chứa mạch máu nuôi dưỡng tế bào xương.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "ADVANCED"
  },
  {
    question: "Cột sống người có bao nhiêu chỗ cong tự nhiên?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    explanation: "Cột sống người cong ở 4 vị trí: cổ, ngực, thắt lưng, cùng tạo hình chữ S giúp giảm chấn động.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Thành phần nào giúp giảm ma sát giữa hai đầu xương trong khớp động?",
    options: ["Dây chằng", "Bao hoạt dịch và sụn đầu khớp", "Màng xương", "Tủy vàng"],
    correctAnswer: 1,
    explanation: "Sụn đầu khớp trơn và dịch khớp trong bao hoạt dịch giúp khớp cử động êm ái.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Công của cơ được tính bằng công thức nào?",
    options: ["A = F.s", "A = m.g", "A = P.v", "A = F/s"],
    correctAnswer: 0,
    explanation: "Công (A) bằng lực co cơ (F) nhân với quãng đường dịch chuyển (s).",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Để xương phát triển tốt, trẻ em cần bổ sung vitamin nào giúp hấp thụ Canxi?",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    correctAnswer: 3,
    explanation: "Vitamin D hỗ trợ quá trình chuyển hóa và hấp thụ Canxi vào xương.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Tủy đỏ xương nằm ở đâu và có chức năng gì?",
    options: ["Trong ống xương dài - dự trữ mỡ", "Ở các nan xương của đầu xương - tạo huyết", "Ở màng xương - giúp xương to ra", "Trong khoang xương của xương ngắn - bảo vệ"],
    correctAnswer: 1,
    explanation: "Tủy đỏ nằm trong các hốc xương xốp, có chức năng sinh ra các tế bào máu.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Cơ chế thần kinh điều khiển sự co cơ bắt đầu từ nơron nào?",
    options: ["Nơron hướng tâm", "Nơron trung gian", "Nơron ly tâm (vận động)", "Nơron cảm giác"],
    correctAnswer: 2,
    explanation: "Xung thần kinh từ trung ương truyền theo nơron ly tâm đến tấm vận động làm co cơ.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "ADVANCED"
  },
  {
    question: "Hiện tượng chuột rút (cramps) thường xảy ra do:",
    options: ["Dư thừa Oxy", "Thiếu Canxi hoặc tích tụ Axit Lactic quá mức", "Uống quá nhiều nước", "Cơ quá lỏng lẻo"],
    correctAnswer: 1,
    explanation: "Sự mất cân bằng ion (như Canxi) và tích tụ chất thải chuyển hóa gây co thắt cơ đột ngột.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Xương ức thuộc loại xương nào?",
    options: ["Xương dài", "Xương ngắn", "Xương dẹt", "Xương không định hình"],
    correctAnswer: 2,
    explanation: "Xương ức, xương bả vai, xương sọ thuộc nhóm xương dẹt.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Chất khoáng chủ yếu cấu tạo nên xương là:",
    options: ["Natri Clorua", "Canxi Photphat", "Sắt Oxit", "Kali Sunfat"],
    correctAnswer: 1,
    explanation: "Muối Canxi (chủ yếu là Canxi Photphat) tạo nên độ cứng cho xương.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Khi tập thể dục thường xuyên, cơ bắp to ra là do:",
    options: ["Số lượng sợi cơ tăng lên", "Đường kính các sợi cơ tăng lên nhờ tổng hợp thêm tơ cơ", "Lượng mỡ trong cơ tăng", "Mạch máu trong cơ biến mất"],
    correctAnswer: 1,
    explanation: "Luyện tập không làm tăng số lượng sợi cơ mà làm tăng kích thước từng sợi cơ.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "ADVANCED"
  },
  {
    question: "Khớp giữa các đốt sống thuộc loại khớp nào?",
    options: ["Khớp động", "Khớp bán động", "Khớp bất động", "Khớp quay"],
    correctAnswer: 1,
    explanation: "Khớp bán động cho phép cử động hạn chế, giúp cột sống uốn cong dẻo dai.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Xương đùi là xương lớn nhất cơ thể, nó thuộc loại:",
    options: ["Xương dẹt", "Xương dài", "Xương không định hình", "Xương ngắn"],
    correctAnswer: 1,
    explanation: "Xương đùi có cấu tạo hình ống, chứa tủy, là điển hình của xương dài.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },
  {
    question: "Chức năng của khoang xương ở xương dài của người trưởng thành là:",
    options: ["Chứa tủy đỏ để tạo máu", "Chứa tủy vàng để dự trữ mỡ", "Chứa không khí cho nhẹ xương", "Chứa nước dự trữ"],
    correctAnswer: 1,
    explanation: "Ở người trưởng thành, tủy đỏ trong khoang xương dài chuyển thành tủy vàng (mỡ).",
    grade: 8, topic: "Hệ cơ xương khớp", level: "GENERAL"
  },
  {
    question: "Phát biểu nào đúng về cấu tạo của xương xốp?",
    options: ["Gồm các nan xương sắp xếp ngẫu nhiên", "Gồm các nan xương sắp xếp theo hướng của lực tác động", "Là một khối xương đặc hoàn toàn", "Chứa nhiều mỡ dự trữ nhất"],
    correctAnswer: 1,
    explanation: "Cấu trúc nan xương giúp xương nhẹ nhưng vẫn chịu lực cực tốt.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "ADVANCED"
  },
  {
    question: "Năng lượng trực tiếp cho sự co cơ là:",
    options: ["Glucozo", "Axit béo", "ATP", "Vitamin"],
    correctAnswer: 2,
    explanation: "ATP là 'đồng tiền năng lượng' được tế bào cơ sử dụng trực tiếp để trượt tơ cơ.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "ADVANCED"
  },
  {
    question: "Tật cong vẹo cột sống ở học sinh chủ yếu do:",
    options: ["Di truyền", "Ngồi học sai tư thế hoặc mang cặp quá nặng", "Thiếu ánh sáng mặt trời", "Ăn quá nhiều đạm"],
    correctAnswer: 1,
    explanation: "Thói quen tư thế xấu khi xương đang phát triển dễ dẫn đến biến dạng cột sống.",
    grade: 8, topic: "Hệ cơ xương khớp", level: "BASIC"
  },

  // HỆ TUẦN HOÀN - 30 CÂU
  {
    question: "Thành phần nào của máu chiếm tỉ lệ thể tích lớn nhất (khoảng 55%)?",
    options: ["Hồng cầu", "Bạch cầu", "Tiểu cầu", "Huyết tương"],
    correctAnswer: 3,
    explanation: "Huyết tương chiếm khoảng 55% thể tích máu, còn lại 45% là các tế bào máu.",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Hồng cầu có đặc điểm cấu tạo nào phù hợp với chức năng vận chuyển khí?",
    options: ["Có nhân, hình đĩa, lõm 2 mặt", "Không nhân, hình đĩa, lõm 2 mặt, chứa Hemoglobin", "Có nhân, hình cầu, chứa sắt", "Không nhân, hình khối, chứa kháng thể"],
    correctAnswer: 1,
    explanation: "Hồng cầu không nhân giúp tăng không gian chứa Hb; hình đĩa lõm 2 mặt giúp tăng diện tích tiếp xúc với khí.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Loại bạch cầu nào tham gia vào quá trình thực bào để tiêu diệt vi khuẩn?",
    options: ["Bạch cầu trung tính và đại thực bào", "Bạch cầu Lympho B", "Bạch cầu Lympho T", "Bạch cầu ưa kiềm"],
    correctAnswer: 0,
    explanation: "Bạch cầu trung tính và đại thực bào có khả năng hình thành chân giả để bắt và tiêu hóa vi khuẩn.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Cơ chế đông máu diễn ra nhờ sự giải phóng chất nào từ tiểu cầu khi bị va chạm?",
    options: ["Huyết tương", "Kháng thể", "Enzym Thrombokinase", "Hemoglobin"],
    correctAnswer: 2,
    explanation: "Tiểu cầu vỡ giải phóng Thrombokinase, enzym này cùng ion Ca2+ biến Prothrombin thành Thrombin.",
    grade: 8, topic: "Hệ tuần hoàn", level: "ADVANCED"
  },
  {
    question: "Người có nhóm máu O có thể truyền máu cho người có nhóm máu nào?",
    options: ["Chỉ nhóm máu O", "Chỉ nhóm máu AB", "Tất cả các nhóm máu (A, B, AB, O)", "Không truyền được cho ai"],
    correctAnswer: 2,
    explanation: "Nhóm máu O không có kháng nguyên A và B trên hồng cầu nên không bị kháng thể của người nhận làm ngưng kết.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Kháng thể Anti-A và Anti-B tồn tại ở đâu trong máu?",
    options: ["Trên màng hồng cầu", "Trong huyết tương", "Trong nhân bạch cầu", "Gắn với tiểu cầu"],
    correctAnswer: 1,
    explanation: "Kháng thể (Agglutinin) nằm trong huyết tương, còn kháng nguyên (Agglutinogen) nằm trên màng hồng cầu.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Môi trường trong cơ thể bao gồm các thành phần nào?",
    options: ["Máu, nước tiểu, mồ hôi", "Máu, nước mô, bạch huyết", "Máu, tế bào, dịch tiêu hóa", "Nước mô, tế bào, huyết tương"],
    correctAnswer: 1,
    explanation: "Máu, nước mô và bạch huyết tạo thành môi trường trong giúp tế bào trao đổi chất.",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Tim người được cấu tạo bởi loại mô nào là chủ yếu?",
    options: ["Mô liên kết", "Mô cơ tim", "Mô thần kinh", "Mô biểu bì"],
    correctAnswer: 1,
    explanation: "Cơ tim là loại mô đặc biệt có khả năng co bóp tự động và bền bỉ suốt đời.",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Ngăn tim nào có thành cơ dày nhất để đẩy máu vào vòng tuần hoàn lớn?",
    options: ["Tâm nhĩ phải", "Tâm nhĩ trái", "Tâm thất phải", "Tâm thất trái"],
    correctAnswer: 3,
    explanation: "Tâm thất trái đẩy máu đi nuôi toàn cơ thể nên cần lực co bóp mạnh nhất, do đó thành cơ dày nhất.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Van nhĩ - thất có chức năng gì?",
    options: ["Cho máu chảy từ tâm thất lên tâm nhĩ", "Cho máu chảy một chiều từ tâm nhĩ xuống tâm thất", "Ngăn máu từ động mạch chảy về tim", "Đưa máu từ phổi về tim"],
    correctAnswer: 1,
    explanation: "Van nhĩ - thất (van 2 lá, 3 lá) đảm bảo máu chỉ đi theo một chiều từ nhĩ xuống thất.",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Một chu kì tim ở người trưởng thành lúc nghỉ ngơi kéo dài khoảng bao lâu?",
    options: ["0.1 s", "0.4 s", "0.8 s", "1.0 s"],
    correctAnswer: 2,
    explanation: "Chu kì tim 0.8s gồm: pha nhĩ co (0.1s), pha thất co (0.3s), pha dãn chung (0.4s).",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Trong chu kì tim, tâm thất nghỉ ngơi trong bao nhiêu giây?",
    options: ["0.3 s", "0.4 s", "0.5 s", "0.7 s"],
    correctAnswer: 2,
    explanation: "Tâm thất co 0.3s, nghỉ trong pha dãn chung (0.4s) và pha nhĩ co (0.1s), tổng cộng nghỉ 0.5s.",
    grade: 8, topic: "Hệ tuần hoàn", level: "ADVANCED"
  },
  {
    question: "Huyết áp là gì?",
    options: ["Lực co bóp của cơ tim", "Áp lực của máu tác động lên thành mạch", "Vận tốc máu chảy trong lòng mạch", "Số lần tim đập trong một phút"],
    correctAnswer: 1,
    explanation: "Huyết áp sinh ra do tâm thất co đẩy máu vào động mạch tạo áp lực lên thành mạch.",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Vận tốc máu chảy chậm nhất ở loại mạch nào?",
    options: ["Động mạch", "Tĩnh mạch", "Mao mạch", "Động mạch chủ"],
    correctAnswer: 2,
    explanation: "Mao mạch có tổng tiết diện lớn nhất nên vận tốc máu chậm nhất, thuận lợi cho trao đổi chất.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Huyết áp tối thiểu (huyết áp tâm trương) ứng với giai đoạn nào của tim?",
    options: ["Tâm nhĩ co", "Tâm thất co", "Pha dãn chung", "Lúc máu chảy vào mao mạch"],
    correctAnswer: 2,
    explanation: "Huyết áp tâm trương đo được khi tâm thất dãn, áp lực lên thành mạch là thấp nhất.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Đặc điểm cấu tạo của mao mạch giúp thực hiện chức năng trao đổi chất là:",
    options: ["Thành dày, nhiều lớp cơ", "Thành rất mỏng, chỉ gồm 1 lớp biểu bì", "Có van một chiều", "Lòng mạch rộng, co bóp mạnh"],
    correctAnswer: 1,
    explanation: "Thành mao mạch mỏng giúp các chất dễ dàng khuếch tán qua lại giữa máu và tế bào.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Hệ mạch nào luôn có van để ngăn máu chảy ngược?",
    options: ["Động mạch ở chi", "Mao mạch", "Tĩnh mạch ở chi dưới", "Động mạch phổi"],
    correctAnswer: 2,
    explanation: "Tĩnh mạch chi dưới có van để chống lại trọng lực, đảm bảo máu chảy về tim.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Máu trong tĩnh mạch phổi có đặc điểm gì?",
    options: ["Đỏ tươi, giàu Oxy", "Đỏ thẫm, giàu CO2", "Đỏ thẫm, giàu Oxy", "Đỏ tươi, giàu CO2"],
    correctAnswer: 0,
    explanation: "Tĩnh mạch phổi dẫn máu đã được trao đổi khí ở phổi về tâm nhĩ trái nên rất giàu O2.",
    grade: 8, topic: "Hệ tuần hoàn", level: "ADVANCED"
  },
  {
    question: "Vòng tuần hoàn lớn bắt đầu từ đâu và kết thúc ở đâu?",
    options: ["Thất phải -> Nhĩ trái", "Thất trái -> Nhĩ phải", "Thất trái -> Nhĩ trái", "Thất phải -> Nhĩ phải"],
    correctAnswer: 1,
    explanation: "Vòng tuần hoàn lớn: Thất trái -> Động mạch chủ -> Mao mạch cơ thể -> Tĩnh mạch chủ -> Nhĩ phải.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Nút xoang nhĩ có vai trò gì trong hoạt động của tim?",
    options: ["Làm tim ngừng đập", "Phát xung thần kinh gây co tim tự động", "Dẫn máu về phổi", "Điều khiển huyết áp"],
    correctAnswer: 1,
    explanation: "Nút xoang nhĩ là bộ phận phát nhịp tự động cho tim hoạt động.",
    grade: 8, topic: "Hệ tuần hoàn", level: "ADVANCED"
  },
  {
    question: "Hệ thần kinh giao cảm ảnh hưởng như thế nào đến tim?",
    options: ["Làm tim đập chậm, yếu", "Làm tim đập nhanh, mạnh", "Không ảnh hưởng", "Làm tim ngừng đập"],
    correctAnswer: 1,
    explanation: "Thần kinh giao cảm làm tăng cường hoạt động tim, đối giao cảm làm giảm hoạt động tim.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Sự luân chuyển bạch huyết trong hệ mạch bạch huyết diễn ra nhờ:",
    options: ["Lực hút của phổi", "Sự co bóp của các cơ quanh mạch và van một chiều", "Lực co bóp của tâm thất", "Áp suất thẩm thấu của muối"],
    correctAnswer: 1,
    explanation: "Mạch bạch huyết không có bơm trung tâm như tim nên nhờ cơ vân co bóp và van để lưu thông.",
    grade: 8, topic: "Hệ tuần hoàn", level: "ADVANCED"
  },
  {
    question: "Khi cơ thể bị mất máu nhiều, huyết áp sẽ biến đổi như thế nào?",
    options: ["Tăng lên đột ngột", "Không đổi", "Giảm xuống", "Dao động mạnh"],
    correctAnswer: 2,
    explanation: "Thể tích máu giảm làm áp lực lên thành mạch giảm, dẫn đến hạ huyết áp.",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Hormone nào sau đây làm tăng nhịp tim và huyết áp khi sợ hãi?",
    options: ["Insulin", "Adrenalin", "Thyroxin", "Glucagon"],
    correctAnswer: 1,
    explanation: "Adrenalin (từ tuyến thượng thận) chuẩn bị cơ thể cho phản ứng 'chiến đấu hay bỏ chạy'.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Mao mạch bạch huyết có cấu tạo đặc biệt như thế nào so với mao mạch máu?",
    options: ["Là hệ mạch kín", "Một đầu hở, một đầu kín", "Thành rất dày", "Không có lỗ lọc"],
    correctAnswer: 1,
    explanation: "Mao mạch bạch huyết là những ống đầu tận (kín một đầu) nằm xen kẽ trong các kẽ mô.",
    grade: 8, topic: "Hệ tuần hoàn", level: "ADVANCED"
  },
  {
    question: "Tại sao tim hoạt động suốt đời mà không mệt mỏi?",
    options: ["Vì cơ tim rất cứng", "Vì thời gian nghỉ trong một chu kì đủ để phục hồi khả năng co bóp", "Vì tim không bao giờ nghỉ", "Vì có sự trợ giúp của phổi"],
    correctAnswer: 1,
    explanation: "Tim co 0.4s và nghỉ 0.4s (trong chu kì 0.8s), thời gian nghỉ đủ để phục hồi năng lượng và dưỡng chất.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
  },
  {
    question: "Hệ ABO có bao nhiêu kiểu hình nhóm máu chính?",
    options: ["2", "3", "4", "8"],
    correctAnswer: 2,
    explanation: "Có 4 nhóm máu chính: A, B, AB, O dựa trên sự có mặt của kháng nguyên trên hồng cầu.",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Huyết áp kẹt là hiện tượng gì?",
    options: ["Huyết áp tối đa quá cao", "Hiệu số giữa huyết áp tối đa và tối thiểu bằng hoặc nhỏ hơn 20 mmHg", "Huyết áp tối thiểu bằng 0", "Huyết áp không đo được"],
    correctAnswer: 1,
    explanation: "Huyết áp kẹt rất nguy hiểm vì tim không đủ lực để tống máu đi hiệu quả.",
    grade: 8, topic: "Hệ tuần hoàn", level: "ADVANCED"
  },
  {
    question: "Chỉ số huyết áp 120/80 mmHg, số 80 cho biết điều gì?",
    options: ["Huyết áp tối đa", "Huyết áp tối thiểu", "Nhịp tim", "Lượng oxy trong máu"],
    correctAnswer: 1,
    explanation: "Số lớn là HA tâm thu (tối đa), số nhỏ là HA tâm trương (tối thiểu).",
    grade: 8, topic: "Hệ tuần hoàn", level: "BASIC"
  },
  {
    question: "Vị trí đặt ống nghe để đo huyết áp động mạch cánh tay thường là ở đâu?",
    options: ["Cổ tay", "Nếp gấp khuỷu tay", "Bả vai", "Mu bàn tay"],
    correctAnswer: 1,
    explanation: "Tại nếp gấp khuỷu tay, động mạch cánh tay nằm khá nông, dễ bắt nhịp đập.",
    grade: 8, topic: "Hệ tuần hoàn", level: "GENERAL"
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

// Added BANK_DATA to fix export error in TopicHub.tsx and BankView.tsx
export const BANK_DATA: BankItem[] = [
  {
    id: 'b1',
    title: 'Sơ đồ chu kì tim chi tiết',
    description: 'Tài liệu phân tích 3 pha của chu kì tim và sự biến đổi áp suất trong các ngăn tim chuyên sâu cho HSG.',
    type: 'LECTURE',
    topicId: 'g8-circulatory',
    grade: 8,
    source: 'SGK Nâng Cao',
    dateAdded: '2024-01-15',
    fileType: 'LINK',
    url: 'https://example.com/circulatory-diagram'
  },
  {
    id: 'b2',
    title: 'Đề thi HSG Sinh 9 - TP.HCM 2023',
    description: 'Đề thi chính thức kèm đáp án chi tiết phần di truyền Mendel và biến dị tổ hợp.',
    type: 'EXAM',
    topicId: 'g9-genetics-mendel',
    grade: 9,
    source: 'Sở GD&ĐT',
    dateAdded: '2023-12-10',
    fileType: 'DRIVE',
    url: 'https://drive.google.com/example'
  },
  {
    id: 'b3',
    title: 'Cơ chế co cơ ở mức độ phân tử',
    description: 'Phân tích sâu về vai trò của ATP, Ca2+ và sự trượt của các sợi actin, myosin trong đơn vị co cơ.',
    type: 'LECTURE',
    topicId: 'g8-musculoskeletal',
    grade: 8,
    source: 'Tài liệu chuyên chuyên sâu',
    dateAdded: '2024-02-01',
    fileType: 'FILE'
  }
];
