"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Video,
  FileText,
  BookOpen,
  HelpCircle,
  Link2,
  Trash2,
  MoreHorizontal,
  Pencil,
  Copy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type LessonType = "video" | "guide" | "article" | "quiz" | "link";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  expanded: boolean;
  lessons: Lesson[];
}

const LESSON_TYPES: { type: LessonType; icon: React.ElementType; label: string; color: string }[] = [
  { type: "video", icon: Video, label: "Video", color: "text-blue-400 bg-blue-500/10" },
  { type: "guide", icon: BookOpen, label: "Guide", color: "text-emerald-400 bg-emerald-500/10" },
  { type: "article", icon: FileText, label: "Article", color: "text-amber-400 bg-amber-500/10" },
  { type: "quiz", icon: HelpCircle, label: "Quiz", color: "text-violet-400 bg-violet-500/10" },
  { type: "link", icon: Link2, label: "Link", color: "text-cyan-400 bg-cyan-500/10" },
];

function getLessonTypeConfig(type: LessonType) {
  return LESSON_TYPES.find((t) => t.type === type) ?? LESSON_TYPES[0];
}

interface SortableLessonProps {
  lesson: Lesson;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}

function SortableLesson({ lesson, isSelected, onSelect, onDelete, onRename }: SortableLessonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(lesson.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = getLessonTypeConfig(lesson.type);
  const Icon = config.icon;

  const handleRename = () => {
    if (editTitle.trim()) {
      onRename(editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/lesson flex items-center gap-1.5 rounded-md pr-1 transition-all",
        isDragging && "opacity-50",
        isSelected && "bg-indigo-500/10"
      )}
    >
      <button
        className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center text-zinc-700 transition-colors hover:text-zinc-400"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </button>

      <button
        onClick={onSelect}
        className={cn(
          "flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all",
          isSelected
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <div className={cn("flex h-5 w-5 items-center justify-center rounded", config.color.split(" ")[1])}>
          <Icon className={cn("h-3 w-3", config.color.split(" ")[0])} />
        </div>
        {isEditing ? (
          <input
            className="flex-1 bg-transparent text-sm text-foreground outline-none"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") setIsEditing(false);
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate">{lesson.title}</span>
        )}
      </button>

      {lesson.duration && (
        <span className="shrink-0 text-[10px] text-zinc-600">{lesson.duration}</span>
      )}

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover/lesson:opacity-100">
        <button
          onClick={() => {
            setEditTitle(lesson.title);
            setIsEditing(true);
          }}
          className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"
        >
          <Pencil className="h-2.5 w-2.5" />
        </button>
        <button
          onClick={onDelete}
          className="flex h-5 w-5 items-center justify-center rounded text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
}

interface ModuleBlockProps {
  module: Module;
  moduleIndex: number;
  selectedLessonId: string | null;
  onSelectLesson: (id: string) => void;
  onToggle: () => void;
  onDelete: () => void;
  onAddLesson: (type: LessonType) => void;
  onDeleteLesson: (lessonId: string) => void;
  onRenameLesson: (lessonId: string, title: string) => void;
  onRenameModule: (title: string) => void;
  onReorderLessons: (oldIndex: number, newIndex: number) => void;
}

function ModuleBlock({
  module,
  moduleIndex,
  selectedLessonId,
  onSelectLesson,
  onToggle,
  onDelete,
  onAddLesson,
  onDeleteLesson,
  onRenameLesson,
  onRenameModule,
  onReorderLessons,
}: ModuleBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(module.title);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showModuleMenu, setShowModuleMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = module.lessons.findIndex((l) => l.id === active.id);
      const newIdx = module.lessons.findIndex((l) => l.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        onReorderLessons(oldIdx, newIdx);
      }
    }
  };

  const handleRename = () => {
    if (editTitle.trim()) {
      onRenameModule(editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="mb-2">
      {/* Module Header */}
      <div className="group flex items-center gap-1 px-1">
        <button className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center text-zinc-600 hover:text-zinc-400">
          <GripVertical className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={onToggle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-zinc-800"
        >
          {module.expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>

        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="shrink-0 text-xs font-medium text-zinc-500">
            {moduleIndex + 1}.
          </span>
          {isEditing ? (
            <input
              className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setIsEditing(false);
              }}
              autoFocus
            />
          ) : (
            <span
              className="truncate text-sm font-medium text-foreground cursor-pointer"
              onDoubleClick={() => {
                setEditTitle(module.title);
                setIsEditing(true);
              }}
            >
              {module.title}
            </span>
          )}
          <span className="shrink-0 text-[10px] text-zinc-600">
            {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        <div className="relative flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowModuleMenu(!showModuleMenu)}
              className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-800 hover:text-zinc-300"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            {showModuleMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowModuleMenu(false)} />
                <div className="absolute right-0 top-7 z-20 w-40 rounded-lg border border-border bg-zinc-900 p-1 shadow-xl">
                  <button
                    onClick={() => {
                      setEditTitle(module.title);
                      setIsEditing(true);
                      setShowModuleMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    <Pencil className="h-3 w-3" /> Rename
                  </button>
                  <button
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
                    onClick={() => setShowModuleMenu(false)}
                  >
                    <Copy className="h-3 w-3" /> Duplicate
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={() => {
                      onDelete();
                      setShowModuleMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>

          {showAddMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)} />
              <div className="absolute right-8 top-7 z-20 w-40 rounded-lg border border-border bg-zinc-900 p-1 shadow-xl">
                {LESSON_TYPES.map(({ type, icon: TypeIcon, label, color }) => (
                  <button
                    key={type}
                    onClick={() => {
                      onAddLesson(type);
                      setShowAddMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    <TypeIcon className={cn("h-3.5 w-3.5", color.split(" ")[0])} />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lessons */}
      {module.expanded && (
        <div className="ml-8 mt-0.5 space-y-0.5 border-l border-zinc-800 pl-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={module.lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {module.lessons.map((lesson) => (
                <SortableLesson
                  key={lesson.id}
                  lesson={lesson}
                  isSelected={selectedLessonId === lesson.id}
                  onSelect={() => onSelectLesson(lesson.id)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                  onRename={(title) => onRenameLesson(lesson.id, title)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            onClick={() => setShowAddMenu(true)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-zinc-800/50 hover:text-zinc-400"
          >
            <Plus className="h-3 w-3" />
            Add Lesson
          </button>
        </div>
      )}
    </div>
  );
}

export interface CourseBuilderProps {
  modules: Module[];
  onModulesChange: (modules: Module[]) => void;
  selectedLessonId: string | null;
  onSelectLesson: (id: string) => void;
}

export function CourseBuilder({
  modules,
  onModulesChange,
  selectedLessonId,
  onSelectLesson,
}: CourseBuilderProps) {
  const toggleModule = useCallback(
    (moduleId: string) => {
      onModulesChange(
        modules.map((m) => (m.id === moduleId ? { ...m, expanded: !m.expanded } : m))
      );
    },
    [modules, onModulesChange]
  );

  const deleteModule = useCallback(
    (moduleId: string) => {
      onModulesChange(modules.filter((m) => m.id !== moduleId));
    },
    [modules, onModulesChange]
  );

  const addLesson = useCallback(
    (moduleId: string, type: LessonType) => {
      const newLesson: Lesson = {
        id: `les-${Date.now()}`,
        title: `New ${getLessonTypeConfig(type).label}`,
        type,
        duration: "",
      };
      onModulesChange(
        modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson], expanded: true } : m
        )
      );
    },
    [modules, onModulesChange]
  );

  const deleteLesson = useCallback(
    (moduleId: string, lessonId: string) => {
      onModulesChange(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
    },
    [modules, onModulesChange]
  );

  const renameLesson = useCallback(
    (moduleId: string, lessonId: string, title: string) => {
      onModulesChange(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, title } : l)) }
            : m
        )
      );
    },
    [modules, onModulesChange]
  );

  const renameModule = useCallback(
    (moduleId: string, title: string) => {
      onModulesChange(modules.map((m) => (m.id === moduleId ? { ...m, title } : m)));
    },
    [modules, onModulesChange]
  );

  const reorderLessons = useCallback(
    (moduleId: string, oldIndex: number, newIndex: number) => {
      onModulesChange(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: arrayMove(m.lessons, oldIndex, newIndex) }
            : m
        )
      );
    },
    [modules, onModulesChange]
  );

  const addModule = useCallback(() => {
    const newModule: Module = {
      id: `mod-${Date.now()}`,
      title: "New Module",
      expanded: true,
      lessons: [],
    };
    onModulesChange([...modules, newModule]);
  }, [modules, onModulesChange]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Course Structure</h3>
        <span className="text-xs text-muted-foreground">
          {modules.length} modules, {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
        </span>
      </div>

      <div className="flex-1 overflow-auto py-2 px-1">
        {modules.map((module, idx) => (
          <ModuleBlock
            key={module.id}
            module={module}
            moduleIndex={idx}
            selectedLessonId={selectedLessonId}
            onSelectLesson={onSelectLesson}
            onToggle={() => toggleModule(module.id)}
            onDelete={() => deleteModule(module.id)}
            onAddLesson={(type) => addLesson(module.id, type)}
            onDeleteLesson={(lessonId) => deleteLesson(module.id, lessonId)}
            onRenameLesson={(lessonId, title) => renameLesson(module.id, lessonId, title)}
            onRenameModule={(title) => renameModule(module.id, title)}
            onReorderLessons={(oldIdx, newIdx) => reorderLessons(module.id, oldIdx, newIdx)}
          />
        ))}
      </div>

      <div className="border-t border-border p-3">
        <button
          onClick={addModule}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-700 py-2.5 text-sm text-muted-foreground transition-colors hover:border-zinc-500 hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Module
        </button>
      </div>
    </div>
  );
}

export default CourseBuilder;
