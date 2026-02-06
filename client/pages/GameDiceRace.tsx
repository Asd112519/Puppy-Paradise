import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Trophy, User, Bot, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { rollDice, isBust, getAIDecision, checkWin } from "@/lib/diceGameUtils";
import { cn } from "@/lib/utils";

// Types
type GameMode = "mode-select" | "single-player" | "multiplayer";
type GameStatus = "playing" | "won";

interface Player {
  id: string;
  name: string;
  totalScore: number;
  isAI: boolean;
  color: string;
}

const WINNING_SCORE = 100;

export default function GameDiceRace() {
  // Game State
  const [gameMode, setGameMode] = useState<GameMode>("mode-select");
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [currentRoundPoints, setCurrentRoundPoints] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [winner, setWinner] = useState<Player | null>(null);
  
  // UI State
  const [roundMessage, setRoundMessage] = useState("");
  const [showWinModal, setShowWinModal] = useState(false);

  // Refs for AI timing
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Game
  const initializeGame = (mode: "single-player" | "multiplayer") => {
    let newPlayers: Player[] = [];
    
    if (mode === "single-player") {
      newPlayers = [
        { id: "p1", name: "You", totalScore: 0, isAI: false, color: "text-blue-500" },
        { id: "ai", name: "Penny (AI)", totalScore: 0, isAI: true, color: "text-orange-500" }
      ];
    } else {
      newPlayers = [
        { id: "p1", name: "Player 1", totalScore: 0, isAI: false, color: "text-blue-500" },
        { id: "p2", name: "Player 2", totalScore: 0, isAI: false, color: "text-red-500" }
      ];
    }

    setPlayers(newPlayers);
    setGameMode(mode);
    setActivePlayerIndex(0);
    setCurrentRoundPoints(0);
    setDiceValue(null);
    setGameStatus("playing");
    setWinner(null);
    setShowWinModal(false);
    setRoundMessage("Roll the dice to start!");
  };

  // Game Logic
  const handleRollDice = () => {
    if (isRolling || gameStatus === "won") return;

    setIsRolling(true);
    setRoundMessage("Rolling...");

    // Animate rolling
    setTimeout(() => {
      const value = rollDice();
      setDiceValue(value);
      setIsRolling(false);

      if (isBust(value)) {
        // BUST!
        setRoundMessage("Oh no! You rolled a 1!");
        setTimeout(() => {
          endTurn(0); // 0 points for this round
        }, 1500);
      } else {
        // Valid roll
        setCurrentRoundPoints((prev) => prev + value);
        setRoundMessage(`Rolled a ${value}! Bank or Roll again?`);
      }
    }, 600); // Animation duration
  };

  const handleBankPoints = () => {
    if (isRolling || gameStatus === "won") return;
    
    const pointsToBank = currentRoundPoints;
    setRoundMessage(`Banked ${pointsToBank} points!`);
    endTurn(pointsToBank);
  };

  const endTurn = (roundPoints: number) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];
      const activePlayer = updatedPlayers[activePlayerIndex];
      activePlayer.totalScore += roundPoints;
      
      // Check Win Condition immediately after updating score
      if (checkWin(activePlayer.totalScore, WINNING_SCORE)) {
        setGameStatus("won");
        setWinner(activePlayer);
        setShowWinModal(true);
        return updatedPlayers;
      }
      
      return updatedPlayers;
    });

    // If game not won, switch turns
    setCurrentRoundPoints(0);
    // Wait a bit if we just busted/banked before switching context visually
    // But since state update is batched, we can set index now, 
    // but maybe we want a small delay if it was a bust?
    // We already delayed bust inside handleRollDice.
    
    // We need to check if game was won in the previous state update (but we can't see it yet)
    // So we'll use an effect or check the logic above.
    // The logic above updates state but return doesn't stop execution of this function.
    // However, setPlayers functional update is async in terms of variable scope.
    
    // Actually, simple way: calculate new score locally
    const currentPlayer = players[activePlayerIndex];
    const newScore = currentPlayer.totalScore + roundPoints;
    
    if (newScore >= WINNING_SCORE) {
      // Game Won logic is handled in setPlayers for consistency, 
      // but we should avoid switching active player if won.
      return; 
    }

    // Switch player
    setActivePlayerIndex((prev) => (prev + 1) % players.length);
    setDiceValue(null); // Reset dice visual
    
    // Message for next player
    const nextPlayerName = players[(activePlayerIndex + 1) % players.length].name;
    // We set message after a delay to override the "Banked..." message?
    // Or just let the UI show "It's X's turn"
  };

  // AI Logic Effect
  useEffect(() => {
    const activePlayer = players[activePlayerIndex];
    
    if (
      gameStatus === "playing" && 
      activePlayer?.isAI && 
      !isRolling && 
      !showWinModal
    ) {
      // AI Turn
      const aiTurnDelay = 1000; // Delay before AI acts
      
      aiTimeoutRef.current = setTimeout(() => {
        // Decide: Roll or Bank?
        // If diceValue is null (start of turn), always roll
        if (diceValue === null) {
          handleRollDice();
          return;
        }

        // Make decision
        const opponent = players.find(p => !p.isAI);
        const decision = getAIDecision(
          activePlayer.totalScore,
          opponent?.totalScore || 0,
          currentRoundPoints,
          WINNING_SCORE
        );

        if (decision === "roll") {
          handleRollDice();
        } else {
          handleBankPoints();
        }

      }, aiTurnDelay);
    }

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [activePlayerIndex, diceValue, isRolling, gameStatus, players, currentRoundPoints]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/games">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Games
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-400 font-fredoka">
              Dice Roll Race 🎲
            </h1>
            <div className="w-24"></div> {/* Spacer */}
          </div>

          {gameMode === "mode-select" ? (
            /* Mode Selection Screen */
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Choose Game Mode</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <button
                  onClick={() => initializeGame("single-player")}
                  className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-blue-500 group"
                >
                  <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <Bot className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">vs Computer</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
                    Race against Penny! She plays smart... mostly.
                  </p>
                </button>

                <button
                  onClick={() => initializeGame("multiplayer")}
                  className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-red-500 group"
                >
                  <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full mb-4 group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                    <Users className="w-12 h-12 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">2 Player</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
                    Play against a friend on the same device.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* Game Board */
            <div className="flex flex-col items-center gap-8">
              
              {/* Score Board */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                {players.map((player, index) => (
                  <div 
                    key={player.id}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-xl border-4 transition-all duration-300 relative overflow-hidden",
                      activePlayerIndex === index 
                        ? "border-orange-500 bg-white dark:bg-gray-800 shadow-lg scale-105 z-10" 
                        : "border-transparent bg-white/50 dark:bg-gray-800/50 grayscale-[0.5] scale-95"
                    )}
                  >
                    {activePlayerIndex === index && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 animate-pulse" />
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      {player.isAI ? <Bot size={20} /> : <User size={20} />}
                      <span className="font-bold text-lg">{player.name}</span>
                    </div>
                    
                    <div className={cn("text-4xl font-fredoka font-bold mb-1", player.color)}>
                      {player.totalScore}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Score</div>

                    {/* Active Round Points Badge */}
                    {activePlayerIndex === index && (
                      <div className="mt-4 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-lg text-center w-full">
                        <div className="text-sm text-orange-600 dark:text-orange-400 font-bold mb-1">Current Round</div>
                        <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                          +{currentRoundPoints}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Game Area */}
              <div className="flex flex-col items-center justify-center py-8 relative w-full max-w-md">
                
                {/* Dice Display */}
                <div className="mb-8 relative h-32 w-32 flex items-center justify-center">
                   <div className={cn(
                     "w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center text-6xl font-bold border-4 border-gray-200 dark:border-gray-700 transition-all duration-500",
                     isRolling ? "animate-spin scale-90" : "scale-100 rotate-0"
                   )}>
                     {diceValue !== null ? (
                       <span className={cn(
                         diceValue === 1 ? "text-red-500" : "text-gray-800"
                       )}>
                         {diceValue === 1 ? "☠️" : diceValue}
                       </span>
                     ) : (
                       <span className="text-gray-300">?</span>
                     )}
                   </div>
                </div>

                {/* Status Message */}
                <div className="h-12 flex items-center justify-center mb-6">
                  <p className="text-lg font-medium text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {roundMessage}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex gap-4 w-full">
                  <Button
                    size="lg"
                    onClick={handleRollDice}
                    disabled={isRolling || (players[activePlayerIndex]?.isAI)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-6 text-xl shadow-lg transform active:scale-95 transition-all"
                  >
                    🎲 Roll
                  </Button>
                  
                  <Button
                    size="lg"
                    onClick={handleBankPoints}
                    disabled={isRolling || (players[activePlayerIndex]?.isAI) || currentRoundPoints === 0}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-6 text-xl shadow-lg transform active:scale-95 transition-all"
                  >
                    💰 Bank
                  </Button>
                </div>

                {/* Quit Button */}
                <Button 
                  variant="ghost" 
                  onClick={() => setGameMode("mode-select")}
                  className="mt-8 text-gray-500 hover:text-red-500"
                >
                  Quit Game
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Win Modal Overlay */}
      {showWinModal && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-in zoom-in-95 duration-300 text-center border-4 border-yellow-400">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
            
            <h2 className="text-3xl font-bold font-fredoka text-gray-900 dark:text-white mb-2">
              {winner.isAI ? "Penny Wins!" : `${winner.name} Wins!`}
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Final Score: <span className="font-bold text-orange-500">{winner.totalScore}</span>
            </p>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => initializeGame(gameMode === "single-player" ? "single-player" : "multiplayer")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6"
              >
                Play Again
              </Button>
              
              <Link to="/games">
                <Button variant="outline" className="w-full py-6">
                  Back to Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
