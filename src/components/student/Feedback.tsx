import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FeedbackRubric() {
  const [feedbackData, setFeedbackData] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
     const { data, error } = await supabase.rpc('get_reviews_with_mentor');

  if (error) {
    console.error('RPC error', error);
    return;
  }

  // data is an array of rows returned by the function
  const formatted = data.map((row: any) => ({
    id: row.review_id,
    title: row.assignment?.title,
    score: row.marks,
    mentor: row.mentor?.meta?.name || row.mentor?.email || null,
    why: row.rubric?.reason || "Feedback not provided",
    rubric: row.rubric?.criteria || [],
    grade: row.assignment?.grade || "-",
  }));

      setFeedbackData(formatted || []);
    };

    fetchFeedback();
  }, []);

  return (
    <div className="min-h-screen text-white p-6 space-y-6">
      <div className="text-xl font-semibold">Feedback & Rubric</div>
      <div className="text-sm text-gray-400 mb-4">
        Why this grade — mentor explanation and HOD verification
      </div>

      {feedbackData.map((item, i) => (
        <Card key={i} className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg font-semibold text-white">
              {item.title}
              <span className="bg-green-500 text-black font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {item.grade}
              </span>
            </CardTitle>
            <div className="text-sm text-gray-400 flex gap-2">
              <span>Score: {item.score}</span>
              <span>• Mentor: {item.mentor}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-semibold text-white">Why this grade</div>
              <div className="text-gray-300 text-sm">{item.why}</div>
            </div>

            <div>
              <div className="font-semibold text-white mb-1">Rubric</div>
              <div className="grid grid-cols-3 text-gray-400 text-sm font-semibold mb-1">
                <div>Criterion</div>
                <div>Score</div>
                <div>Comment</div>
              </div>
              {item.rubric.map((r, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 text-sm py-1 border-b border-gray-700"
                >
                  <div>{r.criterion}</div>
                  <div>{r.score}</div>
                  <div>{r.comment}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <Button>
                Request Clarification
              </Button>
              <Button >
                Resubmit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
