import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Phone, PhoneOff, MessageSquare, Briefcase, 
  Send, Settings, Power
} from 'lucide-react';

// --- DEFAULTS ---
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

const App = () => {
  const [activeTab, setActiveTab] = useState('marketing'); // 'marketing' | 'hiring'

  return (
    <div style={{
      fontFamily: '"Inter", sans-serif',
      background: '#0f172a',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* HEADER / NAV */}
      <header style={{
        padding: '20px', 
        borderBottom: '1px solid #334155', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <div style={{fontSize: '20px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          H2AI Platform
        </div>
        <div style={{display: 'flex', gap: '10px', background: '#1e293b', padding: '5px', borderRadius: '12px'}}>
          <button 
            onClick={() => setActiveTab('marketing')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', gap: '8px', alignItems: 'center',
              background: activeTab === 'marketing' ? '#3b82f6' : 'transparent',
              color: activeTab === 'marketing' ? 'white' : '#94a3b8'
            }}
          >
            <MessageSquare size={16} /> Marketing Bot
          </button>
          <button 
             onClick={() => setActiveTab('hiring')}
             style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', gap: '8px', alignItems: 'center',
              background: activeTab === 'hiring' ? '#a855f7' : 'transparent',
              color: activeTab === 'hiring' ? 'white' : '#94a3b8'
            }}
          >
            <Briefcase size={16} /> AI Interviewer
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div style={{flex: 1, padding: '20px', maxWidth: '1200px', width: '100%', margin: '0 auto'}}>
        {activeTab === 'marketing' ? <MarketingDemo /> : <HiringDemo />}
      </div>
    </div>
  );
};

// --- DEMO 1: MARKETING (CHAT INTERFACE) ---
const MarketingDemo = () => {
  const [config, setConfig] = useState(MARKETING_DEFAULT);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const wsRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
        if(wsRef.current) wsRef.current.close();
    };
  }, []);

  const toggleChat = () => {
    if (isChatActive) {
        // Stop Chat
        if(wsRef.current) wsRef.current.close();
        setIsChatActive(false);
        setMessages(prev => [...prev, {role: 'system', text: 'Chat session ended.'}]);
    } else {
        // Start Chat
        const ws = new WebSocket('ws://localhost:8080/ws/voice');
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
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '600px'}}>
      {/* Configuration Panel */}
      <div style={{background: '#1e293b', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column'}}>
        <h3 style={{display:'flex', gap:'10px', alignItems:'center', color: '#60a5fa'}}><Settings size={18}/> Knowledge Base</h3>
        <textarea 
          value={config} 
          onChange={(e) => setConfig(e.target.value)}
          style={{flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '15px', borderRadius: '12px', resize: 'none', fontFamily: 'monospace'}}
        />
      </div>

      {/* Chat Interface */}
      <div style={{background: '#1e293b', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #334155'}}>
        <div style={{padding: '15px', borderBottom: '1px solid #334155', background: '#0f172a', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight: 'bold'}}>Live Website Chat</div>
            <div style={{fontSize: '12px', color: isChatActive ? '#4ade80' : '#ef4444'}}>
                ● {isChatActive ? 'Online' : 'Offline'}
            </div>
          </div>
          <button 
            onClick={toggleChat}
            style={{
                background: isChatActive ? '#ef4444' : '#22c55e',
                color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold'
            }}
          >
            <Power size={16}/> {isChatActive ? 'End Chat' : 'Start Chat'}
          </button>
        </div>
        
        <div style={{flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px'}}>
          {!isChatActive && messages.length === 0 && (
            <div style={{textAlign: 'center', color: '#64748b', marginTop: '100px'}}>Click "Start Chat" to begin</div>
          )}
          {messages.map((m, i) => (
             m.text && (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : m.role === 'system' ? 'center' : 'flex-start',
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: m.role === 'user' ? '#3b82f6' : m.role === 'system' ? 'transparent' : '#334155',
                color: m.role === 'system' ? '#94a3b8' : 'white',
                fontSize: m.role === 'system' ? '12px' : '14px',
                fontStyle: m.role === 'system' ? 'italic' : 'normal',
                lineHeight: '1.4'
              }}>
                {m.text}
              </div>
             )
          ))}
          {isTyping && <div style={{fontSize:'12px', color:'#94a3b8', marginLeft: '10px'}}>AI is thinking...</div>}
        </div>

        <div style={{padding: '15px', background: '#0f172a', display: 'flex', gap: '10px'}}>
          <input 
            value={input}
            disabled={!isChatActive}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={isChatActive ? "Type your message..." : "Chat ended"}
            style={{flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: '#1e293b', color: 'white', opacity: isChatActive ? 1 : 0.5}}
          />
          <button disabled={!isChatActive} onClick={sendMessage} style={{background: isChatActive ? '#3b82f6' : '#334155', border: 'none', borderRadius: '8px', width: '40px', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Send size={18} color="white"/>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- DEMO 2: HIRING (VOICE INTERFACE) ---
const HiringDemo = () => {
  const [config, setConfig] = useState(HIRING_DEFAULT);
  const [status, setStatus] = useState("Ready to Interview");
  const [isLive, setIsLive] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    return () => stopCall(); // Cleanup on unmount
  }, []);

  const startCall = () => {
    setIsLive(true);
    setStatus("Connecting...");
    
    const ws = new WebSocket('ws://localhost:8080/ws/voice');
    socketRef.current = ws;

    ws.onopen = () => {
      setStatus("Connected • Listening...");
      startRecognition();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.fullText) {
          // Received full complete sentence. Speak it.
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
    setStatus("Ready to Interview");
    if (socketRef.current) socketRef.current.close();
    if (recognitionRef.current) recognitionRef.current.stop();
    synthRef.current.cancel();
  };

  // --- TTS LOGIC (Simpler now) ---
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

  // --- STT LOGIC ---
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
      setStatus("Processing answer...");
      if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          text: transcript,
          config: config,
          mode: 'hiring' 
        }));
      }
    };

    recognition.onend = () => {
      // Only restart listening if AI is NOT speaking and call is still live
      if(isLive && !synthRef.current.speaking) {
          recognition.start();
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '600px'}}>
      {/* Configuration Panel */}
      <div style={{background: '#1e293b', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column'}}>
        <h3 style={{display:'flex', gap:'10px', alignItems:'center', color: '#a855f7'}}><Briefcase size={18}/> Job Requirements</h3>
        <textarea 
          value={config} 
          onChange={(e) => setConfig(e.target.value)}
          style={{flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', padding: '15px', borderRadius: '12px', resize: 'none', fontFamily: 'monospace'}}
        />
      </div>

      {/* Voice Interface */}
      <div style={{background: 'black', borderRadius: '30px', border: '4px solid #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: 30, color: '#94a3b8', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>{status}</div>
        
        {/* The Orb */}
        <div style={{
          width: '150px', height: '150px', borderRadius: '50%',
          background: aiSpeaking ? 'radial-gradient(circle, #a855f7 0%, transparent 70%)' : 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          boxShadow: aiSpeaking ? '0 0 50px rgba(168, 85, 247, 0.5)' : '0 0 30px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s',
          transform: aiSpeaking ? 'scale(1.2)' : 'scale(1)',
          animation: aiSpeaking ? 'pulse 1s infinite' : 'none'
        }}></div>

        <div style={{position: 'absolute', bottom: 40, display: 'flex', gap: '20px'}}>
          {!isLive ? (
            <button onClick={startCall} style={{width: '60px', height: '60px', borderRadius: '50%', background: '#22c55e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'}}>
              <Phone size={28} color="white"/>
            </button>
          ) : (
            <button onClick={stopCall} style={{width: '60px', height: '60px', borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'}}>
              <PhoneOff size={28} color="white"/>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;