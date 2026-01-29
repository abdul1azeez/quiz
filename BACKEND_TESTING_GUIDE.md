# Backend Integration Testing Guide

## 🚀 Quick Start

### Prerequisites
1. Development server running: `npm run dev`
2. User logged in (cognito_jwt token in localStorage)
3. Article with quiz questions available in backend

### Testing the Integration

## Test 1: Start a Quiz from a Post

1. **Navigate to home page**: `http://localhost:5173`
2. **Find any post** with content
3. **Click "Take Quiz" button** (green button with brain icon)
4. **Expected behavior**:
   - Redirects to `/quiz/{postId}`
   - Shows loading state
   - Checks for active sessions
   - Loads questions from backend
   - Shows quiz menu with article title

### What to Check:
- [ ] Browser console shows no errors
- [ ] Network tab shows API calls:
  - `GET /quiz/sessions/active`
  - `GET /quiz/questions/content/{contentId}`
  - `GET /quiz/stats/me`
- [ ] Quiz menu displays with correct article title
- [ ] User stats load correctly
- [ ] Question count shows in info card

## Test 2: Start Quiz Session

1. **From quiz menu**, click "Start Quiz"
2. **Expected behavior**:
   - API call: `POST /quiz/sessions/start`
   - Questions display
   - Timer starts at 30 seconds
   - Progress bar shows 1/N questions

### What to Check:
- [ ] Session created successfully
- [ ] Questions render correctly
- [ ] Timer counts down
- [ ] Difficulty badge shows (EASY/MEDIUM/HARD)
- [ ] All 4 options display

## Test 3: Answer Questions

1. **Click an answer option**
2. **Click "Submit Answer"**
3. **Expected behavior**:
   - API call: `POST /quiz/sessions/{id}/answer`
   - Answer highlighted (green=correct, red=wrong)
   - Explanation appears below correct answer
   - Score updates
   - Auto-advances after 2.5 seconds

### What to Check:
- [ ] Answer submission successful
- [ ] Correct answer highlighted in green
- [ ] Wrong answer highlighted in red (if incorrect)
- [ ] Explanation displays below correct answer
- [ ] Score increases for correct answers
- [ ] Streak increases for consecutive correct answers
- [ ] Streak resets on wrong answer
- [ ] Auto-advance works

## Test 4: Complete Quiz

1. **Answer all questions**
2. **After last question**, wait for auto-advance
3. **Expected behavior**:
   - API call: `POST /quiz/sessions/{id}/complete`
   - Results page displays
   - Shows total score, accuracy, correct/total
   - Shows rating change (if applicable)

### What to Check:
- [ ] Quiz completes successfully
- [ ] Results display correctly
- [ ] Score matches accumulated points
- [ ] Accuracy calculation correct
- [ ] Rating change shown (if applicable)
- [ ] "Take Another Quiz" button works
- [ ] "View Leaderboards" button works

## Test 5: Active Session Detection

1. **Start a quiz** but don't complete it
2. **Navigate away** (e.g., go to home)
3. **Try to start another quiz** from a different post
4. **Expected behavior**:
   - System detects active session
   - Prompt: "You have an active quiz session. Continue or start new?"
   - If "OK": Loads active session
   - If "Cancel": Abandons session and starts new

### What to Check:
- [ ] Active session detected
- [ ] Prompt displays correctly
- [ ] Continue option loads active session
- [ ] Abandon option calls `POST /quiz/sessions/{id}/abandon`
- [ ] New quiz starts after abandoning

## Test 6: Timer Expiration

1. **Start a quiz**
2. **Don't select any answer**
3. **Wait for timer to reach 0**
4. **Expected behavior**:
   - Auto-submits with null answer
   - Marks as incorrect
   - Shows correct answer
   - Moves to next question

### What to Check:
- [ ] Timer reaches 0
- [ ] Auto-submission occurs
- [ ] Marked as incorrect
- [ ] Correct answer shown
- [ ] Explanation displays
- [ ] Moves to next question

## Test 7: Error Handling

### Test 7a: No Questions Available
1. **Try to start quiz** for article with no questions
2. **Expected behavior**:
   - Error message: "No quiz questions available for this article yet."
   - Option to go back to home
   - Option to try again

### Test 7b: Network Error
1. **Disconnect internet** or block API
2. **Try to start quiz**
3. **Expected behavior**:
   - Error message displays
   - Retry option available
   - No crash or blank screen

### What to Check:
- [ ] Error messages display clearly
- [ ] Retry functionality works
- [ ] No console errors
- [ ] Graceful degradation

## 🔍 Debugging Checklist

### Check Browser Console
```javascript
// Should see these logs:
// - API calls with status codes
// - No red errors
// - Token being sent in headers
```

### Check Network Tab
```
Expected API calls in order:
1. GET /quiz/sessions/active
2. GET /quiz/questions/content/{id}
3. GET /quiz/stats/me
4. POST /quiz/sessions/start
5. POST /quiz/sessions/{id}/answer (multiple times)
6. POST /quiz/sessions/{id}/complete
```

### Check Request Headers
```
Authorization: Bearer {cognito_jwt_token}
Content-Type: application/json
```

### Check Request Bodies

**Start Session:**
```json
{
  "contentId": "article-uuid"
}
```

**Submit Answer:**
```json
{
  "questionId": "question-uuid",
  "selectedOptionIndex": 1,
  "timeSpent": 15
}
```

## 🐛 Common Issues & Solutions

### Issue: "Failed to start quiz session"
**Possible causes:**
- Invalid contentId
- No questions for article
- Token expired
- Backend not running

**Solution:**
- Check console for exact error
- Verify article has questions in backend
- Check token in localStorage
- Verify backend API is accessible

### Issue: Questions not loading
**Possible causes:**
- Article has no questions
- Wrong contentId format
- API endpoint mismatch

**Solution:**
- Check network tab for 404 errors
- Verify contentId matches backend format
- Check API base URL in quizService.js

### Issue: Answers not submitting
**Possible causes:**
- Invalid session ID
- Session expired
- Network error

**Solution:**
- Check session ID in state
- Verify session is still active
- Check network connectivity

### Issue: Explanation not showing
**Possible causes:**
- Backend not returning explanation field
- Question missing explanation
- Frontend not displaying correctly

**Solution:**
- Check API response in network tab
- Verify question has explanation field
- Check console for rendering errors

## 📊 Expected API Responses

### Get Questions Response
```json
[
  {
    "id": "q1-uuid",
    "questionText": "What is dialectics?",
    "options": ["A", "B", "C", "D"],
    "difficulty": "MEDIUM",
    "explanation": "Explanation text",
    "contentId": "article-uuid"
  }
]
```

### Start Session Response
```json
{
  "id": "session-uuid",
  "contentId": "article-uuid",
  "userId": "user-uuid",
  "status": "IN_PROGRESS",
  "score": 0,
  "currentStreak": 0,
  "answeredQuestions": 0
}
```

### Submit Answer Response
```json
{
  "correct": true,
  "correctOptionIndex": 1,
  "pointsEarned": 25,
  "explanation": "Explanation text"
}
```

### Complete Session Response
```json
{
  "session": { ... },
  "totalScore": 250,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "accuracy": 80,
  "averageTimePerQuestion": 18,
  "ratingChange": 15,
  "newRating": 1365
}
```

## ✅ Success Criteria

Quiz integration is successful when:
- [ ] Can start quiz from any post
- [ ] Questions load from backend
- [ ] Can answer all questions
- [ ] Answers submit to backend
- [ ] Explanations display correctly
- [ ] Quiz completes successfully
- [ ] Results display accurately
- [ ] Active sessions detected
- [ ] Errors handled gracefully
- [ ] No console errors
- [ ] All API calls succeed

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check network tab for failed requests
3. Verify token in localStorage
4. Check API base URL
5. Verify backend is running
6. Check question format in backend

---

**Ready to Test!** 🎉

Start by clicking "Take Quiz" on any post and follow the test scenarios above.