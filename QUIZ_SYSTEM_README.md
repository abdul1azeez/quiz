# MINE Quiz System - Proof of Concept

A standalone quiz system with leaderboards, rating system, and admin management capabilities.

## 🎯 Features Implemented

### For Users
- ✅ Take quizzes on articles with random questions
- ✅ Get immediate feedback on answers
- ✅ Track personal statistics (rating, points, streaks)
- ✅ View global rankings across multiple categories
- ✅ Compete on leaderboards (Rating, Points, Streak, Accuracy)
- ✅ Earn ELO-based rating and skill levels
- ✅ Build answer streaks with bonus points
- ✅ Time-based scoring with bonuses

### For Admins
- ✅ Create quiz questions with multiple choice answers
- ✅ Bulk import questions via JSON
- ✅ Update/delete existing questions
- ✅ View question statistics and performance
- ✅ Set difficulty levels (Easy, Medium, Hard)
- ✅ Categorize questions by topic

### For Everyone (Public)
- ✅ View leaderboards (all types)
- ✅ See top performers with podium display
- ✅ Check user statistics and rankings
- ✅ Discover competitive users

## 📈 Rating & Leveling System

### ELO Rating Algorithm
- **Starting Rating**: 1000
- **K-Factor**: 32
- **Difficulty Ratings**: Easy (800), Medium (1200), Hard (1600)
- **Dynamic Updates**: Rating changes based on performance vs expected difficulty

### 7 Skill Levels
| Level | Rating Range | Description |
|-------|--------------|-------------|
| BEGINNER | 0-999 | Just starting out |
| NOVICE | 1000-1199 | Learning the basics |
| INTERMEDIATE | 1200-1399 | Solid understanding |
| ADVANCED | 1400-1599 | Strong performer |
| EXPERT | 1600-1799 | Highly skilled |
| MASTER | 1800-1999 | Elite level |
| GRANDMASTER | 2000+ | Top tier |

### Points System
- **Easy**: 10 points (base)
- **Medium**: 20 points (base)
- **Hard**: 30 points (base)
- **Time Bonus**: +5 (≤10s), +2 (≤20s)
- **Streak Bonus**: (streak/3) × 2 points (for streaks ≥3)

## 🗂️ File Structure

```
src/
├── pages/desktop/
│   ├── QuizPage.jsx              # Main quiz interface
│   └── LeaderboardsPage.jsx      # Leaderboards with multiple tabs
├── pages/admin/
│   └── QuizManagement.jsx        # Admin question management
├── components/desktop/
│   └── QuizButton.jsx            # Home page quiz button
├── services/
│   └── quizService.js            # API service layer
└── data/
    └── sampleQuizData.js         # Mock data for testing
```

## 🚀 Routes Added

### User Routes
- `/quiz` - Main quiz page
- `/quiz/leaderboards` - Leaderboards page

### Admin Routes
- `/admin/quiz` - Quiz question management

## 🎮 How to Use

### Taking a Quiz
1. Navigate to `/quiz` or click the quiz button on home page
2. Select difficulty level (Easy, Medium, Hard)
3. Click "Start Quiz" to begin
4. Answer questions within 30-second time limit
5. Get immediate feedback and see results
6. View updated stats and rating

### Viewing Leaderboards
1. Navigate to `/quiz/leaderboards`
2. Switch between tabs: Rating, Points, Streak, Accuracy
3. See top 3 performers in podium format
4. Browse full leaderboard table
5. Find your position (highlighted in blue)

### Admin Management
1. Navigate to `/admin/quiz` (admin access required)
2. View all questions with search and filters
3. Create new questions with the "Add Question" button
4. Edit existing questions by clicking the edit icon
5. Delete questions with confirmation
6. Bulk import questions via JSON file upload

## 🔧 Technical Implementation

### Mock Data Mode
Currently set to use mock data (`USE_MOCK_DATA = true` in `quizService.js`). 
To switch to real API:
1. Set `USE_MOCK_DATA = false` in `src/services/quizService.js`
2. Ensure backend API endpoints are available
3. Update API base URL if needed

### API Endpoints Expected
```
GET  /quiz/questions/random?count=10&difficulty=medium
POST /quiz/submit
GET  /quiz/stats/me
GET  /quiz/leaderboards?type=rating&limit=50
GET  /quiz/history?page=1&limit=20

# Admin endpoints
GET    /quiz/admin/questions?page=1&limit=20
POST   /quiz/admin/questions
PUT    /quiz/admin/questions/:id
DELETE /quiz/admin/questions/:id
POST   /quiz/admin/questions/bulk
GET    /quiz/admin/questions/:id/stats
```

### Sample Question Format
```json
{
  "id": 1,
  "question": "What is dialectics, according to Bartlett Gilman?",
  "options": [
    "A way of thinking that focuses on individual forces",
    "A way of thinking that focuses on how opposing forces interact",
    "A way of thinking that focuses on bringing between forces",
    "A way of thinking that focuses on the design of rich elites"
  ],
  "correctAnswer": 1,
  "difficulty": "easy",
  "category": "Philosophy",
  "explanation": "Dialectics is a way of thinking that focuses on how opposing forces interact..."
}
```

## 🎨 UI/UX Features

### Quiz Interface
- Gradient backgrounds for engaging experience
- Progress bar showing quiz completion
- Timer with visual urgency (red when < 10s)
- Immediate visual feedback on answer selection
- Streak and score tracking during quiz

### Leaderboards
- Podium display for top 3 performers
- Tabbed interface for different ranking types
- User highlighting (blue background for current user)
- Level badges with color coding
- Responsive design for mobile and desktop

### Admin Interface
- Search and filter functionality
- Pagination for large question sets
- Modal-based question editing
- Bulk import with JSON file support
- Question statistics display

## 🔮 Future Enhancements

1. **Question Categories**: Filter quizzes by topic/subject
2. **Timed Challenges**: Special quiz modes with different time limits
3. **Multiplayer**: Real-time quiz battles between users
4. **Achievements**: Badge system for various accomplishments
5. **Analytics**: Detailed performance analytics and insights
6. **Social Features**: Share results, challenge friends
7. **Mobile App**: Native mobile application
8. **Offline Mode**: Download questions for offline play

## 🐛 Testing

The system includes comprehensive mock data for testing all features without a backend. Sample data includes:
- 10 sample questions across different difficulties
- Mock user statistics
- Sample leaderboard data across all categories
- Realistic API response simulation with delays

## 📱 Responsive Design

All components are built with Tailwind CSS and are fully responsive:
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Accessible color schemes and typography

---

**Note**: This is a proof of concept implementation. For production use, ensure proper authentication, data validation, rate limiting, and security measures are in place.