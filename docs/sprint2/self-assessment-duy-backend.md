# Self-Assessment - Backend

- **Member name:** Duy Dang
- **Contribution area:**
  - I set up the Express server and the MVC structure (models / controllers / routes) that the rest of the backend follows.
  - I made the User CRUD API. The first version used an array; Sam later moved it to Mongoose.
  - I cleaned up the folders so all the models are in one `models/` folder.
  - After the deadline I also added a `?worker=` filter for appointments. That one is early Sprint 3 work.
  - To be honest about the plan: I was supposed to do the Appointment CRUD too, but Sam built the base version.

---

### 1. Functionality

- **Does the code meet the requirements?**
  - [x] **Does it implement all specified features you were responsible for?** Mostly.
    - Server setup, MVC and User CRUD (5 endpoints) are done.
    - My own error-handling middleware is not done. The server only uses the built-in ones (`express.json`, `morgan`, `cors`).
  - [ ] **Are edge cases handled?** Only some of them.
    - Handled:
      - Missing required fields give a 400.
      - Fields that aren't allowed on update are ignored.
      - A wrong or unknown id gives a 404.
    - Not handled:
      - Two users can have the same email, because `email` isn't `unique`. So my "duplicate" error code never actually runs.
      - A value of `0` is treated as "missing".
  - [ ] **Are there any bugs or unexpected behaviors?** Yes:
    - If you create a user without `role`, it says "Invalid role" instead of using the default `client`. The check happens before the default is set.
    - The password is sent back in `GET /users` and `GET /users/:id`.
    - After my cleanup, `test-db.js` still points to files I deleted, so it crashes if you run it.

- **Integration**
  - [x] **Does your code work correctly with other parts of the application?** Yes. Sam used the same model → controller → router pattern for Car, Offer and Appointment, and all errors come back as `{ message }`.
  - [ ] **Are inputs and outputs managed appropriately?** Not fully. If a `PUT` has a wrong type (for example `age: "abc"`), the error isn't caught and Express sends its HTML error page instead of JSON.

---

### 2. Code Quality

- **Readability**
  - [x] **Is your code easy to understand for other developers?** Mostly. The controllers are short and all look the same, so they're easy to follow.
  - [ ] Some handlers do `if (!x) res.status(...) else ...` without `return`, which can break easily. The example comment at the top of `userModel.js` is also old and doesn't match the schema anymore.

- **Reusability**
  - [x] **Is logic modular and separated?** The required fields and the allowed update fields are kept in lists, not hard-coded in the logic.
  - [ ] **Can it be reused elsewhere?** Not really. The same 5 functions are copied in all 4 models and controllers. I could make shared helpers, like one to check ids.

- **Comments and Documentation**
  - [x] **Are there comments explaining complex logic?** Every route in the router has a comment. I also wrote the git workflow guides for the team.
  - [ ] **Is there documentation for how to use your code?** No. There's no backend part in the README (how to run it, the `.env` file, the list of endpoints).

---

### 3. Performance

- **Efficiency**
  - [ ] **Any unnecessary operations?** Yes. Update and delete ask the database twice: first `findById`, then `findByIdAndUpdate`. One call is enough.
  - [ ] **Optimized for larger datasets?** No. `GET /users` has no pagination and returns everything, including passwords.
  - [x] The appointment list only asks for the fields it needs (`make model year`, `name`).

---

### 4. Overall Assessment

- **Strengths**
  - I made the basic structure that the whole backend is built on, and it's simple and the same everywhere.
  - The update whitelist and the required-field check.
  - The appointment worker filter is my best handler: it checks the id first, has try/catch and always returns JSON.

- **Areas for Improvement**
  - I didn't finish the error-handling middleware, which was my task.
  - Validation for users: duplicate emails, the role default, and passwords showing up in responses.
  - Repeated code, the double database calls, and no documentation.

- **Action Plan**
  1. Make `middleware/errorHandler.js`. It should include:
     - a 404 for unknown routes;
     - `ValidationError` and `CastError` returned as a JSON 400;
     - everything else returned as a JSON 500.

     It goes last in `app.js`.
  2. In the User model:
     - set the default role before checking it;
     - add `unique: true` to `email`;
     - hide `password` from responses (`select: false`).
  3. Remove the double database calls, always use `return res.status(...)`, and use 400 instead of 404 for ids that aren't valid.
  4. Fix or delete `test-db.js`, and remove the old comments.
  5. Add a backend section to the README and put the git guides on `main`.

---

### 5. Additional Notes

- **How I used the LLM:** I used Claude Code to read the repo and git history, then went through the findings with Claude. I checked every point in the code myself before writing it here.
- **Suggestions I didn't just accept:**
  - Password hashing is real authentication, and that's Sprint 3, so I didn't count it as a Sprint 2 problem. Hiding the password in responses is easy though, so I'll do that.
  - Using 400 instead of 404 for a wrong id: I agree. 404 makes it look like the data is missing when actually the request is wrong.
