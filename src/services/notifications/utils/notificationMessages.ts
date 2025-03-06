
/**
 * Collection of motivational messages for rest timer notifications
 */
const motivationalMessages = [
  "Time to get back to your workout! 💪",
  "Rest complete! Let's crush the next set! 🔥",
  "Break's over - time to build that strength! 💯",
  "Ready to continue? Your body is waiting! 🏋️",
  "You've rested enough - back to making progress! 🚀",
  "Rest complete! Remember, consistency is key! ⏱️",
  "Your muscles are ready for the next challenge! 🏆",
  "Break time's up! Keep pushing your limits! 🙌",
  "Get ready for your next set! You're doing great! 👊",
  "Time to get back to work! Every rep counts! 💪"
];

/**
 * Get a random motivational message
 * @returns A randomly selected motivational message
 */
export const getRandomMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  return motivationalMessages[randomIndex];
};
