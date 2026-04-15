# Chatbot Integration Guide

## Current Status
The ERP system is now running on Next.js with MongoDB. The chatbot system exists as a separate module in the `ChatBot/` directory.

## Integration Options

### Option 1: Embed Chatbot in Next.js (Recommended)
Integrate the existing chatbot into the Next.js app as a floating widget.

**Steps:**
1. Extract chatbot logic from `ChatBot/` directory
2. Create `/app/components/Chatbot.tsx` - floating chat widget
3. Integrate into `/app/layout.tsx` for all pages
4. Create `/api/chatbot/` endpoints for backend logic

**Example Implementation:**
```tsx
// components/Chatbot.tsx
"use client";
import { useState } from "react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Chat messages here */}
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="...">
        💬
      </button>
    </div>
  );
}
```

### Option 2: Standalone Chatbot Service
Keep chatbot as separate service and call via API from Next.js.

**Architecture:**
- Next.js ERP on port 3000
- Chatbot API on port 5000
- Next.js calls chatbot API on demand

**API Endpoint:**
```typescript
// /api/chat/route.ts
export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const response = await fetch('http://localhost:5000/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  });
  return response;
}
```

### Option 3: Microservice with Docker Compose
Deploy both services together.

```yaml
# docker-compose.yml
version: '3.8'
services:
  erpsys:
    build: ./erpsys-nextjs
    ports:
      - "3000:3000"
  chatbot:
    build: ./ChatBot
    ports:
      - "5000:5000"
```

---

## Next Steps

1. **Review existing chatbot code** in `ChatBot/` directory
2. **Choose integration approach** (Option 1 recommended for simplicity)
3. **Extract and adapt chatbot logic**
4. **Add to Next.js components**
5. **Test integration**
6. **Deploy together**

## Resources
- Existing chatbot directory: `ChatBot/`
- Next.js app: `erpsys-nextjs/`
- Documentation: `DEPLOYMENT.md`

---

## TO DO (Chatbot Integration Tasks)

- [ ] Analyze chatbot code structure
- [ ] Create chatbot component in Next.js
- [ ] Add chat API endpoints
- [ ] Implement message history storage
- [ ] Add user context (student/admin) to chatbot
- [ ] Test chatbot with real users
- [ ] Add to deployment pipeline

**Status:** Ready for implementation after team reviews integration approach.
