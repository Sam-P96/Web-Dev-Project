# Git Workflow: Merging a Feature Branch into `main`

A simple, team-friendly process for getting changes from a feature branch into `main` via Pull Requests on GitHub.

> **Golden rule:** Never code on or push directly to `main`. Everything goes through a branch and a Pull Request.

---

## 1. Create a branch from the latest `main`

```bash
git checkout main
git pull origin main
git checkout -b feature/feature-name
```

Always pull `main` before branching. Otherwise you're building on outdated code and will likely hit conflicts later.

**Branch naming tips:**

| Prefix      | Use for                  | Example                  |
|-------------|--------------------------|--------------------------|
| `feature/`  | New functionality        | `feature/signup-form`    |
| `fix/`      | Bug fixes                | `fix/login-redirect`     |
| `refactor/` | Code cleanup, no new behavior | `refactor/use-field-hook` |
| `docs/`     | Documentation only       | `docs/readme-setup`      |

---

## 2. Code and commit

```bash
git add .
git commit -m "Add signup form"
```

- Keep each commit focused on one change.
- Write clear, imperative messages (e.g. `Add`, `Fix`, `Update`, not `added stuff`).

---

## 3. Push the branch to GitHub

```bash
git push -u origin feature/feature-name
```

The `-u` flag sets the upstream, so later you can just run `git push`.

---

## 4. Open a Pull Request

After pushing, GitHub shows a **Compare & pull request** button.

1. Set **base:** `main` ← **compare:** `feature/feature-name`
2. Write a short description: what changed and why.
3. Assign reviewers (if working in a team).
4. Click **Create pull request**.

---

## 5. Keep the branch up to date with `main`

If the PR shows conflicts, or `main` has received new commits since you branched:

```bash
git checkout main
git pull origin main
git checkout feature/feature-name
git merge main
# resolve any conflicts in your editor, then:
git add .
git commit
git push
```

If there are no conflicts, you can simply click **Update branch** on the PR page instead.

---

## 6. Review and merge

Once the PR is approved (or you've verified it yourself):

1. Click **Merge pull request** on GitHub.
2. Choose a merge method:
   - **Squash and merge** (recommended for teams): combines all branch commits into one clean commit on `main`.
   - **Create a merge commit**: keeps the full branch history.
   - **Rebase and merge**: replays commits on top of `main` for a linear history.

---

## 7. Clean up

Click **Delete branch** on GitHub, then locally:

```bash
git checkout main
git pull origin main
git branch -d feature/feature-name
```

---

## Checking which branches are merged (GitHub UI)

- **Pull requests tab:** search `is:pr is:merged base:main` to list every PR merged into `main`. Add filters like `author:username` or `merged:>2026-09-01`.
- **Branches page** (`github.com/<user>/<repo>/branches`): a purple **Merged** badge means the branch's PR was merged. A branch with **Ahead = 0** has no commits missing from `main` and is safe to delete.
- **Insights → Network:** visual graph of branches splitting off and merging back.

> Note: the PR filter only catches branches merged **through a PR**. If someone merged locally and pushed straight to `main`, rely on the **Ahead = 0** column instead.

---

## Recommended repo settings

- **Settings → General → Automatically delete head branches:** branches are deleted automatically after their PR is merged.
- **Settings → Branches → Branch protection rule for `main`:**
  - Require a pull request before merging
  - Require at least 1 approval
  - Block direct pushes and force pushes

---

## Quick reference

```bash
# start
git checkout main && git pull origin main
git checkout -b feature/feature-name

# work
git add . && git commit -m "Describe the change"
git push -u origin feature/feature-name

# sync with main if needed
git checkout main && git pull origin main
git checkout feature/feature-name && git merge main
git push

# after merge on GitHub
git checkout main && git pull origin main
git branch -d feature/feature-name
```
