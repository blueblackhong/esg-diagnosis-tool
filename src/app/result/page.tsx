"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Question, Perspective, PerspectiveScore } from "@/types";
import { getAuth, getUserData, clearUserData, clearAuth } from "@/lib/storage";
import { calculatePerspectiveScores, calculateOverallScore } from "@/lib/scoring";
import { getInsight } from "@/lib/insights";
import questionsData from "@/data/questions.json";
import perspectivesData from "@/data/perspectives.json";
import demoPerspectivesData from "@/data/demoPerspectives.json";
import dynamic from "next/dynamic";
import Header from "@/components/Header";

const RadarChart = dynamic(() => import("@/components/RadarChart"), { ssr: false });

const allQuestions = questionsData as Question[];
const fullPerspectives = perspectivesData as Perspective[];
const demoPerspectives = demoPerspectivesData as Perspective[];

const SCORE_COLORS: Record<string, string> = {
  product: "bg-green-500",
  process: "bg-blue-500",
  organization: "bg-amber-500",
  supplychain: "bg-purple-500",
  community: "bg-rose-500",
};

export default function ResultPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [scores, setScores] = useState<PerspectiveScore[]>([]);
  const [overall, setOverall] = useState(0);
  const [submittedAt, setSubmittedAt] = useState("");

  useEffect(() => {
    const auth = getAuth();
    if (!auth) {
      router.replace("/");
      return;
    }
    const data = getUserData();
    if (!data) {
      router.replace("/");
      return;
    }

    const perspectives = data.mode === "demo" ? demoPerspectives : fullPerspectives;
    const ps = calculatePerspectiveScores(allQuestions, perspectives, data.answers);
    setScores(ps);
    setOverall(calculateOverallScore(ps));
    setSubmittedAt(
      data.submittedAt
        ? new Date(data.submittedAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : new Date().toLocaleDateString("ko-KR")
    );
    setAuthorized(true);
  }, [router]);

  const handleReset = () => {
    clearUserData();
    clearAuth();
    router.push("/");
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-50 px-4">
      <Header />
      <div className="max-w-4xl mx-auto pb-10">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ESG 수준진단 결과</h1>
          <p className="text-sm text-gray-500">진단일: {submittedAt}</p>
        </div>

        {/* Chart + Overall */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">관점별 분석</h2>
            <RadarChart scores={scores} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">종합 점수</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${overall * 3.14} ${314 - overall * 3.14}`}
                    strokeDashoffset="78.5"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{overall}점</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {scores.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${SCORE_COLORS[s.id]}`} />
                  <span className="text-sm text-gray-700 flex-1">{s.label}</span>
                  <span className="text-sm font-bold text-gray-900">{s.score}점</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">관점별 시사점</h2>
          <div className="space-y-6">
            {scores.map((s) => (
              <div key={s.id} className="border-l-4 border-emerald-500 pl-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-3 h-3 rounded-full ${SCORE_COLORS[s.id]}`} />
                  <h3 className="font-semibold text-gray-800">{s.label}</h3>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                    s.score >= 90 ? "bg-emerald-100 text-emerald-700" :
                    s.score >= 70 ? "bg-blue-100 text-blue-700" :
                    s.score >= 50 ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {s.score}점
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{getInsight(s)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            처음으로
          </button>
        </div>
      </div>
    </div>
  );
}
