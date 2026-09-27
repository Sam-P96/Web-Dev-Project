# Self-Assessment - Frontend

- **Member name:** Duy Dang
- **Contribution area:**
  - My main tasks were backend and Scrum Master, so my frontend part in Sprint 2 is small.
  - **In Sprint 2 (17.09):**
    - Replaced the old prototype links (`<a href="*.html">`) with React Router `<Link>` in HeroPrime, SearchPrime, SellCtaPrime and LoginForm.
    - Added the `/register` route.
    - Wrote a routing review for the team suggesting React Router with one shared layout.
  - **After the deadline (22.09, early Sprint 3):**
    - Made the worker appointments page (`WorkerAppointments.jsx`) load real data, and added reschedule, complete and cancel.
    - Added the small `useCurrentUser` helper.

---

### 1. Functionality

- **Does the code meet the requirements?**
  - [x] **Does it implement all specified features you were responsible for?** Yes.
    - Moving between home, search, sell and login now works without reloading the page.
    - The worker appointments page shows the seller, car, date and status, and the worker can reschedule, complete or cancel.
  - [ ] **Are edge cases handled?** Partly.
    - Handled:
      - Missing seller or car data shows "—".
      - There are loading and error states.
      - Reschedule needs both a date and a time.
    - Not handled:
      - If `VITE_API_URL` isn't set, the page fails with an error that doesn't explain anything.
  - [ ] **Are there any bugs or unexpected behaviors?** Yes:
    - New appointments have no worker (`worker: null`), so they never show up on any worker's page.
    - Some messages on the page are in Vietnamese in an English app (for example "Lỗi tải dữ liệu").

- **Integration**
  - [x] **Does your code work correctly with other parts of the application?** Yes. My `toRow` function turns the data from the API into the format the table needs. `mergeRow` keeps the seller and car names after an update, because the `PUT` response doesn't include them.
  - [ ] **Are inputs and outputs managed appropriately?** Mostly, but this page talks to the backend, and that is Sprint 3 work. That's why it was merged after the Sprint 2 deadline and isn't in the Sprint 2 branch.

---

### 2. Code Quality

- **Readability**
  - [x] **Are names descriptive and meaningful?** Yes. The helper functions have clear names: `splitDateTime`, `toRow`, `mergeRow`.
  - [ ] **Is the code easy to understand?** Not everywhere. The comments are in Vietnamese, and the file is long (339 lines).

- **Reusability**
  - [ ] **Is logic modular and separated from unrelated concerns?** No. The fetch calls are inside the page. Other features have their own API file like `carApi.js`, but appointments don't.
  - [x] **Can parts be reused elsewhere?** Yes. `useCurrentUser` can be used on any page.

- **Comments and Documentation**
  - [ ] **Is there documentation for how to use your code?** No. The env variables (`VITE_API_URL`, `VITE_DEV_WORKER_ID`) aren't written down anywhere, and there's no `.env.example`.
  - [x] **Are there explanations?** The routing review explained to the team why we should set the routes up that way.

---

### 3. Performance

- **Efficiency**
  - [x] **Any unnecessary operations?** No. After an update I only change that one row, instead of loading the whole list again.
  - [ ] The table isn't responsive. On a phone you can only scroll it sideways.

---

### 4. Overall Assessment

- **Strengths**
  - The link fixes made the converted prototype work like a real React app, instead of a set of separate HTML pages.
  - The adapter functions keep the API format and the UI format apart. The loading and error states are handled.

- **Areas for Improvement**
  - The mixed Vietnamese and English.
  - The API calls should be in their own file.
  - The page isn't responsive and the setup isn't documented.

- **Action Plan**
  1. Change all the text and comments in `WorkerAppointments.jsx` to English.
  2. Move the fetch calls into `apis/appointmentApi.js` and add `frontend/.env.example`.
  3. Make the table responsive, for example cards on mobile.
  4. Agree with the backend how unassigned appointments reach a worker.

---

### 5. Additional Notes

- **How I used the LLM:** I used Claude Code to go through the repo and Claude to review the findings with me. I checked everything in the code before writing it here.
- The biggest thing I learned is that the frontend and backend should agree on the data format first. My adapter functions only exist because the mock data and the API didn't match.
