import { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Award } from 'lucide-react';
import { StudentCard } from './components/StudentCard';
import { Modal } from './components/Modal';
import { Student, Prize } from './types';
import { read, utils, writeFile } from 'xlsx';

const FULL_NAME_LIST = ["陈劲桥","陈玟言","陈醉墨","单彦桐","苟轩鸣","黎瑞霖","李嘉阳","李景耘","李洛亦","李提醍","廖祯真","刘子洋","路依文","马平川","牟柏然","牟林昊","邱晚宸","石逸朗","谭涞予","王翊丞","王梓铭","王梓熙","熊珮淞","杨秉宸","杨麒晔","尹逸知","张峻源","周子槺","曾泊匀","陈玟伲","陈清桐","陈臆米","陈阅微","郝洺伊","胡尹馨","兰怡霖","李恩霖","李露萍","刘芷妍","梅锦陌","汤婉扬","唐维林","王施懿","王婉琳","王奕菲","文理妍","吴佩瑶","杨睿一","袁沐希","张露涵","张思甜","张文奕","张雨禾"];

function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    if (saved) return JSON.parse(saved);
    return FULL_NAME_LIST.map((name, index) => ({
      id: index + 1,
      name,
      score: 0,
      coins: 0
    }));
  });

  const [prizes, setPrizes] = useState<Prize[]>(() => {
    const saved = localStorage.getItem('prizes');
    return saved ? JSON.parse(saved) : [];
  });

  const [batchScore, setBatchScore] = useState<number>(0);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('prizes', JSON.stringify(prizes));
    };

    saveData();
    const interval = setInterval(saveData, 300000); // Save every 5 minutes
    return () => clearInterval(interval);
  }, [students, prizes]);

  const handleScoreChange = (index: number, delta: number) => {
    setStudents(prev => prev.map((student, i) => {
      if (i === index) {
        return {
          ...student,
          score: student.score + delta,
          coins: student.coins + delta
        };
      }
      return student;
    }));
  };

  const handleBatchOperation = (operation: 'add' | 'subtract') => {
    const delta = operation === 'add' ? batchScore : -batchScore;
    setStudents(prev => prev.map(student => ({
      ...student,
      score: student.score + delta,
      coins: student.coins + delta
    })));
  };

  const showPrizeManagement = () => {
    setModalContent(
      <div>
        <h3 className="text-xl font-bold mb-4">🎁 奖品管理</h3>
        <div className="max-h-48 overflow-y-auto mb-4">
          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b">
              <span>{prize.name}（{prize.cost}币）</span>
              <button
                onClick={() => {
                  setPrizes(prev => prev.filter((_, i) => i !== index));
                }}
                className="text-red-500 hover:bg-red-100 p-1 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <h4 className="font-bold">添加新奖品：</h4>
          <input
            type="text"
            id="prizeName"
            placeholder="奖品名称"
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="number"
            id="prizeCost"
            placeholder="所需币数"
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={() => {
              const name = (document.getElementById('prizeName') as HTMLInputElement).value;
              const cost = parseInt((document.getElementById('prizeCost') as HTMLInputElement).value);
              if (name && cost > 0) {
                setPrizes(prev => [...prev, { name, cost }]);
              }
            }}
            className="w-full bg-green-200 hover:bg-green-300 transition-colors rounded-lg py-2"
          >
            添加
          </button>
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  const showRedeemModal = (studentIndex: number) => {
    const student = students[studentIndex];
    setModalContent(
      <div>
        <h3 className="text-xl font-bold mb-4">🎁 {student.name} 的兑换</h3>
        <p className="mb-4">当前兑换币：{student.coins}</p>
        <div className="max-h-64 overflow-y-auto">
          {prizes.map((prize, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b">
              <span>{prize.name}（需要 {prize.cost} 币）</span>
              <button
                onClick={() => {
                  if (student.coins >= prize.cost) {
                    setStudents(prev => prev.map((s, i) => 
                      i === studentIndex 
                        ? { ...s, coins: s.coins - prize.cost }
                        : s
                    ));
                    setIsModalOpen(false);
                    alert(`兑换成功！${student.name} 获得【${prize.name}】`);
                  } else {
                    alert('兑换币不足！');
                  }
                }}
                disabled={student.coins < prize.cost}
                className={`px-3 py-1 rounded-lg ${
                  student.coins >= prize.cost
                    ? 'bg-green-200 hover:bg-green-300'
                    : 'bg-gray-200 cursor-not-allowed'
                }`}
              >
                兑换
              </button>
            </div>
          ))}
          {prizes.length === 0 && <p className="text-center text-gray-500">暂无奖品，请先添加</p>}
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  const exportData = () => {
    const wsData = students.map(s => [s.id, s.name, s.score, s.coins]);
    const wb = utils.book_new();
    const ws = utils.aoa_to_sheet([['学号','姓名','积分','兑换币'], ...wsData]);
    utils.book_append_sheet(wb, ws, "学生数据");
    writeFile(wb, `积分数据_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const clearScores = () => {
    if (confirm('确定要清除所有积分和兑换币吗？')) {
      setStudents(prev => prev.map(student => ({ ...student, score: 0, coins: 0 })));
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f3e9] p-5">
      <div className="bg-pink-200 p-4 rounded-xl mb-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          ✨ 快乐积分乐园 ✨ 
          <span className="text-sm ml-2">{new Date().toLocaleDateString()}</span>
        </h1>
        <div className="space-x-2">
          <button
            onClick={exportData}
            className="bg-white px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            导出数据
          </button>
          <button
            onClick={clearScores}
            className="bg-orange-400 text-white px-4 py-2 rounded-xl hover:bg-orange-500 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            清除积分
          </button>
        </div>
      </div>

      <div className="bg-purple-100 p-4 rounded-xl mb-5">
        <h3 className="font-bold mb-3">批量操作</h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="number"
            value={batchScore}
            onChange={(e) => setBatchScore(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="分数值"
            min="0"
            className="w-24 px-3 py-2 rounded-lg border"
          />
          <button
            onClick={() => handleBatchOperation('add')}
            className="bg-white px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            🎉 全班加分
          </button>
          <button
            onClick={() => handleBatchOperation('subtract')}
            className="bg-white px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            🌀 全班减分
          </button>
          <button
            onClick={showPrizeManagement}
            className="bg-white px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Award size={16} />
            管理奖品
          </button>
        </div>
      </div>

   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        {students.map((student, index) => (
          <StudentCard
            key={student.id}
            student={student}
            onScoreChange={(delta) => handleScoreChange(index, delta)}
            onRedeem={() => showRedeemModal(index)}
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
}

export default App;