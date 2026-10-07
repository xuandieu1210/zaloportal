import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini AI if key is present
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- Mock Database Store ---
interface Department {
  id: string;
  name: string;
  code: string;
  leader: string;
  phone: string;
  description: string;
}

interface Field {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
}

interface Staff {
  id: string;
  name: string;
  departmentId: string;
  fieldId: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Active' | 'OnLeave' | 'Offline';
  zaloId?: string;
  coordinationRole?: 'Approval' | 'Processing';
  coordinationCategory?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  categoryId: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  status: 'Published' | 'Draft';
  views: number;
  thumbnail: string;
  isFeatured?: boolean;
  articleUrl?: string;
}

interface Citizen {
  id: string;
  name: string;
  zaloId: string;
  phone: string;
  avatar: string;
  registeredDate: string;
  totalFeedbacks: number;
  status: 'Active' | 'Locked';
  cccd?: string;
  gender?: string;
  religion?: string;
  email?: string;
  address?: string;
  village?: string;
  occupation?: string;
  education?: string;
  ethnicity?: string;
  notes?: string;
}

interface Feedback {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  title: string;
  category: string;
  fieldId: string;
  content: string;
  submittedAt: string;
  status: 'Pending' | 'Processing' | 'Resolved' | 'Rejected';
  approvalStatus: 'PendingApproval' | 'Approved' | 'Rejected';
  privacy: 'Public' | 'Private';
  assignedStaffId?: string;
  responderName?: string;
  approvedBy?: string;
  responseContent?: string;
  responseDate?: string;
  attachments?: string[];
  rating?: number; // 1-5
}

interface QueueItem {
  id: string;
  queueNumber: string;
  serviceName: string;
  citizenName: string;
  citizenPhone: string;
  issuedAt: string;
  status: 'Waiting' | 'Serving' | 'Completed' | 'Cancelled';
  counterNumber?: string;
  estimatedMinutes: number;
}

interface DispatchItem {
  id: string;
  title: string;
  senderDepartmentId: string;
  receiverDepartmentId: string;
  content: string;
  priority: 'High' | 'Normal' | 'Low';
  deadline: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  createdAt: string;
}

// Seed Data
let departments: Department[] = [
  { id: 'd1', name: 'Phòng Tiếp nhận và Trả kết quả (Một cửa)', code: 'MC', leader: 'Nguyễn Văn A', phone: '02838221122', description: 'Đầu mối tiếp nhận hồ sơ thủ tục hành chính công' },
  { id: 'd2', name: 'Phòng Quản lý Đất đai & Đô thị', code: 'QLDT', leader: 'Trần Thị B', phone: '02838223344', description: 'Quản lý đất đai, cấp phép xây dựng, quy hoạch' },
  { id: 'd3', name: 'Phòng Tư pháp - Hộ tịch', code: 'TPHT', leader: 'Lê Văn C', phone: '02838225566', description: 'Đăng ký kết hôn, khai sinh, chứng thực' },
  { id: 'd4', name: 'Phòng Lao động - Thương binh & Xã hội', code: 'LDTBXH', leader: 'Phạm Thị D', phone: '02838227788', description: 'Chính sách xã hội, bảo trợ, việc làm' }
];

let fields: Field[] = [
  { id: 'f1', name: 'Thủ tục Đất đai', code: 'LAND', description: 'Cấp sổ đỏ, chuyển mục đích sử dụng đất', icon: 'MapPin' },
  { id: 'f2', name: 'Đăng ký Hộ tịch', code: 'CIVIL', description: 'Khai sinh, kết hôn, khai tử', icon: 'FileText' },
  { id: 'f3', name: 'Cấp phép Xây dựng', code: 'BUILD', description: 'Giấy phép xây dựng nhà ở riêng lẻ', icon: 'Home' },
  { id: 'f4', name: 'Bảo trợ & Chính sách XH', code: 'SOCIAL', description: 'Trợ cấp xã hội, hộ nghèo', icon: 'Users' },
  { id: 'f5', name: 'Y tế & An toàn thực phẩm', code: 'HEALTH', description: 'Đăng ký hành nghề y dược, ATTP', icon: 'Activity' }
];

let staffList: Staff[] = [
  { id: 's1', name: 'Phạm Phi Hùng', departmentId: 'd1', fieldId: 'f4', title: 'Trưởng Phòng Kinh tế xã', email: 'hungpp@gov.vn', phone: '84905295113', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', status: 'Active', coordinationRole: 'Approval', coordinationCategory: 'Đời sống nhân dân' },
  { id: 's2', name: 'Nguyễn Văn A', departmentId: 'd1', fieldId: 'f1', title: 'Chuyên viên', email: 'anv@gov.vn', phone: '84919090084', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', status: 'Active', coordinationRole: 'Approval', coordinationCategory: 'Thủ tục hành chính' },
  { id: 's3', name: 'Phạm Minh Đức', departmentId: 'd1', fieldId: 'f4', title: 'Chuyên viên Văn phòng HĐND', email: 'ducpm@gov.vn', phone: '84972271879', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'Active', coordinationRole: 'Approval', coordinationCategory: 'Đời sống nhân dân' },
  { id: 's4', name: 'Lê Văn C', departmentId: 'd3', fieldId: 'f2', title: 'Chuyên viên chính', email: 'clv@gov.vn', phone: '0923456789', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'Active', coordinationRole: 'Processing', coordinationCategory: 'Đời sống nhân dân' }
];

let categories: Category[] = [
  { id: 'c1', name: 'Thông báo hành chính', slug: 'thong-bao-hanh-chinh' },
  { id: 'c2', name: 'Tin tức & Sự kiện', slug: 'tin-tuc-su-kien' },
  { id: 'c3', name: 'Thủ tục mới ban hành', slug: 'thu-tuc-moi' },
  { id: 'c4', name: 'Hỏi đáp dịch vụ công', slug: 'hoi-dap-dvc' }
];

let articles: Article[] = [
  { id: 'a1', title: 'Triển khai dịch vụ công trực tuyến mức độ toàn trình năm 2026', categoryId: 'c1', summary: 'UBND Thành phố vừa ban hành kế hoạch đẩy mạnh dịch vụ công trực tuyến trên Zalo Mini App phục vụ người dân.', content: 'Nội dung chi tiết về việc áp dụng dịch vụ công toàn trình, giúp người dân nộp hồ sơ không cần đến trực tiếp cơ quan hành chính...', author: 'Ban Biên Tập', publishedAt: '2026-10-01 08:30', status: 'Published', views: 1420, thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600' },
  { id: 'a2', title: 'Hướng dẫn bốc số thứ tự trực tuyến qua Zalo Mini App', categoryId: 'c3', summary: 'Tính năng bốc số chờ trực tuyến giúp người dân chủ động thời gian khi đến làm thủ tục tại bộ phận Một cửa.', content: 'Người dân truy cập Zalo Mini App, chọn mục Bốc số chờ, lựa chọn lĩnh vực và lấy số thứ tự điện tử...', author: 'Phòng CNTT', publishedAt: '2026-10-03 10:15', status: 'Published', views: 890, thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600' },
  { id: 'a3', title: 'Lịch tiếp công dân định kỳ tháng 10/2026', categoryId: 'c2', summary: 'Thông báo lịch tiếp công dân của Lãnh đạo Ủy ban nhân dân trong tháng 10 năm 2026.', content: 'Thời gian, địa điểm và quy trình đăng ký tiếp công dân định kỳ...', author: 'Văn phòng UBND', publishedAt: '2026-10-05 14:00', status: 'Published', views: 530, thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600' }
];

let citizens: Citizen[] = [
  { id: 'cit1', name: 'Hoàng Minh Tuấn', zaloId: 'zalo_cit_991', phone: '0988111222', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', registeredDate: '2026-09-15', totalFeedbacks: 3, status: 'Active' },
  { id: 'cit2', name: 'Nguyễn Thị Mai', zaloId: 'zalo_cit_992', phone: '0977222333', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', registeredDate: '2026-09-20', totalFeedbacks: 1, status: 'Active' },
  { id: 'cit3', name: 'Đỗ Hoàng Long', zaloId: 'zalo_cit_993', phone: '0966333444', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', registeredDate: '2026-09-25', totalFeedbacks: 2, status: 'Active' }
];

let feedbacks: Feedback[] = [
  {
    id: 'fb1',
    citizenId: 'cit1',
    citizenName: 'Doan Tan Khang',
    citizenPhone: '84975862265',
    title: 'quán coffee quá ồn',
    category: 'Đời sống nhân dân',
    fieldId: 'f4',
    content: 'Cần hỗ trợ xử lý tiếng ồn vượt mức cho phép từ quán coffee vào ban đêm.',
    submittedAt: '22:15:41 22/08/2026',
    status: 'Resolved',
    approvalStatus: 'Approved',
    privacy: 'Public',
    assignedStaffId: 's1',
    responderName: 'Phạm Minh Đức',
    approvedBy: 'Nguyễn Văn A',
    responseContent: 'dqwdqwdwqd13d1',
    responseDate: '22:17:09 22/08/2026',
    attachments: ['Đính kèm.png']
  },
  {
    id: 'fb2',
    citizenId: 'cit2',
    citizenName: 'Ẩn danh',
    citizenPhone: '0988000111',
    title: 'Test pakn',
    category: 'Thủ tục hành chính',
    fieldId: 'f2',
    content: 'Gửi thử nghiệm hệ thống phản ánh kiến nghị trực tuyến.',
    submittedAt: '16:21:00 22/08/2026',
    status: 'Pending',
    approvalStatus: 'Approved',
    privacy: 'Public',
    assignedStaffId: 's3',
    responderName: 'Lê Văn C',
    approvedBy: 'Trần Thị B',
    responseContent: 'Đã tiếp nhận hệ thống thử nghiệm.',
    responseDate: '16:30:00 22/08/2026',
    attachments: []
  },
  {
    id: 'fb3',
    citizenId: 'cit3',
    citizenName: 'Nguyễn Văn Minh',
    citizenPhone: '0911223344',
    title: 'Thủ tục cấp sổ đỏ bị chậm trễ',
    category: 'Đất đai – xây dựng – hạ tầng',
    fieldId: 'f1',
    content: 'Hồ sơ sang tên nhà đất tại phường đã nộp hơn 45 ngày nhưng chưa có kết quả.',
    submittedAt: '09:12:00 05/10/2026',
    status: 'Processing',
    approvalStatus: 'PendingApproval',
    privacy: 'Private',
    assignedStaffId: 's2',
    responseContent: undefined,
    attachments: ['So_do.pdf']
  }
];

let queueItems: QueueItem[] = [
  { id: 'q1', queueNumber: 'A-101', serviceName: 'Đăng ký Hộ tịch', citizenName: 'Nguyễn Văn Minh', citizenPhone: '0911223344', issuedAt: '2026-10-07 08:15', status: 'Completed', counterNumber: 'Quầy 01', estimatedMinutes: 0 },
  { id: 'q2', queueNumber: 'A-102', serviceName: 'Đăng ký Hộ tịch', citizenName: 'Trần Mai Hương', citizenPhone: '0922334455', issuedAt: '2026-10-07 08:30', status: 'Serving', counterNumber: 'Quầy 01', estimatedMinutes: 5 },
  { id: 'q3', queueNumber: 'B-201', serviceName: 'Thủ tục Đất đai', citizenName: 'Phạm Hữu Tài', citizenPhone: '0933445566', issuedAt: '2026-10-07 08:45', status: 'Waiting', counterNumber: 'Quầy 03', estimatedMinutes: 15 },
  { id: 'q4', queueNumber: 'C-301', serviceName: 'Cấp phép Xây dựng', citizenName: 'Vũ Hoàng Nam', citizenPhone: '0944556677', issuedAt: '2026-10-07 09:00', status: 'Waiting', counterNumber: 'Quầy 02', estimatedMinutes: 25 }
];

let dispatches: DispatchItem[] = [
  { id: 'ds1', title: 'Phối hợp giải quyết khiếu nại đất đai phường Tân Định', senderDepartmentId: 'd1', receiverDepartmentId: 'd2', content: 'Chuyển đơn kiến nghị số FB-042 sang phòng Quản lý Đô thị xác minh nguồn gốc sử dụng đất.', priority: 'High', deadline: '2026-10-12', status: 'InProgress', createdAt: '2026-10-05 10:00' },
  { id: 'ds2', title: 'Xác minh hồ sơ hộ nghèo và bảo trợ xã hội', senderDepartmentId: 'd1', receiverDepartmentId: 'd4', content: 'Kiểm tra danh sách hộ nghèo bổ sung quý 4/2026 tại khu phố 2.', priority: 'Normal', deadline: '2026-10-15', status: 'Pending', createdAt: '2026-10-06 14:20' }
];

// ==================== API ROUTES ====================

// --- Dashboard Stats & General Info ---
let generalInfo = {
  totalArea: 75.67,
  satisfactionRate: 100,
  publicServicesCount: 400,
  totalCitizensCount: 35493
};

app.get('/api/general-info', (req, res) => res.json(generalInfo));
app.put('/api/general-info', (req, res) => {
  generalInfo = { ...generalInfo, ...req.body };
  res.json({ success: true, data: generalInfo });
});
app.get('/api/zalo/general-info', (req, res) => res.json(generalInfo));

app.get('/api/stats', (req, res) => {
  res.json({
    totalDepartments: departments.length,
    totalStaff: staffList.length,
    totalFields: fields.length,
    totalArticles: articles.length,
    totalCitizens: citizens.length,
    totalFeedbacks: feedbacks.length,
    pendingFeedbacks: feedbacks.filter(f => f.status === 'Pending' || f.status === 'Processing').length,
    activeQueues: queueItems.filter(q => q.status === 'Waiting' || q.status === 'Serving').length,
    totalDispatches: dispatches.length,
    ...generalInfo
  });
});

// --- Departments API ---
app.get('/api/departments', (req, res) => res.json(departments));
app.post('/api/departments', (req, res) => {
  const newDept: Department = { id: 'd_' + Date.now(), ...req.body };
  departments.push(newDept);
  res.status(201).json(newDept);
});
app.put('/api/departments/:id', (req, res) => {
  const { id } = req.params;
  departments = departments.map(d => d.id === id ? { ...d, ...req.body } : d);
  res.json(departments.find(d => d.id === id));
});
app.delete('/api/departments/:id', (req, res) => {
  departments = departments.filter(d => d.id !== req.params.id);
  res.json({ success: true });
});

// --- Fields API ---
app.get('/api/fields', (req, res) => res.json(fields));
app.post('/api/fields', (req, res) => {
  const item: Field = { id: 'f_' + Date.now(), ...req.body };
  fields.push(item);
  res.status(201).json(item);
});
app.put('/api/fields/:id', (req, res) => {
  fields = fields.map(f => f.id === req.params.id ? { ...f, ...req.body } : f);
  res.json(fields.find(f => f.id === req.params.id));
});
app.delete('/api/fields/:id', (req, res) => {
  fields = fields.filter(f => f.id !== req.params.id);
  res.json({ success: true });
});

// --- Staff API ---
app.get('/api/staff', (req, res) => res.json(staffList));
app.post('/api/staff', (req, res) => {
  const item: Staff = { id: 's_' + Date.now(), ...req.body };
  staffList.push(item);
  res.status(201).json(item);
});
app.put('/api/staff/:id', (req, res) => {
  staffList = staffList.map(s => s.id === req.params.id ? { ...s, ...req.body } : s);
  res.json(staffList.find(s => s.id === req.params.id));
});
app.delete('/api/staff/:id', (req, res) => {
  staffList = staffList.filter(s => s.id !== req.params.id);
  res.json({ success: true });
});

// --- Categories API ---
app.get('/api/categories', (req, res) => res.json(categories));
app.post('/api/categories', (req, res) => {
  const item: Category = { id: 'c_' + Date.now(), ...req.body };
  categories.push(item);
  res.status(201).json(item);
});

// --- Articles (CMS) API ---
app.get('/api/articles', (req, res) => res.json(articles));
app.post('/api/articles', (req, res) => {
  const item: Article = { id: 'a_' + Date.now(), publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), views: 0, ...req.body };
  articles.unshift(item);
  res.status(201).json(item);
});
app.put('/api/articles/:id', (req, res) => {
  articles = articles.map(a => a.id === req.params.id ? { ...a, ...req.body } : a);
  res.json(articles.find(a => a.id === req.params.id));
});
app.delete('/api/articles/:id', (req, res) => {
  articles = articles.filter(a => a.id !== req.params.id);
  res.json({ success: true });
});

// --- Citizens API ---
app.get('/api/citizens', (req, res) => res.json(citizens));
app.post('/api/citizens', (req, res) => {
  const item: Citizen = { id: 'cit_' + Date.now(), registeredDate: new Date().toISOString().substring(0, 10), totalFeedbacks: 0, status: 'Active', ...req.body };
  citizens.push(item);
  res.status(201).json(item);
});
app.put('/api/citizens/:id', (req, res) => {
  citizens = citizens.map(c => c.id === req.params.id ? { ...c, ...req.body } : c);
  res.json(citizens.find(c => c.id === req.params.id));
});
app.delete('/api/citizens/:id', (req, res) => {
  citizens = citizens.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// --- Feedbacks API ---
app.get('/api/feedbacks', (req, res) => res.json(feedbacks));
app.post('/api/feedbacks', (req, res) => {
  const item: Feedback = { id: 'fb_' + Date.now(), submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16), status: 'Pending', ...req.body };
  feedbacks.unshift(item);
  res.status(201).json(item);
});
app.put('/api/feedbacks/:id', (req, res) => {
  feedbacks = feedbacks.map(f => f.id === req.params.id ? { ...f, ...req.body } : f);
  res.json(feedbacks.find(f => f.id === req.params.id));
});

// --- Queue / Ticketing API ---
app.get('/api/queues', (req, res) => res.json(queueItems));
app.post('/api/queues', (req, res) => {
  const count = queueItems.length + 1;
  const prefix = req.body.serviceCode || 'A';
  const item: QueueItem = {
    id: 'q_' + Date.now(),
    queueNumber: `${prefix}-${100 + count}`,
    issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Waiting',
    estimatedMinutes: count * 5,
    ...req.body
  };
  queueItems.unshift(item);
  res.status(201).json(item);
});
app.put('/api/queues/:id', (req, res) => {
  queueItems = queueItems.map(q => q.id === req.params.id ? { ...q, ...req.body } : q);
  res.json(queueItems.find(q => q.id === req.params.id));
});
app.delete('/api/queues/:id', (req, res) => {
  queueItems = queueItems.filter(q => q.id !== req.params.id);
  res.json({ success: true });
});

// --- Dispatches API ---
app.get('/api/dispatches', (req, res) => res.json(dispatches));
app.post('/api/dispatches', (req, res) => {
  const item: DispatchItem = { id: 'ds_' + Date.now(), createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16), status: 'Pending', ...req.body };
  dispatches.unshift(item);
  res.status(201).json(item);
});
app.put('/api/dispatches/:id', (req, res) => {
  dispatches = dispatches.map(d => d.id === req.params.id ? { ...d, ...req.body } : d);
  res.json(dispatches.find(d => d.id === req.params.id));
});

// --- Zalo Mini App Public API Endpoints (Read-only for Zalo Client) ---
app.get('/api/zalo/articles', (req, res) => res.json(articles.filter(a => a.status === 'Published')));
app.get('/api/zalo/departments', (req, res) => res.json(departments));
app.get('/api/zalo/fields', (req, res) => res.json(fields));
app.post('/api/zalo/feedback', (req, res) => {
  const item: Feedback = {
    id: 'fb_' + Date.now(),
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Pending',
    approvalStatus: 'PendingApproval',
    privacy: req.body.privacy || 'Public',
    category: req.body.category || 'Đời sống nhân dân',
    ...req.body
  };
  feedbacks.unshift(item);
  res.status(201).json({ success: true, message: 'Gửi và lưu phản ánh kiến nghị thành công!', data: item });
});
app.post('/api/zalo/queue', (req, res) => {
  const count = queueItems.length + 1;
  const item: QueueItem = {
    id: 'q_' + Date.now(),
    queueNumber: `Z-${200 + count}`,
    issuedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Waiting',
    estimatedMinutes: count * 5,
    ...req.body
  };
  queueItems.unshift(item);
  res.status(201).json({ success: true, message: 'Lấy số thành công!', data: item });
});

app.post('/api/zalo/follow', (req, res) => {
  const { zaloId, name, phone, avatar, cccd, gender, religion, email, address, village, occupation, education, ethnicity, notes } = req.body;
  if (!zaloId) {
    return res.status(400).json({ success: false, error: 'Thiếu zaloId' });
  }

  let existing = citizens.find(c => c.zaloId === zaloId);
  if (existing) {
    Object.assign(existing, {
      name: name || existing.name,
      phone: phone || existing.phone,
      avatar: avatar || existing.avatar,
      cccd: cccd || existing.cccd,
      gender: gender || existing.gender,
      religion: religion || existing.religion,
      email: email || existing.email,
      address: address || existing.address,
      village: village || existing.village,
      occupation: occupation || existing.occupation,
      education: education || existing.education,
      ethnicity: ethnicity || existing.ethnicity,
      notes: notes || existing.notes,
      status: 'Active'
    });
    res.json({ success: true, message: 'Đã cập nhật thông tin công dân từ Zalo Mini App', data: existing });
  } else {
    const newCitizen: Citizen = {
      id: 'cit_' + Date.now(),
      name: name || 'Công dân Zalo',
      zaloId,
      phone: phone || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      registeredDate: new Date().toISOString().substring(0, 10),
      totalFeedbacks: 0,
      status: 'Active',
      cccd, gender, religion, email, address, village, occupation, education, ethnicity, notes
    };
    citizens.push(newCitizen);
    res.status(201).json({ success: true, message: 'Đã lưu thông tin công dân theo dõi Mini App vào portal thành công!', data: newCitizen });
  }
});

// --- Gemini AI Integration for Feedback Analysis & Routing ---
app.post('/api/ai/analyze-feedback', async (req, res) => {
  const { content } = req.body;
  if (!ai) {
    return res.json({
      summary: 'Phân tích tự động (Mock): Vấn đề thuộc thẩm quyền giải quyết của cơ quan hành chính.',
      suggestedField: 'f1',
      suggestedDepartment: 'd1',
      priority: 'Normal'
    });
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Phân tích phản ánh kiến nghị sau đây của người dân: "${content}". Hãy trả về JSON có cấu trúc:
      {
        "summary": "Tóm tắt ngắn gọn vấn đề",
        "suggestedField": "Mã lĩnh vực phù hợp (f1: Đất đai, f2: Hộ tịch, f3: Xây dựng, f4: Xã hội, f5: Y tế)",
        "suggestedDepartment": "Mã phòng ban phù hợp (d1: Một cửa, d2: QLDT, d3: Tư pháp, d4: LDTBXH)",
        "priority": "High hoặc Normal hoặc Low"
      }`,
      config: { responseMimeType: 'application/json' }
    });
    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Vite Middleware Integration ---
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' }
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Zalo Mini App Admin & API Server running on http://localhost:${PORT}`);
});
