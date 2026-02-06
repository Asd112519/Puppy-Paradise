// Dice Roll Race Game Utilities

/**
 * Roll a 6-sided die
 * @returns number between 1 and 6
 */
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Determine if the roll is a bust (value is 1)
 */
export function isBust(diceValue: number): boolean {
  return diceValue === 1;
}

/**
 * Check if a player has won
 * @param playerScore - Total accumulated score (banked)
 * @param targetScore - Score needed to win (default 100)
 */
export function checkWin(playerScore: number, targetScore: number = 100): boolean {
  return playerScore >= targetScore;
}

/**
 * AI Decision Logic
 * 
 * Simple strategy:
 * - If rolling can win the game immediately -> Roll (unless risk is too high?)
 *   Actually, if current points + bank >= 100, we should BANK, not roll.
 *   But we bank at end of turn.
 * 
 * Strategy based on "Pig" game optimal play:
 * - Bank if current round points >= 20
 * - Bank if current round points + total score >= target (100)
 * 
 * Difficulty modification:
 * - We can add some randomness or aggressiveness
 */
export function getAIDecision(
  aiTotalScore: number,
  opponentScore: number,
  currentRoundPoints: number,
  targetScore: number = 100
): "roll" | "bank" {
  const potentialScore = aiTotalScore + currentRoundPoints;

  // 1. If we can win right now, BANK!
  if (potentialScore >= targetScore) {
    return "bank";
  }

  // 2. If we have a good amount of points this round, BANK
  // Standard "hold" threshold is often around 20-25
  const holdThreshold = 20;
  
  // Adjust threshold based on situation?
  // If opponent is close to winning, maybe play riskier?
  let effectiveThreshold = holdThreshold;
  
  if (opponentScore >= targetScore - 20) {
    // Opponent is close to winning, take more risks
    effectiveThreshold = 30; 
  } else if (opponentScore < aiTotalScore - 20) {
    // We are winning by a lot, play safer
    effectiveThreshold = 15;
  }

  if (currentRoundPoints >= effectiveThreshold) {
    return "bank";
  }

  // 3. Otherwise, ROLL
  return "roll";
}
