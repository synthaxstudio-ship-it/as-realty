import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Send,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  MessageSquare,
  Radio,
  Calendar,
  Building,
  MapPin,
  ShieldCheck,
  Info,
  RefreshCw,
  CornerDownLeft,
} from 'lucide-react';
import { Property } from '../types';
import { COMPANY_DETAILS } from '../data/properties';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

interface AIPersonalAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProperty?: Property | null;
  initialMode?: 'voice' | 'text';
  onOpenBooking: (propertyName?: string) => void;
}

export const AIPersonalAssistantModal: React.FC<AIPersonalAssistantModalProps> = ({
  isOpen,
  onClose,
  selectedProperty,
  initialMode = 'voice',
  onOpenBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'chat'>(initialMode);
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [isConnectingVoice, setIsConnectingVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('Tap karke Amit Sir ke PA se live call connect karein');
  const [userVolume, setUserVolume] = useState<number>(0);
  const [aiVolume, setAiVolume] = useState<number>(0);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Text chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Namaste! Main Aryan hoon, Amit Shivpeth (Amit Sir) ka Executive Personal Assistant at AS Realty Nagpur.\n\nAapko Nagpur ke premier luxury residences (jaise Mittal Atlantis, Orchid Gokul), Besa aur Wardha Road ke NMRDA sanctioned plots, ya Pench farmhouse estates ke baare mein jaankari chahiye? Main Amit Sir ke saath aapka private VIP site visit bhi schedule kar sakta hoon.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSubmittingText, setIsSubmittingText] = useState(false);
  const [voiceQuickInput, setVoiceQuickInput] = useState('');

  // Refs
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const aiVolumeIntervalRef = useRef<any>(null);
  const isVoiceConnectedRef = useRef(false);
  const isMutedRef = useRef(false);

  isVoiceConnectedRef.current = isVoiceConnected;
  isMutedRef.current = isMuted;

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Handle selected property context on open
  useEffect(() => {
    if (selectedProperty && isOpen) {
      const propNotice = `Aap "${selectedProperty.name || selectedProperty.title}" (${selectedProperty.location}, ${selectedProperty.bhk}, ${selectedProperty.price}) dekh rahe hain. Mere paas iska complete architectural layout, MahaRERA clearance aur floor plans ready hain. Kya aapko pricing breakdown chahiye ya Amit Sir ke saath private VIP site visit coordinate kar doon?`;
      setMessages((prev) => {
        if (prev.some((m) => m.content.includes(selectedProperty.name))) return prev;
        return [
          ...prev,
          {
            id: `property-${selectedProperty.id}-${Date.now()}`,
            role: 'assistant',
            content: propNotice,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      });
    }
  }, [selectedProperty, isOpen]);

  // Clean up on modal close
  useEffect(() => {
    if (!isOpen) {
      stopVoiceSession();
    }
  }, [isOpen]);

  // Helper: Core HTTP Streaming via fetch + ReadableStream chunk-by-chunk
  const streamChatQuery = async (
    query: string,
    historyList: Message[],
    onChunk: (chunk: string, accumulated: string) => void
  ): Promise<string> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        history: historyList.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        propertyContext: selectedProperty
          ? `${selectedProperty.name} in ${selectedProperty.location}, ${selectedProperty.bhk}, ${selectedProperty.price}`
          : undefined,
      }),
    });

    if (!response.ok) {
      let errMsg = 'Failed to connect to Amit Sir’s PA.';
      try {
        const errJson = await response.json();
        if (errJson?.error) errMsg = errJson.error;
      } catch (e) {
        const errTxt = await response.text().catch(() => '');
        if (errTxt) errMsg = errTxt;
      }
      throw new Error(errMsg);
    }

    if (!response.body) {
      const text = await response.text();
      onChunk(text, text);
      return text;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullAccumulated = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      fullAccumulated += chunk;
      onChunk(chunk, fullAccumulated);
    }

    fullAccumulated += decoder.decode();
    return fullAccumulated;
  };

  // Helper: Synthesize speech for voice mode
  const speakVoiceText = (text: string, onComplete?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown bold or bullet symbols for natural spoken cadence
    const cleanedText = text
      .replace(/[*#_~`]/g, '')
      .replace(/\n+/g, '. ')
      .replace(/₹/g, 'Rupees ')
      .trim();

    if (!cleanedText) {
      if (onComplete) onComplete();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best Hindi / Indian English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang === 'hi-IN' || v.name.includes('Hindi')) ||
      voices.find((v) => v.lang === 'en-IN' || v.name.includes('India')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    setIsAiSpeaking(true);

    // Simulate animated waveform bars for AI speech
    if (aiVolumeIntervalRef.current) clearInterval(aiVolumeIntervalRef.current);
    aiVolumeIntervalRef.current = setInterval(() => {
      setAiVolume(0.3 + Math.random() * 0.65);
    }, 120);

    utterance.onend = () => {
      setIsAiSpeaking(false);
      setAiVolume(0);
      if (aiVolumeIntervalRef.current) clearInterval(aiVolumeIntervalRef.current);
      if (onComplete) onComplete();
      if (isVoiceConnectedRef.current) {
        startListening();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis ended with event:', e);
      setIsAiSpeaking(false);
      setAiVolume(0);
      if (aiVolumeIntervalRef.current) clearInterval(aiVolumeIntervalRef.current);
      if (onComplete) onComplete();
      if (isVoiceConnectedRef.current) {
        startListening();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Helper: Stop Speech recognition and voice session
  const stopVoiceSession = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (aiVolumeIntervalRef.current) {
      clearInterval(aiVolumeIntervalRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsVoiceConnected(false);
    setIsConnectingVoice(false);
    setIsAiSpeaking(false);
    setIsUserSpeaking(false);
    setUserVolume(0);
    setAiVolume(0);
    setVoiceStatus('Call ended • Tap karke dubara connect karein');
  };

  // Helper: Start browser speech recognition
  const startListening = () => {
    if (!isVoiceConnectedRef.current || isMutedRef.current) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus('Aap bol sakte hain ya neeche question tap karein');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'hi-IN'; // Accepts Hinglish / Hindi & Indian English
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsUserSpeaking(true);
        setUserVolume(0.4);
        setVoiceStatus('Sun rahe hain... Aap boliye');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        const currentText = final || interim;
        if (currentText) {
          setVoiceTranscript(`Aap: "${currentText}"`);
          setUserVolume(0.7 + Math.random() * 0.3);
        }

        if (final.trim()) {
          handleVoiceUserQuery(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsUserSpeaking(false);
        setUserVolume(0);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission blocked. Please enable microphone or use the tap prompts.');
        } else if (isVoiceConnectedRef.current && !isAiSpeaking) {
          setVoiceStatus('Aap bol sakte hain ya neeche question tap karein');
        }
      };

      recognition.onend = () => {
        setIsUserSpeaking(false);
        setUserVolume(0);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start error:', err);
      setVoiceStatus('Aap bol sakte hain ya neeche question tap karein');
    }
  };

  // Helper: Process user spoken query in Voice Mode using HTTP streaming
  const handleVoiceUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }

    setIsUserSpeaking(false);
    setUserVolume(0);
    setVoiceStatus('Aryan soch rahe hain...');
    setVoiceTranscript(`Aap: "${queryText}"`);

    // Add to chat history
    const userMsg: Message = {
      id: `user-voice-${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice: true,
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      let streamedResponse = '';
      setVoiceStatus('Aryan bol rahe hain...');

      await streamChatQuery(queryText, messages, (_chunk, accumulated) => {
        streamedResponse = accumulated;
        setVoiceTranscript(`Aryan: "${accumulated.slice(0, 180)}..."`);
      });

      // Add assistant response to history
      const assistantMsg: Message = {
        id: `assistant-voice-${Date.now()}`,
        role: 'assistant',
        content: streamedResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVoice: true,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Speak response aloud
      speakVoiceText(streamedResponse);
    } catch (err: any) {
      console.error('Voice stream error:', err);
      const fallback = 'I apologize. For immediate assistance with Amit Sir’s portfolio, please WhatsApp Amit Sir directly.';
      setVoiceTranscript(`Aryan: "${fallback}"`);
      speakVoiceText(fallback);
    }
  };

  // Helper: Start Live Voice Call (HTTP streaming & Web Audio)
  const startVoiceSession = () => {
    setVoiceError(null);
    setIsConnectingVoice(true);
    setVoiceStatus('Connecting to Amit Sir’s Executive PA...');

    setTimeout(() => {
      setIsVoiceConnected(true);
      setIsConnectingVoice(false);
      setVoiceStatus('Live Call Connected • Aryan Bol Rahe Hain');

      // Aryan's initial welcome greeting
      const welcomeSpeech = selectedProperty
        ? `Namaste! Main Aryan hoon, Amit Sir ka Executive PA. Aap ${selectedProperty.name} dekh rahe hain. Iska pricing breakdown chahiye ya Amit Sir ke saath private VIP site visit coordinate kar doon?`
        : 'Namaste! Main Aryan hoon, Amit Sir ka Executive Personal Assistant at AS Realty Nagpur. Aapko luxury penthouses, Besa NMRDA plots ya farmhouse land ke baare mein kya jaankari chahiye?';

      setVoiceTranscript(`Aryan: "${welcomeSpeech}"`);
      speakVoiceText(welcomeSpeech);
    }, 400);
  };

  // Send Text Query in Chat Tab using HTTP Streaming chunk-by-chunk
  const handleSendTextMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isSubmittingText) return;

    setInputMessage('');
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const assistantMsgId = `assistant-${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsSubmittingText(true);

    try {
      await streamChatQuery(query, messages, (_chunk, accumulated) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: accumulated } : msg
          )
        );
      });
    } catch (err: any) {
      console.error('Chat stream error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  err?.message ||
                  "I apologize for the delay. I am checking Amit Sir's private registry. For immediate priority service, please message Amit Sir directly on WhatsApp at +91 87883 75434.",
              }
            : msg
        )
      );
    } finally {
      setIsSubmittingText(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#001730]/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="ai-assistant-modal-panel"
        className="relative w-full max-w-2xl bg-white border border-slate-200 border-b-4 border-b-[#002347] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-800"
      >
        {/* Top Gold & Navy Header */}
        <div className="bg-gradient-to-r from-[#002347] via-[#001D3D] to-[#002347] p-4 sm:p-5 text-white border-b border-[#C5A059]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Executive Avatar Badge */}
              <div className="relative">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#001730] to-[#002B55] border-2 border-[#C5A059] flex items-center justify-center shadow-lg text-[#E6C687] font-serif-luxury font-bold text-lg">
                  AS
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#002347] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-white tracking-wide">
                    Aryan | Executive PA to Amit Sir
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#E6C687] border border-[#C5A059]/40 uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5 text-[#E6C687]" />
                    Nagpur Property Expert
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3 h-3 text-[#C5A059]" />
                  <span>AS Realty Private Client Office</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-400 font-medium">Direct Line to Amit Shivpeth</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 bg-[#001730]/70 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('voice')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'voice'
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#E6C687] text-[#002347] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${activeTab === 'voice' ? 'text-[#002347]' : 'text-[#C5A059]'}`} />
                <span>Live Voice Call</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/25 text-white font-mono uppercase">
                  AI Voice
                </span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#E6C687] text-[#002347] shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <MessageSquare className={`w-3.5 h-3.5 ${activeTab === 'chat' ? 'text-[#002347]' : 'text-[#C5A059]'}`} />
                <span>Text Advisory (Streaming)</span>
              </button>
            </div>

            {selectedProperty && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#E6C687] bg-black/30 px-3 py-1.5 rounded-lg border border-[#C5A059]/30 truncate max-w-[220px]">
                <MapPin className="w-3 h-3 shrink-0 text-[#C5A059]" />
                <span className="truncate">{selectedProperty.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body: Voice Call View */}
        {activeTab === 'voice' && (
          <div className="flex-1 flex flex-col items-center justify-between p-5 sm:p-7 bg-gradient-to-b from-slate-50 to-[#F8F9FA] overflow-y-auto">
            {/* Status Header */}
            <div className="text-center max-w-md">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#002347]/5 text-[#002347] border border-[#002347]/10 mb-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAiSpeaking
                      ? 'bg-[#C5A059] animate-ping'
                      : isVoiceConnected
                      ? 'bg-emerald-500 animate-pulse'
                      : isConnectingVoice
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-[#C5A059]'
                  }`}
                />
                <span>{voiceStatus}</span>
              </div>

              <h4 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#002347]">
                Amit Sir ke PA se Live Voice Call
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Powered by Gemini 3.8 Flash HTTP Streaming. Center orb par <strong className="text-[#002347]">Tap karein</strong> aur directly Hinglish mein Nagpur properties, plots, ya VIP site visit ke baare mein baat karein.
              </p>
            </div>

            {/* Central Animated Audio Frequency Visualizer */}
            <div className="my-6 flex flex-col items-center justify-center w-full">
              <div className="relative flex items-center justify-center">
                {/* Reactive Glow Rings */}
                <div
                  className="absolute rounded-full transition-all duration-150"
                  style={{
                    width: `${160 + (isAiSpeaking ? aiVolume * 85 : userVolume * 65)}px`,
                    height: `${160 + (isAiSpeaking ? aiVolume * 85 : userVolume * 65)}px`,
                    backgroundColor: isAiSpeaking
                      ? 'rgba(197, 160, 89, 0.25)'
                      : isVoiceConnected
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(197, 160, 89, 0.12)',
                  }}
                />

                <div
                  className="absolute rounded-full transition-all duration-150"
                  style={{
                    width: `${130 + (isAiSpeaking ? aiVolume * 45 : userVolume * 35)}px`,
                    height: `${130 + (isAiSpeaking ? aiVolume * 45 : userVolume * 35)}px`,
                    backgroundColor: isAiSpeaking
                      ? 'rgba(197, 160, 89, 0.4)'
                      : isVoiceConnected
                      ? 'rgba(16, 185, 129, 0.35)'
                      : 'rgba(197, 160, 89, 0.2)',
                  }}
                />

                {/* Center Orb - Interactive Tap to Call / Speak Button */}
                <button
                  type="button"
                  id="voice-call-center-orb-button"
                  onClick={() => {
                    if (!isVoiceConnected) {
                      startVoiceSession();
                    } else if (isAiSpeaking) {
                      // Interrupt Aryan and listen immediately
                      window.speechSynthesis.cancel();
                      setIsAiSpeaking(false);
                      setAiVolume(0);
                      startListening();
                    } else {
                      startListening();
                    }
                  }}
                  disabled={isConnectingVoice}
                  title={
                    !isVoiceConnected
                      ? 'Tap karein Amit Sir ke PA se call start karne ke liye'
                      : isAiSpeaking
                      ? 'Tap to interrupt Aryan'
                      : 'Tap to speak'
                  }
                  className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 shadow-2xl flex flex-col items-center justify-center transition-all duration-300 relative z-10 select-none cursor-pointer ${
                    isAiSpeaking
                      ? 'bg-gradient-to-br from-[#C5A059] to-[#9E7D3B] border-[#E6C687] text-white scale-105 shadow-[#C5A059]/40'
                      : isVoiceConnected
                      ? 'bg-gradient-to-br from-[#002347] to-[#001730] border-[#C5A059] text-[#E6C687]'
                      : isConnectingVoice
                      ? 'bg-gradient-to-br from-[#002347] to-[#001D3D] border-amber-400 text-amber-300 animate-pulse'
                      : 'bg-gradient-to-br from-[#002347] via-[#001D3D] to-[#002347] border-[#E6C687] text-white hover:scale-105 active:scale-95 shadow-xl shadow-[#C5A059]/30 hover:border-[#C5A059] ring-4 ring-[#C5A059]/25 group'
                  }`}
                >
                  {isAiSpeaking ? (
                    <>
                      <Volume2 className="w-9 h-9 animate-bounce text-white" />
                      <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-white">Aryan Bol Rahe Hain</span>
                      <span className="text-[9px] text-amber-200">Tap to Interrupt</span>
                    </>
                  ) : isVoiceConnected ? (
                    <>
                      <Mic className={`w-9 h-9 ${isUserSpeaking ? 'animate-bounce text-emerald-400' : 'text-[#E6C687]'}`} />
                      <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-slate-200">
                        {isMuted ? 'Muted' : isUserSpeaking ? 'Sun Rahe Hain...' : 'Aap Boliye'}
                      </span>
                      <span className="text-[9px] text-[#C5A059]">Tap to Speak</span>
                    </>
                  ) : isConnectingVoice ? (
                    <>
                      <RefreshCw className="w-8 h-8 animate-spin text-[#E6C687]" />
                      <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-[#E6C687]">
                        Connecting...
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="relative flex items-center justify-center">
                        <PhoneCall className="w-9 h-9 text-[#E6C687] group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                      </div>
                      <span className="text-xs uppercase font-extrabold tracking-wider mt-1.5 text-white group-hover:text-[#E6C687] transition-colors">
                        Tap to Call
                      </span>
                      <span className="text-[10px] font-medium text-[#E6C687] tracking-tight">
                        Baat Shuru Karein
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Dynamic Waveform Bars */}
              <div className="flex items-center gap-1.5 mt-6 h-8">
                {[35, 60, 80, 95, 70, 50, 80, 100, 60, 45, 85, 70].map((height, i) => {
                  const activeScale = isAiSpeaking
                    ? Math.max(0.2, aiVolume * (height / 50))
                    : isVoiceConnected && isUserSpeaking
                    ? Math.max(0.2, userVolume * (height / 50))
                    : 0.15;
                  return (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-100 ${
                        isAiSpeaking
                          ? 'bg-[#C5A059]'
                          : isVoiceConnected
                          ? 'bg-[#002347]'
                          : 'bg-slate-300'
                      }`}
                      style={{
                        height: `${Math.max(6, height * activeScale)}px`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Real-time speech transcript box */}
              {voiceTranscript && (
                <div className="mt-4 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md w-full text-center">
                  <p className="text-xs text-slate-700 italic line-clamp-3">{voiceTranscript}</p>
                </div>
              )}

              {/* One-tap voice prompt chips while on call */}
              {isVoiceConnected && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 max-w-md">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Bolne ke liye tap karein:</span>
                  {[
                    'Dharampeth Penthouses',
                    'Besa NMRDA Plots',
                    'Amit Sir VIP Visit',
                    'Pench Farmhouse',
                  ].map((quickQ) => (
                    <button
                      key={quickQ}
                      onClick={() => handleVoiceUserQuery(quickQ)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#002347] hover:text-white text-slate-700 border border-slate-200 transition-all cursor-pointer"
                    >
                      {quickQ}
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Text Input Fallback if microphone not supported */}
              {isVoiceConnected && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (voiceQuickInput.trim()) {
                      handleVoiceUserQuery(voiceQuickInput);
                      setVoiceQuickInput('');
                    }
                  }}
                  className="mt-3 flex items-center gap-1.5 w-full max-w-md"
                >
                  <input
                    type="text"
                    value={voiceQuickInput}
                    onChange={(e) => setVoiceQuickInput(e.target.value)}
                    placeholder="Ya yahan Hinglish mein type karke Aryan se poochhein..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#002347] text-[#E6C687] hover:bg-[#001730] transition-colors cursor-pointer"
                    title="Speak this question"
                  >
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Error Notice */}
              {voiceError && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2 max-w-md">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <p>{voiceError}</p>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="mt-1 font-bold text-[#002347] underline cursor-pointer"
                    >
                      Switch to Text Chat Advisory
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Control Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-200">
              {!isVoiceConnected ? (
                <button
                  id="voice-call-start-button"
                  onClick={startVoiceSession}
                  disabled={isConnectingVoice}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm tracking-wider uppercase shadow-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {isConnectingVoice ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Connecting Live Audio...</span>
                    </>
                  ) : (
                    <>
                      <PhoneCall className="w-4 h-4" />
                      <span>Tap to Call Amit Sir's PA</span>
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer ${
                      isMuted
                        ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-4 h-4 text-amber-600" /> : <Mic className="w-4 h-4 text-[#002347]" />}
                    <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                  </button>

                  <button
                    onClick={stopVoiceSession}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Voice Call</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  onOpenBooking(selectedProperty?.name);
                  onClose();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] border border-[#C5A059]/40 font-bold text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#C5A059]" />
                <span>Schedule VIP Site Visit</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body: Text Chat View with HTTP Streaming */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between bg-[#F8F9FA] overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-[#002347] border border-[#C5A059] flex items-center justify-center text-[#E6C687] font-bold text-xs shrink-0 shadow-sm">
                      AS
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#002347] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 border-l-4 border-l-[#C5A059] rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          msg.role === 'user' ? 'text-[#E6C687]' : 'text-[#002347]'
                        }`}
                      >
                        {msg.role === 'user' ? 'You' : 'Aryan | PA to Amit Sir'}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    {msg.role === 'assistant' && !msg.content ? (
                      <div className="flex items-center gap-2 py-1 text-slate-400 italic">
                        <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce [animation-delay:0.4s]" />
                        <span className="text-xs">Aryan Amit Sir ke portfolio se details stream kar rahe hain...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {msg.role === 'assistant' && msg.content && (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            onOpenBooking(selectedProperty?.name);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#002347]/5 hover:bg-[#002347]/10 text-[#002347] font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3 h-3 text-[#C5A059]" />
                          <span>Book Site Visit</span>
                        </button>

                        <a
                          href={`https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(
                            'Hello Amit Sir, I was speaking with your PA Aryan about luxury properties in Nagpur and would like to connect.'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition-colors"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp Amit Sir</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                      U
                    </div>
                  )}
                </div>
              ))}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">Poochhein:</span>
              <button
                onClick={() => handleSendTextMessage('Dharampeth aur Civil Lines mein luxury 4 BHK penthouses kaunse available hain?')}
                className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#002347] hover:text-white text-slate-700 transition-all cursor-pointer"
              >
                🏢 Dharampeth / Civil Lines Penthouses
              </button>
              <button
                onClick={() => handleSendTextMessage('Besa aur MIHAN ke top NMRDA sanctioned plots ke rates aur approvals bataiye')}
                className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#002347] hover:text-white text-slate-700 transition-all cursor-pointer"
              >
                📜 Besa & MIHAN NMRDA Plots
              </button>
              <button
                onClick={() => handleSendTextMessage('Kya main Amit Sir ke saath weekend private site visit schedule kar sakta hoon?')}
                className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#002347] hover:text-white text-slate-700 transition-all cursor-pointer"
              >
                🚗 Amit Sir ke Saath VIP Site Visit
              </button>
              <button
                onClick={() => handleSendTextMessage('Pench farmhouse lands ke 7/12 title status aur water source ke baare mein bataiye')}
                className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#002347] hover:text-white text-slate-700 transition-all cursor-pointer"
              >
                🌿 Pench Farmhouse 7/12 Land
              </button>
              <button
                onClick={() => handleSendTextMessage('1.5 Cr se 2.5 Cr budget mein Nagpur ke best luxury residential options bataiye')}
                className="shrink-0 px-3 py-1 rounded-full bg-slate-100 hover:bg-[#002347] hover:text-white text-slate-700 transition-all cursor-pointer"
              >
                💰 1.5 - 2.5 Cr Best Options
              </button>
            </div>

            {/* Text Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendTextMessage();
              }}
              className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Amit Sir ke PA se property, pricing, ya RERA approval ke baare mein poochhein..."
                className="flex-1 px-4 py-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#C5A059] focus:bg-white"
                disabled={isSubmittingText}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSubmittingText}
                className="px-4 py-3 rounded-xl bg-[#002347] hover:bg-[#001730] text-[#E6C687] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* Bottom Sub-bar */}
        <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              AS Realty Certified Advisory
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Nagpur HQ: Civil Lines & Ramdaspeth</span>
          </div>

          <a
            href={`tel:${COMPANY_DETAILS.whatsappNumber}`}
            className="text-[#002347] font-bold hover:text-[#C5A059] flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3 text-[#C5A059]" />
            <span>Office Desk: +91 87883 75434</span>
          </a>
        </div>
      </div>
    </div>
  );
};
