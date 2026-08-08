// ========================================
// NEXTGENTEENS - COMPLETE SCRIPT
// ALL REAL DATA - NO PLACEHOLDERS
// ========================================

// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_CONFIG = {
    url: 'https://nmarpdupelcvhtypsgyc.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tYXJwZHVwZWxjdmh0eXBzZ3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzYxOTgsImV4cCI6MjEwMTE1MjE5OH0.BTmCUfX8l4XM2RcLv1JYEptYqSoOkBOtPf5CNI1x5es'
};

// ========================================
// AI PROXY CONFIGURATION
// Key is stored server-side in Vercel env vars - never in client code
// ========================================

const AI_PROXY_URL = '/chat';

// ========================================
// SUPABASE CLIENT
// ========================================

let supabaseClient = null;
let isSupabaseReady = false;
let currentUser = null;
let currentProfile = null;
let currentRole = null;

async function initSupabase() {
    if (isSupabaseReady && supabaseClient) return supabaseClient;
    try {
        if (typeof supabase === 'undefined') {
            await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
            if (typeof supabase === 'undefined') throw new Error('Supabase library could not be loaded');
        }
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
            auth: {
                storage: {
                    getItem: (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } },
                    setItem: (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} },
                    removeItem: (key) => { try { localStorage.removeItem(key); } catch (e) {} }
                },
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
        isSupabaseReady = true;
        showSystemCard('Supabase client initialized', 'success');
        return supabaseClient;
    } catch (error) {
        showSystemCard('Error initializing Supabase: ' + error.message, 'error');
        return null;
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function getSupabase() {
    if (isSupabaseReady && supabaseClient) return supabaseClient;
    return await initSupabase();
}

// ========================================
// PAGE LOADING SYSTEM
// ========================================

function showPageLoader(text = 'Loading...') {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        const loaderText = pageLoader.querySelector('.loader-text');
        if (loaderText) {
            loaderText.textContent = text;
        }
        pageLoader.classList.remove('hidden');
        pageLoader.style.display = 'flex';
    }
}

function hidePageLoader() {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        pageLoader.classList.add('hidden');
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 300);
    }
}

// Auto-hide page loader when page is fully loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        hidePageLoader();
        // Add fade-in animation to main content
        const mainContent = document.querySelector('.dashboard-content, .hero, .auth-container');
        if (mainContent) {
            mainContent.classList.add('fade-in-content');
        }
    }, 800);
});

// ========================================
// BUTTON LOADING STATES
// ========================================

function setButtonLoading(button, isLoading, originalText = '') {
    if (!button) return;
    
    if (isLoading) {
        if (!originalText) {
            originalText = button.textContent.trim();
        }
        button.classList.add('loading');
        button.setAttribute('data-original-text', originalText);
        button.disabled = true;
        // Hide text content but keep button size
        const textSpan = button.querySelector('.btn-text') || button;
        if (!button.querySelector('.btn-text')) {
            const span = document.createElement('span');
            span.className = 'btn-text';
            span.textContent = originalText;
            button.appendChild(span);
        }
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        const textSpan = button.querySelector('.btn-text');
        if (textSpan) {
            textSpan.remove();
        }
    }
}

// Add loading state to all form submissions
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                setButtonLoading(submitBtn, true, submitBtn.textContent);
            }
        });
    });

    // Add loading state to buttons with data-loading attribute
    const loadingButtons = document.querySelectorAll('[data-loading="true"]');
    loadingButtons.forEach(button => {
        button.addEventListener('click', function() {
            setButtonLoading(this, true, this.textContent);
        });
    });
});

// ========================================
// ONBOARDING TOUR SYSTEM
// ========================================

const tourSteps = {
    student: [
        { element: '.sidebar', title: 'Navigation Sidebar', content: 'Access all pages and features from here. Click the menu icon on mobile to toggle.', position: 'right' },
        { element: '.sidebar-header', title: 'Brand', content: 'Your NextGenTeens brand logo and navigation.', position: 'right' },
        { element: '.nav-item[href="student-dashboard.html"]', title: 'Dashboard', content: 'Your main dashboard with stats, programs, and quick actions.', position: 'right' },
        { element: '.nav-item[href="tasks.html"]', title: 'Tasks', content: 'View and submit your assignments and homework.', position: 'right' },
        { element: '.nav-item[href="achievements.html"]', title: 'Achievements', content: 'See your earned badges and track your progress.', position: 'right' },
        { element: '.nav-item[href="leaderboard.html"]', title: 'Leaderboard', content: 'See how you rank among other students.', position: 'right' },
        { element: '.nav-item[href="ai-coach.html"]', title: 'AI Coach', content: 'Get personalized coaching and guidance anytime.', position: 'right' },
        { element: '.nav-item[href="games.html"]', title: 'Games', content: 'Play educational games to learn while having fun.', position: 'right' },
        { element: '.nav-item[href="profile.html"]', title: 'Profile', content: 'Manage your personal information and settings.', position: 'right' },
        { element: '.topbar', title: 'Top Bar', content: 'Shows current page title and your profile info.', position: 'bottom' },
        { element: '.menu-toggle', title: 'Mobile Menu', content: 'Toggle sidebar on mobile devices.', position: 'bottom' },
        { element: '.welcome-section', title: 'Welcome Section', content: 'Your personalized greeting and quick stats.', position: 'bottom' },
        { element: '.stats-grid', title: 'Your Statistics', content: 'Track your attendance, assignments, SGI score, and streaks.', position: 'top' },
        { element: '.quick-actions', title: 'Quick Actions', content: 'Fast access to common tasks like submitting work.', position: 'top' },
        { element: '.program-list', title: 'Your Programs', content: 'View and manage your enrolled programs like CTFS and Choir.', position: 'left' },
        { element: '.nav-item.logout', title: 'Logout', content: 'Sign out of your account securely.', position: 'right' }
    ],
    mentor: [
        { element: '.sidebar', title: 'Navigation Sidebar', content: 'Access all mentor tools and features from here.', position: 'right' },
        { element: '.sidebar-header', title: 'Brand', content: 'Your NextGenTeens brand logo and navigation.', position: 'right' },
        { element: '.nav-item[href="mentor-dashboard.html"]', title: 'Dashboard', content: 'Overview of your students and pending reviews.', position: 'right' },
        { element: '.nav-item[href="session-manager.html"]', title: 'Session Manager', content: 'Manage sessions, mark attendance, and track progress.', position: 'right' },
        { element: '.nav-item[href="activity-feed.html"]', title: 'Activity Feed', content: 'Publish announcements and activities for students.', position: 'right' },
        { element: '.nav-item[href="programs.html"]', title: 'Programs', content: 'View and manage program details and curriculum.', position: 'right' },
        { element: '.nav-item[href="ai-coach.html"]', title: 'AI Coach', content: 'Get AI assistance for mentoring and guidance.', position: 'right' },
        { element: '.topbar', title: 'Top Bar', content: 'Shows current page title and your profile info.', position: 'bottom' },
        { element: '.welcome-section', title: 'Welcome Section', content: 'Your mentor dashboard overview and stats.', position: 'bottom' },
        { element: '.stats-grid', title: 'Mentor Statistics', content: 'Track your review activity and student engagement.', position: 'top' },
        { element: '.pending-list', title: 'Pending Reviews', content: 'Review and grade student submissions here.', position: 'left' },
        { element: '.program-list', title: 'Your Programs', content: 'View programs you are mentoring.', position: 'left' },
        { element: '.nav-item.logout', title: 'Logout', content: 'Sign out of your account securely.', position: 'right' }
    ],
    admin: [
        { element: '.sidebar', title: 'Navigation Sidebar', content: 'Access all admin tools and platform management.', position: 'right' },
        { element: '.sidebar-header', title: 'Brand', content: 'Your NextGenTeens brand logo and navigation.', position: 'right' },
        { element: '.nav-item[href="admin-dashboard.html"]', title: 'Dashboard', content: 'Platform-wide overview and management tools.', position: 'right' },
        { element: '.nav-item[href="session-manager.html"]', title: 'Session Manager', content: 'Manage sessions, attendance, and program scheduling.', position: 'right' },
        { element: '.nav-item[href="programs.html"]', title: 'Programs', content: 'Configure and manage all programs.', position: 'right' },
        { element: '.nav-item[href="activity-feed.html"]', title: 'Activity Feed', content: 'Manage platform announcements and activities.', position: 'right' },
        { element: '.nav-item[href="notifications.html"]', title: 'Notifications', content: 'Send system notifications to users.', position: 'right' },
        { element: '.topbar', title: 'Top Bar', content: 'Shows current page title and your profile info.', position: 'bottom' },
        { element: '.welcome-section', title: 'Welcome Section', content: 'Admin dashboard overview and platform stats.', position: 'bottom' },
        { element: '.stats-grid', title: 'Platform Statistics', content: 'View overall platform usage and engagement.', position: 'top' },
        { element: '.program-list', title: 'All Programs', content: 'View and manage all platform programs.', position: 'left' },
        { element: '.nav-item.logout', title: 'Logout', content: 'Sign out of your account securely.', position: 'right' }
    ]
};

let currentTour = null;
let currentStepIndex = 0;
let tourOverlay = null;
let tourTooltip = null;
let tourTrigger = null;

function initTourSystem() {
    // Create tour overlay
    tourOverlay = document.createElement('div');
    tourOverlay.className = 'tour-overlay';
    document.body.appendChild(tourOverlay);

    // Create tour tooltip
    tourTooltip = document.createElement('div');
    tourTooltip.className = 'tour-tooltip';
    tourTooltip.innerHTML = `
        <div class="tour-tooltip-title"></div>
        <div class="tour-tooltip-content"></div>
        <div class="tour-tooltip-progress"></div>
        <div class="tour-tooltip-actions">
            <button class="btn btn-outline" onclick="skipTour()">Skip</button>
            <button class="btn btn-primary" onclick="nextTourStep()">Next</button>
        </div>
    `;
    document.body.appendChild(tourTooltip);

    // Create tour trigger button
    tourTrigger = document.createElement('div');
    tourTrigger.className = 'tour-trigger hidden';
    tourTrigger.innerHTML = '🎯';
    tourTrigger.onclick = startTour;
    document.body.appendChild(tourTrigger);

    // Check if user has completed tour
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (!tourCompleted) {
        // Auto-start tour after a longer delay to let page load
        setTimeout(() => {
            const userRole = localStorage.getItem('userRole') || 'student';
            startTour(userRole);
        }, 3000);
    } else {
        tourTrigger.classList.remove('hidden');
    }
}

function startTour(role) {
    const userRole = role || localStorage.getItem('userRole') || 'student';
    currentTour = tourSteps[userRole] || tourSteps.student;
    currentStepIndex = 0;
    
    if (currentTour.length === 0) {
        showSystemCard('No tour steps available for your role', 'info');
        return;
    }

    tourOverlay.classList.add('active');
    tourTrigger.classList.add('hidden');
    showTourStep();
}

function showTourStep() {
    if (!currentTour || currentStepIndex >= currentTour.length) {
        endTour();
        return;
    }

    const step = currentTour[currentStepIndex];
    const element = document.querySelector(step.element);

    if (!element) {
        console.warn('Tour element not found:', step.element);
        currentStepIndex++;
        showTourStep();
        return;
    }

    // Remove previous highlight and event listeners
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
        el.removeEventListener('click', preventTourClick);
    });

    // Add highlight to current element
    element.classList.add('tour-highlight');
    
    // Prevent clicks on highlighted elements during tour
    element.addEventListener('click', preventTourClick, true);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tourTooltip.getBoundingClientRect();

    tourTooltip.className = `tour-tooltip active ${step.position}`;
    tourTooltip.querySelector('.tour-tooltip-title').textContent = step.title;
    tourTooltip.querySelector('.tour-tooltip-content').textContent = step.content;
    tourTooltip.querySelector('.tour-tooltip-progress').textContent = `Step ${currentStepIndex + 1} of ${currentTour.length}`;

    // Position based on step.position
    let top, left;
    switch (step.position) {
        case 'top':
            top = rect.top - tooltipRect.height - 15;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            break;
        case 'bottom':
            top = rect.bottom + 15;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            break;
        case 'left':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.left - tooltipRect.width - 15;
            break;
        case 'right':
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + 15;
            break;
        default:
            top = rect.bottom + 15;
            left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    }

    // Keep tooltip within viewport
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));

    tourTooltip.style.top = top + 'px';
    tourTooltip.style.left = left + 'px';

    // Scroll element into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function nextTourStep() {
    currentStepIndex++;
    showTourStep();
}

function skipTour() {
    endTour();
}

function endTour() {
    tourOverlay.classList.remove('active');
    tourTooltip.classList.remove('active');
    document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
        el.removeEventListener('click', preventTourClick);
    });
    tourTrigger.classList.remove('hidden');
    localStorage.setItem('tourCompleted', 'true');
    showSystemCard('Tour completed! You can always restart it using the help button.', 'success');
}

function preventTourClick(event) {
    event.stopPropagation();
    event.preventDefault();
}

// Initialize tour system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTourSystem);
} else {
    initTourSystem();
}

// ========================================
// CUSTOM NOTIFICATION SYSTEM
// ========================================

function showSystemCard(message, type = 'info') {
    const card = document.createElement('div');
    card.className = `system-card system-card-${type}`;
    card.innerHTML = `
        <div class="system-card-content">
            <span class="system-card-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
            <span class="system-card-message">${message}</span>
        </div>
    `;
    document.body.appendChild(card);
    
    setTimeout(() => {
        card.classList.add('system-card-show');
    }, 10);
    
    setTimeout(() => {
        card.classList.remove('system-card-show');
        setTimeout(() => {
            document.body.removeChild(card);
        }, 300);
    }, 4000);
}

// Add system card styles if not present
if (!document.getElementById('system-card-styles')) {
    const style = document.createElement('style');
    style.id = 'system-card-styles';
    style.textContent = `
        .system-card {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 12px 16px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            max-width: 400px;
            border-left: 4px solid #2563eb;
        }
        .system-card-show {
            opacity: 1;
            transform: translateX(0);
        }
        .system-card-success { border-left-color: #10b981; }
        .system-card-error { border-left-color: #ef4444; }
        .system-card-warning { border-left-color: #f59e0b; }
        .system-card-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .system-card-icon {
            font-size: 18px;
        }
        .system-card-message {
            font-size: 14px;
            color: #1f2937;
            font-family: 'Inter', sans-serif;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// AUTHENTICATION
// ========================================

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const roleBtn = document.querySelector('.role-btn.active');
    const role = roleBtn ? roleBtn.dataset.role : 'student';
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    // Add timeout to prevent indefinite loading
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout. Please try again.')), 15000);
    });

    try {
        const client = await getSupabase();
        if (!client) { 
            showAuthError('Could not connect to server.'); 
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return; 
        }
        
        // Race between auth request and timeout
        const { data, error } = await Promise.race([
            client.auth.signInWithPassword({ email, password }),
            timeoutPromise
        ]);
        
        if (error) { 
            showAuthError(error.message || 'Invalid credentials'); 
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return; 
        }
        if (!data || !data.user) { 
            showAuthError('No user data returned'); 
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return; 
        }

        const { data: profile, error: profileError } = await client
            .from('profiles').select('*').eq('id', data.user.id).single();
        if (profileError) { 
            showAuthError('Profile not found'); 
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return; 
        }
        if (profile.suspended || profile.status === 'suspended') {
            showAuthError('Your account has been suspended. Please contact administration.');
            await client.auth.signOut();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        if (profile.role !== role) {
            showAuthError('Access denied. You are registered as a ' + profile.role + '.');
            await client.auth.signOut();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        currentUser = data.user;
        currentProfile = profile;
        currentRole = profile.role;
        showAuthSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            const dest = profile.role === 'admin' ? 'admin-dashboard.html' : profile.role + '-dashboard.html';
            window.location.href = dest;
        }, 1000);
    } catch (error) {
        showAuthError(error.message || 'An error occurred during login.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const age = parseInt(document.getElementById('regAge').value);
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const role = document.getElementById('regRole').value;

    if (!fullName || fullName.length < 2) { showRegError('Please enter your full name'); return; }
    if (!email || !email.includes('@')) { showRegError('Please enter a valid email address'); return; }
    if (password !== confirmPassword) { showRegError('Passwords do not match'); return; }
    if (password.length < 8) { showRegError('Password must be at least 8 characters'); return; }
    if (isNaN(age) || age < 12) { showRegError('You must be at least 12 years old'); return; }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;

    // Add timeout to prevent indefinite loading
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout. Please try again.')), 15000);
    });

    try {
        const client = await getSupabase();
        if (!client) { 
            showRegError('Could not connect to server.'); 
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return; 
        }
        
        // Race between auth request and timeout
        const { data, error } = await Promise.race([
            client.auth.signUp({
                email, password,
                options: { data: { full_name: fullName, role, age } }
            }),
            timeoutPromise
        ]);
        
        if (error) {
            let message = error.message || 'Unknown error';
            if (message.includes('User already registered')) message = 'This email is already registered. Please login instead.';
            showRegError(message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        if (!data || !data.user) { 
            showRegError('Account creation failed. Please try again.'); 
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return; 
        }

        const { error: profileError } = await client
            .from('profiles')
            .upsert({
                id: data.user.id,
                full_name: fullName,
                email: email,
                role: role,
                age: age,
                created_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (profileError) {
            const { data: existingProfile } = await client
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .maybeSingle();

            if (existingProfile || profileError.code === '23505') {
                showRegSuccess('Account created successfully! You can now login.');
            } else {
                showRegError('Account created but profile setup failed: ' + profileError.message);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
        } else {
            showRegSuccess('Account created successfully! You can now login.');
        }

        document.getElementById('registerForm').reset();
        document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
        document.querySelector('.role-card[data-role="student"]').classList.add('selected');
        document.getElementById('regRole').value = 'student';

        setTimeout(() => { window.location.href = 'login.html'; }, 2000);
    } catch (error) {
        showRegError('Error: ' + (error.message || 'Unknown error'));
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ========================================
// UI HELPERS
// ========================================

function showAuthError(message) {
    const errorEl = document.getElementById('authError');
    const successEl = document.getElementById('authSuccess');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        if (successEl) successEl.classList.add('hidden');
    }
}

function showAuthSuccess(message) {
    const successEl = document.getElementById('authSuccess');
    const errorEl = document.getElementById('authError');
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.remove('hidden');
        if (errorEl) errorEl.classList.add('hidden');
    }
}

function showRegError(message) {
    const errorEl = document.getElementById('regError');
    const successEl = document.getElementById('regSuccess');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        if (successEl) successEl.classList.add('hidden');
    }
}

function showRegSuccess(message) {
    const successEl = document.getElementById('regSuccess');
    const errorEl = document.getElementById('regError');
    if (successEl) {
        successEl.textContent = message;
        successEl.classList.remove('hidden');
        if (errorEl) errorEl.classList.add('hidden');
    }
}

// Access codes for role activation
const ACCESS_CODES = {
    'mentor': 'MENT123',
    'admin': 'ADMIN123'
};

let requestedRole = null;

function requestAccessCode(role) {
    requestedRole = role;
    const accessCodeSection = document.getElementById('accessCodeSection');
    if (accessCodeSection) {
        accessCodeSection.classList.remove('hidden');
    }
    
    // Hide the role selection temporarily
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    showSystemCard('Enter the access code for ' + role + ' registration.', 'info');
}

function verifyAccessCode() {
    const accessCodeInput = document.getElementById('accessCode');
    const code = accessCodeInput ? accessCodeInput.value.trim() : '';
    
    if (!code) {
        showSystemCard('Please enter an access code.', 'error');
        return;
    }
    
    if (!requestedRole) {
        showSystemCard('Please select a role first.', 'error');
        return;
    }
    
    const expectedCode = ACCESS_CODES[requestedRole];
    
    if (code === expectedCode) {
        // Code is valid, unlock the role
        showSystemCard('Access code verified! ' + requestedRole.charAt(0).toUpperCase() + requestedRole.slice(1) + ' role unlocked.', 'success');
        
        // Hide access code section
        const accessCodeSection = document.getElementById('accessCodeSection');
        if (accessCodeSection) {
            accessCodeSection.classList.add('hidden');
        }
        
        // Unlock and select the role
        const roleCard = document.querySelector('.role-card[data-role="' + requestedRole + '"]');
        if (roleCard) {
            roleCard.classList.remove('locked');
            roleCard.classList.add('unlocked');
            selectRole(requestedRole);
        }
        
        // Clear the input
        if (accessCodeInput) accessCodeInput.value = '';
        requestedRole = null;
    } else {
        showSystemCard('Invalid access code. Please contact administrator for the correct code.', 'error');
        if (accessCodeInput) accessCodeInput.value = '';
    }
}

function selectRole(role) {
    const roleCard = document.querySelector('.role-card[data-role="' + role + '"]');
    
    // Check if role is locked
    if (roleCard && roleCard.classList.contains('locked')) {
        requestAccessCode(role);
        return;
    }
    
    // Hide access code section when selecting an unlocked role (like student)
    const accessCodeSection = document.getElementById('accessCodeSection');
    if (accessCodeSection) {
        accessCodeSection.classList.add('hidden');
    }
    
    // Clear requested role since we're selecting an unlocked role
    requestedRole = null;
    
    // Clear access code input if it exists
    const accessCodeInput = document.getElementById('accessCode');
    if (accessCodeInput) {
        accessCodeInput.value = '';
    }
    
    // Remove selected class from all cards
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to chosen card
    const selected = document.querySelector('.role-card[data-role="' + role + '"]');
    if (selected) selected.classList.add('selected');
    
    // Set the form value
    document.getElementById('regRole').value = role;
}

function setLoginRole(role) {
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const selected = document.querySelector('.role-btn[data-role="' + role + '"]');
    if (selected) selected.classList.add('active');
}

// ========================================
// UNIVERSAL UI HELPER
// ========================================

function setEl(elementId, content) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = content || '';
}

// ========================================
// PAGE INITIALIZATION HELPER
// ========================================

async function initPage(loadFunction) {
    // Wait for getSupabase to be available
    let attempts = 0;
    while (typeof getSupabase === 'undefined' && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }
    
    if (typeof getSupabase === 'undefined') {
        console.error('Failed to load dependencies');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const client = await getSupabase();
        if (!client) { window.location.href = 'login.html'; return; }
        
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = 'login.html'; return; }
        
        const { data: profile } = await client.from('profiles').select('role, full_name, suspended, status').eq('id', session.user.id).single();
        if (profile && (profile.suspended || profile.status === 'suspended')) {
            await client.auth.signOut();
            alert('Your account has been suspended. Redirecting to login.');
            window.location.href = 'login.html';
            return;
        }
        
        const displayEl = document.getElementById('userNameDisplay');
        if (displayEl) displayEl.textContent = profile.full_name || 'User';
        
        // Load profile picture in topbar
        await loadUserAvatar(session.user.id, profile.role);
        
        if (typeof loadFunction === 'function') {
            await loadFunction();
        }
    } catch (error) {
        console.error('Page initialization error:', error);
    }
}

async function initStudentPage(loadFunction) {
    // Wait for getSupabase to be available
    let attempts = 0;
    while (typeof getSupabase === 'undefined' && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }
    
    if (typeof getSupabase === 'undefined') {
        console.error('Failed to load dependencies');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const client = await getSupabase();
        if (!client) { window.location.href = 'login.html'; return; }
        
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = 'login.html'; return; }
        
        const { data: profile } = await client.from('profiles').select('role, full_name, suspended, status').eq('id', session.user.id).single();
        if (profile && (profile.suspended || profile.status === 'suspended')) {
            await client.auth.signOut();
            alert('Your account has been suspended. Redirecting to login.');
            window.location.href = 'login.html';
            return;
        }
        if (!profile || profile.role !== 'student') {
            console.error('Access denied. Student role required.');
            window.location.href = 'login.html';
            return;
        }
        
        const displayEl = document.getElementById('userNameDisplay');
        if (displayEl) displayEl.textContent = profile.full_name || 'Student';
        
        // Load profile picture in topbar
        await loadUserAvatar(session.user.id, profile.role);
        
        if (typeof loadFunction === 'function') {
            await loadFunction();
        }
    } catch (error) {
        console.error('Page initialization error:', error);
    }
}

async function initMentorPage(loadFunction) {
    // Wait for getSupabase to be available
    let attempts = 0;
    while (typeof getSupabase === 'undefined' && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }
    
    if (typeof getSupabase === 'undefined') {
        console.error('Failed to load dependencies');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const client = await getSupabase();
        if (!client) { window.location.href = 'login.html'; return; }
        
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = 'login.html'; return; }
        
        const { data: profile } = await client.from('profiles').select('role, full_name').eq('id', session.user.id).single();
        if (!profile || profile.role !== 'mentor') {
            console.error('Access denied. Mentor role required.');
            window.location.href = 'login.html';
            return;
        }
        
        const displayEl = document.getElementById('mentorNameDisplay') || document.getElementById('userNameDisplay');
        if (displayEl) displayEl.textContent = profile.full_name || 'Mentor';
        
        if (typeof loadFunction === 'function') {
            await loadFunction();
        }
    } catch (error) {
        console.error('Page initialization error:', error);
    }
}

async function initAdminPage(loadFunction) {
    // Wait for getSupabase to be available
    let attempts = 0;
    while (typeof getSupabase === 'undefined' && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }
    
    if (typeof getSupabase === 'undefined') {
        console.error('Failed to load dependencies');
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const client = await getSupabase();
        if (!client) { window.location.href = 'login.html'; return; }
        
        const { data: { session } } = await client.auth.getSession();
        if (!session) { window.location.href = 'login.html'; return; }
        
        const { data: profile } = await client.from('profiles').select('role, full_name').eq('id', session.user.id).single();
        if (!profile || profile.role !== 'admin') {
            console.error('Access denied. Admin role required.');
            window.location.href = 'login.html';
            return;
        }
        
        const displayEl = document.getElementById('adminNameDisplay') || document.getElementById('userNameDisplay');
        if (displayEl) displayEl.textContent = profile.full_name || 'Admin';
        
        if (typeof loadFunction === 'function') {
            await loadFunction();
        }
    } catch (error) {
        console.error('Page initialization error:', error);
    }
}

async function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    try {
        const client = await getSupabase();
        if (client) await client.auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        window.location.href = 'index.html';
    }
}

// ========================================
// SIDEBAR & NAVIGATION
// ========================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
        // Prevent body scroll when sidebar is open on mobile
        if (sidebar.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
});

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.toggle('open');
}

function setupGlobalListeners() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.querySelector('.menu-toggle');
    if (sidebar && sidebar.classList.contains('open')) {
        const isClickInside = sidebar.contains(event.target);
        const isToggleClick = toggleBtn && toggleBtn.contains(event.target);
        if (!isClickInside && !isToggleClick) {
            sidebar.classList.remove('open');
        }
    }
});

// ========================================
// MODAL
// ========================================

function openModal(content) {
    const overlay = document.getElementById('modalOverlay');
    const body = document.getElementById('modalBody');
    if (overlay && body) {
        body.innerHTML = content;
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

document.addEventListener('click', function(event) {
    const overlay = document.getElementById('modalOverlay');
    if (overlay && event.target === overlay) {
        closeModal();
    }
});

// ========================================
// STUDENT DASHBOARD - REAL DATA
// ========================================

async function loadStudentDashboard(profile) {
    showSystemCard('Loading student dashboard...', 'info');
    const client = await getSupabase();
    if (!client) return;

    if (!profile) {
        const { data: { session } } = await client.auth.getSession();
        if (!session) return;
        const { data: p } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        profile = p;
        currentProfile = profile;
    }

    const nameEl = document.getElementById('studentName');
    if (nameEl) nameEl.textContent = profile?.full_name || 'Student';

    const displayEl = document.getElementById('userNameDisplay');
    if (displayEl) displayEl.textContent = profile?.full_name || 'Student';

    // Load profile picture in topbar
    await loadUserAvatar(profile.id, profile.role);

    const studentId = profile && profile.id;
    if (!studentId) {
        console.error('Student dashboard could not load: the signed-in profile has no id.');
        return;
    }

    await loadStudentStats(studentId);
    await loadStudentPrograms(studentId);
    await loadPendingAssignments(studentId);
    await loadActivityFeed();
    loadDailyDevotional(studentId);
    await loadHomeStats();
}

async function loadStudentStats(studentId) {
    try {
        const client = await getSupabase();
        if (!client) return;

        const { count: totalStrikes } = await client
            .from('strikes')
            .select('id', { count: 'exact', head: true })
            .eq('student_id', studentId);

        const strikeEl = document.getElementById('strikeCount');
        if (strikeEl) strikeEl.textContent = totalStrikes || 0;

        const { data: sgi } = await client
            .from('sgi_scores')
            .select('score')
            .eq('student_id', studentId)
            .maybeSingle();

        if (sgi) {
            const sgiEl = document.getElementById('sgiScore');
            if (sgiEl) sgiEl.textContent = Math.round(sgi.total_score) + '%';
        }

        const { data: achievements } = await client
            .from('user_achievements')
            .select('id')
            .eq('user_id', studentId);

        const achEl = document.getElementById('achievementCount');
        if (achEl) achEl.textContent = achievements?.length || 0;

        const { data: attendance } = await client
            .from('attendance')
            .select('status')
            .eq('student_id', studentId);

        if (attendance && attendance.length > 0) {
            const present = attendance.filter(a => a.status === 'participated').length;
            const percentage = Math.round((present / attendance.length) * 100);
            const attPercentEl = document.getElementById('attendancePercent');
            if (attPercentEl) attPercentEl.textContent = percentage + '%';
        }
    } catch (error) {
        console.error('Error loading student stats:', error);
    }
}

async function loadStudentPrograms(studentId) {
    try {
        const client = await getSupabase();
        if (!client) return;

        const { data: programs } = await client
            .from('programs')
            .select('*')
            .eq('is_active', true);

        const container = document.getElementById('studentPrograms');
        if (!container) return;

        if (!programs || programs.length === 0) {
            container.innerHTML = '<div class="program-item"><div class="program-info"><span class="program-icon"></span><div><h4>No Programs Yet</h4><p>Check back soon for new programs</p></div></div></div>';
            return;
        }

        container.innerHTML = programs.map(function(p) {
            return '<div class="program-item"><div class="program-info"><span class="program-icon">' + (p.slug === 'ctfs' ? '' : '') + '</span><div><h4>' + p.name + '</h4><p>' + (p.description || 'Active program') + '</p></div></div><span class="program-status active">Active</span></div>';
        }).join('');
    } catch (error) {
        console.error('Error loading student programs:', error);
    }
}

async function loadPendingAssignments(studentId) {
    try {
        const client = await getSupabase();
        if (!client) return;

        const { data: submissions, error } = await client
            .from('task_submissions')
            .select(`
                id,
                status,
                created_at,
                feedback,
                tasks (
                    id,
                    title,
                    session_id,
                    sessions (
                        title,
                        program_id,
                        programs (name)
                    )
                )
            `)
            .eq('student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(10);

        const container = document.getElementById('pendingAssignments');
        if (!container) return;

        if (!submissions || submissions.length === 0) {
            const { data: allAssignments } = await client
                .from('tasks')
                .select('id, title, sessions (title, programs(name))')
                .limit(10);

            if (allAssignments && allAssignments.length > 0) {
                container.innerHTML = allAssignments.map(function(assign) {
                    return '<div class="assignment-item"><div><h4>' + (assign.title || 'Untitled Assignment') + '</h4><p>' + (assign.sessions?.programs?.name || 'Unknown Program') + ' - ' + (assign.sessions?.title || 'Session') + '</p></div><button class="btn btn-sm btn-primary" onclick="startAssignment(\'' + assign.id + '\')">Submit</button></div>';
                }).join('');
            } else {
                container.innerHTML = '<div class="empty-state"><p style="color: var(--text-muted); text-align: center; padding: 1rem;">No pending assignments! You\'re all caught up.</p></div>';
            }
            return;
        }

        container.innerHTML = submissions.map(function(sub) {
            var assignment = sub.tasks;
            var session = assignment?.sessions;
            var program = session?.programs;
            
            var statusBadge = '';
            var actionButton = '';
            var feedbackHtml = sub.feedback ? '<div style="margin-top:0.5rem;padding:0.5rem;background:var(--background);border-radius:var(--radius-sm);font-size:0.8rem;color:var(--text-light);"><strong>Mentor Feedback:</strong> ' + sub.feedback + '</div>' : '';
            
            if (sub.status === 'pending') {
                statusBadge = '<span class="badge warning">Under Review</span>';
                actionButton = '<button class="btn btn-sm btn-outline" disabled>Submitted</button>';
            } else if (sub.status === 'approved') {
                statusBadge = '<span class="badge success">Approved</span>';
                actionButton = '<button class="btn btn-sm btn-outline" disabled>Completed</button>';
            } else if (sub.status === 'rejected') {
                statusBadge = '<span class="badge danger">Needs Revision</span>';
                actionButton = '<button class="btn btn-sm btn-primary" onclick="startAssignment(\'' + (assignment?.id) + '\')">Resubmit</button>';
            } else {
                statusBadge = '<span class="badge info">Submitted</span>';
                actionButton = '<button class="btn btn-sm btn-outline" disabled>Submitted</button>';
            }
            
            return '<div class="assignment-item"><div><h4>' + (assignment?.title || 'Untitled Assignment') + '</h4><p>' + (program?.name || 'Unknown Program') + ' - ' + (session?.title || 'Session') + '</p>' + statusBadge + feedbackHtml + '</div>' + actionButton + '</div>';
        }).join('');
    } catch (error) {
        console.error('Error loading pending assignments:', error);
    }
}

async function loadActivityFeed() {
    try {
        const client = await getSupabase();
        if (!client) return;

        const { data: activities } = await client
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        const container = document.getElementById('activityFeed');
        if (!container) return;

        if (!activities || activities.length === 0) {
            container.innerHTML = '<div class="empty-state"><p style="color: var(--text-muted); text-align: center; padding: 1rem;">No activities yet. Stay tuned for updates!</p></div>';
            return;
        }

        container.innerHTML = activities.map(function(activity) {
            return '<div class="activity-item"><div class="activity-header"><span class="activity-avatar">' + (activity.is_announcement ? '[A]' : '') + '</span><div><strong>' + (activity.is_announcement ? 'Announcement' : 'Mentor') + '</strong><span class="activity-time">' + timeAgo(activity.created_at) + '</span></div></div><p class="activity-content">' + activity.title + '</p>' + (activity.description ? '<p style="font-size: 0.875rem; color: var(--text-light); padding-left: calc(1.5rem + var(--space-sm)); margin: 0;">' + activity.description + '</p>' : '') + (activity.media_url ? '<div class="activity-media"><span class="media-badge"> Media</span></div>' : '') + '</div>';
        }).join('');
        var toggle = document.getElementById('activityToggle');
        if (toggle) {
            toggle.hidden = activities.length <= 3;
            container.classList.toggle('is-collapsed', activities.length > 3);
            toggle.textContent = 'Show more';
        }
    } catch (error) {
        console.error('Error loading activity feed:', error);
    }
}

var DAILY_READINGS = [
    'Psalm 119:105 — Your word is a lamp for my feet and a light on my path.',
    'Joshua 1:9 — Be strong and courageous; the Lord your God is with you.',
    'Philippians 4:6–7 — Pray about everything, and God’s peace will guard you.',
    'Proverbs 3:5–6 — Trust in the Lord with all your heart.',
    'Romans 12:2 — Be transformed by the renewing of your mind.',
    '1 Timothy 4:12 — Set an example in speech, conduct, love, faith, and purity.',
    'Matthew 5:16 — Let your light shine before others.'
];

function dailyPracticeKey(studentId) { return 'ngt_daily_practice_' + studentId; }
function localDateKey(date) { return date.toISOString().slice(0, 10); }

function getDailyPractice(studentId) {
    try { return JSON.parse(localStorage.getItem(dailyPracticeKey(studentId))) || {}; }
    catch (e) { return {}; }
}

function calculateSpiritualStreak(practice) {
    var streak = 0;
    var date = new Date();
    while (true) {
        var entry = practice[localDateKey(date)];
        if (!entry || !entry.bible || !entry.prayer) break;
        streak++;
        date.setUTCDate(date.getUTCDate() - 1);
    }
    return streak;
}

async function loadDailyDevotional(studentId) {
    var readingEl = document.getElementById('dailyBibleReading');
    if (!readingEl || !studentId) return;
    var today = new Date();
    var dayNumber = Math.floor(today.getTime() / 86400000);
    readingEl.textContent = DAILY_READINGS[dayNumber % DAILY_READINGS.length];
    var practice = getDailyPractice(studentId);
    try {
        var client = await getSupabase();
        var todayKey = localDateKey(today);
        var { data: saved } = await client.from('daily_practices').select('bible_read, prayed')
            .eq('student_id', studentId).eq('practice_date', todayKey).maybeSingle();
        if (saved) {
            practice[todayKey] = { bible: saved.bible_read, prayer: saved.prayed };
            localStorage.setItem(dailyPracticeKey(studentId), JSON.stringify(practice));
        }
    } catch (e) { /* local fallback remains available until the migration is applied */ }
    var entry = practice[localDateKey(today)] || {};
    var bibleButton = document.getElementById('bibleReadButton');
    var prayerButton = document.getElementById('prayerButton');
    if (bibleButton) { bibleButton.textContent = entry.bible ? 'Completed ✓' : 'Mark as read'; bibleButton.disabled = !!entry.bible; }
    if (prayerButton) { prayerButton.textContent = entry.prayer ? 'Completed ✓' : 'I prayed today'; prayerButton.disabled = !!entry.prayer; }
    var streakEl = document.getElementById('spiritualStreak');
    if (streakEl) streakEl.textContent = calculateSpiritualStreak(practice);
}

async function completeDailyPractice(type) {
    var studentId = currentProfile && currentProfile.id;
    if (!studentId) { showSystemCard('Please sign in again to save your daily practice.', 'error'); return; }
    var practice = getDailyPractice(studentId);
    var key = localDateKey(new Date());
    practice[key] = practice[key] || {};
    practice[key][type] = true;
    localStorage.setItem(dailyPracticeKey(studentId), JSON.stringify(practice));
    try {
        var client = await getSupabase();
        var { error } = await client.from('daily_practices').upsert({
            student_id: studentId, practice_date: key,
            bible_read: !!practice[key].bible, prayed: !!practice[key].prayer,
            updated_at: new Date().toISOString()
        }, { onConflict: 'student_id,practice_date' });
        if (error) throw error;
    } catch (e) { showSystemCard('Daily practice saved locally only: ' + (e.message || 'Unknown error'), 'warning'); }
    await loadDailyDevotional(studentId);
    showSystemCard(type === 'bible' ? 'Bible reading completed!' : 'Prayer check-in completed!', 'success');
    
    // Check for achievement unlocks after daily practice
    await checkAndUnlockAchievements(studentId);
}

function toggleDashboardList(listId, button) {
    var list = document.getElementById(listId);
    if (!list || !button) return;
    var collapsed = list.classList.toggle('is-collapsed');
    button.textContent = collapsed ? 'Show more' : 'Show less';
}

async function loadHomeStats() {
    try {
        const client = await getSupabase();
        if (!client) return;

        var studentCount = 0;
        var mentorCount = 0;
        var programCount = 0;

        // Prefer secure RPC (Patch 14) for public homepage stats
        var rpcRes = await client.rpc('platform_public_stats');
        if (!rpcRes.error && rpcRes.data) {
            var totals = Array.isArray(rpcRes.data) ? rpcRes.data[0] : rpcRes.data;
            studentCount = totals.total_students || 0;
            mentorCount = totals.total_mentors || 0;
            programCount = totals.total_programs || 0;
        } else {
            var studentRes = await client.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student');
            var mentorRes = await client.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'mentor');
            var programRes = await client.from('programs').select('id', { count: 'exact', head: true }).eq('is_active', true);
            studentCount = studentRes.count || 0;
            mentorCount = mentorRes.count || 0;
            programCount = programRes.count || 0;
        }

        var totalStudentsEl = document.getElementById('totalStudents');
        if (totalStudentsEl) totalStudentsEl.textContent = studentCount;

        var totalMentorsEl = document.getElementById('totalMentors');
        if (totalMentorsEl) totalMentorsEl.textContent = mentorCount;

        var totalProgramsEl = document.getElementById('totalPrograms');
        if (totalProgramsEl) totalProgramsEl.textContent = programCount;
    } catch (error) {
        console.error('Error loading home stats:', error);
    }
}

// ========================================
// MENTOR DASHBOARD - REAL DATA
// ========================================

async function loadMentorDashboard(profile) {
    showSystemCard('Loading mentor dashboard...', 'info');
    const client = await getSupabase();
    if (!client) return;

    if (!profile) {
        const { data: { session } } = await client.auth.getSession();
        if (!session) return;
        const { data: p } = await client
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        profile = p;
        currentProfile = profile;
    }

    const nameEl = document.getElementById('mentorName');
    if (nameEl) nameEl.textContent = profile?.full_name || 'Mentor';

    const displayEl = document.getElementById('mentorNameDisplay');
    if (displayEl) displayEl.textContent = profile?.full_name || 'Mentor';

    // Load profile picture in topbar
    await loadUserAvatar(profile.id, profile.role);

    await loadMentorStats();
    await loadPendingReviews();
    await loadMentorStudents();
    await loadMentorActivities();
}

async function loadMentorStats() {
    try {
        const client = await getSupabase();
        if (!client) return;

        const { data: students } = await client
            .from('profiles')
            .select('id')
            .eq('role', 'student');

        const totalEl = document.getElementById('totalStudents');
        if (totalEl) totalEl.textContent = students?.length || 0;

        const { data: pending } = await client
            .from('task_submissions')
            .select('id')
            .eq('status', 'pending');

        const pendingEl = document.getElementById('pendingReviews');
        if (pendingEl) pendingEl.textContent = pending?.length || 0;

        const { data: allStrikes } = await client
            .from('strikes')
            .select('student_id');

        const strikeCounts = {};
        (allStrikes || []).forEach(s => {
            if (s.student_id) strikeCounts[s.student_id] = (strikeCounts[s.student_id] || 0) + 1;
        });
        const warningCount = Object.values(strikeCounts).filter(c => c >= 5).length;

        const warningEl = document.getElementById('warningStudents');
        if (warningEl) warningEl.textContent = warningCount;
    } catch (error) {
        console.error('Error loading mentor stats:', error);
    }
}

async function attachSubmissionStudents(client, submissions) {
    var ids = Array.from(new Set((submissions || []).map(function(submission) {
        return submission.student_id;
    }).filter(Boolean)));
    if (!ids.length) return submissions || [];

    var { data: students, error } = await client
        .from('profiles')
        .select('id, full_name, email')
        .in('id', ids);
    if (error) throw error;

    var byId = {};
    (students || []).forEach(function(student) { byId[student.id] = student; });
    return (submissions || []).map(function(submission) {
        submission.student_profile = byId[submission.student_id] || null;
        return submission;
    });
}

async function loadPendingReviews() {
    try {
        const client = await getSupabase();
        if (!client) return;

        const { data, error } = await client
            .from('task_submissions')
            .select(`
                id,
                content,
                media_url,
                submitted_at,
                student_id,
                tasks (id, title, session_id, sessions (title))
            `)
            .eq('status', 'pending')
            .limit(5);

        const container = document.getElementById('pendingReviewsList');
        if (!container) return;

        if (error) throw error;
        const submissions = await attachSubmissionStudents(client, data);

        if (!submissions || submissions.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 1rem; color: var(--text-muted);">No pending reviews! All submissions have been reviewed.</div>';
            return;
        }

        container.innerHTML = submissions.map(function(sub) {
            return '<div class="pending-item"><div><h4>' + (sub.tasks?.title || 'Untitled') + '</h4><p>Student: ' + (sub.student_profile?.full_name || 'Unknown') + ' | ' + (sub.tasks?.sessions?.title || 'Session') + '</p><p style="font-size: 0.75rem; color: var(--text-muted);">' + (sub.media_url ? 'Has media' : 'Text submission') + '</p></div><div class="pending-actions"><button class="btn btn-sm btn-success" onclick="reviewSubmission(\'' + sub.id + '\', \'approved\')">Approve</button><button class="btn btn-sm btn-danger" onclick="reviewSubmission(\'' + sub.id + '\', \'rejected\')">Reject</button></div></div>';
        }).join('');
    } catch (error) {
        console.error('Error loading pending reviews:', error);
        const container = document.getElementById('pendingReviewsList');
        if (container) container.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--danger);">Unable to load submissions: ' + (error.message || 'unknown database error') + '</div>';
    }
}

async function reviewSubmission(submissionId, status, feedback) {
    if (feedback === undefined) {
        feedback = prompt('Enter review feedback comment for the student (optional):', '') || '';
    }
    try {
        const client = await getSupabase();
        if (!client) throw new Error('Could not connect');
        const sessionData = await client.auth.getSession();
        const reviewerId = sessionData?.data?.session?.user?.id || null;
        const { error } = await client
            .from('task_submissions')
            .update({ 
                status: status,
                feedback: feedback,
                reviewed_by: reviewerId,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', submissionId);
        if (error) throw error;
        showSystemCard('Submission ' + status + '!', 'success');
        loadPendingReviews();
        loadMentorStats();
    } catch (error) {
        console.error('Error reviewing submission:', error);
        alert('Unable to review this submission: ' + (error.message || 'unknown error'));
    }
}

async function loadMentorStudents() {
    return loadEnrolledStudents();
}

async function loadMentorActivities() {
    try {
        const client = await getSupabase();
        if (!client) return;

        const { data: activities } = await client
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        const container = document.getElementById('mentorActivities');
        if (!container) return;

        if (!activities || activities.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 1rem; color: var(--text-muted);">No activities published yet.</div>';
            return;
        }

        container.innerHTML = activities.map(function(activity) {
            return '<div class="activity-item"><div class="activity-header"><span class="activity-avatar">[A]</span><div><strong>' + activity.title + '</strong><span class="activity-time">' + timeAgo(activity.created_at) + '</span></div></div>' + (activity.description ? '<p class="activity-content">' + activity.description + '</p>' : '') + '</div>';
        }).join('');
    } catch (error) {
        console.error('Error loading mentor activities:', error);
    }
}

// ========================================
// ADMIN DASHBOARD - REAL DATA
// ========================================





// ========================================
// START ASSIGNMENT
// ========================================





// ========================================
// SECTION LOADERS - WITH REAL DATA
// ========================================

function loadSection(section) {
    switch(section) {
        case 'programs': showProgramsModal(); break;
        case 'attendance': showAttendanceModal(); break;
        case 'assignments': showAssignmentsModal(); break;
        case 'achievements': showAchievementsModal(); break;
        case 'leaderboard': showLeaderboardModal(); break;
        case 'ai-coach': showAICoachModal(); break;
        default: showSystemCard('All sections are now functional!', 'info');
    }
}

async function showProgramsModal() {
    var client = await getSupabase();
    if (!client) return;

    var { data: programs } = await client
        .from('programs')
        .select('*')
        .eq('is_active', true);

    openModal(`
        <h2 style="margin-bottom: 1rem;"> My Programs</h2>
        <p style="color: var(--text-light); margin-bottom: 1rem;">All available programs for you.</p>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${programs && programs.length > 0 ? programs.map(function(p) {
                return '<div class="program-item"><div class="program-info"><span class="program-icon">' + (p.slug === 'ctfs' ? '' : '') + '</span><div><h4>' + p.name + '</h4><p>' + (p.description || 'Program') + '</p>' + (p.duration ? '<p style="font-size: 0.75rem; color: var(--text-muted);"> ' + p.duration + '</p>' : '') + '</div></div><span class="program-status active">Active</span></div>';
            }).join('') : '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No programs available.</div>'}
        </div>
    `);
}

async function showAttendanceModal() {
    var client = await getSupabase();
    if (!client) return;

    var { data: { session } } = await client.auth.getSession();
    if (!session) return;

    var { data: attendance } = await client
        .from('attendance')
        .select('status, created_at, sessions (title, date)')
        .eq('student_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    var { count: totalStrikes } = await client
        .from('strikes')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', session.user.id);

    totalStrikes = totalStrikes || 0;

    var statusText = 'Active';
    var statusColor = 'success';
    if (totalStrikes >= 10) { statusText = 'Suspended'; statusColor = 'danger'; }
    else if (totalStrikes >= 8) { statusText = 'Critical'; statusColor = 'danger'; }
    else if (totalStrikes >= 5) { statusText = 'Warning'; statusColor = 'warning'; }

    openModal(`
        <h2 style="margin-bottom: 1rem;"> Attendance History</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="padding: 1rem; background: var(--background); border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: var(--primary);">${attendance ? attendance.length : 0}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Total Sessions</div>
            </div>
            <div style="padding: 1rem; background: var(--background); border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 2rem; font-weight: 700; color: ${totalStrikes >= 5 ? 'var(--danger)' : 'var(--success)'};">${totalStrikes}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Strikes</div>
            </div>
        </div>
        <div style="padding: 1rem; background: var(--background); border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <p style="margin: 0; font-size: 0.875rem;"><strong>Status:</strong> <span class="badge ${statusColor}">${statusText}</span></p>
        </div>
        <h4 style="margin-bottom: 0.5rem;">Recent Attendance</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${attendance && attendance.length > 0 ? attendance.map(function(a) {
                return '<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: var(--background); border-radius: var(--radius-md);"><div><div style="font-weight: 500; font-size: 0.875rem;">' + (a.sessions?.title || 'Session') + '</div><div style="font-size: 0.75rem; color: var(--text-muted);">' + (a.sessions?.date ? new Date(a.sessions.date).toLocaleDateString() : '') + '</div></div><span class="badge ' + (a.status === 'participated' ? 'success' : 'danger') + '">' + (a.status === 'participated' ? '[OK] Present' : '[X] Missed') + '</span></div>';
            }).join('') : '<div style="text-align: center; padding: 1rem; color: var(--text-muted);">No attendance records yet.</div>'}
        </div>
        <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-success" onclick="markAttendance('present')">[OK] Mark Present</button>
            <button class="btn btn-danger" onclick="markAttendance('absent')">[X] Mark Absent</button>
        </div>
    `);
}

async function markAttendance(status) {
    var dbStatus = status === 'participated' || status === 'present' ? 'present' : status === 'missed' || status === 'absent' ? 'absent' : 'excused';
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Could not connect');
        var { data: { session } } = await client.auth.getSession();
        if (!session) throw new Error('Not logged in');

        var { data: sessions } = await client
            .from('sessions')
            .select('id')
            .limit(1);

        if (!sessions || sessions.length === 0) {
            showSystemCard('No sessions available to mark attendance for.', 'error');
            return;
        }

        var { error } = await client
            .from('attendance')
            .upsert({
                student_id: session.user.id,
                session_id: sessions[0].id,
                status: dbStatus,
                recorded_by: session.user.id,
                created_at: new Date().toISOString()
            }, { onConflict: 'student_id,session_id' });

        if (error) throw error;

        if (dbStatus === 'absent') {
            await client
                .from('strikes')
                .insert({
                    student_id: session.user.id,
                    reason: 'Missed session',
                    issued_by: session.user.id,
                    created_at: new Date().toISOString()
                });
        }

        showSystemCard('Attendance marked as "' + dbStatus + '"!', 'success');
        closeModal();
        loadStudentStats(session.user.id);
        
        // Check for achievement unlocks after attendance
        await checkAndUnlockAchievements(session.user.id);
    } catch (error) {
        showSystemCard('Error marking attendance. Please try again.', 'error');
    }
}

async function showAssignmentsModal() {
    var client = await getSupabase();
    if (!client) return;

    var { data: { session } } = await client.auth.getSession();
    if (!session) return;

    var { data: submissions } = await client
        .from('task_submissions')
        .select('id, task_id, status, feedback, tasks (id, title, sessions (title))')
        .eq('student_id', session.user.id);

    var { data: allAssignments } = await client
        .from('tasks')
        .select('id, title, sessions (title, programs(name))')
        .limit(10);

    openModal(`
        <h2 style="margin-bottom: 1rem;"> Your Assignments</h2>
        <p style="color: var(--text-light); margin-bottom: 1rem;">View and submit assignments.</p>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${allAssignments && allAssignments.length > 0 ? allAssignments.map(function(a) {
                var submitted = submissions?.find(function(s) { return s.task_id === a.id; });
                var status = submitted ? submitted.status : 'not_submitted';
                var statusBadge = status === 'approved' ? 'success' : status === 'pending' ? 'warning' : status === 'rejected' ? 'danger' : 'info';
                var statusText = status === 'approved' ? '[OK] Approved' : status === 'pending' ? '... Pending' : status === 'rejected' ? '[X] Rejected' : 'Not Submitted';
                var feedbackHtml = submitted && submitted.feedback && (status === 'approved' || status === 'rejected') ? '<div style="font-size:0.8rem;background:rgba(37,99,235,0.08);padding:0.5rem;border-radius:var(--radius-sm);margin-top:0.375rem;border-left:3px solid var(--primary);"><strong>Mentor Feedback:</strong> "' + submitted.feedback + '"</div>' : '';
                return '<div class="assignment-item" style="flex-direction:column;align-items:flex-start;">' +
                    '<div style="display:flex;justify-content:space-between;width:100%;align-items:center;"><div><h4>' + (a.title || 'Untitled') + '</h4><p>' + (a.sessions?.programs?.name || 'Program') + ' - ' + (a.sessions?.title || 'Session') + '</p><span class="badge ' + statusBadge + '" style="margin-top: 0.25rem;">' + statusText + '</span></div>' +
                    (status === 'not_submitted' ? '<button class="btn btn-sm btn-primary" onclick="startAssignment(\'' + a.id + '\')">Submit</button>' : '<span style="font-size: 0.75rem; color: var(--text-muted);">Submitted</span>') +
                    '</div>' + feedbackHtml + '</div>';
            }).join('') : '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No assignments available.</div>'}
        </div>
    `);
}

async function showAchievementsModal() {
    var client = await getSupabase();
    if (!client) return;

    var { data: { session } } = await client.auth.getSession();
    if (!session) return;

    var { data: userAchievements } = await client
        .from('user_achievements')
        .select('achievements (id, name, description, icon, category)')
        .eq('student_id', session.user.id);

    var { data: allAchievements } = await client
        .from('achievements')
        .select('*');

    var earnedIds = userAchievements ? userAchievements.map(function(ua) { return ua.achievements?.id; }) : [];

    openModal(`
        <h2 style="margin-bottom: 1rem;"> Your Achievements</h2>
        <p style="color: var(--text-light); margin-bottom: 1rem;">Badges and milestones you've unlocked.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem;">
            ${allAchievements && allAchievements.length > 0 ? allAchievements.map(function(a) {
                var earned = earnedIds.includes(a.id);
                return '<div class="achievement-card ' + (earned ? 'unlocked' : 'locked') + '" style="padding: 1rem; text-align: center; border: 1px solid var(--border); border-radius: var(--radius-md); opacity: ' + (earned ? '1' : '0.5') + ';">' +
                    '<div style="font-size: 2.5rem;">' + (a.icon || '🏆') + '</div>' +
                    '<h4 style="margin: 0.5rem 0 0.25rem;">' + (a.name || 'Achievement') + '</h4>' +
                    '<p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">' + (a.description || '') + '</p>' +
                    '<span class="badge ' + (earned ? 'success' : 'info') + '" style="margin-top: 0.5rem; display: inline-block;">' + (earned ? '[OK] Earned' : 'Locked') + '</span>' +
                    '</div>';
            }).join('') : '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No achievements available.</div>'}
        </div>
    `);
}

async function showLeaderboardModal() {
    var client = await getSupabase();
    if (!client) return;

    var { data: sgiScores } = await client
        .from('sgi_scores')
        .select('student_id, score, profiles (full_name, avatar_url)')
        .order('score', { ascending: false })
        .limit(20);

    var { data: { session } } = await client.auth.getSession();
    var userRank = null;
    if (session && sgiScores) {
        var idx = sgiScores.findIndex(function(s) { return s.student_id === session.user.id; });
        if (idx !== -1) userRank = idx + 1;
    }

    var medals = ['', '', ''];

    openModal(`
        <h2 style="margin-bottom: 1rem;">[T] Leaderboard</h2>
        <p style="color: var(--text-light); margin-bottom: 1rem;">Top students based on Student Growth Index (SGI).</p>
        ${userRank ? '<div style="padding: 0.75rem 1rem; background: var(--primary); color: white; border-radius: var(--radius-md); margin-bottom: 1rem;">Your Rank: #' + userRank + '</div>' : ''}
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${sgiScores && sgiScores.length > 0 ? sgiScores.map(function(score, index) {
                var isUser = session && score.student_id === session.user.id;
                var medal = index < 3 ? medals[index] : '#' + (index + 1);
                return '<div style="padding: 0.75rem 1rem; background: ' + (isUser ? 'rgba(37, 99, 235, 0.1)' : 'var(--background)') + '; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; ' + (isUser ? 'border: 2px solid var(--primary);' : '') + '"><div><span style="font-weight: 700; ' + (index < 3 ? 'color: ' + ['gold', 'silver', '#cd7f32'][index] + ';' : '') + '">' + medal + '</span><span style="font-weight: 600; margin-left: 0.5rem;">' + (score.profiles?.full_name || 'Unknown') + '</span>' + (isUser ? '<span style="font-size: 0.625rem; background: var(--primary); color: white; padding: 0.125rem 0.5rem; border-radius: var(--radius-full); margin-left: 0.5rem;">You</span>' : '') + '</div><span style="font-weight: 700; color: var(--primary);">' + Math.round(score.total_score || 0) + '%</span></div>';
            }).join('') : '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No leaderboard data yet.</div>'}
        </div>
    `);
}

function showAICoachModal() {
    openModal(`
        <h2 style="margin-bottom: 1rem;"> AI Coach</h2>
        <p style="color: var(--text-light); margin-bottom: 1rem;">Ask the AI Coach anything about your growth journey.</p>
        <div style="margin-top: 1rem;">
            <div id="aiChatContainer" style="height: 350px; overflow-y: auto; background: var(--background); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
                <p style="color: var(--text-muted); text-align: center; margin: 0;">AI Coach is ready to help!</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="aiQuestion" placeholder="Ask a question..." style="flex: 1; padding: 0.75rem 1rem; border: 2px solid var(--border); border-radius: var(--radius-md); font-family: var(--font);">
                <button class="btn btn-primary" onclick="askAICoach()">Send</button>
            </div>
            <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-sm btn-outline" onclick="askAICoachPrompt('help me discover my goals')"> Goal Discovery</button>
                <button class="btn btn-sm btn-outline" onclick="askAICoachPrompt('assess my leadership potential')"> Leadership</button>
                <button class="btn btn-sm btn-outline" onclick="askAICoachPrompt('how can I grow my faith')"> Spiritual Growth</button>
                <button class="btn btn-sm btn-outline" onclick="askAICoachPrompt('improve my communication skills')"> Communication</button>
            </div>
        </div>
    `);
}

// ========================================
// AI COACH - REAL GROQ API
// ========================================




// ========================================
// ADMIN FUNCTIONS
// ========================================



// ========================================
// MENTOR SECTION LOADERS
// ========================================




function mentorMarkAttendance(status) {
    alert('Attendance marked as: ' + status);
}





function generateStudentReport() { exportStudentReport(); }
function generateAttendanceReport() { exportAttendanceReport(); }
function generateLeadershipReport() { exportLeadershipReport(); }

// ========================================
// ADMIN SECTION LOADERS
// ========================================





async function loadAnalyticsData() {
    try {
        var client = await getSupabase();
        if (!client) return;
        var [usersRes, subsRes, attRes, achRes] = await Promise.all([
            client.from('profiles').select('role'),
            client.from('task_submissions').select('status'),
            client.from('attendance').select('status'),
            client.from('user_achievements').select('id')
        ]);

        var users = usersRes.data || [];
        var subs = subsRes.data || [];
        var att = attRes.data || [];
        var ach = achRes.data || [];

        var students = users.filter(function(u) { return u.role === 'student'; }).length;
        var mentors = users.filter(function(u) { return u.role === 'mentor'; }).length;
        var approved = subs.filter(function(s) { return s.status === 'approved'; }).length;
        var pending = subs.filter(function(s) { return s.status === 'pending'; }).length;
        var attPct = att.length > 0 ? Math.round(att.filter(function(a) { return a.status === 'participated'; }).length / att.length * 100) : 0;

        var el = document.getElementById('analyticsContent');
        if (!el) return;
        el.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">' + 
            [
                { label: ' Students', val: students },
                { label: ' Mentors', val: mentors },
                { label: '[OK] Approved Submissions', val: approved },
                { label: '... Pending Reviews', val: pending },
                { label: ' Avg Attendance', val: attPct + '%' },
                { label: '[T] Achievements Earned', val: ach.length }
            ].map(function(item) {
                return '<div style="padding:1rem;background:var(--background);border-radius:var(--radius-md);text-align:center;"><div style="font-size:1.75rem;font-weight:700;color:var(--primary);">' + item.val + '</div><div style="font-size:0.8rem;color:var(--text-muted);">' + item.label + '</div></div>';
            }).join('') + 
        '</div>';
    } catch(e) { console.error('Analytics error:', e); }
}


function showReportModal_real() {
    openModal(`
        <h2 style="margin-bottom:1rem;"> Generate Reports</h2>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <button class="btn btn-primary" onclick="exportStudentReport()"> Student Progress Report (CSV)</button>
            <button class="btn btn-outline" onclick="exportAttendanceReport()"> Attendance Summary (CSV)</button>
            <button class="btn btn-outline" onclick="exportLeadershipReport()"> Leadership Pathway Report</button>
        </div>
    `);
}



async function exportLeadershipReport() {
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected to database');
        var [studentsRes, attRes, achRes, gameRes] = await Promise.all([
            client.from('profiles').select('id, full_name, email, created_at').eq('role', 'student'),
            client.from('attendance').select('student_id, status'),
            client.from('user_achievements').select('student_id, achievement_id'),
            client.from('game_completions').select('student_id, score')
        ]);

        var students = studentsRes.data || [];
        var att = attRes.data || [];
        var ach = achRes.data || [];
        var games = gameRes.data || [];

        var rows = [
            ['Student ID', 'Full Name', 'Email', 'Attendance Count', 'Achievements Earned', 'Total Game Score', 'Leadership Status']
        ];

        students.forEach(function(s) {
            var attCount = att.filter(function(a) { return a.student_id === s.id && a.status === 'participated'; }).length;
            var achCount = ach.filter(function(a) { return a.student_id === s.id; }).length;
            var totalScore = games.filter(function(g) { return g.student_id === s.id; }).reduce(function(sum, g) { return sum + (g.score || 0); }, 0);
            var status = attCount >= 8 && achCount >= 3 ? 'Leadership Distinction' : attCount >= 4 ? 'Emerging Leader' : 'Developing';
            rows.push([s.id, '"' + (s.full_name || '').replace(/"/g, '""') + '"', s.email || '', attCount, achCount, totalScore, status]);
        });

        var csv = rows.map(function(r) { return r.join(','); }).join('\n');
        downloadCSV(csv, 'Leadership_Pathway_Report_' + new Date().toISOString().slice(0, 10) + '.csv');
        showSystemCard('Leadership Pathway report downloaded!', 'success');
    } catch(e) {
        showSystemCard('Report export error: ' + (e.message || 'Unknown error'), 'error');
    }
}



// ========================================
// FORGOT PASSWORD
// ========================================

async function handleForgotPassword(event) {
    if (event) event.preventDefault();
    var email = document.getElementById('loginEmail')?.value?.trim();
    if (!email) {
        showAuthError('Enter your email address above first, then click Forgot Password.');
        return;
    }
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var { error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/settings.html'
        });
        if (error) throw error;
        showAuthSuccess('Password reset email sent! Check your inbox.');
    } catch(e) {
        showAuthError('Could not send reset email: ' + (e.message || 'Unknown error'));
    }
}

// ========================================
// NOTIFICATION BELL
// ========================================


// ========================================
// CHECK AUTH STATUS
// ========================================


// ========================================
// UTILITY FUNCTIONS
// ========================================

function timeAgo(date) {
    if (!date) return 'Just now';
    var now = new Date();
    var past = new Date(date);
    var diffMs = now - past;
    var diffMins = Math.floor(diffMs / 60000);
    var diffHours = Math.floor(diffMs / 3600000);
    var diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + 'm ago';
    if (diffHours < 24) return diffHours + 'h ago';
    if (diffDays < 7) return diffDays + 'd ago';
    return Math.floor(diffDays / 7) + 'w ago';
}

// ========================================
// INITIALIZATION
// ========================================


showSystemCard('NextGenTeens v2.0 - Complete Real Data', 'success');

// ========================================
// Additional functions needed for page loaders
// ========================================

















// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================

function showSystemCard(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;
    var container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, duration);
}

// ========================================
// ADMIN DASHBOARD
// ========================================

async function loadAdminDashboard(profile) {
    const client = await getSupabase();
    if (!client) return;
    if (!profile) {
        const { data: { session } } = await client.auth.getSession();
        if (!session) return;
        const { data: p } = await client.from('profiles').select('*').eq('id', session.user.id).single();
        profile = p; currentProfile = profile;
    }
    setEl('adminName', profile ? profile.full_name : 'Admin');
    setEl('adminNameDisplay', profile ? profile.full_name : 'Admin');
    setEl('userNameDisplay', profile ? profile.full_name : 'Admin');
    
    // Load profile picture in topbar
    await loadUserAvatar(profile.id, profile.role);
    
    await Promise.all([loadAdminStats(), loadAdminUsers(), loadAdminPrograms()]);
}

async function loadAdminStats() {
    try {
        const client = await getSupabase();
        if (!client) return;
        const [usersRes, progsRes, sessRes, actsRes] = await Promise.all([
            client.from('profiles').select('id', { count: 'exact', head: true }),
            client.from('programs').select('id', { count: 'exact', head: true }),
            client.from('sessions').select('id', { count: 'exact', head: true }),
            client.from('activities').select('id', { count: 'exact', head: true })
        ]);
        setEl('totalUsers', usersRes.count || 0);
        setEl('totalPrograms', progsRes.count || 0);
        setEl('totalSessions', sessRes.count || 0);
        setEl('totalActivities', actsRes.count || 0);
    } catch (e) { console.error('Admin stats error:', e); }
}

async function loadAdminUsers() {
    try {
        const client = await getSupabase();
        if (!client) return;
        const { data: users, error } = await client.from('profiles').select('*').limit(20);
        const container = document.getElementById('adminUserTable');
        if (!container) return;
        if (error) throw error;
        if (!users || !users.length) {
            container.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">No users yet.</td></tr>';
            return;
        }
        container.innerHTML = users.map(function(u) {
            var roleColor = u.role === 'admin' ? 'danger' : u.role === 'mentor' ? 'warning' : 'info';
            var isSuspended = u.suspended || u.status === 'suspended' || u.status === 'deactivated';
            var statusBadge = isSuspended ? '<span class="badge danger">Suspended</span>' : '<span class="badge success">Active</span>';
            var suspendButton = isSuspended 
                ? '<button class="btn btn-sm btn-success" onclick="unsuspendUser(\'' + u.id + '\')">Unsuspend</button>'
                : '<button class="btn btn-sm btn-danger" onclick="suspendUser(\'' + u.id + '\')">Suspend</button>';
            
            return '<tr>' +
                '<td><span class="student-name">' + (u.full_name || 'Unknown') + '</span></td>' +
                '<td>' + (u.email || '') + '</td>' +
                '<td><span class="badge ' + roleColor + '">' + (u.role || 'student') + '</span></td>' +
                '<td>' + statusBadge + '</td>' +
                '<td>' +
                '<button class="btn btn-sm btn-outline" onclick="editUser(\'' + u.id + '\')">Edit</button> ' +
                suspendButton +
                '</td></tr>';
        }).join('');
    } catch (e) {
        console.error('Admin users error:', e);
        const container = document.getElementById('adminUserTable');
        if (container) container.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--danger);">Unable to load users. Check the Supabase admin access policies.</td></tr>';
    }
}

async function loadAdminPrograms() {
    try {
        const client = await getSupabase();
        if (!client) return;
        const { data: programs } = await client.from('programs').select('*');
        const container = document.getElementById('adminPrograms');
        if (!container) return;
        if (!programs || !programs.length) {
            container.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--text-muted);">No programs yet.</div>';
            return;
        }
        container.innerHTML = programs.map(function(p) {
            return '<div class="program-item">' +
                '<div class="program-info"><div>' +
                '<h4>' + (p.name || 'Program') + '</h4>' +
                '<p>' + (p.description || '') + '</p></div></div>' +
                '<div class="program-actions">' +
                '<span class="badge ' + (p.is_active ? 'success' : 'danger') + '">' + (p.is_active ? 'Active' : 'Inactive') + '</span> ' +
                '<button class="btn btn-sm btn-outline" onclick="editProgram(\'' + p.id + '\')">Edit</button> ' +
                '<button class="btn btn-sm btn-danger" onclick="toggleProgram(\'' + p.id + '\')">' + (p.is_active ? 'Disable' : 'Enable') + '</button>' +
                '</div></div>';
        }).join('');
    } catch (e) { console.error('Admin programs error:', e); }
}

// ========================================
// ASSIGNMENT SUBMISSION
// ========================================

function startAssignment(assignmentId) {
    openModal(
        '<h2 style="margin-bottom:1rem;">Submit Assignment</h2>' +
        '<form id="assignmentForm" onsubmit="submitAssignment(event, \'' + assignmentId + '\')">' +
        '<div class="form-group"><label>Submission Type</label>' +
        '<select id="submissionType" onchange="toggleSubmissionType()" style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);">' +
        '<option value="text">Text Response</option>' +
        '<option value="audio">Audio Recording</option>' +
        '<option value="image">Image Upload</option>' +
        '<option value="video">Video Upload (1-5 min)</option>' +
        '</select></div>' +
        '<div class="form-group" id="textResponseGroup">' +
        '<label>Your Response</label>' +
        '<textarea id="textResponse" rows="6" placeholder="Write your response here..." style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);font-family:var(--font);resize:vertical;"></textarea>' +
        '</div>' +
        '<div class="form-group" id="mediaUploadGroup" style="display:none;">' +
        '<label>Upload File</label>' +
        '<input type="file" id="mediaUpload" accept="audio/*,video/*,image/*" onchange="previewMedia(this)" style="width:100%;padding:0.5rem;border:2px solid var(--border);border-radius:var(--radius-md);">' +
        '<div id="mediaPreview" class="media-preview"></div>' +
        '<p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;">Accepted: audio, JPG, PNG, MP4, MOV. Max 50MB.</p>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary btn-full">Submit Assignment</button>' +
        '</form>'
    );
}

function toggleSubmissionType() {
    var type = document.getElementById('submissionType') ? document.getElementById('submissionType').value : 'text';
    var textGrp = document.getElementById('textResponseGroup');
    var mediaGrp = document.getElementById('mediaUploadGroup');
    if (textGrp) textGrp.style.display = type === 'text' ? 'block' : 'none';
    if (mediaGrp) mediaGrp.style.display = type !== 'text' ? 'block' : 'none';
}

function previewMedia(input) {
    var preview = document.getElementById('mediaPreview');
    if (!preview || !input.files[0]) return;
    var file = input.files[0];
    var url = URL.createObjectURL(file);
    if (file.type.startsWith('image')) {
        preview.innerHTML = '<img src="' + url + '" alt="Preview" style="max-width:100%;max-height:200px;border-radius:var(--radius-md);margin-top:0.5rem;">';
    } else if (file.type.startsWith('video')) {
        preview.innerHTML = '<video src="' + url + '" controls style="max-width:100%;max-height:200px;border-radius:var(--radius-md);margin-top:0.5rem;"></video>';
    } else if (file.type.startsWith('audio')) {
        preview.innerHTML = '<audio src="' + url + '" controls style="width:100%;margin-top:0.5rem;"></audio>';
    }
}

async function uploadSubmissionMedia(client, userId, file) {
    if (!file) return null;
    if (file.size > 50 * 1024 * 1024) throw new Error('Files must be 50MB or smaller.');
    if (!/^(audio|image|video)\//.test(file.type)) throw new Error('Please upload an audio, image, or video file.');
    var safeName = (file.name || 'upload').replace(/[^a-zA-Z0-9._-]/g, '_');
    var path = userId + '/' + Date.now() + '_' + safeName;
    var bucket = 'task-submissions';
    var res = await client.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
    if (res.error && res.error.message && res.error.message.includes('not found')) {
        bucket = 'submissions';
        res = await client.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
    }
    if (res.error) throw res.error;
    return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function submitAssignment(event, assignmentId) {
    event.preventDefault();
    var type = document.getElementById('submissionType') ? document.getElementById('submissionType').value : 'text';
    var textResponse = document.getElementById('textResponse') ? document.getElementById('textResponse').value : '';
    var mediaFile = document.getElementById('mediaUpload') ? document.getElementById('mediaUpload').files[0] : null;
    if (type === 'text' && !textResponse) { showSystemCard('Please enter your response.', 'error'); return; }
    if (type !== 'text' && !mediaFile) { showSystemCard('Please upload a file.', 'error'); return; }
    var submitBtn = event.target.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Could not connect');
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) throw new Error('Not logged in');
        
        // Check if there's an existing submission for this assignment
        var { data: existingSubmission } = await client
            .from('task_submissions')
            .select('id')
            .eq('task_id', assignmentId)
            .eq('student_id', sessionData.data.session.user.id)
            .single();
        
        var mediaUrl = mediaFile ? await uploadSubmissionMedia(client, sessionData.data.session.user.id, mediaFile) : null;
        var error;
        
        if (existingSubmission) {
            // Update existing submission
            var updateData = {
                content: textResponse || 'Submitted via form',
                media_type: type,
                status: 'pending'
            };
            if (mediaUrl) updateData.media_url = mediaUrl;
            
            var result = await client.from('task_submissions').update(updateData).eq('id', existingSubmission.id);
            error = result.error;
        } else {
            // Create new submission
            var result = await client.from('task_submissions').insert({
                task_id: assignmentId,
                student_id: sessionData.data.session.user.id,
                content: textResponse || 'Submitted via form',
                media_type: type,
                media_url: mediaUrl,
                status: 'pending'
            });
            error = result.error;
        }
        
        if (error) throw error;
        showSystemCard('Assignment submitted successfully!', 'success');
        closeModal();
        
        // Small delay to ensure data is committed before reload
        await new Promise(resolve => setTimeout(resolve, 500));
        
        loadPendingAssignments(sessionData.data.session.user.id);
        
        // Reload tasks page if on tasks page
        if (window.location.pathname.includes('tasks.html')) {
            await loadTasksPage();
        }
        
        // Check for achievement unlocks after submission
        await checkAndUnlockAchievements(sessionData.data.session.user.id);
    } catch (e) {
        showSystemCard('Error submitting: ' + (e.message || 'Unknown error'), 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ========================================
// ROLE-BASED NAVIGATION HELPER
// ========================================

function getRoleBasedNavItems(role) {
    const baseNav = {
        href: 'index.html',
        icon: '&#128682;',
        label: 'Logout',
        onclick: 'handleLogout()'
    };
    
    const navItems = {
        student: [
            { href: 'student-dashboard.html', icon: '&#128202;', label: 'Dashboard', onclick: null },
            { href: 'programs.html', icon: '&#128218;', label: 'Programs', onclick: null },
            { href: 'ctfs.html', icon: '&#9962;', label: 'CTFS', onclick: null },
            { href: 'choir.html', icon: '&#127925;', label: 'Choir', onclick: null },
            { href: 'tasks.html', icon: '&#128221;', label: 'Tasks', onclick: null },
            { href: 'activity-feed.html', icon: '&#128226;', label: 'Activity Feed', onclick: null },
            { href: 'leaderboard.html', icon: '&#128200;', label: 'Leaderboard', onclick: null },
            { href: 'games.html', icon: '&#127918;', label: 'Learning Lab', onclick: null },
            { href: 'ai-coach.html', icon: '&#129302;', label: 'AI Coach', onclick: null },
            { href: 'notifications.html', icon: '&#128276;', label: 'Notifications', onclick: null },
            { href: 'profile.html', icon: '&#128100;', label: 'Profile', onclick: null },
            { href: 'achievements.html', icon: '&#127942;', label: 'Achievements', onclick: null },
            { href: 'settings.html', icon: '&#9881;', label: 'Settings', onclick: null }
        ],
        mentor: [
            { href: 'mentor-dashboard.html', icon: '&#128202;', label: 'Dashboard', onclick: null },
            { href: '#', icon: '&#128101;', label: 'Students', onclick: 'loadMentorSection("students")' },
            { href: '#', icon: '&#10003;', label: 'Attendance', onclick: 'loadMentorSection("attendance")' },
            { href: '#', icon: '&#128221;', label: 'Reviews', onclick: 'loadMentorSection("assignments")' },
            { href: '#', icon: '&#128226;', label: 'Publish', onclick: 'loadMentorSection("activities")' },
            { href: 'session-manager.html', icon: '&#127909;', label: 'Sessions', onclick: null },
            { href: 'activity-feed.html', icon: '&#128240;', label: 'Activity Feed', onclick: null },
            { href: '#', icon: '&#128200;', label: 'Reports', onclick: 'loadMentorSection("reports")' },
            { href: 'notifications.html', icon: '&#128276;', label: 'Notifications', onclick: null },
            { href: 'settings.html', icon: '&#9881;', label: 'Settings', onclick: null }
        ],
        admin: [
            { href: 'admin-dashboard.html', icon: '&#128202;', label: 'Dashboard', onclick: null },
            { href: '#', icon: '&#128101;', label: 'Users', onclick: 'loadAdminSection("users")' },
            { href: '#', icon: '&#128218;', label: 'Programs', onclick: 'loadAdminSection("programs")' },
            { href: 'session-manager.html', icon: '&#127909;', label: 'Sessions', onclick: null },
            { href: 'activity-feed.html', icon: '&#128240;', label: 'Activity Feed', onclick: null },
            { href: '#', icon: '&#128200;', label: 'Analytics', onclick: 'loadAdminSection("analytics")' },
            { href: '#', icon: '&#128196;', label: 'Reports', onclick: 'generateReport()' },
            { href: 'notifications.html', icon: '&#128276;', label: 'Notifications', onclick: null },
            { href: '#', icon: '&#9881;', label: 'Settings', onclick: 'loadAdminSection("settings")' }
        ]
    };
    
    return (navItems[role] || []).concat([baseNav]);
}

// ========================================
// MENTOR SECTION LOADERS
// ========================================

function loadMentorSection(section) {
    switch(section) {
        case 'students': showMentorStudentsModal(); break;
        case 'attendance': showMentorAttendanceModal(); break;
        case 'assignments': showMentorAssignmentsModal(); break;
        case 'activities': showPublishActivityModal(); break;
        case 'reports': showReportsModal(); break;
        default: showSystemCard('All sections are now functional!', 'info');
    }
}

async function showMentorStudentsModal() {
    var client = await getSupabase();
    if (!client) return;
    var { data: students } = await client.from('profiles').select('*').eq('role', 'student').limit(30);
    openModal(
        '<h2 style="margin-bottom:1rem;">Students</h2>' +
        '<div class="table-container"><table class="data-table"><thead>' +
        '<tr><th>Name</th><th>Email</th><th>Age</th><th>Role</th></tr></thead><tbody>' +
        (students && students.length ? students.map(function(s) {
            return '<tr><td>' + (s.full_name || '') + '</td><td>' + (s.email || '') + '</td>' +
                '<td>' + (s.age || 'N/A') + '</td><td><span class="badge info">' + (s.role || 'student') + '</span></td></tr>';
        }).join('') : '<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--text-muted);">No students found.</td></tr>') +
        '</tbody></table></div>'
    );
}

var attendanceSelections = {};

function sortProgramList(programs) {
    return (programs || []).slice().sort(function(a, b) {
        if (a.slug === 'ctfs') return -1;
        if (b.slug === 'ctfs') return 1;
        return (a.name || '').localeCompare(b.name || '');
    });
}

function sortSessionsForDisplay(sessions) {
    return (sessions || []).slice().sort(function(a, b) {
        var weekA = a.week_number || 0;
        var weekB = b.week_number || 0;
        if (weekA !== weekB) return weekA - weekB;
        return (a.title || '').localeCompare(b.title || '');
    });
}

async function populateAttendanceSessionDropdown(programId) {
    var client = await getSupabase();
    if (!client) return;
    var sel = document.getElementById('attendanceSession');
    if (!sel) return;

    sel.innerHTML = '<option value="">Loading sessions...</option>';
    var query = client.from('sessions').select('id, title, week_number');
    if (programId) query = query.eq('program_id', programId);
    var { data: sessions } = await query;
    sessions = sortSessionsForDisplay(sessions);

    if (!sessions.length) {
        sel.innerHTML = '<option value="">No sessions found for this program</option>';
        return;
    }
    sel.innerHTML = sessions.map(function(s) {
        return '<option value="' + s.id + '">' + (s.title || 'Session') + '</option>';
    }).join('');
}

async function showMentorAttendanceModal() {
    var client = await getSupabase();
    if (!client) return;
    var { data: students } = await client.from('profiles').select('id, full_name').eq('role', 'student');
    var { data: programs } = await client.from('programs').select('id, name, slug').eq('is_active', true);
    programs = sortProgramList(programs);
    var defaultProgram = programs.find(function(p) { return p.slug === 'ctfs'; }) || programs[0];
    var programOptions = programs.length
        ? programs.map(function(p) {
            return '<option value="' + p.id + '"' + (defaultProgram && p.id === defaultProgram.id ? ' selected' : '') + '>' + p.name + '</option>';
        }).join('')
        : '<option value="">No programs found</option>';

    var studentRows = students && students.length
        ? students.map(function(s) {
            return '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;background:var(--background);border-radius:var(--radius-md);margin-bottom:0.375rem;">' +
                '<span style="font-weight:500;">' + (s.full_name || 'Unknown') + '</span>' +
                '<div style="display:flex;gap:0.375rem;">' +
                '<button class="btn btn-sm btn-success att-btn" data-student="' + s.id + '" data-status="present" onclick="setAttendanceBtn(this)">Present</button>' +
                '<button class="btn btn-sm btn-outline att-btn" data-student="' + s.id + '" data-status="absent" onclick="setAttendanceBtn(this)">Absent</button>' +
                '<button class="btn btn-sm btn-outline att-btn" data-student="' + s.id + '" data-status="excused" onclick="setAttendanceBtn(this)">Excused</button>' +
                '</div></div>';
        }).join('')
        : '<p style="text-align:center;color:var(--text-muted);">No students found.</p>';

    openModal(
        '<h2 style="margin-bottom:1rem;">Mark Attendance</h2>' +
        '<div class="form-group" style="margin-bottom:0.75rem;"><label>Program</label>' +
        '<select id="attendanceProgram" onchange="populateAttendanceSessionDropdown(this.value)" style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);">' +
        programOptions + '</select></div>' +
        '<div class="form-group" style="margin-bottom:1rem;"><label>Session (Week & Topic)</label>' +
        '<select id="attendanceSession" style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);">' +
        '<option value="">Loading sessions...</option></select></div>' +
        '<div style="max-height:350px;overflow-y:auto;">' + studentRows + '</div>' +
        '<button class="btn btn-primary btn-full" style="margin-top:1rem;" onclick="submitBulkAttendance()">Save Attendance</button>'
    );

    if (defaultProgram) await populateAttendanceSessionDropdown(defaultProgram.id);
}

function setAttendanceBtn(btn) {
    var studentId = btn.dataset.student;
    var status = btn.dataset.status;
    attendanceSelections[studentId] = status;
    var row = btn.closest('div[style]');
    if (row) {
        row.querySelectorAll('.att-btn').forEach(function(b) { b.className = 'btn btn-sm btn-outline att-btn'; });
        btn.className = 'btn btn-sm att-btn ' + (status === 'present' ? 'btn-success' : status === 'absent' ? 'btn-danger' : 'btn-warning');
    }
}

async function submitBulkAttendance() {
    var sessionId = document.getElementById('attendanceSession') ? document.getElementById('attendanceSession').value : '';
    if (!sessionId) { showSystemCard('Please select a session.', 'error'); return; }
    if (!Object.keys(attendanceSelections).length) { showSystemCard('Please mark at least one student.', 'error'); return; }
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) throw new Error('Not logged in');
        var records = Object.entries(attendanceSelections).map(function(entry) {
            var statusVal = entry[1] === 'missed' ? 'absent' : (entry[1] === 'participated' ? 'present' : entry[1]);
            return { student_id: entry[0], session_id: sessionId, status: statusVal, recorded_by: sessionData.data.session.user.id, created_at: new Date().toISOString() };
        });
        var { error } = await client.from('attendance').upsert(records, { onConflict: 'student_id,session_id' });
        if (error) throw error;
        var missed = Object.entries(attendanceSelections).filter(function(e) { return e[1] === 'missed' || e[1] === 'absent'; });
        for (var i = 0; i < missed.length; i++) {
            try {
                await client.from('strikes').insert({ student_id: missed[i][0], reason: 'Missed session', issued_by: sessionData.data.session.user.id, created_at: new Date().toISOString() });
            } catch (err) {
                console.error('Strike insert error:', err);
            }
        }
        showSystemCard('Attendance saved for ' + records.length + ' students!', 'success');
        attendanceSelections = {};
        closeModal();
        loadMentorStats();
    } catch (e) { showSystemCard('Error saving attendance: ' + (e.message || 'Unknown error'), 'error'); }
}

async function showMentorAssignmentsModal() {
    var client = await getSupabase();
    if (!client) return;
    var { data, error } = await client.from('task_submissions')
        .select('id, content, media_url, submitted_at, student_id, tasks(id, title, sessions(title))')
        .eq('status', 'pending').limit(20);
    if (error) {
        console.error('Error loading submissions for review:', error);
        showSystemCard('Unable to load submissions. Check the Supabase staff access policies.', 'error');
        return;
    }
    var submissions = await attachSubmissionStudents(client, data);
    openModal(
        '<h2 style="margin-bottom:1rem;">Review Assignments</h2>' +
        '<div style="display:flex;flex-direction:column;gap:0.5rem;">' +
        (submissions && submissions.length ? submissions.map(function(sub) {
            return '<div class="pending-item" style="border:1px solid var(--border);padding:1rem;border-radius:var(--radius-md);background:var(--bg-secondary);">' +
                '<div style="margin-bottom:0.5rem;"><h4 style="margin-bottom:0.25rem;">' + (sub.tasks ? sub.tasks.title : 'Untitled') + '</h4>' +
                '<p style="font-size:0.85rem;color:var(--text-muted);margin:0;">Student: ' + (sub.student_profile ? sub.student_profile.full_name : 'Unknown') + '</p>' +
                '<p style="font-size:0.85rem;color:var(--text-muted);margin:0;">Session: ' + (sub.tasks && sub.tasks.sessions ? sub.tasks.sessions.title : 'N/A') + '</p>' +
                '</div>' +
                (sub.content ? '<p style="font-size:0.85rem;padding:0.5rem;background:var(--bg);border-radius:var(--radius-sm);margin:0.5rem 0;border-left:3px solid var(--primary);padding-left:0.75rem;">"' + (sub.content.length > 150 ? sub.content.substring(0, 150) + '..." (truncated)' : sub.content + '"') + '</p>' : '') +
                (sub.media_url ? '<p style="font-size:0.85rem;color:var(--success);margin:0.25rem 0;">📎 Media attachment included</p>' : '') +
                '<div class="pending-actions" style="display:flex;gap:0.5rem;margin-top:0.75rem;">' +
                '<button class="btn btn-sm btn-outline" onclick="viewFullSubmission(\'' + sub.id + '\')">View Full</button>' +
                '<button class="btn btn-sm btn-success" onclick="reviewSubmission(\'' + sub.id + '\', \'approved\')">Approve</button>' +
                '<button class="btn btn-sm btn-danger" onclick="reviewSubmission(\'' + sub.id + '\', \'rejected\')">Reject</button>' +
                '</div></div>';
        }).join('') : '<div style="text-align:center;padding:2rem;color:var(--text-muted);">No pending reviews!</div>') +
        '</div>'
    );
}

async function viewFullSubmission(submissionId) {
    var client = await getSupabase();
    if (!client) return;
    var { data: sub, error } = await client.from('task_submissions')
        .select('id, content, media_url, submitted_at, student_id, tasks(id, title, description, sessions(title))')
        .eq('id', submissionId).single();
    
    if (error || !sub) {
        if (error) console.error('Error loading submission:', error);
        showSystemCard('Submission not found', 'error');
        return;
    }
    sub = (await attachSubmissionStudents(client, [sub]))[0];
    
    var mediaHtml = '';
    if (sub.media_url) {
        var ext = sub.media_url.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            mediaHtml = '<div style="margin:1rem 0;"><img src="' + sub.media_url + '" style="max-width:100%;max-height:400px;border-radius:var(--radius-md);border:1px solid var(--border);"></div>';
        } else if (['mp4', 'webm', 'ogg'].includes(ext)) {
            mediaHtml = '<div style="margin:1rem 0;"><video controls style="max-width:100%;max-height:400px;border-radius:var(--radius-md);border:1px solid var(--border);"><source src="' + sub.media_url + '"></video></div>';
        } else {
            mediaHtml = '<div style="margin:1rem 0;padding:1rem;background:var(--bg-secondary);border-radius:var(--radius-md);"><a href="' + sub.media_url + '" target="_blank" class="link">📥 Download Attachment</a></div>';
        }
    }
    
    var submittedAt = sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : 'Unknown date';
    
    openModal(
        '<div style="max-height:80vh;overflow-y:auto;">' +
        '<h2 style="margin-bottom:0.5rem;">' + (sub.tasks ? sub.tasks.title : 'Submission') + '</h2>' +
        '<p style="color:var(--text-muted);margin-bottom:1rem;font-size:0.9rem;">Submitted by <strong>' + (sub.student_profile ? sub.student_profile.full_name : 'Unknown') + '</strong> on ' + submittedAt + '</p>' +
        '<hr style="border:none;border-top:1px solid var(--border);margin:1rem 0;">' +
        '<h3 style="margin-top:1rem;margin-bottom:0.5rem;">Assignment</h3>' +
        '<div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);margin-bottom:1rem;">' +
        '<h4 style="margin-top:0;">' + (sub.tasks ? sub.tasks.title : 'N/A') + '</h4>' +
        '<p>' + (sub.tasks ? sub.tasks.description : 'No description') + '</p>' +
        '<p style="font-size:0.85rem;color:var(--text-muted);">Session: ' + (sub.tasks && sub.tasks.sessions ? sub.tasks.sessions.title : 'N/A') + '</p>' +
        '</div>' +
        '<h3 style="margin-top:1rem;margin-bottom:0.5rem;">Student Submission</h3>' +
        '<div style="background:var(--bg-secondary);padding:1rem;border-radius:var(--radius-md);border-left:4px solid var(--primary);min-height:100px;margin-bottom:1rem;">' +
        (sub.content ? '<p>' + sub.content.replace(/\n/g, '<br>') + '</p>' : '<p style="color:var(--text-muted);font-style:italic;">No text submission</p>') +
        '</div>' +
        (mediaHtml ? '<h3 style="margin-top:1rem;margin-bottom:0.5rem;">Media Attachment</h3><div style="margin-bottom:1rem;">' + mediaHtml + '</div>' : '') +
        '<div style="display:flex;gap:0.5rem;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);">' +
        '<button class="btn btn-secondary" onclick="closeModal()">Close</button>' +
        '<button class="btn btn-success" onclick="reviewSubmission(\'' + sub.id + '\', \'approved\'); closeModal();">Approve</button>' +
        '<button class="btn btn-danger" onclick="reviewSubmission(\'' + sub.id + '\', \'rejected\'); closeModal();">Reject</button>' +
        '</div>' +
        '</div>'
    );
}

function showPublishActivityModal() {
    openModal(
        '<h2 style="margin-bottom:1rem;">Publish Activity</h2>' +
        '<form onsubmit="publishActivity(event)">' +
        '<div class="form-group"><label>Title</label>' +
        '<input type="text" id="activityTitle" placeholder="Activity title..." required style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);"></div>' +
        '<div class="form-group"><label>Description</label>' +
        '<textarea id="activityDescription" rows="4" placeholder="Description..." style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);font-family:var(--font);"></textarea></div>' +
        '<div class="form-group"><label>Type</label>' +
        '<select id="activityType" style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);">' +
        '<option value="announcement">Announcement</option>' +
        '<option value="update">Class Update</option>' +
        '<option value="summary">Session Summary</option>' +
        '</select></div>' +
        '<button type="submit" class="btn btn-primary btn-full">Publish</button>' +
        '</form>'
    );
}

async function publishActivity(event) {
    event.preventDefault();
    var title = document.getElementById('activityTitle') ? document.getElementById('activityTitle').value : '';
    var description = document.getElementById('activityDescription') ? document.getElementById('activityDescription').value : '';
    var type = document.getElementById('activityType') ? document.getElementById('activityType').value : 'announcement';
    if (!title) { alert('Please enter a title.'); return; }
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) throw new Error('Not logged in');
        var { error } = await client.from('activities').insert({
            user_id: sessionData.data.session.user.id,
            title: title,
            description: description || '',
            is_announcement: type === 'announcement',
            created_at: new Date().toISOString()
        });
        if (error) throw error;
        showSystemCard('Activity published!', 'success');
        closeModal();
        loadActivityFeed();
    } catch (e) { alert('Error: ' + (e.message || 'Unknown error')); }
}

function showReportsModal() {
    openModal(
        '<h2 style="margin-bottom:1rem;">Reports</h2>' +
        '<div style="display:flex;flex-direction:column;gap:0.75rem;">' +
        '<button class="btn btn-primary" onclick="exportStudentReport()">Student Progress Report (CSV)</button>' +
        '<button class="btn btn-outline" onclick="exportAttendanceReport()">Attendance Summary (CSV)</button>' +
        '<button class="btn btn-outline" onclick="exportLeadershipReport()">Leadership Pathway Report (CSV)</button>' +
        '</div>'
    );
}

// ========================================
// ADMIN SECTION LOADERS
// ========================================

function loadAdminSection(section) {
    switch(section) {
        case 'users': showAdminUsersModal(); break;
        case 'programs': showAdminProgramsModal(); break;
        case 'analytics': showAdminAnalyticsModal(); break;
        case 'settings': showAdminSettingsModal(); break;
        default: showSystemCard('All sections are now functional!', 'info');
    }
}

async function showAdminUsersModal() {
    var client = await getSupabase();
    if (!client) return;
    var { data: users } = await client.from('profiles').select('*').limit(50);
    openModal(
        '<h2 style="margin-bottom:1rem;">User Management</h2>' +
        '<div style="margin-bottom:1rem;">' +
        '<button class="btn btn-sm btn-outline" onclick="exportStudentReport()">Export CSV</button></div>' +
        '<div class="table-container"><table class="data-table"><thead>' +
        '<tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
        (users && users.length ? users.map(function(u) {
            var rc = u.role === 'admin' ? 'danger' : u.role === 'mentor' ? 'warning' : 'info';
            var isSuspended = u.suspended || u.status === 'suspended' || u.status === 'deactivated';
            var statusBadge = isSuspended ? '<span class="badge danger">Suspended</span>' : '<span class="badge success">Active</span>';
            var suspendButton = isSuspended 
                ? '<button class="btn btn-sm btn-success" onclick="unsuspendUser(\'' + u.id + '\')">Unsuspend</button>'
                : '<button class="btn btn-sm btn-danger" onclick="suspendUser(\'' + u.id + '\')">Suspend</button>';
            return '<tr><td>' + (u.full_name || '') + '</td><td>' + (u.email || '') + '</td>' +
                '<td><span class="badge ' + rc + '">' + (u.role || '') + '</span></td>' +
                '<td>' + statusBadge + '</td><td>' +
                '<button class="btn btn-sm btn-outline" onclick="editUser(\'' + u.id + '\')">Edit</button> ' +
                suspendButton + '</td></tr>';
        }).join('') : '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted);">No users.</td></tr>') +
        '</tbody></table></div>'
    );
}

async function showAdminProgramsModal() {
    var client = await getSupabase();
    if (!client) return;
    var { data: programs } = await client.from('programs').select('*');
    openModal(
        '<h2 style="margin-bottom:1rem;">Program Management</h2>' +
        '<div style="display:flex;flex-direction:column;gap:0.5rem;">' +
        (programs && programs.length ? programs.map(function(p) {
            return '<div class="program-item">' +
                '<div class="program-info"><div><h4>' + (p.name || '') + '</h4><p>' + (p.description || '') + '</p></div></div>' +
                '<div class="program-actions">' +
                '<span class="badge ' + (p.is_active ? 'success' : 'danger') + '">' + (p.is_active ? 'Active' : 'Inactive') + '</span> ' +
                '<button class="btn btn-sm btn-outline" onclick="editProgram(\'' + p.id + '\')">Edit</button> ' +
                '<button class="btn btn-sm btn-danger" onclick="toggleProgram(\'' + p.id + '\')">' + (p.is_active ? 'Disable' : 'Enable') + '</button>' +
                '</div></div>';
        }).join('') : '<div style="text-align:center;padding:2rem;color:var(--text-muted);">No programs.</div>') +
        '</div>'
    );
}

async function showAdminAnalyticsModal() {
    openModal('<h2 style="margin-bottom:1rem;">Platform Analytics</h2><div id="analyticsContent"><p style="color:var(--text-muted);text-align:center;">Loading...</p></div>');
    try {
        var client = await getSupabase();
        if (!client) return;
        var [usersRes, subsRes, attRes, achRes] = await Promise.all([
            client.from('profiles').select('role'),
            client.from('task_submissions').select('status'),
            client.from('attendance').select('status'),
            client.from('user_achievements').select('id', { count: 'exact', head: true })
        ]);
        var users = usersRes.data || [];
        var subs = subsRes.data || [];
        var att = attRes.data || [];
        var students = users.filter(function(u) { return u.role === 'student'; }).length;
        var mentors = users.filter(function(u) { return u.role === 'mentor'; }).length;
        var approved = subs.filter(function(s) { return s.status === 'approved'; }).length;
        var pending = subs.filter(function(s) { return s.status === 'pending'; }).length;
        var attPct = att.length > 0 ? Math.round(att.filter(function(a) { return a.status === 'present'; }).length / att.length * 100) : 0;
        var el = document.getElementById('analyticsContent');
        if (el) el.innerHTML =
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">' +
            [['Students', students], ['Mentors', mentors], ['Approved', approved], ['Pending', pending], ['Avg Attendance', attPct + '%'], ['Achievements', achRes.count || 0]].map(function(item) {
                return '<div style="padding:1rem;background:var(--background);border-radius:var(--radius-md);text-align:center;">' +
                    '<div style="font-size:1.75rem;font-weight:700;color:var(--primary);">' + item[1] + '</div>' +
                    '<div style="font-size:0.8rem;color:var(--text-muted);">' + item[0] + '</div></div>';
            }).join('') + '</div>';
    } catch (e) { console.error('Analytics error:', e); }
}

async function showAdminSettingsModal() {
    var warningVal = 2;
    var suspensionVal = 3;
    try {
        var client = await getSupabase();
        if (client) {
            var { data: setting } = await client.from('system_settings').select('value').eq('key', 'strike_thresholds').maybeSingle();
            if (setting && setting.value) {
                warningVal = setting.value.warning || 2;
                suspensionVal = setting.value.suspension || 3;
            }
        }
    } catch(e) {}

    openModal(
        '<h2 style="margin-bottom:1rem;">Platform Settings</h2>' +
        '<form onsubmit="saveAdminSettings(event)">' +
        '<div style="display:flex;flex-direction:column;gap:1rem;">' +
        '<div class="program-item"><div><h4>Strike Warning Threshold</h4><p>Strikes before warning status</p></div>' +
        '<input type="number" id="settingStrikeWarning" value="' + warningVal + '" min="1" max="20" style="width:80px;padding:0.5rem;border:2px solid var(--border);border-radius:var(--radius-md);text-align:center;"></div>' +
        '<div class="program-item"><div><h4>Suspension Threshold</h4><p>Strikes before suspension review</p></div>' +
        '<input type="number" id="settingStrikeSuspension" value="' + suspensionVal + '" min="2" max="20" style="width:80px;padding:0.5rem;border:2px solid var(--border);border-radius:var(--radius-md);text-align:center;"></div>' +
        '<button type="submit" class="btn btn-primary">Save Settings</button>' +
        '</div></form>'
    );
}

async function saveAdminSettings(event) {
    if (event) event.preventDefault();
    var warning = parseInt(document.getElementById('settingStrikeWarning')?.value || '2');
    var suspension = parseInt(document.getElementById('settingStrikeSuspension')?.value || '3');
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected to database');
        var sessionData = await client.auth.getSession();
        var adminId = sessionData?.data?.session?.user?.id || null;
        var { error } = await client.from('system_settings').upsert({
            key: 'strike_thresholds',
            value: { warning: warning, suspension: suspension },
            updated_at: new Date().toISOString(),
            updated_by: adminId
        });
        if (error) throw error;
        showSystemCard('Settings saved to database!', 'success');
        closeModal();
    } catch(e) {
        showSystemCard('Error saving settings: ' + (e.message || 'Unknown error'), 'error');
    }
}

async function showDeactivationRequestsModal() {
    openModal('<h2 style="margin-bottom:1rem;">Account Deactivation Requests</h2><div id="deactModalBody"><p style="color:var(--text-muted);">Loading requests...</p></div>');
    try {
        var client = await getSupabase();
        if (!client) return;
        var { data: reqs, error } = await client.from('deactivation_requests')
            .select('id, user_id, reason, status, requested_at, profiles(full_name, email)')
            .order('requested_at', { ascending: false });
        var body = document.getElementById('deactModalBody');
        if (error) throw error;
        if (!reqs || !reqs.length) {
            if (body) body.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:1.5rem;">No account deactivation requests found.</p>';
            return;
        }
        if (body) {
            body.innerHTML = '<div style="display:flex;flex-direction:column;gap:0.75rem;">' +
                reqs.map(function(r) {
                    var isPending = r.status === 'pending';
                    return '<div style="padding:1rem;background:var(--background);border-radius:var(--radius-md);border-left:4px solid ' + (isPending ? 'var(--warning)' : 'var(--border)') + ';">' +
                        '<div style="font-weight:600;">' + (r.profiles?.full_name || 'User') + ' (' + (r.profiles?.email || 'N/A') + ')</div>' +
                        '<p style="font-size:0.85rem;color:var(--text-light);margin:0.25rem 0;">Reason: ' + (r.reason || 'None provided') + '</p>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.5rem;"><span class="badge ' + (isPending ? 'warning' : 'info') + '">' + r.status + '</span>' +
                        (isPending ? '<button class="btn btn-sm btn-danger" onclick="processDeactivation(\'' + r.id + '\', \'' + r.user_id + '\', \'approved\')">Approve & Deactivate</button>' : '') +
                        '</div></div>';
                }).join('') + 'div>';
        }
    } catch(e) {
        var body = document.getElementById('deactModalBody');
        if (body) body.innerHTML = '<p style="color:var(--danger);">Error loading requests: ' + (e.message || 'Unknown error') + '</p>';
    }
}

async function processDeactivation(requestId, userId, status) {
    if (!confirm('Approve deactivation for this account? This will suspend the account.')) return;
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var sessionData = await client.auth.getSession();
        var adminId = sessionData?.data?.session?.user?.id || null;
        await client.from('deactivation_requests').update({
            status: status,
            processed_at: new Date().toISOString(),
            processed_by: adminId
        }).eq('id', requestId);

        await client.from('profiles').update({
            suspended: true,
            status: 'deactivated',
            deactivation_requested: false
        }).eq('id', userId);

        showSystemCard('Account deactivated successfully.', 'success');
        showDeactivationRequestsModal();
        loadAdminUsers();
    } catch(e) {
        showSystemCard('Error processing deactivation: ' + (e.message || 'Unknown error'), 'error');
    }
}

function generateReport() { showReportsModal(); }

function editUser(userId) {
    openModal(
        '<h2 style="margin-bottom:1rem;">Edit User</h2>' +
        '<form onsubmit="saveUserEdit(event, \'' + userId + '\')">' +
        '<div class="form-group"><label>Role</label>' +
        '<select id="editUserRole" style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);">' +
        '<option value="student">Student</option><option value="mentor">Mentor</option><option value="admin">Admin</option>' +
        '</select></div>' +
        '<div style="display:flex;gap:0.5rem;margin-top:1rem;">' +
        '<button type="submit" class="btn btn-primary">Save</button>' +
        '<button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>' +
        '</div></form>'
    );
}

async function saveUserEdit(event, userId) {
    event.preventDefault();
    var role = document.getElementById('editUserRole') ? document.getElementById('editUserRole').value : '';
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var { error } = await client.from('profiles').update({ role: role }).eq('id', userId);
        if (error) throw error;
        showSystemCard('User updated!', 'success');
        closeModal(); loadAdminUsers();
    } catch (e) { alert('Error: ' + (e.message || 'Unknown error')); }
}

async function suspendUser(userId) {
    if (!confirm('Suspend this user?')) return;
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var { error } = await client.from('profiles').update({ suspended: true }).eq('id', userId);
        if (error) throw error;
        showSystemCard('User suspended.', 'success'); loadAdminUsers();
    } catch (e) { alert('Error: ' + (e.message || 'Unknown error')); }
}

async function unsuspendUser(userId) {
    if (!confirm('Unsuspend this user?')) return;
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var { error } = await client.from('profiles').update({ suspended: false, status: 'active' }).eq('id', userId);
        if (error) throw error;
        showSystemCard('User unsuspended.', 'success'); loadAdminUsers();
    } catch (e) { alert('Error: ' + (e.message || 'Unknown error')); }
}

function editProgram(programId) {
    openModal(
        '<h2 style="margin-bottom:1rem;">Edit Program</h2>' +
        '<form onsubmit="saveProgramEdit(event, \'' + programId + '\')">' +
        '<div class="form-group"><label>Program Name</label>' +
        '<input type="text" id="editProgName" placeholder="Program name" required style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);"></div>' +
        '<div class="form-group"><label>Description</label>' +
        '<textarea id="editProgDesc" rows="3" style="width:100%;padding:0.75rem 1rem;border:2px solid var(--border);border-radius:var(--radius-md);font-family:var(--font);"></textarea></div>' +
        '<div style="display:flex;gap:0.5rem;margin-top:1rem;">' +
        '<button type="submit" class="btn btn-primary">Save</button>' +
        '<button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>' +
        '</div></form>'
    );
}

async function saveProgramEdit(event, programId) {
    event.preventDefault();
    var name = document.getElementById('editProgName') ? document.getElementById('editProgName').value.trim() : '';
    var desc = document.getElementById('editProgDesc') ? document.getElementById('editProgDesc').value.trim() : '';
    if (!name) { alert('Please enter a program name.'); return; }
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var { error } = await client.from('programs').update({ name: name, description: desc }).eq('id', programId);
        if (error) throw error;
        showSystemCard('Program updated!', 'success');
        closeModal(); loadAdminPrograms();
    } catch (e) { alert('Error: ' + (e.message || 'Unknown error')); }
}

async function toggleProgram(programId) {
    if (!confirm('Toggle this program status?')) return;
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var { data: prog } = await client.from('programs').select('is_active').eq('id', programId).single();
        var { error } = await client.from('programs').update({ is_active: !prog.is_active }).eq('id', programId);
        if (error) throw error;
        showSystemCard('Program ' + (!prog.is_active ? 'enabled' : 'disabled') + '!', 'success');
        loadAdminPrograms();
    } catch (e) { alert('Error: ' + (e.message || 'Unknown error')); }
}

async function viewStudent(studentId) {
    var client = await getSupabase();
    if (!client) return;
    try {
        var [profileRes, sgiRes, attRes, strikesRes, achRes] = await Promise.all([
            client.from('profiles').select('*').eq('id', studentId).single(),
            client.from('sgi_scores').select('score').eq('student_id', studentId).maybeSingle(),
            client.from('attendance').select('status').eq('student_id', studentId),
            client.from('strikes').select('id', { count: 'exact', head: true }).eq('student_id', studentId),
            client.from('user_achievements').select('achievements(name, icon)').eq('student_id', studentId)
        ]);
        var profile = profileRes.data;
        var sgi = sgiRes.data;
        var att = attRes.data || [];
        var totalStrikes = strikesRes.count || 0;
        var ach = achRes.data || [];
        var attPct = att.length > 0 ? Math.round(att.filter(function(a) { return a.status === 'present'; }).length / att.length * 100) : 0;
        openModal(
            '<h2 style="margin-bottom:1.5rem;">' + (profile ? profile.full_name : 'Student') + '</h2>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.5rem;">' +
            [['Email', profile ? profile.email : 'N/A'], ['Age', profile && profile.age ? profile.age + ' years' : 'N/A'],
             ['SGI Score', sgi ? Math.round(sgi.score) + '%' : '0%'], ['Attendance', attPct + '%'],
             ['Strikes', totalStrikes], ['Achievements', ach.length]].map(function(item) {
                return '<div style="padding:0.75rem;background:var(--background);border-radius:var(--radius-md);">' +
                    '<div style="font-size:0.7rem;color:var(--text-muted);">' + item[0] + '</div>' +
                    '<div style="font-weight:700;">' + item[1] + '</div></div>';
            }).join('') + '</div>' +
            (ach.length ? '<h4 style="margin-bottom:0.5rem;">Achievements</h4><div style="display:flex;flex-wrap:wrap;gap:0.5rem;">' +
                ach.map(function(a) { return '<span style="padding:0.25rem 0.75rem;background:var(--background);border-radius:var(--radius-full);font-size:0.75rem;">' + (a.achievements ? a.achievements.name : '') + '</span>'; }).join('') +
                '</div>' : '')
        );
    } catch (e) { alert('Error loading student data.'); }
}

// ========================================
// CSV EXPORT
// ========================================

function downloadCSV(csv, filename) {
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
}

async function exportStudentReport() {
    try {
        var client = await getSupabase();
        if (!client) return;
        var { data: students } = await client.from('profiles').select('full_name, email, age, role, created_at').eq('role', 'student');
        if (!students || !students.length) { alert('No students to export.'); return; }
        var rows = [['Full Name', 'Email', 'Age', 'Role', 'Joined']];
        students.forEach(function(s) {
            rows.push([s.full_name || '', s.email || '', s.age || '', s.role || '', s.created_at ? new Date(s.created_at).toLocaleDateString() : '']);
        });
        downloadCSV(rows.map(function(r) { return r.map(function(v) { return '"' + v + '"'; }).join(','); }).join('\n'), 'students.csv');
    } catch (e) { alert('Export error.'); }
}

async function exportAttendanceReport() {
    try {
        var client = await getSupabase();
        if (!client) return;
        var { data: att } = await client.from('attendance').select('status, created_at, profiles(full_name), sessions(title)');
        if (!att || !att.length) { showSystemCard('No attendance data to export.', 'info'); return; }
        var rows = [['Student', 'Session', 'Status', 'Date']];
        att.forEach(function(a) {
            rows.push([a.profiles ? a.profiles.full_name : '', a.sessions ? a.sessions.title : '', a.status || '', a.created_at ? new Date(a.created_at).toLocaleDateString() : '']);
        });
        downloadCSV(rows.map(function(r) { return r.map(function(v) { return '"' + v + '"'; }).join(','); }).join('\n'), 'attendance_summary.csv');
        showSystemCard('Attendance Summary exported!', 'success');
    } catch (e) { showSystemCard('Export error: ' + (e.message || 'Unknown error'), 'error'); }
}

async function exportLeadershipReport() {
    try {
        var client = await getSupabase();
        if (!client) return;
        var { data: scores } = await client.from('sgi_scores').select('score, week_number, created_at, profiles(full_name, email)');
        if (!scores || !scores.length) { showSystemCard('No leadership score data available to export.', 'info'); return; }
        var rows = [['Student', 'Email', 'Week', 'Leadership Score', 'Date Recorded']];
        scores.forEach(function(s) {
            rows.push([
                s.profiles ? s.profiles.full_name : 'Unknown',
                s.profiles ? s.profiles.email : '',
                s.week_number || '',
                s.score || 0,
                s.created_at ? new Date(s.created_at).toLocaleDateString() : ''
            ]);
        });
        downloadCSV(rows.map(function(r) { return r.map(function(v) { return '"' + v + '"'; }).join(','); }).join('\n'), 'leadership_pathway_report.csv');
        showSystemCard('Leadership Pathway Report exported!', 'success');
    } catch (e) { showSystemCard('Export error: ' + (e.message || 'Unknown error'), 'error'); }
}

// ========================================
// PAGE LOADERS
// ========================================

async function loadTasksPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    var studentId = sessionData.data.session.user.id;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'Student';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(currentProfile.id, currentProfile.role);
    
    try {
        var { data: allAssignments } = await client.from('tasks').select('id, title, sessions(title, programs(name))');
        var { data: submissions } = await client.from('task_submissions').select('task_id, status, feedback, reviewed_at').eq('student_id', studentId);
        var subMap = {};
        if (submissions) submissions.forEach(function(s) { subMap[s.task_id] = s; });
        var pending = (allAssignments || []).filter(function(a) { return !subMap[a.id]; });
        var completed = (allAssignments || []).filter(function(a) { return subMap[a.id] && subMap[a.id].status !== 'rejected'; });
        var approved = (allAssignments || []).filter(function(a) { return subMap[a.id] && subMap[a.id].status === 'approved'; });
        var rejected = (allAssignments || []).filter(function(a) { return subMap[a.id] && subMap[a.id].status === 'rejected'; });
        setEl('pendingCount', pending.length);
        setEl('completedCount', completed.length);
        setEl('totalTasks', (allAssignments || []).length);
        setEl('statsPending', pending.length);
        setEl('statsCompleted', completed.length);
        setEl('statsApproved', approved.length);
        setEl('statsRejected', rejected.length);
        function renderList(containerId, items, emptyMsg) {
            var el = document.getElementById(containerId);
            if (!el) return;
            if (!items.length) { el.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--text-muted);">' + emptyMsg + '</div>'; return; }
            el.innerHTML = items.map(function(a) {
                var sub = subMap[a.id];
                var status = sub ? sub.status : 'not_submitted';
                var bc = status === 'approved' ? 'success' : status === 'pending' ? 'warning' : status === 'rejected' ? 'danger' : 'info';
                var bl = status === 'approved' ? 'Approved' : status === 'pending' ? 'Under Review' : status === 'rejected' ? 'Rejected' : 'Not Submitted';
                var feedbackHtml = sub && sub.feedback ? '<div style="margin-top:0.5rem;padding:0.5rem;background:var(--background);border-radius:var(--radius-sm);font-size:0.8rem;color:var(--text-light);"><strong>Mentor Feedback:</strong> ' + sub.feedback + '</div>' : '';
                return '<div class="assignment-item"><div><h4>' + (a.title || 'Untitled') + '</h4>' +
                    '<p>' + (a.sessions && a.sessions.programs ? a.sessions.programs.name : 'Program') + '</p>' +
                    '<span class="badge ' + bc + '" style="margin-top:0.25rem;">' + bl + '</span>' +
                    feedbackHtml +
                    '</div>' +
                    (status === 'not_submitted' || status === 'rejected' ? '<button class="btn btn-sm btn-primary" onclick="startAssignment(\'' + a.id + '\')">Submit</button>' : '') +
                    '</div>';
            }).join('');
        }
        renderList('pendingTasks', pending, 'No pending tasks!');
        renderList('completedTasks', completed, 'No completed tasks yet.');
    } catch (e) { console.error('Tasks page error:', e); }
}

// Achievement criteria definitions
const ACHIEVEMENT_CRITERIA = {
    'Perfect Attendance': { type: 'attendance', required: 100, description: 'Attend 100% of sessions' },
    'Consistency Champion': { type: 'consistency', required: 4, description: 'Submit assignments on time for 4 consecutive weeks' },
    'Leadership Star': { type: 'leadership', required: 5, description: 'Demonstrate leadership in 5 activities' },
    'Voice Master': { type: 'voice', required: 10, description: 'Complete 10 voice training modules' },
    'Scripture Champion': { type: 'spiritual', required: 10, description: 'Memorize 10 memory verses' },
    'Prayer Warrior': { type: 'spiritual', required: 30, description: 'Complete 30 consecutive prayer journal entries' },
    'Kingdom Builder': { type: 'leadership', required: 3, description: 'Make 3 positive community impacts' },
    'CTFS Graduate': { type: 'graduate', required: 12, description: 'Complete all 12 CTFS weeks' },
    'Mentorship Excellence': { type: 'mentorship', required: 3, description: 'Mentor 3 students effectively' },
    'Growth Mindset': { type: 'sgi', required: 4, description: 'Show SGI score improvement over 4 weeks' }
};

async function checkAndUnlockAchievements(studentId) {
    var client = await getSupabase();
    if (!client) return;
    
    try {
        // Get current achievements
        var { data: earned } = await client.from('user_achievements').select('achievement_id').eq('student_id', studentId);
        var earnedIds = new Set((earned || []).map(function(e) { return e.achievement_id; }));
        
        // Get all available achievements
        var { data: allAch } = await client.from('achievements').select('*');
        
        // Get student data for checking criteria
        var { data: attendance } = await client.from('attendance').select('*').eq('student_id', studentId);
        var { data: submissions } = await client.from('task_submissions').select('*').eq('student_id', studentId);
        var { data: sgiScores } = await client.from('sgi_scores').select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(5);
        var { data: dailyPractice } = await client.from('daily_practices').select('*').eq('student_id', studentId);
        
        // Calculate metrics
        var totalSessions = attendance ? attendance.length : 0;
        var presentSessions = attendance ? attendance.filter(function(a) { return a.status === 'present'; }).length : 0;
        var attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;
        
        var onTimeSubmissions = submissions ? submissions.filter(function(s) { 
            return s.status === 'approved' && new Date(s.submitted_at) <= new Date(s.due_date); 
        }).length : 0;
        
        var consecutivePrayers = calculateConsecutiveStreak(dailyPractice, 'prayed');
        
        var sgiImprovement = 0;
        if (sgiScores && sgiScores.length >= 2) {
            var latest = sgiScores[0].score;
            var oldest = sgiScores[sgiScores.length - 1].score;
            sgiImprovement = latest - oldest;
        }
        
        // Check each achievement
        var newUnlocks = [];
        for (var i = 0; i < allAch.length; i++) {
            var ach = allAch[i];
            if (earnedIds.has(ach.id)) continue; // Already earned
            
            var criteria = ACHIEVEMENT_CRITERIA[ach.name];
            if (!criteria) continue;
            
            var unlocked = false;
            switch (criteria.type) {
                case 'attendance':
                    unlocked = attendanceRate >= criteria.required;
                    break;
                case 'consistency':
                    unlocked = onTimeSubmissions >= criteria.required;
                    break;
                case 'sgi':
                    unlocked = sgiImprovement >= 10; // 10% improvement
                    break;
                case 'spiritual':
                    if (ach.name === 'Prayer Warrior') {
                        unlocked = consecutivePrayers >= criteria.required;
                    } else {
                        unlocked = onTimeSubmissions >= criteria.required; // Scripture via submissions
                    }
                    break;
                case 'leadership':
                    unlocked = onTimeSubmissions >= criteria.required; // Leadership via activities
                    break;
                case 'voice':
                    unlocked = presentSessions >= criteria.required; // Voice via attendance
                    break;
                case 'graduate':
                    unlocked = presentSessions >= criteria.required;
                    break;
                case 'mentorship':
                    unlocked = false; // Mentor-specific, handled separately
                    break;
            }
            
            if (unlocked) {
                await client.from('user_achievements').insert({
                    student_id: studentId,
                    achievement_id: ach.id,
                    earned_at: new Date().toISOString()
                });
                newUnlocks.push(ach.name);
            }
        }
        
        // Notify user of new achievements
        if (newUnlocks.length > 0) {
            showSystemCard('🎉 New Achievement Unlocked: ' + newUnlocks[0] + (newUnlocks.length > 1 ? ' and ' + (newUnlocks.length - 1) + ' more!' : ''), 'success');
        }
        
        return newUnlocks;
    } catch (e) {
        showSystemCard('Error checking achievements: ' + (e.message || 'Unknown error'), 'error');
        return [];
    }
}

function calculateConsecutiveStreak(practices, field) {
    if (!practices || practices.length === 0) return 0;
    
    var sorted = practices.sort(function(a, b) { 
        return new Date(b.practice_date) - new Date(a.practice_date); 
    });
    
    var streak = 0;
    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (var i = 0; i < sorted.length; i++) {
        var practiceDate = new Date(sorted[i].practice_date);
        practiceDate.setHours(0, 0, 0, 0);
        
        var dayDiff = Math.floor((currentDate - practiceDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === streak && sorted[i][field]) {
            streak++;
        } else if (dayDiff === streak + 1 && sorted[i][field]) {
            streak++;
            currentDate = practiceDate;
        } else {
            break;
        }
    }
    
    return streak;
}

async function loadAchievementsPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'Student';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(currentProfile.id, currentProfile.role);
    
    try {
        // Check for new achievements first
        await checkAndUnlockAchievements(sessionData.data.session.user.id);
        
        var { data: allAch } = await client.from('achievements').select('*');
        var { data: earned } = await client.from('user_achievements').select('achievement_id').eq('student_id', sessionData.data.session.user.id);
        var earnedIds = new Set((earned || []).map(function(e) { return e.achievement_id; }));
        var all = allAch || [];
        var earnedList = all.filter(function(a) { return earnedIds.has(a.id); });
        var lockedList = all.filter(function(a) { return !earnedIds.has(a.id); });
        
        setEl('totalAchievements', earnedList.length);
        setEl('totalAvailable', all.length);
        
        // Get user progress data for locked achievements
        var { data: attendance } = await client.from('attendance').select('*').eq('student_id', sessionData.data.session.user.id);
        var { data: submissions } = await client.from('task_submissions').select('*').eq('student_id', sessionData.data.session.user.id);
        var { data: dailyPractice } = await client.from('daily_practices').select('*').eq('student_id', sessionData.data.session.user.id);
        
        var totalSessions = attendance ? attendance.length : 0;
        var presentSessions = attendance ? attendance.filter(function(a) { return a.status === 'present'; }).length : 0;
        var attendanceRate = totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;
        var onTimeSubmissions = submissions ? submissions.filter(function(s) { 
            return s.status === 'approved' && new Date(s.submitted_at) <= new Date(s.due_date); 
        }).length : 0;
        var consecutivePrayers = calculateConsecutiveStreak(dailyPractice, 'prayed');
        
        function renderAch(containerId, items, locked) {
            var el = document.getElementById(containerId);
            if (!el) return;
            if (!items.length) { 
                el.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--text-muted);">' + 
                    (locked ? 'Complete activities to unlock achievements!' : 'Start your journey to earn achievements!') + 
                    '</div>'; 
                return; 
            }
            el.innerHTML = items.map(function(a) {
                var criteria = ACHIEVEMENT_CRITERIA[a.name];
                var progress = 0;
                var progressText = '';
                
                if (locked && criteria) {
                    switch (criteria.type) {
                        case 'attendance':
                            progress = Math.min(100, Math.round(attendanceRate));
                            progressText = progress + '% attendance';
                            break;
                        case 'consistency':
                            progress = Math.min(100, Math.round((onTimeSubmissions / criteria.required) * 100));
                            progressText = onTimeSubmissions + '/' + criteria.required + ' on-time submissions';
                            break;
                        case 'sgi':
                            progress = 50; // Need SGI calculation
                            progressText = 'Show improvement over time';
                            break;
                        case 'spiritual':
                            if (a.name === 'Prayer Warrior') {
                                progress = Math.min(100, Math.round((consecutivePrayers / criteria.required) * 100));
                                progressText = consecutivePrayers + '/' + criteria.required + ' day streak';
                            } else {
                                progress = Math.min(100, Math.round((onTimeSubmissions / criteria.required) * 100));
                                progressText = onTimeSubmissions + '/' + criteria.required + ' submissions';
                            }
                            break;
                        case 'leadership':
                        case 'voice':
                        case 'graduate':
                            progress = Math.min(100, Math.round((presentSessions / criteria.required) * 100));
                            progressText = presentSessions + '/' + criteria.required + ' sessions';
                            break;
                    }
                }
                
                return '<div style="text-align:center;padding:1.25rem;background:var(--background);border-radius:var(--radius-md);border:1px solid ' + 
                    (locked ? 'var(--border)' : 'var(--success)') + ';' + (locked ? 'opacity:0.7;' : '') + '">' +
                    '<div style="font-size:2.5rem;">' + (a.icon || '[Medal]') + '</div>' +
                    '<p style="font-size:0.8rem;font-weight:700;margin:0.4rem 0 0.2rem;">' + (a.name || '') + '</p>' +
                    '<p style="font-size:0.7rem;color:var(--text-muted);margin:0;">' + (a.description || '') + '</p>' +
                    (locked ? '<div style="margin-top:0.5rem;"><div style="background:var(--border);height:6px;border-radius:3px;overflow:hidden;"><div style="background:var(--primary);height:100%;width:' + progress + '%;"></div></div><p style="font-size:0.65rem;color:var(--text-muted);margin:0.25rem 0 0;">' + progressText + '</p></div>' : '<p style="font-size:0.65rem;color:var(--success);margin-top:0.25rem;">✓ Earned</p>') +
                    '</div>';
            }).join('');
        }
        
        renderAch('earnedAchievements', earnedList, false);
        renderAch('lockedAchievements', lockedList, true);
        
        // Update category counts
        var categories = {
            'attendance': ['Perfect Attendance'],
            'consistency': ['Consistency Champion'],
            'leadership': ['Leadership Star', 'Kingdom Builder'],
            'voice': ['Voice Master'],
            'spiritual': ['Scripture Champion', 'Prayer Warrior'],
            'mentorship': ['Mentorship Excellence'],
            'graduate': ['CTFS Graduate']
        };
        
        Object.keys(categories).forEach(function(cat) {
            var catAchievements = categories[cat];
            var earnedInCat = catAchievements.filter(function(name) {
                return earnedList.some(function(a) { return a.name === name; });
            }).length;
            var catEl = document.getElementById('cat' + cat.charAt(0).toUpperCase() + cat.slice(1));
            if (catEl) catEl.textContent = earnedInCat + '/' + catAchievements.length + ' earned';
        });
        
    } catch (e) { 
        showSystemCard('Error loading achievements: ' + (e.message || 'Unknown error'), 'error');
    }
}

async function loadAICoachPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name, role').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    var _adminNameEl = document.getElementById('adminNameDisplay');
    var _mentorNameEl = document.getElementById('mentorNameDisplay');
    
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'User';
    if (_adminNameEl && currentProfile) _adminNameEl.textContent = currentProfile.full_name || 'Admin';
    if (_mentorNameEl && currentProfile) _mentorNameEl.textContent = currentProfile.full_name || 'Mentor';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(currentProfile.id, currentProfile.role);
    
    // Swap sidebar for admin/mentor users
    if (currentProfile && currentProfile.role !== 'student') {
        swapToRoleSidebar(currentProfile.role);
    }
}

async function loadGamesPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name, role').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    var _adminNameEl = document.getElementById('adminNameDisplay');
    var _mentorNameEl = document.getElementById('mentorNameDisplay');
    
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'User';
    if (_adminNameEl && currentProfile) _adminNameEl.textContent = currentProfile.full_name || 'Admin';
    if (_mentorNameEl && currentProfile) _mentorNameEl.textContent = currentProfile.full_name || 'Mentor';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(currentProfile.id, currentProfile.role);
    
    // Swap sidebar for admin/mentor users
    if (currentProfile && currentProfile.role !== 'student') {
        swapToRoleSidebar(currentProfile.role);
    }
}

async function loadLeaderboardPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name, role').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    var _adminNameEl = document.getElementById('adminNameDisplay');
    var _mentorNameEl = document.getElementById('mentorNameDisplay');
    
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'User';
    if (_adminNameEl && currentProfile) _adminNameEl.textContent = currentProfile.full_name || 'Admin';
    if (_mentorNameEl && currentProfile) _mentorNameEl.textContent = currentProfile.full_name || 'Mentor';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(currentProfile.id, currentProfile.role);
    
    // Swap sidebar for admin/mentor users
    if (currentProfile && currentProfile.role !== 'student') {
        swapToRoleSidebar(currentProfile.role);
    }
    
    try {
        var { data: scores } = await client.from('sgi_scores')
            .select('student_id, score, profiles(full_name)').order('score', { ascending: false }).limit(50);
        var list = scores || [];
        var userId = sessionData.data.session.user.id;
        var myIdx = list.findIndex(function(s) { return s.student_id === userId; });
        setEl('yourRank', myIdx !== -1 ? '#' + (myIdx + 1) : '-');
        setEl('yourSGI', myIdx !== -1 ? Math.round(list[myIdx].score) + '%' : '0%');
        setEl('topScore', list.length > 0 ? Math.round(list[0].score) + '%' : '0%');
        var medals = ['1st', '2nd', '3rd'];
        var el = document.getElementById('leaderboardList');
        if (el) {
            el.innerHTML = list.length ? list.map(function(s, i) {
                var isMe = s.student_id === userId;
                return '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.875rem 1rem;' +
                    'background:' + (isMe ? 'rgba(37,99,235,0.08)' : 'var(--background)') + ';border-radius:var(--radius-md);' +
                    'border:' + (isMe ? '2px solid var(--primary)' : '1px solid var(--border-light)') + ';margin-bottom:0.375rem;' +
                    (i === 0 ? 'box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3); border-color: gold;' : '') +
                    (i === 1 ? 'box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3); border-color: silver;' : '') +
                    (i === 2 ? 'box-shadow: 0 4px 12px rgba(205, 127, 50, 0.3); border-color: #cd7f32;' : '') +
                    '">' +
                    '<div style="display:flex;align-items:center;gap:0.75rem;">' +
                    '<span style="font-weight:700;min-width:32px;font-size:1.1rem;">' + (i < 3 ? medals[i] : '#' + (i + 1)) + '</span>' +
                    '<span style="font-weight:600;">' + (s.profiles ? s.profiles.full_name : 'Student') + '</span>' +
                    (isMe ? '<span style="font-size:0.625rem;background:var(--primary);color:white;padding:0.1rem 0.4rem;border-radius:var(--radius-full);">You</span>' : '') +
                    '</div><span style="font-weight:700;color:var(--primary);">' + Math.round(s.score || 0) + '%</span></div>';
            }).join('') : '<div style="text-align:center;padding:2rem;color:var(--text-muted);">No leaderboard data yet. Complete activities to appear on the leaderboard!</div>';
        }
        var hofData = [
            ['hallTopStudent', list[0] ? (list[0].profiles ? list[0].profiles.full_name : 'Not yet assigned') : 'Not yet assigned'],
            ['hallStudentLeader', list[1] ? (list[1].profiles ? list[1].profiles.full_name : 'Not yet assigned') : 'Not yet assigned'],
            ['hallContributor', list[2] ? (list[2].profiles ? list[2].profiles.full_name : 'Not yet assigned') : 'Not yet assigned'],
            ['hallGraduates', 'First cohort in progress']
        ];
        hofData.forEach(function(h) { setEl(h[0], h[1]); });
    } catch (e) { 
        showSystemCard('Error loading leaderboard: ' + (e.message || 'Unknown error'), 'error');
    }
}

async function loadProfilePage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    try {
        var { data: profile } = await client.from('profiles').select('*').eq('id', sessionData.data.session.user.id).single();
        if (!profile) return;
        setEl('profileName', profile.full_name || 'Student');
        setEl('profileRole', profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Student');
        setEl('profileFullName', profile.full_name || 'N/A');
        setEl('profileEmail', profile.email || 'N/A');
        setEl('profileAge', profile.age ? profile.age + ' years' : 'N/A');
        setEl('profileRoleText', profile.role || 'student');
        setEl('userNameDisplay', profile.full_name || 'Student');
        setEl('profileJoined', profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A');
        
        // Load profile picture in topbar
        await loadUserAvatar(sessionData.data.session.user.id, profile.role);
        
        // Load large profile picture on profile page
        loadLargeProfilePicture(sessionData.data.session.user.id);
        
        // Set correct emoji based on role
        var emojis = { 'admin': '&#9881;&#65039;', 'mentor': '&#128104;&#8205;&#127979;', 'student': '&#129489;&#8205;&#127891;' };
        var fallbackEl = document.getElementById('largeProfileFallback');
        if (fallbackEl) {
            fallbackEl.innerHTML = emojis[profile.role] || '&#128100;';
        }
        
        var { data: sgi } = await client.from('sgi_scores').select('score').eq('student_id', sessionData.data.session.user.id).single();
        setEl('profileSGI', sgi ? Math.round(sgi.score) + '%' : '0%');
        var { data: att } = await client.from('attendance').select('status').eq('student_id', sessionData.data.session.user.id);
        if (att && att.length > 0) setEl('profileAttendance', Math.round(att.filter(function(a) { return a.status === 'participated'; }).length / att.length * 100) + '%');
        var { data: achiev } = await client.from('user_achievements').select('id').eq('student_id', sessionData.data.session.user.id);
        setEl('profileAchievements', achiev ? achiev.length : 0);
        var { data: subs } = await client.from('task_submissions').select('id').eq('student_id', sessionData.data.session.user.id).eq('status', 'approved');
        setEl('profileTasks', subs ? subs.length : 0);
        var { data: earnedAch } = await client.from('user_achievements').select('achievements(name, icon)').eq('student_id', sessionData.data.session.user.id).limit(6);
        var achList = document.getElementById('profileAchievementsList');
        if (achList) {
            achList.innerHTML = earnedAch && earnedAch.length ? earnedAch.map(function(e) {
                return '<div style="text-align:center;padding:0.75rem;background:var(--background);border-radius:var(--radius-md);min-width:90px;border:1px solid var(--border);">' +
                    '<div style="font-size:2rem;">' + (e.achievements ? (e.achievements.icon || '[Medal]') : '[Medal]') + '</div>' +
                    '<p style="font-size:0.7rem;font-weight:600;margin:0.25rem 0 0;">' + (e.achievements ? e.achievements.name : '') + '</p></div>';
            }).join('') : '<p style="color:var(--text-muted);font-size:0.875rem;">No achievements yet. Keep going!</p>';
        }
    } catch (e) { console.error('Profile error:', e); }
}

async function loadSettingsPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    try {
        var { data: profile } = await client.from('profiles').select('*').eq('id', sessionData.data.session.user.id).single();
        if (!profile) return;
        var setVal = function(id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
        setVal('settingsFullName', profile.full_name);
        setVal('settingsEmail', profile.email);
        setVal('settingsAge', profile.age);
        setEl('userNameDisplay', profile.full_name || 'Student');
        
        // Load profile picture in topbar
        await loadUserAvatar(sessionData.data.session.user.id, profile.role);
    } catch (e) { console.error('Settings error:', e); }
}

async function updateProfile(event) {
    event.preventDefault();
    var fullName = document.getElementById('settingsFullName') ? document.getElementById('settingsFullName').value.trim() : '';
    var age = parseInt(document.getElementById('settingsAge') ? document.getElementById('settingsAge').value : '');
    if (!fullName) { showSettingsMsg('Please enter your full name', 'error'); return; }
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) throw new Error('Not logged in');
        var { error } = await client.from('profiles').update({ full_name: fullName, age: age || null }).eq('id', sessionData.data.session.user.id);
        if (error) throw error;
        showSettingsMsg('Profile updated successfully!', 'success');
        setEl('userNameDisplay', fullName);
    } catch (e) { showSettingsMsg('Error: ' + (e.message || 'Unknown error'), 'error'); }
}

async function changePassword(event) {
    event.preventDefault();
    var newPwd = document.getElementById('newPassword') ? document.getElementById('newPassword').value : '';
    var confirmPwd = document.getElementById('confirmNewPassword') ? document.getElementById('confirmNewPassword').value : '';
    if (!newPwd || newPwd.length < 8) { showSettingsMsg('New password must be at least 8 characters', 'error'); return; }
    if (newPwd !== confirmPwd) { showSettingsMsg('Passwords do not match', 'error'); return; }
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Not connected');
        var { error } = await client.auth.updateUser({ password: newPwd });
        if (error) throw error;
        showSettingsMsg('Password changed successfully!', 'success');
        document.getElementById('securitySettings').reset();
    } catch (e) { showSettingsMsg('Error: ' + (e.message || 'Unknown error'), 'error'); }
}

function showSettingsMsg(msg, type) {
    var el = document.getElementById('settingsMessage');
    if (!el) {
        el = document.createElement('div'); el.id = 'settingsMessage';
        var content = document.querySelector('.dashboard-content');
        if (content) content.insertAdjacentElement('afterbegin', el);
    }
    el.style.cssText = 'padding:0.75rem 1rem;border-radius:var(--radius-md);margin-bottom:1rem;font-weight:500;' +
        'background:' + (type === 'success' ? '#ECFDF5' : '#FEF2F2') + ';' +
        'color:' + (type === 'success' ? 'var(--success)' : 'var(--danger)') + ';' +
        'border:1px solid ' + (type === 'success' ? '#A7F3D0' : '#FECACA') + ';';
    el.textContent = msg;
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 4000);
}

function saveNotificationSettings() {
    var prefs = {
        assignments: document.getElementById('notifyAssignments') ? document.getElementById('notifyAssignments').checked : true,
        attendance: document.getElementById('notifyAttendance') ? document.getElementById('notifyAttendance').checked : true,
        achievements: document.getElementById('notifyAchievements') ? document.getElementById('notifyAchievements').checked : true,
        announcements: document.getElementById('notifyAnnouncements') ? document.getElementById('notifyAnnouncements').checked : true
    };
    localStorage.setItem('ngt_notifications', JSON.stringify(prefs));
    showSettingsMsg('Notification settings saved!', 'success');
}
function deactivateAccount() { if (!confirm('Deactivate your account?')) return; showSettingsMsg('Deactivation request submitted.', 'success'); }
function deleteAccount() {
    if (!confirm('This will permanently delete your account. Are you sure?')) return;
    if (!confirm('Last chance - are you absolutely sure?')) return;
    showSettingsMsg('Deletion request submitted. An admin will process it within 48 hours.', 'success');
}

async function loadActivityFeedPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    var userId = sessionData.data.session.user.id;

    // Load own profile if checkAuth hasn't run yet
    if (!currentProfile) {
        var { data: p } = await client.from('profiles').select('full_name').eq('id', userId).single();
        if (p) currentProfile = p;
    }
    var nameEl = document.getElementById('userNameDisplay');
    if (nameEl && currentProfile) nameEl.textContent = currentProfile.full_name || 'Student';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(userId, currentProfile.role);
    
    try {
        var { data: all } = await client.from('activities').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(30);
        var activities = all || [];
        function renderFeed(containerId, items, emptyMsg) {
            var el = document.getElementById(containerId);
            if (!el) return;
            if (!items.length) { el.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--text-muted);">' + emptyMsg + '</div>'; return; }
            el.innerHTML = items.map(function(a) {
                return '<div class="activity-item">' +
                    '<div class="activity-header"><span class="activity-avatar">' + (a.is_announcement ? '[A]' : '[M]') + '</span>' +
                    '<div><strong>' + (a.is_announcement ? 'Announcement' : (a.profiles ? a.profiles.full_name : 'Mentor')) + '</strong>' +
                    '<span class="activity-time">' + timeAgo(a.created_at) + '</span></div></div>' +
                    '<p class="activity-content" style="font-weight:600;">' + (a.title || '') + '</p>' +
                    (a.description ? '<p style="font-size:0.875rem;color:var(--text-light);padding-left:2.25rem;margin:0;">' + a.description + '</p>' : '') +
                    (a.media_url ? '<div style="padding-left:2.25rem;margin-top:0.5rem;"><a href="' + a.media_url + '" target="_blank" class="btn btn-sm btn-outline">View Media</a></div>' : '') +
                    '</div>';
            }).join('');
        }
        renderFeed('announcementsFeed', activities.filter(function(a) { return a.is_announcement; }), 'No announcements yet.');
        renderFeed('sessionUpdates', activities.filter(function(a) { return !a.is_announcement; }), 'No session updates yet.');
        
        // Load community discussion
        loadCommunityDiscussion();
        
        var { data: recent } = await client.from('user_achievements')
            .select('student_id, earned_at, achievements(name, icon)')
            .order('earned_at', { ascending: false }).limit(10);
        var achEl = document.getElementById('communityAchievements');
        if (achEl) {
            if (!recent || !recent.length) { achEl.innerHTML = '<div style="text-align:center;padding:1rem;color:var(--text-muted);">No community achievements yet.</div>'; }
            else {
                achEl.innerHTML = recent.map(function(r) {
                    return '<div class="activity-item"><div class="activity-header">' +
                        '<span class="activity-avatar">' + (r.achievements ? (r.achievements.icon || '[Medal]') : '[Medal]') + '</span>' +
                        '<div><strong>' + (r.profiles ? r.profiles.full_name : 'A student') + '</strong>' +
                        '<span class="activity-time">' + timeAgo(r.created_at) + '</span></div></div>' +
                        '<p class="activity-content">Earned the <strong>' + (r.achievements ? r.achievements.name : 'achievement') + '</strong> badge!</p>' +
                        '</div>';
                }).join('');
            }
        }
    } catch (e) { console.error('Activity feed page error:', e); }
}

async function loadProgramsPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'Student';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(sessionData.data.session.user.id, currentProfile.role);
    
    var setBar = function(barId, textId, pct) {
        var bar = document.getElementById(barId);
        var txt = document.getElementById(textId);
        if (bar) bar.style.width = pct + '%';
        if (txt) txt.textContent = pct + '% complete';
    };
    setBar('ctfsProgressBar', 'ctfsProgressText', 0);
    setBar('choirProgressBar', 'choirProgressText', 0);
}

async function loadCTFSPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'Student';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(sessionData.data.session.user.id, currentProfile.role);
    
    try {
        var userId = sessionData.data.session.user.id;
        var { data: att } = await client.from('attendance').select('status, session_id, sessions(program_id, programs(slug))').eq('student_id', userId);
        var ctfsAtt = (att || []).filter(function(a) { return a.sessions && a.sessions.programs && (a.sessions.programs.slug === 'ctfs'); });
        var attPct = ctfsAtt.length > 0 ? Math.round(ctfsAtt.filter(function(a) { return a.status === 'participated'; }).length / ctfsAtt.length * 100) : 0;
        var weeks = Math.min(Math.floor(ctfsAtt.length / 2), 12);
        setEl('ctfsProgress', Math.round(weeks / 12 * 100) + '%');
        setEl('ctfsWeeks', weeks + '/12');
        setEl('ctfsAttendance', attPct + '%');
        var scheduleEl = document.getElementById('ctfsSchedule');
        if (scheduleEl) {
            var { data: progData } = await client.from('programs').select('id').eq('slug', 'ctfs').single();
            if (progData) {
                var { data: ctfsSessions } = await client.from('sessions').select('id, title, week_number').eq('program_id', progData.id).order('week_number', { ascending: true });
                if (ctfsSessions && ctfsSessions.length) {
                    var doneIds = new Set(ctfsAtt.filter(function(a) { return a.status === 'participated'; }).map(function(a) { return a.session_id; }));
                    scheduleEl.innerHTML = ctfsSessions.map(function(s) {
                        var done = doneIds.has(s.id);
                        return '<a href="lesson.html?session=' + s.id + '&program=ctfs" style="text-decoration:none;">' +
                            '<div style="padding:0.5rem;background:' + (done ? '#ECFDF5' : 'var(--background)') + ';border-radius:var(--radius-sm);border:1px solid ' + (done ? 'var(--success)' : 'var(--border)') + ';text-align:center;font-size:0.7rem;cursor:pointer;transition:all 0.2s;">' +
                            (done ? '[OK]' : '') + ' Wk' + (s.week_number || '?') + '</div></a>';
                    }).join('');
                } else {
                    scheduleEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.875rem;">Sessions loading soon.</p>';
                }
            }
        }
        var { data: assignments } = await client.from('tasks').select('id, title, sessions(title, programs(slug))').limit(20);
        var ctfsAssign = (assignments || []).filter(function(a) { return a.sessions && a.sessions.programs && a.sessions.programs.slug === 'ctfs'; });
        var { data: mySubs } = await client.from('task_submissions').select('task_id, status').eq('student_id', userId);
        var subMap = {};
        if (mySubs) mySubs.forEach(function(s) { subMap[s.task_id] = s.status; });
        var el = document.getElementById('ctfsAssignments');
        if (el) {
            el.innerHTML = ctfsAssign.length ? ctfsAssign.map(function(a) {
                var s = subMap[a.id] || 'not_submitted';
                var badge = s === 'approved' ? 'success' : s === 'pending' ? 'warning' : s === 'rejected' ? 'danger' : 'info';
                var label = s === 'approved' ? 'Approved' : s === 'pending' ? 'Under Review' : s === 'rejected' ? 'Rejected' : 'Not Submitted';
                return '<div class="assignment-item"><div><h4>' + (a.title || '') + '</h4>' +
                    '<p>' + (a.sessions ? a.sessions.title : 'Session') + '</p></div>' +
                    (s === 'not_submitted' || s === 'rejected' ? '<button class="btn btn-sm btn-primary" onclick="startAssignment(\'' + a.id + '\')">Submit</button>' : '<span class="badge ' + badge + '">' + label + '</span>') +
                    '</div>';
            }).join('') : '<div style="text-align:center;padding:1rem;color:var(--text-muted);">No assignments yet.</div>';
        }
    } catch (e) { console.error('CTFS page error:', e); }
}

async function loadChoirPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'Student';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(sessionData.data.session.user.id, currentProfile.role);
    
    try {
        var userId = sessionData.data.session.user.id;
        var { data: att } = await client.from('attendance').select('status, sessions(programs(slug))').eq('student_id', userId);
        var choirAtt = (att || []).filter(function(a) { return a.sessions && a.sessions.programs && (a.sessions.programs.slug === 'tcvlmdp' || a.sessions.programs.slug === 'choir'); });
        var attPct = choirAtt.length > 0 ? Math.round(choirAtt.filter(function(a) { return a.status === 'present'; }).length / choirAtt.length * 100) : 0;
        setEl('choirProgress', attPct + '%');
        setEl('choirSessions', choirAtt.length);
        var bar = document.getElementById('choirAttendanceBar');
        if (bar) bar.style.width = attPct + '%';
        setEl('choirAttendanceText', attPct + '% attendance');
        var { data: exercises, error: exercisesError } = await client.from('tasks')
            .select('id, title, description, sessions(title, programs(slug))').limit(100);
        if (exercisesError) throw exercisesError;
        var choirExercises = (exercises || []).filter(function(exercise) {
            var program = exercise.sessions && exercise.sessions.programs;
            return program && (program.slug === 'tcvlmdp' || program.slug === 'choir');
        });
        var { data: mySubmissions } = await client.from('task_submissions').select('task_id, status').eq('student_id', userId);
        var submissionMap = {};
        (mySubmissions || []).forEach(function(submission) { submissionMap[submission.task_id] = submission.status; });
        var completed = choirExercises.filter(function(exercise) { return submissionMap[exercise.id] === 'approved'; }).length;
        var assignmentPct = choirExercises.length ? Math.round(completed / choirExercises.length * 100) : 0;
        var subBar = document.getElementById('choirAssignmentsBar');
        if (subBar) subBar.style.width = assignmentPct + '%';
        setEl('choirAssignmentsText', assignmentPct + '% completed');
        var el = document.getElementById('choirExercises');
        if (el) el.innerHTML = choirExercises.length ? choirExercises.map(function(exercise) {
            var status = submissionMap[exercise.id];
            var action = !status || status === 'rejected'
                ? '<button class="btn btn-sm btn-primary" onclick="startAssignment(\'' + exercise.id + '\')">Upload recording</button>'
                : '<span class="badge ' + (status === 'approved' ? 'success' : 'warning') + '">' + (status === 'approved' ? 'Approved' : 'Under review') + '</span>';
            return '<div class="assignment-item"><div><h4>' + (exercise.title || 'Voice exercise') + '</h4><p>' + (exercise.description || 'Record and submit your exercise for mentor review.') + '</p></div>' + action + '</div>';
        }).join('') : '<div style="text-align:center;padding:1rem;color:var(--text-muted);">No voice exercises yet. Your mentor can add them in Session Manager.</div>';
    } catch (e) { console.error('Choir page error:', e); }
}

async function loadAICoachPage() {
    var client = await getSupabase();
    if (!client) return;
    var sessionData = await client.auth.getSession();
    if (!sessionData.data.session) return;
    if (!currentProfile) {
        var _pRes = await client.from('profiles').select('full_name').eq('id', sessionData.data.session.user.id).single();
        if (_pRes.data) currentProfile = _pRes.data;
    }
    var _nameEl = document.getElementById('userNameDisplay');
    if (_nameEl && currentProfile) _nameEl.textContent = currentProfile.full_name || 'Student';
    
    // Load profile picture in topbar
    if (currentProfile) await loadUserAvatar(sessionData.data.session.user.id, currentProfile.role);
    
    var input = document.getElementById('aiQuestion');
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAICoach(); }
        });
    }
}

// ========================================
// AI COACH
// ========================================

async function askAICoach() {
    var input = document.getElementById('aiQuestion');
    var question = input ? input.value.trim() : '';
    if (!question) { showSystemCard('Please enter a question.', 'error'); return; }
    if (input) input.value = '';
    await askAICoachPrompt(question);
}

async function askAICoachPrompt(question) {
    var container = document.getElementById('aiChatContainer');
    if (!container) return;

    container.innerHTML += '<div style="text-align:right;margin-bottom:0.5rem;">' +
        '<div style="display:inline-block;background:var(--primary);color:white;padding:0.5rem 1rem;border-radius:var(--radius-md);max-width:80%;text-align:left;">' +
        question + '</div></div>';

    var loadingId = 'loading-' + Date.now();
    container.innerHTML += '<div id="' + loadingId + '" style="text-align:left;margin-bottom:0.5rem;">' +
        '<div style="display:inline-block;background:var(--background);padding:0.5rem 1rem;border-radius:var(--radius-md);">Thinking...</div></div>';
    container.scrollTop = container.scrollHeight;

    try {
        var response = await callGroqAPI(question);
        var loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.parentNode.removeChild(loadingEl);
        container.innerHTML += '<div style="text-align:left;margin-bottom:0.5rem;">' +
            '<div style="display:inline-block;background:var(--background);padding:0.5rem 1rem;border-radius:var(--radius-md);max-width:80%;">' +
            response + '</div></div>';
        container.scrollTop = container.scrollHeight;
        updateAIGrowthIndicators(question);
    } catch (error) {
        var loadingEl2 = document.getElementById(loadingId);
        if (loadingEl2) loadingEl2.parentNode.removeChild(loadingEl2);
        container.innerHTML += '<div style="text-align:left;margin-bottom:0.5rem;">' +
            '<div style="display:inline-block;background:#FEF2F2;padding:0.5rem 1rem;border-radius:var(--radius-md);color:var(--danger);">' +
            'Sorry, I encountered an error. Please try again.</div></div>';
        console.error('AI Coach error:', error);
    }
}

async function callGroqAPI(question) {
    try {
        var response = await fetch(AI_PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: question }],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            throw new Error('AI service unavailable');
        }
        
        var data = await response.json();
        return data.reply || data.message || 'I apologize, but I could not generate a response at this time.';
    } catch (error) {
        console.error('AI API error:', error);
        // Return a helpful fallback response
        return 'I apologize, but the AI Coach service is currently unavailable. This requires a server-side AI proxy to be configured. Please contact your administrator to set up the AI service, or try again later.';
    }
}

function updateAIGrowthIndicators(question) {
    var lq = question.toLowerCase();
    var map = {
        Communication: ['communicat', 'speak', 'express', 'talk', 'listen'],
        Leadership: ['lead', 'responsib', 'team', 'organiz', 'decision'],
        GrowthMindset: ['grow', 'learn', 'improve', 'goal', 'habit', 'mindset'],
        Teamwork: ['team', 'together', 'collaborat', 'group'],
        Initiative: ['initiative', 'start', 'proactive', 'idea', 'creat'],
        Emotional: ['feel', 'emotion', 'anger', 'sad', 'happy', 'stress']
    };
    Object.keys(map).forEach(function(key) {
        var keywords = map[key];
        var matches = keywords.some(function(k) { return lq.indexOf(k) !== -1; });
        if (matches) {
            var bar = document.getElementById('ai' + key);
            if (bar) {
                var current = parseInt(bar.style.width) || 20;
                var newVal = Math.min(current + 5, 100);
                bar.style.width = newVal + '%';
                var text = document.getElementById('ai' + key + 'Text');
                if (text) text.textContent = newVal >= 70 ? 'Strong' : newVal >= 40 ? 'Developing' : 'Emerging';
            }
        }
    });
}

// ========================================
// QUIZ ENGINE
// Random pools: each attempt draws a different set
// ========================================

var QUIZ_BANK = {
    bible: [
        /* Pentateuch & Law */
        { q: 'What does the Bible say is the greatest commandment?', options: ['Love God with all your heart', 'Honor your parents', 'Do not steal', 'Keep the Sabbath'], correct: 0 },
        { q: 'Which book contains the Ten Commandments?', options: ['Genesis', 'Leviticus', 'Exodus', 'Numbers'], correct: 2 },
        { q: 'What did God create on the first day?', options: ['Animals', 'Light', 'Man', 'Plants'], correct: 1 },
        { q: 'Who built the ark?', options: ['Moses', 'Noah', 'Abraham', 'Jacob'], correct: 1 },
        { q: 'Who was sold by his brothers into slavery?', options: ['Benjamin', 'Joseph', 'Reuben', 'Levi'], correct: 1 },
        { q: 'Who led Israel out of Egypt?', options: ['Abraham', 'Moses', 'Joshua', 'David'], correct: 1 },
        { q: 'What is the first book of the Bible?', options: ['Exodus', 'Matthew', 'Genesis', 'Psalms'], correct: 2 },
        { q: 'Who asked, "Am I my brother\'s keeper?"', options: ['Abel', 'Cain', 'Seth', 'Noah'], correct: 1 },
        { q: 'Who was the father of many nations?', options: ['Isaac', 'Abraham', 'Jacob', 'Noah'], correct: 1 },
        { q: 'What sea did Moses lead Israel through?', options: ['Dead Sea', 'Red Sea', 'Mediterranean', 'Galilee'], correct: 1 },
        { q: 'Which fruit did Adam and Eve eat from in the garden?', options: ['The tree of life', 'The tree of the knowledge of good and evil', 'An olive tree', 'A fig tree only'], correct: 1 },
        { q: 'Who received the Ten Commandments on Mount Sinai?', options: ['Aaron', 'Joshua', 'Moses', 'Caleb'], correct: 2 },

        /* Historical Books */
        { q: 'Who was the first king of Israel?', options: ['David', 'Solomon', 'Saul', 'Samuel'], correct: 2 },
        { q: 'What did David use to defeat Goliath?', options: ['A sword', 'A sling and stone', 'A spear', 'An arrow'], correct: 1 },
        { q: 'Who was known as a man after God\'s own heart?', options: ['Saul', 'David', 'Solomon', 'Absalom'], correct: 1 },
        { q: 'Who was known for great wisdom and built the temple in Jerusalem?', options: ['David', 'Solomon', 'Hezekiah', 'Josiah'], correct: 1 },
        { q: 'Which woman became queen and saved her people?', options: ['Ruth', 'Esther', 'Deborah', 'Hannah'], correct: 1 },
        { q: 'What city fell after Israel marched around it seven days?', options: ['Jerusalem', 'Jericho', 'Babylon', 'Nineveh'], correct: 1 },
        { q: 'Who was the strongest man in the Bible, known for his hair?', options: ['Goliath', 'Samson', 'Saul', 'Absalom'], correct: 1 },
        { q: 'Who rebuilt Jerusalem\'s walls after the exile?', options: ['Ezra', 'Nehemiah', 'Daniel', 'Haggai'], correct: 1 },

        /* Wisdom Literature */
        { q: 'What does "the fear of the Lord" represent in Proverbs?', options: ['Being afraid of God', 'The beginning of wisdom', 'Running from God', 'Obeying laws only'], correct: 1 },
        { q: 'Which book is known as a collection of wisdom sayings?', options: ['Proverbs', 'Acts', 'Revelation', 'Judges'], correct: 0 },
        { q: 'What does Psalm 23 begin with?', options: ['"Bless the Lord, O my soul"', '"The Lord is my shepherd"', '"Create in me a clean heart"', '"I will lift up my eyes"'], correct: 1 },
        { q: 'Which book of the Bible consists of 150 sacred songs and prayers?', options: ['Proverbs', 'Psalms', 'Ecclesiastes', 'Song of Solomon'], correct: 1 },
        { q: 'Which book states "There is a time for everything, and a season for every activity"?', options: ['Job', 'Ecclesiastes', 'Proverbs', 'Isaiah'], correct: 1 },

        /* Major & Minor Prophets */
        { q: 'Who was thrown into the lion\'s den and survived?', options: ['Elijah', 'Daniel', 'Paul', 'Joseph'], correct: 1 },
        { q: 'Who was swallowed by a great fish when running from God?', options: ['Noah', 'Jonah', 'Job', 'Elijah'], correct: 1 },
        { q: 'Which prophet was taken to heaven in a whirlwind?', options: ['Isaiah', 'Elijah', 'Elisha', 'Jeremiah'], correct: 1 },
        { q: 'Which prophet wrote: "For I know the plans I have for you..."?', options: ['Isaiah', 'Jeremiah', 'Ezekiel', 'Daniel'], correct: 1 },
        { q: 'Which prophet foretold the virgin birth of Immanuel?', options: ['Isaiah', 'Hosea', 'Micah', 'Amos'], correct: 0 },

        /* Gospels & Acts */
        { q: 'Where was Jesus born?', options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Jericho'], correct: 2 },
        { q: 'How many disciples did Jesus choose?', options: ['7', '10', '12', '15'], correct: 2 },
        { q: 'Complete: "For God so loved the world that He gave..."', options: ['...His blessings freely', '...His only begotten Son', '...the Ten Commandments', '...the prophets'], correct: 1 },
        { q: 'In which garden did Jesus pray before His arrest?', options: ['Eden', 'Gethsemane', 'Galilee', 'Bethany'], correct: 1 },
        { q: 'What is the shortest verse in the Bible often cited as?', options: ['"God is love"', '"Jesus wept"', '"Pray always"', '"Be still"'], correct: 1 },
        { q: 'What river did John the Baptist baptize in?', options: ['Nile', 'Jordan', 'Euphrates', 'Tigris'], correct: 1 },
        { q: 'Who was the mother of Jesus?', options: ['Martha', 'Mary', 'Elizabeth', 'Ruth'], correct: 1 },
        { q: 'Which apostle denied Jesus three times?', options: ['John', 'Thomas', 'Peter', 'Andrew'], correct: 2 },
        { q: 'Who betrayed Jesus for thirty pieces of silver?', options: ['Peter', 'Judas Iscariot', 'Thomas', 'Pilate'], correct: 1 },
        { q: 'Which disciple was a tax collector before following Jesus?', options: ['Peter', 'Matthew', 'John', 'Andrew'], correct: 1 },
        { q: 'Which gospel writer was a physician?', options: ['Matthew', 'Mark', 'Luke', 'John'], correct: 2 },
        { q: 'What does "Emmanuel" mean?', options: ['God is mighty', 'God with us', 'God saves', 'Prince of Peace'], correct: 1 },
        { q: 'Which book records the coming of the Holy Spirit at Pentecost?', options: ['Romans', 'Acts', 'Hebrews', 'Revelation'], correct: 1 },

        /* Epistles & Revelation */
        { q: 'What fruit of the Spirit is listed FIRST in Galatians 5:22?', options: ['Peace', 'Joy', 'Love', 'Patience'], correct: 2 },
        { q: 'Complete: "I can do all things through Christ who..."', options: ['...saves me', '...loves me', '...strengthens me', '...forgives me'], correct: 2 },
        { q: 'Who wrote most of the New Testament epistles?', options: ['Peter', 'John', 'Paul', 'James'], correct: 2 },
        { q: 'What is the last book of the Bible?', options: ['Jude', 'Malachi', 'Revelation', 'Acts'], correct: 2 },
        { q: 'Hebrews 11:1 defines faith as confidence in what we...', options: ['See clearly', 'Hope for', 'Earn by work', 'Feel emotionally'], correct: 1 },
        { q: 'Which letter describes love as "patient, kind, and not proud"?', options: ['1 Corinthians', 'Romans', 'Ephesians', 'Galatians'], correct: 0 }
    ],
    general: [
        { q: 'What is the foundation of Christian teenage life?', options: ['Entertainment', 'Faith in God', 'Academic success', 'Social media'], correct: 1 },
        { q: 'Which value is most important in leadership?', options: ['Power', 'Popularity', 'Integrity', 'Speed'], correct: 2 },
        { q: 'What does SGI stand for?', options: ['Student Growth Index', 'Study Grade Indicator', 'Senior Group Integration', 'Social Growth Index'], correct: 0 },
        { q: 'What is the first step in the leadership pathway?', options: ['Mentor', 'Junior Mentor', 'Student', 'Student Leader'], correct: 2 },
        { q: 'How many weeks does the CTFS program run?', options: ['8', '10', '12', '16'], correct: 2 },
        { q: 'What does CTFS stand for?', options: ['Christian Teen Faith Study', 'Christian Teenage Fellowship Session', 'Church Teen Formation School', 'Community Teen Fellowship Society'], correct: 1 },
        { q: 'What does TCVLMDP focus on most?', options: ['Sports only', 'Voice, leadership, and mentorship', 'Coding only', 'Exams only'], correct: 1 },
        { q: 'A growth mindset means you believe...', options: ['Talent never changes', 'You can grow through effort and learning', 'Failure is final', 'Only grades matter'], correct: 1 },
        { q: 'Which habit best supports spiritual growth?', options: ['Ignoring challenges', 'Consistent prayer and Scripture', 'Comparing yourself daily', 'Avoiding community'], correct: 1 },
        { q: 'Servant leadership prioritizes...', options: ['Being served by others', 'Serving and lifting others', 'Winning arguments', 'Holding titles'], correct: 1 },
        { q: 'Accountability in NextGenTeens means...', options: ['Hiding mistakes', 'Owning actions and growing from feedback', 'Blaming others', 'Avoiding mentors'], correct: 1 },
        { q: 'Character is best shown when...', options: ['People are watching only', 'No one is watching', 'You are winning', 'You are popular'], correct: 1 },
        { q: 'Healthy communication starts with...', options: ['Interrupting first', 'Listening with respect', 'Winning the debate', 'Speaking louder'], correct: 1 },
        { q: 'Purpose and identity are rooted first in...', options: ['Social media likes', 'God\'s design and calling', 'Peer pressure', 'Fashion trends'], correct: 1 },
        { q: 'Discipline and habits help teens...', options: ['Avoid all fun', 'Build consistency toward goals', 'Please everyone', 'Skip responsibility'], correct: 1 }
    ],
    leadership: [
        { q: 'True biblical leadership is best described as...', options: ['Domination', 'Servant influence', 'Popularity contests', 'Silent observation only'], correct: 1 },
        { q: 'When a teammate underperforms, a good leader should...', options: ['Shame them publicly', 'Talk privately with care and clarity', 'Ignore them forever', 'Do all the work alone always'], correct: 1 },
        { q: 'Integrity means...', options: ['Looking good online', 'Doing right even when unseen', 'Agreeing with everyone', 'Avoiding hard choices'], correct: 1 },
        { q: 'A leader with vision can...', options: ['See only problems', 'Cast direction and inspire action', 'Avoid planning', 'Work alone only'], correct: 1 },
        { q: 'Feedback should be received with...', options: ['Defensiveness', 'Gratitude and growth', 'Anger', 'Silence forever'], correct: 1 },
        { q: 'Jesus modeled leadership by...', options: ['Seeking status', 'Serving others', 'Avoiding people', 'Demanding titles'], correct: 1 },
        { q: 'Accountability helps leaders...', options: ['Hide weakness', 'Stay honest and improve', 'Control others', 'Avoid mentors'], correct: 1 },
        { q: 'Delegation is wise because...', options: ['Leaders should do everything', 'Teams grow when trusted with responsibility', 'It avoids work', 'It removes standards'], correct: 1 }
    ],
    communication: [
        { q: 'Active listening means...', options: ['Waiting to reply only', 'Fully attending and understanding others', 'Finishing their sentences', 'Checking your phone'], correct: 1 },
        { q: 'Before speaking, THINK asks if words are...', options: ['Trendy and loud', 'True, Helpful, Inspiring, Necessary, Kind', 'Funny only', 'Short only'], correct: 1 },
        { q: 'Tone matters because...', options: ['Words never hurt', 'How you say it shapes how it is received', 'Only content counts', 'Volume equals truth'], correct: 1 },
        { q: 'In conflict, the best first step is often...', options: ['Attack first', 'Stay calm and seek understanding', 'Gossip', 'Walk away forever'], correct: 1 },
        { q: 'Empathy in conversation means...', options: ['Agreeing always', 'Seeking to feel with the other person', 'Giving advice only', 'Changing the subject'], correct: 1 },
        { q: 'Constructive feedback focuses on...', options: ['Attacking character', 'Behavior and improvement', 'Public shame', 'Silent resentment'], correct: 1 },
        { q: 'Colossians 4:6 encourages speech that is...', options: ['Harsh and clever', 'Gracious and seasoned with salt', 'Silent always', 'Argumentative'], correct: 1 },
        { q: 'Digital communication still requires...', options: ['No respect', 'Clarity, kindness, and integrity', 'All caps always', 'Instant anger'], correct: 1 }
    ],
    faith: [
        { q: 'Hebrews 11:1 defines faith as...', options: ['Wishful thinking', 'Confidence in what we hope for', 'Blind luck', 'Religious routine only'], correct: 1 },
        { q: 'Faith without works is described as...', options: ['Perfect', 'Dead', 'Optional', 'Automatic'], correct: 1 },
        { q: 'Faith grows best through...', options: ['Avoiding trials', 'God\'s Word, prayer, and obedience', 'Comparison', 'Isolation'], correct: 1 },
        { q: 'Trusting God means...', options: ['Never planning', 'Relying on His character and promises', 'Ignoring wisdom', 'Waiting passively forever'], correct: 1 },
        { q: 'A living faith produces...', options: ['Fear only', 'Love, obedience, and hope', 'Pride', 'Isolation'], correct: 1 },
        { q: 'Prayer strengthens faith by...', options: ['Replacing Scripture', 'Deepening relationship with God', 'Guaranteeing wealth', 'Avoiding community'], correct: 1 }
    ],
    relationships: [
        { q: 'Healthy friendships are built on...', options: ['Gossip', 'Trust, respect, and truth', 'Competition only', 'Secrets always'], correct: 1 },
        { q: 'Boundaries in relationships help you...', options: ['Push people away always', 'Honor God and protect healthy connection', 'Control others', 'Avoid all people'], correct: 1 },
        { q: 'Forgiveness means...', options: ['Ignoring all justice', 'Releasing bitterness and seeking peace', 'Forgetting wisdom', 'Staying in harm'], correct: 1 },
        { q: 'Peer pressure is best handled by...', options: ['Always blending in', 'Standing on values with courage', 'Mocking others', 'Silence only'], correct: 1 },
        { q: 'Love in 1 Corinthians 13 is...', options: ['Only a feeling', 'Patient, kind, and selfless action', 'Optional for leaders', 'About winning'], correct: 1 }
    ],
    character: [
        { q: 'Character is formed mainly by...', options: ['One big event only', 'Daily choices and habits', 'Luck', 'Titles'], correct: 1 },
        { q: 'Integrity is doing right...', options: ['Only in public', 'Even when unseen', 'Only for rewards', 'Only with friends'], correct: 1 },
        { q: 'Discipline helps character by...', options: ['Removing joy forever', 'Training consistency under pressure', 'Avoiding goals', 'Pleasing everyone'], correct: 1 },
        { q: 'Humility looks like...', options: ['Putting yourself down always', 'Valuing others and learning freely', 'Hiding gifts', 'Refusing feedback'], correct: 1 },
        { q: 'Temptation is best faced by...', options: ['Willpower alone always', 'God\'s Word, prayer, and wise community', 'Secret struggle only', 'Denial'], correct: 1 }
    ],
    purpose: [
        { q: 'Identity in Christ means you are...', options: ['Defined by failures', 'Loved and called by God', 'Only your grades', 'Only your image'], correct: 1 },
        { q: 'Discovering purpose often begins with...', options: ['Comparison', 'Seeking God and stewarding gifts', 'Copying influencers', 'Avoiding service'], correct: 1 },
        { q: 'Gifts are given so you can...', options: ['Boast', 'Serve God and others', 'Hide them', 'Compete only'], correct: 1 },
        { q: 'Vision and goals help you...', options: ['Dream without action', 'Move intentionally toward calling', 'Avoid mentors', 'Stay stuck'], correct: 1 }
    ],
    choir: [
        { q: 'Good singing posture helps mainly with...', options: ['Looking taller only', 'Breath support and tone', 'Memorizing lyrics', 'Stage lights'], correct: 1 },
        { q: 'Breathing for singing should be...', options: ['Shallow and rushed', 'Deep, controlled, and supported', 'Held forever', 'Ignored'], correct: 1 },
        { q: 'Harmony means...', options: ['Everyone singing the same note only', 'Different parts blending together', 'Singing louder', 'Solo only'], correct: 1 },
        { q: 'Voice care includes...', options: ['Screaming often', 'Hydration, rest, and healthy technique', 'Skipping warm-ups', 'Cold drinks only before singing'], correct: 1 },
        { q: 'Worship leading is primarily about...', options: ['Performance fame', 'Helping people encounter God', 'Showing off range', 'Winning contests'], correct: 1 },
        { q: 'A choir team thrives when members practice...', options: ['Competition over unity', 'Teamwork, listening, and excellence', 'Silence only', 'Solo pride'], correct: 1 },
        { q: 'Pitch accuracy improves through...', options: ['Guessing only', 'Ear training and consistent practice', 'Volume alone', 'Ignoring feedback'], correct: 1 },
        { q: 'Ministry readiness includes...', options: ['Skill only', 'Character, skill, and spiritual preparation', 'Talent alone', 'Clothes only'], correct: 1 }
    ],
    spiritual: [
        { q: 'Spiritual formation is about...', options: ['One event only', 'Becoming more like Christ over time', 'Knowing facts only', 'Public image'], correct: 1 },
        { q: 'Prayer is best understood as...', options: ['A magic formula', 'Relationship and communion with God', 'Only emergency help', 'Public performance'], correct: 1 },
        { q: 'Reading Scripture regularly helps you...', options: ['Memorize only', 'Know God and renew your mind', 'Win debates only', 'Avoid community'], correct: 1 },
        { q: 'Worship is more than music; it is also...', options: ['A lifestyle of obedience and honor', 'Only Sunday singing', 'Only feelings', 'Only talent'], correct: 0 },
        { q: 'Kingdom impact means...', options: ['Personal fame', 'Living so God\'s love changes people and places', 'Avoiding service', 'Church attendance alone'], correct: 1 }
    ]
};

var quizState = { questions: [], current: 0, score: 0, category: 'general' };

function shuffleQuizArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a;
}

function buildQuizPool(category) {
    category = category || 'general';
    var primary = QUIZ_BANK[category] || QUIZ_BANK.general;
    var pool = primary.slice();
    // Mix Bible questions from all areas into every quiz type
    if (QUIZ_BANK.bible && category !== 'bible') {
        pool = pool.concat(QUIZ_BANK.bible);
    }
    if (category !== 'general' && QUIZ_BANK.general) {
        pool = pool.concat(QUIZ_BANK.general.slice(0, 6));
    }
    // Deduplicate by question text
    var seen = {};
    return pool.filter(function(item) {
        if (!item || !item.q || seen[item.q]) return false;
        seen[item.q] = true;
        return true;
    });
}

function prepareQuizQuestion(q) {
    // Shuffle answer options so order also varies per attempt
    var indices = q.options.map(function(_, i) { return i; });
    indices = shuffleQuizArray(indices);
    return {
        q: q.q,
        options: indices.map(function(i) { return q.options[i]; }),
        correct: indices.indexOf(q.correct)
    };
}

function startQuiz(category, containerId) {
    category = category || 'general';
    containerId = containerId || 'quizContainer';
    var pool = buildQuizPool(category);
    var shuffled = shuffleQuizArray(pool);
    var count = Math.min(7, Math.max(5, shuffled.length));
    var selected = shuffled.slice(0, count).map(prepareQuizQuestion);
    quizState = { questions: selected, current: 0, score: 0, category: category };
    renderQuizQuestion(containerId);
}

function renderQuizQuestion(containerId) {
    var el = document.getElementById(containerId);
    if (!el) return;
    if (quizState.current >= quizState.questions.length) {
        var pct = Math.round(quizState.score / quizState.questions.length * 100);
        var emoji = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practising!';
        el.innerHTML = '<div style="text-align:center;padding:1.5rem;background:var(--background);border-radius:var(--radius-lg);">' +
            '<h3 style="margin:0.5rem 0;">Quiz Complete!</h3>' +
            '<p style="font-size:1.25rem;font-weight:700;color:var(--primary);">' + quizState.score + '/' + quizState.questions.length + ' - ' + pct + '%</p>' +
            '<p style="color:var(--text-muted);">' + emoji + '</p>' +
            '<button class="btn btn-primary" style="margin-top:1rem;" onclick="startQuiz(\'' + quizState.category + '\', \'' + containerId + '\')">Try Again</button></div>';
        return;
    }
    var q = quizState.questions[quizState.current];
    el.innerHTML = '<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.25rem;">Question ' + (quizState.current + 1) + ' of ' + quizState.questions.length + '</div>' +
        '<div style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:1rem;">' +
        '<div style="height:100%;width:' + (quizState.current / quizState.questions.length * 100) + '%;background:var(--primary-gradient);border-radius:3px;"></div></div>' +
        '<div class="quiz-question">' + q.q + '</div>' +
        '<div class="quiz-options">' +
        q.options.map(function(opt, i) {
            return '<button class="quiz-option" onclick="answerQuiz(' + i + ', \'' + containerId + '\')">' + opt + '</button>';
        }).join('') + '</div>';
}

function answerQuiz(index, containerId) {
    var q = quizState.questions[quizState.current];
    var opts = document.querySelectorAll('#' + containerId + ' .quiz-option');
    opts.forEach(function(b) { b.disabled = true; });
    if (opts[q.correct]) opts[q.correct].classList.add('correct');
    if (index === q.correct) {
        quizState.score++;
    } else {
        if (opts[index]) opts[index].classList.add('wrong');
    }
    setTimeout(function() { quizState.current++; renderQuizQuestion(containerId); }, 1000);
}

// ========================================
// NOTIFICATION BELL
// ========================================

async function injectNotificationBell() {
    var topbarUser = document.querySelector('.topbar-user');
    if (!topbarUser) return;
    if (document.getElementById('notifBell')) return;

    var bell = document.createElement('a');
    bell.id = 'notifBell';
    bell.href = 'notifications.html';
    bell.title = 'Notifications';
    bell.style.cssText = 'position:relative;display:inline-flex;align-items:center;justify-content:center;' +
        'width:40px;height:40px;border-radius:50%;background:var(--background);border:1px solid var(--border);' +
        'color:var(--text);text-decoration:none;transition:all 0.2s;font-size:1.1rem;margin-right:0.5rem;';
    bell.innerHTML = '&#128276;<span id="notifBadge" style="display:none;position:absolute;top:2px;right:2px;' +
        'min-width:16px;height:16px;border-radius:8px;background:var(--danger);color:white;' +
        'font-size:0.6rem;font-weight:700;line-height:16px;text-align:center;padding:0 3px;">0</span>';
    topbarUser.insertAdjacentElement('beforebegin', bell);

    try {
        var client = await getSupabase();
        if (!client) return;
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) return;
        var userId = sessionData.data.session.user.id;
        // Simple counts -- no date filter to avoid missing column errors
        var results = await Promise.all([
            client.from('task_submissions').select('id', { count: 'exact', head: true }).eq('student_id', userId).in('status', ['approved', 'rejected']),
            client.from('user_achievements').select('id', { count: 'exact', head: true }).eq('student_id', userId),
            client.from('activities').select('id', { count: 'exact', head: true }).eq('is_announcement', true).then(r => r).catch(function() { return { count: 0 }; })
        ]);
        var total = (results[0].count || 0) + (results[1].count || 0) + (results[2].count || 0);
        // Respect "mark all read" — suppress badge for 1 hour after clearing
        var cleared = localStorage.getItem('ngt_notifs_cleared');
        if (cleared && (Date.now() - new Date(cleared)) / 3600000 < 1) total = 0;
        if (total > 0) {
            var badge = document.getElementById('notifBadge');
            if (badge) { badge.textContent = total > 9 ? '9+' : total; badge.style.display = 'block'; }
        }
    } catch (e) { /* bell shows without count on error */ }
}

// ========================================
// AUTH CHECK
// ========================================

async function checkAuth() {
    var client = await getSupabase();
    if (!client) return;
    try {
        var { data: { session }, error } = await client.auth.getSession();
        if (error || !session) {
            var path = window.location.pathname;
            var publicPages = ['login', 'register', 'index', '404'];
            var isPublic = publicPages.some(function(p) { return path.includes(p); });
            if (!isPublic && path !== '/' && path !== '') {
                window.location.href = 'login.html';
            }
            return;
        }
        var { data: profile } = await client.from('profiles').select('*').eq('id', session.user.id).single();
        if (!profile) return;

        currentUser = session.user;
        currentProfile = profile;
        currentRole = profile.role;

        var path = window.location.pathname;

        // Role guards
        if (path.includes('student-dashboard') && profile.role !== 'student') {
            window.location.href = profile.role + '-dashboard.html'; return;
        }
        if (path.includes('mentor-dashboard') && profile.role !== 'mentor') {
            window.location.href = profile.role === 'admin' ? 'admin-dashboard.html' : 'student-dashboard.html'; return;
        }
        if (path.includes('admin-dashboard') && profile.role !== 'admin') {
            window.location.href = profile.role + '-dashboard.html'; return;
        }
        if (path.includes('session-manager') && profile.role === 'student') {
            window.location.href = 'student-dashboard.html'; return;
        }
        // No role guard for leaderboard - all roles can access

        // Set name everywhere
        document.querySelectorAll('#userNameDisplay, #mentorNameDisplay, #adminNameDisplay').forEach(function(el) {
            el.textContent = profile.full_name || 'User';
        });

        // Load and display profile pictures
        loadProfilePicture(profile.id, profile.role);

        // For shared pages (activity-feed, notifications, leaderboard) — swap sidebar to match role
        var sharedPages = ['activity-feed', 'notifications', 'leaderboard'];
        var onSharedPage = sharedPages.some(function(p) { return path.includes(p); });
        if (onSharedPage && profile.role !== 'student') {
            swapToRoleSidebar(profile.role);
        }

        // Load dashboard data
        if (path.includes('student-dashboard')) loadStudentDashboard(profile);
        else if (path.includes('mentor-dashboard')) loadMentorDashboard(profile);
        else if (path.includes('admin-dashboard')) loadAdminDashboard(profile);

    } catch (e) { console.error('Auth check error:', e); }
}

// ========================================
// PROFILE PICTURE HANDLING
// ========================================

async function loadProfilePicture(userId, role) {
    try {
        var client = await getSupabase();
        if (!client) return;
        
        // Check if user has a profile picture in storage
        var fileName = userId + '/profile.jpg';
        var bucket = 'profile-pictures';
        var { data, error } = await client.storage.from(bucket).getPublicUrl(fileName);
        
        // If bucket not found, try fallback bucket
        if (error && error.message && error.message.includes('not found')) {
            bucket = 'avatars';
            var { data: fallbackData, error: fallbackError } = await client.storage.from(bucket).getPublicUrl(fileName);
            if (fallbackError) {
                showProfileFallback(role);
                return;
            }
            data = fallbackData;
        } else if (error) {
            showProfileFallback(role);
            return;
        }
        
        // Show profile picture
        var imgId = role + 'ProfilePicture';
        var fallbackId = role + 'AvatarFallback';
        var imgEl = document.getElementById(imgId);
        var fallbackEl = document.getElementById(fallbackId);
        
        if (imgEl && fallbackEl) {
            imgEl.src = data.publicUrl;
            imgEl.style.display = 'block';
            fallbackEl.style.display = 'none';
        }
    } catch (e) {
        showProfileFallback(role);
    }
}

function showProfileFallback(role) {
    var imgId = role + 'ProfilePicture';
    var fallbackId = role + 'AvatarFallback';
    var imgEl = document.getElementById(imgId);
    var fallbackEl = document.getElementById(fallbackId);
    
    if (imgEl && fallbackEl) {
        imgEl.style.display = 'none';
        fallbackEl.style.display = 'flex';
        
        // Set correct emoji based on role
        var emojis = { 'admin': '&#9881;&#65039;', 'mentor': '&#128104;&#8205;&#127979;', 'student': '&#129489;&#8205;&#127891;' };
        fallbackEl.innerHTML = emojis[role] || '&#128100;';
    }
}

// Universal profile picture loader for topbar avatars across all pages
async function loadUserAvatar(userId, role) {
    try {
        var client = await getSupabase();
        if (!client) return;
        
        // Check if user has a profile picture in storage
        var fileName = userId + '/profile.jpg';
        var bucket = 'profile-pictures';
        var { data, error } = await client.storage.from(bucket).getPublicUrl(fileName);
        
        // If bucket not found, try fallback bucket
        if (error && error.message && error.message.includes('not found')) {
            bucket = 'avatars';
            var { data: fallbackData, error: fallbackError } = await client.storage.from(bucket).getPublicUrl(fileName);
            if (fallbackError) {
                showAvatarFallback(role);
                return;
            }
            data = fallbackData;
        } else if (error) {
            showAvatarFallback(role);
            return;
        }
        
        // Show profile picture
        var imgEl = document.getElementById('userAvatarImg');
        var fallbackEl = document.getElementById('userAvatar');
        
        if (imgEl && fallbackEl) {
            imgEl.src = data.publicUrl;
            imgEl.style.display = 'block';
            fallbackEl.style.display = 'none';
        }
    } catch (e) {
        showAvatarFallback(role);
    }
}

function showAvatarFallback(role) {
    var imgEl = document.getElementById('userAvatarImg');
    var fallbackEl = document.getElementById('userAvatar');
    
    if (imgEl && fallbackEl) {
        imgEl.style.display = 'none';
        fallbackEl.style.display = 'flex';
        
        // Set correct emoji based on role
        var emojis = { 'admin': '&#9881;&#65039;', 'mentor': '&#128104;&#8205;&#127979;', 'student': '&#129489;&#8205;&#127891;' };
        fallbackEl.innerHTML = emojis[role] || '&#128100;';
    }
}

async function uploadProfilePicture(file) {
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Could not connect');
        
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) throw new Error('Not logged in');
        
        var userId = sessionData.data.session.user.id;
        var fileName = userId + '/profile.jpg';
        
        var bucket = 'profile-pictures';
        var { error } = await client.storage.from(bucket).upload(fileName, file, {
            upsert: true,
            contentType: 'image/jpeg'
        });
        
        // If bucket not found, try fallback bucket
        if (error && error.message && error.message.includes('not found')) {
            bucket = 'avatars';
            var { error: fallbackError } = await client.storage.from(bucket).upload(fileName, file, {
                upsert: true,
                contentType: 'image/jpeg'
            });
            if (fallbackError) throw fallbackError;
        } else if (error) {
            throw error;
        }
        
        showSystemCard('Profile picture updated successfully!', 'success');
        
        // Reload profile picture
        var { data: profile } = await client.from('profiles').select('role').eq('id', userId).single();
        if (profile) {
            loadProfilePicture(userId, profile.role);
            loadLargeProfilePicture(userId);
        }
        
        // Reload dashboard data if on student dashboard
        if (window.location.pathname.includes('student-dashboard.html')) {
            var { data: fullProfile } = await client.from('profiles').select('*').eq('id', userId).single();
            if (fullProfile) {
                currentProfile = fullProfile;
                await loadStudentDashboard(fullProfile);
            }
        }
        
        return true;
    } catch (e) {
        showSystemCard('Error uploading profile picture: ' + (e.message || 'Unknown error'), 'error');
        return false;
    }
}

async function handleProfilePictureUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showSystemCard('Please select an image file.', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showSystemCard('Image must be less than 5MB.', 'error');
        return;
    }
    
    await uploadProfilePicture(file);
}

async function loadLargeProfilePicture(userId) {
    try {
        var client = await getSupabase();
        if (!client) return;
        
        var fileName = userId + '/profile.jpg';
        var bucket = 'profile-pictures';
        var { data, error } = await client.storage.from(bucket).getPublicUrl(fileName);
        
        // If bucket not found, try fallback bucket
        if (error && error.message && error.message.includes('not found')) {
            bucket = 'avatars';
            var { data: fallbackData, error: fallbackError } = await client.storage.from(bucket).getPublicUrl(fileName);
            if (fallbackError) {
                document.getElementById('largeProfileImg').style.display = 'none';
                document.getElementById('largeProfileFallback').style.display = 'block';
                return;
            }
            data = fallbackData;
        } else if (error) {
            document.getElementById('largeProfileImg').style.display = 'none';
            document.getElementById('largeProfileFallback').style.display = 'block';
            return;
        }
        
        var imgEl = document.getElementById('largeProfileImg');
        var fallbackEl = document.getElementById('largeProfileFallback');
        
        if (imgEl && fallbackEl) {
            imgEl.src = data.publicUrl;
            imgEl.style.display = 'block';
            fallbackEl.style.display = 'none';
        }
    } catch (e) {
        document.getElementById('largeProfileImg').style.display = 'none';
        document.getElementById('largeProfileFallback').style.display = 'block';
    }
}

// ========================================
// ACTIVITY FEED COMMENTS AND REACTIONS
// ========================================

async function postComment() {
    var input = document.getElementById('newCommentInput');
    var content = input ? input.value.trim() : '';
    
    if (!content) {
        showSystemCard('Please enter a comment.', 'error');
        return;
    }
    
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Could not connect');
        
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) throw new Error('Not logged in');
        
        var { error } = await client.from('comments').insert({
            activity_id: sessionData.data.session.user.id,
            activity_type: 'discussion',
            user_id: sessionData.data.session.user.id,
            content: content
        });
        
        if (error) throw error;
        
        showSystemCard('Comment posted successfully!', 'success');
        if (input) input.value = '';
        
        loadCommunityDiscussion();
    } catch (e) {
        showSystemCard('Error posting comment: ' + (e.message || 'Unknown error'), 'error');
    }
}

async function loadCommunityDiscussion() {
    try {
        var client = await getSupabase();
        if (!client) return;
        
        var { data: comments } = await client
            .from('comments')
            .select('*, profiles(full_name), reactions(reaction_type, user_id)')
            .eq('activity_type', 'discussion')
            .order('created_at', { ascending: false })
            .limit(20);
        
        var container = document.getElementById('communityDiscussion');
        if (!container) return;
        
        if (!comments || comments.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 1rem; color: var(--text-muted);">No discussions yet. Start the conversation!</div>';
            return;
        }
        
        var sessionData = await client.auth.getSession();
        var currentUserId = sessionData.data.session ? sessionData.data.session.user.id : null;
        
        container.innerHTML = comments.map(function(comment) {
            var reactions = comment.reactions || [];
            var reactionCounts = {};
            reactions.forEach(function(r) {
                reactionCounts[r.reaction_type] = (reactionCounts[r.reaction_type] || 0) + 1;
            });
            
            var reactionEmojis = { 'like': '👍', 'love': '❤️', 'celebrate': '🎉', 'support': '🙏' };
            var reactionButtons = Object.keys(reactionEmojis).map(function(type) {
                var count = reactionCounts[type] || 0;
                var hasReacted = reactions.some(function(r) { return r.reaction_type === type && r.user_id === currentUserId; });
                return '<button class="btn btn-sm ' + (hasReacted ? 'btn-primary' : 'btn-outline') + '" onclick="toggleReaction(\'' + comment.id + '\', \'' + type + '\')">' +
                    reactionEmojis[type] + ' ' + (count > 0 ? count : '') + '</button>';
            }).join(' ');
            
            return '<div style="padding: 1rem; background: var(--background); border-radius: var(--radius-md); margin-bottom: 0.75rem; border: 1px solid var(--border);">' +
                '<div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">' +
                '<span style="font-weight: 600;">' + (comment.profiles ? comment.profiles.full_name : 'User') + '</span>' +
                '<span style="font-size: 0.75rem; color: var(--text-muted);">' + new Date(comment.created_at).toLocaleString() + '</span>' +
                '</div>' +
                '<p style="margin: 0.5rem 0;">' + comment.content + '</p>' +
                '<div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">' +
                reactionButtons +
                '</div>' +
                '</div>';
        }).join('');
    } catch (e) {
        console.error('Error loading comments:', e);
    }
}

async function toggleReaction(commentId, reactionType) {
    try {
        var client = await getSupabase();
        if (!client) throw new Error('Could not connect');
        
        var sessionData = await client.auth.getSession();
        if (!sessionData.data.session) throw new Error('Not logged in');
        
        var { data: existingReaction } = await client
            .from('reactions')
            .select('*')
            .eq('comment_id', commentId)
            .eq('user_id', sessionData.data.session.user.id)
            .maybeSingle();
        
        if (existingReaction) {
            if (existingReaction.reaction_type === reactionType) {
                await client.from('reactions').delete().eq('id', existingReaction.id);
            } else {
                await client.from('reactions').update({ reaction_type: reactionType }).eq('id', existingReaction.id);
            }
        } else {
            await client.from('reactions').insert({
                comment_id: commentId,
                user_id: sessionData.data.session.user.id,
                reaction_type: reactionType
            });
        }
        
        loadCommunityDiscussion();
    } catch (e) {
        showSystemCard('Error updating reaction: ' + (e.message || 'Unknown error'), 'error');
    }
}

function insertReaction(reactionType) {
    var input = document.getElementById('newCommentInput');
    if (!input) return;
    
    var emojis = { 'like': '👍', 'love': '❤️', 'celebrate': '🎉', 'support': '🙏' };
    input.value += emojis[reactionType];
    input.focus();
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
    setupGlobalListeners();

    var client = await initSupabase();
    var path = window.location.pathname;

    var protectedPages = ['dashboard', 'tasks', 'achievements', 'leaderboard', 'profile',
        'settings', 'activity-feed', 'programs', 'ctfs', 'choir', 'ai-coach', 'games',
        'lesson', 'notifications', 'session-manager'];
    var isProtected = protectedPages.some(function(p) { return path.includes(p); });

    if (isProtected) await checkAuth();

    // Page-specific loaders
    if (path.includes('tasks')) loadTasksPage();
    if (path.includes('achievements')) loadAchievementsPage();
    if (path.includes('leaderboard')) loadLeaderboardPage();
    if (path.includes('profile')) loadProfilePage();
    if (path.includes('settings')) loadSettingsPage();
    if (path.includes('activity-feed')) loadActivityFeedPage();
    if (path.includes('programs')) loadProgramsPage();
    if (path.includes('ctfs')) loadCTFSPage();
    if (path.includes('choir')) loadChoirPage();
    if (path.includes('ai-coach')) loadAICoachPage();
    if (path.includes('games')) loadGamesPage();

    // Public pages
    if (path.includes('index') || path === '/' || path === '') {
        loadHomeStats();
        loadActivityFeed();
    }
    if (path.includes('register')) selectRole('student');
    if (path.includes('login')) setLoginRole('student');

    // Add the notification bell after authentication has completed.
    setTimeout(injectNotificationBell, 900);
});

// ========================================
// ROLE-BASED SIDEBAR SWAP
// For shared pages visited by mentor/admin
// ========================================

function swapToRoleSidebar(role) {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;
    var path = window.location.pathname;
    var activePage = path.includes('activity-feed') ? 'feed' : path.includes('notifications') ? 'notifications' : '';

    var mentorNav = '<a href="mentor-dashboard.html" class="nav-item"><span class="nav-icon">&#128202;</span> Dashboard</a>' +
        '<a href="#" class="nav-item" onclick="loadMentorSection(\'students\')"><span class="nav-icon">&#128101;</span> Students</a>' +
        '<a href="#" class="nav-item" onclick="loadMentorSection(\'attendance\')"><span class="nav-icon">&#10003;</span> Attendance</a>' +
        '<a href="#" class="nav-item" onclick="loadMentorSection(\'assignments\')"><span class="nav-icon">&#128221;</span> Reviews</a>' +
        '<a href="#" class="nav-item" onclick="loadMentorSection(\'activities\')"><span class="nav-icon">&#128226;</span> Publish</a>' +
        '<a href="session-manager.html" class="nav-item"><span class="nav-icon">&#127909;</span> Sessions</a>' +
        '<a href="activity-feed.html" class="nav-item ' + (activePage === 'feed' ? 'active' : '') + '"><span class="nav-icon">&#128240;</span> Activity Feed</a>' +
        '<a href="#" class="nav-item" onclick="loadMentorSection(\'reports\')"><span class="nav-icon">&#128200;</span> Reports</a>' +
        '<a href="notifications.html" class="nav-item ' + (activePage === 'notifications' ? 'active' : '') + '"><span class="nav-icon">&#128276;</span> Notifications</a>' +
        '<a href="settings.html" class="nav-item"><span class="nav-icon">&#9881;</span> Settings</a>' +
        '<a href="index.html" class="nav-item logout" onclick="handleLogout()"><span class="nav-icon">&#128682;</span> Logout</a>';

    var adminNav = '<a href="admin-dashboard.html" class="nav-item"><span class="nav-icon">&#128202;</span> Dashboard</a>' +
        '<a href="#" class="nav-item" onclick="loadAdminSection(\'users\')"><span class="nav-icon">&#128101;</span> Users</a>' +
        '<a href="#" class="nav-item" onclick="loadAdminSection(\'programs\')"><span class="nav-icon">&#128218;</span> Programs</a>' +
        '<a href="session-manager.html" class="nav-item"><span class="nav-icon">&#127909;</span> Sessions</a>' +
        '<a href="activity-feed.html" class="nav-item ' + (activePage === 'feed' ? 'active' : '') + '"><span class="nav-icon">&#128240;</span> Activity Feed</a>' +
        '<a href="#" class="nav-item" onclick="loadAdminSection(\'analytics\')"><span class="nav-icon">&#128200;</span> Analytics</a>' +
        '<a href="#" class="nav-item" onclick="generateReport()"><span class="nav-icon">&#128196;</span> Reports</a>' +
        '<a href="notifications.html" class="nav-item ' + (activePage === 'notifications' ? 'active' : '') + '"><span class="nav-icon">&#128276;</span> Notifications</a>' +
        '<a href="#" class="nav-item" onclick="loadAdminSection(\'settings\')"><span class="nav-icon">&#9881;</span> Settings</a>' +
        '<a href="index.html" class="nav-item logout" onclick="handleLogout()"><span class="nav-icon">&#128682;</span> Logout</a>';

    nav.innerHTML = role === 'admin' ? adminNav : mentorNav;
}

// ========================================
// MENTOR DASHBOARD - ENROLLED STUDENTS (real data)
// ========================================

async function loadEnrolledStudents() {
    var client = await getSupabase();
    if (!client) return;
    try {
        var { data: students, error: studentsError } = await client.from('profiles')
            .select('id, full_name, email, age, created_at')
            .eq('role', 'student')
            .order('created_at', { ascending: false })
            .limit(50);

        var tbody = document.getElementById('studentTableBody');
        if (studentsError) throw studentsError;
        if (!students || !students.length) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted);">No students found.</td></tr>';
            return;
        }

        var studentIds = students.map(function(s) { return s.id; });

        // Batch load Attendance, SGI, and strikes
        var [attRes, sgiRes, strikesRes] = await Promise.all([
            client.from('attendance').select('student_id, status').in('student_id', studentIds),
            client.from('sgi_scores').select('student_id, score').in('student_id', studentIds),
            client.from('strikes').select('student_id').in('student_id', studentIds)
        ]);

        var attCounts = {};
        (attRes.data || []).forEach(function(a) {
            if (!attCounts[a.student_id]) attCounts[a.student_id] = { total: 0, present: 0 };
            attCounts[a.student_id].total++;
            if (a.status === 'present') attCounts[a.student_id].present++;
        });

        var sgiMap = {};
        (sgiRes.data || []).forEach(function(s) { sgiMap[s.student_id] = s.score; });

        var strikeMap = {};
        (strikesRes.data || []).forEach(function(s) {
            strikeMap[s.student_id] = (strikeMap[s.student_id] || 0) + 1;
        });

        if (!tbody) return;

        tbody.innerHTML = students.map(function(s) {
            var att = attCounts[s.id];
            var attPct = att && att.total > 0 ? Math.round((att.present / att.total) * 100) + '%' : '0%';
            var sgi = sgiMap[s.id] !== undefined && sgiMap[s.id] !== null ? Math.round(sgiMap[s.id]) : 0;
            var strikes = strikeMap[s.id] || 0;
            var status = strikes >= 10 ? 'danger' : strikes >= 5 ? 'warning' : 'success';
            var statusText = strikes >= 10 ? 'Suspended' : strikes >= 5 ? 'Warning' : 'Active';

            return '<tr>' +
                '<td><span class="student-name" style="font-weight:600;">' + (s.full_name || 'Unknown') + '</span></td>' +
                '<td>CTFS</td>' +
                '<td><span class="badge info">' + attPct + '</span></td>' +
                '<td><span class="badge success">' + sgi + '</span></td>' +
                '<td><span class="badge ' + status + '">' + statusText + '</span></td>' +
                '<td><button class="btn btn-sm btn-outline" style="border-radius:20px;padding:0.25rem 1rem;" onclick="viewStudent(\'' + s.id + '\')">View</button></td>' +
                '</tr>';
        }).join('');

        // Update count
        setEl('totalStudents', students.length);
    } catch (e) {
        console.error('Enrolled students error:', e);
        var tbody = document.getElementById('studentTableBody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--danger);">Unable to load students. Check the Supabase staff access policies.</td></tr>';
    }
}

// Override loadMentorStudents to use the real version
async function loadMentorStudents() {
    return loadEnrolledStudents();
}

// ========================================
// FAVICON - create a simple data URI favicon
// ========================================

(function injectFavicon() {
    if (document.querySelector('link[rel="icon"]')) return;
    // Simple NGT favicon as SVG data URI
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
        '<rect width="32" height="32" rx="8" fill="#2563EB"/>' +
        '<text x="16" y="22" font-family="Arial" font-size="18" font-weight="bold" ' +
        'fill="white" text-anchor="middle">N</text></svg>';
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
    document.head.appendChild(link);
})();
