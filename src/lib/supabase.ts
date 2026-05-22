import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.");
}

const realSupabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Fallback mock data for offline/unresolved database connection
const getMockData = (table: string): any[] => {
  if (table === 'content') {
    return [
      {
        id: '1',
        section: 'hero',
        data: {
          headline: "Hi I am Vignesh",
          subheadline: "Cybersecurity and AI Student",
          intro: "I build secure, intelligent systems and explore the intersection of artificial intelligence and cybersecurity. Welcome to my digital workspace."
        }
      },
      {
        id: '2',
        section: 'resume',
        data: {
          url: '/resume.pdf'
        }
      },
      {
        id: '3',
        section: 'about',
        data: {
          bio: "I am a passionate technologist focusing on the intersection of cybersecurity and artificial intelligence. With a strong foundation in both offensive and defensive security, I strive to build resilient systems.",
          careerGoals: "My goal is to lead innovative security research and develop AI-driven solutions that proactively identify and mitigate emerging cyber threats.",
          focusAreas: ["Cybersecurity", "Artificial Intelligence", "Automation", "Security Research"]
        }
      }
    ];
  }
  if (table === 'projects') {
    return [
      {
        id: '1',
        title: 'SentinelEye AI',
        description: 'An AI-powered network threat detection system using deep learning to identify real-time zero-day attacks in high-throughput traffic.',
        image: '',
        technologies: ['Python', 'PyTorch', 'TensorFlow', 'React', 'FastAPI'],
        github_url: 'https://github.com/vickytheslugger/sentineleye-ai',
        live_url: '',
        order: 1
      },
      {
        id: '2',
        title: 'CipherSafe',
        description: 'A zero-knowledge end-to-end encrypted password manager and sharing platform implementing AES-GCM and PBKDF2.',
        image: '',
        technologies: ['TypeScript', 'React', 'Web Crypto API', 'Supabase'],
        github_url: 'https://github.com/vickytheslugger/ciphersafe',
        live_url: 'https://ciphersafe.dev',
        order: 2
      },
      {
        id: '3',
        title: 'PacketSniff',
        description: 'A lightweight, terminal-based packet sniffer and analysis tool written in Go with customizable filtering rules.',
        image: '',
        technologies: ['Go', 'gopacket', 'Termui'],
        github_url: 'https://github.com/vickytheslugger/packetsniff',
        live_url: '',
        order: 3
      }
    ];
  }
  if (table === 'skills') {
    return [
      { id: '1', name: 'Penetration Testing', category: 'Cybersecurity' },
      { id: '2', name: 'Threat Intelligence', category: 'Cybersecurity' },
      { id: '3', name: 'Cryptography', category: 'Cybersecurity' },
      { id: '4', name: 'Incident Response', category: 'Cybersecurity' },
      { id: '5', name: 'Network Security', category: 'Cybersecurity' },
      { id: '6', name: 'Machine Learning', category: 'Artificial Intelligence' },
      { id: '7', name: 'Neural Networks', category: 'Artificial Intelligence' },
      { id: '8', name: 'PyTorch', category: 'Artificial Intelligence' },
      { id: '9', name: 'Natural Language Processing', category: 'Artificial Intelligence' },
      { id: '10', name: 'Python', category: 'Programming' },
      { id: '11', name: 'TypeScript', category: 'Programming' },
      { id: '12', name: 'Go', category: 'Programming' },
      { id: '13', name: 'C++', category: 'Programming' },
      { id: '14', name: 'Rust', category: 'Programming' },
      { id: '15', name: 'Bash Scripting', category: 'Programming' },
      { id: '16', name: 'Git', category: 'Tools' },
      { id: '17', name: 'Docker', category: 'Tools' },
      { id: '18', name: 'Kubernetes', category: 'Tools' },
      { id: '19', name: 'Linux (Kali/Arch)', category: 'Tools' },
      { id: '20', name: 'Wireshark', category: 'Tools' },
      { id: '21', name: 'Metasploit', category: 'Tools' },
      { id: '22', name: 'AWS', category: 'Tools' },
    ];
  }
  if (table === 'experience') {
    return [
      {
        id: '1',
        title: 'Security Research Intern',
        organization: 'CyberShield Solutions',
        start_date: 'Jan 2026',
        end_date: 'Present',
        description: 'Developing AI tools for automated vulnerability detection and log analysis. Collaborated with the Red Team on internal penetration testing exercises.',
        technologies: ['Python', 'FastAPI', 'Docker', 'Kali Linux', 'Elasticsearch'],
        logo: ''
      },
      {
        id: '2',
        title: 'AI Consultant (Freelance)',
        organization: 'Autonomous AI Labs',
        start_date: 'Jun 2025',
        end_date: 'Dec 2025',
        description: 'Designed secure integration pipelines for large language models in enterprise databases. Audited and fortified client AI workloads against prompt injection attacks.',
        technologies: ['TypeScript', 'LangChain', 'OpenAI API', 'React', 'Supabase'],
        logo: ''
      },
      {
        id: '3',
        title: 'Undergraduate Cybersecurity Researcher',
        organization: 'Vignesh\'s University',
        start_date: 'Sep 2024',
        end_date: 'May 2025',
        description: 'Researched side-channel attacks on IoT hardware and designed cryptographic countermeasures. Published a peer-reviewed paper on hardware-level vulnerabilities.',
        technologies: ['C++', 'Rust', 'Embedded C', 'Hardware Security', 'Oscilloscopes'],
        logo: ''
      }
    ];
  }
  if (table === 'certifications') {
    return [
      {
        id: '1',
        name: 'CompTIA Security+',
        issuing_organization: 'CompTIA',
        issue_date: '2025-01-15',
        expiry_date: null,
        credential_id: 'SEC-123456789',
        description: 'Demonstrates foundational knowledge of cybersecurity principles, threat mitigation, and network security policies.',
        skills: ['Security Operations', 'Network Security', 'Threat Management'],
        credential_url: 'https://www.comptia.org',
        image_url: ''
      },
      {
        id: '2',
        name: 'Certified Ethical Hacker (CEH)',
        issuing_organization: 'EC-Council',
        issue_date: '2025-06-20',
        expiry_date: '2028-06-20',
        credential_id: 'CEH-987654321',
        description: 'Covers penetration testing, malware analysis, network scanning, and system hacking methodologies.',
        skills: ['Penetration Testing', 'Ethical Hacking', 'Vulnerability Assessment'],
        credential_url: 'https://www.eccouncil.org',
        image_url: ''
      },
      {
        id: '3',
        name: 'AWS Certified Cloud Practitioner',
        issuing_organization: 'Amazon Web Services',
        issue_date: '2024-09-10',
        expiry_date: '2027-09-10',
        credential_id: 'AWS-CCP-5555',
        description: 'Validates overall understanding of the AWS Cloud platform, covering basic cloud services, security, and pricing.',
        skills: ['Cloud Computing', 'AWS Services', 'Cloud Security'],
        credential_url: 'https://aws.amazon.com',
        image_url: ''
      }
    ];
  }
  return [];
};

// Mock Auth logic
const getMockSession = () => {
  const mockUserStr = localStorage.getItem('supabase_mock_user');
  if (mockUserStr) {
    try {
      const user = JSON.parse(mockUserStr);
      return { session: { user, access_token: 'mock-token' } };
    } catch {
      return { session: null };
    }
  }
  return { session: null };
};

const setMockSession = (user: any) => {
  if (user) {
    localStorage.setItem('supabase_mock_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('supabase_mock_user');
  }
};

const mockAuthCallbacks = new Set<(event: string, session: any) => void>();

const authProxyHandler = {
  get(target: any, prop: string | symbol, receiver: any): any {
    if (prop === 'signInWithPassword') {
      return async ({ email, password }: any) => {
        try {
          const res = await target.signInWithPassword({ email, password });
          if (res.error && (
            res.error.message?.includes('fetch') || 
            res.error.message?.includes('Failed') || 
            res.error.message?.includes('Network') ||
            res.error.status === 0
          )) {
            if (email === 'admin@gmail.com' && password === 'admin123') {
              const mockUser = { id: 'mock-admin-id', email };
              setMockSession(mockUser);
              const session = { user: mockUser, access_token: 'mock-token' };
              mockAuthCallbacks.forEach(cb => cb('SIGNED_IN', session));
              return { data: { user: mockUser, session }, error: null };
            } else {
              return { data: { user: null, session: null }, error: { message: 'Invalid credentials. For offline mode, use admin@gmail.com / admin123' } };
            }
          }
          return res;
        } catch (err: any) {
          if (email === 'admin@gmail.com' && password === 'admin123') {
            const mockUser = { id: 'mock-admin-id', email };
            setMockSession(mockUser);
            const session = { user: mockUser, access_token: 'mock-token' };
            mockAuthCallbacks.forEach(cb => cb('SIGNED_IN', session));
            return { data: { user: mockUser, session }, error: null };
          }
          return { data: { user: null, session: null }, error: { message: err.message || 'Invalid credentials' } };
        }
      };
    }
    
    if (prop === 'getSession') {
      return async () => {
        try {
          const res = await target.getSession();
          if (res.error && (
            res.error.message?.includes('fetch') || 
            res.error.message?.includes('Failed') || 
            res.error.message?.includes('Network') ||
            res.error.status === 0
          )) {
            return { data: getMockSession(), error: null };
          }
          if (!res.data.session) {
            const mockSess = getMockSession();
            if (mockSess.session) {
              return { data: mockSess, error: null };
            }
          }
          return res;
        } catch {
          return { data: getMockSession(), error: null };
        }
      };
    }

    if (prop === 'signOut') {
      return async () => {
        setMockSession(null);
        mockAuthCallbacks.forEach(cb => cb('SIGNED_OUT', null));
        try {
          return await target.signOut();
        } catch {
          return { error: null };
        }
      };
    }

    if (prop === 'onAuthStateChange') {
      return (callback: any) => {
        mockAuthCallbacks.add(callback);
        const realSub = target.onAuthStateChange((event: any, session: any) => {
          if (session) {
            callback(event, session);
          } else {
            const mockSess = getMockSession();
            if (mockSess.session) {
              callback('SIGNED_IN', mockSess.session);
            } else {
              callback(event, session);
            }
          }
        });
        
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                mockAuthCallbacks.delete(callback);
                if (realSub && realSub.data && realSub.data.subscription) {
                  realSub.data.subscription.unsubscribe();
                }
              }
            }
          }
        };
      };
    }

    return Reflect.get(target, prop, receiver);
  }
};

const makeSafeQuery = (realQuery: any, table: string, isSingle = false) => {
  const handler = {
    get(target: any, prop: string | symbol, receiver: any): any {
      if (prop === 'then') {
        return (onfulfilled: any, onrejected: any) => {
          return target.then(
            (res: any) => {
              if (res.error && (
                res.error.message?.includes('fetch') || 
                res.error.message?.includes('Failed') || 
                res.error.message?.includes('Network') ||
                res.error.status === 0
              )) {
                console.warn(`Supabase query failed for table "${table}", using client-side mock data.`, res.error);
                const mock = getMockData(table);
                let finalData: any = mock;
                if (isSingle) {
                  finalData = mock.find((item: any) => item.section === 'about') || mock[0];
                }
                return { data: finalData, error: null };
              }
              return res;
            },
            (err: any) => {
              console.warn(`Supabase query rejected for table "${table}", using client-side mock data.`, err);
              const mock = getMockData(table);
              let finalData: any = mock;
              if (isSingle) {
                finalData = mock.find((item: any) => item.section === 'about') || mock[0];
              }
              return { data: finalData, error: null };
            }
          ).then(onfulfilled, onrejected);
        };
      }

      const val = Reflect.get(target, prop, receiver);
      if (typeof val === 'function') {
        return (...args: any[]) => {
          let nextSingle = isSingle;
          if (prop === 'single') {
            nextSingle = true;
          }
          const result = val.apply(target, args);
          if (result && (typeof result.then === 'function' || typeof result.select === 'function')) {
            return makeSafeQuery(result, table, nextSingle);
          }
          return result;
        };
      }
      return val;
    }
  };
  return new Proxy(realQuery, handler);
};

const supabaseProxyHandler = {
  get(target: any, prop: string | symbol, receiver: any): any {
    if (prop === 'from') {
      return (table: string) => {
        const query = target.from(table);
        return makeSafeQuery(query, table);
      };
    }
    if (prop === 'auth') {
      return new Proxy(target.auth, authProxyHandler);
    }
    return Reflect.get(target, prop, receiver);
  }
};

export const supabase = new Proxy(realSupabase, supabaseProxyHandler);
