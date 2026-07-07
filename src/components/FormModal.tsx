"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { getStorageItem, parseStorageJson, setStorageItem } from "@/lib/browserStorage";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
  detectedProvince?: string;
}

interface Step1Data {
  companyName: string;
  contactName: string;
  phone: string;
  code: string;
  email: string;
  province: string;
  platformName: string;
}

interface Step2Data {
  businessLicense: string | null;
  bankPermit: string | null;
  idCardFront: string | null;
  idCardBack: string | null;
}

type MemberRecord = Record<string, {
  companyName?: string;
  contactName?: string;
  phone?: string;
  code?: string;
  email?: string;
  province?: string;
  platformName?: string;
  businessLicense?: string | null;
  bankPermit?: string | null;
  idCardFront?: string | null;
  idCardBack?: string | null;
  selectedServices?: string[];
  step?: number;
  updatedAt?: string;
  invoice?: {
    title?: string;
    taxId?: string;
    email?: string;
  } | null;
}>;

const provinces = [
  "北京", "天津", "上海", "重庆", "河北", "山西", "辽宁", "吉林", "黑龙江",
  "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南",
  "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾",
  "内蒙古", "广西", "西藏", "宁夏", "新疆", "香港", "澳门"
];

const services = [
  { id: "platform", name: "政采平台入驻", price: 1000 },
  { id: "ca", name: "CA锁申请", price: 2000 },
  { id: "shop", name: "开通政采店铺及产品上架", price: 3800 },
  { id: "operate", name: "店铺托管运营", price: 8800 }
];

const customerRegions = [
  "北京", "天津", "上海", "重庆", "河北", "河南", "山东", "山西", "陕西", "浙江",
  "江苏", "安徽", "福建", "广东", "广西", "四川", "云南", "贵州", "湖北", "湖南",
  "辽宁", "吉林", "黑龙江", "江西", "海南", "甘肃", "青海", "宁夏", "新疆", "内蒙古"
];

const customerSurnames = [
  "张", "王", "李", "赵", "刘", "陈", "杨", "黄", "周", "吴",
  "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗"
];

type PaidCustomer = {
  region: string;
  name: string;
  phone: string;
  minutes: number;
};

const createPaidCustomers = (): PaidCustomer[] => {
  return Array.from({ length: 50 }, (_, index) => {
    const region = customerRegions[index % customerRegions.length];
    const surname = customerSurnames[(index * 7) % customerSurnames.length];
    const role = index % 3 === 0 ? "经理" : index % 3 === 1 ? "先生" : "女士";
    const prefix = ["139", "138", "137", "136", "135", "188", "189", "177", "170", "150"][index % 10];
    const middle = String((6400 + index * 173) % 10000).padStart(4, "0");
    const minutes = ((index * 7 + 11) % 59) + 1;

    return {
      region,
      name: `${surname}${role}`,
      phone: `${prefix}****${middle}`,
      minutes,
    };
  }).sort((a, b) => a.minutes - b.minutes);
};

export default function FormModal({ isOpen, onClose, initialPhone = "", detectedProvince = "北京" }: FormModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // 生成固定的订单编号（只在组件挂载时生成一次）
  const [orderNumber] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${now.getTime().toString().slice(-7)}`;
  });
  
  const [orderTime] = useState(() => {
    return new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  });
  
  // Step 1 States
  const [step1, setStep1] = useState<Step1Data>({
    companyName: "",
    contactName: "",
    phone: "",
    code: "",
    email: "",
    province: detectedProvince,
    platformName: "",
  });

  // SMS Verification mock state
  const [smsTimer, setSmsTimer] = useState(0);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [mockSmsCode, setMockSmsCode] = useState("");

  // Step 2 States (Mock File names/previews)
  const [step2, setStep2] = useState<Step2Data>({
    businessLicense: null,
    bankPermit: null,
    idCardFront: null,
    idCardBack: null,
  });

  // Step 3 States
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const paidCustomers = useMemo(() => createPaidCustomers(), []);
  
  // Invoice Request States
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [taxId, setTaxId] = useState("");
  const [invoiceEmail, setInvoiceEmail] = useState("");
  const [invoiceSubmitted, setInvoiceSubmitted] = useState(false);

  const [phone400, setPhone400] = useState("400-999-8839");
  const [copyNotice, setCopyNotice] = useState("");
  const businessLicenseInputRef = useRef<HTMLInputElement>(null);
  const bankPermitInputRef = useRef<HTMLInputElement>(null);
  const idCardFrontInputRef = useRef<HTMLInputElement>(null);
  const idCardBackInputRef = useRef<HTMLInputElement>(null);

  // Load custom 400 phone
  useEffect(() => {
    const savedPhone = getStorageItem("zcy_400_phone");
    if (savedPhone) {
      setPhone400(savedPhone);
    }
  }, []);

  // Pre-fill initialPhone if provided
  useEffect(() => {
    if (initialPhone) {
      setStep1(prev => ({ ...prev, phone: initialPhone }));
      // Attempt to load existing user progress
      const savedMembers = getStorageItem("zcy_members");
      if (savedMembers) {
        const members = parseStorageJson<MemberRecord>(savedMembers, {});
        const member = members[initialPhone];
        if (member) {
          setStep1({
            companyName: member.companyName || "",
            contactName: member.contactName || "",
            phone: initialPhone,
            code: "1234", // mock code bypass
            email: member.email || "",
            province: member.province || detectedProvince,
            platformName: member.platformName || "",
          });
          setStep2({
            businessLicense: member.businessLicense || null,
            bankPermit: member.bankPermit || null,
            idCardFront: member.idCardFront || null,
            idCardBack: member.idCardBack || null,
          });
          setSelectedServices(member.selectedServices || []);
          setCurrentStep(member.step || 1);
          if (member.invoice) {
            setInvoiceTitle(member.invoice.title || "");
            setTaxId(member.invoice.taxId || "");
            setInvoiceEmail(member.invoice.email || "");
            setInvoiceSubmitted(true);
          } else {
            setInvoiceTitle("");
            setTaxId("");
            setInvoiceEmail("");
            setInvoiceSubmitted(false);
          }
        }
      }
    }
  }, [initialPhone, detectedProvince]);

  // Handle detectedProvince change
  useEffect(() => {
    if (detectedProvince) {
      setStep1(prev => {
        if (!prev.province || prev.province === "北京") {
          return { ...prev, province: detectedProvince };
        }
        return prev;
      });
    }
  }, [detectedProvince]);

  // SMS Timer countdown
  useEffect(() => {
    if (smsTimer > 0) {
      const timer = setTimeout(() => setSmsTimer(smsTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [smsTimer]);

  if (!isOpen) return null;

  // SMS trigger handler
  const sendSmsCode = () => {
    if (!/^1[3-9]\d{9}$/.test(step1.phone)) {
      alert("请输入正确的11位手机号码");
      return;
    }
    setIsSendingSms(true);
    setSmsTimer(60);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSendingSms(false);
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setMockSmsCode(code);
      alert(`【政采通】您的验证码是：${code}，请在页面中输入进行验证。`);
    }, 800);
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    if (!navigator.clipboard?.writeText) {
      setCopyNotice(`已成功复制${label}`);
      setTimeout(() => setCopyNotice(""), 2000);
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopyNotice(`已成功复制${label}`);
      setTimeout(() => setCopyNotice(""), 2000);
    }).catch(() => {
      setCopyNotice(`已成功复制${label}`);
      setTimeout(() => setCopyNotice(""), 2000);
    });
  };

  // Save Progress in localStorage
  const saveProgress = (nextStep: number) => {
    const savedMembers = getStorageItem("zcy_members");
    const members = parseStorageJson<MemberRecord>(savedMembers, {});
    
    members[step1.phone] = {
      ...step1,
      ...step2,
      selectedServices,
      step: nextStep,
      updatedAt: new Date().toISOString(),
      invoice: invoiceTitle ? {
        title: invoiceTitle,
        taxId,
        email: invoiceEmail,
      } : (members[step1.phone]?.invoice || null)
    };
    
    setStorageItem("zcy_members", JSON.stringify(members));
    setStorageItem("zcy_active_user", step1.phone);
  };

  // Step 1 Submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1.companyName.trim()) return alert("请输入企业名称");
    if (!step1.contactName.trim()) return alert("请输入联系人姓名");
    if (!/^1[3-9]\d{9}$/.test(step1.phone)) return alert("请输入11位手机号码");
    if (step1.code !== mockSmsCode && step1.code !== "1234") return alert("验证码不正确");
    
    // Auto-membership creation and progress saving
    saveProgress(2);
    setCurrentStep(2);
  };

  // Step 2 Upload Real File Handlers with Image Compression
  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 按比例缩放
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // 转换为压缩的 Base64
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (field: keyof Step2Data, file: File | null) => {
    if (!file) {
      setStep2(prev => ({ ...prev, [field]: null }));
      return;
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 JPG、PNG 或 PDF 格式的文件');
      return;
    }

    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB');
      return;
    }

    try {
      let base64String: string;
      
      // 如果是图片，进行压缩
      if (file.type.startsWith('image/')) {
        base64String = await compressImage(file, 800, 0.7);
      } else {
        // PDF 直接转 Base64
        const reader = new FileReader();
        base64String = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setStep2(prev => {
        const updated = { ...prev, [field]: base64String };
        return updated;
      });
    } catch (error) {
      console.error('文件处理失败:', error);
      alert('文件读取失败，请重试');
    }
  };

  const getFileInputRef = (field: keyof Step2Data) => {
    if (field === "businessLicense") return businessLicenseInputRef;
    if (field === "bankPermit") return bankPermitInputRef;
    if (field === "idCardFront") return idCardFrontInputRef;
    return idCardBackInputRef;
  };

  const triggerFileInput = (field: keyof Step2Data) => {
    const input = getFileInputRef(field).current;
    if (input) {
      input.value = "";
      input.click();
    }
  };

  const handleFileInputChange = (field: keyof Step2Data, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      handleFileUpload(field, file);
    }
  };

  const handleStep2Submit = () => {
    if (!step2.businessLicense) return alert("请上传营业执照");
    if (!step2.bankPermit) return alert("请上传开户许可证或银行基本户信息");
    if (!step2.idCardFront || !step2.idCardBack) return alert("请上传法人身份证正反面复印件");

    saveProgress(3);
    setCurrentStep(3);
  };

  // Step 3 Service Checkbox Toggles
  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const calculatedTotal = selectedServices.reduce((sum, id) => {
    const s = services.find(item => item.id === id);
    return sum + (s ? s.price : 0);
  }, 0);

  const handleStep3Submit = () => {
    if (selectedServices.length === 0) {
      alert("请至少选择一项需要办理的业务");
      return;
    }
    
    // Move to step 4 (Success / Finalize)
    saveProgress(4);
    setCurrentStep(4);
  };

  // Invoice Submit Handler
  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceTitle.trim()) return alert("请输入发票抬头");
    if (!taxId.trim()) return alert("请输入企业税号");
    if (!invoiceEmail.trim()) return alert("请输入接收邮箱");
    
    // Save invoice data
    const savedMembers = getStorageItem("zcy_members");
    const members = parseStorageJson<MemberRecord>(savedMembers, {});
    if (members[step1.phone]) {
      members[step1.phone].invoice = {
        title: invoiceTitle,
        taxId,
        email: invoiceEmail,
      };
      setStorageItem("zcy_members", JSON.stringify(members));
    }
    
    setInvoiceSubmitted(true);
    setTimeout(() => {
      setShowInvoiceForm(false);
      alert("您的发票申请已提交成功，电子发票将在3个工作日内发送到您的邮箱。");
    }, 500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* Trapezoid Title Header */}
        <div className="modal-header-trapezoid">
          政府采购电子平台入驻报名服务
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Welcome and Instructions Prompt */}
        <div className="px-8 pt-6 pb-2 text-center">
          <p className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg leading-relaxed">
            促进中小企业健康发展，响应政府采购制度深化改革，优化政府采购流程，突出政府采购公正、公平、公开、透明，
            助力中小企业参与政采业务合规提效，现协助全国广大优质供应商企业入驻政采平台，开通线上政采电子卖场，开办网上超市等相关操作。
          </p>
        </div>

        {/* Form Progress Bar */}
        <div className="step-indicator">
          {/* Step 1 Node */}
          <div className="step-node">
            <div className={`step-circle ${currentStep >= 1 ? (currentStep > 1 ? "completed" : "active") : "inactive"}`}>
              {currentStep > 1 ? "✓" : "1"}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-700">申报登记</span>
          </div>

          <div className={`step-line ${currentStep > 1 ? "completed" : "inactive"}`}></div>

          {/* Step 2 Node */}
          <div className="step-node">
            <div className={`step-circle ${currentStep >= 2 ? (currentStep > 2 ? "completed" : "active") : "inactive"}`}>
              {currentStep > 2 ? "✓" : "2"}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-700">资料提交</span>
          </div>

          <div className={`step-line ${currentStep > 2 ? "completed" : "inactive"}`}></div>

          {/* Step 3 Node */}
          <div className="step-node">
            <div className={`step-circle ${currentStep >= 3 ? (currentStep > 3 ? "completed" : "active") : "inactive"}`}>
              {currentStep > 3 ? "✓" : "3"}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-700">业务办理</span>
          </div>

          <div className={`step-line ${currentStep > 3 ? "completed" : "inactive"}`}></div>

          {/* Step 4 Node */}
          <div className="step-node">
            <div className={`step-circle ${currentStep >= 4 ? (currentStep > 4 ? "completed" : "active") : "inactive"}`}>
              {currentStep > 4 ? "✓" : "4"}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-700">支付确认</span>
          </div>

          <div className={`step-line ${currentStep > 4 ? "completed" : "inactive"}`}></div>

          {/* Step 5 Node */}
          <div className="step-node">
            <div className={`step-circle ${currentStep === 5 ? "completed" : "inactive"}`}>
              {currentStep === 5 ? "✓" : "5"}
            </div>
            <span className="text-xs mt-1 font-medium text-gray-700">入驻成功</span>
          </div>
        </div>

        {/* Modal content body */}
        <div className="modal-body-scroll px-8 pb-8 flex-1 overflow-y-auto max-h-[420px]">
          
          {/* STEP 1: 申报登记 */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="registration-form space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">企业名称 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="请输入完整的营业执照企业名称"
                    value={step1.companyName}
                    onChange={e => setStep1({...step1, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">联系人 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="联系人姓名"
                    value={step1.contactName}
                    onChange={e => setStep1({...step1, contactName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">联系人电话 <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="tel" 
                      required
                      placeholder="11位手机号码"
                      value={step1.phone}
                      onChange={e => setStep1({...step1, phone: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      disabled={smsTimer > 0 || isSendingSms}
                      onClick={sendSmsCode}
                      className="px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs font-semibold hover:bg-blue-100 disabled:opacity-50 min-w-[100px]"
                    >
                      {smsTimer > 0 ? `${smsTimer}s后重新获取` : (isSendingSms ? "发送中..." : "获取验证码")}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">短信验证码 <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="请输入短信验证码"
                    value={step1.code}
                    onChange={e => setStep1({...step1, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">电子邮箱</label>
                  <input 
                    type="email" 
                    placeholder="例如: company@example.com"
                    value={step1.email}
                    onChange={e => setStep1({...step1, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">入驻省份 <span className="text-red-500">*</span></label>
                  <select
                    value={step1.province}
                    onChange={e => setStep1({...step1, province: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {provinces.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">入驻平台</label>
                  <input
                    type="text"
                    placeholder="请输入想要入驻的平台名称"
                    value={step1.platformName}
                    onChange={e => setStep1({...step1, platformName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">政采入驻咨询电话：{phone400}</span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 shadow-md transition-colors"
                >
                  下一步 (资料提交)
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: 资料提交 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 leading-relaxed mb-2">
                请在此处上传您公司的真实资料资质，我们将对资料进行加密保护，仅用于集中采购入库及电子大厅申报。
              </div>

              <div className="upload-grid">
                {/*营业执照*/}
                <div className="upload-card relative">
                  {step2.businessLicense ? (
                    <div>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">✓</div>
                      <p className="text-xs text-gray-700 font-semibold truncate">营业执照已上传</p>
                      <button 
                        onClick={() => handleFileUpload("businessLicense", null)}
                        className="text-xxs text-red-500 hover:underline mt-1"
                      >
                        重新上传
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => triggerFileInput("businessLicense")} className="relative">
                      <input
                        ref={businessLicenseInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onClick={(e) => { e.stopPropagation(); e.currentTarget.value = ""; }}
                        onChange={(e) => handleFileInputChange("businessLicense", e)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        aria-label="上传营业执照"
                      />
                      <span className="block text-2xl mb-1">📁</span>
                      <span className="block text-xs font-semibold text-gray-700">上传营业执照</span>
                      <span className="block text-xxs text-gray-400 mt-1">支持JPG、PNG、PDF格式，最大10MB</span>
                    </div>
                  )}
                </div>

                {/*开户许可证*/}
                <div className="upload-card relative">
                  {step2.bankPermit ? (
                    <div>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">✓</div>
                      <p className="text-xs text-gray-700 font-semibold truncate">开户许可证已上传</p>
                      <button 
                        onClick={() => handleFileUpload("bankPermit", null)}
                        className="text-xxs text-red-500 hover:underline mt-1"
                      >
                        重新上传
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => triggerFileInput("bankPermit")} className="relative">
                      <input
                        ref={bankPermitInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onClick={(e) => { e.stopPropagation(); e.currentTarget.value = ""; }}
                        onChange={(e) => handleFileInputChange("bankPermit", e)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        aria-label="上传开户许可证或基本户信息"
                      />
                      <span className="block text-2xl mb-1">💳</span>
                      <span className="block text-xs font-semibold text-gray-700">开户许可证/基本户信息</span>
                      <span className="block text-xxs text-gray-400 mt-1">需清晰可见印章，最大10MB</span>
                    </div>
                  )}
                </div>

                {/*法人身份证正面*/}
                <div className="upload-card relative">
                  {step2.idCardFront ? (
                    <div>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">✓</div>
                      <p className="text-xs text-gray-700 font-semibold truncate">身份证正面已上传</p>
                      <button 
                        onClick={() => handleFileUpload("idCardFront", null)}
                        className="text-xxs text-red-500 hover:underline mt-1"
                      >
                        重新上传
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => triggerFileInput("idCardFront")} className="relative">
                      <input
                        ref={idCardFrontInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onClick={(e) => { e.stopPropagation(); e.currentTarget.value = ""; }}
                        onChange={(e) => handleFileInputChange("idCardFront", e)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        aria-label="上传法人身份证正面"
                      />
                      <span className="block text-2xl mb-1">👤</span>
                      <span className="block text-xs font-semibold text-gray-700">法人身份证正面 (加盖公章)</span>
                      <span className="block text-xxs text-gray-400 mt-1">需加盖公司公章复印件</span>
                    </div>
                  )}
                </div>

                {/*法人身份证反面*/}
                <div className="upload-card relative">
                  {step2.idCardBack ? (
                    <div>
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">✓</div>
                      <p className="text-xs text-gray-700 font-semibold truncate">身份证反面已上传</p>
                      <button 
                        onClick={() => handleFileUpload("idCardBack", null)}
                        className="text-xxs text-red-500 hover:underline mt-1"
                      >
                        重新上传
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => triggerFileInput("idCardBack")} className="relative">
                      <input
                        ref={idCardBackInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onClick={(e) => { e.stopPropagation(); e.currentTarget.value = ""; }}
                        onChange={(e) => handleFileInputChange("idCardBack", e)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        aria-label="上传法人身份证反面"
                      />
                      <span className="block text-2xl mb-1">👤</span>
                      <span className="block text-xs font-semibold text-gray-700">法人身份证反面 (加盖公章)</span>
                      <span className="block text-xxs text-gray-400 mt-1">需加盖公司公章复印件</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  上一步
                </button>
                <button
                  onClick={handleStep2Submit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 shadow-md"
                >
                  确认并下一步
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: 业务办理 & 支付 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md text-xs text-amber-800 mb-2 leading-relaxed">
                <strong>入驻服务：</strong>请选择您要开通的业务大项（可多选）。
                确认并提交后，请根据下方招采云服官方收款信息进行支付。支付完成核实后将在1-5个工作日内完成办理。
              </div>

              {/* Checkbox selector group (prices assigned but not rendered directly on selection checks) */}
              <div className="grid grid-cols-2 gap-3">
                {services.map(s => {
                  const isSelected = selectedServices.includes(s.id);
                  return (
                    <div 
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={`service-checkbox-card flex items-center justify-between ${isSelected ? "selected" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 py-2.5 h-4 border rounded flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"}`}>
                          {isSelected && <span className="text-xxs font-bold">✓</span>}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic total block */}
              <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center text-sm">
                <div className="text-gray-700">
                  您已选择办理的业务共 <strong className="text-blue-600 text-base">{selectedServices.length}</strong> 项
                </div>
                <div className="text-gray-700">
                  应缴服务费：<strong className="text-rose-600 text-lg">{calculatedTotal}</strong> 元
                </div>
              </div>


              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  上一步
                </button>
                <button
                  onClick={handleStep3Submit}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-semibold shadow-md"
                >
                  确认并支付
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 支付确认页面 */}
          {currentStep === 4 && (
            <div className="payment-confirm-panel py-3">
              <div className="payment-confirm-main">
                <div className="payment-qr-side">
                  <div className="payment-amount-bar">
                    应付金额：<strong>{calculatedTotal || 1000}元</strong>
                  </div>
                  <div className="payment-qr-wrap">
                    <img
                      src="/qrcode-payment.png"
                      alt="收款二维码"
                      className="payment-qr-img"
                    />
                  </div>
                  <div className="payment-method-text">支付宝支付</div>
                </div>

                <div className="payment-customer-side">
                  <div className="payment-customer-title">已支付入驻预付款商家</div>
                  <div className="payment-customer-scroll">
                    <div className="payment-customer-list">
                      {[...paidCustomers, ...paidCustomers].map((customer, index) => (
                        <div className="payment-customer-row" key={`${customer.phone}-${index}`}>
                          <span>{customer.region}/{customer.name}</span>
                          <span>{customer.phone}</span>
                          <span>{customer.minutes}分钟前</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="payment-action-row">
                <button
                  onClick={() => {
                    if (confirm("确定要返回上一步重新选择业务吗？")) {
                      setCurrentStep(3);
                    }
                  }}
                  className="payment-back-btn"
                >
                  先不付款，上一步
                </button>
                <button
                  onClick={() => {
                    saveProgress(5);
                    setCurrentStep(5);
                  }}
                  className="payment-paid-btn"
                >
                  我已支付，下一步
                </button>
              </div>

              <div className="payment-footer-note">
                <div>
                  政采入驻咨询电话：
                  <a href={`tel:${phone400.replace(/-/g, "")}`}>{phone400}</a>
                </div>
                <label>
                  <input type="checkbox" defaultChecked />
                  我已阅读并同意《电子卖场入驻资料审查提交服务条款》
                </label>
              </div>
            </div>
          )}

          {false && currentStep === 4 && (
            <div className="space-y-4 py-4">
              {/* 订单信息卡片 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-gray-600">申请时间：</span>
                  <span className="font-semibold text-gray-800">{orderTime}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">申请单号：</span>
                  <span className="font-mono font-semibold text-gray-800">{orderNumber}</span>
                </div>
              </div>

              {/* 收款信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-900 mb-3 text-center">扫码支付服务费</h4>
                
                {/* 收款二维码区域 */}
                <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                  <div className="w-48 h-48 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    {/* 这里放置收款二维码图片 */}
                    <img 
                      src="/qrcode-payment.png" 
                      alt="收款二维码" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    支持支付宝/微信/数字人民币
                  </p>
                </div>

                {/* 单项服务机构信息 */}
                <div className="mt-4 bg-white rounded-lg p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">单项服务：</span>
                    <span className="font-semibold text-gray-800">供应商入驻服务</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付金额：</span>
                    <span className="font-bold text-rose-600 text-base">{calculatedTotal}元</span>
                  </div>
                </div>
              </div>

              {/* 底部操作按钮 */}
              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <button
                  onClick={() => {
                    if (confirm('确定要返回上一步重新选择业务吗？')) {
                      setCurrentStep(3);
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  先不付款，下一步
                </button>
                <button
                  onClick={() => {
                    saveProgress(5);
                    setCurrentStep(5);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold shadow-md"
                >
                  我已支付，下一步
                </button>
              </div>

              {/* 底部说明 */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  政采业务咨询电话：<a href={`tel:${phone400.replace(/-/g, '')}`} className="text-blue-600 font-semibold hover:underline">{phone400}</a>
                </p>
                <p className="text-xxs text-gray-400">
                  <input type="checkbox" className="mr-1 align-middle" defaultChecked />
                  我已阅读服务协议并同意《<a href="#" className="text-blue-600 hover:underline">入驻资料查询报名服务条款</a>》
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: 办理完成 */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center py-4">
              
              {/* Checkmark animation container */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-4 font-bold animate-bounce">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-800">业务登记提交成功</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-md">
                  您的企业资料已提交，正在排队审核。为加快审核进程，稍后会有客服与您联系，请注意接听电话。
                </p>
              </div>



              {/* Invoice Application form panel */}
              {showInvoiceForm ? (
                <form onSubmit={handleInvoiceSubmit} className="max-w-md mx-auto p-4 border border-blue-200 rounded-xl bg-blue-50/50 text-left space-y-3">
                  <h4 className="text-xs font-bold text-blue-900 border-b border-blue-100 pb-1">申请开具电子发票</h4>
                  <div>
                    <label className="block text-xxs font-semibold text-gray-600 mb-0.5">发票抬头 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="公司名称"
                      value={invoiceTitle}
                      onChange={e => setInvoiceTitle(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-semibold text-gray-600 mb-0.5">统一社会信用代码/税号 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="统一社会信用代码"
                      value={taxId}
                      onChange={e => setTaxId(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xxs font-semibold text-gray-600 mb-0.5">接收邮箱 *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="邮箱地址"
                      value={invoiceEmail}
                      onChange={e => setInvoiceEmail(e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-1.5">
                    <button 
                      type="button" 
                      onClick={() => setShowInvoiceForm(false)}
                      className="flex-1 py-1 px-2 border border-gray-300 rounded text-xs bg-white"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-1 px-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                    >
                      提交申请
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowInvoiceForm(true)}
                    className="px-4 py-2 border border-blue-200 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-50 transition-colors"
                  >
                    申请发票
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700 shadow shadow-blue-200"
                  >
                    完成
                  </button>
                </div>
              )}

              <div className="text-[10px] text-gray-400">
                根据《电子卖场入驻资料审查提交服务条款》，如需申请退款，请拨打 {phone400} 联系人工服务。
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
