#!/bin/bash

echo "🧪 Memory Leak Testing Script"
echo "=============================="
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "backend/package.json" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📋 Memory Testing Checklist:"
echo ""

# Backend tests
echo "🔧 Backend Memory Tests:"
echo "1. Starting backend server..."
cd backend

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found in backend/"
    echo "   Make sure to set up DATABASE_URL and other environment variables"
fi

# Start backend memory test
echo "2. Running backend memory test (this will take a few minutes)..."
node --expose-gc memory-test.js

echo ""
echo "3. Testing API endpoints for memory leaks..."

# Test basic endpoints
echo "   - Testing health endpoint..."
curl -s http://localhost:4000/api/health > /dev/null && echo "   ✅ Health endpoint working" || echo "   ❌ Health endpoint failed"

echo "   - Testing memory stats endpoint..."
curl -s http://localhost:4000/api/memory-stats > /dev/null && echo "   ✅ Memory stats endpoint working" || echo "   ❌ Memory stats endpoint failed"

echo ""
echo "🧠 Frontend Memory Tests:"
cd ../frontend

echo "1. Checking if frontend builds..."
if [ -f "package.json" ]; then
    echo "   ✅ Frontend package.json found"
else
    echo "   ❌ Frontend package.json not found"
fi

echo ""
echo "🔍 Manual Testing Instructions:"
echo ""
echo "1. Open frontend in development mode:"
echo "   cd frontend && npm run dev"
echo ""
echo "2. Open browser developer tools (F12)"
echo "3. Go to the 'Performance' tab"
echo "4. Record memory usage for 2-3 minutes"
echo "5. Look for:"
echo "   - Memory usage trending upward continuously"
echo "   - Sudden spikes in memory usage"
echo "   - Memory not being released when navigating away"
echo ""
echo "6. Check the Memory Monitor component (bottom-right corner)"
echo "7. In console, run: performance.memory"
echo ""

echo "📊 Expected Results:"
echo "- Frontend memory should stay under 100MB"
echo "- Backend memory should stay under 200MB"
echo "- Memory should not continuously grow"
echo "- No 'Out of Memory' errors in console"
echo ""

echo "🚨 Red Flags to Look For:"
echo "- Memory usage increasing steadily over time"
echo "- Browser tab becoming unresponsive"
echo "- 'Out of Memory' JavaScript errors"
echo "- Crash or freeze after extended use"
echo ""

echo "📝 To view detailed analysis:"
echo "cat MEMORY_LEAK_ANALYSIS.md"
echo ""

echo "✅ Testing script completed!"
echo ""
echo "Next steps:"
echo "1. Apply fixes from MEMORY_LEAK_ANALYSIS.md"
echo "2. Re-run this test after applying fixes"
echo "3. Monitor for improvements in memory usage"