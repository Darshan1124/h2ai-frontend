import React, { useState, useRef, useEffect } from 'react';
import { Mic, Phone, PhoneOff, Settings, MessageSquare, Globe, Smartphone, Activity, Cpu, AlertTriangle, BookOpen, TrendingDown, Zap, CheckCircle2, MousePointerClick, ArrowDown, Loader2 } from 'lucide-react';

// --- RESPONSIVE HOOK ---
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

const App = () => {
  const width = useWindowWidth();
  const isMobile = width < 768; // Breakpoint for mobile

  // --- STYLES & ANIMATIONS ---
  const styles = {
    container: {
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '15px' : '20px',
      overflowX: 'hidden', // Prevent horizontal scroll
    },
    heroSection: {
      textAlign: 'center',
      marginBottom: '20px', 
      maxWidth: '900px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    heroTitle: {
      fontSize: isMobile ? '26px' : '32px', 
      fontWeight: '800',
      margin: '10px 0 20px 0',
      background: 'linear-gradient(to right, #60a5fa, #a855f7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-1px',
      lineHeight: '1.2',
    },
    featureList: {
      display: 'grid',
      // Responsive Grid: 1 column on mobile, 2 on desktop
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
      gap: '12px 24px', 
      background: 'rgba(30, 41, 59, 0.3)',
      padding: '20px', 
      borderRadius: '16px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      marginBottom: '20px',
      width: '100%',
      maxWidth: '850px', 
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '14px',
      color: '#e2e8f0',
      textAlign: 'left',
    },
    highlight: {
      color: '#60a5fa',
      fontWeight: '600',
    },
    demoPrompt: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(34, 197, 94, 0.15)',
      border: '1px solid #22c55e',
      color: '#4ade80',
      padding: '8px 16px',
      borderRadius: '30px',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '20px',
      animation: 'bounce 2s infinite',
      cursor: 'pointer',
      boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)',
    },
    disclaimer: {
      background: 'rgba(234, 179, 8, 0.1)',
      border: '1px solid rgba(234, 179, 8, 0.2)',
      color: '#fef08a',
      padding: '10px 20px',
      borderRadius: '12px',
      fontSize: '12px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      lineHeight: '1.5',
      maxWidth: '800px',
      width: '100%',
      scrollMarginTop: '20px',
    },
    mainGrid: {
      display: 'grid',
      // Responsive Grid: Stack vertically on mobile
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '40px',
      maxWidth: '1000px',
      width: '100%',
      marginBottom: '10px',
    },
    card: {
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '24px',
      padding: '25px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      // On mobile, let the card take full width but order it second
      order: isMobile ? 2 : 1, 
    },
    inputArea: {
      background: '#0f172a',
      border: '1px solid #334155',
      color: '#94a3b8',
      borderRadius: '12px',
      padding: '15px',
      width: '100%',
      height: '180px',
      fontFamily: 'monospace',
      resize: 'none',
      marginBottom: '20px',
      fontSize: '13px',
      outline: 'none',
      transition: 'border 0.3s',
      lineHeight: '1.4',
    },
    trainBtn: {
      background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      border: 'none',
      padding: '12px',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'transform 0.1s',
    },
    phoneScreen: {
      background: '#000',
      borderRadius: '35px',
      border: '4px solid #334155',
      height: isMobile ? '500px' : '600px', // Shorter on mobile
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      // On mobile, show phone first
      order: isMobile ? 1 : 2,
    },
    phoneHeader: {
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)',
      zIndex: 2,
    },
    waveformBox: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    orb: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0) 70%)',
      boxShadow: '0 0 40px rgba(59,130,246,0.4)',
      transition: 'all 0.3s ease',
    },
    chatOverlay: {
      position: 'absolute',
      bottom: '100px',
      left: '0',
      right: '0',
      padding: '20px',
      maxHeight: '220px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maskImage: 'linear-gradient(to top, black 80%, transparent 100%)',
    },
    chatBubble: {
      padding: '10px 14px',
      borderRadius: '16px',
      fontSize: '13px',
      maxWidth: '85%',
      animation: 'slideUp 0.3s ease-out',
    },
    controls: {
      height: '90px',
      background: 'rgba(20, 20, 20, 0.9)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 30px',
    },
    controlBtn: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'white',
      transition: 'transform 0.2s',
    },
    callBtnPulse: {
      animation: 'ring 1.5s infinite',
    },
    valueGrid: {
      display: 'grid',
      // Responsive Grid: 1 column on mobile, 3 on desktop
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '15px',
      marginTop: '40px', 
      marginBottom: '20px',
      width: '100%',
      maxWidth: '900px',
    },
    valueCard: {
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      borderRadius: '16px',
      padding: '20px', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: '8px',
    },
    visionSection: {
      maxWidth: '900px',
      width: '100%',
      marginTop: '20px',
      textAlign: 'center',
      paddingTop: '20px',
      borderTop: '1px solid rgba(148, 163, 184, 0.1)',
    },
    visionGrid: {
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '15px' : '30px',
      marginTop: '20px',
      flexWrap: 'wrap',
    },
    visionItem: {
      background: 'rgba(30, 41, 59, 0.4)',
      padding: '12px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#94a3b8',
      fontSize: '13px',
      width: isMobile ? '100%' : 'auto', // Full width buttons on mobile
      justifyContent: isMobile ? 'center' : 'flex-start',
    },
  };

  const DEFAULT_CONFIG = 
`ROLE: Senior Customer Success & Sales Agent for 'TechFix'.
OBJECTIVE: Resolve issues efficiently AND promote our new "Gold Shield" protection plan.

KNOWLEDGE BASE:
- Laptop Repair: $50
- Mobile Repair: $30
- Current offer: "Gold Shield" (Yearly free repairs for $99/year).

INSTRUCTIONS:
1. Be polite and professional.
2. If customer asks question for above services then only give answer otherwise polietly say no.
3. Use persuasion techniques from standard sales psychology books.`;

  const [companyConfig, setCompanyConfig] = useState(DEFAULT_CONFIG);
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [conversation, setConversation] = useState([]);
  const [statusMsg, setStatusMsg] = useState("Ready to Connect");
  const [interimText, setInterimText] = useState(""); 
  const [isTraining, setIsTraining] = useState(false); 

  const isCallActiveRef = useRef(false); 
  const socketRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);
  const textBufferRef = useRef(""); 
  const aiSpeakingRef = useRef(false);
  const intentionalStopRef = useRef(false);

  const demoRef = useRef(null);
  const WEBSOCKET_URL = 'wss://h2ai-backend.onrender.com/ws/voice'; 

  useEffect(() => {
    const loadVoices = () => { synthRef.current.getVoices(); };
    synthRef.current.onvoiceschanged = loadVoices;
    loadVoices();

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.7; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes ring {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      terminateCall();
    };
  }, []);

  const handleStartCallClick = () => {
      if (isConnecting || isCallActive) return;

      setIsConnecting(true);
      setStatusMsg("Establishing Connection...");

      const ws = new WebSocket(WEBSOCKET_URL);
      socketRef.current = ws;

      ws.onopen = () => {
          setIsConnecting(false);
          setIsConnected(true);
          startCallLogic(); 
      };

      ws.onclose = () => {
          setIsConnected(false);
          setIsCallActive(false);
          isCallActiveRef.current = false;
          setStatusMsg("Connection Closed");
          stopAudioSubsystems();
      };

      ws.onerror = () => {
          setIsConnecting(false);
          setStatusMsg("Connection Error");
          alert("Could not connect to H2AI Server. Is the backend running?");
      };

      ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.chunk) {
              if (data.chunk === "[END]") speakBufferedText(true);
              else handleStreamChunk(data.chunk);
          }
      };
  };

  const terminateCall = () => {
      intentionalStopRef.current = true;
      setStatusMsg("Disconnecting...");
      stopAudioSubsystems();
      if (socketRef.current) {
          socketRef.current.close();
      }
      setIsCallActive(false);
      isCallActiveRef.current = false;
      setIsConnected(false);
      setStatusMsg("Ready to Connect");
      setInterimText("");
      textBufferRef.current = "";
  };

  const stopAudioSubsystems = () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      synthRef.current.cancel();
      aiSpeakingRef.current = false;
  };

  const startCallLogic = () => {
    isCallActiveRef.current = true;
    setIsCallActive(true);
    setStatusMsg("Connected • Listening...");
    intentionalStopRef.current = false;
    aiSpeakingRef.current = false;
    textBufferRef.current = "";
    setInterimText("");
    startRecognition();
  };

  const handleStreamChunk = (chunk) => {
    textBufferRef.current += chunk;
    setConversation(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'ai') {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].text += chunk;
            return newHistory;
        } else {
            return [...prev, { role: 'ai', text: chunk }];
        }
    });

    if (/[.?!]/.test(textBufferRef.current) || textBufferRef.current.length > 30) {
        speakBufferedText();
    }
  };

  const speakBufferedText = (flushAll = false) => {
    if (!isCallActiveRef.current) return;
    let text = textBufferRef.current;
    if (!text.trim()) return;

    if (!flushAll) {
        const match = text.match(/[.?!]/); 
        if (match) {
            const index = match.index + 1;
            const sentence = text.substring(0, index);
            text = sentence;
            textBufferRef.current = textBufferRef.current.substring(index);
        } else { return; }
    } else {
        textBufferRef.current = "";
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    utterance.voice = voices.find(v => v.name.includes("Google US English")) || voices[0];
    utterance.rate = 1.1; 
    utterance.onstart = () => { 
        aiSpeakingRef.current = true;
        setStatusMsg("Agent Speaking...");
        if (recognitionRef.current) recognitionRef.current.abort(); 
    };
    utterance.onend = () => { 
        aiSpeakingRef.current = false; 
        setStatusMsg("Listening...");
        if (isCallActiveRef.current && !intentionalStopRef.current) startRecognition();
    };
    utterance.onerror = () => { 
        aiSpeakingRef.current = false;
        if (isCallActiveRef.current) startRecognition();
    };
    synthRef.current.speak(utterance);
  };

  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) return;
    if (aiSpeakingRef.current) return; 
    if (recognitionRef.current) recognitionRef.current.abort();

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false; 
    recognition.interimResults = true; 
    
    recognitionRef.current = recognition;
    recognition.onstart = () => { setStatusMsg("Listening..."); };

    recognition.onresult = (event) => {
        if (aiSpeakingRef.current) return; 
        const results = event.results;
        const latestResult = results[results.length - 1];
        const transcript = latestResult[0].transcript;
        const isFinal = latestResult.isFinal;

        if (!isFinal) {
            setInterimText(transcript);
        } else {
            setInterimText(""); 
            setConversation(prev => [...prev, { role: 'user', text: transcript }]);
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({ text: transcript, config: companyConfig }));
            }
        }
    };

    recognition.onend = () => {
        if (isCallActiveRef.current && !intentionalStopRef.current && !aiSpeakingRef.current) {
            setTimeout(() => { 
                if(!aiSpeakingRef.current) try { recognition.start(); } catch (e) {} 
            }, 50); 
        } else {
            setInterimText(""); 
        }
    };

    try { recognition.start(); } catch(e) {}
  };

  const handleTrain = () => {
    setIsTraining(true);
    setTimeout(() => setIsTraining(false), 1500); 
  };

  const scrollToDemo = () => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      
      {/* 1. HERO SECTION */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>
          H2AI <span style={{fontSize: isMobile ? '14px' : '16px', color:'#94a3b8', fontWeight:'400', display: 'block', marginTop: '5px'}}>Autonomous Revenue Engine</span>
        </h1>
        
        {/* --- GRID LAYOUT FOR FEATURES (Responsive) --- */}
        <div style={styles.featureList}>
            <div style={styles.featureItem}>
                <CheckCircle2 size={16} color="#4ade80" style={{flexShrink: 0}} />
                <span><span style={styles.highlight}>Unified Brain:</span> Resolves Queries & runs Ads.</span>
            </div>
            <div style={styles.featureItem}>
                <CheckCircle2 size={16} color="#4ade80" style={{flexShrink: 0}} />
                <span><span style={styles.highlight}>Cost Killer:</span> Eliminates expensive call centers.</span>
            </div>
            <div style={styles.featureItem}>
                <CheckCircle2 size={16} color="#4ade80" style={{flexShrink: 0}} />
                <span><span style={styles.highlight}>MBA-Level Sales:</span> Trained on 10k+ business books.</span>
            </div>
            <div style={styles.featureItem}>
                <CheckCircle2 size={16} color="#4ade80" style={{flexShrink: 0}} />
                <span><span style={styles.highlight}>Omnichannel:</span> Voice, WhatsApp, Instagram & Web.</span>
            </div>
            {/* The 5th item spans full width */}
            <div style={{...styles.featureItem, gridColumn: '1 / -1', justifyContent: 'center', marginTop: '5px'}}>
                <MousePointerClick size={16} color="#facc15" style={{flexShrink: 0}} />
                <span style={{color: '#fef08a'}}>Launch ad campaigns with <strong>one click</strong>.</span>
            </div>
        </div>
      </div>

      {/* 2. DEMO PROMPT */}
      <div style={styles.demoPrompt} onClick={scrollToDemo}>
         <ArrowDown size={18} />
         <span>Try Live Demo</span>
      </div>

      {/* 3. DISCLAIMER - SCROLL TARGET */}
      <div style={styles.disclaimer} ref={demoRef}>
        <AlertTriangle size={24} style={{flexShrink: 0}} />
        <span>
            <strong>Beta Demo Notice:</strong> This is an early functional prototype.<br/>
            The final product will feature ultra-low latency (500ms), hyper-realistic human voices, and seamless interruptions.
        </span>
      </div>

      {/* 4. MAIN DEMO GRID (Responsive) */}
      <div style={styles.mainGrid}>
        
        {/* LEFT COLUMN: THE "BRAIN" (Order 2 on Mobile) */}
        <div style={styles.card}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
                <div style={{background:'#3b82f6', padding:'8px', borderRadius:'8px'}}><Settings size={20} color="white"/></div>
                <div>
                    <h3 style={{margin:0, color: 'white'}}>Agent Knowledge Base</h3>
                    <span style={{fontSize:'12px', color:'#94a3b8'}}>Source: Uploaded Docs + Marketing Library</span>
                </div>
            </div>
            
            <p style={{color:'#94a3b8', fontSize:'13px', lineHeight:'1.5', marginTop:0}}>
                Define the agent's role. It is pre-programmed to <strong>upsell</strong> using psychological triggers.
            </p>

            <textarea 
                style={{
                    ...styles.inputArea,
                    borderColor: isTraining ? '#3b82f6' : '#334155',
                    boxShadow: isTraining ? '0 0 15px rgba(59,130,246,0.3)' : 'none'
                }}
                value={companyConfig}
                onChange={(e) => setCompanyConfig(e.target.value)}
            />

            <button 
                onClick={handleTrain}
                style={styles.trainBtn}
                disabled={isTraining}
            >
                {isTraining ? (
                    <>Optimizing Neural Weights <Activity size={16} className="spin"/></>
                ) : (
                    <>Train Agent <Cpu size={16}/></>
                )}
            </button>

            <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #334155'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    {isConnected ? (
                        <span style={{fontSize: '14px', color: '#4ade80', display:'flex', alignItems:'center', gap: '6px'}}>
                            <div style={{width:'8px', height:'8px', borderRadius:'50%', background: '#4ade80'}}></div>
                            System Active
                        </span>
                    ) : (
                        <span style={{fontSize: '14px', color: '#64748b', display:'flex', alignItems:'center', gap: '6px'}}>
                            <div style={{width:'8px', height:'8px', borderRadius:'50%', background: '#64748b'}}></div>
                            System Standby
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: THE "PHONE" (Order 1 on Mobile) */}
        <div style={styles.phoneScreen}>
            {/* Phone Status Bar */}
            <div style={styles.phoneHeader}>
                <span style={{color: '#94a3b8', fontSize: '12px'}}>H2AI Secure Line • 5G</span>
                <h4 style={{margin: '10px 0 0 0', color: 'white', fontWeight: '500'}}>
                    {isCallActive ? "H2AI Support Agent" : "Ready to Connect"}
                </h4>
                <p style={{margin: '5px 0 0 0', color: '#64748b', fontSize: '12px'}}>{statusMsg}</p>
            </div>

            {/* Visualizer */}
            <div style={styles.waveformBox}>
                {!isCallActive ? (
                    <div style={{color: '#475569', textAlign: 'center'}}>
                        <Smartphone size={48} style={{opacity: 0.5, marginBottom: '10px'}}/>
                        <p>{isConnecting ? "Establishing Link..." : "Tap Green Button to Start"}</p>
                    </div>
                ) : (
                    <div style={{
                        ...styles.orb,
                        animation: aiSpeakingRef.current ? 'pulse 1s infinite' : 'none',
                        transform: aiSpeakingRef.current ? 'scale(1.2)' : 'scale(1)',
                        background: aiSpeakingRef.current 
                            ? 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0) 70%)' // Purple when speaking
                            : 'radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(59,130,246,0) 70%)' // Blue when listening
                    }}></div>
                )}
            </div>

            {/* Live Chat Overlay */}
            <div style={styles.chatOverlay}>
                {conversation.slice(-3).map((msg, i) => (
                    <div key={i} style={{
                        ...styles.chatBubble,
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.role === 'user' ? '#2563eb' : 'rgba(255,255,255,0.1)',
                        color: 'white',
                    }}>
                        {msg.text}
                    </div>
                ))}
                {interimText && (
                    <div style={{...styles.chatBubble, alignSelf: 'flex-end', background: 'transparent', border:'1px dashed #475569', color: '#94a3b8'}}>
                        {interimText}...
                    </div>
                )}
            </div>

            {/* Phone Controls - SINGLE BUTTON FLOW */}
            <div style={styles.controls}>
                 {!isCallActive ? (
                     <button 
                        onClick={handleStartCallClick} 
                        style={{
                            ...styles.controlBtn, 
                            background: '#22c55e', 
                            width: '60px', 
                            height: '60px',
                            ...styles.callBtnPulse 
                        }}
                        disabled={isConnecting}
                     >
                        {isConnecting ? (
                            <Loader2 size={24} className="spin" style={{animation: 'spin 1s linear infinite'}} />
                        ) : (
                            <Phone size={24} fill="white" />
                        )}
                     </button>
                 ) : (
                     <>
                        <button style={{...styles.controlBtn, background: 'rgba(255,255,255,0.1)'}}>
                             <Mic size={20} />
                        </button>
                        <button onClick={terminateCall} style={{...styles.controlBtn, background: '#ef4444', width: '60px', height: '60px'}}>
                             <PhoneOff size={24} fill="white" />
                        </button>
                        <button style={{...styles.controlBtn, background: 'rgba(255,255,255,0.1)'}}>
                             <Activity size={20} />
                        </button>
                     </>
                 )}
            </div>
        </div>
      </div>

      {/* 5. VALUE PROPS (Responsive) */}
      <div style={styles.valueGrid}>
        <div style={styles.valueCard}>
            <TrendingDown size={28} color="#4ade80" />
            <h4 style={{margin:'10px 0 5px 0', color: 'white', fontSize:'16px'}}>Zero Overhead</h4>
            <span style={{fontSize:'12px', color:'#94a3b8'}}>Infinite scale without hiring.</span>
        </div>
        <div style={styles.valueCard}>
            <Zap size={28} color="#facc15" />
            <h4 style={{margin:'10px 0 5px 0', color: 'white', fontSize:'16px'}}>Sales + Support</h4>
            <span style={{fontSize:'12px', color:'#94a3b8'}}>The 2-in-1 Revenue Engine.</span>
        </div>
        <div style={styles.valueCard}>
            <BookOpen size={28} color="#60a5fa" />
            <h4 style={{margin:'10px 0 5px 0', color: 'white', fontSize:'16px'}}>Expertly Trained</h4>
            <span style={{fontSize:'12px', color:'#94a3b8'}}>Knowledge from top business books.</span>
        </div>
      </div>

      {/* 6. VISION FOOTER */}
      <div style={styles.visionSection}>
        <h3 style={{color: '#fff', fontSize: '18px', fontWeight: '400'}}>Ecosystem Expansion</h3>
        <p style={{color: '#64748b', fontSize: '14px', marginBottom: '20px'}}>
            Voice is just the beginning. H2AI natively integrates into your existing platforms.
        </p>
        
        <div style={styles.visionGrid}>
            <div style={styles.visionItem}>
                <MessageSquare size={18} color="#22c55e"/> 
                <span>WhatsApp Automation</span>
            </div>
            <div style={styles.visionItem}>
                <MessageSquare size={18} color="#e1306c"/> 
                <span>Instagram DM Sales</span>
            </div>
            <div style={styles.visionItem}>
                <Globe size={18} color="#a855f7"/> 
                <span>Web Chat Widget</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;