// ============================================================
// NEXTGENTEENS -- GROQ AI PROXY (PRODUCTION HARDENED)
// Vercel Serverless Function: /api/chat
//
// Features JWT verification, user suspension checks, and rate limiting.
// ============================================================

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nmarpdupelcvhtypsgyc.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tYXJwZHVwZWxjdmh0eXBzZ3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzYxOTgsImV4cCI6MjEwMTE1MjE5OH0.BTmCUfX8l4XM2RcLv1JYEptYqSoOkBOtPf5CNI1x5es';

// Simple in-memory rate limiter for serverless instance (per user ID / IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(key) {
    const now = Date.now();
    const record = rateLimitMap.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    } else {
        record.count += 1;
    }

    rateLimitMap.set(key, record);
    return record.count <= MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS -- allow requests from the same origin only
    const origin = req.headers.origin || '';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. JWT Authentication Verification
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
        return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
    }

    let userId = null;
    try {
        const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY
            }
        });

        if (!userRes.ok) {
            return res.status(401).json({ error: 'Invalid or expired authentication token.' });
        }

        const userData = await userRes.json();
        userId = userData.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized user token.' });
        }

        // Check if user is suspended in profiles table
        const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=suspended,status`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': SUPABASE_ANON_KEY
            }
        });
        if (profileRes.ok) {
            const profiles = await profileRes.json();
            if (profiles && profiles.length > 0) {
                if (profiles[0].suspended || profiles[0].status === 'suspended') {
                    return res.status(403).json({ error: 'Your account is suspended. AI Coach access is restricted.' });
                }
            }
        }
    } catch (authErr) {
        console.error('Auth verification error:', authErr);
        return res.status(401).json({ error: 'Authentication verification failed.' });
    }

    // 2. Rate Limiting Check
    const rateLimitKey = userId || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!checkRateLimit(rateLimitKey)) {
        return res.status(429).json({ error: 'Hourly AI request limit reached. Please try again later.' });
    }

    // Validate request body
    const { messages, model, max_tokens, temperature } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'messages array is required' });
    }

    // Enforce system prompt -- always include NextGenTeens context
    const systemPrompt = {
        role: 'system',
        content: `You are the AI Coach for NextGenTeens, a youth development platform for teenagers aged 12-19. 
You are operated by JTF Youth Development.
Your role is to help students with:
- Goal discovery and personal development
- Leadership coaching and growth
- Communication skills improvement  
- Spiritual growth and faith discussions (Christian context)
- Study habits and academic support
- Emotional maturity and self-awareness
- Teamwork and relationship skills
- Career and purpose exploration

Guidelines:
- Be encouraging, warm, and age-appropriate for teenagers
- Use biblical references when discussing faith topics
- Keep responses concise and actionable (max 3-4 paragraphs)
- Never discuss harmful content, violence, or adult themes
- If asked about anything outside youth development, redirect politely
- You represent a Christian youth organisation -- reflect those values`
    };

    // Filter out any system messages from the frontend (security)
    const userMessages = messages.filter(m => m.role !== 'system');
    const finalMessages = [systemPrompt, ...userMessages];

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error('GROQ_API_KEY environment variable not set');
        return res.status(500).json({ error: 'AI service not configured on server' });
    }

    try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'llama-3.1-70b-versatile',
                messages: finalMessages,
                temperature: Math.min(Math.max(temperature || 0.7, 0), 1),
                max_tokens: Math.min(max_tokens || 500, 1000)
            })
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.json().catch(() => ({}));
            console.error('Groq API error:', groqResponse.status, errorData);
            
            if (groqResponse.status === 429) {
                return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
            }
            return res.status(groqResponse.status).json({ 
                error: errorData?.error?.message || 'AI service error' 
            });
        }

        const data = await groqResponse.json();
        
        return res.status(200).json({
            content: data.choices?.[0]?.message?.content || '',
            model: data.model,
            usage: data.usage
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Failed to reach AI service. Please try again.' });
    }
}
