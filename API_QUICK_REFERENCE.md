# Quiz API Quick Reference

## 🔐 Authentication
All requests require Bearer token:
```
Authorization: Bearer {cognito_jwt}
```
Token from: `localStorage.getItem('cognito_jwt')`

## 📡 Base URL
```
https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1
```

## 🎯 Integrated Endpoints

### 1. Start Quiz Session
```http
POST /quiz/sessions/start
Content-Type: application/json

{
  "contentId": "article-uuid"
}
```
**Response:** `QuizSessionDto`

### 2. Get Questions
```http
GET /quiz/questions/content/{contentId}
```
**Response:** `QuizQuestionDto[]`

### 3. Check Active Session
```http
GET /quiz/sessions/active
```
**Response:** `QuizSessionDto` or 404

### 4. Submit Answer
```http
POST /quiz/sessions/{sessionId}/answer
Content-Type: application/json

{
  "questionId": "question-uuid",
  "selectedOptionIndex": 1,
  "timeSpent": 15
}
```
**Response:** Answer result with correctness

### 5. Complete Quiz
```http
POST /quiz/sessions/{sessionId}/complete
```
**Response:** `QuizSessionResultsDto`

### 6. Abandon Quiz
```http
POST /quiz/sessions/{sessionId}/abandon
```
**Response:** Success confirmation

### 7. Get User Stats
```http
GET /quiz/stats/me
```
**Response:** `UserQuizStatsDto`

## 📋 Data Structures

### QuizQuestionDto
```json
{
  "id": "uuid",
  "questionText": "Question?",
  "options": ["A", "B", "C", "D"],
  "difficulty": "EASY|MEDIUM|HARD",
  "explanation": "Explanation text",
  "contentId": "uuid"
}
```

### QuizSessionDto
```json
{
  "id": "uuid",
  "contentId": "uuid",
  "userId": "uuid",
  "status": "IN_PROGRESS",
  "score": 0,
  "currentStreak": 0,
  "answeredQuestions": 0
}
```

### QuizSessionResultsDto
```json
{
  "totalScore": 250,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "accuracy": 80,
  "averageTimePerQuestion": 18,
  "ratingChange": 15,
  "newRating": 1365
}
```

### UserQuizStatsDto
```json
{
  "rating": 1350,
  "quizzesCompleted": 15,
  "quizzesAbandoned": 2,
  "currentStreak": 8,
  "totalPoints": 2450
}
```

## 🔄 Quiz Flow

```
1. GET /quiz/sessions/active
   → Check for active session

2. GET /quiz/questions/content/{id}
   → Load questions

3. POST /quiz/sessions/start
   → Start new session

4. POST /quiz/sessions/{id}/answer (×N)
   → Submit each answer

5. POST /quiz/sessions/{id}/complete
   → Finish quiz

6. GET /quiz/stats/me
   → Update user stats
```

## 🚨 Error Codes

- **401** - Unauthorized (invalid/expired token)
- **404** - Not found (no active session, no questions)
- **400** - Bad request (invalid data)
- **500** - Server error

## 💡 Usage Examples

### JavaScript/Fetch
```javascript
const token = localStorage.getItem('cognito_jwt');

// Start quiz
const response = await fetch(
  'https://scfr3zbfvr.us-east-1.awsapprunner.com/api/v1/quiz/sessions/start',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ contentId: 'article-123' })
  }
);

const session = await response.json();
```

### Using Quiz Service
```javascript
import { quizAPI } from './services/quizService';

// Start quiz
const session = await quizAPI.startQuizSession('article-123');

// Get questions
const questions = await quizAPI.getQuestionsForContent('article-123');

// Submit answer
const result = await quizAPI.submitAnswer(
  sessionId,
  questionId,
  answerIndex,
  timeSpent
);

// Complete quiz
const results = await quizAPI.completeQuizSession(sessionId);
```

## 🎯 Key Points

- ✅ All requests need Bearer token
- ✅ Session must be started before answering
- ✅ Each answer submitted individually
- ✅ Session must be completed to get results
- ✅ Only one active session per user
- ✅ Abandoned sessions don't count in stats

## 📞 Quick Troubleshooting

**401 Error?**
→ Check token in localStorage

**404 on questions?**
→ Article has no questions yet

**Session not starting?**
→ Check for active session first

**Answers not submitting?**
→ Verify session ID is valid

---

**Need Help?** Check `BACKEND_TESTING_GUIDE.md` for detailed testing scenarios.