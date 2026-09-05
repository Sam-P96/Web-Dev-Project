# Git Workflow — Auto Tori

How we work together in one repo during Sprint 2.
Written for people who haven't used Git in a team before. Read it once, then keep it open while you work.

---

## 1. The idea in one picture

```
main                ●────────●──────────────●──────────●
                     \      /                \        /
feature/be-car-crud   ●────●                  \      /
                                               \    /
feature/fe-navbar                               ●──●
```

- **`main`** is the shared, working version of the project. It should always run.
- **Feature branches** are your own private copy where you build one thing. Nothing you do there affects anyone else.
- When your thing works, you merge it back into `main` through a Pull Request.

**Nobody pushes directly to `main`. Ever.** That's the one rule that keeps this from falling apart.

---

## 2. Our three branch types

| Branch         | Who uses it                                 | Example               |
| -------------- | ------------------------------------------- | --------------------- |
| `main`         | Everyone pulls from it, nobody pushes to it | `main`                |
| `feature/fe-*` | Frontend (Aakash, Ridhi)                    | `feature/fe-navbar`   |
| `feature/be-*` | Backend (Sam, Mon)                          | `feature/be-car-crud` |

**Naming rules**
- Always start with `feature/fe-` or `feature/be-`
- Short, lowercase, hyphens between words
- Describe the task, not yourself — `feature/fe-login-form`, not `feature/fe-ridhi`

Good: `feature/be-appointment-model` · `feature/fe-offer-list`
Bad: `myBranch` · `feature/test2` · `feature/fe_Navbar_final_FINAL`

**One branch = one task.** If your branch does five things, it will be painful to merge.

---

## 3. Setup — once per person

```bash
git clone <repo-url>
cd auto-tori
```

Check your name and email are set, so commits are credited to you:

```bash
git config user.name "Your Name"
git config user.email "your.email@metropolia.fi"
```

> ⚠️ This matters. The contribution document we submit at the end is built from commit history. If your commits show the wrong name, your work doesn't count as yours.

---

## 4. The daily loop

This is the whole workflow. Five steps, repeated for every task.

### Step 1 — Start from fresh `main`

```bash
git checkout main
git pull
```

**Never skip the pull.** If you branch off an old `main`, your merge later will be messy.

### Step 2 — Create your branch

```bash
git checkout -b feature/be-car-crud
```

`-b` means "create it and switch to it". You are now on your own branch.

### Step 3 — Work and commit

Write some code, then:

```bash
git add .
git commit -m "Add Car model and controller"
```

Commit **often** — at least once or twice a day, whenever a small piece works. Don't save everything for one giant commit at the end.

Commit messages: English, present tense, describe what the commit does.

Good: `Add validation to car submission form` · `Fix broken route for offers`
Bad: `update` · `fix` · `asdasd` · `final version`

### Step 4 — Push your branch

```bash
git push origin feature/be-car-crud
```

First push of a new branch needs the full form above. After that, `git push` alone works.

Push at the end of every working session, even if unfinished. Code only on your laptop is code that can be lost.

### Step 5 — Open a Pull Request when the task is done

1. Go to the repo on GitHub — you'll see a green **"Compare & pull request"** button
2. Click it. Base branch = `main`, compare = your branch
3. Title: what the task was
4. Description: what you built, anything the reviewer should know
5. Assign a reviewer:
   - **Aakash ↔ Ridhi** review each other
   - **Sam ↔ Mon** review each other
6. Post the PR link in the group chat

The reviewer reads it, comments if needed, then clicks **Merge**. After merging, delete the branch (GitHub offers a button).

Then go back to Step 1 for your next task. **Don't keep working on a merged branch.**

---

## 5. Reviewing someone's PR

You don't need to be an expert. Spend 5–10 minutes and check:

- Does it do what the task said?
- Is anything obviously broken or left over (console.logs, commented-out junk, unused files)?
- Are the file and variable names understandable?
- Did they accidentally include something out of scope for Sprint 2?

If it's fine → approve and merge.
If something's off → leave a comment. That's normal and not an insult; it's the whole point of review.

Don't leave a PR sitting for days. Review within 24 hours if you can — the author is blocked until it's merged.

---

## 6. Common situations

### "Someone merged to `main` while I was working"

Normal. Bring their changes into your branch:

```bash
git checkout main
git pull
git checkout feature/be-car-crud
git merge main
```

Do this every couple of days so you never drift far from `main`.

### "I got a merge conflict"

This happens when two people edited the same lines in the same file. Git marks it in the file like this:

```
<<<<<<< HEAD
your version
=======
their version
>>>>>>> main
```

Open the file, decide what the final code should be, delete all three marker lines, then:

```bash
git add .
git commit -m "Resolve merge conflict in server.js"
```

Not a disaster. But if you're unsure, ask in the group chat before guessing — especially on shared files.

### "I started coding but forgot to create a branch"

You're on `main` with uncommitted changes. Fix:

```bash
git checkout -b feature/fe-navbar
```

Your changes come with you. Commit as normal.

### "Which branch am I on?"

```bash
git status
```

Run this whenever you're unsure. It shows your branch and what's changed. When in doubt, `git status` first.

---

## 7. Avoiding conflicts in the first place

Merge conflicts are mostly preventable. Two habits:

**Split files clearly.** Frontend and backend live in separate folders, so those two tracks basically never collide. Within a track, split by page or module — don't have two people editing the same component.

**Keep branches short.** A branch that lives 1–2 days merges cleanly. A branch that lives 10 days will fight you.

If you and a teammate need to touch the same file, say so in the daily standup and agree who goes first.

---

## 8. Rules we agreed on

1. **No direct pushes to `main`** — everything goes through a Pull Request
2. **One branch per task**, named `feature/fe-*` or `feature/be-*`
3. **Every PR gets one reviewer** from your own track before merging
4. **Pull `main` before starting** any new branch
5. **Commit daily**, push daily, in English
6. **Delete your branch** after it's merged

---

## 9. Cheat sheet

```bash
git status                          # where am I, what changed
git checkout main                   # switch to main
git pull                            # get latest team code
git checkout -b feature/fe-navbar   # create + switch to new branch
git add .                           # stage all changes
git commit -m "message"             # save a snapshot
git push origin feature/fe-navbar   # upload branch (first time)
git push                            # upload (after first time)
git branch                          # list local branches
git checkout feature/fe-navbar      # switch to an existing branch
git merge main                      # bring main's changes into your branch
git log --oneline                   # see commit history
```

---

## 10. Why we bother

Beyond not breaking each other's code: the Sprint 2 brief requires a document showing **what each team member contributed**, with commit history and pull requests as evidence.

If we all push to `main` with vague commit messages, we can't prove who did what, and everyone's grade suffers. If we follow this workflow, that evidence builds itself — we just export it at the end.

---

*Questions → ask in the group chat. Nobody here is expected to already know this.*
