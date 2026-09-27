# AutoTori - Sprint 2 Ceremony Insights

## Sprint planning

**Sprint goal:** Build a working React frontend and an MVC backend separately, covering the whole flow from the seller submitting a car to the worker making an offer, using mock data, and agree on the interface between the two.

We split into two tracks:

- **Frontend:** Aakash and Ridhi
- **Backend:** Sam and Duy

Each user story was broken into a frontend task and a backend task, and we put them on Trello (Product Backlog → Sprint Backlog → In Progress → Done). We also set up branch rules: `main` is only updated through pull requests, with `feature/fe-*` branches for frontend work and `feature/be-*` for backend work. Duy wrote two git guides for people who hadn't used git in a team before.

## Daily scrum

- We had daily meetings of about 15-45 minutes. Each of us said what we did, what we'll do next, and if anything is blocking us.
- **Communicating progress:** having two tracks meant the frontend people didn't always know what the backend was doing. The daily scrum was where we caught up.
- **Blockers:** for example, on 8.9 Sam was stuck on how to handle images in the car schema. Aakash said he would help.
- **Coordinating work:** we noticed Aakash had already made the login page, which was Ridhi's task. So Ridhi focused on register, profile and the worker pages instead.
- **Changing the plan:**
  - The AI price model was taking too much time for something that isn't graded, so Sam (PO) moved it to Sprint 3 and suggested using an AI API instead.
  - Image storage was postponed because we couldn't decide between local and cloud.
- **What didn't work:** we only logged one daily scrum in the repo (`Daily-log.md`, 8.9). We also never really fixed one meeting time, so sometimes a meeting ran 45 minutes instead of 15.

We also had a Coding Marathon on 11.9. Each of us built a small practice app (Sam: BookCollectionManager, Ridhi: ContactListManager, Aakash: RecipeManager, Duy: SignupPage), and after that we held a Scrum meeting. Later we had an autonomous session where we went through a checklist: what's done, what's left, and what moves to Sprint 3.

## Sprint review

We showed the results in our presentation on 17.09.2026.

**Done**

- React frontend with routing, the homepage from the prototype, and the login, register, profile, submit car, booking and worker pages.
- Express MVC backend with Mongoose. It has 4 models and full CRUD, and everything was tested in Postman.

**Not done / moved to Sprint 3**

- Image storage (Multer)
- The AI price estimate
- A car detail page and filters
- A written interface agreement, which we only finished after the sprint

## Sprint retrospective (4Ls)

**Liked**

- Splitting into frontend and backend tracks meant nobody had to wait for anybody.
- Using Trello and PRs made it easy to see what was done.
- The Coding Marathon was fun and helped us practise before the real tasks.

**Learned**

- MVC in Express, and moving from array data to MongoDB/Mongoose without changing the rest of the app too much.
- Turning HTML pages into React components with React Router.
- Git in a team: branches, pull requests and merge conflicts.
- We should agree on field names early. Otherwise the frontend and backend drift apart without noticing.

**Lacked**

- A written interface agreement from the start.
- Notes from every daily scrum, and one fixed meeting time.
- Shared test data: the Postman collection stayed on one laptop instead of being in the repo.
- Sometimes we pushed straight to `main` instead of making a PR.

**Longed for**

- More time for testing and cleaning up the code before the deadline.
- Code review before merging, not only merging.
- A clear team rule for when someone wants to add a new library.

## What we'll do differently in Sprint 3

- Write the interface first, then build.
- Log every daily scrum in the repo.
- PR only, and at least one other person reviews before merging.
- Keep the Postman collection in the repo.
