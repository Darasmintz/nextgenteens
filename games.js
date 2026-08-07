// ========================================
// NEXTGENTEENS - INTERACTIVE LEARNING LAB
// All 6 games fully implemented
// ========================================

let currentGame = null;
let currentQuestion = 0;
let currentScore = 0;
let totalQuestions = 0;
let gameData = {};
// Active randomized sets for the current playthrough
let activeFaithQuestions = [];
let activeLeadershipScenarios = [];
let activeCommunicationScenarios = [];
let activeMemoryPairs = [];
let activeWordCategories = [];

// ========================================
// SHARED RANDOMIZATION HELPERS
// ========================================
function shuffleGameArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
}

function pickRandomSubset(arr, count) {
    return shuffleGameArray(arr).slice(0, Math.min(count, arr.length));
}

function randomizeQuestionOptions(q) {
    const indices = q.options.map((_, i) => i);
    const shuffledIdx = shuffleGameArray(indices);
    const copy = Object.assign({}, q, {
        options: shuffledIdx.map(i => q.options[i]),
        correct: shuffledIdx.indexOf(q.correct)
    });
    return copy;
}

// ========================================
// FAITH QUIZ DATA (Bible — all areas)
// ========================================
const faithQuizQuestions = [
    /* Pentateuch & Law */
    { q: "What does the Bible say is the greatest commandment?", options: ["Love God with all your heart", "Honor your parents", "Do not steal", "Keep the Sabbath"], correct: 0 },
    { q: "Which book of the Bible contains the Ten Commandments?", options: ["Genesis", "Leviticus", "Exodus", "Numbers"], correct: 2 },
    { q: "What did God create on the first day?", options: ["Animals", "Light", "Man", "Plants"], correct: 1 },
    { q: "Who built the ark?", options: ["Moses", "Noah", "Abraham", "Jacob"], correct: 1 },
    { q: "Who was sold by his brothers into slavery?", options: ["Benjamin", "Joseph", "Reuben", "Levi"], correct: 1 },
    { q: "Who led Israel out of Egypt?", options: ["Abraham", "Moses", "Joshua", "David"], correct: 1 },
    { q: "What is the first book of the Bible?", options: ["Exodus", "Matthew", "Genesis", "Psalms"], correct: 2 },
    { q: "Who asked, 'Am I my brother's keeper?'", options: ["Abel", "Cain", "Seth", "Noah"], correct: 1 },
    { q: "Who was the father of many nations?", options: ["Isaac", "Abraham", "Jacob", "Noah"], correct: 1 },
    { q: "What sea did Moses lead Israel through?", options: ["Dead Sea", "Red Sea", "Mediterranean", "Galilee"], correct: 1 },
    { q: "How many days did God create before resting?", options: ["3", "5", "6", "7"], correct: 2 },

    /* Historical Books */
    { q: "Who was thrown into the lion's den and survived?", options: ["Elijah", "Daniel", "Paul", "Joseph"], correct: 1 },
    { q: "Who was the first king of Israel?", options: ["David", "Solomon", "Saul", "Samuel"], correct: 2 },
    { q: "What did David use to defeat Goliath?", options: ["A sword", "A sling and stone", "A spear", "An arrow"], correct: 1 },
    { q: "Who was a man after God's own heart?", options: ["Saul", "David", "Solomon", "Absalom"], correct: 1 },
    { q: "Who was known for wisdom and built the temple?", options: ["David", "Solomon", "Saul", "Hezekiah"], correct: 1 },
    { q: "Which woman became queen and helped save her people?", options: ["Ruth", "Esther", "Deborah", "Hannah"], correct: 1 },
    { q: "Which city fell after Israel marched around it?", options: ["Jerusalem", "Jericho", "Babylon", "Nineveh"], correct: 1 },
    { q: "Who was known for great strength and long hair?", options: ["Goliath", "Samson", "Saul", "Absalom"], correct: 1 },
    { q: "Who rebuilt Jerusalem's walls after exile?", options: ["Ezra", "Nehemiah", "Daniel", "Haggai"], correct: 1 },

    /* Wisdom Literature */
    { q: "What does 'the fear of the Lord' represent in Proverbs?", options: ["Being afraid of God", "The beginning of wisdom", "Running away from God", "Obeying laws"], correct: 1 },
    { q: "Which book is known for wisdom sayings?", options: ["Proverbs", "Acts", "Revelation", "Judges"], correct: 0 },
    { q: "Psalm 23 begins with which line?", options: ["Bless the Lord, O my soul", "The Lord is my shepherd", "Create in me a clean heart", "I will lift up my eyes"], correct: 1 },
    { q: "Which book says 'Trust in the Lord with all your heart'?", options: ["Proverbs", "Psalms", "Ecclesiastes", "Job"], correct: 0 },
    { q: "Which book contains 150 spiritual songs and prayers?", options: ["Proverbs", "Psalms", "Song of Solomon", "Isaiah"], correct: 1 },

    /* Major & Minor Prophets */
    { q: "Who was swallowed by a great fish?", options: ["Noah", "Jonah", "Job", "Elijah"], correct: 1 },
    { q: "Which prophet was taken to heaven in a whirlwind?", options: ["Isaiah", "Elijah", "Elisha", "Jeremiah"], correct: 1 },
    { q: "Which prophet saw a vision of a valley of dry bones?", options: ["Ezekiel", "Daniel", "Isaiah", "Jeremiah"], correct: 0 },
    { q: "Which prophet wrote 'For unto us a child is born'?", options: ["Isaiah", "Jeremiah", "Micah", "Malachi"], correct: 0 },

    /* Gospels & Acts */
    { q: "Complete the verse: 'For God so loved the world that He gave...'", options: ["...His blessings freely", "...His only begotten Son", "...the Ten Commandments", "...the prophets"], correct: 1 },
    { q: "How many disciples did Jesus choose?", options: ["7", "10", "12", "15"], correct: 2 },
    { q: "Where was Jesus born?", options: ["Nazareth", "Jerusalem", "Bethlehem", "Jericho"], correct: 2 },
    { q: "Which apostle denied Jesus three times?", options: ["John", "Thomas", "Peter", "Andrew"], correct: 2 },
    { q: "In which garden did Jesus pray before His arrest?", options: ["Eden", "Gethsemane", "Galilee", "Bethany"], correct: 1 },
    { q: "What is often cited as the shortest verse in the Bible?", options: ["God is love", "Jesus wept", "Pray always", "Be still"], correct: 1 },
    { q: "Who interpreted Pharaoh's dreams in Egypt?", options: ["Daniel", "Joseph", "Moses", "Aaron"], correct: 1 },
    { q: "What river did John the Baptist baptize in?", options: ["Nile", "Jordan", "Euphrates", "Tigris"], correct: 1 },
    { q: "Who was the mother of Jesus?", options: ["Martha", "Mary", "Elizabeth", "Ruth"], correct: 1 },
    { q: "Who betrayed Jesus for thirty pieces of silver?", options: ["Peter", "Judas Iscariot", "Thomas", "Pilate"], correct: 1 },
    { q: "Which disciple was a tax collector?", options: ["Peter", "Matthew", "John", "Andrew"], correct: 1 },
    { q: "Which gospel writer was a physician?", options: ["Matthew", "Mark", "Luke", "John"], correct: 2 },
    { q: "What does Emmanuel mean?", options: ["God is mighty", "God with us", "God saves", "Prince of Peace"], correct: 1 },
    { q: "Which book tells of early church growth after Pentecost?", options: ["Romans", "Acts", "Hebrews", "James"], correct: 1 },
    { q: "What did Jesus feed the 5,000 with?", options: ["Seven loaves only", "Five loaves and two fish", "Manna from heaven", "Twelve baskets of bread only"], correct: 1 },

    /* Epistles & Revelation */
    { q: "What fruit of the Spirit is listed FIRST in Galatians 5:22?", options: ["Peace", "Joy", "Love", "Patience"], correct: 2 },
    { q: "Complete: 'I can do all things through Christ who...'", options: ["...saves me", "...loves me", "...strengthens me", "...forgives me"], correct: 2 },
    { q: "Who wrote most of the New Testament letters (epistles)?", options: ["Peter", "John", "Paul", "James"], correct: 2 },
    { q: "What is the last book of the Bible?", options: ["Jude", "Malachi", "Revelation", "Acts"], correct: 2 },
    { q: "Which epistle tells us 'Faith without works is dead'?", options: ["James", "Romans", "Galatians", "Hebrews"], correct: 0 },
    { q: "What does Paul instruct in Philippians 4:4?", options: ["Rejoice in the Lord always", "Faint not", "Complain quietly", "Work non-stop"], correct: 0 }
];

// ========================================
// LEADERSHIP SIMULATOR DATA
// ========================================
const leadershipScenarios = [
    {
        q: "You are leading a group project. One team member is not contributing. What do you do?",
        options: [
            "Ignore it and do their work yourself",
            "Have a private, respectful conversation with them to understand why",
            "Complain about them to the rest of the group",
            "Remove them from the project immediately"
        ],
        correct: 1, correctFeedback: "Great! A good leader communicates privately and with respect before taking further action."
    },
    {
        q: "Your mentor gives you critical feedback on your performance. How do you respond?",
        options: [
            "Get defensive and explain why they are wrong",
            "Ignore the feedback completely",
            "Thank them, reflect on the feedback, and ask how you can improve",
            "Feel too hurt to respond"
        ],
        correct: 2, correctFeedback: "Excellent! Receiving feedback with grace and a growth mindset is a mark of leadership."
    },
    {
        q: "You see a younger student being excluded from a group. What do you do?",
        options: [
            "Walk past and mind your business",
            "Join the group excluding them",
            "Invite the student to join your group and speak up against exclusion",
            "Wait to see if someone else handles it"
        ],
        correct: 2, correctFeedback: "Well done! A servant leader includes others and stands up for those who need support."
    },
    {
        q: "Your team loses a competition. As the leader, what is your first response?",
        options: [
            "Blame team members who made mistakes",
            "Give up and say the competition was unfair",
            "Take responsibility, encourage the team, and plan improvements",
            "Stay quiet and hope it gets forgotten"
        ],
        correct: 2, correctFeedback: "Correct! Leaders take responsibility and build their team up even after setbacks."
    },
    {
        q: "You have an idea that differs from your mentor's plan. What do you do?",
        options: [
            "Act on your idea without telling anyone",
            "Respectfully share your idea and explain your reasoning",
            "Dismiss your idea because the mentor must always be right",
            "Complain to peers instead of speaking up"
        ],
        correct: 1, correctFeedback: "Good thinking! Respectful communication of ideas is a sign of confident, healthy leadership."
    },
    {
        q: "Two choir members argue during rehearsal. As a student leader, you...",
        options: [
            "Take sides publicly to end it fast",
            "Pause, listen to both, and guide them toward peace and the mission",
            "Ignore it so practice continues",
            "Cancel rehearsal and leave"
        ],
        correct: 1, correctFeedback: "Leaders protect unity while addressing conflict with fairness and purpose."
    },
    {
        q: "You are offered credit for work your teammate mostly did. You...",
        options: [
            "Accept it silently",
            "Give full credit and celebrate the teammate",
            "Split credit but keep most praise",
            "Let others decide later"
        ],
        correct: 1, correctFeedback: "Integrity and honor for others mark true leadership."
    },
    {
        q: "A big ministry event is approaching and energy is low. You...",
        options: [
            "Complain about the team",
            "Cast vision, assign clear roles, and encourage practical next steps",
            "Do everything alone",
            "Hope someone else motivates them"
        ],
        correct: 1, correctFeedback: "Leaders renew vision and organize action."
    },
    {
        q: "You notice a safety or integrity issue no one is addressing. You...",
        options: [
            "Stay quiet to avoid trouble",
            "Report it responsibly to the right mentor or leader",
            "Post about it publicly first",
            "Joke about it with friends"
        ],
        correct: 1, correctFeedback: "Courageous responsibility protects people and trust."
    },
    {
        q: "A junior member asks for help while you are busy. You...",
        options: [
            "Dismiss them as a distraction",
            "Acknowledge them, set a time, and follow through",
            "Promise help and forget",
            "Tell them to figure it out alone always"
        ],
        correct: 1, correctFeedback: "Servant leaders make people feel valued without abandoning priorities."
    },
    {
        q: "Your plan fails mid-project. As leader you...",
        options: [
            "Hide the failure",
            "Own it, learn fast, and adjust the plan with the team",
            "Blame the youngest member",
            "Quit immediately"
        ],
        correct: 1, correctFeedback: "Resilient leaders model honesty and adaptive problem-solving."
    },
    {
        q: "Someone more talented joins your team. You...",
        options: [
            "Feel threatened and exclude them",
            "Welcome them and create space for their gifts",
            "Compete to outshine them",
            "Reduce their opportunities quietly"
        ],
        correct: 1, correctFeedback: "Secure leaders multiply talent for the mission."
    }
];

// ========================================
// MEMORY VERSE PAIRS (broader Scripture)
// ========================================
const memoryVersePairs = [
    { a: "For God so loved...", b: "...the world (John 3:16)" },
    { a: "I can do all things...", b: "...through Christ (Phil 4:13)" },
    { a: "The Lord is my shepherd...", b: "...I shall not want (Psalm 23:1)" },
    { a: "Trust in the Lord...", b: "...with all your heart (Prov 3:5)" },
    { a: "Be strong and...", b: "...courageous (Josh 1:9)" },
    { a: "Love is patient...", b: "...love is kind (1 Cor 13:4)" },
    { a: "Do not be anxious...", b: "...about anything (Phil 4:6)" },
    { a: "Your word is a lamp...", b: "...to my feet (Psalm 119:105)" },
    { a: "Create in me a clean heart...", b: "...O God (Psalm 51:10)" },
    { a: "The joy of the Lord...", b: "...is your strength (Neh 8:10)" },
    { a: "Seek first the kingdom...", b: "...of God (Matt 6:33)" },
    { a: "Come to me, all who labor...", b: "...and I will give you rest (Matt 11:28)" },
    { a: "Be still and...", b: "...know that I am God (Psalm 46:10)" },
    { a: "If we confess our sins...", b: "...He is faithful to forgive (1 John 1:9)" },
    { a: "Let your light shine...", b: "...before others (Matt 5:16)" },
    { a: "Train up a child...", b: "...in the way he should go (Prov 22:6)" },
    { a: "God is our refuge...", b: "...and strength (Psalm 46:1)" },
    { a: "In the beginning...", b: "...God created the heavens and the earth (Gen 1:1)" },
    { a: "Jesus Christ is the same...", b: "...yesterday, today, and forever (Heb 13:8)" },
    { a: "Cast all your anxiety...", b: "...on Him (1 Pet 5:7)" }
];

// ========================================
// WORD PLACEMENT DATA (multiple category sets)
// ========================================
const wordPlacementSets = [
    {
        categories: [
            { name: "Leadership Qualities", color: "var(--primary)", words: ["Integrity", "Accountability", "Vision", "Humility", "Initiative"] },
            { name: "Fruits of the Spirit", color: "var(--success)", words: ["Love", "Joy", "Peace", "Patience", "Kindness"] }
        ]
    },
    {
        categories: [
            { name: "Old Testament", color: "var(--primary)", words: ["Genesis", "Exodus", "Psalms", "Proverbs", "Isaiah"] },
            { name: "New Testament", color: "var(--success)", words: ["Matthew", "Acts", "Romans", "Hebrews", "Revelation"] }
        ]
    },
    {
        categories: [
            { name: "Worship Values", color: "var(--primary)", words: ["Reverence", "Excellence", "Unity", "Humility", "Devotion"] },
            { name: "Life Skills", color: "var(--success)", words: ["Discipline", "Budgeting", "Teamwork", "Time management", "Confidence"] }
        ]
    },
    {
        categories: [
            { name: "Character", color: "var(--primary)", words: ["Honesty", "Courage", "Purity", "Respect", "Faithfulness"] },
            { name: "Communication", color: "var(--success)", words: ["Listening", "Clarity", "Empathy", "Tone", "Feedback"] }
        ]
    }
];
// Back-compat alias
const wordPlacementData = wordPlacementSets[0];

// ========================================
// COMMUNICATION CHALLENGE DATA
// ========================================
const communicationScenarios = [
    {
        q: "A friend is going through a hard time and comes to talk to you. What is the BEST response?",
        options: [
            "Immediately tell them what they should do to fix it",
            "Change the subject to something more positive",
            "Listen attentively, show empathy, and ask 'How can I support you?'",
            "Share your own problems so they feel better"
        ],
        correct: 2, correctFeedback: "Active listening and empathy are the foundations of great communication."
    },
    {
        q: "You need to give feedback to a peer whose work was below standard. You say:",
        options: [
            "'Your work was terrible, you need to do better'",
            "'I noticed some areas we could improve together -- let me share my thoughts'",
            "Nothing, to avoid conflict",
            "'Even you know this wasn't good enough'"
        ],
        correct: 1, correctFeedback: "Constructive feedback focuses on improvement, not criticism of the person."
    },
    {
        q: "During a group discussion, someone says something you strongly disagree with. You:",
        options: [
            "Interrupt and loudly say they are wrong",
            "Say nothing and hold your frustration inside",
            "Wait for your turn, then respectfully share your perspective with evidence",
            "Leave the discussion"
        ],
        correct: 2, correctFeedback: "Respectful disagreement expressed calmly is a sign of emotional intelligence."
    },
    {
        q: "You are presenting in front of a group and you forget your next point. You:",
        options: [
            "Panic and run off stage",
            "Make up random content so no one notices",
            "Pause calmly, smile, and say 'Let me gather my thoughts for a moment'",
            "Keep talking about the wrong point hoping no one notices"
        ],
        correct: 2, correctFeedback: "Composure and confidence under pressure make a great communicator."
    },
    {
        q: "Someone sends you a message that comes across as rude. You:",
        options: [
            "Reply immediately with equal rudeness",
            "Take a moment to calm down, then respond with kindness and clarity",
            "Ignore all their messages forever",
            "Screenshot and share with others"
        ],
        correct: 1, correctFeedback: "Responding from a calm, clear place leads to better outcomes every time."
    },
    {
        q: "A mentor asks for your honest opinion on a weak plan. You:",
        options: [
            "Flatter them only",
            "Share truth with respect, reasons, and a helpful alternative",
            "Stay silent to stay safe",
            "Criticize them in front of peers later"
        ],
        correct: 1, correctFeedback: "Courageous, respectful honesty builds trust."
    },
    {
        q: "You misunderstood instructions and made a mistake. You:",
        options: [
            "Blame unclear people",
            "Own it, clarify, and ask how to correct it",
            "Hide it and hope no one notices",
            "Quit the task"
        ],
        correct: 1, correctFeedback: "Clear ownership plus clarification repairs trust quickly."
    },
    {
        q: "In a group chat, gossip starts about a classmate. You:",
        options: [
            "Add a funny comment",
            "Redirect the chat and refuse to participate in gossip",
            "Forward it to more people",
            "Stay quiet but keep reading for entertainment"
        ],
        correct: 1, correctFeedback: "Protecting dignity is powerful communication."
    },
    {
        q: "You need help but feel shy. Best approach:",
        options: [
            "Suffer alone",
            "Ask clearly, specifically, and politely for support",
            "Hint vaguely and hope someone notices",
            "Demand help immediately"
        ],
        correct: 1, correctFeedback: "Clear, humble requests invite healthy support."
    },
    {
        q: "A younger member is nervous before singing. You say:",
        options: [
            "'Don't mess up'",
            "'You've prepared well — breathe, focus on worship, and I'm with you'",
            "'Everyone is watching you'",
            "Nothing at all"
        ],
        correct: 1, correctFeedback: "Encouraging words strengthen courage and unity."
    }
];

// ========================================
// RHYTHM TRAINER DATA
// ========================================
const rhythmPatterns = [
    { pattern: [" ", " ", "  ", " "], bpm: 60, name: "Basic Beat" },
    { pattern: [" ", "  ", " ", " ", "  ", " "], bpm: 80, name: "Syncopated" },
    { pattern: [" ", " ", " ", "  ", " "], bpm: 90, name: "Choir March" },
    { pattern: [" ", " ", "  ", " ", " ", "  "], bpm: 70, name: "Worship Pulse" },
    { pattern: [" ", "  ", "  ", " ", " "], bpm: 85, name: "Praise Break" },
    { pattern: [" ", " ", " ", " ", "  ", " ", " "], bpm: 75, name: "Steady Walk" }
];

let rhythmGameState = { pattern: [], currentStep: 0, tapTimes: [], started: false, playing: false, interval: null, tapScore: 0, totalTaps: 0 };

// ========================================
// WORD PLACEMENT STATE
// ========================================
let wordPlacementState = { placedWords: {}, allWords: [] };

// ========================================
// MEMORY VERSE STATE
// ========================================
let memoryState = { flipped: [], matched: [], attempts: 0 };

// ========================================
// MAIN GAME CONTROLLER
// ========================================

function startGame(gameId) {
    currentGame = gameId;
    currentScore = 0;
    currentQuestion = 0;

    document.getElementById('gameSelection').style.display = 'none';
    document.getElementById('activeGame').style.display = 'block';

    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('gameResult').classList.remove('active');

    switch(gameId) {
        case 'faithQuiz': initFaithQuiz(); break;
        case 'leadershipSim': initLeadershipSim(); break;
        case 'memoryVerse': initMemoryVerse(); break;
        case 'wordPlacement': initWordPlacement(); break;
        case 'communication': initCommunication(); break;
        case 'rhythmTrainer': initRhythmTrainer(); break;
    }
}

function exitGame() {
    if (rhythmGameState.interval) clearInterval(rhythmGameState.interval);
    document.getElementById('gameSelection').style.display = 'block';
    document.getElementById('activeGame').style.display = 'none';
    currentGame = null;
}

function playAgain() {
    startGame(currentGame);
}

function updateProgress() {
    const pct = totalQuestions > 0 ? Math.round((currentQuestion / totalQuestions) * 100) : 0;
    document.getElementById('gameProgress').style.width = pct + '%';
    document.getElementById('questionCounter').textContent = `Question ${currentQuestion + 1} of ${totalQuestions}`;
    document.getElementById('currentScore').textContent = currentScore;
}

function showResult() {
    const pct = totalQuestions > 0 ? Math.round((currentScore / totalQuestions) * 100) : Math.round(currentScore);
    let emoji = ' ', title = 'Keep Practising!', msg = 'Review the material and try again. You can do this!';
    if (pct >= 80) { emoji = ' '; title = 'Excellent!'; msg = `You scored ${currentScore}/${totalQuestions}! Outstanding performance. Keep growing!`; }
    else if (pct >= 60) { emoji = ' '; title = 'Good Job!'; msg = `You scored ${currentScore}/${totalQuestions}. Keep studying and you'll be at the top!`; }
    else { msg = `You scored ${currentScore}/${totalQuestions}. Review the content and try again -- growth comes from practice!`; }

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('finalScore').textContent = `${currentScore}/${totalQuestions}`;
    document.getElementById('resultMessage').textContent = msg;

    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('gameResult').classList.add('active');
    document.getElementById('questionCounter').textContent = 'Complete!';
    document.getElementById('gameProgress').style.width = '100%';

    saveGameScore(currentGame, pct);
}

async function saveGameScore(gameId, score) {
    try {
        const client = await getSupabase();
        if (!client) return;
        const { data: { session } } = await client.auth.getSession();
        if (!session) return;
        await client.from('game_completions').insert({
            student_id: session.user.id,
            game_id: gameId,
            score: score,
            played_at: new Date().toISOString()
        });
        // Update XP display
        loadGamesStats();
    } catch(e) { /* silently fail if table doesn't exist yet */ }
}

async function loadGamesStats() {
    try {
        const client = await getSupabase();
        if (!client) return;
        const { data: { session } } = await client.auth.getSession();
        if (!session) return;
        const { data: scores } = await client.from('game_completions').select('score').eq('student_id', session.user.id);
        if (scores) {
            document.getElementById('gamesPlayed').textContent = scores.length;
            const totalXP = scores.reduce((sum, s) => sum + Math.round((s.score || 0) / 10), 0);
            document.getElementById('gamesXP').textContent = totalXP;
        }
    } catch(e) {}
}

// ========================================
// FAITH QUIZ (random Bible subset each run)
// ========================================
function initFaithQuiz() {
    activeFaithQuestions = pickRandomSubset(faithQuizQuestions, 8).map(randomizeQuestionOptions);
    totalQuestions = activeFaithQuestions.length;
    document.getElementById('activeGameTitle').textContent = 'Faith Quiz Arena';
    document.getElementById('faithQuizGame').classList.add('active');
    renderFaithQuestion();
}

function renderFaithQuestion() {
    if (currentQuestion >= activeFaithQuestions.length) { showResult(); return; }
    updateProgress();
    const q = activeFaithQuestions[currentQuestion];
    document.getElementById('fqQuestion').innerHTML = `<p style="font-weight:600; font-size:1.05rem; margin:0;">${q.q}</p>`;
    document.getElementById('fqOptions').innerHTML = q.options.map((opt, i) => `
        <button class="game-option" onclick="answerFaithQuiz(${i})">${opt}</button>
    `).join('');
}

function answerFaithQuiz(index) {
    const q = activeFaithQuestions[currentQuestion];
    const options = document.querySelectorAll('#fqOptions .game-option');
    options.forEach(btn => btn.disabled = true);
    options[q.correct].classList.add('correct');
    if (index === q.correct) {
        currentScore++;
        document.getElementById('currentScore').textContent = currentScore;
    } else {
        options[index].classList.add('wrong');
    }
    setTimeout(() => { currentQuestion++; renderFaithQuestion(); }, 1200);
}

// ========================================
// LEADERSHIP SIMULATOR (random scenarios)
// ========================================
function initLeadershipSim() {
    activeLeadershipScenarios = pickRandomSubset(leadershipScenarios, 6).map(randomizeQuestionOptions);
    totalQuestions = activeLeadershipScenarios.length;
    document.getElementById('activeGameTitle').textContent = 'Leadership Simulator';
    document.getElementById('leadershipSimGame').classList.add('active');
    renderLeadershipScenario();
}

function renderLeadershipScenario() {
    if (currentQuestion >= activeLeadershipScenarios.length) { showResult(); return; }
    updateProgress();
    const s = activeLeadershipScenarios[currentQuestion];
    document.getElementById('lsQuestion').innerHTML = `<p style="font-weight:600; font-size:1.05rem; margin:0;">${s.q}</p>`;
    document.getElementById('lsOptions').innerHTML = s.options.map((opt, i) => `
        <button class="game-option" onclick="answerLeadership(${i})">${opt}</button>
    `).join('');
}

function answerLeadership(index) {
    const s = activeLeadershipScenarios[currentQuestion];
    const options = document.querySelectorAll('#lsOptions .game-option');
    options.forEach(btn => btn.disabled = true);
    options[s.correct].classList.add('correct');
    if (index === s.correct) {
        currentScore++;
        document.getElementById('currentScore').textContent = currentScore;
        options[index].insertAdjacentHTML('afterend', `<div style="padding:0.5rem 1rem; background:#ECFDF5; border-radius:var(--radius-md); font-size:0.875rem; color:var(--success); margin-top:0.25rem;">${s.correctFeedback}</div>`);
    } else {
        options[index].classList.add('wrong');
        options[index].insertAdjacentHTML('afterend', `<div style="padding:0.5rem 1rem; background:#FEF2F2; border-radius:var(--radius-md); font-size:0.875rem; color:var(--danger); margin-top:0.25rem;">${s.correctFeedback}</div>`);
    }
    setTimeout(() => { currentQuestion++; renderLeadershipScenario(); }, 2000);
}

// ========================================
// MEMORY VERSE PUZZLE (random verse pairs)
// ========================================
function initMemoryVerse() {
    activeMemoryPairs = pickRandomSubset(memoryVersePairs, 6);
    totalQuestions = activeMemoryPairs.length;
    currentScore = 0;
    memoryState = { flipped: [], matched: [], attempts: 0 };
    document.getElementById('activeGameTitle').textContent = 'Memory Verse Puzzle';
    document.getElementById('questionCounter').textContent = `Matches: 0 of ${activeMemoryPairs.length}`;
    document.getElementById('memoryVerseGame').classList.add('active');

    let cards = [];
    activeMemoryPairs.forEach((pair, i) => {
        cards.push({ id: i, side: 'a', text: pair.a });
        cards.push({ id: i, side: 'b', text: pair.b });
    });
    cards = shuffleGameArray(cards);

    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = cards.map((card, idx) => `
        <div class="memory-card" data-idx="${idx}" data-id="${card.id}" data-side="${card.side}" onclick="flipMemoryCard(this)">
            <span style="display:none;">${card.text}</span>
            <span class="card-back"> </span>
        </div>
    `).join('');
    gameData.memoryCards = cards;
}

function flipMemoryCard(el) {
    if (el.classList.contains('matched') || el.classList.contains('flipped')) return;
    if (memoryState.flipped.length >= 2) return;

    el.classList.add('flipped');
    el.querySelector('.card-back').style.display = 'none';
    el.querySelector('span:first-child').style.display = 'block';
    el.style.fontSize = '0.65rem';
    el.style.padding = '0.25rem';
    el.style.textAlign = 'center';
    el.style.wordBreak = 'break-word';
    memoryState.flipped.push(el);

    if (memoryState.flipped.length === 2) {
        memoryState.attempts++;
        const [c1, c2] = memoryState.flipped;
        const id1 = c1.dataset.id, side1 = c1.dataset.side;
        const id2 = c2.dataset.id, side2 = c2.dataset.side;

        if (id1 === id2 && side1 !== side2) {
            c1.classList.add('matched'); c2.classList.add('matched');
            memoryState.matched.push(id1);
            memoryState.flipped = [];
            currentScore++;
            document.getElementById('questionCounter').textContent = `Matches: ${currentScore} of ${activeMemoryPairs.length}`;
            document.getElementById('currentScore').textContent = currentScore;
            if (memoryState.matched.length === activeMemoryPairs.length) {
                totalQuestions = activeMemoryPairs.length;
                setTimeout(showResult, 800);
            }
        } else {
            setTimeout(() => {
                [c1, c2].forEach(c => {
                    c.classList.remove('flipped');
                    c.querySelector('span:first-child').style.display = 'none';
                    c.querySelector('.card-back').style.display = 'block';
                    c.style.fontSize = '';
                    c.style.padding = '';
                    c.style.textAlign = '';
                    c.style.wordBreak = '';
                });
                memoryState.flipped = [];
            }, 1000);
        }
    }
}

// ========================================
// WORD PLACEMENT (random category set)
// ========================================
function initWordPlacement() {
    const set = pickRandomSubset(wordPlacementSets, 1)[0] || wordPlacementSets[0];
    activeWordCategories = set.categories;
    document.getElementById('activeGameTitle').textContent = 'Word Placement Challenge';
    document.getElementById('wordPlacementGame').classList.add('active');
    document.getElementById('questionCounter').textContent = 'Drag words to categories';
    document.getElementById('gameProgress').style.width = '50%';

    const allWords = shuffleGameArray(activeWordCategories.flatMap(c => c.words));
    wordPlacementState = { placedWords: {}, allWords, categories: activeWordCategories };

    const bank = document.getElementById('wordBank');
    bank.innerHTML = '<p style="font-size:0.75rem;color:var(--text-muted);margin:0 0 0.5rem;">Word Bank -- drag words below:</p>' +
        allWords.map(w => `<div class="drag-item" draggable="true" data-word="${w}" ondragstart="dragStart(event)">${w}</div>`).join('');

    const zones = document.getElementById('dropZones');
    zones.innerHTML = activeWordCategories.map(cat => `
        <div>
            <h4 style="font-size:0.875rem; margin-bottom:0.5rem; color:${cat.color};">${cat.name}</h4>
            <div class="drop-zone" data-category="${cat.name}"
                ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="dropWord(event, '${cat.name}')">
                <p style="font-size:0.75rem;color:var(--text-muted);margin:0;" class="drop-hint">Drop words here</p>
            </div>
        </div>
    `).join('');
}

function dragStart(e) { e.dataTransfer.setData('text/plain', e.target.dataset.word); }
function dragOver(e) { e.preventDefault(); e.currentTarget.classList.add('over'); }
function dragLeave(e) { e.currentTarget.classList.remove('over'); }
function dropWord(e, category) {
    e.preventDefault();
    e.currentTarget.classList.remove('over');
    const word = e.dataTransfer.getData('text/plain');
    // Remove from any previous category list
    Object.keys(wordPlacementState.placedWords).forEach(cat => {
        wordPlacementState.placedWords[cat] = (wordPlacementState.placedWords[cat] || []).filter(w => w !== word);
    });
    // Remove the word chip from bank or other zones
    document.querySelectorAll(`.drag-item[data-word="${word}"]`).forEach(el => el.remove());
    e.currentTarget.querySelector('.drop-hint')?.remove();
    e.currentTarget.insertAdjacentHTML('beforeend', `<div class="drag-item" draggable="true" data-word="${word}" ondragstart="dragStart(event)">${word}</div>`);
    if (!wordPlacementState.placedWords[category]) wordPlacementState.placedWords[category] = [];
    wordPlacementState.placedWords[category].push(word);
}

function checkWordPlacement() {
    let correct = 0, total = 0;
    const cats = wordPlacementState.categories || activeWordCategories || wordPlacementData.categories;
    cats.forEach(cat => {
        cat.words.forEach(w => {
            total++;
            if ((wordPlacementState.placedWords[cat.name] || []).includes(w)) correct++;
        });
    });
    currentScore = correct;
    totalQuestions = total;
    showResult();
}

// ========================================
// COMMUNICATION CHALLENGE (random scenarios)
// ========================================
function initCommunication() {
    activeCommunicationScenarios = pickRandomSubset(communicationScenarios, 6).map(randomizeQuestionOptions);
    totalQuestions = activeCommunicationScenarios.length;
    document.getElementById('activeGameTitle').textContent = 'Communication Challenge';
    document.getElementById('communicationGame').classList.add('active');
    renderCommunicationScenario();
}

function renderCommunicationScenario() {
    if (currentQuestion >= activeCommunicationScenarios.length) { showResult(); return; }
    updateProgress();
    const s = activeCommunicationScenarios[currentQuestion];
    document.getElementById('comQuestion').innerHTML = `<p style="font-weight:600; font-size:1.05rem; margin:0;">${s.q}</p>`;
    document.getElementById('comOptions').innerHTML = s.options.map((opt, i) => `
        <button class="game-option" onclick="answerCommunication(${i})">${opt}</button>
    `).join('');
}

function answerCommunication(index) {
    const s = activeCommunicationScenarios[currentQuestion];
    const options = document.querySelectorAll('#comOptions .game-option');
    options.forEach(btn => btn.disabled = true);
    options[s.correct].classList.add('correct');
    if (index === s.correct) {
        currentScore++;
        document.getElementById('currentScore').textContent = currentScore;
        options[index].insertAdjacentHTML('afterend', `<div style="padding:0.5rem 1rem;background:#ECFDF5;border-radius:var(--radius-md);font-size:0.875rem;color:var(--success);margin-top:0.25rem;">${s.correctFeedback}</div>`);
    } else {
        options[index].classList.add('wrong');
        options[index].insertAdjacentHTML('afterend', `<div style="padding:0.5rem 1rem;background:#FEF2F2;border-radius:var(--radius-md);font-size:0.875rem;color:var(--danger);margin-top:0.25rem;">${s.correctFeedback}</div>`);
    }
    setTimeout(() => { currentQuestion++; renderCommunicationScenario(); }, 2000);
}

// ========================================
// RHYTHM TRAINER (shuffled pattern order)
// ========================================
function initRhythmTrainer() {
    document.getElementById('activeGameTitle').textContent = 'Choir Rhythm Trainer';
    document.getElementById('rhythmTrainerGame').classList.add('active');
    document.getElementById('questionCounter').textContent = 'Watch the pattern...';
    currentScore = 0;
    totalQuestions = 5;
    const roundPatterns = pickRandomSubset(rhythmPatterns, 5);
    // If fewer than 5 unique, refill
    while (roundPatterns.length < 5) {
        roundPatterns.push(rhythmPatterns[Math.floor(Math.random() * rhythmPatterns.length)]);
    }
    rhythmGameState = {
        pattern: [], currentStep: 0, tapTimes: [], started: false, playing: false,
        interval: null, tapScore: 0, totalTaps: 0, round: 0, roundPatterns
    };
    startRhythmRound();
}

function startRhythmRound() {
    if (rhythmGameState.round >= 5) { showResult(); return; }
    rhythmGameState.round++;
    document.getElementById('questionCounter').textContent = `Round ${rhythmGameState.round} of 5`;
    const patternDef = (rhythmGameState.roundPatterns || rhythmPatterns)[(rhythmGameState.round - 1) % 5];
    rhythmGameState.pattern = patternDef.pattern;
    rhythmGameState.currentStep = 0;
    rhythmGameState.tapTimes = [];
    rhythmGameState.started = false;
    rhythmGameState.playing = true;

    document.getElementById('rhythmBtn').disabled = true;
    document.getElementById('rhythmInstruction').textContent = `Pattern: "${patternDef.name}" -- Watch carefully!`;
    document.getElementById('rhythmFeedback').textContent = '';

    let step = 0;
    const interval = patternDef.bpm ? Math.round(60000 / patternDef.bpm) : 700;
    let timer = setInterval(() => {
        if (step >= patternDef.pattern.length) {
            clearInterval(timer);
            document.getElementById('rhythmDisplay').textContent = ' ';
            document.getElementById('rhythmInstruction').textContent = 'Now TAP the button following the same pattern!';
            document.getElementById('rhythmBtn').disabled = false;
            rhythmGameState.started = true;
            rhythmGameState.tapExpected = patternDef.pattern.filter(p => p !== '  ').length;
            rhythmGameState.tapCount = 0;
            return;
        }
        document.getElementById('rhythmDisplay').textContent = patternDef.pattern[step];
        step++;
    }, interval);
}

function tapRhythm() {
    if (!rhythmGameState.started) return;
    rhythmGameState.tapCount = (rhythmGameState.tapCount || 0) + 1;
    document.getElementById('rhythmDisplay').textContent = ' ';
    setTimeout(() => document.getElementById('rhythmDisplay').textContent = ' ', 200);

    document.getElementById('rhythmFeedback').textContent = `Tap ${rhythmGameState.tapCount}/${rhythmGameState.tapExpected}`;

    if (rhythmGameState.tapCount >= rhythmGameState.tapExpected) {
        currentScore++;
        document.getElementById('currentScore').textContent = currentScore;
        document.getElementById('rhythmFeedback').textContent = '  Great rhythm!';
        rhythmGameState.started = false;
        document.getElementById('rhythmBtn').disabled = true;
        setTimeout(startRhythmRound, 1500);
    }
}

// ========================================
// PAGE INIT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadGamesStats();
});
