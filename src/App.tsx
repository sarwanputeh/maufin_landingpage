import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  Clock, 
  Calculator, 
  Cloud, 
  Bell, 
  ArrowRight, 
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { Mail as MailIcon } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

/* ---------------- Supabase Client ---------------- */
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

/* ---------------- Types ---------------- */
interface Content {
  en: string;
  th: string;
}
type Lang = 'en' | 'th';

/* ---------------- LeadForm (ใช้ตาราง muafin_leads) ---------------- */
function LeadForm({ language }: { language: Lang }) {
  const t = {
    fullName: language === 'en' ? 'Full Name' : 'ชื่อ-นามสกุล',
    email: language === 'en' ? 'Email Address' : 'อีเมล',
    phone: language === 'en' ? 'Phone Number' : 'เบอร์โทรศัพท์',
    bizName: language === 'en' ? 'Business/Organization (optional)' : 'ชื่อธุรกิจ/องค์กร (ไม่บังคับ)',
    bizType: language === 'en' ? 'Business Type' : 'ประเภทธุรกิจ',
    requestType: language === 'en' ? 'Request Type' : 'ประเภทคำขอ',
    requestDemo: language === 'en' ? 'Request Demo' : 'ขอเดโม',
    earlyAccess: language === 'en' ? 'Join Early Access' : 'เข้าร่วม Early Access',
    message: language === 'en' ? 'Message (optional)' : 'ข้อความเพิ่มเติม (ไม่บังคับ)',
    submit: language === 'en' ? 'Submit' : 'ส่งข้อมูล',
    submitting: language === 'en' ? 'Submitting...' : 'กำลังส่ง...',
    success: language === 'en' ? 'Thanks! We received your info.' : 'ขอบคุณ! ระบบได้รับข้อมูลแล้ว',
    invalid: language === 'en' ? 'Please fill in required fields correctly.' : 'กรุณากรอกข้อมูลที่จำเป็นให้ถูกต้อง',
    error: language === 'en' ? 'Submission failed, please try again.' : 'ส่งไม่สำเร็จ กรุณาลองใหม่',
  };

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    business_name: '',
    business_type: '',
    request_type: 'join_early_access' as 'join_early_access' | 'request_demo',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const isValid = () =>
    form.full_name.trim() &&
    /^\S+@\S+\.\S+$/.test(form.email);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!isValid()) {
      setMsg({ type: 'err', text: t.invalid });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        business_name: form.business_name.trim() || null,
        business_type: form.business_type || null,
        request_type: form.request_type,
        message: form.message.trim() || null,
        source_page: typeof window !== 'undefined' ? window.location.pathname : '/',
      };
      const { error } = await supabase.from('muafin_leads').insert([payload]);
      if (error) throw error;
      setMsg({ type: 'ok', text: t.success });
      setForm({
        full_name: '',
        email: '',
        phone: '',
        business_name: '',
        business_type: '',
        request_type: 'join_early_access',
        message: '',
      });
    } catch (err) {
      console.error(err);
      setMsg({ type: 'err', text: t.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {msg && (
        <div className={`rounded-xl px-4 py-3 text-sm border
          ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <input
          name="full_name"
          type="text"
          placeholder={t.fullName}
          value={form.full_name}
          onChange={onChange}
          className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
          required
        />
        <input
          name="email"
          type="email"
          placeholder={t.email}
          value={form.email}
          onChange={onChange}
          className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
          required
        />
        <input
          name="phone"
          type="tel"
          placeholder={t.phone}
          value={form.phone}
          onChange={onChange}
          className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
        />
        <input
          name="business_name"
          type="text"
          placeholder={t.bizName}
          value={form.business_name}
          onChange={onChange}
          className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
        />
        <select
          name="business_type"
          value={form.business_type}
          onChange={onChange}
          className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
        >
          <option value="">{t.bizType}</option>
          <option>{language === 'en' ? 'Islamic Bank' : 'ธนาคารอิสลาม'}</option>
          <option>{language === 'en' ? 'Ar-Rahnu Institution' : 'สถาบันอัรรอฮ์นู'}</option>
          <option>{language === 'en' ? 'Financial Services' : 'บริการทางการเงิน'}</option>
          <option>{language === 'en' ? 'Other' : 'อื่น ๆ'}</option>
        </select>
        <select
          name="request_type"
          value={form.request_type}
          onChange={onChange}
          className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
          required
        >
          <option value="join_early_access">{t.earlyAccess}</option>
          <option value="request_demo">{t.requestDemo}</option>
        </select>
      </div>

      <textarea
        name="message"
        placeholder={t.message}
        value={form.message}
        onChange={onChange}
        className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="px-12 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 text-lg"
      >
        {loading ? t.submitting : t.submit}
      </button>
    </form>
  );
}

/* ---------------- Main App ---------------- */
function App() {
  const [language, setLanguage] = useState<Lang>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // ใช้โลโก้จาก public โดยตรง (เช็คว่ามีไฟล์นี้ใน public/)
  const logo = "/mua-fin.png";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'th' : 'en');
  };

  const content = {
    nav: {
      features: { en: 'Features', th: 'คุณสมบัติ' },
      process: { en: 'Process', th: 'ขั้นตอน' },
      getStarted: { en: 'Get Started', th: 'เริ่มต้นใช้งาน' }
    },
    hero: {
      headline: { 
        en: 'Muafin – Digital Ar-Rahnu Fintech Software', 
        th: 'Muafin – ซอฟต์แวร์ฟินเทคเพื่อระบบอัรรอฮ์นูดิจิทัล' 
      },
      subheadline: { 
        en: 'All-in-One Cloud System for Collateral Loan Management with Full Shariah Logic & Thai Law Verification', 
        th: 'แพลตฟอร์มคลาวด์สำหรับบริหารจัดการสินเชื่อที่มีหลักประกันตามหลักชะรีอะห์ ครบจบในที่เดียว' 
      },
      cta: { en: 'Request Early Access', th: 'ขอเข้าทดลองใช้' }
    },
    problems: {
      headline: { 
        en: 'The Challenge of Manual Pawn Management', 
        th: 'ปัญหาของการบริหารงานรับจำนำแบบแมนนวล' 
      },
      items: [
        {
          title: { en: 'Paperwork Delays', th: 'เอกสารล่าช้า' },
          description: { 
            en: 'Time-consuming manual documentation processes lead to errors and inefficiency.', 
            th: 'กระบวนการจัดทำเอกสารด้วยมือใช้เวลานาน ทำให้เกิดข้อผิดพลาดและไม่มีประสิทธิภาพ' 
          }
        },
        {
          title: { en: 'Compliance Risks', th: 'ความเสี่ยงด้านข้อกำหนด' },
          description: { 
            en: 'Manual processes increase the risk of non-compliance with Shariah principles.', 
            th: 'กระบวนการแมนนวลเพิ่มความเสี่ยงในการไม่ปฏิบัติตามหลักชะรีอะห์' 
          }
        },
        {
          title: { en: 'Time Inefficiency', th: 'ใช้เวลามากเกินไป' },
          description: { 
            en: 'Slow processing times impact customer satisfaction and operational efficiency.', 
            th: 'การประมวลผลที่ช้าส่งผลต่อความพึงพอใจของลูกค้าและประสิทธิภาพการดำเนินงาน' 
          }
        }
      ]
    },
    features: {
      headline: { en: 'Why Muafin?', th: 'ทำไมต้อง Muafin?' },
      items: [
        {
          title: { en: 'Automated Ujrah Calculation', th: 'คำนวณอุญเราะห์อัตโนมัติ' },
          description: { 
            en: 'Precise, Shariah-compliant fee calculations with automated processing.', 
            th: 'คำนวณค่าธรรมเนียมที่ถูกต้องตามหลักชะรีอะห์ด้วยระบบอัตโนมัติ' 
          }
        },
        {
          title: { en: 'Shariah-Compliant Contract Templates', th: 'สัญญาถูกต้องตามหลักศาสนา' },
          description: { 
            en: 'Pre-built, legally compliant contract templates for consistency.', 
            th: 'แม่แบบสัญญาที่ถูกต้องตามกฎหมายและหลักศาสนาที่สร้างไว้แล้ว' 
          }
        },
        {
          title: { en: 'Cloud-Based Real-Time Access', th: 'เข้าถึงได้ทุกที่แบบเรียลไทม์' },
          description: { 
            en: 'Secure, scalable cloud infrastructure with 24/7 access from anywhere.', 
            th: 'โครงสร้างคลาวด์ที่ปลอดภัยและขยายได้ เข้าถึงได้ตลอด 24 ชั่วโมงจากทุกที่' 
          }
        },
        {
          title: { en: 'Automated Due-Date Reminders', th: 'แจ้งเตือนครบกำหนดอัตโนมัติ' },
          description: { 
            en: 'Automated notifications to keep both lenders and borrowers informed.', 
            th: 'การแจ้งเตือนอัตโนมัติเพื่อให้ผู้ให้กู้และผู้กู้ทราบข้อมูลอยู่เสมอ' 
          }
        }
      ]
    },
    process: {
      headline: { en: 'Simple 4-Step Process', th: 'ขั้นตอนง่าย ๆ เพียง 4 ขั้น' },
      steps: [
        {
          title: { en: 'Accept Collateral', th: 'รับทรัพย์ค้ำประกัน' },
          description: { 
            en: 'Securely register and evaluate collateral items with automated valuation.', 
            th: 'ลงทะเบียนและประเมินทรัพย์ค้ำประกันอย่างปลอดภัยด้วยระบบประเมินอัตโนมัติ' 
          }
        },
        {
          title: { en: 'Generate Contract', th: 'ออกสัญญา' },
          description: { 
            en: 'Automatically create Shariah-compliant contracts with all necessary terms.', 
            th: 'สร้างสัญญาที่ถูกต้องตามหลักชะรีอะห์พร้อมเงื่อนไขที่จำเป็นทั้งหมดโดยอัตโนมัติ' 
          }
        },
        {
          title: { en: 'Track Payments', th: 'ติดตามการชำระ' },
          description: { 
            en: 'Monitor payment schedules and maintain detailed financial records.', 
            th: 'ติดตามตารางการชำระเงินและเก็บบันทึกทางการเงินอย่างละเอียด' 
          }
        },
        {
          title: { en: 'Close Contract', th: 'ปิดสัญญา' },
          description: { 
            en: 'Seamlessly complete the loan cycle with automated settlement processes.', 
            th: 'ปิดวงจรสินเชื่ออย่างราบรื่นด้วยกระบวนการชำระหนี้อัตโนมัติ' 
          }
        }
      ]
    },
    contact: {
      headline: { en: 'Get Started Today', th: 'เริ่มต้นใช้งานวันนี้' },
      subheadline: { 
        en: 'Join the waitlist for early access to Muafin and revolutionize your collateral loan management', 
        th: 'เข้าร่วมรายชื่อรอสำหรับการเข้าถึงล่วงหน้า Muafin และปฏิวัติการบริหารสินเชื่อที่มีหลักประกันของคุณ' 
      }
    },
    footer: {
      description: { 
        en: 'Revolutionizing Ar-Rahnu operations with Shariah-compliant digital solutions for modern financial institutions.', 
        th: 'ปฏิวัติการดำเนินงานอัรรอฮ์นูด้วยโซลูชันดิจิทัลที่ถูกต้องตามหลักชะรีอะห์สำหรับสถาบันการเงินสมัยใหม่' 
      },
      contact: { en: 'Contact', th: 'ติดต่อ' },
      quickLinks: { en: 'Quick Links', th: 'ลิงก์ด่วน' },
      copyright: { 
        en: '© 2025 Muafin. All rights reserved. | Shariah-Compliant Digital Solutions', 
        th: '© 2025 Muafin สงวนลิขสิทธิ์ทุกประการ | โซลูชันดิจิทัลที่ถูกต้องตามหลักชะรีอะห์' 
      }
    }
  };

  const getText = (contentObj: Content) => contentObj[language];

  return (
    <div className="min-h-screen bg-white font-inter overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand (Logo) */}
            <button
              onClick={scrollToTop}
              className="flex items-center group focus:outline-none"
              aria-label="Muafin Home"
            >
              <img
                src={logo}
                alt="Muafin Logo"
                style={{ height: '200px', width: 'auto' }}
                className="mr-3 select-none"
                draggable={false}
              />
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className={`text-sm font-medium hover:text-emerald-600 transition-colors duration-300 ${
                  scrollY > 50 ? 'text-gray-700' : 'text-white'
                }`}
              >
                {getText(content.nav.features)}
              </button>
              <button 
                onClick={() => scrollToSection('process')}
                className={`text-sm font-medium hover:text-emerald-600 transition-colors duration-300 ${
                  scrollY > 50 ? 'text-gray-700' : 'text-white'
                }`}
              >
                {getText(content.nav.process)}
              </button>
              <button
                onClick={toggleLanguage}
                className={`flex items-center text-sm font-medium hover:text-emerald-600 transition-colors duration-300 ${
                  scrollY > 50 ? 'text-gray-700' : 'text-white'
                }`}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'ไทย' : 'EN'}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
              >
                {language === 'en' ? 'Get Started' : 'เริ่มต้นใช้งาน'}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className={`flex items-center text-sm font-medium ${
                  scrollY > 50 ? 'text-gray-700' : 'text-white'
                }`}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'ไทย' : 'EN'}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 ${scrollY > 50 ? 'text-gray-700' : 'text-white'}`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg">
            <div className="px-4 pt-2 pb-4 space-y-2">
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
              >
                {getText(content.nav.features)}
              </button>
              <button 
                onClick={() => scrollToSection('process')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 font-medium"
              >
                {getText(content.nav.process)}
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
              >
                {language === 'en' ? 'Get Started' : 'เริ่มต้นใช้งาน'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900"></div>
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <polygon points="10,1 4,7 4,13 10,19 16,13 16,7" fill="currentColor" />
                <polygon points="1,10 7,4 13,4 19,10 13,16 7,16" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamic-pattern)" className="text-white" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-snug tracking-tight">
  {getText(content.hero.headline)}
</h1>

<p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
  {getText(content.hero.subheadline)}
</p>

          <button 
            onClick={() => scrollToSection('contact')}
            className="bg-white text-emerald-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center"
          >
            {language === 'en' ? 'Request Early Access' : 'ขอเข้าทดลองใช้'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              {language === 'en' ? 'The Challenge of Manual Pawn Management' : 'ปัญหาของการบริหารงานรับจำนำแบบแมนนวล'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[0,1,2].map((index) => (
              <div key={index} className="text-center group">
                <div className="bg-white p-12 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2">
                  <div className="bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-red-100 transition-colors duration-300">
                    {index === 0 && <FileText className="h-10 w-10 text-red-600" />}
                    {index === 1 && <Shield className="h-10 w-10 text-red-600" />}
                    {index === 2 && <Clock className="h-10 w-10 text-red-600" />}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {[
                      { en: 'Paperwork Delays', th: 'เอกสารล่าช้า' },
                      { en: 'Compliance Risks', th: 'ความเสี่ยงด้านข้อกำหนด' },
                      { en: 'Time Inefficiency', th: 'ใช้เวลามากเกินไป' }
                    ][index][language as 'en' | 'th']}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {[
                      { en: 'Time-consuming manual documentation processes lead to errors and inefficiency.', th: 'กระบวนการจัดทำเอกสารด้วยมือใช้เวลานาน ทำให้เกิดข้อผิดพลาดและไม่มีประสิทธิภาพ' },
                      { en: 'Manual processes increase the risk of non-compliance with Shariah principles.', th: 'กระบวนการแมนนวลเพิ่มความเสี่ยงในการไม่ปฏิบัติตามหลักชะรีอะห์' },
                      { en: 'Slow processing times impact customer satisfaction and operational efficiency.', th: 'การประมวลผลที่ช้าส่งผลต่อความพึงพอใจของลูกค้าและประสิทธิภาพการดำเนินงาน' }
                    ][index][language as 'en' | 'th']}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              {language === 'en' ? 'Why Muafin?' : 'ทำไมต้อง Muafin?'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Calculator className="h-10 w-10 text-emerald-600" />, en: 'Automated Ujrah Calculation', th: 'คำนวณอุญเราะห์อัตโนมัติ',
                ed: { en: 'Precise, Shariah-compliant fee calculations with automated processing.', th: 'คำนวณค่าธรรมเนียมที่ถูกต้องตามหลักชะรีอะห์ด้วยระบบอัตโนมัติ' } },
              { icon: <FileText className="h-10 w-10 text-emerald-600" />, en: 'Shariah-Compliant Contract Templates', th: 'สัญญาถูกต้องตามหลักศาสนา',
                ed: { en: 'Pre-built, legally compliant contract templates for consistency.', th: 'แม่แบบสัญญาที่ถูกต้องตามกฎหมายและหลักศาสนาที่สร้างไว้แล้ว' } },
              { icon: <Cloud className="h-10 w-10 text-emerald-600" />, en: 'Cloud-Based Real-Time Access', th: 'เข้าถึงได้ทุกที่แบบเรียลไทม์',
                ed: { en: 'Secure, scalable cloud infrastructure with 24/7 access from anywhere.', th: 'โครงสร้างคลาวด์ที่ปลอดภัยและขยายได้ เข้าถึงได้ตลอด 24 ชั่วโมงจากทุกที่' } },
              { icon: <Bell className="h-10 w-10 text-emerald-600" />, en: 'Automated Due-Date Reminders', th: 'แจ้งเตือนครบกำหนดอัตโนมัติ',
                ed: { en: 'Automated notifications to keep both lenders and borrowers informed.', th: 'การแจ้งเตือนอัตโนมัติเพื่อให้ผู้ให้กู้และผู้กู้ทราบข้อมูลอยู่เสมอ' } }
            ].map((f, idx) => (
              <div key={idx} className="text-center group">
                <div className="bg-emerald-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:bg-emerald-100 transition-colors duration-300">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {language === 'en' ? f.en : f.th}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {language === 'en' ? f.ed.en : f.ed.th}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section id="process" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              {language === 'en' ? 'Simple 4-Step Process' : 'ขั้นตอนง่าย ๆ เพียง 4 ขั้น'}
            </h2>
          </div>
          
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-emerald-200"></div>
            <div className="space-y-20">
              {[
                { en: 'Accept Collateral', th: 'รับทรัพย์ค้ำประกัน',
                  ed: { en: 'Securely register and evaluate collateral items with automated valuation.', th: 'ลงทะเบียนและประเมินทรัพย์ค้ำประกันอย่างปลอดภัยด้วยระบบประเมินอัตโนมัติ' } },
                { en: 'Generate Contract', th: 'ออกสัญญา',
                  ed: { en: 'Automatically create Shariah-compliant contracts with all necessary terms.', th: 'สร้างสัญญาที่ถูกต้องตามหลักชะรีอะห์พร้อมเงื่อนไขที่จำเป็นทั้งหมดโดยอัตโนมัติ' } },
                { en: 'Track Payments', th: 'ติดตามการชำระ',
                  ed: { en: 'Monitor payment schedules and maintain detailed financial records.', th: 'ติดตามตารางการชำระเงินและเก็บบันทึกทางการเงินอย่างละเอียด' } },
                { en: 'Close Contract', th: 'ปิดสัญญา',
                  ed: { en: 'Seamlessly complete the loan cycle with automated settlement processes.', th: 'ปิดวงจรสินเชื่ออย่างราบรื่นด้วยกระบวนการชำระหนี้อัตโนมัติ' } }
              ].map((step, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'}`}>
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                    <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2">
                      <div className="flex items-center mb-6">
                        <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-semibold mr-6 text-lg">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {language === 'en' ? step.en : step.th}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed font-light">
                        {language === 'en' ? step.ed.en : step.ed.th}
                      </p>
                    </div>
                  </div>
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="bg-emerald-600 w-6 h-6 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Lead Capture Form Section */}
      <section id="contact" className="py-32 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
              {language === 'en' ? 'Get Started Today' : 'เริ่มต้นใช้งานวันนี้'}
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto font-light">
              {language === 'en'
                ? 'Join the waitlist for early access to Muafin and revolutionize your collateral loan management'
                : 'เข้าร่วมรายชื่อรอสำหรับการเข้าถึงล่วงหน้า Muafin และปฏิวัติการบริหารสินเชื่อที่มีหลักประกันของคุณ'}
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            {/* ฟอร์มจริง (Supabase) */}
            <LeadForm language={language} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-8">
                <Shield className="h-8 w-8 mr-3 text-emerald-400" />
                <span className="text-2xl font-semibold">Muafin</span>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed max-w-md font-light text-lg">
                {language === 'en'
                  ? 'Revolutionizing Ar-Rahnu operations with Shariah-compliant digital solutions for modern financial institutions.'
                  : 'ปฏิวัติการดำเนินงานอัรรอฮ์นูด้วยโซลูชันดิจิทัลที่ถูกต้องตามหลักชะรีอะห์สำหรับสถาบันการเงินสมัยใหม่'}
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">{language === 'en' ? 'Contact' : 'ติดต่อ'}</h4>
              <div className="space-y-4">
                <div className="flex items-center">
               <MailIcon className="h-5 w-5 mr-3 text-emerald-400 shrink-0" />
  <span className="text-gray-300 truncate max-w-[220px] sm:max-w-[280px]">
    sarwandataengineering@gmail.com
  </span>
                </div>
                <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-emerald-400" />
            <span className="text-gray-300">+66 99 234 1870</span>
                </div>
                <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-3 text-emerald-400" />

                  <span className="text-gray-300">
                    {language === 'en' ? 'Bangkok, Thailand' : 'กรุงเทพฯ ประเทศไทย'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-6">{language === 'en' ? 'Quick Links' : 'ลิงก์ด่วน'}</h4>
              <div className="space-y-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                >
                  {language === 'en' ? 'Features' : 'คุณสมบัติ'}
                </button>
                <button 
                  onClick={() => scrollToSection('process')}
                  className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                >
                  {language === 'en' ? 'Process' : 'ขั้นตอน'}
                </button>
                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                  {language === 'en' ? 'Privacy Policy' : 'นโยบายความเป็นส่วนตัว'}
                </a>
                <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                  {language === 'en' ? 'Terms of Service' : 'ข้อกำหนดการใช้บริการ'}
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-16 pt-8 text-center">
            <p className="text-gray-400 font-light">
              {language === 'en'
                ? '© 2025 Muafin. All rights reserved. | Shariah-Compliant Digital Solutions'
                : '© 2025 Muafin สงวนลิขสิทธิ์ทุกประการ | โซลูชันดิจิทัลที่ถูกต้องตามหลักชะรีอะห์'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
