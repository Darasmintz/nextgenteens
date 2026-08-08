// ========================================
// NEXTGENTEENS -- LESSON VIEWER
// ========================================

let currentSession = null;
let allSessions = [];
let currentSessionIndex = 0;
let currentProgram = null;
let completedSessions = new Set();
let currentAssignmentId = null;

// ========================================
// LESSON CONTENT LIBRARY
// Notes, reflections, quiz questions per topic
// ========================================

const LESSON_CONTENT = {
    /* =================== CTFS TOPICS (12 WEEKS / 24 SESSIONS) =================== */
    'Foundation': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>What is the Foundation?</h3>
            <p>Every great building starts with a strong foundation. In the same way, your life as a teenager needs to be built on something solid -- something that won't crumble when storms come.</p>
            <blockquote>"Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock." -- Matthew 7:24</blockquote>
            <h3>Key Points</h3>
            <ul>
                <li>Your foundation determines how high you can build</li>
                <li>A foundation built on God's Word is unshakeable</li>
                <li>Character, values, and purpose are part of your foundation</li>
                <li>Start now -- the earlier you build, the stronger you become</li>
            </ul>
        `,
        courseNote: `<p><strong>The Christian Teenage Fellowship Session (CTFS) — Week 1 Foundation</strong> establishes the essential baseline for all 12 weeks of discipleship. Just as a skyscraper requires deep anchoring before ascending into the skyline, a young believer must anchor their identity, worldview, and daily habits in Christ before facing society's complex pressures. In this foundational module, students discover that spiritual resilience is not inherited by accident but constructed deliberately through Scripture, prayer, and godly fellowship. By understanding who God is and where their security lies, participants prepare themselves to engage with subsequent topics like maturity, leadership, and kingdom impact with unshakeable stability.</p>`,
        reflectionPrompts: [
            'What does your current life foundation look like?',
            'What is one thing you want to build your life on from today?',
            'How does your faith influence the decisions you make daily?'
        ],
        quizCategory: 'general'
    },
    'God': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Understanding Who God Is</h3>
            <p>Before we can build a relationship with God, we need to understand who He is. God is not a distant force -- He is a personal, loving Father who knows you by name.</p>
            <blockquote>"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." -- Jeremiah 29:11</blockquote>
            <h3>Key Attributes of God</h3>
            <ul>
                <li><strong>Omniscient</strong> -- God knows everything, including your struggles</li>
                <li><strong>Omnipresent</strong> -- God is always with you, wherever you go</li>
                <li><strong>Omnipotent</strong> -- God is all-powerful and nothing is impossible for Him</li>
                <li><strong>Love</strong> -- God's very nature is love (1 John 4:8)</li>
            </ul>
        `,
        courseNote: `<p><strong>CTFS Week 1 — God</strong> deepens the student's personal revelation of God's character. Rather than viewing God as a distant rule-enforcer, CTFS guides teenagers into recognizing Him as a loving, sovereign, and intimate Father. Understanding God's omniscience, omnipotence, and unconditional love transforms prayer from a routine obligation into dynamic communion. This session serves as the core theological engine for CTFS, demonstrating that every life purpose, moral standard, and act of service stems directly from a personal relationship with the Living God. Students leave equipped to trust God's plans above worldly anxieties.</p>`,
        reflectionPrompts: [
            'How do you currently experience God in your daily life?',
            'Which attribute of God means the most to you right now, and why?',
            'What is one step you can take this week to grow closer to God?'
        ],
        quizCategory: 'faith'
    },
    'Life': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Understanding Life and Purpose</h3>
            <p>Your life has purpose, even when circumstances feel confusing. Understanding who you are in Christ gives you a solid identity that can stand the test of peer pressure, failure, and uncertainty.</p>
            <blockquote>"For we are God's workmanship, created in Christ Jesus to do good works, which God prepared in advance for us to do." -- Ephesians 2:10</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 2 — Life</strong> explores the sacred origin, dignity, and divine assignment of human life. In a culture saturated with comparison and superficial standards, CTFS reinforces that every teenager is intentional God-crafted workmanship. By examining life through a biblical lens, students learn to appreciate their unique life story, safeguard their mental and spiritual well-being, and respect the inherent worth of others. This module transitions teens from asking 'Why am I here?' to declaring 'I am created for good works,' laying a firm groundwork for personal responsibility and destiny.</p>`,
        reflectionPrompts: [
            "What question about your life's purpose keeps coming up?",
            "Write down one thing you're thankful for about your life today.",
            "How can viewing your life as God's workmanship change how you view challenges?"
        ],
        quizCategory: 'purpose'
    },
    'Maturity': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Growing in Maturity</h3>
            <p>Maturity isn't about age -- it's about wisdom, character, and the ability to make God-honoring choices even when no one is watching.</p>
            <blockquote>"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up." -- Galatians 6:9</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 2 — Maturity</strong> challenges teenagers to transcend emotional impulsivity and embrace godly wisdom. Spiritual maturity is measured not by physical age or academic status, but by spiritual discernment, emotional regulation, and consistent integrity. Through CTFS, students analyze how small daily choices accumulate into lifelong character outcomes. This session teaches teens to take responsibility for their mistakes, respond gracefully under pressure, and seek godly counsel. As maturity develops, students transition from passive observers into active, dependable contributors within their families, schools, and fellowship groups.</p>`,
        reflectionPrompts: [
            "What area of maturity do you need to work on most?",
            "Name a mature role model and what makes them mature.",
            "How do you handle responsibility when no one is supervising you?"
        ],
        quizCategory: 'character'
    },
    'Growth': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Fostering Continuous Growth</h3>
            <p>Spiritual and personal growth is a continuous journey. Growth requires intentional effort, discipline, and a willingness to step outside your comfort zone.</p>
            <blockquote>"But grow in the grace and knowledge of our Lord and Savior Jesus Christ." -- 2 Peter 3:18</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 3 — Growth</strong> emphasizes that spiritual and personal development requires consistent nourishment and intentional practice. Just as physical growth depends on exercise and proper diet, spiritual vitality depends on Scripture feeding, fellowship, and active service. CTFS guides teenagers through self-assessment techniques to identify growth plateaus and spiritually stagnant areas. By cultivating a growth mindset, teens learn to see mistakes as learning opportunities rather than permanent failures, positioning themselves for continuous spiritual, academic, and relational expansion throughout the program.</p>`,
        reflectionPrompts: [
            'In what area of your life have you seen the most growth this year?',
            'What is one habit holding back your spiritual growth?',
            'How can you challenge yourself to step out of your comfort zone this week?'
        ],
        quizCategory: 'general'
    },
    'Personal Development': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Unlocking Your Potential</h3>
            <p>God has endowed you with unique talents, abilities, and gifts. Personal development is the process of discovering, stewarding, and multiplying these gifts for His glory.</p>
            <blockquote>"Do not neglect your gift, which was given you through prophecy..." -- 1 Timothy 4:14</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 3 — Personal Development</strong> focuses on identifying, honing, and stewarding God-given talents and skills. CTFS views personal development not as a selfish pursuit of fame, but as kingdom stewardship where students refine their intellectual, creative, and organizational capabilities to serve God and humanity effectively. Through practical goal-setting exercises, time management strategies, and self-reflection, students create actionable plans to develop their gifts, preparing them to excel in academics, leadership roles, and future career callings.</p>`,
        reflectionPrompts: [
            'What unique skills or talents has God given you?',
            'How are you currently developing those gifts?',
            'What is one personal goal you want to achieve over the next month?'
        ],
        quizCategory: 'purpose'
    },
    'Love': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Demonstrating Biblical Love</h3>
            <p>Love is not merely a warm feeling; it is a sacrificial commitment to seek the highest good of others, modeled perfectly by Jesus on the cross.</p>
            <blockquote>"Love is patient, love is kind. It does not envy, it does not boast, it is not proud." -- 1 Corinthians 13:4</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 4 — Love</strong> examines the transformative nature of Agape love within Christian community. CTFS teaches that biblical love is defined by selfless action, patience, forgiveness, and active care rather than temporal emotion. Teenagers learn to navigate peer conflicts, family dynamics, and social diversity with Christlike compassion. By practicing unconditional love in daily interactions, students strengthen fellowship bonds within CTFS and become beacons of light and reconciliation in their broader environments.</p>`,
        reflectionPrompts: [
            'How do you define genuine love based on 1 Corinthians 13?',
            'Who in your life needs to experience unconditional love from you this week?',
            'What makes biblical love different from worldly views of love?'
        ],
        quizCategory: 'relationships'
    },
    'Mindset': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Renewing Your Mindset</h3>
            <p>Your mindset determines your perspective, attitude, and actions. A renewed mind aligns with God's truth rather than fear or worldly pressure.</p>
            <blockquote>"Do not conform to the pattern of this world, but be transformed by the renewing of your mind." -- Romans 12:2</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 4 — Mindset</strong> empowers teens to break free from toxic self-talk, fear of failure, and cultural conformity by renewing their minds through God's Word. CTFS contrasts a fixed mindset with a faith-filled growth mindset, demonstrating how thoughts shape choices and outcomes. Students learn practical mental discipline strategies, scriptural memorization, and cognitive reframing, enabling them to replace doubt and anxiety with divine confidence, clarity, and peace in challenging situations.</p>`,
        reflectionPrompts: [
            'What negative thought patterns do you struggle with most?',
            'How does Romans 12:2 instruct us to transform our thinking?',
            'What truth from Scripture can you declare over your mind today?'
        ],
        quizCategory: 'character'
    },
    'Leadership': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>What is True Leadership?</h3>
            <p>Leadership is not about a title, a position, or being the loudest person in the room. True leadership is about influence -- the ability to positively impact the people around you.</p>
            <blockquote>"The greatest among you shall be your servant." -- Matthew 23:11</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 5 — Leadership</strong> unveils the Christ-centered paradigm of servant leadership. In CTFS, leadership is defined as positive influence grounded in integrity, humility, and accountability. Students learn that effective leaders lead by example long before holding official titles. This module equips teenagers to take initiative in solving problems, serve their peers selflessly, and model godly standards at school, home, and within the fellowship, establishing them as emerging community leaders.</p>`,
        reflectionPrompts: [
            'Who is a leader you admire? What qualities make them effective?',
            'Describe a situation where you exercised positive leadership.',
            'What leadership quality do you feel called to grow in this month?'
        ],
        quizCategory: 'leadership'
    },
    'Self Development': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Mastering Self-Leadership</h3>
            <p>Before you can lead others effectively, you must first learn to lead yourself through self-discipline, emotional management, and spiritual integrity.</p>
            <blockquote>"Like a city whose walls are broken down is a person who lacks self-control." -- Proverbs 25:28</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 5 — Self Development</strong> focuses on internal self-governance and emotional mastery as mandatory prerequisites for public leadership. CTFS teaches that self-control, time stewardship, and emotional intelligence form the protective walls of personal character. Teenagers explore strategies for managing stress, overcoming procrastination, and remaining faithful in small commitments, ensuring their private character matches their public ministry.</p>`,
        reflectionPrompts: [
            'In what daily habit do you need stronger self-control?',
            'How do you react when plans do not go your way?',
            'What strategy will help you manage your time more effectively this week?'
        ],
        quizCategory: 'character'
    },
    'Faith': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>What is Faith?</h3>
            <p>Faith is confident trust in God based on who He is and what He has promised in His Word, leading to courageous, obedient action.</p>
            <blockquote>"Now faith is confidence in what we hope for and assurance about what we do not see." -- Hebrews 11:1</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 6 — Faith</strong> anchors teenagers in deep, resilient trust in God's promises regardless of circumstances. CTFS clarifies that biblical faith is active conviction that produces tangible obedience and moral courage. Through scriptural case studies and testimonies, students discover how faith overcomes doubt, withstands societal pressure, and unlocks divine power in everyday teenage experiences.</p>`,
        reflectionPrompts: [
            'Describe a situation where your faith was put to the test.',
            'What specific promise in the Bible are you standing on right now?',
            'How can your faith lead to action in your school or community this week?'
        ],
        quizCategory: 'faith'
    },
    'Communication': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>The Power of Communication</h3>
            <p>How you communicate shapes every relationship in your life. Learning to speak with grace, clarity, and active listening transforms your influence.</p>
            <blockquote>"Let your speech always be gracious, seasoned with salt..." -- Colossians 4:6</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 6 — Communication</strong> equips teenagers with practical and spiritual tools for healthy interpersonal dialogue. CTFS highlights active listening, empathetic understanding, clear expression, and gracious conflict resolution. Students apply the THINK filter (True, Helpful, Inspiring, Necessary, Kind) to both verbal and digital communication, preparing them to build healthy relationships and represent Christ honorably.</p>`,
        reflectionPrompts: [
            'What is your primary communication challenge in difficult conversations?',
            'How can active listening improve your relationship with your family?',
            'What adjustment can you make to how you communicate online?'
        ],
        quizCategory: 'communication'
    },
    'Relationships': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Navigating Godly Relationships</h3>
            <p>The company you keep shapes your character and future direction. Healthy relationships honor God, encourage growth, and maintain godly boundaries.</p>
            <blockquote>"As iron sharpens iron, so one person sharpens another." -- Proverbs 27:17</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 7 — Relationships</strong> provides teenagers with a biblical compass for evaluating friendships, managing peer influence, and setting healthy relational boundaries. CTFS stresses the importance of surrounding oneself with companions who encourage spiritual growth and moral purity. Students learn to handle friendship transitions, resist negative peer pressure, and foster iron-sharpening connections.</p>`,
        reflectionPrompts: [
            'Do your closest friendships draw you closer to God or pull you away?',
            'How do you set healthy boundaries with peers who pressure you?',
            'What does it mean to be an "iron-sharpening" friend to others?'
        ],
        quizCategory: 'relationships'
    },
    'Character Formation': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Building Uncompromised Character</h3>
            <p>Character is the sum of your moral choices made over time when no one is looking. It is the cornerstone of lasting trust and leadership.</p>
            <blockquote>"The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity." -- Proverbs 11:3</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 7 — Character Formation</strong> emphasizes that lasting success and kingdom impact are built upon unyielding moral integrity. CTFS helps teenagers examine their private habits, honesty, and consistency. By understanding that character is formed through daily decisions, students commit to living transparently, keeping promises, and standing firm in truth.</p>`,
        reflectionPrompts: [
            'What does integrity mean to you in everyday teenage life?',
            'Identify a small choice you make daily that builds or weakens your character.',
            'How can you cultivate greater honesty in your commitments?'
        ],
        quizCategory: 'character'
    },
    'Purpose and Identity': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Rooted in Divine Identity</h3>
            <p>Your true identity is found in who God says you are, not in social media popularity, performance, or human opinions.</p>
            <blockquote>"But you are a chosen people, a royal priesthood, a holy nation..." -- 1 Peter 2:9</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 8 — Purpose and Identity</strong> solidifies the teenager's understanding of their secure standing in Christ. CTFS addresses the epidemic of identity confusion, performance anxiety, and social media validation by grounding students in their identity as beloved sons and daughters of God. Students discover how knowing their identity clarifies their life purpose and frees them from insecurity.</p>`,
        reflectionPrompts: [
            'Where do you feel most tempted to seek identity or validation?',
            'What scriptural truth about your identity in Christ resonates most with you?',
            'How does knowing your true identity change how you handle rejection?'
        ],
        quizCategory: 'purpose'
    },
    'Discipline and Habits': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>The Power of Spiritual Disciplines</h3>
            <p>Discipline is the bridge between goals and accomplishment. Daily spiritual and personal habits shape your destiny.</p>
            <blockquote>"For God has not given us a spirit of fear, but of power and of love and of a sound mind." -- 2 Timothy 1:7</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 8 — Discipline and Habits</strong> teaches teenagers how to construct sustainable routines for Bible reading, prayer, academic study, and physical well-being. CTFS frames discipline not as punishment, but as freedom and empowerment. Students construct personalized daily habit trackers, equipping them to build consistency that endures beyond emotional highs.</p>`,
        reflectionPrompts: [
            'What positive spiritual habit would you like to build starting this week?',
            'What distraction currently consumes most of your free time?',
            'How does self-discipline create freedom in your daily life?'
        ],
        quizCategory: 'general'
    },
    'Integrity and Character': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Living with Total Integrity</h3>
            <p>Integrity means wholeness -- your words, beliefs, and actions align seamlessly whether in public view or private solitude.</p>
            <blockquote>"Whoever walks in integrity walks securely, but whoever takes crooked paths will be found out." -- Proverbs 10:9</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 9 — Integrity and Character</strong> reinforces the vital importance of undivided moral alignment. In CTFS, teenagers examine how compromise in secret undermines confidence and spiritual authority. Students learn practical accountability frameworks, honest communication techniques, and moral courage, enabling them to stand firm against compromise.</p>`,
        reflectionPrompts: [
            'In what area is it hardest to maintain total integrity?',
            'Why does secret compromise damage your confidence and faith?',
            'Who can serve as an accountability partner in your life?'
        ],
        quizCategory: 'character'
    },
    'Spiritual Life': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Cultivating a Vibrant Spiritual Life</h3>
            <p>A thriving spiritual life is rooted in daily communion with God through His Word, prayer, worship, and walking in the Holy Spirit.</p>
            <blockquote>"Remain in me, as I also remain in you. No branch can bear fruit by itself..." -- John 15:4</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 9 — Spiritual Life</strong> guides teenagers into a deep, abiding relationship with God through the Holy Spirit. CTFS moves students beyond religious routine into intimate spiritual communion. Teens learn how to study Scripture deeply, hear God's voice, and walk in spiritual vitality throughout their week.</p>`,
        reflectionPrompts: [
            'How would you describe the current health of your spiritual life?',
            'What practical step can you take to make your quiet time more meaningful?',
            'What does it mean for you to abide in Christ daily?'
        ],
        quizCategory: 'spiritual'
    },
    'Prayer': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Deepening Your Prayer Life</h3>
            <p>Prayer is two-way communication with your Heavenly Father -- speaking, listening, thanking, interceding, and aligning with His will.</p>
            <blockquote>"Pray without ceasing, give thanks in all circumstances..." -- 1 Thessalonians 5:17-18</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 10 — Prayer</strong> unlocks the power and intimacy of effective prayer. CTFS demystifies prayer, showing teenagers that it is a conversation with a loving Father who listens and responds. Students practice different forms of prayer -- adoration, confession, thanksgiving, and intercession -- building confidence to pray regularly.</p>`,
        reflectionPrompts: [
            'What is your biggest obstacle to maintaining a consistent prayer life?',
            'Describe a time when God answered a prayer in your life.',
            'Who or what will you commit to praying for regularly this week?'
        ],
        quizCategory: 'spiritual'
    },
    'Kingdom Impact': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Making a Lasting Difference</h3>
            <p>God has placed you in your family, school, and community to be salt and light, making a tangible difference for His kingdom.</p>
            <blockquote>"You are the light of the world. A town built on a hill cannot be hidden." -- Matthew 5:14</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 10 — Kingdom Impact</strong> inspires teenagers to look beyond themselves and serve their surrounding world. CTFS challenges students to see their gifts, school environment, and energy as tools for kingdom transformation. Students design actionable service initiatives, demonstrating Christ's love through compassionate action.</p>`,
        reflectionPrompts: [
            'Where in your immediate environment can you make the greatest kingdom impact?',
            'What needs or problems in your community fire up your passion to help?',
            'How can you be salt and light among your peers this week?'
        ],
        quizCategory: 'leadership'
    },
    'Servant Leadership': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Leading by Serving</h3>
            <p>True greatness in God's kingdom is measured by service. Servant leaders put the needs of others ahead of their own comfort or ambition.</p>
            <blockquote>"For even the Son of Man did not come to be served, but to serve..." -- Mark 10:45</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 11 — Servant Leadership</strong> synthesizes the program's leadership training into the model of Jesus. CTFS teaches that real authority comes through humble service. Teenagers practice identifying practical ways to serve behind the scenes at home, church, and school, developing hearts of servant leaders.</p>`,
        reflectionPrompts: [
            'What does servant leadership look like in your home or school?',
            'Name one practical way you can serve someone without seeking recognition.',
            'How does serving others change your heart and perspective?'
        ],
        quizCategory: 'leadership'
    },
    'Vision and Goals': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Mapping Your God-Given Vision</h3>
            <p>Vision gives direction, passion, and purpose to your daily decisions. Setting faith-filled goals helps you fulfill God's assignment.</p>
            <blockquote>"Write the vision and make it plain on tablets, that he may run who reads it." -- Habakkuk 2:2</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 11 — Vision and Goals</strong> guides teenagers to articulate their long-term God-given vision and break it down into actionable goals. CTFS equips students with SMART goal frameworks aligned with biblical principles, empowering them to pursue academic, spiritual, and personal milestones with focus.</p>`,
        reflectionPrompts: [
            'What vision or dream has God placed in your heart for the future?',
            'What are 3 specific goals you can set for the next 6 months?',
            'How will achieving these goals help you fulfill your divine purpose?'
        ],
        quizCategory: 'purpose'
    },
    'Review and Consolidation': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Consolidating Your Growth</h3>
            <p>Reviewing what you have learned solidifies your growth, reinforces your commitments, and prepares you for the next level of leadership.</p>
            <blockquote>"Hold fast to the memory of what you have received and heard; obey it, and repent." -- Revelation 3:3</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 12 — Review and Consolidation</strong> synthesizes all 12 weeks of spiritual, relational, and leadership training. CTFS provides a space for reflection, testimony sharing, and peer evaluation. Students review their growth metrics, celebrate achievements, and reinforce life-changing habits for long-term impact.</p>`,
        reflectionPrompts: [
            'What has been the single most transformative lesson in CTFS for you?',
            'How have your habits and perspectives changed over the past 12 weeks?',
            'What core principle will you carry forward into your daily life?'
        ],
        quizCategory: 'general'
    },
    'Graduation Celebration': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Stepping into Your Calling</h3>
            <p>Graduation is not an endpoint -- it is a commissioning into your next chapter of leadership, kingdom impact, and continuous growth.</p>
            <blockquote>"Being confident of this, that he who began a good work in you will carry it on to completion..." -- Philippians 1:6</blockquote>
        `,
        courseNote: `<p><strong>CTFS Week 12 — Graduation Celebration</strong> marks the official completion of the 12-week Christian Teenage Fellowship Session. CTFS celebrates each student's dedication, growth, and achievements. Graduates are commissioned as empowered teen leaders equipped to lead peers, mentor younger students, and shine as salt and light.</p>`,
        reflectionPrompts: [
            'How do you feel stepping into your role as a CTFS graduate and leader?',
            'Who will you mentor or encourage using the principles you learned?',
            'What commitment are you making to keep growing in Christ daily?'
        ],
        quizCategory: 'general'
    },

    /* =================== TCVLMDP TOPICS (24 VOICE & LEADERSHIP MODULES) =================== */
    'Introduction to Voice Training': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Fundamentals of Vocal Ministry</h3>
            <p>Your voice is a unique instrument created by God. Understanding vocal mechanics, warm-ups, and worship mindset lays the foundation for vocal excellence.</p>
            <blockquote>"Sing to him a new song; play skillfully, and shout for joy." -- Psalm 33:3</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 1 — Introduction to Voice Training</strong> opens the Teen Choir Voice, Leadership & Mentorship Development Project. TCVLMDP combines musical skill with spiritual preparation, teaching students that worship leading demands both technical competence and spiritual purity. Teenagers discover how the vocal apparatus functions, establish healthy daily warm-up habits, and align their artistic talents with the goal of glorifying God and inspiring the congregation.</p>`,
        reflectionPrompts: [
            'Why is combining musical skill with spiritual preparation essential in worship ministry?',
            'What vocal goal would you like to achieve during this program?',
            'How can you use your voice to encourage others this week?'
        ],
        quizCategory: 'choir'
    },
    'Breathing Techniques': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Mastering Breath Support</h3>
            <p>Proper diaphragmatic breathing is the engine of powerful, sustained, and healthy singing. Breath control protects your vocal cords and enhances tone.</p>
            <blockquote>"Let everything that has breath praise the Lord. Praise the Lord!" -- Psalm 150:6</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 2 — Breathing Techniques</strong> trains vocalists in diaphragmatic breath management -- the cornerstone of healthy singing. TCVLMDP guides students through breath expansion exercises, air-release control, and posture alignment. By mastering breath support, young singers increase dynamic range, avoid throat tension, and sustain phrases effortlessly during worship ministrations.</p>`,
        reflectionPrompts: [
            'How does diaphragmatic breathing differ from shallow chest breathing?',
            'What physical sensation do you notice when practicing proper breath support?',
            'How can breath control help you maintain calm under pressure during performance?'
        ],
        quizCategory: 'choir'
    },
    'Posture and Stance': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Physical Alignment in Singing</h3>
            <p>Your body is your instrument's resonance chamber. Good posture opens the airway, improves vocal projection, and communicates confidence.</p>
            <blockquote>"I will praise you with an upright heart as I learn your righteous laws." -- Psalm 119:7</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 3 — Posture and Stance</strong> establishes proper body alignment and stage presence for choir members. TCVLMDP demonstrates how spinal alignment, grounded feet, and relaxed shoulders maximize resonance and airflow. Students practice confident, engaging posture that reflects reverence, authority, and joy during worship.</p>`,
        reflectionPrompts: [
            'Why does posture directly impact vocal tone and projection?',
            'What adjustment to your singing stance produces the best vocal freedom?',
            'How does your physical presentation affect the audience or congregation?'
        ],
        quizCategory: 'choir'
    },
    'Pitch and Tone Development': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Developing Ear and Pitch Accuracy</h3>
            <p>Singing in tune requires active listening, ear training, and vocal resonance focus. Clear tone quality engages listeners and enhances unity.</p>
            <blockquote>"The trumpet call was clear, so the army prepared for battle." -- 1 Corinthians 14:8</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 4 — Pitch and Tone Development</strong> refines pitch precision, vowel placement, and tone quality. TCVLMDP equips students with ear-training exercises, interval recognition, and resonance focus techniques. Vocalists learn to eliminate pitch sagging, balance tone warmth with clarity, and blend seamlessly within their choir sections.</p>`,
        reflectionPrompts: [
            'What ear-training exercise helps you identify pitch accuracy most effectively?',
            'How does vowel placement influence tone warmth and brightness?',
            'Why is accurate intonation vital when singing in a group?'
        ],
        quizCategory: 'choir'
    },
    'Harmony Fundamentals': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>The Art of Vocal Blending</h3>
            <p>Harmony occurs when distinct voices blend together in unity. Understanding harmony parts -- Soprano, Alto, Tenor -- creates rich worship music.</p>
            <blockquote>"Live in harmony with one another. Do not be proud, but be willing to associate with people of low position." -- Romans 12:16</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 5 — Harmony Fundamentals</strong> explores vocal parts, chord structures, and choral blending. TCVLMDP teaches students how to hold independent harmony parts against melody lines. Vocalists learn the musical and spiritual significance of harmony, experiencing how diverse voices blend into a powerful, unified sound of praise.</p>`,
        reflectionPrompts: [
            'What is your vocal part (Soprano, Alto, Tenor, Bass) and what role does it play in harmony?',
            'How do you stay on your harmony part when surrounding voices sing melody?',
            'In what ways does vocal harmony illustrate unity in the Body of Christ?'
        ],
        quizCategory: 'choir'
    },
    'Voice Care and Maintenance': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Preserving Your Vocal Health</h3>
            <p>Your vocal cords are delicate muscles that require hydration, rest, proper technique, and protection from vocal strain or abuse.</p>
            <blockquote>"Do you not know that your bodies are temples of the Holy Spirit..." -- 1 Corinthians 6:19</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 6 — Voice Care and Maintenance</strong> instructs young singers on protecting their vocal health for lifelong ministry. TCVLMDP covers proper hydration, vocal rest, avoiding screaming, managing vocal fatigue, and gentle warm-down routines. Students adopt healthy lifestyle habits that ensure longevity, power, and reliability in their vocal ministry.</p>`,
        reflectionPrompts: [
            'What bad habit poses the greatest risk to your vocal health?',
            'How will you incorporate proper vocal rest and hydration into your weekly routine?',
            'Why is caring for your voice an act of stewardship toward God?'
        ],
        quizCategory: 'choir'
    },
    'Vocal Expression': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Communicating Heart and Dynamics</h3>
            <p>Music is a language of emotion and truth. Using dynamics, articulation, and authentic heart expression brings song lyrics to life.</p>
            <blockquote>"I will sing with my spirit, but I will also sing with my understanding." -- 1 Corinthians 14:15</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 7 — Vocal Expression</strong> guides singers to connect deeply with the message behind lyric lines. TCVLMDP teaches dynamic contrasts, phrasing, diction, and facial expression. Students move beyond robotic singing to deliver passionate, authentic, and Spirit-led vocal performances that touch hearts.</p>`,
        reflectionPrompts: [
            'How can dynamic shifts (soft vs. loud) change the emotional impact of a song?',
            'Why must heart conviction match vocal delivery in worship ministry?',
            'What song lyric inspires you to express deep worship when singing?'
        ],
        quizCategory: 'choir'
    },
    'Worship Leading Basics': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Guiding Others in Praise</h3>
            <p>Worship leading is not a performance; it is facilitating a divine encounter between the congregation and God with humility and spiritual focus.</p>
            <blockquote>"God is spirit, and his worshipers must worship in the Spirit and in truth." -- John 4:24</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 8 — Worship Leading Basics</strong> prepares teen vocalists to lead congregational worship with sensitivity, authority, and humbleness. TCVLMDP covers song selection, transitions, reading the room, and focusing attention on God rather than self. Students gain confidence to usher others into God's presence through authentic worship.</p>`,
        reflectionPrompts: [
            'What is the difference between a musical performance and leading congregational worship?',
            'How do you prepare spiritually before standing to lead worship?',
            'What key attribute makes a worship leader effective and relatable?'
        ],
        quizCategory: 'choir'
    },
    'Leadership in Ministry': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Serving Through Sacred Music</h3>
            <p>Ministry leadership requires spiritual maturity, teamwork, punctuality, and a heart dedicated to serving the church body faithfully.</p>
            <blockquote>"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters..." -- Colossians 3:23</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 9 — Leadership in Ministry</strong> connects musical performance with spiritual leadership within the local church. TCVLMDP highlights punctuality, spiritual preparation, teamwork, and submission to leadership. Teen singers learn to view their choir participation as a vital ministry calling that demands dedication and integrity.</p>`,
        reflectionPrompts: [
            'How does viewing choir participation as a "ministry" change your approach to rehearsals?',
            'What standard of excellence should characterize music ministry leadership?',
            'How can you support your choir director and fellow team members this week?'
        ],
        quizCategory: 'leadership'
    },
    'Teamwork and Communication': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Building Unity in the Choir</h3>
            <p>A choir is a team where individual ego yields to collective harmony. Effective communication and mutual encouragement create artistic and spiritual power.</p>
            <blockquote>"Make my joy complete by being like-minded, having the same love, being one in spirit and of one mind." -- Philippians 2:2</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 10 — Teamwork and Communication</strong> fosters interpersonal unity, conflict resolution, and teamwork within music teams. TCVLMDP teaches section leadership, constructive peer feedback, and active listening. Vocalists learn to encourage fellow members, set aside competition, and achieve musical and spiritual cohesion.</p>`,
        reflectionPrompts: [
            'How do you respond when a fellow choir member makes a mistake during rehearsal?',
            'What role does active communication play in keeping a choir unified?',
            'How can you build stronger unity within your vocal section this month?'
        ],
        quizCategory: 'communication'
    },
    'Accountability and Responsibility': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Owning Your Commitment</h3>
            <p>Reliability, practice discipline, punctuality, and taking responsibility for your parts are non-negotiable qualities of an effective choir member.</p>
            <blockquote>"It is required in stewards that one be found faithful." -- 1 Corinthians 4:2</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 11 — Accountability and Responsibility</strong> instills personal stewardship and reliability in young vocalists. TCVLMDP emphasizes home practice, memorizing lyrics, arriving on time, and accepting constructive feedback. Teenagers discover that dependability builds trust with mentors, directors, and peers.</p>`,
        reflectionPrompts: [
            'How prepared are you usually when arriving at choir rehearsals?',
            'Why is personal practice at home essential for overall team success?',
            'In what area of your choir commitments can you demonstrate greater accountability?'
        ],
        quizCategory: 'character'
    },
    'Servant Leadership': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Submitting Talent to Kingdom Service</h3>
            <p>Great singers use their voice to lift others. Servant leadership in choir means putting section needs above solo ambitions.</p>
            <blockquote>"In humility value others above yourselves, not looking to your own interests but each of you to the interests of the others." -- Philippians 2:3-4</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 12 — Servant Leadership</strong> applies Christ's servant model to the music environment. TCVLMDP addresses vocal vanity and competition, steering teenagers toward lifting section peers, setting up equipment, and welcoming new members. Students realize that true vocal greatness serves the team and glorifies God.</p>`,
        reflectionPrompts: [
            'How can you demonstrate servant leadership during choir rehearsals?',
            'What is the danger of seeking personal spotlight in worship ministry?',
            'How can you help a struggling singer in your section improve?'
        ],
        quizCategory: 'leadership'
    },
    'Goal Setting and Personal Growth': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Tracking Vocal and Personal Progress</h3>
            <p>Setting specific, measurable vocal goals -- such as expanding range or improving sight-reading -- drives continuous skill development.</p>
            <blockquote>"I press on toward the goal to win the prize for which God has called me heavenward in Christ Jesus." -- Philippians 3:14</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 13 — Goal Setting and Personal Growth</strong> empowers students to establish individual vocal development targets. TCVLMDP guides singers through vocal range mapping, tone enrichment goals, and sight-reading milestones. Teenagers create personal growth plans, developing self-motivation and measurable vocal excellence.</p>`,
        reflectionPrompts: [
            'What specific vocal technique goal do you want to master in the next 30 days?',
            'How will you measure your vocal progress over time?',
            'What habit will you establish to ensure daily vocal growth?'
        ],
        quizCategory: 'purpose'
    },
    'Character Building': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Aligning Off-Stage Life with On-Stage Ministry</h3>
            <p>Your platform ministering power is only as strong as your off-stage character. Authenticity demands living the truth you sing.</p>
            <blockquote>"Set an example for the believers in speech, in conduct, in love, in faith and in purity." -- 1 Timothy 4:12</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 14 — Character Building</strong> addresses the imperative alignment between public musical performance and private lifestyle choices. TCVLMDP reminds teen ministers that giftedness without godly character leads to moral failure. Students commit to living pure, honest, and humble lives that reinforce their singing ministry.</p>`,
        reflectionPrompts: [
            'Why is off-stage character more critical than vocal talent in worship ministry?',
            'In what area of your daily life must your lifestyle better match the worship songs you sing?',
            'How can you represent Christ honorably outside of church settings?'
        ],
        quizCategory: 'character'
    },
    'Talent Discovery': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Uncovering Your Creative Potential</h3>
            <p>God has placed unique vocal timbres, musical instincts, and creative talents inside you waiting to be discovered and nurtured.</p>
            <blockquote>"We have different gifts, according to the grace given to each of us." -- Romans 12:6</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 15 — Talent Discovery</strong> assists students in discovering their unique vocal strengths, harmony agility, arrangement ideas, or leadership abilities. TCVLMDP creates a safe, supportive environment for teenagers to experiment with solos, harmony leading, and vocal improvisation, bolstering creative self-belief.</p>`,
        reflectionPrompts: [
            'What unexpected musical or leadership talent have you discovered during this program?',
            'How can you stewardship your unique vocal timbre without comparing yourself to others?',
            'In what creative area would you like to take a brave step forward?'
        ],
        quizCategory: 'purpose'
    },
    'Mentorship Principles': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Passing the Baton to Others</h3>
            <p>True leaders produce more leaders. Learning to mentor younger or newer singers multiplies impact and ensures ministry continuity.</p>
            <blockquote>"And the things you have heard me say... entrust to reliable people who will also be qualified to teach others." -- 2 Timothy 2:2</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 16 — Mentorship Principles</strong> equips experienced teen choir members to mentor junior vocalists. TCVLMDP teaches peer coaching, active encouragement, constructive critique, and spiritual guidance. Students step into mentorship roles, multiplying leadership and sustaining a culture of growth.</p>`,
        reflectionPrompts: [
            'Who mentored or encouraged you when you first joined choir or ministry?',
            'How can you mentor a younger student in vocal technique or spiritual growth?',
            'What quality is most important when coaching a peer?'
        ],
        quizCategory: 'leadership'
    },
    'Spiritual Formation': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Nourishing the Soul Behind the Voice</h3>
            <p>Deep worship flows from a heart filled with God's Word and Spirit. Spiritual discipline fuels genuine musical ministry.</p>
            <blockquote>"Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom through psalms, hymns, and songs..." -- Colossians 3:16</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 17 — Spiritual Formation</strong> deepens the devotional habits of choir members. TCVLMDP teaches students how to meditate on song lyrics, study the biblical themes within worship music, and maintain personal devotion. Vocalists discover that powerful worship leading is an outflow of an abiding relationship with God.</p>`,
        reflectionPrompts: [
            'How does studying the biblical background of a worship song change your delivery of it?',
            'What spiritual discipline nourishes your heart most before a ministration?',
            'How can you ensure your singing remains an offering to God rather than a performance?'
        ],
        quizCategory: 'spiritual'
    },
    'Prayer in Ministry': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Anchoring Worship Rehearsals in Prayer</h3>
            <p>Prayer invites God's presence, breaks spiritual atmosphere resistance, and aligns the choir's heart with God's agenda before singing.</p>
            <blockquote>"They raised their voices together in prayer to God..." -- Acts 4:24</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 18 — Prayer in Ministry</strong> integrates prayer into every phase of choir life -- from rehearsals to platform ministrations. TCVLMDP guides students in praying for their director, congregation, atmosphere, and spiritual unity, building a choir culture sustained by divine power.</p>`,
        reflectionPrompts: [
            'Why is pre-rehearsal and pre-ministration prayer essential for a worship team?',
            'How have you experienced a shift in atmosphere when a choir prays together?',
            'What specific prayer burden will you carry for your music team this week?'
        ],
        quizCategory: 'spiritual'
    },
    'Ministry Development': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Organizing Music Events and Outreach</h3>
            <p>Music ministry extends beyond church walls. Planning, administration, and outreach strategy maximize kingdom reach.</p>
            <blockquote>"But everything should be done in a fitting and orderly way." -- 1 Corinthians 14:40</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 19 — Ministry Development</strong> teaches teenagers practical administrative and organizational skills for music ministry. TCVLMDP covers event coordination, sound check management, songbook curation, and community music outreach, equipping students to execute orderly, high-impact music events.</p>`,
        reflectionPrompts: [
            'Why is administrative order and planning vital for effective music ministry?',
            'What role can you play in organizing choir events, sound checks, or rehearsals?',
            'How can your choir use music to reach out to unchurched teenagers in your community?'
        ],
        quizCategory: 'general'
    },
    'Financial Literacy for Teenagers': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Biblical Money Management</h3>
            <p>Managing money wisely through budgeting, saving, giving, and avoiding debt honors God and builds a foundation for future leadership.</p>
            <blockquote>"Dishonest money dwindles away, but whoever gathers money little by little makes it grow." -- Proverbs 13:11</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 20 — Financial Literacy for Teenagers</strong> introduces essential biblical principles of financial stewardship. TCVLMDP teaches teenagers how to budget allowances, practice tithing and generous giving, save for future education or instruments, and avoid impulsive spending, empowering them to manage money responsibly.</p>`,
        reflectionPrompts: [
            'What is your current approach to managing money, saving, or spending?',
            'Why is learning biblical stewardship as a teenager crucial for your future?',
            'What practical step will you take to create a personal monthly budget?'
        ],
        quizCategory: 'general'
    },
    'Self-Management': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Balancing Academics, Choir, and Life</h3>
            <p>Effective self-management means prioritizing commitments, managing time wisely, and maintaining balance between studies, ministry, and rest.</p>
            <blockquote>"Teach us to number our days, that we may gain a heart of wisdom." -- Psalm 90:12</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 21 — Self-Management</strong> equips teen vocalists to balance academic demands, choir rehearsals, family responsibilities, and rest. TCVLMDP offers practical time-blocking techniques and priority management tools, enabling students to excel in school while remaining dedicated to ministry without burnout.</p>`,
        reflectionPrompts: [
            'How do you currently balance schoolwork with choir rehearsals and personal life?',
            'What time-management tool can help you prevent last-minute stress?',
            'Why is rest and Sabbath rest important for maintaining long-term effectiveness?'
        ],
        quizCategory: 'character'
    },
    'Confidence Building': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Overcoming Stage Fright and Fear</h3>
            <p>Confidence comes from knowing your identity in Christ, thorough preparation, and trusting the Holy Spirit rather than focusing on self.</p>
            <blockquote>"For God has not given us a spirit of fear, but of power and of love and of a sound mind." -- 2 Timothy 1:7</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 22 — Confidence Building</strong> helps teenagers overcome performance anxiety, stage fright, and fear of judgment. TCVLMDP teaches visualization techniques, thorough preparation routines, and shifting focus from self-evaluation to God-exaltation, building unshakeable stage confidence.</p>`,
        reflectionPrompts: [
            'What triggers stage fright or nervousness for you when singing or speaking publicly?',
            'How can shifting your focus from "performance" to "ministry" alleviate fear?',
            'What truth from 2 Timothy 1:7 can you declare when feeling anxious?'
        ],
        quizCategory: 'general'
    },
    'Community Impact': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Using Music for Social Good</h3>
            <p>Music has unique power to heal, inspire, and unite. Taking vocal ministry into hospitals, nursing homes, and communities spreads hope.</p>
            <blockquote>"Let your light shine before others, that they may see your good deeds and glorify your Father in heaven." -- Matthew 5:16</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 23 — Community Impact</strong> mobilizes the choir to use their musical gifts for social outreach. TCVLMDP organizes community performances in senior homes, orphanages, and community centers, teaching students that praise music brings comfort, joy, and Christ's love to society.</p>`,
        reflectionPrompts: [
            'How can music serve as a bridge to share God\'s love with hurting people?',
            'What community location or group would benefit from a choir visit and performance?',
            'Describe how singing for others impacted your perspective on ministry.'
        ],
        quizCategory: 'leadership'
    },
    'Graduation and Commissioning': {
        youtube: 'https://www.youtube.com/watch?v=fLeJJPxua3E',
        notes: `
            <h3>Commissioned for Kingdom Service</h3>
            <p>Graduation marks your commissioning as an empowered vocalist, servant leader, and mentor ready to impact the world for Christ.</p>
            <blockquote>"Go into all the world and preach the gospel to all creation." -- Mark 16:15</blockquote>
        `,
        courseNote: `<p><strong>TCVLMDP Module 24 — Graduation and Commissioning</strong> marks the triumphant culmination of the Teen Choir Voice, Leadership & Mentorship Development Project. TCVLMDP honors the vocal growth, spiritual maturity, and leadership readiness of each graduate, commissioning them as music leaders and mentors in their churches and communities.</p>`,
        reflectionPrompts: [
            'Looking back across TCVLMDP, how has your voice and leadership transformed?',
            'What commitment will you make to continue stewarding your vocal gift for God?',
            'How will you pass on what you have learned to the next generation of teen vocalists?'
        ],
        quizCategory: 'choir'
    }
};

// Default content for topics not yet in the library
const DEFAULT_CONTENT = {
    notes: `
        <h3>Lesson Notes</h3>
        <p>Your mentor will provide detailed notes for this session. Check back after the session or ask your mentor to share the lesson materials.</p>
        <h3>Key Focus for This Session</h3>
        <ul>
            <li>Be present and engaged throughout the session</li>
            <li>Take notes of key points that stand out to you</li>
            <li>Ask questions when something is unclear</li>
            <li>Think about how to apply what you learn</li>
        </ul>
    `,
    reflectionPrompts: [
        'What was the most important thing you learned in this session?',
        'How will you apply what you learned this week?',
        'What question do you still have that you would like your mentor to answer?'
    ],
    quizCategory: 'general'
};

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', async function () {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session');
    const programSlug = params.get('program') || 'ctfs';

    await loadLessonPage(sessionId, programSlug);
});

async function loadLessonPage(sessionId, programSlug) {
    const client = await getSupabase();
    if (!client) return;

    const { data: { session } } = await client.auth.getSession();
    if (!session) { window.location.href = 'login.html'; return; }

    if (currentProfile) {
        const el = document.getElementById('userNameDisplay');
        if (el) el.textContent = currentProfile.full_name || 'Student';
        
        // Load profile picture in topbar
        if (typeof loadUserAvatar === 'function') {
            await loadUserAvatar(session.user.id, currentProfile.role);
        }
    }

    try {
        let targetSession = null;

        // If a specific session ID is provided, load it first to resolve its program correctly
        if (sessionId) {
            const { data: sessData } = await client
                .from('sessions')
                .select('*, programs(*)')
                .eq('id', sessionId)
                .maybeSingle();
            if (sessData) {
                targetSession = sessData;
                if (sessData.programs) {
                    currentProgram = sessData.programs;
                    programSlug = sessData.programs.slug;
                }
            }
        }

        // Populate all active programs into selector dropdown
        const { data: allPrograms } = await client
            .from('programs')
            .select('id, name, slug')
            .eq('is_active', true)
            .order('slug', { ascending: false });

        const progSelectEl = document.getElementById('programSelect');
        if (progSelectEl && allPrograms && allPrograms.length > 0) {
            progSelectEl.innerHTML = allPrograms.map(p =>
                `<option value="${p.slug}" ${(currentProgram?.slug || programSlug) === p.slug ? 'selected' : ''}>${p.name}</option>`
            ).join('');
        }

        // If currentProgram not yet resolved (e.g. switching via dropdown), fetch it by slug
        if (!currentProgram && programSlug) {
            const matched = (allPrograms || []).find(p => p.slug === programSlug);
            if (matched) {
                // We have name and slug, fetch full program row for the id
                const { data: fullProg } = await client
                    .from('programs')
                    .select('*')
                    .eq('slug', programSlug)
                    .maybeSingle();
                currentProgram = fullProg;
            }
        }

        document.getElementById('breadcrumbProgram').textContent = currentProgram?.name || (programSlug ? programSlug.toUpperCase() : 'PROGRAM');

        // Load all sessions for this program
        if (currentProgram?.id) {
            const { data: sessions } = await client
                .from('sessions')
                .select('*')
                .eq('program_id', currentProgram.id)
                .order('week_number', { ascending: true });

            allSessions = sessions || [];
        } else {
            allSessions = targetSession ? [targetSession] : [];
        }

        // Load student's completed sessions
        const { data: attended } = await client
            .from('attendance')
            .select('session_id, status')
            .eq('student_id', session.user.id);

        completedSessions = new Set(
            (attended || [])
                .filter(a => a.status === 'present')
                .map(a => a.session_id)
        );

        // Determine which session to show
        if (targetSession) {
            currentSessionIndex = allSessions.findIndex(s => s.id === targetSession.id);
            if (currentSessionIndex === -1) {
                allSessions.push(targetSession);
                currentSessionIndex = allSessions.length - 1;
            }
        } else if (allSessions.length > 0) {
            // Default to first incomplete session
            currentSessionIndex = allSessions.findIndex(s => !completedSessions.has(s.id));
            if (currentSessionIndex === -1) currentSessionIndex = 0;
            targetSession = allSessions[currentSessionIndex];
        }

        renderSessionList();
        updateProgress();

        if (targetSession) {
            await renderLesson(targetSession, session.user.id, client);
        } else {
            document.getElementById('lessonTitle').textContent = 'No sessions available yet';
        }

    } catch (e) {
        console.error('Lesson page error:', e);
    }
}

// ========================================
// RENDER LESSON
// ========================================

async function renderLesson(session, userId, client) {
    currentSession = session;

    // Update breadcrumb & title
    document.getElementById('breadcrumbSession').textContent = session.title || 'Session';
    document.getElementById('lessonTopbarTitle').textContent = '  ' + (session.title || 'Lesson');
    document.getElementById('lessonTitle').textContent = session.title || 'Session';
    document.getElementById('lessonProgram').textContent = currentProgram?.name || '';
    document.getElementById('lessonWeek').textContent = session.week_number ? 'Week ' + session.week_number : '';

    // Completion badge
    const badge = document.getElementById('completionBadge');
    if (completedSessions.has(session.id)) {
        badge.textContent = '  Completed';
        badge.className = 'badge success';
        badge.style.display = 'inline-block';
        document.getElementById('markCompleteBtn').textContent = '  Completed';
        document.getElementById('markCompleteBtn').disabled = true;
        document.getElementById('markCompleteBtn').className = 'btn btn-outline';
    } else {
        badge.style.display = 'none';
        document.getElementById('markCompleteBtn').textContent = '  Mark Complete';
        document.getElementById('markCompleteBtn').disabled = false;
        document.getElementById('markCompleteBtn').className = 'btn btn-success';
    }

    // Nav buttons
    document.getElementById('prevSessionBtn').style.display = currentSessionIndex > 0 ? 'block' : 'none';
    document.getElementById('nextSessionBtn').style.display = currentSessionIndex < allSessions.length - 1 ? 'block' : 'none';

    // Video
    renderVideo(session);

    // Get topic from title
    const topic = extractTopic(session.title);
    const content = LESSON_CONTENT[topic] || DEFAULT_CONTENT;

    // Notes
    const courseNoteHtml = content.courseNote ? `
        <div style="margin-top:2rem;padding:1.25rem;background:var(--background-alt, #F8FAFC);border-left:4px solid var(--primary);border-radius:var(--radius-md);box-shadow:var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05));">
            <h4 style="margin:0 0 0.5rem;color:var(--primary);display:flex;align-items:center;gap:0.5rem;">📘 Course Context Note (~100 words)</h4>
            ${content.courseNote}
        </div>` : '';
    document.getElementById('lessonNotes').innerHTML = content.notes + courseNoteHtml;

    // Reflection prompts
    const promptsEl = document.getElementById('reflectionPrompts');
    if (promptsEl && content.reflectionPrompts) {
        promptsEl.innerHTML = `
            <div style="background:var(--background);border-radius:var(--radius-md);padding:1rem;margin-bottom:1rem;">
                <p style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;">Reflection Prompts:</p>
                <ul style="padding-left:1.25rem;margin:0;">
                    ${content.reflectionPrompts.map(p => `<li style="font-size:0.875rem;color:var(--text-light);margin-bottom:0.25rem;">${p}</li>`).join('')}
                </ul>
            </div>`;
    }

    // Load saved reflection
    try {
        const { data: savedReflection } = await client
            .from('task_submissions')
            .select('content')
            .eq('student_id', userId)
            .eq('session_id', session.id)
            .eq('media_type', 'reflection')
            .maybeSingle();
        if (savedReflection?.content) {
            document.getElementById('reflectionText').value = savedReflection.content;
            document.getElementById('reflectionStatus').innerHTML =
                '<span style="color:var(--success);font-size:0.8rem;">  Reflection saved</span>';
        }
    } catch (e) { /* no saved reflection yet */ }

    // Load assignment for this session
    await loadSessionAssignment(session.id, userId, client);

    // Check attendance for this session
    try {
        const { data: att } = await client
            .from('attendance')
            .select('status')
            .eq('student_id', userId)
            .eq('session_id', session.id)
            .maybeSingle();
        if (att) {
            document.getElementById('attendanceStatus').textContent =
                att.status === 'present' ? '  Marked present' :
                att.status === 'excused' ? '   Marked excused' : att.status;
        }
    } catch (e) { /* not marked yet */ }

    // Highlight active in session list
    document.querySelectorAll('.session-list-item').forEach((el, i) => {
        el.classList.toggle('active', i === currentSessionIndex);
    });

    // Reset quiz
    document.getElementById('quizContainer').innerHTML = `
        <div style="text-align:center;padding:2rem;">
            <div style="font-size:3rem;margin-bottom:1rem;"> </div>
            <h3>Knowledge Check</h3>
            <p style="color:var(--text-muted);margin-bottom:1.5rem;">Test your understanding of this lesson.</p>
            <button class="btn btn-primary" onclick="startLessonQuiz()">Start Quiz</button>
        </div>`;

    // Switch back to notes tab
    switchTab('notes');
}

function extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    let str = String(urlOrId).trim();
    // Handle raw ID with query string like "HlDYalbyHu4?si=..."
    if (str.includes('?')) {
        const firstPart = str.split('?')[0];
        if (/^[\w-]{11}$/.test(firstPart)) return firstPart;
    }
    if (/^[\w-]{11}$/.test(str)) return str;
    const match = str.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|watch\?.*v=))([\w-]{11})/i);
    if (match && match[1]) return match[1];
    const fallback = str.match(/[\w-]{11}/);
    if (fallback && fallback[0]) return fallback[0];
    return str;
}

function renderVideo(session) {
    const wrap = document.getElementById('videoWrap');
    if (!wrap) return;

    const topic = extractTopic(session?.title || '');
    const content = LESSON_CONTENT[topic] || DEFAULT_CONTENT;
    let rawUrl = (session?.video_url || session?.youtube_id || content?.youtube || '').trim();

    if (!rawUrl) {
        // Fallback default YouTube lesson video
        rawUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    }

    const ytId = extractYouTubeId(rawUrl);
    let embedUrl = '';
    let isDirectVideo = false;

    if (ytId && /^[\w-]{11}$/.test(ytId)) {
        embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`;
    } else if (rawUrl.includes('vimeo.com')) {
        const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (vimeoMatch && vimeoMatch[1]) {
            embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }
    } else if (/\.(mp4|webm|ogg)$/i.test(rawUrl)) {
        isDirectVideo = true;
    } else {
        embedUrl = rawUrl;
    }

    if (isDirectVideo) {
        wrap.innerHTML = `<video controls style="width:100%;height:100%;min-height:360px;border-radius:var(--radius-lg);" src="${rawUrl}"></video>`;
    } else {
        wrap.innerHTML = `<iframe src="${embedUrl}" title="${session?.title || 'Lesson Video'}" style="width:100%;height:100%;min-height:360px;border:none;border-radius:var(--radius-lg);" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
    }
}

function extractTopic(title) {
    if (!title) return '';
    let parts = title.split('--');
    if (parts.length > 1) return parts[1].trim();
    parts = title.split(' - ');
    if (parts.length > 1) return parts[1].trim();
    parts = title.split(' — ');
    if (parts.length > 1) return parts[1].trim();
    return title.trim();
}

// ========================================
// ASSIGNMENT
// ========================================

async function loadSessionAssignment(sessionId, userId, client) {
    const container = document.getElementById('assignmentArea');
    try {
        const { data: assignments } = await client
            .from('tasks')
            .select('*')
            .eq('session_id', sessionId);

        if (!assignments || assignments.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:2rem;color:var(--text-muted);">
                    <div style="font-size:2.5rem;margin-bottom:0.75rem;"> </div>
                    <p>No assignment for this session yet.</p>
                    <p style="font-size:0.8rem;">Check back after the session or ask your mentor.</p>
                </div>`;
            return;
        }

        const assignment = assignments[0];
        currentAssignmentId = assignment.id;

        // Check submission status
        const { data: sub } = await client
            .from('task_submissions')
            .select('status, content')
            .eq('task_id', assignment.id)
            .eq('student_id', userId)
            .maybeSingle();

        const submitted = !!sub;
        const status = sub?.status || null;

        container.innerHTML = `
            <div style="background:var(--background);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1rem;">
                <h4 style="margin-bottom:0.5rem;">${assignment.title || 'Assignment'}</h4>
                <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:0;">${assignment.description || 'Complete and submit this assignment for your mentor to review.'}</p>
                ${assignment.type ? `<span class="badge info" style="margin-top:0.5rem;display:inline-block;">${assignment.type}</span>` : ''}
            </div>
            ${submitted ? `
                <div style="padding:1rem;background:${status === 'approved' ? '#ECFDF5' : status === 'rejected' ? '#FEF2F2' : '#FFFBEB'};border-radius:var(--radius-md);margin-bottom:1rem;border:1px solid ${status === 'approved' ? 'var(--success)' : status === 'rejected' ? 'var(--danger)' : 'var(--accent)'};">
                    <p style="margin:0;font-weight:600;color:${status === 'approved' ? 'var(--success)' : status === 'rejected' ? 'var(--danger)' : 'var(--accent)'};">
                        ${status === 'approved' ? '  Assignment Approved!' : status === 'rejected' ? '  Needs Revision -- please resubmit' : '  Submitted -- awaiting mentor review'}
                    </p>
                    ${sub.content ? `<p style="font-size:0.8rem;color:var(--text-muted);margin:0.25rem 0 0;">Your response: "${sub.content.substring(0, 100)}${sub.content.length > 100 ? ' ' : ''}"</p>` : ''}
                </div>
                ${status === 'rejected' ? `<button class="btn btn-primary" onclick="startAssignment('${assignment.id}')">Resubmit Assignment</button>` : ''}
            ` : `
                <button class="btn btn-primary btn-large" onclick="startAssignment('${assignment.id}')">  Submit Assignment</button>
            `}`;

    } catch (e) {
        container.innerHTML = `<div style="text-align:center;padding:1rem;color:var(--text-muted);">Could not load assignment.</div>`;
    }
}

// ========================================
// QUIZ
// ========================================

function startLessonQuiz() {
    const topic = extractTopic(currentSession?.title || '');
    const content = LESSON_CONTENT[topic] || DEFAULT_CONTENT;
    startQuiz(content.quizCategory || 'general', 'quizContainer');
}

// ========================================
// REFLECTION
// ========================================

async function saveReflection() {
    const text = document.getElementById('reflectionText')?.value?.trim();
    if (!text) { showSystemCard('Please write your reflection first.', 'error'); return; }

    const statusEl = document.getElementById('reflectionStatus');
    statusEl.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem;">Saving...</span>';

    try {
        const client = await getSupabase();
        if (!client) throw new Error('Not connected');
        const { data: { session } } = await client.auth.getSession();
        if (!session) throw new Error('Not logged in');

        const { error } = await client.from('task_submissions').upsert({
            student_id: session.user.id,
            task_id: currentAssignmentId || null,
            session_id: currentSession?.id || null,
            content: text,
            media_type: 'reflection',
            status: 'pending'
        }, { onConflict: 'student_id,session_id,media_type' });

        if (error) throw error;
        statusEl.innerHTML = '<span style="color:var(--success);font-size:0.8rem;">  Reflection saved!</span>';
        showSystemCard('Reflection saved!', 'success');
    } catch (e) {
        statusEl.innerHTML = '<span style="color:var(--danger);font-size:0.8rem;">  Error saving: ' + (e.message || 'Unknown error') + '</span>';
    }
}

// ========================================
// ATTENDANCE
// ========================================

async function markMyAttendance(status) {
    if (!currentSession) return;
    try {
        const client = await getSupabase();
        if (!client) throw new Error('Not connected');
        const { data: { session } } = await client.auth.getSession();
        if (!session) throw new Error('Not logged in');

        // Select existing attendance first to avoid RLS 403 on ON CONFLICT DO UPDATE
        const { data: existing } = await client
            .from('attendance')
            .select('id')
            .eq('student_id', session.user.id)
            .eq('session_id', currentSession.id)
            .maybeSingle();

        let attError = null;

        if (existing) {
            const { error } = await client
                .from('attendance')
                .update({
                    status,
                    recorded_by: session.user.id
                })
                .eq('id', existing.id);
            attError = error;
        } else {
            const { error } = await client
                .from('attendance')
                .insert({
                    student_id: session.user.id,
                    session_id: currentSession.id,
                    status,
                    recorded_by: session.user.id
                });
            attError = error;
        }

        if (attError) {
            // Fallback to upsert if needed
            const { error: upsertErr } = await client
                .from('attendance')
                .upsert({
                    student_id: session.user.id,
                    session_id: currentSession.id,
                    status,
                    recorded_by: session.user.id
                }, { onConflict: 'session_id,student_id' });
            if (upsertErr) throw upsertErr;
        }

        document.getElementById('attendanceStatus').textContent =
            status === 'present' ? '  Marked present' : '   Marked excused';
        showSystemCard('Attendance marked!', 'success');

        if (status === 'present') {
            completedSessions.add(currentSession.id);
            updateProgress();
            renderSessionList();
        }
    } catch (e) {
        showSystemCard('Error marking attendance: ' + (e.message || 'Unknown error'), 'error');
    }
}

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

// ========================================
// MARK COMPLETE
// ========================================

async function markLessonComplete() {
    if (!currentSession) return;
    await markMyAttendance('present');

    const badge = document.getElementById('completionBadge');
    badge.textContent = '  Completed';
    badge.className = 'badge success';
    badge.style.display = 'inline-block';

    document.getElementById('markCompleteBtn').textContent = '  Completed';
    document.getElementById('markCompleteBtn').disabled = true;
    document.getElementById('markCompleteBtn').className = 'btn btn-outline';

    showSystemCard('Lesson marked complete! Well done!  ', 'success');
    
    // Check for achievement unlocks after lesson completion
    if (typeof checkAndUnlockAchievements === 'function') {
        const client = await getSupabase();
        if (client) {
            const { data: { session } } = await client.auth.getSession();
            if (session) {
                await checkAndUnlockAchievements(session.user.id);
            }
        }
    }
}

// ========================================
// NAVIGATION
// ========================================

async function navigateSession(direction) {
    const newIndex = currentSessionIndex + direction;
    if (newIndex < 0 || newIndex >= allSessions.length) return;

    currentSessionIndex = newIndex;
    const session = allSessions[currentSessionIndex];

    const client = await getSupabase();
    if (!client) return;
    const { data: { session: authSession } } = await client.auth.getSession();
    if (!authSession) return;

    // Update URL without reload
    const params = new URLSearchParams(window.location.search);
    params.set('session', session.id);
    window.history.pushState({}, '', '?' + params.toString());

    await renderLesson(session, authSession.user.id, client);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// SESSION LIST
// ========================================

function renderSessionList() {
    const container = document.getElementById('sessionList');
    if (!container || !allSessions.length) return;

    container.innerHTML = allSessions.map((s, i) => {
        const isCompleted = completedSessions.has(s.id);
        const isActive = i === currentSessionIndex;
        return `
            <div class="session-list-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
                 onclick="jumpToSession(${i})">
                <div class="session-num ${isActive ? 'active' : isCompleted ? 'completed' : ''}">
                    ${isCompleted ? ' ' : i + 1}
                </div>
                <div class="session-info">
                    <h5>${s.title || 'Session ' + (i + 1)}</h5>
                    <p>${isCompleted ? 'Completed' : isActive ? 'Current' : 'Upcoming'}</p>
                </div>
            </div>`;
    }).join('');
}

async function jumpToSession(index) {
    if (index === currentSessionIndex) return;
    currentSessionIndex = index;
    const session = allSessions[index];

    const client = await getSupabase();
    if (!client) return;
    const { data: { session: authSession } } = await client.auth.getSession();
    if (!authSession) return;

    const params = new URLSearchParams(window.location.search);
    params.set('session', session.id);
    window.history.pushState({}, '', '?' + params.toString());

    await renderLesson(session, authSession.user.id, client);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// PROGRESS RING
// ========================================

function updateProgress() {
    const total = allSessions.length;
    const done = completedSessions.size;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    document.getElementById('progressPct').textContent = pct + '%';
    document.getElementById('progressSessions').textContent = done + ' of ' + total + ' sessions';

    // SVG ring -- circumference = 2 r = 2 *   * 27   169.6
    const ring = document.getElementById('progressRing');
    if (ring) {
        const offset = 169.6 - (169.6 * pct / 100);
        ring.style.strokeDashoffset = offset;
    }
}

// ========================================
// TABS
// ========================================

function switchTab(tab) {
    document.querySelectorAll('.lesson-tab').forEach((btn, i) => {
        const tabs = ['notes', 'assignment', 'quiz', 'reflection'];
        btn.classList.toggle('active', tabs[i] === tab);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === 'tab-' + tab);
    });
}

// ========================================
// LOAD VIDEO (manual trigger fallback)
// ========================================

function loadVideo() {
    const rawUrl = currentSession?.video_url || currentSession?.youtube_id || '';
    if (!rawUrl) {
        showSystemCard('No video available for this session yet.', 'info');
        return;
    }
    const ytId = extractYouTubeId(rawUrl);
    const embedUrl = ytId && /^[\w-]{11}$/.test(ytId)
        ? `https://www.youtube.com/embed/${ytId}?rel=0&autoplay=1&modestbranding=0&playsinline=1&cc_load_policy=1&fs=1`
        : rawUrl;

    document.getElementById('videoWrap').innerHTML = `
        <iframe src="${embedUrl}"
            title="Lesson Video" 
            allowfullscreen 
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
        </iframe>`;
}

// ========================================
// PROGRAM SWITCHER
// ========================================

async function onProgramChange(selectedSlug) {
    if (!selectedSlug) return;
    currentProgram = null;
    currentSession = null;
    allSessions = [];
    currentSessionIndex = 0;

    const params = new URLSearchParams(window.location.search);
    params.set('program', selectedSlug);
    params.delete('session');
    window.history.pushState({}, '', '?' + params.toString());

    await loadLessonPage(null, selectedSlug);
}
