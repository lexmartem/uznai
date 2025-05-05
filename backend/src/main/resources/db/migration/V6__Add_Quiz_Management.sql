-- Create question type enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE question_type AS ENUM (
        'MULTIPLE_CHOICE_SINGLE',
        'MULTIPLE_CHOICE_MULTIPLE',
        'TRUE_FALSE',
        'SHORT_ANSWER',
        'IMAGE',
        'CODE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create quizzes table if it doesn't exist
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator_id UUID NOT NULL REFERENCES users(id),
    version INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT unique_quiz_title_per_user UNIQUE (title, creator_id)
);

-- Create questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    order_index INTEGER NOT NULL,
    image_url VARCHAR(255),
    code_snippet TEXT,
    explanation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version INTEGER NOT NULL DEFAULT 1
);

-- Create answers table if it doesn't exist
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL,
    image_url VARCHAR(255),
    code_snippet TEXT,
    explanation TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version INTEGER NOT NULL DEFAULT 1
);

-- Create quiz collaborators table if it doesn't exist
CREATE TABLE IF NOT EXISTS quiz_collaborators (
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (quiz_id, user_id)
);

-- Create quiz changes table for history tracking if it doesn't exist
CREATE TABLE IF NOT EXISTS quiz_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    change_type VARCHAR(50) NOT NULL,
    change_data JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance if they don't exist
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
    CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
    CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_collaborators_quiz_id ON quiz_collaborators(quiz_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_collaborators_user_id ON quiz_collaborators(user_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_changes_quiz_id ON quiz_changes(quiz_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_changes_user_id ON quiz_changes(user_id);
END $$;

-- Add triggers for updated_at if they don't exist
DO $BLOCK$ BEGIN
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $FUNC$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $FUNC$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;
    CREATE TRIGGER update_quizzes_updated_at
        BEFORE UPDATE ON quizzes
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
    CREATE TRIGGER update_questions_updated_at
        BEFORE UPDATE ON questions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    DROP TRIGGER IF EXISTS update_answers_updated_at ON answers;
    CREATE TRIGGER update_answers_updated_at
        BEFORE UPDATE ON answers
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
END $BLOCK$; 