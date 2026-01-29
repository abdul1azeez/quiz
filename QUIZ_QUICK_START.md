# MINE Quiz - Quick Start Guide

## 🚀 For Beginners

### Step 1: Start Your Development Server
```bash
npm run dev
```
This will start your website locally (usually at `http://localhost:5173`)

### Step 2: Test the Quiz System

#### Option A: From a Post (Recommended)
1. Open your browser to `http://localhost:5173`
2. Scroll through the home feed
3. Look for the **"Take Quiz"** button on any post (green button with brain icon)
4. Click it to start a quiz for that specific article

#### Option B: From Navigation
1. Look at the left sidebar
2. Click the **Trophy icon** labeled "Quiz"
3. This opens the general quiz page

#### Option C: Direct URL
1. Type in browser: `http://localhost:5173/quiz`
2. Or for leaderboards: `http://localhost:5173/quiz/leaderboards`

### Step 3: Take a Quiz

1. **Select Difficulty**:
   - Easy (10 points)
   - Medium (20 points)
   - Hard (30 points)
   - Mixed (all levels) ← NEW!

2. **Click "Start Quiz"**

3. **Answer Questions**:
   - You have 30 seconds per question
   - Click an answer option
   - See immediate feedback (green = correct, red = wrong)
   - Read the explanation below the correct answer ← NEW!
   - Click "Next Question" or wait for auto-advance

4. **View Results**:
   - See your score, accuracy, and stats
   - Click "Play Again" or "View Leaderboards"

## 🎨 What's New?

### 1. Quiz Button on Every Post ✨
- **Where**: Right side of each post, next to read time
- **Look**: Green button with brain icon
- **What it does**: Opens a quiz specific to that article

### 2. Answer Explanations 📚
- **When**: After you select an answer
- **Where**: Below the correct answer option
- **Look**: Green box with explanation text

### 3. Mixed Difficulty 🎲
- **Where**: Quiz menu, 4th option
- **What it does**: Gives you questions of all difficulty levels
- **Why**: More variety and balanced challenge

### 4. New Color Scheme 🎨
- Everything now matches your website's green theme
- Primary green: `#04644C`
- Success green: `#1DB45F`

## 🔍 Where to Find Things

### Quiz Features
- **Home Page**: Quiz cards appear every 8 posts in feed
- **Navigation**: Trophy icon in left sidebar
- **Each Post**: "Take Quiz" button on right side
- **Leaderboards**: Click "View Leaderboards" from any quiz page

### Files (For Developers)
```
src/
├── pages/desktop/
│   ├── QuizPage.jsx              # Main quiz interface
│   └── LeaderboardsPage.jsx      # Rankings
├── components/desktop/postSection/
│   └── PostQuizButton.jsx        # Button on each post
└── services/
    └── quizService.js            # API calls (set USE_MOCK_DATA here)
```

## 🐛 Troubleshooting

### "I don't see the quiz button on posts"
- Make sure your dev server is running (`npm run dev`)
- Refresh your browser (Ctrl+R or Cmd+R)
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### "Quiz doesn't load"
- Check browser console (F12 → Console tab)
- Verify you're using mock data: Check `USE_MOCK_DATA = true` in `src/services/quizService.js`

### "Colors look wrong"
- Clear browser cache
- Check that Tailwind CSS is compiling correctly
- Restart dev server

### "Navigation quiz icon not showing"
- The Trophy icon should appear in left sidebar
- If not, check `src/constants/navLinks.js` has the quiz entry
- Restart dev server

## 📊 Testing Checklist

- [ ] Can see quiz button on posts
- [ ] Quiz button opens quiz page
- [ ] Can select "Mixed" difficulty
- [ ] Questions load and display
- [ ] Timer counts down from 30
- [ ] Can select answers
- [ ] Explanation appears after answer selection
- [ ] Can advance to next question
- [ ] Results page shows stats
- [ ] Leaderboards display correctly
- [ ] Colors match website theme (green)

## 🔄 When Backend is Ready

1. Open `src/services/quizService.js`
2. Find line 6: `const USE_MOCK_DATA = true;`
3. Change to: `const USE_MOCK_DATA = false;`
4. Save file
5. Refresh browser

Your quiz will now use real API data!

## 💡 Tips

- **Practice Mode**: Current mock data is perfect for testing
- **Streak Building**: Answer correctly in a row to build streaks
- **Time Bonus**: Answer quickly (under 10s) for bonus points
- **Leaderboards**: Check your ranking against others

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Verify dev server is running
3. Make sure all files are saved
4. Try clearing browser cache
5. Restart dev server

---

**Ready to Quiz!** 🎉

Start your dev server and navigate to any post to see the new quiz button!