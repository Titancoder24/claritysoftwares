"use client";

import React, { useState, useCallback } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Settings,
  Copy,
  CheckCircle2,
  Circle,
  Type,
  ListChecks,
  ArrowLeftRight,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QuestionType = "multiple_choice" | "true_false" | "short_text" | "matching";

interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  options: AnswerOption[];
  matchingPairs: MatchingPair[];
  correctAnswer: string;
  explanation: string;
  expanded: boolean;
}

interface QuizSettings {
  passThreshold: number;
  maxRetakes: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  timeLimitMinutes: number | null;
}

const QUESTION_TYPES: { type: QuestionType; icon: React.ElementType; label: string; description: string }[] = [
  { type: "multiple_choice", icon: ListChecks, label: "Multiple Choice", description: "Select one or more correct answers" },
  { type: "true_false", icon: ToggleLeft, label: "True / False", description: "Binary true or false answer" },
  { type: "short_text", icon: Type, label: "Short Text", description: "Free-form text response" },
  { type: "matching", icon: ArrowLeftRight, label: "Matching", description: "Match items from two columns" },
];

function createDefaultQuestion(type: QuestionType): Question {
  const base = {
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    text: "",
    points: 10,
    options: [],
    matchingPairs: [],
    correctAnswer: "",
    explanation: "",
    expanded: true,
  };

  switch (type) {
    case "multiple_choice":
      return {
        ...base,
        options: [
          { id: `opt-${Date.now()}-1`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-2`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-3`, text: "", isCorrect: false },
          { id: `opt-${Date.now()}-4`, text: "", isCorrect: false },
        ],
      };
    case "true_false":
      return {
        ...base,
        options: [
          { id: `opt-${Date.now()}-t`, text: "True", isCorrect: true },
          { id: `opt-${Date.now()}-f`, text: "False", isCorrect: false },
        ],
      };
    case "matching":
      return {
        ...base,
        matchingPairs: [
          { id: `mp-${Date.now()}-1`, left: "", right: "" },
          { id: `mp-${Date.now()}-2`, left: "", right: "" },
          { id: `mp-${Date.now()}-3`, left: "", right: "" },
        ],
      };
    default:
      return base;
  }
}

function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const typeConfig = QUESTION_TYPES.find((t) => t.type === question.type) ?? QUESTION_TYPES[0];
  const TypeIcon = typeConfig.icon;

  const toggleExpanded = () => onUpdate({ expanded: !question.expanded });

  const updateOption = (optionId: string, updates: Partial<AnswerOption>) => {
    onUpdate({
      options: question.options.map((o) => (o.id === optionId ? { ...o, ...updates } : o)),
    });
  };

  const toggleCorrect = (optionId: string) => {
    if (question.type === "true_false" || question.type === "multiple_choice") {
      onUpdate({
        options: question.options.map((o) => ({
          ...o,
          isCorrect: o.id === optionId ? !o.isCorrect : question.type === "true_false" ? false : o.isCorrect,
        })),
      });
    }
  };

  const addOption = () => {
    onUpdate({
      options: [
        ...question.options,
        { id: `opt-${Date.now()}`, text: "", isCorrect: false },
      ],
    });
  };

  const removeOption = (optionId: string) => {
    onUpdate({ options: question.options.filter((o) => o.id !== optionId) });
  };

  const updateMatchingPair = (pairId: string, updates: Partial<MatchingPair>) => {
    onUpdate({
      matchingPairs: question.matchingPairs.map((p) =>
        p.id === pairId ? { ...p, ...updates } : p
      ),
    });
  };

  const addMatchingPair = () => {
    onUpdate({
      matchingPairs: [
        ...question.matchingPairs,
        { id: `mp-${Date.now()}`, left: "", right: "" },
      ],
    });
  };

  const removeMatchingPair = (pairId: string) => {
    onUpdate({
      matchingPairs: question.matchingPairs.filter((p) => p.id !== pairId),
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card transition-all hover:border-slate-300">
      {/* Question Header */}
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3"
        onClick={toggleExpanded}
      >
        <button className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center text-slate-400 hover:text-slate-500">
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-zinc-400">
          {index + 1}
        </div>

        <div className="flex flex-1 items-center gap-2 min-w-0">
          <TypeIcon className="h-4 w-4 shrink-0 text-green-600" />
          <span className="truncate text-sm font-medium text-foreground">
            {question.text || "Untitled Question"}
          </span>
        </div>

        <Badge variant="outline" className="shrink-0 text-[10px]">
          {question.points} pts
        </Badge>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {typeConfig.label}
        </Badge>

        {question.expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
      </div>

      {/* Question Body */}
      {question.expanded && (
        <div className="border-t border-border px-4 py-4 space-y-4">
          {/* Question Type Selector */}
          <div className="flex gap-1.5">
            {QUESTION_TYPES.map(({ type, icon: QIcon, label }) => (
              <button
                key={type}
                onClick={() => {
                  const fresh = createDefaultQuestion(type);
                  onUpdate({
                    type,
                    options: fresh.options,
                    matchingPairs: fresh.matchingPairs,
                    correctAnswer: fresh.correctAnswer,
                  });
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  question.type === type
                    ? "bg-green-500/10 text-green-600 border border-green-500/20"
                    : "text-muted-foreground border border-transparent hover:bg-slate-100 hover:text-foreground"
                )}
              >
                <QIcon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Question Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Question
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-input bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
              rows={2}
              value={question.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Enter your question..."
            />
          </div>

          {/* Multiple Choice Options */}
          {question.type === "multiple_choice" && (
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Answer Options
              </label>
              {question.options.map((option, optIdx) => (
                <div key={option.id} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCorrect(option.id)}
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                      option.isCorrect
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-slate-100 text-slate-400 hover:text-slate-500"
                    )}
                  >
                    {option.isCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100/50 text-xs font-medium text-slate-400">
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <Input
                    className="flex-1"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, { text: e.target.value })}
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}...`}
                  />
                  {question.options.length > 2 && (
                    <button
                      onClick={() => removeOption(option.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-100/50 hover:text-slate-700"
              >
                <Plus className="h-3 w-3" />
                Add Option
              </button>
            </div>
          )}

          {/* True/False Options */}
          {question.type === "true_false" && (
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Correct Answer
              </label>
              <div className="flex gap-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleCorrect(option.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                      option.isCorrect
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-border bg-slate-50 text-muted-foreground hover:border-slate-300 hover:text-foreground"
                    )}
                  >
                    {option.isCorrect && <CheckCircle2 className="h-4 w-4" />}
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Short Text */}
          {question.type === "short_text" && (
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Expected Answer
              </label>
              <Input
                value={question.correctAnswer}
                onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                placeholder="Enter the correct answer..."
              />
              <p className="text-xs text-muted-foreground">
                Learner responses will be compared against this answer (case-insensitive).
              </p>
            </div>
          )}

          {/* Matching */}
          {question.type === "matching" && (
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Term
                </label>
                <div />
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Match
                </label>
                <div />
                {question.matchingPairs.map((pair) => (
                  <React.Fragment key={pair.id}>
                    <Input
                      value={pair.left}
                      onChange={(e) => updateMatchingPair(pair.id, { left: e.target.value })}
                      placeholder="Term..."
                    />
                    <ArrowLeftRight className="h-4 w-4 text-slate-400" />
                    <Input
                      value={pair.right}
                      onChange={(e) => updateMatchingPair(pair.id, { right: e.target.value })}
                      placeholder="Match..."
                    />
                    <button
                      onClick={() => removeMatchingPair(pair.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <button
                onClick={addMatchingPair}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-slate-100/50 hover:text-slate-700"
              >
                <Plus className="h-3 w-3" />
                Add Pair
              </button>
            </div>
          )}

          {/* Points & Explanation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Points
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={question.points}
                onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Explanation (optional)
              </label>
              <Input
                value={question.explanation}
                onChange={(e) => onUpdate({ explanation: e.target.value })}
                placeholder="Why is this correct..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <Button variant="ghost" size="sm" onClick={onDuplicate}>
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizSettingsPanel({
  settings,
  onUpdate,
}: {
  settings: QuizSettings;
  onUpdate: (updates: Partial<QuizSettings>) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Quiz Settings</h3>
      </div>

      <div className="space-y-5 p-4">
        {/* Pass Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Pass Threshold
            </label>
            <span className="text-sm font-semibold text-foreground">{settings.passThreshold}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={settings.passThreshold}
            onChange={(e) => onUpdate({ passThreshold: parseInt(e.target.value) })}
            className="w-full accent-green-500 h-1.5 rounded-full appearance-none bg-slate-100 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Max Retakes */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Maximum Retakes
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdate({ maxRetakes: Math.max(0, settings.maxRetakes - 1) })}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-slate-100 hover:text-foreground"
            >
              -
            </button>
            <div className="flex h-8 flex-1 items-center justify-center rounded-md bg-white text-sm font-medium text-foreground">
              {settings.maxRetakes === 0 ? "Unlimited" : settings.maxRetakes}
            </div>
            <button
              onClick={() => onUpdate({ maxRetakes: settings.maxRetakes + 1 })}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-slate-100 hover:text-foreground"
            >
              +
            </button>
          </div>
        </div>

        {/* Time Limit */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Time Limit (minutes)
          </label>
          <Input
            type="number"
            min={0}
            value={settings.timeLimitMinutes ?? ""}
            onChange={(e) =>
              onUpdate({
                timeLimitMinutes: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            placeholder="No limit"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            {
              label: "Shuffle Questions",
              value: settings.shuffleQuestions,
              key: "shuffleQuestions" as const,
            },
            {
              label: "Shuffle Options",
              value: settings.shuffleOptions,
              key: "shuffleOptions" as const,
            },
            {
              label: "Show Correct Answers",
              value: settings.showCorrectAnswers,
              key: "showCorrectAnswers" as const,
            },
          ].map(({ label, value, key }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <button
                onClick={() => onUpdate({ [key]: !value })}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {value ? (
                  <ToggleRight className="h-7 w-7 text-green-600" />
                ) : (
                  <ToggleLeft className="h-7 w-7" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface QuizBuilderProps {
  initialQuestions?: Question[];
  onChange?: (questions: Question[], settings: QuizSettings) => void;
}

export function QuizBuilder({ initialQuestions, onChange }: QuizBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>(
    initialQuestions ?? [
      createDefaultQuestion("multiple_choice"),
    ]
  );
  const [settings, setSettings] = useState<QuizSettings>({
    passThreshold: 70,
    maxRetakes: 3,
    shuffleQuestions: false,
    shuffleOptions: false,
    showCorrectAnswers: true,
    timeLimitMinutes: null,
  });
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const updateQuestions = useCallback(
    (newQuestions: Question[]) => {
      setQuestions(newQuestions);
      onChange?.(newQuestions, settings);
    },
    [settings, onChange]
  );

  const updateSettings = useCallback(
    (updates: Partial<QuizSettings>) => {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      onChange?.(questions, newSettings);
    },
    [questions, settings, onChange]
  );

  const addQuestion = (type: QuestionType) => {
    updateQuestions([...questions, createDefaultQuestion(type)]);
    setShowTypeSelector(false);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    updateQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const deleteQuestion = (questionId: string) => {
    updateQuestions(questions.filter((q) => q.id !== questionId));
  };

  const duplicateQuestion = (questionId: string) => {
    const original = questions.find((q) => q.id === questionId);
    if (!original) return;
    const duplicate: Question = {
      ...original,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      expanded: true,
    };
    const idx = questions.findIndex((q) => q.id === questionId);
    const newQuestions = [...questions];
    newQuestions.splice(idx + 1, 0, duplicate);
    updateQuestions(newQuestions);
  };

  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  return (
    <div className="flex gap-6">
      {/* Questions List */}
      <div className="flex-1 space-y-4">
        {/* Summary Bar */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-foreground">
                {questions.length} {questions.length === 1 ? "Question" : "Questions"}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {totalPoints} Total Points
            </span>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              Pass: {Math.ceil(totalPoints * (settings.passThreshold / 100))} pts
            </span>
          </div>
        </div>

        {/* Questions */}
        {questions.map((question, idx) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={idx}
            onUpdate={(updates) => updateQuestion(question.id, updates)}
            onDelete={() => deleteQuestion(question.id)}
            onDuplicate={() => duplicateQuestion(question.id)}
          />
        ))}

        {/* Add Question */}
        <div className="relative">
          <button
            onClick={() => setShowTypeSelector(!showTypeSelector)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm text-muted-foreground transition-colors hover:border-slate-400 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>

          {showTypeSelector && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTypeSelector(false)} />
              <div className="absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-white p-2 shadow-xl shadow-slate-200/50">
                {QUESTION_TYPES.map(({ type, icon: QIcon, label, description }) => (
                  <button
                    key={type}
                    onClick={() => addQuestion(type)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                      <QIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <div className="w-72 shrink-0">
        <QuizSettingsPanel settings={settings} onUpdate={updateSettings} />
      </div>
    </div>
  );
}

export default QuizBuilder;
