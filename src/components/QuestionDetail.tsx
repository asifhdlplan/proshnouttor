import { useState } from 'react';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { MOCK_QUESTIONS } from '../lib/mockData';
import { useAuthStore } from '../lib/authStore';
import { useVoteStore } from '../lib/voteStore';
import type { Answer, Question } from '../lib/types';
import toast from 'react-hot-toast';

interface QuestionDetailProps {
  questionId: string;
  onBack: () => void;
}

export default function QuestionDetail({ questionId, onBack }: QuestionDetailProps) {
  const { getVote, castVote } = useVoteStore();
  const [question, setQuestion] = useState<Question | null>(() =>
    MOCK_QUESTIONS.find((q) => q.id === questionId) || null
  );
  const [newAnswer, setNewAnswer] = useState('');
  const { user } = useAuthStore();

  const handleQuestionVote = (voteType: 1 | -1) => {
    if (!question) return;
    if (!user) {
      toast.error('Please log in to vote.');
      return;
    }

    const { delta, newVote } = castVote(user.id, question.id, voteType);

    if (delta !== 0) {
      setQuestion((prev) => (prev ? { ...prev, votes: prev.votes + delta } : null));
      
      const mockQ = MOCK_QUESTIONS.find((q) => q.id === question.id);
      if (mockQ) mockQ.votes += delta;

      if (newVote === 1) toast.success('Upvoted question');
      else if (newVote === -1) toast.success('Downvoted question');
      else toast.success('Vote removed');
    }
  };

  const handleAnswerVote = (answerId: string, voteType: 1 | -1) => {
    if (!question) return;
    if (!user) {
      toast.error('Please log in to vote.');
      return;
    }

    const { delta, newVote } = castVote(user.id, answerId, voteType);

    if (delta !== 0) {
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              answers: (prev.answers || []).map((ans) =>
                ans.id === answerId ? { ...ans, votes: ans.votes + delta } : ans
              ),
            }
          : null
      );

      const mockQ = MOCK_QUESTIONS.find((q) => q.id === question.id);
      if (mockQ && mockQ.answers) {
        const mockAns = mockQ.answers.find((a) => a.id === answerId);
        if (mockAns) mockAns.votes += delta;
      }

      if (newVote === 1) toast.success('Upvoted answer');
      else if (newVote === -1) toast.success('Downvoted answer');
      else toast.success('Vote removed');
    }
  };

  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;
    if (!user) {
      toast.error('Please log in to post an answer.');
      return;
    }
    if (newAnswer.trim().length < 10) {
      toast.error('Answer must be at least 10 characters long.');
      return;
    }

    const createdAnswer: Answer = {
      id: `ans_${Date.now()}`,
      content: newAnswer.trim(),
      userId: user.id,
      questionId: question.id,
      votes: 0,
      isAccepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        reputation: user.reputation,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            answers: [...(prev.answers || []), createdAnswer],
            _count: { answers: (prev._count?.answers ?? 0) + 1 },
          }
        : null
    );

    // Notify question owner
    if (question.userId !== user.id) {
      import('../lib/notificationStore').then(({ useNotificationStore }) => {
        useNotificationStore.getState().addNotification({
          userId: question.userId,
          senderName: user.name,
          questionId: question.id,
          questionTitle: question.title,
        });
      });
    }

    setNewAnswer('');
    toast.success('Answer posted successfully!');
  };

  const handleAcceptAnswer = (answerId: string) => {
    if (!question) return;
    if (user?.id !== question.userId) {
      toast.error('Only the author of the question can accept an answer.');
      return;
    }

    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            answers: (prev.answers || []).map((ans) => ({
              ...ans,
              isAccepted: ans.id === answerId ? !ans.isAccepted : false,
            })),
          }
        : null
    );

    const mockQ = MOCK_QUESTIONS.find((q) => q.id === question.id);
    if (mockQ && mockQ.answers) {
      mockQ.answers.forEach((ans) => {
        ans.isAccepted = ans.id === answerId ? !ans.isAccepted : false;
      });
    }

    const wasAcceptedAlready = question.answers?.find((a) => a.id === answerId)?.isAccepted;
    if (wasAcceptedAlready) {
      toast.success('Unmarked best answer');
    } else {
      toast.success('Marked as Best Answer');
    }
  };

  if (!question) {
    return (
      <main className="flex-1 min-w-0 pt-2 text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-in fade-in duration-200">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Question Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">The requested question could not be retrieved.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl hover:shadow theme-transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>
      </main>
    );
  }

  const currentQVote = user ? getVote(user.id, question.id) : 0;

  return (
    <main className="flex-1 min-w-0 pt-2 animate-in fade-in duration-200">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-sm theme-transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Questions
      </button>

      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6 theme-transition">
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleQuestionVote(1)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border theme-transition ${
                currentQVote === 1
                  ? 'border-primary-500 text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${currentQVote === 1 ? 'fill-primary-100' : ''}`} />
            </button>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{question.votes}</span>
            <button
              onClick={() => handleQuestionVote(-1)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border theme-transition ${
                currentQVote === -1
                  ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950/20 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${currentQVote === -1 ? 'fill-red-100' : ''}`} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug mb-3">
              {question.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Asked {new Date(question.createdAt as string).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {question.views} views
              </span>
            </div>

            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-6">
              {question.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {question.tags?.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 text-xs">
              <span className="text-slate-400">Asked by</span>
              <img
                src={question.user?.image || `https://api.dicebear.com/8.x/initials/svg?seed=${question.user?.name}`}
                className="w-5 h-5 rounded-full"
                alt=""
              />
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {question.user?.name} ({question.user?.reputation ?? 0})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {(question.answers || []).length} Answers
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        {(question.answers || []).length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-2xl text-slate-400 dark:text-slate-500 text-sm">
            No answers yet. Be the first to share your knowledge!
          </div>
        ) : (
          [...(question.answers || [])]
            .sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0) || b.votes - a.votes)
            .map((ans) => (
              <div
                key={ans.id}
                className={`bg-white dark:bg-slate-900/40 border rounded-2xl p-6 shadow-sm relative theme-transition ${
                  ans.isAccepted ? 'border-emerald-500/50 bg-emerald-50/10 dark:bg-emerald-950/10' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {ans.isAccepted ? (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {user?.id === question.userId && (
                      <button
                        onClick={() => handleAcceptAnswer(ans.id)}
                        className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium theme-transition"
                        title="Unmark as best answer"
                      >
                        Unmark
                      </button>
                    )}
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-900/50 shadow-sm animate-in zoom-in-95 duration-150">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100 dark:fill-emerald-950" />
                      Accepted Answer
                    </div>
                  </div>
                ) : (
                  user?.id === question.userId && (
                    <button
                      onClick={() => handleAcceptAnswer(ans.id)}
                      className="absolute top-4 right-4 flex items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md theme-transition duration-150"
                      title="Mark this as the accepted solution"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Best
                    </button>
                  )
                )}

                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1.5 pt-1">
                    {(() => {
                      const ansVote = user ? getVote(user.id, ans.id) : 0;
                      return (
                        <>
                          <button
                            onClick={() => handleAnswerVote(ans.id, 1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border theme-transition ${
                              ansVote === 1
                                ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                                : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${ansVote === 1 ? 'fill-emerald-100' : ''}`} />
                          </button>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{ans.votes}</span>
                          <button
                            onClick={() => handleAnswerVote(ans.id, -1)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border theme-transition ${
                              ansVote === -1
                                ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-950/20'
                                : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                            }`}
                          >
                            <ThumbsDown className={`w-3.5 h-3.5 ${ansVote === -1 ? 'fill-red-100' : ''}`} />
                          </button>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed mb-4">
                      {ans.content}
                    </p>

                    <div className="flex items-center justify-end gap-2 text-xs">
                      <span className="text-slate-400">Answered by</span>
                      <img
                        src={
                          ans.user?.image ||
                          `https://api.dicebear.com/8.x/initials/svg?seed=${ans.user?.name}`
                        }
                        className="w-4 h-4 rounded-full"
                        alt=""
                      />
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{ans.user?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm theme-transition">
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary-500" />
          Your Answer
        </h3>
        <form onSubmit={handleAddAnswer}>
          <textarea
            rows={5}
            placeholder={
              user
                ? 'Type your solution clearly, utilizing line breaks...'
                : 'Please sign in to answer questions'
            }
            disabled={!user}
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-200 dark:bg-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 theme-transition mb-4 disabled:bg-slate-50 dark:disabled:bg-slate-800/20 disabled:cursor-not-allowed"
          ></textarea>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!user || newAnswer.trim().length === 0}
              className="flex items-center gap-2 theme-gradient text-white font-semibold text-sm px-5 py-2.5 rounded-xl theme-shadow hover:shadow-lg theme-transition disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Post Your Answer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
