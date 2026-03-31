"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Question, Answer } from "@/types";
import { getAuth, getUserData, saveUserData } from "@/lib/storage";
import questionsData from "@/data/questions.json";
import demoQuestionIds from "@/data/demoQuestionIds.json";
import ProgressBar from "@/components/ProgressBar";
import AreaTabs from "@/components/AreaTabs";
import QuestionCard from "@/components/QuestionCard";

const allQuestions = questionsData as Question[];
const demoIds = new Set(demoQuestionIds as number[]);
const AREAS = ["환경", "사회", "거버넌스"];

function groupByTopic(qs: Question[]): Record<string, Question[]> {
  const groups: Record<string, Question[]> = {};
  qs.forEach((q) => {
    if (!groups[q.topic]) groups[q.topic] = [];
    groups[q.topic].push(q);
  });
  return groups;
}

export default function AssessmentPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeArea, setActiveArea] = useState("환경");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [saved, setSaved] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(allQuestions);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.replace("/");
      return;
    }
    const data = getUserData();
    if (data?.answers) {
      setAnswers(data.answers);
    }
    if (data?.mode === "demo") {
      setQuestions(allQuestions.filter((q) => demoIds.has(q.id)));
    }
    setAuthorized(true);
  }, [router]);

  const handleAnswerChange = useCallback((questionId: number, answer: Answer) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: answer };
      // Auto-save
      const data = getUserData();
      if (data) {
        data.answers = next;
        saveUserData(data);
      }
      return next;
    });
  }, []);

  const handleSave = () => {
    const data = getUserData();
    if (data) {
      data.answers = answers;
      saveUserData(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSubmit = () => {
    const data = getUserData();
    if (data) {
      data.answers = answers;
      saveUserData(data);
    }
    router.push("/confirm");
  };

  const handleAreaChange = (area: string) => {
    setActiveArea(area);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!authorized) return null;

  const filteredQuestions = questions.filter((q) => q.area === activeArea);
  const topicGroups = groupByTopic(filteredQuestions);

  const totalAnswered = questions.filter(
    (q) => answers[q.id]?.selected !== null && answers[q.id]?.selected !== undefined || answers[q.id]?.notApplicable
  ).length;

  const areaCounts: Record<string, { answered: number; total: number }> = {};
  AREAS.forEach((area) => {
    const areaQs = questions.filter((q) => q.area === area);
    const areaAnswered = areaQs.filter(
      (q) => (answers[q.id]?.selected !== null && answers[q.id]?.selected !== undefined) || answers[q.id]?.notApplicable
    ).length;
    areaCounts[area] = { answered: areaAnswered, total: areaQs.length };
  });

  const defaultAnswer: Answer = { selected: null, notApplicable: false, comment: "" };

  return (
    <div className="min-h-screen bg-slate-50" ref={topRef}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push("/guide")}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              가이드
            </button>
            <h1 className="text-lg font-bold text-gray-900">ESG 수준진단</h1>
            <div className="w-16" />
          </div>
          <ProgressBar answered={totalAnswered} total={questions.length} />
          <div className="mt-3">
            <AreaTabs
              areas={AREAS}
              activeArea={activeArea}
              onSelect={handleAreaChange}
              areaCounts={areaCounts}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {Object.entries(topicGroups).map(([topic, qs]) => (
          <div key={topic} className="mb-8">
            <h2 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span
                className={`w-1.5 h-6 rounded-full ${
                  activeArea === "환경" ? "bg-green-500" : activeArea === "사회" ? "bg-blue-500" : "bg-purple-500"
                }`}
              />
              {topic}
            </h2>
            <div className="space-y-4">
              {qs.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  answer={answers[q.id] || defaultAnswer}
                  onChange={(a) => handleAnswerChange(q.id, a)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            {saved ? "저장됨!" : "임시저장"}
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-md"
          >
            제출하기 &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
