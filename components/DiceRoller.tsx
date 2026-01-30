import React, { useState } from 'react';

const DiceRoller: React.FC = () => {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    
    // Animation duration
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setValue(newValue);
      setRolling(false);
    }, 600);
  };

  const renderDots = (num: number) => {
    const dotPositions: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    return Array(9).fill(null).map((_, i) => (
      <div key={i} className="flex items-center justify-center w-full h-full">
        {dotPositions[num].includes(i) && (
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full shadow-inner" />
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl w-full max-w-xs mt-4">
      <h3 className="text-slate-200 font-bold text-lg">Cosmetic Dice</h3>
      
      <div 
        className={`
          w-20 h-20 bg-slate-100 rounded-xl shadow-2xl border-2 border-slate-300
          grid grid-cols-3 grid-rows-3 p-2
          transition-all duration-500 transform
          ${rolling ? 'rotate-[360deg] scale-90' : 'rotate-0 scale-100'}
        `}
      >
        {renderDots(value)}
      </div>

      <button
        onClick={rollDice}
        disabled={rolling}
        className={`
          px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600
          text-white rounded-full font-bold shadow-lg transition-all active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed border border-slate-500
        `}
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default DiceRoller;
