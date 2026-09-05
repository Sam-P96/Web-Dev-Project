# First-Time Setup — Auto Tori

For anyone who hasn't set up a shared GitHub project before.
Follow it top to bottom once. Takes about 30 minutes. Stuck anywhere → ask in the group chat, don't sit quiet.

After this, use `GIT-WORKFLOW.md` for daily work.

---

## What you need to install

| Tool           | Why                        | Where                         |
| -------------- | -------------------------- | ----------------------------- |
| Git            | Talks to GitHub            | https://git-scm.com/downloads |
| Node.js (LTS)  | Runs React and the backend | https://nodejs.org            |
| VS Code        | Code editor                | https://code.visualstudio.com |
| GitHub account | Access the repo            | https://github.com            |

On Windows, the Git installer gives you **Git Bash**. Use that for every command below.
On macOS/Linux, use the normal Terminal.

---

## Step 1 — Check the installs worked

Open your terminal and run these one at a time:

```bash
git --version
node --version
npm --version
```

Each should print a version number. Node should be **v18 or higher**.

If you get "command not found", the install didn't finish — close the terminal, reopen it, and try again. Still nothing → reinstall.

---

## Step 2 — Tell Git who you are

⚠️ **Don't skip this.** Our contribution document at the end of the sprint is built from commit history. If your name isn't set correctly, your work shows up as someone else's or as "unknown", and you lose credit for it.

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@metropolia.fi"
```

Use the **same email as your GitHub account**, otherwise GitHub won't link the commits to your profile.

Check it worked:

```bash
git config --global user.name
git config --global user.email
```

---

## Step 5 — Clone the repo

Pick a folder where you keep projects, then:

```bash
cd ~/Documents          # or wherever you want it
git https://github.com/Sam-P96/Web-Dev-Project.git
cd Web-Dev-Project
```

*(Sam posted the exact URL in the group chat.)*

Check you're in the right place:

```bash
git status
```

Should say `On branch main` and `nothing to commit, working tree clean`.

---

## Step 6 — Install project dependencies

The repo has two folders. Install in whichever one you're working in — or both, if you want to run everything.

**Frontend (Aakash, Ridhi)**

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`. Ctrl+C in the terminal to stop it.

**Backend (Sam, Mon)**

```bash
cd backend
npm install
npm run dev
```

Runs at `http://localhost:3000`. Ctrl+C to stop.

> If the folders don't exist yet, the project hasn't been scaffolded — that's a task for the first days of the sprint. Skip this step and come back after it's done.

**Never commit `node_modules`.** It's huge and it's already in `.gitignore`. If you see it appear in `git status`, tell the group chat — something's wrong with the ignore file.

---

## Step 7 — Practice run (do this before your real work)

Let's do one full cycle on something harmless, so your first real PR isn't your first ever PR.

**7.1 — Start from fresh main**

```bash
git checkout main
git pull
```

**7.2 — Create a branch**

```bash
git checkout -b feature/fe-setup-yourname
```

Use `fe` or `be` depending on your track. Example: `feature/be-setup-sam`

**7.3 — Make a tiny change**

Open `README.md` in VS Code. Find the team list (or add one) and put your name on a line:

```
- Ridhi — Frontend
```

Save the file.

**7.4 — Commit it**

```bash
git add .
git commit -m "Add Ridhi to team list in README"
```

**7.5 — Push it**

```bash
git push origin feature/fe-setup-yourname
```

**7.6 — Open a Pull Request**

1. Go to the repo on GitHub
2. You'll see a yellow banner with **"Compare & pull request"** — click it
3. Base: `main` ← Compare: your branch
4. Title: `Add [your name] to team list`
5. Assign your reviewer: Aakash ↔ Ridhi, Sam ↔ Mon
6. **Create pull request**
7. Post the link in the group chat

**7.7 — Get it merged**

Your reviewer opens it, clicks **Merge pull request**, then **Delete branch**.

**7.8 — Clean up locally**

```bash
git checkout main
git pull
git branch -d feature/fe-setup-yourname
```

That's the entire workflow you'll repeat all sprint. If this worked, you're set up.

---

## Step 8 — Useful VS Code extensions

Optional but they save time.

**Everyone**
- **GitLens** — shows who wrote each line and when
- **Prettier** — auto-formats code so our files don't get messy diffs

**Frontend**
- **ES7+ React snippets** — shortcuts for component boilerplate
- **Tailwind CSS IntelliSense** — autocompletes Tailwind classes

**Backend**
- **Thunder Client** or **Postman** — test API endpoints (we need Postman for the sprint anyway)
- **MongoDB for VS Code** — browse the database once we get to it

---
## If something goes wrong

**`Permission denied` or `403` when pushing**
You're not a collaborator yet, or you used your password instead of the token. Check the invite, redo Step 4.

**`fatal: not a git repository`**
You're in the wrong folder. `cd` into `auto-tori` first.

**`npm install` fails**
Node is too old, or the install is broken. Check `node --version` — needs v18+. Reinstall from nodejs.org if needed.

**Port already in use**
Something's already running on that port. Close the other terminal, or find and kill the process.

**Anything else**
Screenshot the full error and post it in the group chat. Include the command you ran. Don't spend an hour stuck — everyone here is learning this at the same time.
