import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Phone, PhoneOff, MessageSquare, Briefcase, 
  Send, Settings, ChevronRight, Zap, 
  Users, BarChart3, AlertTriangle, Globe, Menu, Headset, Coins, Clock
} from 'lucide-react';

/**
 * H2AI INVESTOR LANDING PAGE v9
 * - FEATURES: Reverted to clean 2-card layout (Hiring & Sales engines only).
 * - ECONOMICS: Split into "Why We Win in Hiring" and "Why We Win in Marketing".
 * - RESPONSIVE: Maintained full mobile compatibility.
 */

// --- HOOK: DETECT SCREEN SIZE ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 850);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// --- HOOK: DETECT SCROLL DIRECTION ---
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDirection && (scrollY - lastScrollY > 5 || scrollY - lastScrollY < -5)) {
        setScrollDirection(direction);
      }
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
};

// --- CONSTANTS ---
const MARKETING_DEFAULT = `COMPANY: "FitLife Gym"
LOCATION: Downtown New York
OFFERS: 
- Basic Membership: $30/month
- Premium (Sauna + Trainer): $60/month
- Current Promo: First month free for Premium users.

FAQ:
- Open 24/7? Yes.
- Cancel anytime? Yes, with 30 days notice.`;

const HIRING_DEFAULT = `ROLE: Senior Java Developer
EXP REQUIRED: 3+ Years
SKILLS:
- Spring Boot, Microservices
- AWS (EC2, S3)
- SQL Database optimization

INTERVIEW STYLE:
- Ask about handling high traffic.
- Ask about a difficult bug they fixed.
- Keep it friendly but technical.`;

const PITCH_DECK_URL = "https://docs.google.com/presentation/d/1PL3uEikWQZzVeM7smnAXoEQNpNt2mYMc/edit?usp=sharing&ouid=111178303563246903729&rtpof=true&sd=true";

// --- COMPONENT: MARKETING CHAT DEMO ---
const MarketingDemo = ({ isMobile }) => {
  const [config, setConfig] = useState(MARKETING_DEFAULT);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    return () => {
        if(wsRef.current) wsRef.current.close();
    };
  }, []);

  const toggleChat = () => {
    if (isChatActive) {
        if(wsRef.current) wsRef.current.close();
        setIsChatActive(false);
        setMessages(prev => [...prev, {role: 'system', text: 'Chat session ended.'}]);
    } else {
        const ws = new WebSocket('wss://h2ai-backend.onrender.com/ws/voice');
        wsRef.current = ws;

        ws.onopen = () => {
            setIsChatActive(true);
            setMessages([{role: 'ai', text: 'Hello! I am connected and ready to help.'}]);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setIsTyping(false);
            if (data.fullText) {
                setMessages(prev => [...prev, { role: 'ai', text: data.fullText }]);
            }
        };

        ws.onclose = () => setIsChatActive(false);
    }
  };

  const sendMessage = () => {
    if(!input.trim() || !isChatActive) return;
    const userMsg = input;
    
    setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setInput("");
    setIsTyping(true);
    
    if(wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ 
        text: userMsg, 
        config: config, 
        mode: 'marketing' 
      }));
    }
  };

  return (
    <div style={{
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', 
        gridTemplateRows: isMobile ? '120px 1fr' : '100%',
        height: '100%', 
        position: 'relative', 
        zIndex: 2
    }}>
      {/* Config Panel - Compact */}
      <div style={{
          background: '#0f172a', 
          padding: '15px', 
          borderRight: isMobile ? 'none' : '1px solid #334155', 
          borderBottom: isMobile ? '1px solid #334155' : 'none',
          display: 'flex', 
          flexDirection: 'column'
      }}>
         <h4 style={{marginBottom: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', marginTop: 0}}>
           <Settings size={14}/> Knowledge Base
         </h4>
         <textarea 
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          style={{
            flex: 1, // Auto fill height
            width: '100%', background: '#1e293b', border: '1px solid #334155', 
            color: '#cbd5e1', padding: '10px', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace',
            resize: 'none', boxSizing: 'border-box'
          }}
         />
      </div>

      {/* Chat UI */}
      <div style={{display: 'flex', flexDirection: 'column', background: 'rgba(2, 6, 23, 0.8)', height: '100%', overflow: 'hidden'}}>
        <div style={{flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {!isChatActive && messages.length === 0 && (
                <div style={{textAlign: 'center', marginTop: isMobile ? '20px' : '60px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{
                    width: '60px', height: '60px', background: '#3b82f6', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', 
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                    animation: 'pulse-blue 2s infinite'
                    }}>
                        <Globe color="white" size={30}/>
                    </div>
                    {/* ADDED: Training Context Badge */}
                    {/* <div style={{background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', marginBottom: '15px', border: '1px solid rgba(59, 130, 246, 0.2)', fontWeight: '500'}}>
                        Training: Harvard MBA + 10k Books
                    </div> */}
                    <p style={{color: '#94a3b8', marginBottom: '15px'}}>Press button to start demo</p>
                    <button onClick={toggleChat} style={{background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer'}}>
                        Start Live Demo
                    </button>
                </div>
            )}
            
            {messages.map((m, i) => (
                m.text && (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : m.role === 'system' ? 'center' : 'flex-start',
                        background: m.role === 'user' ? '#3b82f6' : m.role === 'system' ? 'transparent' : '#334155',
                        color: m.role === 'system' ? '#94a3b8' : 'white',
                        padding: '10px 15px',
                        borderRadius: '10px',
                        maxWidth: '90%',
                        fontSize: m.role === 'system' ? '12px' : '14px',
                        animation: 'fadeIn 0.3s ease-in'
                    }}>
                        {m.text}
                    </div>
                )
            ))}
            {isTyping && <div style={{fontSize:'12px', color:'#94a3b8', marginLeft: '10px'}}>AI is thinking...</div>}
        </div>

        {/* Input Area - Compact */}
        <div style={{padding: '10px 15px', borderTop: '1px solid #334155', display: 'flex', gap: '10px', background: '#020617'}}>
            <input 
                value={input}
                disabled={!isChatActive}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={isChatActive ? "Type message..." : "Chat ended"}
                style={{flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#1e293b', color: 'white', fontSize: '14px', width: '100px'}} 
            />
            <button onClick={sendMessage} disabled={!isChatActive} style={{background: isChatActive ? '#3b82f6' : '#334155', border: 'none', borderRadius: '8px', width: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Send size={16} color="white"/>
            </button>
             {isChatActive && (
                 <button onClick={toggleChat} style={{background: '#ef4444', border: 'none', borderRadius: '8px', width: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <PhoneOff size={16} color="white"/>
                 </button>
             )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: HIRING VOICE DEMO ---
const HiringDemo = ({ isMobile }) => {
  const [config, setConfig] = useState(HIRING_DEFAULT);
  const [status, setStatus] = useState("Ready");
  const [isLive, setIsLive] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  useEffect(() => {
    return () => stopCall(); 
  }, []);

  const startCall = () => {
    setIsLive(true);
    setStatus("Connecting...");
    
    const ws = new WebSocket('wss://h2ai-backend.onrender.com/ws/voice');
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("Listening...");
      startRecognition();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.fullText) {
          speakText(data.fullText);
      }
    };

    ws.onclose = () => {
        setStatus("Disconnected");
        setIsLive(false);
    }
  };

  const stopCall = () => {
    setIsLive(false);
    setStatus("Ready");
    if (socketRef.current) socketRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (synthRef.current) synthRef.current.cancel();
  };

  const speakText = (text) => {
    if(!text.trim()) return;
    setStatus("AI Speaking...");
    
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0; 
    u.pitch = 1.0;
    
    u.onstart = () => { 
        setAiSpeaking(true); 
        if(recognitionRef.current) recognitionRef.current.abort(); 
    };
    
    u.onend = () => { 
        setAiSpeaking(false); 
        setStatus("Listening...");
        if(isLive) startRecognition(); 
    };
    
    synthRef.current.speak(u);
  };

  const startRecognition = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) {
        alert("Browser not supported. Use Chrome.");
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setStatus("Processed.");
      if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          text: transcript,
          config: config,
          mode: 'hiring' 
        }));
      }
    };

    recognition.onend = () => {
      if(isLive && !synthRef.current.speaking) {
          recognition.start();
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div style={{
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', 
        gridTemplateRows: isMobile ? '120px 1fr' : '100%',
        height: '100%', 
        position: 'relative', 
        zIndex: 2
    }}>
        {/* Config Panel - Compact */}
        <div style={{
            background: '#0f172a', 
            padding: '15px', 
            borderRight: isMobile ? 'none' : '1px solid #334155', 
            borderBottom: isMobile ? '1px solid #334155' : 'none',
            display: 'flex', 
            flexDirection: 'column'
        }}>
            <h4 style={{marginBottom: '10px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', marginTop: 0}}>
                <Briefcase size={14}/> Job Requirements
            </h4>
            <textarea 
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                style={{
                    flex: 1, // Auto fill height
                    width: '100%', background: '#1e293b', border: '1px solid #334155', 
                    color: '#cbd5e1', padding: '10px', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace',
                    resize: 'none', boxSizing: 'border-box'
                }}
            />
        </div>

        {/* Voice UI - Compact */}
        <div style={{background: 'rgba(2, 6, 23, 0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
            <div style={{
                width: isMobile ? '80px' : '100px', 
                height: isMobile ? '80px' : '100px', 
                borderRadius: '50%', 
                background: aiSpeaking ? 'radial-gradient(circle, #a855f7 0%, transparent 70%)' : isLive ? 'radial-gradient(circle, #22c55e 0%, transparent 70%)' : '#1e293b',
                border: '2px solid #334155',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isLive ? '0 0 40px rgba(168, 85, 247, 0.6)' : 'none',
                marginBottom: '20px', 
                transition: 'all 0.3s',
                transform: aiSpeaking ? 'scale(1.2)' : 'scale(1)',
                animation: aiSpeaking ? 'pulse 1s infinite' : 'none'
            }}>
                {isLive ? <Mic size={isMobile ? 24 : 32} color="white" /> : <Mic size={isMobile ? 24 : 32} color="#64748b" />}
            </div>

            <div style={{color: '#94a3b8', marginBottom: '15px', fontFamily: 'monospace', display:'flex', alignItems:'center', gap: '8px', fontSize: '13px'}}>
                {isLive && <span style={{display:'block', width:'8px', height:'8px', background: aiSpeaking ? '#a855f7' : '#22c55e', borderRadius:'50%', animation: 'blink 1s infinite'}}></span>}
                {status}
            </div>
       
            <div style={{display:'flex', gap: '20px'}}>
                {!isLive ? (
                    <button onClick={startCall} style={{
                        background: '#22c55e',
                        color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px',
                        fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                    }}>
                        <Phone size={16}/> Start Interview
                    </button>
                ) : (
                    <button onClick={stopCall} style={{
                        background: '#ef4444',
                        color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px',
                        fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', gap: '10px', alignItems: 'center',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                    }}>
                        <PhoneOff size={16}/> End Interview
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [demoTab, setDemoTab] = useState('sales');
  const scrollDirection = useScrollDirection();
  const isMobile = useIsMobile();
  
  const styles = `
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    @keyframes pulse-blue {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(59, 130, 246, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes radar-scan {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    html { scroll-behavior: smooth; }
  `;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if(element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{fontFamily: '"Inter", sans-serif', background: '#020617', color: '#f8fafc', minHeight: '100vh', overflowX: 'hidden'}}>
      <style>{styles}</style>
      
      {/* SMART NAVBAR */}
      <nav style={{
        padding: isMobile ? '15px 20px' : '15px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1e293b',
        position: 'fixed',
        width: '100%',
        top: scrollDirection === "down" ? "-80px" : "0", 
        transition: "top 0.4s ease-in-out",
        zIndex: 1000,
        boxSizing: 'border-box'
      }}>
        <div style={{fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          H2AI
        </div>
        
        {/* Desktop Nav */}
        {!isMobile ? (
             <div style={{display: 'flex', gap: '30px', fontSize: '14px', fontWeight: '500'}}>
             <button onClick={() => scrollToSection('features')} style={{background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px', transition: 'color 0.2s'}}>Features</button>
             <button onClick={() => scrollToSection('economics')} style={{background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px', transition: 'color 0.2s'}}>Pricing</button>
             <button onClick={() => scrollToSection('demo-section')} style={{background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '14px', transition: 'color 0.2s'}}>Live Demo</button>
           </div>
        ) : (
             <button onClick={() => scrollToSection('demo-section')} style={{background: '#3b82f6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold'}}>
                Try Demo
             </button>
        )}
      </nav>

      <div style={{height: '80px'}}></div>

      {/* HERO SECTION */}
      <header style={{textAlign: 'center', padding: isMobile ? '40px 20px' : '80px 20px', maxWidth: '800px', margin: '0 auto', position: 'relative'}}>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1}}></div>
        
        <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', fontSize: '13px', fontWeight: '600', marginBottom: '24px', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
          <span style={{display: 'block', width: '8px', height: '8px', background: '#60a5fa', borderRadius: '50%', animation: 'blink 2s infinite'}}></span>
          The Autonomous Revenue Engine
        </div>
        
        <h1 style={{fontSize: isMobile ? '36px' : '60px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1.5px'}}>
          From Hiring to Acquisition<br/>
          <span style={{color: '#94a3b8'}}>One Platform.</span>
        </h1>
        
        <p style={{fontSize: isMobile ? '16px' : '18px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto'}}>
          Scale your business without the "Growth Tax". Automate sourcing, interviewing, and sales with AI that costs fractions of a penny.
        </p>
        
        <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', justifyContent: 'center', alignItems: 'center'}}>
          <button 
            onClick={() => scrollToSection('demo-section')} 
            style={{
              background: '#3b82f6', color: 'white', padding: '16px 32px', borderRadius: '12px', border: 'none', 
              fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              animation: 'pulse-glow 2s infinite',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Try Beta Demo <ChevronRight size={20}/>
          </button>
          
          <button 
            onClick={() => window.open(PITCH_DECK_URL, '_blank')}
            style={{
                background: 'transparent', border: '1px solid #334155', color: '#cbd5e1', padding: '16px 32px', borderRadius: '12px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', transition: 'background 0.2s',
                width: isMobile ? '100%' : 'auto'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e293b'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            View Pitch Deck
          </button>
        </div>
      </header>

      {/* STATS */}
      <div style={{borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '40px 0', background: '#0f172a', marginTop: '60px'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '30px' : '20px', textAlign: 'center'}}>
           <div>
             <div style={{fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '5px'}}>20x</div>
             <div style={{color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600'}}>Cost Savings</div>
           </div>
           <div>
             <div style={{fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '5px'}}>$0.07</div>
             <div style={{color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600'}}>Cost Per Interview</div>
           </div>
           <div>
             <div style={{fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '5px'}}>100%</div>
             <div style={{color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600'}}>Autonomous</div>
           </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <section id="features" style={{padding: '100px 20px', maxWidth: '1100px', margin: '0 auto'}}>
        <h2 style={{fontSize: isMobile ? '28px' : '32px', textAlign: 'center', marginBottom: '10px'}}>Two Engines. One Platform.</h2>
        <p style={{textAlign: 'center', color: '#94a3b8', marginBottom: '60px'}}>Replace manual bottlenecks with intelligent automation.</p>
        
        {/* REVERTED TO 2 COLUMN LAYOUT (NO EXTRA CARDS) */}
        <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '40px'}}>
          
          {/* CARD 1: HIRING ENGINE */}
          <div style={{background: '#1e293b', padding: '40px', borderRadius: '24px', border: '1px solid #334155', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, right: 0, padding: '10px 20px', background: '#2e1065', borderBottomLeftRadius: '24px', color: '#d8b4fe', fontSize: '12px', fontWeight: 'bold'}}>HIRING</div>
            <div style={{width: '50px', height: '50px', background: '#a855f7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
              <Users color="white" />
            </div>
            <h3 style={{fontSize: '24px', marginBottom: '10px'}}>The Hiring Engine</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6', marginBottom: '30px'}}>
              Stop paying $20+ per assessment. Automate sourcing, screening, and voice interviews.
            </p>
            <ul style={{listStyle: 'none', padding: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <li style={{display: 'flex', gap: '10px', alignItems: 'center'}}><Zap size={16} color="#a855f7"/> Next-Gen Cognitive AI</li>
              <li style={{display: 'flex', gap: '10px', alignItems: 'center'}}><Zap size={16} color="#a855f7"/> Deep Technical Reasoning</li>
            </ul>
          </div>

          {/* CARD 2: SALES ENGINE (WITH MBA COPY) */}
          <div style={{background: '#1e293b', padding: '40px', borderRadius: '24px', border: '1px solid #334155', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', top: 0, right: 0, padding: '10px 20px', background: '#172554', borderBottomLeftRadius: '24px', color: '#93c5fd', fontSize: '12px', fontWeight: 'bold'}}>SALES</div>
            <div style={{width: '50px', height: '50px', background: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
              <BarChart3 color="white" />
            </div>
            <h3 style={{fontSize: '24px', marginBottom: '10px'}}>The Sales Engine</h3>
            <p style={{color: '#94a3b8', lineHeight: '1.6', marginBottom: '30px'}}>
              Trained on <strong>Harvard MBA case studies</strong> and <strong>10,000+ sales books</strong>. Our AI uses advanced sales psychology to close deals like a top-tier rep.
            </p>
            <ul style={{listStyle: 'none', padding: 0, color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <li style={{display: 'flex', gap: '10px', alignItems: 'center'}}><Zap size={16} color="#3b82f6"/> Omnichannel Domination</li>
              <li style={{display: 'flex', gap: '10px', alignItems: 'center'}}><Zap size={16} color="#3b82f6"/> Psychological Closing</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ECONOMICS & WHY WE WIN */}
      <section id="economics" style={{background: '#0f172a', padding: '80px 20px'}}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <div style={{marginBottom: '50px', textAlign: 'center'}}>
             <h2 style={{marginBottom: '10px'}}>Why We Win in Hiring</h2>
             <p style={{color: '#94a3b8'}}>Radically better economics through "Map-Reduce" Architecture.</p>
          </div>
          
          {/* HIRING TABLE */}
          <div style={{background: '#1e293b', borderRadius: '16px', overflowX: 'auto', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', marginBottom: '80px'}}>
            <table style={{width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #334155', background: '#020617'}}>
                  <th style={{padding: '25px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase'}}>Provider</th>
                  <th style={{padding: '25px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase'}}>Cost</th>
                  <th style={{padding: '25px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase'}}>Contracts</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #334155'}}>
                  <td style={{padding: '25px'}}>Mercer / HackerRank</td>
                  <td style={{padding: '25px', color: '#ef4444'}}>$20 - $30 / assessment</td>
                  <td style={{padding: '25px', color: '#94a3b8'}}>Rigid Enterprise</td>
                </tr>
                <tr style={{background: 'rgba(59, 130, 246, 0.05)'}}>
                  <td style={{padding: '25px', fontWeight: 'bold', color: '#3b82f6'}}>H2AI Platform</td>
                  <td style={{padding: '25px', fontWeight: 'bold', color: '#22c55e'}}>$1.00 / interview</td>
                  <td style={{padding: '25px', fontWeight: 'bold', color: '#f8fafc'}}>Flexible Pay-as-you-go</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{marginBottom: '50px', textAlign: 'center'}}>
             <h2 style={{marginBottom: '10px'}}>Why We Win in Marketing</h2>
             <p style={{color: '#94a3b8'}}>Replace Sales Call Centers with Infinite Scale.</p>
          </div>

          {/* MARKETING TABLE (NEW) */}
          <div style={{background: '#1e293b', borderRadius: '16px', overflowX: 'auto', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}}>
            <table style={{width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #334155', background: '#020617'}}>
                  <th style={{padding: '25px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase'}}>Solution</th>
                  <th style={{padding: '25px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase'}}>Capacity</th>
                  <th style={{padding: '25px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase'}}>Avg Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #334155'}}>
                  <td style={{padding: '25px'}}>Human Call Center</td>
                  <td style={{padding: '25px', color: '#ef4444'}}>Limited (1 call at a time)</td>
                  <td style={{padding: '25px', color: '#ef4444'}}>$3,000 / month / agent</td>
                </tr>
                <tr style={{background: 'rgba(59, 130, 246, 0.05)'}}>
                  <td style={{padding: '25px', fontWeight: 'bold', color: '#3b82f6'}}>H2AI Sales Agent</td>
                  <td style={{padding: '25px', fontWeight: 'bold', color: '#22c55e'}}>Infinite (10k+ concurrent)</td>
                  <td style={{padding: '25px', fontWeight: 'bold', color: '#f8fafc'}}>$0.10 / conversation</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* INTERACTIVE DEMO SECTION (COMPACT HEIGHT 550px) */}
      <section id="demo-section" style={{padding: '60px 20px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
           <div style={{display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#22c55e20', color: '#22c55e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', border: '1px solid #22c55e40'}}>
             <div style={{width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'blink 1s infinite'}}></div>
             LIVE SYSTEM ONLINE
           </div>
           <h2 style={{fontSize: isMobile ? '28px' : '32px'}}>Experience the Future</h2>
           <p style={{color: '#94a3b8'}}>Try our live Beta modules below.</p>
           
           {/* INLINE BETA WARNING */}
           <div style={{
             background: 'rgba(245, 158, 11, 0.1)', 
             color: '#fbbf24', 
             border: '1px solid rgba(245, 158, 11, 0.3)',
             borderRadius: '30px',
             padding: '6px 16px',
             marginTop: '15px',
             display: 'inline-flex',
             alignItems: 'center',
             gap: '8px',
             fontSize: '12px',
             fontWeight: '500',
             textAlign: 'left'
           }}>
             <AlertTriangle size={14} style={{flexShrink: 0}} />
             <span>BETA PREVIEW: System is live for investor demonstration.</span>
           </div>
        </div>

        <div style={{background: '#1e293b', borderRadius: '24px', border: '1px solid #334155', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '550px', position: 'relative'}}>
          
          {/* RADAR ANIMATION */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', marginLeft: '-300px', marginTop: '-300px',
            width: '600px', height: '600px', background: 'conic-gradient(from 0deg, transparent 0deg, rgba(59, 130, 246, 0.05) 360deg)',
            borderRadius: '50%', animation: 'radar-scan 4s linear infinite', zIndex: 0, pointerEvents: 'none'
          }}></div>

          {/* Demo Tabs - SALES FIRST */}
          <div style={{display: 'flex', borderBottom: '1px solid #334155', zIndex: 1, position: 'relative', background: '#1e293b'}}>
            <button 
              onClick={() => setDemoTab('sales')}
              style={{
                flex: 1, padding: '15px', background: demoTab === 'sales' ? '#172554' : 'transparent', 
                color: demoTab === 'sales' ? '#93c5fd' : '#94a3b8', border: 'none', cursor: 'pointer',
                fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '10px', transition: 'all 0.3s', fontSize: isMobile ? '12px' : '14px', alignItems: 'center'
              }}
            >
              <MessageSquare size={isMobile ? 14 : 18}/> {isMobile ? "Sales AI" : "Sales & Marketing AI"}
            </button>
            <button 
              onClick={() => setDemoTab('hiring')}
              style={{
                flex: 1, padding: '15px', background: demoTab === 'hiring' ? '#2e1065' : 'transparent', 
                color: demoTab === 'hiring' ? '#d8b4fe' : '#94a3b8', border: 'none', cursor: 'pointer',
                fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '10px', transition: 'all 0.3s', fontSize: isMobile ? '12px' : '14px', alignItems: 'center'
              }}
            >
              <Briefcase size={isMobile ? 14 : 18}/> {isMobile ? "Hiring AI" : "Hiring & Interview AI"}
            </button>
          </div>

          <div style={{flex: 1, zIndex: 1, position: 'relative'}}>
             {demoTab === 'hiring' ? <HiringDemo isMobile={isMobile} /> : <MarketingDemo isMobile={isMobile} />}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop: '1px solid #1e293b', padding: '30px 20px', textAlign: 'center', color: '#64748b'}}>
        <div style={{marginBottom: '5px', fontWeight: 'bold', color: 'white'}}>H2AI Inc.</div>
        <div style={{fontSize: '12px'}}>
           &copy; 2025 H2AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;