"use client";

import { useState } from "react";
import { Question, Answer } from "@/types";

const PDCA_COLORS: Record<string, string> = {
  P: "bg-blue-100 text-blue-700",
  D: "bg-green-100 text-green-700",
  C: "bg-orange-100 text-orange-700",
  A: "bg-red-100 text-red-700",
};

interface QuestionCardProps {
  question: Question;
  answer: Answer;
  onChange: (answer: Answer) => void;
}

export default function QuestionCard({ question, answer, onChange }: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (option: string) => {
    const key = option.charAt(0); // "가", "나", "다"
    onChange({ ...answer, selected: key, notApplicable: false });
  };

  const handleNotApplicable = () => {
    const newNA = !answer.notApplicable;
    onChange({
      ...answer,
      notApplicable: newNA,
      selected: newNA ? null : answer.selected,
    });
  };

  const handleComment = (comment: string) => {
    onChange({ ...answer, comment });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-sm font-bold text-gray-400 mt-0.5">Q{question.id}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${PDCA_COLORS[question.pdca]}`}>
          {question.pdca}
        </span>
        <p className="text-gray-800 font-medium flex-1 leading-relaxed">{question.question}</p>
      </div>

      <div className="ml-12 space-y-4">
        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option) => {
            const key = option.charAt(0);
            const isSelected = answer.selected === key && !answer.notApplicable;
            return (
              <label
                key={key}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition border ${
                  answer.notApplicable
                    ? "opacity-40 cursor-not-allowed border-gray-100 bg-gray-50"
                    : isSelected
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-gray-100 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={isSelected}
                  disabled={answer.notApplicable}
                  onChange={() => handleSelect(option)}
                  className="w-4 h-4 text-emerald-600 accent-emerald-600"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            );
          })}
        </div>

        {/* Not Applicable */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={answer.notApplicable}
            onChange={handleNotApplicable}
            className="w-4 h-4 accent-gray-500 rounded"
          />
          <span className="text-sm text-gray-500">해당없음</span>
        </label>

        {/* Comment */}
        <textarea
          value={answer.comment}
          onChange={(e) => handleComment(e.target.value)}
          placeholder="기업 현황 및 비고를 입력하세요 (선택사항)"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          rows={2}
        />

        {/* Explanation */}
        {question.explanation && (
          <div>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showExplanation ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              참고자료
            </button>
            {showExplanation && (
              <div className="mt-2 p-3 bg-emerald-50 rounded-lg text-sm text-gray-600 leading-relaxed">
                {question.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
