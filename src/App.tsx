import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  FolderTree,
  UserCheck,
  MessageSquareWarning,
  Ticket,
  Send,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Code2,
  Smartphone,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Check,
  Copy,
  Layers,
  ShieldCheck,
  Activity,
  Globe,
  Upload
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'staff' | 'fields' | 'articles' | 'categories' | 'citizens' | 'feedbacks' | 'queues' | 'dispatches' | 'settings'>('overview');
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Data states
  const [departments, setDepartments] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [citizens, setCitizens] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [dispatches, setDispatches] = useState<any[]>([]);

  // Feedback filter states
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('Tất cả');
  const [feedbackTabFilter, setFeedbackTabFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [feedbackSearchQuery, setFeedbackSearchQuery] = useState('');

  // Dispatch coordination states
  const [dispatchCategory, setDispatchCategory] = useState('Đời sống nhân dân');
  const [dispatchCategorySearch, setDispatchCategorySearch] = useState('');
  const [approvalOpen, setApprovalOpen] = useState(true);
  const [processingOpen, setProcessingOpen] = useState(true);

  // General info settings state
  const [generalInfoForm, setGeneralInfoForm] = useState({
    totalArea: 75.67,
    satisfactionRate: 100,
    publicServicesCount: 400,
    totalCitizensCount: 35493
  });

  const fetchGeneralInfo = async () => {
    try {
      const res = await fetch('/api/general-info');
      const data = await res.json();
      setGeneralInfoForm(data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveGeneralInfo = async () => {
    try {
      const res = await fetch('/api/general-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generalInfoForm)
      });
      if (res.ok) {
        showToast('Lưu thông tin chung thành công!');
        fetchData();
        fetchGeneralInfo();
      } else {
        showToast('Có lỗi xảy ra khi lưu.');
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi kết nối máy chủ.');
    }
  };

  useEffect(() => {
    fetchGeneralInfo();
  }, []);

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gov_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('gov_user');
    return saved ? JSON.parse(saved) : {
      name: 'Quản trị viên (Admin)',
      email: 'admin@gov.vn',
      role: 'Quản trị hệ thống cấp cao',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      department: 'Văn phòng UBND Thành phố'
    };
  });
  const [loginEmail, setLoginEmail] = useState('admin@gov.vn');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('gov_auth', 'true');
      localStorage.setItem('gov_user', JSON.stringify(currentUser));
      showToast('Đăng nhập thành công!');
    } else {
      showToast('Vui lòng nhập đầy đủ thông tin.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gov_auth');
    showToast('Đã đăng xuất khỏi hệ thống.');
  };

  // Modals & Forms
  const [modalType, setModalType] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // API Tester state
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/zalo/articles');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiTesting, setApiTesting] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        resStats, resDept, resStaff, resField, resArt, resCat, resCit, resFb, resQ, resDsp
      ] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/departments').then(r => r.json()),
        fetch('/api/staff').then(r => r.json()),
        fetch('/api/fields').then(r => r.json()),
        fetch('/api/articles').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/citizens').then(r => r.json()),
        fetch('/api/feedbacks').then(r => r.json()),
        fetch('/api/queues').then(r => r.json()),
        fetch('/api/dispatches').then(r => r.json()),
      ]);

      setStats(resStats);
      setDepartments(resDept);
      setStaffList(resStaff);
      setFields(resField);
      setArticles(resArt);
      setCategories(resCat);
      setCitizens(resCit);
      setFeedbacks(resFb);
      setQueues(resQ);
      setDispatches(resDsp);
    } catch (err) {
      console.error(err);
      showToast('Lỗi tải dữ liệu từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (endpoint: string, method: string, id?: string) => {
    try {
      const url = id ? `/api/${endpoint}/${id}` : `/api/${endpoint}`;
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast('Lưu dữ liệu thành công!');
        setModalType(null);
        setFormData({});
        setEditItem(null);
        fetchData();
      } else {
        showToast('Có lỗi xảy ra khi lưu.');
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi kết nối máy chủ.');
    }
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục này?')) return;
    try {
      const res = await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Xóa thành công!');
        fetchData();
      } else {
        showToast('Không thể xóa mục này.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const runApiTest = async () => {
    setApiTesting(true);
    try {
      const res = await fetch(selectedEndpoint);
      const data = await res.json();
      setApiResponse(data);
    } catch (err: any) {
      setApiResponse({ error: err.message });
    } finally {
      setApiTesting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Zalo Mini App Admin Portal</h1>
            <p className="text-xs text-slate-400">Hệ thống quản lý dữ liệu hành chính công</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email đăng nhập</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Mật khẩu</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs transition shadow-lg shadow-blue-600/30 mt-2"
            >
              Đăng nhập hệ thống
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            <span>Tài khoản demo: admin@gov.vn / admin123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 select-none">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">Zalo Mini App</h1>
            <p className="text-xs text-blue-400 font-medium">Admin & API Portal</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
          {/* Tổng quan */}
          <div>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>
          </div>

          {/* Quản lý hệ thống */}
          <div>
            <div className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quản lý hệ thống
            </div>
            <div className="space-y-1">
              {[
                { id: 'departments', label: 'Phòng ban', icon: Building2 },
                { id: 'staff', label: 'Cán bộ', icon: Users },
                { id: 'fields', label: 'Lĩnh vực', icon: Briefcase },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quản trị CMS */}
          <div>
            <div className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quản trị CMS
            </div>
            <div className="space-y-1">
              {[
                { id: 'articles', label: 'Bài viết', icon: FileText },
                { id: 'categories', label: 'Danh mục', icon: FolderTree },
                { id: 'citizens', label: 'Công dân', icon: UserCheck },
                { id: 'feedbacks', label: 'Phản ánh - Kiến nghị', icon: MessageSquareWarning },
                { id: 'queues', label: 'Bốc số chờ', icon: Ticket },
                { id: 'dispatches', label: 'Điều phối', icon: Send },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cài đặt & API */}
          <div>
            <div className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hệ thống & API
            </div>
            <div>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Cài đặt & API Zalo</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Zalo Mini App v2.6</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-900">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white capitalize">
              {activeTab === 'overview' && 'Tổng quan hệ thống hành chính'}
              {activeTab === 'departments' && 'Quản lý phòng ban'}
              {activeTab === 'staff' && 'Quản lý cán bộ công chức'}
              {activeTab === 'fields' && 'Quản lý lĩnh vực hành chính'}
              {activeTab === 'articles' && 'Quản lý bài viết CMS'}
              {activeTab === 'categories' && 'Danh mục nội dung'}
              {activeTab === 'citizens' && 'Danh sách công dân Zalo'}
              {activeTab === 'feedbacks' && 'Phản ánh - Kiến nghị của công dân'}
              {activeTab === 'queues' && 'Hệ thống bốc số chờ trực tuyến'}
              {activeTab === 'dispatches' && 'Điều phối công việc & hồ sơ'}
              {activeTab === 'settings' && 'Cài đặt hệ thống & API Zalo Mini App'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
            <div className="relative pl-4 border-l border-slate-800">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 hover:opacity-80 transition text-left"
              >
                <img src={currentUser.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-blue-500/30" />
                <div className="text-xs">
                  <p className="font-semibold text-white">{currentUser.name}</p>
                  <p className="text-slate-400">{currentUser.email}</p>
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.role}</p>
                  </div>
                  <button
                    onClick={() => { setShowProfileDropdown(false); setShowAccountModal(true); }}
                    className="w-full text-left px-4 py-2.5 text-slate-300 hover:bg-slate-900 hover:text-white flex items-center gap-2 transition"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Quản lý tài khoản</span>
                  </button>
                  <button
                    onClick={() => { setShowProfileDropdown(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition border-t border-slate-800/80"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Đăng xuất hệ thống</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8 flex-1">
          {/* ==================== 1. TỔNG QUAN ==================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Phòng ban trực thuộc', val: stats.totalDepartments || 0, icon: Building2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { label: 'Cán bộ / Nhân sự', val: stats.totalStaff || 0, icon: Users, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
                  { label: 'Công dân Zalo', val: stats.totalCitizens || 0, icon: UserCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { label: 'Phản ánh cần xử lý', val: stats.pendingFeedbacks || 0, icon: MessageSquareWarning, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Số chờ trực tuyến', val: stats.activeQueues || 0, icon: Ticket, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                  { label: 'Bài viết CMS', val: stats.totalArticles || 0, icon: FileText, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
                  { label: 'Lĩnh vực hành chính', val: stats.totalFields || 0, icon: Briefcase, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  { label: 'Hồ sơ điều phối', val: stats.totalDispatches || 0, icon: Send, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-xs font-medium text-slate-400">{item.label}</p>
                        <p className="text-2xl font-bold text-white mt-1">{item.val}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity & Zalo Mini App Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-base">Phản ánh kiến nghị mới nhất từ Zalo</h3>
                    <button onClick={() => setActiveTab('feedbacks')} className="text-xs text-blue-400 hover:underline">Xem tất cả</button>
                  </div>
                  <div className="space-y-3">
                    {feedbacks.slice(0, 4).map((fb: any) => (
                      <div key={fb.id} className="p-4 bg-slate-900 border border-slate-800/80 rounded-xl flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{fb.title}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              fb.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              fb.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {fb.status === 'Resolved' ? 'Đã giải quyết' : fb.status === 'Processing' ? 'Đang xử lý' : 'Chờ tiếp nhận'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{fb.content}</p>
                          <p className="text-[11px] text-slate-500 mt-2">Gửi bởi: <span className="text-slate-300 font-medium">{fb.citizenName}</span> • {fb.submittedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base mb-2">Trạng thái Zalo Mini App API</h3>
                    <p className="text-xs text-slate-400 mb-6">Kết nối thông suốt giữa cổng thông tin hành chính và ứng dụng Zalo ZMP.</p>

                    <div className="space-y-4 text-sm">
                      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-300">Zalo OA Webhook</span>
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hoạt động
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-300">REST API Endpoints</span>
                        <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 12 Routes sẵn sàng
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-300">Gemini AI Assistant</span>
                        <span className="text-purple-400 font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Đã kết nối
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-xs transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <span>Xem tài liệu API & Test</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. PHÒNG BAN ==================== */}
          {activeTab === 'departments' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Danh sách Phòng ban</h3>
                  <p className="text-xs text-slate-400">Quản lý các cơ quan, đơn vị, phòng ban trực thuộc hệ thống hành chính</p>
                </div>
                <button
                  onClick={() => { setEditItem(null); setFormData({}); setModalType('department'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm phòng ban</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                    <tr>
                      <th className="p-4">Mã</th>
                      <th className="p-4">Tên phòng ban</th>
                      <th className="p-4">Lãnh đạo phụ trách</th>
                      <th className="p-4">Điện thoại</th>
                      <th className="p-4">Mô tả</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {departments.map((d: any) => (
                      <tr key={d.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 font-mono text-xs text-blue-400">{d.code}</td>
                        <td className="p-4 font-semibold text-white">{d.name}</td>
                        <td className="p-4">{d.leader}</td>
                        <td className="p-4 font-mono text-xs">{d.phone}</td>
                        <td className="p-4 text-slate-400 text-xs max-w-xs truncate">{d.description}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => { setEditItem(d); setFormData(d); setModalType('department'); }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete('departments', d.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 3. CÁN BỘ ==================== */}
          {activeTab === 'staff' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Quản lý Cán bộ công chức</h3>
                  <p className="text-xs text-slate-400">Danh sách nhân sự tiếp nhận và xử lý hồ sơ hành chính</p>
                </div>
                <button
                  onClick={() => { setEditItem(null); setFormData({}); setModalType('staff'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm cán bộ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {staffList.map((s: any) => {
                  const dept = departments.find(d => d.id === s.departmentId);
                  return (
                    <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                      <img src={s.avatar} alt={s.name} className="w-14 h-14 rounded-full object-cover border border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-base truncate">{s.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {s.status === 'Active' ? 'Đang làm việc' : 'Nghỉ phép'}
                          </span>
                        </div>
                        <p className="text-xs text-blue-400 font-medium mt-0.5">{s.title}</p>
                        <p className="text-xs text-slate-400 mt-1">Phòng: {dept?.name || '---'}</p>
                        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <span>{s.phone}</span>
                          <div className="space-x-1">
                            <button onClick={() => { setEditItem(s); setFormData(s); setModalType('staff'); }} className="p-1 hover:text-white"><Edit className="w-3.5 h-3.5 inline" /></button>
                            <button onClick={() => handleDelete('staff', s.id)} className="p-1 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5 inline" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== 4. LĨNH VỰC ==================== */}
          {activeTab === 'fields' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Lĩnh vực hành chính công</h3>
                  <p className="text-xs text-slate-400">Quản lý các lĩnh vực dịch vụ công trực tuyến phục vụ người dân trên Zalo</p>
                </div>
                <button
                  onClick={() => { setEditItem(null); setFormData({}); setModalType('field'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm lĩnh vực</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {fields.map((f: any) => (
                  <div key={f.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">{f.code}</span>
                        <div className="space-x-1">
                          <button onClick={() => { setEditItem(f); setFormData(f); setModalType('field'); }} className="p-1.5 text-slate-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('fields', f.id)} className="p-1.5 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <h4 className="font-bold text-white text-base mb-1">{f.name}</h4>
                      <p className="text-xs text-slate-400">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 5. BÀI VIẾT (CMS) ==================== */}
          {activeTab === 'articles' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Quản lý Bài viết & Tin tức CMS</h3>
                  <p className="text-xs text-slate-400">Tin tức, thông báo và hướng dẫn hiển thị trực tiếp trên Zalo Mini App</p>
                </div>
                <button
                  onClick={() => { setEditItem(null); setFormData({ status: 'Published' }); setModalType('article'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Viết bài mới</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                    <tr>
                      <th className="p-4">Tiêu đề</th>
                      <th className="p-4">Danh mục</th>
                      <th className="p-4">Tác giả</th>
                      <th className="p-4">Ngày đăng</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {articles.map((a: any) => {
                      const cat = categories.find(c => c.id === a.categoryId);
                      return (
                        <tr key={a.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-4 font-semibold text-white max-w-sm truncate">{a.title}</td>
                          <td className="p-4 text-xs"><span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg">{cat?.name || 'Chung'}</span></td>
                          <td className="p-4 text-xs">{a.author}</td>
                          <td className="p-4 text-xs font-mono">{a.publishedAt}</td>
                          <td className="p-4">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                              a.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {a.status === 'Published' ? 'Đã xuất bản' : 'Bản nháp'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => { setEditItem(a); setFormData(a); setModalType('article'); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('articles', a.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 6. DANH MỤC ==================== */}
          {activeTab === 'categories' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Danh mục nội dung CMS</h3>
                  <p className="text-xs text-slate-400">Quản lý phân loại bài viết, thông báo</p>
                </div>
                <button
                  onClick={() => { setEditItem(null); setFormData({}); setModalType('category'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm danh mục</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((c: any) => (
                  <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">{c.slug}</span>
                    <h4 className="font-bold text-white text-base mt-2">{c.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 7. CÔNG DÂN ==================== */}
          {activeTab === 'citizens' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Danh sách Công dân Zalo Mini App</h3>
                  <p className="text-xs text-slate-400">Quản lý hồ sơ công dân, thông tin cá nhân và định danh CCCD</p>
                </div>
                <button
                  onClick={() => { setEditItem(null); setFormData({}); setModalType('citizen'); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm công dân</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                    <tr>
                      <th className="p-4">Công dân</th>
                      <th className="p-4">Số CCCD / CMND</th>
                      <th className="p-4">Số điện thoại</th>
                      <th className="p-4">Thôn/Xóm</th>
                      <th className="p-4">Nghề nghiệp</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {citizens.map((cit: any) => (
                      <tr key={cit.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img src={cit.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                          <div>
                            <span className="font-semibold text-white block">{cit.name}</span>
                            <span className="text-[11px] text-slate-400">Zalo: {cit.zaloId || '---'}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-blue-400">{cit.cccd || 'Chưa cập nhật'}</td>
                        <td className="p-4 font-mono text-xs">{cit.phone || '---'}</td>
                        <td className="p-4 text-xs">{cit.village || '---'}</td>
                        <td className="p-4 text-xs">{cit.occupation || '---'}</td>
                        <td className="p-4">
                          <span className="text-[10px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium">Hoạt động</span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => { setEditItem(cit); setFormData(cit); setModalType('citizen'); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('citizens', cit.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 8. PHẢN ÁNH - KIẾN NGHỊ ==================== */}
          {activeTab === 'feedbacks' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Quản lý Phản ánh - Kiến nghị</h3>
                  <p className="text-xs text-slate-400">Quản lý phản ánh theo đúng quyền xử lý và quyền duyệt</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFeedbackTabFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${feedbackTabFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFeedbackTabFilter('pending')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${feedbackTabFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Chờ xử lý mới nhất
                  </button>
                  <button
                    onClick={() => setFeedbackTabFilter('approved')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${feedbackTabFilter === 'approved' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Đã duyệt mới nhất
                  </button>
                </div>
              </div>

              {/* Categories & Search Filter Bar */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0">
                  {[
                    'Tất cả',
                    'Thủ tục hành chính',
                    'Đất đai – xây dựng – hạ tầng',
                    'Nông nghiệp – tài nguyên – môi trường',
                    'Văn hóa – xã hội – y tế – giáo dục',
                    'Nội vụ – tư pháp – hành chính chung',
                    'Đời sống nhân dân'
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFeedbackCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                        feedbackCategoryFilter === cat ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={feedbackSearchQuery}
                    onChange={e => setFeedbackSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm danh mục, tiêu đề..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Feedbacks List */}
              <div className="space-y-4">
                {feedbacks
                  .filter((fb: any) => {
                    if (feedbackCategoryFilter !== 'Tất cả' && fb.category !== feedbackCategoryFilter) return false;
                    if (feedbackTabFilter === 'pending' && fb.status !== 'Pending' && fb.status !== 'Processing') return false;
                    if (feedbackTabFilter === 'approved' && fb.approvalStatus !== 'Approved') return false;
                    if (feedbackSearchQuery && !fb.title.toLowerCase().includes(feedbackSearchQuery.toLowerCase()) && !fb.category?.toLowerCase().includes(feedbackSearchQuery.toLowerCase())) return false;
                    return true;
                  })
                  .map((fb: any) => {
                    const staff = staffList.find(s => s.id === fb.assignedStaffId);
                    return (
                      <div key={fb.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-white text-base">{fb.title}</h4>
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                                fb.privacy === 'Public' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {fb.privacy === 'Public' ? 'Công khai' : 'Riêng tư'}
                              </span>
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                                fb.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {fb.approvalStatus === 'Approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                              </span>
                              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                                fb.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                fb.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {fb.status === 'Resolved' ? 'Đã giải quyết' : fb.status === 'Processing' ? 'Đang xử lý' : 'Chờ tiếp nhận'}
                              </span>
                              <span className="text-xs px-2.5 py-0.5 bg-slate-900 text-blue-400 rounded-lg border border-slate-800">{fb.category || 'Hành chính chung'}</span>
                            </div>
                            <p className="text-sm text-slate-300 mt-2">{fb.content}</p>
                            {fb.attachments && fb.attachments.length > 0 && (
                              <div className="mt-2 flex items-center gap-2 text-xs text-blue-400 font-medium">
                                <FileText className="w-4 h-4" />
                                <span>Đính kèm: {fb.attachments.join(', ')}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
                            <span className="text-xs text-slate-400 font-mono">Gửi ngày {fb.submittedAt}</span>
                            <span className="text-xs font-semibold text-slate-200">Người gửi: {fb.citizenName}</span>
                            <span className="text-xs font-mono text-slate-400">SĐT: {fb.citizenPhone || '---'}</span>
                          </div>
                        </div>

                        {/* Chi tiết phản hồi */}
                        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                            <span className="font-semibold text-blue-400">Chi tiết phản hồi</span>
                            <div className="flex items-center gap-4">
                              <span>Ngày tạo: <strong className="text-white">{fb.responseDate || 'Chưa cập nhật'}</strong></span>
                              <span>Người phản hồi: <strong className="text-white">{fb.responderName || staff?.name || 'Chưa phân công'}</strong></span>
                              <span>Người duyệt: <strong className="text-white">{fb.approvedBy || 'Chưa duyệt'}</strong></span>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-400 mb-1 font-medium">Nội dung phản hồi:</p>
                            <p className="text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">{fb.responseContent || 'Chưa có nội dung phản hồi từ cơ quan chức năng.'}</p>
                          </div>
                        </div>

                        {/* Rights Management Bar (Approval & Processing Rights) */}
                        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            {/* Approval Right */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400">Quyền duyệt:</span>
                              <button
                                onClick={async () => {
                                  const newApproval = fb.approvalStatus === 'Approved' ? 'PendingApproval' : 'Approved';
                                  await fetch(`/api/feedbacks/${fb.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ approvalStatus: newApproval, approvedBy: 'Quản trị viên (Admin)' })
                                  });
                                  fetchData();
                                  showToast('Đã cập nhật trạng thái duyệt!');
                                }}
                                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                                  fb.approvalStatus === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                                }`}
                              >
                                {fb.approvalStatus === 'Approved' ? 'Đã duyệt (Bỏ duyệt)' : 'Phê duyệt phản ánh'}
                              </button>
                            </div>

                            {/* Processing Right / Staff Assignment */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400">Cán bộ xử lý:</span>
                              <select
                                value={fb.assignedStaffId || ''}
                                onChange={async (e) => {
                                  await fetch(`/api/feedbacks/${fb.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ assignedStaffId: e.target.value, status: 'Processing' })
                                  });
                                  fetchData();
                                  showToast('Đã phân công cán bộ xử lý!');
                                }}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-medium"
                              >
                                <option value="">-- Chọn cán bộ --</option>
                                {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.title})</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                const resp = prompt('Nhập nội dung phản hồi chính thức:', fb.responseContent || '');
                                if (resp !== null) {
                                  await fetch(`/api/feedbacks/${fb.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      responseContent: resp,
                                      status: 'Resolved',
                                      responseDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
                                      responderName: 'Quản trị viên (Admin)'
                                    })
                                  });
                                  fetchData();
                                  showToast('Đã lưu và gửi phản hồi cho công dân!');
                                }
                              }}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition shadow-lg shadow-blue-600/20 flex items-center gap-1.5"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Nhập / Sửa phản hồi</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ==================== 9. BỐC SỐ CHỜ ==================== */}
          {activeTab === 'queues' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">Hệ thống Bốc số chờ trực tuyến (Virtual Queue)</h3>
                  <p className="text-xs text-slate-400">Quản lý số thứ tự xếp hàng tại bộ phận Một cửa</p>
                </div>
                <button
                  onClick={async () => {
                    const name = prompt('Nhập tên công dân lấy số:');
                    if (!name) return;
                    const phone = prompt('Nhập số điện thoại:') || '0900000000';
                    const serviceName = prompt('Nhập tên dịch vụ/thủ tục:') || 'Đăng ký Hộ tịch';
                    await fetch('/api/queues', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ citizenName: name, citizenPhone: phone, serviceName, serviceCode: 'A' })
                    });
                    fetchData();
                    showToast('Đã cấp số thứ tự thành công!');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cấp số mới</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase">
                    <tr>
                      <th className="p-4">Số thứ tự</th>
                      <th className="p-4">Dịch vụ</th>
                      <th className="p-4">Công dân</th>
                      <th className="p-4">Thời gian lấy</th>
                      <th className="p-4">Quầy phục vụ</th>
                      <th className="p-4">Trạng thái</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {queues.map((q: any) => (
                      <tr key={q.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-4 font-mono font-bold text-lg text-blue-400">{q.queueNumber}</td>
                        <td className="p-4 font-medium text-white">{q.serviceName}</td>
                        <td className="p-4">{q.citizenName} <span className="text-xs text-slate-500 font-mono">({q.citizenPhone})</span></td>
                        <td className="p-4 text-xs font-mono">{q.issuedAt}</td>
                        <td className="p-4 text-xs font-semibold">{q.counterNumber || 'Chưa phân'}</td>
                        <td className="p-4">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                            q.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            q.status === 'Serving' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {q.status === 'Completed' ? 'Đã hoàn thành' : q.status === 'Serving' ? 'Đang gọi phục vụ' : 'Đang chờ'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {q.status === 'Waiting' && (
                            <button
                              onClick={async () => {
                                await fetch(`/api/queues/${q.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: 'Serving', counterNumber: 'Quầy 01' })
                                });
                                fetchData();
                                showToast(`Đang gọi số ${q.queueNumber}`);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
                            >
                              Gọi số
                            </button>
                          )}
                          {q.status === 'Serving' && (
                            <button
                              onClick={async () => {
                                await fetch(`/api/queues/${q.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: 'Completed' })
                                });
                                fetchData();
                                showToast(`Hoàn thành số ${q.queueNumber}`);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
                            >
                              Hoàn thành
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 10. ĐIỀU PHỐI (PHẢN ÁNH - KIẾN NGHỊ) ==================== */}
          {activeTab === 'dispatches' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Điều phối (Phản ánh - Kiến nghị)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Chọn một điều phối chuyên trách để xem và điều phối cán bộ xử lý tương ứng.</p>
              </div>

              {/* Danh mục phản ánh kiến nghị */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
                <h4 className="font-bold text-white text-sm">Danh mục phản ánh kiến nghị</h4>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={dispatchCategorySearch}
                    onChange={e => setDispatchCategorySearch(e.target.value)}
                    placeholder="Tìm kiếm danh mục..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Thủ tục hành chính',
                    'Đất đai – xây dựng – hạ tầng',
                    'Nông nghiệp – tài nguyên – môi trường',
                    'Văn hóa – xã hội – y tế – giáo dục',
                    'Nội vụ – tư pháp – hành chính chung',
                    'Đời sống nhân dân'
                  ]
                    .filter(c => c.toLowerCase().includes(dispatchCategorySearch.toLowerCase()))
                    .map(cat => (
                      <button
                        key={cat}
                        onClick={() => setDispatchCategory(cat)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                          dispatchCategory === cat
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                </div>
              </div>

              {/* Danh sách cán bộ điều phối */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">Danh sách cán bộ điều phối cho mục: <span className="text-blue-400">{dispatchCategory}</span></h4>
                  <button
                    onClick={() => { setEditItem(null); setFormData({ coordinationCategory: dispatchCategory, coordinationRole: 'Approval' }); setModalType('staff'); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm cán bộ</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">Mỗi nhóm có thể mở ra để xem cán bộ được gán, kèm số điện thoại, chức vụ và thao tác phê duyệt nhanh.</p>

                {/* Group 1: Quyền phê duyệt */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setApprovalOpen(!approvalOpen)}
                    className="w-full p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-left font-bold text-white text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Quyền phê duyệt</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {staffList.filter(s => s.coordinationRole === 'Approval').length}
                      </span>
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${approvalOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {approvalOpen && (
                    <div className="divide-y divide-slate-800 text-sm">
                      {staffList
                        .filter(s => s.coordinationRole === 'Approval')
                        .map(s => (
                          <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition">
                            <div className="flex items-center gap-3">
                              <img src={s.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                              <div>
                                <h5 className="font-bold text-white text-sm">{s.name}</h5>
                                <p className="text-xs text-blue-400 font-mono mt-0.5">{s.phone}</p>
                                <p className="text-xs text-slate-400">{s.title}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setEditItem(s); setFormData(s); setModalType('staff'); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium">Sửa</button>
                              <button onClick={() => handleDelete('staff', s.id)} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium">Xoá</button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Group 2: Quyền xử lý */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setProcessingOpen(!processingOpen)}
                    className="w-full p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-left font-bold text-white text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span>Quyền xử lý</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {staffList.filter(s => s.coordinationRole === 'Processing').length}
                      </span>
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${processingOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {processingOpen && (
                    <div className="divide-y divide-slate-800 text-sm">
                      {staffList
                        .filter(s => s.coordinationRole === 'Processing' || !s.coordinationRole)
                        .map(s => (
                          <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40 transition">
                            <div className="flex items-center gap-3">
                              <img src={s.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                              <div>
                                <h5 className="font-bold text-white text-sm">{s.name}</h5>
                                <p className="text-xs text-blue-400 font-mono mt-0.5">{s.phone}</p>
                                <p className="text-xs text-slate-400">{s.title}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setEditItem(s); setFormData(s); setModalType('staff'); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium">Sửa</button>
                              <button onClick={() => handleDelete('staff', s.id)} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-medium">Xoá</button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 11. CÀI ĐẶT & API ZALO ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Thông tin chung */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Thông tin chung</h3>
                  <p className="text-xs text-slate-400">Cập nhật các số liệu tổng quan hiển thị trên trang Tổng quan và API cho Zalo Mini App.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tổng diện tích (ha) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={generalInfoForm.totalArea ?? 75.67}
                      onChange={e => setGeneralInfoForm({...generalInfoForm, totalArea: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Chỉ số hài lòng (%) *</label>
                    <input
                      type="number"
                      value={generalInfoForm.satisfactionRate ?? 100}
                      onChange={e => setGeneralInfoForm({...generalInfoForm, satisfactionRate: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Dịch vụ công *</label>
                    <input
                      type="number"
                      value={generalInfoForm.publicServicesCount ?? 400}
                      onChange={e => setGeneralInfoForm({...generalInfoForm, publicServicesCount: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Tổng công dân *</label>
                    <input
                      type="number"
                      value={generalInfoForm.totalCitizensCount ?? 35493}
                      onChange={e => setGeneralInfoForm({...generalInfoForm, totalCitizensCount: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={saveGeneralInfo}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Cấu hình Zalo Mini App & Webhook</h3>
                  <p className="text-xs text-slate-400">Thông tin kết nối OAuth và Zalo ZMP SDK cho ứng dụng hành chính công</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Zalo OA App ID</label>
                    <input type="text" readOnly value="19827364501928" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 font-mono text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Zalo Mini App Secret Key</label>
                    <input type="password" readOnly value="************************" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 font-mono text-xs" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Webhook Endpoint URL (Dùng cho Zalo OA sự kiện)</label>
                    <div className="flex gap-2">
                      <input type="text" readOnly value={`${window.location.origin}/api/webhook/zalo`} className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-blue-400 font-mono text-xs" />
                      <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/api/webhook/zalo`); showToast('Đã sao chép Webhook URL!'); }} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5">
                        <Copy className="w-3.5 h-3.5" /> Sao chép
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Tester for Zalo Mini App */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Trình kiểm thử REST API cho Zalo Mini App</h3>
                  </div>
                  <p className="text-xs text-slate-400">Kiểm tra trực tiếp các endpoint REST API mà Zalo Mini App gọi để lấy dữ liệu</p>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <select
                    value={selectedEndpoint}
                    onChange={(e) => setSelectedEndpoint(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono text-xs"
                  >
                    <option value="/api/zalo/articles">GET /api/zalo/articles (Danh sách bài viết cho Zalo)</option>
                    <option value="/api/zalo/follow">POST /api/zalo/follow (Lưu thông tin khi công dân theo dõi Mini App)</option>
                    <option value="/api/zalo/feedback">POST /api/zalo/feedback (Gửi và lưu phản ánh kiến nghị từ Zalo Mini App)</option>
                    <option value="/api/zalo/general-info">GET /api/zalo/general-info (Lấy thông tin chung cho Zalo Mini App)</option>
                    <option value="/api/zalo/departments">GET /api/zalo/departments (Danh sách phòng ban)</option>
                    <option value="/api/zalo/fields">GET /api/zalo/fields (Danh sách lĩnh vực thủ tục)</option>
                    <option value="/api/stats">GET /api/stats (Thống kê tổng quan hành chính)</option>
                    <option value="/api/feedbacks">GET /api/feedbacks (Danh sách phản ánh kiến nghị)</option>
                    <option value="/api/queues">GET /api/queues (Danh sách bốc số chờ)</option>
                  </select>
                  <button
                    onClick={runApiTest}
                    disabled={apiTesting}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${apiTesting ? 'animate-spin' : ''}`} />
                    <span>Gửi Request Test</span>
                  </button>
                </div>

                {apiResponse && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">Response JSON:</span>
                      <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2)); showToast('Đã sao chép JSON!'); }} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Sao chép JSON
                      </button>
                    </div>
                    <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
                      {JSON.stringify(apiResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ==================== MODALS ==================== */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {modalType === 'department' && (editItem ? 'Cập nhật Phòng ban' : 'Thêm Phòng ban mới')}
                {modalType === 'staff' && (editItem ? 'Cập nhật Cán bộ' : 'Thêm Cán bộ mới')}
                {modalType === 'field' && (editItem ? 'Cập nhật Lĩnh vực' : 'Thêm Lĩnh vực mới')}
                {modalType === 'article' && (editItem ? 'Chỉnh sửa Bài viết CMS' : 'Viết bài viết mới')}
                {modalType === 'category' && 'Thêm danh mục CMS'}
                {modalType === 'citizen' && 'Thêm công dân'}
                {modalType === 'dispatch' && 'Tạo phiếu điều phối công việc'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-sm max-h-[65vh] overflow-y-auto pr-1">
              {modalType === 'department' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Mã phòng ban</label>
                    <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="VD: QLDT" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Tên phòng ban</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Phòng Quản lý Đô thị" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Lãnh đạo phụ trách</label>
                    <input type="text" value={formData.leader || ''} onChange={e => setFormData({...formData, leader: e.target.value})} placeholder="Họ tên trưởng phòng" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Số điện thoại</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="0283..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Mô tả chức năng</label>
                    <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                </>
              )}

              {modalType === 'staff' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Họ và tên</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phòng ban</label>
                    <select value={formData.departmentId || ''} onChange={e => setFormData({...formData, departmentId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white">
                      <option value="">-- Chọn phòng ban --</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Chức vụ</label>
                    <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="VD: Chuyên viên chính" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Số điện thoại</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Link ảnh Avatar URL</label>
                    <input type="text" value={formData.avatar || ''} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                </>
              )}

              {modalType === 'field' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Mã lĩnh vực</label>
                    <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="VD: LAND" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Tên lĩnh vực</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Thủ tục Đất đai" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Mô tả chi tiết</label>
                    <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                </>
              )}

              {modalType === 'article' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Ảnh bìa bản tin *</label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({...formData, thumbnail: event.target?.result as string});
                            showToast('Đã tải ảnh lên thành công!');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 transition flex flex-col items-center justify-center gap-2 relative group"
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setFormData({...formData, thumbnail: event.target?.result as string});
                              showToast('Đã tải ảnh lên thành công!');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {formData.thumbnail ? (
                        <div className="flex items-center gap-4">
                          <img src={formData.thumbnail} alt="Preview" className="w-20 h-14 rounded-xl object-cover border border-slate-700 shadow-md" />
                          <div className="text-left">
                            <p className="text-xs text-blue-400 font-semibold">Đã tải ảnh thành công</p>
                            <p className="text-[11px] text-slate-400">Nhấn hoặc kéo thả tệp khác để thay đổi (.JPG, .PNG)</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-200 font-semibold">Kéo thả tệp vào đây, hoặc chọn tệp</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Chọn 1 ảnh bìa cho bản tin (định dạng JPG, PNG).</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Tiêu đề *</label>
                    <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Tiêu đề thông báo..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Danh mục *</label>
                    <select value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white">
                      <option value="">Chọn...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 py-1">
                    <input
                      type="checkbox"
                      id="isFeaturedCheck"
                      checked={formData.isFeatured || false}
                      onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                    />
                    <label htmlFor="isFeaturedCheck" className="text-xs font-medium text-white cursor-pointer">
                      Đánh dấu sự kiện nổi bật
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Mô tả ngắn *</label>
                    <textarea rows={3} value={formData.summary || ''} onChange={e => setFormData({...formData, summary: e.target.value})} placeholder="Mô tả ngắn hiển thị ở danh sách..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Đường dẫn bài viết *</label>
                    <input type="text" value={formData.articleUrl || ''} onChange={e => setFormData({...formData, articleUrl: e.target.value})} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                    <p className="text-[11px] text-slate-500 mt-1">Nhập đường dẫn bài viết hoặc liên kết chi tiết.</p>
                  </div>
                </>
              )}

              {modalType === 'citizen' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Ảnh đại diện (URL hoặc chọn tệp)</label>
                    <div className="flex gap-2 items-center">
                      <input type="text" value={formData.avatar || ''} onChange={e => setFormData({...formData, avatar: e.target.value})} placeholder="https://..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-xs" />
                      {formData.avatar && <img src={formData.avatar} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-slate-700" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Khuyến nghị ảnh vuông hoặc gần vuông (.JPG, .PNG).</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Họ và tên *</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ngô Thị Minh Thảo" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Số CCCD / CMND</label>
                    <input type="text" value={formData.cccd || ''} onChange={e => setFormData({...formData, cccd: e.target.value})} placeholder="Nhập số CCCD/CMND" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Số điện thoại</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="084934859891" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Giới tính</label>
                    <select value={formData.gender || 'Nam'} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Tôn giáo</label>
                    <input type="text" value={formData.religion || ''} onChange={e => setFormData({...formData, religion: e.target.value})} placeholder="Nhập tôn giáo" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                    <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Nhập email nếu có" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Địa chỉ</label>
                    <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Nhập địa chỉ" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Thôn/Xóm</label>
                    <input type="text" value={formData.village || ''} onChange={e => setFormData({...formData, village: e.target.value})} placeholder="Phú Mỹ" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Nghề nghiệp</label>
                    <input type="text" value={formData.occupation || ''} onChange={e => setFormData({...formData, occupation: e.target.value})} placeholder="Nhập nghề nghiệp" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Trình độ học vấn</label>
                    <input type="text" value={formData.education || ''} onChange={e => setFormData({...formData, education: e.target.value})} placeholder="Nhập trình độ học vấn" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Dân tộc</label>
                    <input type="text" value={formData.ethnicity || ''} onChange={e => setFormData({...formData, ethnicity: e.target.value})} placeholder="Nhập dân tộc" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Ghi chú</label>
                    <textarea rows={2} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Nhập ghi chú nếu có" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                </>
              )}

              {modalType === 'dispatch' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Tiêu đề điều phối</label>
                    <input type="text" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phòng gửi</label>
                    <select value={formData.senderDepartmentId || ''} onChange={e => setFormData({...formData, senderDepartmentId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white">
                      <option value="">-- Chọn phòng gửi --</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Phòng nhận</label>
                    <select value={formData.receiverDepartmentId || ''} onChange={e => setFormData({...formData, receiverDepartmentId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white">
                      <option value="">-- Chọn phòng nhận --</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Nội dung công việc</label>
                    <textarea rows={3} value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Độ ưu tiên</label>
                    <select value={formData.priority || 'Normal'} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white">
                      <option value="Normal">Bình thường</option>
                      <option value="High">Khẩn cấp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Hạn xử lý (Deadline)</label>
                    <input type="date" value={formData.deadline || ''} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition">
                Hủy
              </button>
              <button
                onClick={() => {
                  if (modalType === 'department') handleSave('departments', editItem ? 'PUT' : 'POST', editItem?.id);
                  if (modalType === 'staff') handleSave('staff', editItem ? 'PUT' : 'POST', editItem?.id);
                  if (modalType === 'field') handleSave('fields', editItem ? 'PUT' : 'POST', editItem?.id);
                  if (modalType === 'article') handleSave('articles', editItem ? 'PUT' : 'POST', editItem?.id);
                  if (modalType === 'category') handleSave('categories', 'POST');
                  if (modalType === 'dispatch') handleSave('dispatches', 'POST');
                  if (modalType === 'citizen') handleSave('citizens', editItem ? 'PUT' : 'POST', editItem?.id);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
              >
                Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Management Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Quản lý tài khoản quản trị</h3>
              <button onClick={() => setShowAccountModal(false)} className="p-1 text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Ảnh đại diện (URL)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={currentUser.avatar}
                    onChange={e => setCurrentUser({...currentUser, avatar: e.target.value})}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs"
                  />
                  <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={currentUser.email}
                  onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Chức vụ</label>
                <input
                  type="text"
                  value={currentUser.role}
                  onChange={e => setCurrentUser({...currentUser, role: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Đơn vị / Phòng ban</label>
                <input
                  type="text"
                  value={currentUser.department}
                  onChange={e => setCurrentUser({...currentUser, department: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button onClick={() => setShowAccountModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition">
                Hủy
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('gov_user', JSON.stringify(currentUser));
                  setShowAccountModal(false);
                  showToast('Cập nhật thông tin tài khoản thành công!');
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/20"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
