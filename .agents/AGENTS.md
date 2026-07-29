# Git Collaboration Rules

1. Never modify files outside your assigned folders.
2. Never rename shared files.
3. Never move folders.
4. Never delete anything created by the other developer.
5. If an interface changes, document it instead of modifying the other side.
6. Backend owns:
   - API
   - Database
   - AI
   - Storage
7. Frontend owns:
   - UI
   - Components
   - Routing
   - Styling
8. Communication between frontend and backend must happen ONLY through REST APIs.
9. Keep API contracts stable:
   - Request format
   - Response format
   - HTTP status codes
10. If a feature depends on unfinished work from the other developer, create a TODO placeholder instead of changing their code.
11. Commit frequently with clear messages:
   - feat(frontend): add lost item form
   - feat(backend): implement semantic search
   - fix(api): improve match response
12. Before pulling changes:
   - git add .
   - git commit -m "your message"
   - git pull --rebase origin main
   - Resolve conflicts carefully.
   - git push origin main
13. Never force push (`git push --force`).
14. The project must always remain runnable after every commit.
