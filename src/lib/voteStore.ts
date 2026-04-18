import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoteState {
  // Key: `vote_${userId}_${targetId}` -> 1 (up), -1 (down), 0 (none)
  votes: Record<string, number>;
  getVote: (userId: string, targetId: string) => number;
  castVote: (userId: string, targetId: string, type: 1 | -1) => { delta: number; newVote: number };
}

export const useVoteStore = create<VoteState>()(
  persist(
    (set, get) => ({
      votes: {},

      getVote: (userId, targetId) => {
        const key = `vote_${userId}_${targetId}`;
        return get().votes[key] || 0;
      },

      castVote: (userId, targetId, type) => {
        const key = `vote_${userId}_${targetId}`;
        const currentVote = get().votes[key] || 0;

        let delta = 0;
        let newVote = 0;

        if (currentVote === type) {
          // Undo the vote
          delta = -type;
          newVote = 0;
        } else if (currentVote === 0) {
          // New vote
          delta = type;
          newVote = type;
        } else {
          // Flip the vote (e.g. from -1 to 1 means +2 delta)
          delta = type * 2;
          newVote = type;
        }

        set((state) => ({
          votes: { ...state.votes, [key]: newVote },
        }));

        return { delta, newVote };
      },
    }),
    {
      name: 'proshnouttor-votes',
    }
  )
);
