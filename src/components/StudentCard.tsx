import { Student, Prize } from '../types';
import { Plus, Minus, Gift } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onScoreChange: (delta: number) => void;
  onRedeem: () => void;
}

export function StudentCard({ student, onScoreChange, onRedeem }: StudentCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border-2 border-amber-400">
      <div className="text-gray-600 text-sm">学号：{student.id}</div>
      <div className="font-bold text-pink-500 my-1">{student.name}</div>
      
      <div className={`bg-sky-200 rounded-lg p-2 my-2 ${student.score < 0 ? 'text-red-500' : ''}`}>
        <div className="flex items-center justify-between">
          <span>✨ 积分：{student.score}</span>
          <div className="space-x-1">
            <button 
              onClick={() => onScoreChange(1)}
              className="p-1 bg-white rounded-full hover:bg-sky-100 transition-colors"
            >
              <Plus size={16} />
            </button>
            <button 
              onClick={() => onScoreChange(-1)}
              className="p-1 bg-white rounded-full hover:bg-sky-100 transition-colors"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-green-200 rounded-lg p-2 my-2">
        <div className="flex items-center justify-between">
          <span>🪙 兑换币：{student.coins}</span>
          <button 
            onClick={onRedeem}
            className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg hover:bg-green-100 transition-colors"
          >
            <Gift size={16} />
            <span>兑换奖品</span>
          </button>
        </div>
      </div>
    </div>
  );
}