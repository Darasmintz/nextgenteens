-- ============================================================
-- NEXTGENTEENS — COMPLETE DATABASE SCHEMA (WORKING!)
-- FRESH INSTALL - PRODUCTION READY
-- 
-- HOW TO RUN:
--   1. Copy the ENTIRE file
--   2. Paste into Supabase SQL Editor
--   3. Click RUN
--   4. DONE! 
-- ============================================================

-- ============================================================
-- 1. CLEANUP - Remove everything first
-- ============================================================

-- Drop all tables in correct order
DROP TABLE IF EXISTS public.game_completions CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.sgi_scores CASCADE;
DROP TABLE IF EXISTS public.task_submissions CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.strikes CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.deactivation_requests CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.daily_practices CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.is_staff() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.platform_public_stats() CASCADE;

-- ============================================================
-- 2. EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 3. CREATE ALL TABLES (WITHOUT RLS YET)
-- ============================================================

-- PROFILES
CREATE TABLE public.profiles (
    id                      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name               text NOT NULL,
    email                   text UNIQUE NOT NULL,
    role                    text NOT NULL DEFAULT 'student'
                                CHECK (role IN ('student', 'mentor', 'admin')),
    age                     integer,
    avatar_url              text,
    bio                     text,
    suspended               boolean NOT NULL DEFAULT false,
    status                  text NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active', 'suspended', 'deactivation_requested', 'deactivated')),
    deactivation_requested  boolean NOT NULL DEFAULT false,
    created_at              timestamptz NOT NULL DEFAULT now(),
    updated_at              timestamptz NOT NULL DEFAULT now()
);

-- SYSTEM SETTINGS
CREATE TABLE public.system_settings (
    key         text PRIMARY KEY,
    value       jsonb NOT NULL,
    updated_at  timestamptz NOT NULL DEFAULT now(),
    updated_by  uuid REFERENCES public.profiles(id)
);

-- PROGRAMS
CREATE TABLE public.programs (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        text NOT NULL,
    slug        text UNIQUE NOT NULL,
    description text,
    is_active   boolean DEFAULT true,
    duration    text,
    created_at  timestamptz DEFAULT now()
);

-- SESSIONS
CREATE TABLE public.sessions (
    id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id    uuid REFERENCES public.programs(id) ON DELETE CASCADE,
    title         text NOT NULL,
    description   text,
    week_number   integer NOT NULL,
    video_url     text,
    materials_url text,
    created_at    timestamptz DEFAULT now()
);

-- TASKS
CREATE TABLE public.tasks (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  uuid REFERENCES public.sessions(id) ON DELETE CASCADE,
    title       text NOT NULL,
    description text,
    points      integer DEFAULT 10,
    due_date    timestamptz,
    created_at  timestamptz DEFAULT now()
);

-- TASK SUBMISSIONS
CREATE TABLE public.task_submissions (
    id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id      uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
    session_id   uuid REFERENCES public.sessions(id) ON DELETE CASCADE,
    student_id   uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    media_type   text,
    content      text,
    media_url    text,
    status       text NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'approved', 'rejected')),
    feedback     text,
    reviewed_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at  timestamptz,
    submitted_at timestamptz DEFAULT now(),
    UNIQUE(student_id, session_id, media_type)
);

-- DAILY PRACTICES
CREATE TABLE public.daily_practices (
    id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id     uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    practice_date  date NOT NULL DEFAULT CURRENT_DATE,
    bible_read     boolean DEFAULT false,
    prayed         boolean DEFAULT false,
    journal_notes  text,
    created_at     timestamptz DEFAULT now(),
    updated_at     timestamptz DEFAULT now(),
    UNIQUE(student_id, practice_date)
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title      text NOT NULL,
    message    text NOT NULL,
    type       text DEFAULT 'info',
    is_read    boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- ACTIVITIES
CREATE TABLE IF NOT EXISTS public.activities (
    id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    title            text NOT NULL,
    description      text,
    program          text,
    media_url        text,
    is_announcement  boolean DEFAULT false,
    created_at       timestamptz DEFAULT now()
);

-- DEACTIVATION REQUESTS
CREATE TABLE public.deactivation_requests (
    id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason        text,
    status        text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_at  timestamptz DEFAULT now(),
    processed_at  timestamptz,
    processed_by  uuid REFERENCES public.profiles(id)
);

-- ATTENDANCE
CREATE TABLE public.attendance (
    id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id   uuid REFERENCES public.sessions(id) ON DELETE CASCADE,
    student_id   uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    status       text NOT NULL DEFAULT 'present'
                     CHECK (status IN ('present', 'absent', 'excused')),
    recorded_by  uuid REFERENCES public.profiles(id),
    created_at   timestamptz DEFAULT now(),
    UNIQUE(session_id, student_id)
);

-- STRIKES
CREATE TABLE public.strikes (
    id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason     text NOT NULL,
    issued_by  uuid REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT now()
);

-- GAME COMPLETIONS
CREATE TABLE public.game_completions (
    id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id    text NOT NULL,
    score      integer DEFAULT 0,
    played_at  timestamptz DEFAULT now()
);

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        text UNIQUE NOT NULL,
    description text,
    icon        text,
    category    text,
    created_at  timestamptz DEFAULT now()
);

-- USER ACHIEVEMENTS
CREATE TABLE public.user_achievements (
    id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id     uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at      timestamptz DEFAULT now(),
    UNIQUE(student_id, achievement_id)
);

-- SGI SCORES
CREATE TABLE public.sgi_scores (
    id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score        numeric(5,2) NOT NULL DEFAULT 0,
    week_number  integer,
    session_id   uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
    recorded_by  uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. CREATE HELPER FUNCTIONS (ALL TABLES NOW EXIST!)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('mentor', 'admin')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

CREATE OR REPLACE FUNCTION public.platform_public_stats()
RETURNS TABLE(total_students bigint, total_mentors bigint, total_programs bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT
        (SELECT count(*) FROM public.profiles WHERE role = 'student'),
        (SELECT count(*) FROM public.profiles WHERE role = 'mentor'),
        (SELECT count(*) FROM public.programs WHERE is_active = true);
$$;

GRANT EXECUTE ON FUNCTION public.platform_public_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- GRANT TABLE & SCHEMA PERMISSIONS TO ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, age)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    NULLIF(new.raw_user_meta_data->>'age', '')::integer
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    age = EXCLUDED.age;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- AUTOMATIC SYNC: UPDATE AUTH.USERS METADATA WHEN PROFILE ROLE CHANGES
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', NEW.role)
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_role_updated ON public.profiles;
CREATE TRIGGER on_profile_role_updated
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_role_to_auth();

-- AUTOMATIC SYNC: UPDATE PUBLIC.PROFILES.ROLE WHEN AUTH.USERS METADATA IS EDITED IN SUPABASE AUTH UI
CREATE OR REPLACE FUNCTION public.sync_auth_user_role_to_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF (NEW.raw_user_meta_data->>'role') IS DISTINCT FROM (OLD.raw_user_meta_data->>'role')
     AND NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    UPDATE public.profiles
    SET role = NEW.raw_user_meta_data->>'role'
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_auth_user_role_to_profile();

-- ============================================================
-- 5. ADD RLS TO ALL TABLES (FUNCTIONS NOW EXIST!)
-- ============================================================

-- PROFILES RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR public.is_staff());

CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE
    USING      (id = auth.uid() OR public.is_admin())
    WITH CHECK (id = auth.uid() OR public.is_admin());

-- SYSTEM SETTINGS RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_all" ON public.system_settings
    FOR SELECT USING (true);

CREATE POLICY "settings_insert_admin" ON public.system_settings
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

CREATE POLICY "settings_update_admin" ON public.system_settings
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

CREATE POLICY "settings_delete_admin" ON public.system_settings
    FOR DELETE USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

-- PROGRAMS RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programs_select_all" ON public.programs
    FOR SELECT USING (true);

CREATE POLICY "programs_admin_modify" ON public.programs
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

-- SESSIONS RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_select_all" ON public.sessions
    FOR SELECT USING (true);

CREATE POLICY "sessions_staff_modify" ON public.sessions
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

-- TASKS RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select_all" ON public.tasks
    FOR SELECT USING (true);

CREATE POLICY "tasks_staff_modify" ON public.tasks
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

-- TASK SUBMISSIONS RLS
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "submissions_select_own_or_staff" ON public.task_submissions
    FOR SELECT USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "submissions_insert_own" ON public.task_submissions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "submissions_update_staff_or_own" ON public.task_submissions
    FOR UPDATE USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "submissions_update_staff" ON public.task_submissions
    FOR UPDATE
    USING      (public.is_staff())
    WITH CHECK (public.is_staff());

-- DAILY PRACTICES RLS
ALTER TABLE public.daily_practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_select_own_or_staff" ON public.daily_practices
    FOR SELECT USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "daily_insert_own" ON public.daily_practices
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "daily_update_own" ON public.daily_practices
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "daily_practices_own_or_staff" ON public.daily_practices
    FOR ALL
    USING      (student_id = auth.uid() OR public.is_staff())
    WITH CHECK (student_id = auth.uid() OR public.is_staff());

-- NOTIFICATIONS RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notif_select_own" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notif_update_own" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notif_insert_staff" ON public.notifications
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
        OR auth.uid() = user_id
    );

-- DEACTIVATION REQUESTS RLS
ALTER TABLE public.deactivation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deact_select_own_or_admin" ON public.deactivation_requests
    FOR SELECT USING (
        auth.uid() = user_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

CREATE POLICY "deact_insert_own" ON public.deactivation_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "deact_update_admin" ON public.deactivation_requests
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

-- ATTENDANCE RLS
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_select_own_or_staff" ON public.attendance
    FOR SELECT USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "attendance_insert_own" ON public.attendance
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "attendance_insert_staff" ON public.attendance
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "attendance_update_own" ON public.attendance
    FOR UPDATE USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "attendance_update_staff" ON public.attendance
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "attendance_select_staff" ON public.attendance
    FOR SELECT USING (student_id = auth.uid() OR public.is_staff());

-- STRIKES RLS
ALTER TABLE public.strikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "strikes_select_own_or_staff" ON public.strikes
    FOR SELECT USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "strikes_insert_staff" ON public.strikes
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "strikes_select_staff" ON public.strikes
    FOR SELECT USING (student_id = auth.uid() OR public.is_staff());

-- GAME COMPLETIONS RLS
ALTER TABLE public.game_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "game_select_own_or_staff" ON public.game_completions
    FOR SELECT USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "game_insert_own" ON public.game_completions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ACHIEVEMENTS RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "achievements_select_all" ON public.achievements
    FOR SELECT USING (true);

-- USER ACHIEVEMENTS RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ua_select_own_or_staff" ON public.user_achievements
    FOR SELECT USING (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

CREATE POLICY "ua_insert_staff" ON public.user_achievements
    FOR INSERT WITH CHECK (
        auth.uid() = student_id
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('mentor', 'admin'))
    );

-- SGI SCORES RLS
ALTER TABLE public.sgi_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sgi_scores_select_all" ON public.sgi_scores
    FOR SELECT USING (true);

CREATE POLICY "sgi_scores_insert_staff" ON public.sgi_scores
    FOR INSERT WITH CHECK (public.is_staff());

CREATE POLICY "sgi_scores_update_staff" ON public.sgi_scores
    FOR UPDATE USING (public.is_staff());

-- ============================================================
-- 6. STORAGE BUCKET
-- ============================================================

DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'student-submissions',
        'student-submissions',
        true,
        52428800,
        ARRAY[
            'audio/mpeg','audio/mp4','audio/wav','audio/x-wav','audio/webm',
            'image/jpeg','image/png','image/webp',
            'video/mp4','video/webm','video/quicktime'
        ]
    )
    ON CONFLICT (id) DO UPDATE
        SET public = true,
            file_size_limit = 52428800;
EXCEPTION WHEN others THEN
    RAISE WARNING 'Storage bucket setup skipped: %', SQLERRM;
END;
$$;

DO $$
BEGIN
    -- Enable RLS on storage.objects if not already enabled
    BEGIN
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'RLS already enabled or permission denied: %', SQLERRM;
    END;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "submission_files_insert_own" ON storage.objects;
    DROP POLICY IF EXISTS "submission_files_select" ON storage.objects;
    DROP POLICY IF EXISTS "submission_files_update_own" ON storage.objects;
    DROP POLICY IF EXISTS "submission_files_delete_own" ON storage.objects;

    -- Create new policies
    CREATE POLICY "submission_files_insert_own"
        ON storage.objects FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'student-submissions');

    CREATE POLICY "submission_files_select"
        ON storage.objects FOR SELECT TO authenticated
        USING (bucket_id = 'student-submissions');

    CREATE POLICY "submission_files_update_own"
        ON storage.objects FOR UPDATE TO authenticated
        USING (bucket_id = 'student-submissions' AND owner = auth.uid())
        WITH CHECK (bucket_id = 'student-submissions');

    CREATE POLICY "submission_files_delete_own"
        ON storage.objects FOR DELETE TO authenticated
        USING (bucket_id = 'student-submissions' AND owner = auth.uid());

EXCEPTION WHEN others THEN
    RAISE WARNING 'Storage policy setup skipped for student-submissions: %', SQLERRM;
END;
$$;

-- ============================================================
-- 7. SEED DATA
-- ============================================================

-- Programs
INSERT INTO public.programs (name, slug, description, is_active, duration)
VALUES
    ('CTFS', 'ctfs', 'Christian Teenage Fellowship Session — 12 weeks of spiritual growth, leadership, and character development.', true, '12 Weeks'),
    ('TCVLMDP', 'tcvlmdp', 'Teen Choir Voice, Leadership & Mentorship Development Project — voice training, leadership, and spiritual formation.', true, 'Ongoing')
ON CONFLICT (slug) DO NOTHING;

-- System Settings
INSERT INTO public.system_settings (key, value)
VALUES
    ('strike_thresholds', '{"warning": 2, "suspension": 3}'::jsonb),
    ('platform_announcement', '{"enabled": false, "message": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Achievements
INSERT INTO public.achievements (name, description, icon, category)
VALUES
    ('Perfect Attendance', 'Attended every session without a single miss.', '🎯', 'attendance'),
    ('Consistency Champion', 'Submitted assignments on time for 4 consecutive weeks.', '🔥', 'consistency'),
    ('Leadership Star', 'Demonstrated outstanding leadership in program activities.', '⭐', 'leadership'),
    ('Voice Master', 'Completed all voice training modules with excellence.', '🎤', 'voice'),
    ('Scripture Champion', 'Memorised and recited 10+ memory verses.', '📖', 'spiritual'),
    ('Prayer Warrior', 'Completed 30 consecutive days of prayer journal entries.', '🙏', 'spiritual'),
    ('Kingdom Builder', 'Made a measurable positive impact in the community.', '👑', 'leadership'),
    ('CTFS Graduate', 'Successfully completed the full 12-week CTFS program.', '🎓', 'graduate'),
    ('Mentorship Excellence', 'Guided and supported 3+ younger students effectively.', '🤝', 'mentorship'),
    ('Growth Mindset', 'Showed consistent improvement in SGI score over 4 weeks.', '📈', 'consistency')
ON CONFLICT (name) DO NOTHING;

-- Seed CTFS Sessions (24 sessions — 12 weeks × 2)
DO $$
DECLARE
    ctfs_id uuid;
    topics text[] := ARRAY[
        'Foundation', 'God', 'Life', 'Maturity', 'Growth', 'Personal Development',
        'Love', 'Mindset', 'Leadership', 'Self Development', 'Faith', 'Communication',
        'Relationships', 'Character Formation', 'Purpose and Identity', 'Discipline and Habits',
        'Integrity and Character', 'Spiritual Life', 'Prayer', 'Kingdom Impact',
        'Servant Leadership', 'Vision and Goals', 'Review and Consolidation', 'Graduation Celebration'
    ];
    session_days text[] := ARRAY[
        'Saturday','Sunday','Saturday','Sunday','Saturday','Sunday',
        'Saturday','Sunday','Saturday','Sunday','Saturday','Sunday',
        'Saturday','Sunday','Saturday','Sunday','Saturday','Sunday',
        'Saturday','Sunday','Saturday','Sunday','Saturday','Sunday'
    ];
    i int;
    week_num int;
BEGIN
    SELECT id INTO ctfs_id FROM public.programs WHERE slug = 'ctfs' LIMIT 1;
    IF ctfs_id IS NULL THEN
        RAISE NOTICE 'CTFS program not found — skipping session seed';
        RETURN;
    END IF;

    FOR i IN 1..24 LOOP
        week_num := CEIL(i::float / 2);
        INSERT INTO public.sessions (program_id, title, week_number, created_at)
        VALUES (
            ctfs_id,
            'Week ' || week_num || ' (' || session_days[i] || ') - ' || topics[i],
            week_num,
            now()
        );
    END LOOP;
END $$;

-- Seed TCVLMDP Sessions (24 voice-training modules)
DO $$
DECLARE
    choir_id uuid;
    modules text[] := ARRAY[
        'Introduction to Voice Training', 'Breathing Techniques',
        'Posture and Stance', 'Pitch and Tone Development',
        'Harmony Fundamentals', 'Voice Care and Maintenance',
        'Vocal Expression', 'Worship Leading Basics',
        'Leadership in Ministry', 'Teamwork and Communication',
        'Accountability and Responsibility', 'Servant Leadership',
        'Goal Setting and Personal Growth', 'Character Building',
        'Talent Discovery', 'Mentorship Principles',
        'Spiritual Formation', 'Prayer in Ministry',
        'Ministry Development', 'Financial Literacy for Teenagers',
        'Self-Management', 'Confidence Building',
        'Community Impact', 'Graduation and Commissioning'
    ];
    i int;
BEGIN
    SELECT id INTO choir_id FROM public.programs WHERE slug IN ('tcvlmdp', 'choir') LIMIT 1;
    IF choir_id IS NULL THEN
        RAISE NOTICE 'TCVLMDP program not found — skipping session seed';
        RETURN;
    END IF;

    FOR i IN 1..24 LOOP
        INSERT INTO public.sessions (program_id, title, week_number, created_at)
        VALUES (
            choir_id,
            'Module ' || i || ' - ' || modules[i],
            i,
            now()
        );
    END LOOP;
END $$;

-- ============================================================
-- 8. STORAGE BUCKET FOR PROFILE PICTURES
-- ============================================================

-- Create storage bucket for profile pictures
-- Note: This requires the storage extension to be enabled in Supabase
-- Run this in Supabase SQL editor or via API if bucket creation fails

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-pictures', 'profile-pictures', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- RLS for storage bucket
DO $$
BEGIN
    -- Enable RLS on storage.objects if not already enabled
    BEGIN
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN others THEN
        RAISE NOTICE 'RLS already enabled or permission denied: %', SQLERRM;
    END;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload their own profile picture" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own profile picture" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own profile picture" ON storage.objects;

    -- Create new policies
    CREATE POLICY "Anyone can view profile pictures"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'profile-pictures');

    CREATE POLICY "Authenticated users can upload their own profile picture"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = 'profile-pictures' AND 
            auth.uid()::text = (storage.foldername(name))[1]
        );

    CREATE POLICY "Users can update their own profile picture"
        ON storage.objects FOR UPDATE
        WITH CHECK (
            bucket_id = 'profile-pictures' AND 
            auth.uid()::text = (storage.foldername(name))[1]
        );

    CREATE POLICY "Users can delete their own profile picture"
        ON storage.objects FOR DELETE
        USING (
            bucket_id = 'profile-pictures' AND 
            auth.uid()::text = (storage.foldername(name))[1]
        );

EXCEPTION WHEN others THEN
    RAISE WARNING 'Storage policy setup skipped for profile-pictures: %', SQLERRM;
END;
$$;

-- ============================================================
-- 9. COMMENTS AND REACTIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL, -- 'announcement', 'session', 'achievement'
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For nested replies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL, -- 'like', 'love', 'celebrate', 'support'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- RLS Policies for Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
CREATE POLICY "Anyone can view comments"
    ON public.comments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.comments;
CREATE POLICY "Authenticated users can insert comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for Reactions
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reactions" ON public.reactions;
CREATE POLICY "Anyone can view reactions"
    ON public.reactions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reactions" ON public.reactions;
CREATE POLICY "Authenticated users can insert reactions"
    ON public.reactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reactions" ON public.reactions;
CREATE POLICY "Users can update their own reactions"
    ON public.reactions FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reactions" ON public.reactions;
CREATE POLICY "Users can delete their own reactions"
    ON public.reactions FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- 9. VERIFICATION
-- ============================================================

SELECT '✅ DATABASE SETUP COMPLETE!' AS status;

SELECT '📊 Tables Created:' AS " ";
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

SELECT '📈 Data Counts:' AS " ";
SELECT p.name AS program, COUNT(s.id) AS sessions
FROM public.programs p
LEFT JOIN public.sessions s ON s.program_id = p.id
GROUP BY p.name
ORDER BY p.name;

SELECT '🏆 Achievements: ' || COUNT(*) AS total FROM public.achievements;
SELECT '⚙️ Settings: ' || COUNT(*) AS total FROM public.system_settings;

SELECT '🎉 Everything is ready! Your NextGenTeens platform is fully deployed.' AS final_message;
