# MINE Quiz System - Updated Implementation

## 🎨 Key Updates

### 1. **Per-Post Quiz Buttons**
Each post now has a "Take Quiz" button that generates AI-powered quizzes specific to that article.

**Implementation:**
- `PostQuizButton.jsx` component added to each post
- Routes to `/quiz/:postId` with post context
- Backend API will receive `postId` parameter for AI-generated questions

**API Integration:**
```javascript
// When user clicks quiz button on a post
GET /quiz/questions/random?count=10&difficulty=medium&postId=abc123

// Backend should return AI-generated questions specific to that post
```

### 2. **Answer Explanations**
When a user selects an answer, the correct answer is highlighted with an explanation displayed below it.

**Features:**
- Explanation appears immediately after answer selection
- Styled with green background and left border
- Shows below the correct answer option
- Includes "Explanation:" label for clarity

**API Response Format:**
```json
{
  "id": 1,
  "question": "What is dialectics?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 1,
  "difficulty": "medium",
  "explanation": "Dialectics is a way of thinking that focuses on how opposing forces interact..."
}
```

### 3. **Mixed Difficulty Option**
Added "Mixed" difficulty option alongside Easy, Medium, and Hard.

**Behavior:**
- Selecting "Mixed" sends `difficulty=null` to API
- Backend should return questions of all difficulty levels
- Provides variety and balanced challenge

**Difficulty Options:**
- **Easy**: 10 base points
- **Medium**: 20 base points  
- **Hard**: 30 base points
- **Mixed**: All difficulty levels (Curated experience)

### 4. **Consistent Color Scheme**
All quiz components now match the website's design system.

**Color Palette Used:**
```css
Primary: #04644C (Brand green)
Secondary: #1DB45F (Success green)
Text Primary: #000A07
Text Secondary: #323E3A
Text Tertiary: #5C6261
Surface: #FFFFFF
Background: #f9fafb
Stroke: #EDEDED
```

**Updated Components:**
- Quiz menu page
- Quiz playing interface
- Results page
- Leaderboards page
- Quiz buttons and cards

## 📁 New Files Created

```
src/
├── components/desktop/postSection/
│   └── PostQuizButton.jsx          # Quiz button for each post
├── pages/desktop/
│   ├── QuizPage.jsx                # Updated with new features
│   └── LeaderboardsPage.jsx        # Updated styling
└── services/
    └── quizService.js              # Updated API calls
```

## 🔌 API Endpoints Required

### Quiz Questions (Per-Post)
```
GET /quiz/questions/random?count=10&difficulty=medium&postId={postId}

Response:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 1,
      "difficulty": "medium",
      "explanation": "This is why B is correct...",
      "category": "Philosophy"
    }
  ]
}
```

### Submit Quiz Answers (Per-Post)
```
POST /quiz/submit

Body:
{
  "postId": "abc123",  // Optional: links quiz to specific post
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": 1,
      "isCorrect": true,
      "timeSpent": 15,
      "points": 25
    }
  ]
}

Response:
{
  "success": true,
  "totalPoints": 250,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "ratingChange": +15,
  "newRating": 1365
}
```

## 🎯 User Flow

### Taking a Post-Specific Quiz

1. **User sees post** with "Take Quiz" button
2. **Clicks button** → Navigates to `/quiz/{postId}`
3. **Sees quiz menu** with post title context
4. **Selects difficulty** (Easy, Medium, Hard, or Mixed)
5. **Starts quiz** → Backend generates AI questions for that post
6. **Answers questions** with 30-second timer
7. **Sees explanation** immediately after selecting answer
8. **Views results** with score, accuracy, and stats
9. **Can retry** or view leaderboards

### Visual Feedback Flow

```
Question Display
    ↓
User Selects Answer
    ↓
Answer Highlighted (Green=Correct, Red=Wrong)
    ↓
Explanation Appears Below Correct Answer
    ↓
"Next Question" Button Appears
    ↓
Auto-advance after 2.5 seconds
```

## 🎨 Design Specifications

### Quiz Button on Posts
- **Position**: Right side of action bar, next to read time
- **Style**: Green outline button with brain icon
- **Hover**: Darker green background
- **Colors**: `#04644C` (primary green)

### Explanation Box
- **Background**: `bg-green-50`
- **Border**: `border-l-4 border-green-500`
- **Text**: `text-green-800`
- **Padding**: `p-3`
- **Margin**: `mt-2 ml-4`

### Difficulty Selector
- **Layout**: 4-column grid (responsive to 2 columns on mobile)
- **Active State**: Green border and background tint
- **Inactive State**: Gray border with hover effect
- **Border Radius**: `rounded-xl`

## 🔄 State Management

### Quiz States
1. **menu**: Initial state, select difficulty
2. **playing**: Active quiz with timer
3. **results**: Final score and statistics

### Answer States
- `selectedAnswer === null`: No answer selected yet
- `selectedAnswer !== null`: Answer selected, show feedback
- `showExplanation === true`: Display explanation below correct answer

## 📱 Responsive Design

All components are fully responsive:
- **Mobile**: Single column layout, stacked buttons
- **Tablet**: 2-column grids, compact spacing
- **Desktop**: Full layout with optimal spacing

## 🧪 Testing Checklist

- [ ] Quiz button appears on each post
- [ ] Clicking quiz button navigates to quiz page with post context
- [ ] Post title displays in quiz menu
- [ ] Mixed difficulty option works correctly
- [ ] Explanations appear after answer selection
- [ ] Explanations only show for correct answer
- [ ] Color scheme matches website design
- [ ] Responsive layout works on all screen sizes
- [ ] Timer counts down correctly
- [ ] Auto-advance works after answer selection
- [ ] Results page displays accurate statistics
- [ ] Leaderboards maintain consistent styling

## 🚀 Next Steps for Backend Integration

1. **Implement AI Question Generation**
   - Use post content to generate relevant questions
   - Ensure questions test comprehension of article
   - Generate explanations for each correct answer

2. **Store Post-Quiz Relationships**
   - Track which quizzes belong to which posts
   - Enable post-specific leaderboards (future feature)
   - Analytics on quiz performance per article

3. **Explanation Generation**
   - AI should generate clear, concise explanations
   - Explanations should reference article content
   - Keep explanations under 2-3 sentences

4. **Mixed Difficulty Logic**
   - When `difficulty=null`, return balanced mix
   - Suggest: 3 easy, 4 medium, 3 hard questions
   - Randomize order for variety

## 📊 Analytics Opportunities

With per-post quizzes, you can track:
- Which articles generate most quiz engagement
- Average quiz scores per article (content difficulty indicator)
- User comprehension rates by topic
- Most challenging questions/concepts
- Time spent on quizzes vs reading

---

**Status**: ✅ Ready for backend API integration
**Mock Data**: Currently using sample data for testing
**Production Ready**: Set `USE_MOCK_DATA = false` in `quizService.js` when APIs are ready