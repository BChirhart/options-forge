// Curriculum data exported from Firestore
// This file contains all levels, courses, and lessons
const curriculum = [
  {
    "id": "beginner",
    "title": "Beginner",
    "order": 1,
    "courses": [
      {
        "id": "options-fundamentals",
        "title": "Options Fundamentals",
        "description": "Start here. Learn what an option is, the key terminology, and how to read an options chain. This is the essential foundation for everything that follows.",
        "order": 1,
        "lessons": [
          {
            "id": "what-is-an-option-the-right-not-the-obligation",
            "order": 1,
            "videoId": "placeholder_101",
            "textContent": "...",
            "title": "What is an Option? The Right or the Obligation"
          },
          {
            "id": "stocks-vs-options-ownership-vs-rights",
            "order": 2,
            "title": "Stocks vs. Options: Ownership vs. Rights",
            "videoId": "placeholder_102",
            "textContent": "..."
          },
          {
            "id": "calls-vs-puts-the-two-sides-of-the-coin",
            "order": 3,
            "title": "Calls vs. Puts: The Two Sides of the Coin",
            "videoId": "placeholder_103",
            "textContent": "..."
          },
          {
            "id": "the-core-four-strike-expiration-premium-and-underlying",
            "order": 4,
            "title": "The Core Four: Strike, Expiration, Premium, and Underlying",
            "videoId": "placeholder_104",
            "textContent": "..."
          },
          {
            "id": "understanding-moneyness-in-at-and-out-of-the-money",
            "order": 5,
            "title": "Understanding 'Moneyness': In, At, and Out of the Money",
            "videoId": "placeholder_105",
            "textContent": "..."
          },
          {
            "id": "decoding-the-option-chain",
            "order": 6,
            "title": "Decoding the Option Chain",
            "videoId": "placeholder_106",
            "textContent": "..."
          }
        ]
      },
      {
        "id": "introduction-to-buying-call-options",
        "title": "Introduction to Buying Call Options",
        "description": "Learn the what, why, and how of buying call options. This course focuses on the simple bullish strategy of going 'long' a call.",
        "order": 2,
        "lessons": [
          {
            "id": "the-goal-of-buying-a-call-unlimited-profit-potential",
            "order": 1,
            "title": "The Goal of Buying a Call: Unlimited Profit Potential",
            "videoId": "placeholder_201",
            "textContent": "..."
          },
          {
            "id": "risk-vs-reward-whats-the-most-you-can-lose",
            "order": 2,
            "title": "Risk vs. Reward: What's the Most You Can Lose?",
            "videoId": "placeholder_202",
            "textContent": "..."
          },
          {
            "id": "reading-the-call-side-of-the-option-chain",
            "order": 3,
            "title": "Reading the Call Side of the Option Chain",
            "videoId": "placeholder_203",
            "textContent": "..."
          },
          {
            "id": "breakeven-calculating-your-target-price",
            "order": 4,
            "title": "Breakeven: Calculating Your Target Price",
            "videoId": "placeholder_204",
            "textContent": "..."
          },
          {
            "id": "a-simple-call-buying-checklist",
            "order": 5,
            "title": "A Simple Call Buying Checklist",
            "videoId": "placeholder_205",
            "textContent": "..."
          }
        ]
      },
      {
        "id": "introduction-to-buying-put-options",
        "title": "Introduction to Buying Put Options",
        "description": "Discover how to use put options to bet against a stock or to protect your existing investments. This course covers the 'long put' strategy.",
        "order": 3,
        "lessons": [
          {
            "id": "the-goal-of-buying-a-put-profiting-from-a-downturn",
            "order": 1,
            "title": "The Goal of Buying a Put: Profiting from a Downturn",
            "videoId": "placeholder_301",
            "textContent": "..."
          },
          {
            "id": "risk-vs-reward-for-a-long-put",
            "order": 2,
            "title": "Risk vs. Reward for a Long Put",
            "videoId": "placeholder_302",
            "textContent": "..."
          },
          {
            "id": "reading-the-put-side-of-the-option-chain",
            "order": 3,
            "title": "Reading the Put Side of the Option Chain",
            "videoId": "placeholder_303",
            "textContent": "..."
          },
          {
            "id": "using-puts-to-hedge-an-insurance-policy-for-your-stocks",
            "order": 4,
            "title": "Using Puts to Hedge: An Insurance Policy for Your Stocks",
            "videoId": "placeholder_304",
            "textContent": "..."
          },
          {
            "id": "a-simple-put-buying-checklist",
            "order": 5,
            "title": "A Simple Put Buying Checklist",
            "videoId": "placeholder_305",
            "textContent": "..."
          }
        ]
      }
    ]
  },
  {
    "id": "intermediate",
    "title": "Intermediate",
    "order": 2,
    "courses": []
  },
  {
    "id": "advanced",
    "title": "Advanced",
    "order": 3,
    "courses": []
  }
];

export default curriculum;
