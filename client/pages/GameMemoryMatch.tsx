import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";

const cardData = [
  { id: 1, content: "🦮", name: "Golden" },
  { id: 2, content: "🐕‍🦺", name: "Shepherd" },
  { id: 3, content: "🐩", name: "Poodle" },
  { id: 4, content: "🦴", name: "Bone" },
  { id: 5, content: "🎾", name: "Tennis Ball" },
  { id: 6, content: "🥩", name: "Steak" },
  { id: 7, content: "🐾", name: "Paw Print" },
  { id: 8, content: "🐕", name: "Labrador" },
  { id: 9, content: "🏠", name: "Dog House" },
  { id: 10, content: "🥣", name: "Water Bowl" },
  { id: 11, content: "🧶", name: "Rope Toy" },
  { id: 12, content: "🪮", name: "Grooming" },
  { id: 13, content: "🐶", name: "Puppy" },
  { id: 14, content: "🧀", name: "Cheese" },
  { id: 15, content: "🧣", name: "Collar" },
  { id: 16, content: "🌳", name: "Park Tree" },
  { id: 17, content: "🥏", name: "Frisbee" },
  { id: 18, content: "🐕", name: "Beagle" },
];

interface GameCard {
  id: number;
  content: string;
  name: string;
  flipped: boolean;
  matched: boolean;
}

interface OverlayState {
  show: boolean;
  title: string;
  message: string;
  buttonText: string;
  action: "next-level" | "retry" | null;
}

export default function GameMemoryMatch() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairsNeeded, setTotalPairsNeeded] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [overlay, setOverlay] = useState<OverlayState>({
    show: false,
    title: "",
    message: "",
    buttonText: "",
    action: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize level
  useEffect(() => {
    let rows, cols, time;
    if (currentLevel === 1) {
      rows = 2;
      cols = 2;
      time = 30;
    } else if (currentLevel === 2) {
      rows = 2;
      cols = 3;
      time = 45;
    } else if (currentLevel === 3) {
      rows = 3;
      cols = 4;
      time = 60;
    } else if (currentLevel === 4) {
      rows = 4;
      cols = 4;
      time = 90;
    } else if (currentLevel === 5) {
      rows = 4;
      cols = 5;
      time = 120;
    } else {
      rows = 6;
      cols = 6;
      time = 180;
    }

    const pairs = (rows * cols) / 2;
    setTotalPairsNeeded(pairs);
    setMatchedPairs(0);
    setFlippedIndices([]);
    setIsLocked(false);
    setTimeLeft(time);
    setOverlay({ show: false, title: "", message: "", buttonText: "", action: null });

    // Create game cards
    const levelCards = [...cardData]
      .sort(() => 0.5 - Math.random())
      .slice(0, pairs);
    const gameCards = [...levelCards, ...levelCards].sort(
      () => 0.5 - Math.random()
    );

    const newCards: GameCard[] = gameCards.map((card) => ({
      ...card,
      flipped: false,
      matched: false,
    }));
    setCards(newCards);

    if (boardRef.current) {
      boardRef.current.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    }
  }, [currentLevel]);

  // Timer effect
  useEffect(() => {
    if (totalPairsNeeded === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = timer;
    return () => clearInterval(timer);
  }, [totalPairsNeeded]);

  // Check match effect
  useEffect(() => {
    if (flippedIndices.length !== 2 || isLocked) return;

    setIsLocked(true);

    // Check if it's a match
    const card1Id = cards[flippedIndices[0]].id;
    const card2Id = cards[flippedIndices[1]].id;
    const isMatch = card1Id === card2Id;

    const timer = setTimeout(() => {
      if (isMatch) {
        // Match found
        setCards((prev) =>
          prev.map((card, idx) =>
            idx === flippedIndices[0] || idx === flippedIndices[1]
              ? { ...card, matched: true }
              : card
          )
        );
        setMatchedPairs((prev) => {
          const newMatched = prev + 1;
          if (newMatched === totalPairsNeeded) {
            handleLevelComplete();
          }
          return newMatched;
        });
      } else {
        // No match, flip back
        setCards((prev) =>
          prev.map((card, idx) =>
            idx === flippedIndices[0] || idx === flippedIndices[1]
              ? { ...card, flipped: false }
              : card
          )
        );
      }

      setFlippedIndices([]);
      setIsLocked(false);
    }, isMatch ? 400 : 1000);

    return () => clearTimeout(timer);
  }, [flippedIndices]);

  const handleCardClick = (index: number) => {
    if (
      isLocked ||
      flippedIndices.includes(index) ||
      cards[index].matched ||
      cards[index].flipped
    ) {
      return;
    }

    setCards((prev) =>
      prev.map((card, idx) =>
        idx === index ? { ...card, flipped: true } : card
      )
    );
    setFlippedIndices([...flippedIndices, index]);
  };

  const handleLevelComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setOverlay({
      show: true,
      title: "Paws-itive Results!",
      message: `Level ${currentLevel} cleared! Penny is so proud of your memory skills.`,
      buttonText: `Go to Level ${currentLevel + 1}`,
      action: "next-level",
    });
  };

  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setOverlay({
      show: true,
      title: "Ruh-Roh!",
      message:
        "The timer ran out before you found all the treats. Try again?",
      buttonText: `Try Level ${currentLevel} Again`,
      action: "retry",
    });
  };

  const handleOverlayAction = () => {
    if (overlay.action === "next-level") {
      setCurrentLevel(currentLevel + 1);
    } else if (overlay.action === "retry") {
      setCurrentLevel(currentLevel);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center p-6 bg-green-50 dark:bg-gray-900">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Fredoka:wght@400;600&display=swap');
          
          .font-pacifico {
            font-family: 'Pacifico', cursive;
          }

          .perspective {
            perspective: 1000px;
          }

          .game-card {
            aspect-ratio: 1;
            cursor: pointer;
          }

          .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform-style: preserve-3d;
          }

          .card-flipped .card-inner {
            transform: rotateY(180deg);
          }

          .card-front, .card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }

          .card-front {
            background-color: #ffffff;
            transform: rotateY(180deg);
          }

          .card-back {
            background-color: #4ade80;
            color: white;
            font-size: 3rem;
          }

          .card-matched .card-front {
            border: 6px solid #fbbf24;
            background-color: #fffbeb;
          }

          .emoji-large {
            font-size: 3.5rem;
          }
          
          @media (max-width: 640px) {
            .emoji-large { font-size: 2.2rem; }
            .card-back { font-size: 2.2rem; }
          }
        `}</style>

        {/* Header Area */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-pacifico text-green-600 mb-4">
            Penny's Memory Match
          </h1>
          <div className="flex gap-6 justify-center items-center text-xl font-semibold flex-wrap">
            <div className="bg-white px-6 py-3 rounded-full shadow-md border-2 border-green-100">
              Level: <span className="text-green-600">{currentLevel}</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-md border-2 border-green-100">
              Time: <span className="text-orange-500">{timeLeft}</span>s
            </div>
            <div className="bg-white px-6 py-3 rounded-full shadow-md border-2 border-green-100">
              Pairs:{" "}
              <span className="text-blue-500">
                {matchedPairs}/{totalPairsNeeded}
              </span>
            </div>
          </div>
        </header>

        {/* Game Board */}
        <div
          ref={boardRef}
          className="grid gap-6 w-full max-w-4xl mx-auto mb-10 px-4"
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className={`game-card perspective ${
                card.flipped ? "card-flipped" : ""
              } ${card.matched ? "card-matched" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner w-full h-full">
                <div className="card-back">🐶</div>
                <div className="card-front flex-col p-2">
                  <span className="emoji-large">{card.content}</span>
                  <span className="text-xs uppercase font-bold text-gray-400 mt-2 tracking-wider">
                    {card.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* UI Overlay */}
        {overlay.show && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border-4 border-green-400">
              <h2 className="text-4xl font-pacifico text-green-600 mb-4">
                {overlay.title}
              </h2>
              <p className="text-xl text-gray-600 mb-8 font-medium">
                {overlay.message}
              </p>
              <button
                onClick={handleOverlayAction}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                {overlay.buttonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
