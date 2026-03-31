"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Question, Answer, Perspective } from "@/types";
import { calculatePerspectiveScores, calculateOverallScore } from "@/lib/scoring";
import { getInsight } from "@/lib/insights";
import questionsData from "@/data/questions.json";
import perspectivesData from "@/data/perspectives.json";
import dynamic from "next/dynamic";

const RadarChart = dynamic(() => import("@/components/RadarChart"), { ssr: false });

const questions = questionsData as Question[];
const perspectives = perspectivesData as Perspective[];

const SCORE_COLORS: Record<string, string> = {
  product: "bg-green-500",
  process: "bg-blue-500",
  organization: "bg-amber-500",
  supplychain: "bg-purple-500",
  community: "bg-rose-500",
};

// 시드 기반 난수 생성 (항상 동일한 결과)
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateSampleAnswers(qs: Question[]): Record<number, Answer> {
  const answers: Record<number, Answer> = {};
  qs.forEach((q) => {
    const rand = seededRandom(q.id * 7 + 42);

    // 대부분 긍정적 응답 (70~85% 수준의 결과가 나오도록)
    let selected: string;
    if (q.options.length === 2) {
      // 2지선다: 75% 확률로 긍정
      if (q.reverseScoring) {
        selected = rand < 0.75 ? "가" : "나";
      } else {
        selected = rand < 0.75 ? "나" : "가";
      }
    } else {
      // 3지선다: 30% 다, 45% 나, 25% 가
      if (rand < 0.30) {
        selected = "다";
      } else if (rand < 0.75) {
        selected = "나";
      } else {
        selected = "가";
      }
    }

    answers[q.id] = {
      selected,
      notApplicable: false,
      comment: "",
    };
  });
  return answers;
}

export default function SampleResultPage() {
  const router = useRouter();

  const { scores, overall } = useMemo(() => {
    const sampleAnswers = generateSampleAnswers(questions);
    const ps = calculatePerspectiveScores(questions, perspectives, sampleAnswers);
    return { scores: ps, overall: calculateOverallScore(ps) };
  }, []);

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">ESG 수준진단 결과</h1>
              <p className="text-sm text-gray-500">진단일: {today}</p>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full">
              샘플 결과
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            * 이 결과는 임의 응답 기반의 샘플 데이터입니다. 실제 진단 결과와 다를 수 있습니다.
          </p>
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
            onClick={() => router.push("/guide")}
            className="px-8 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
