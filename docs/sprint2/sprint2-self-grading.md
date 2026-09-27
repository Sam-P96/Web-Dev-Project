# AutoTori - Sprint 2 Self-Grading

**Team:** Aakash, Duy (Scrum Master), Ridhi, Sam (Product Owner)
**Repo:** https://github.com/Sam-P96/Web-Dev-Project/tree/sprint-2-submission

> The `sprint-2-submission` branch contains the code as it was at the Sprint 2 deadline (18.09.2026), plus this `docs/sprint2/` folder. Everything we merged into `main` after the deadline (PR #11 to #22) is early Sprint 3 work, mostly connecting the frontend to the backend. We don't count it here.

| Criteria | Max | Our grade |
|---|---:|---:|
| Alignment with Sprint 1 prototype | Mandatory | Met |
| Artifacts - Frontend | 25 | 18 |
| Artifacts - Backend | 25 | 19 |
| Adherence to Scrum | 25 | 15 |
| Group presentation | 25 | 19 |
| **Total** | **100** | **71** |

---

## 1. Alignment with Sprint 1 Prototype - Met

Screenshots comparing the prototype and the Sprint 2 build: [prototype-alignment-screenshots.pdf](./prototype-alignment-screenshots.pdf)

**What we kept from the prototype**

- The homepage is basically the same as the prototype, section by section: hero, search (make / model / price), feature cards, featured cars and the "Ready to sell your car?" banner.
- Same colours, fonts, card design and spacing.
- The login page has the same fields as the prototype.
- The car form has the same car fields: make, model, year, mileage, fuel, transmission, price, location, condition, description and image.

**What we changed and why**

| Change | Why |
|---|---|
| Name is "AutoTori" everywhere | The prototype mixed "YAXH" and "AutoTori", so we picked one. |
| Removed seller contact fields from the car form | The seller will be the logged-in user, so we don't need to ask again. |
| Profile page is an edit form, not the dashboard from the prototype | Our user story is "manage my profile". Saved cars went back to the backlog. |
| Navbar links go to the new pages (register, booking, profile, worker pages) | We needed to reach every Sprint 2 flow for the demo. A proper navbar per role comes with login in Sprint 3. |
| Car photos are placeholders | We haven't decided how to store images yet (Multer, local or cloud), so it moved to Sprint 3. |
| New pages: register, booking, worker appointments, worker offers | These are our Sprint 2 user stories. The prototype only had the idea, not the pages. |

**What still doesn't match (planned for Sprint 3)**

- The listings page has the car grid but not the filters and sort from the prototype.
- There is no car detail page yet.

---

## 2. Artifacts of Sprint 2 - 37/50

### Frontend - 18/25

**What we have**

- A React app (Vite) with React Router. There are routes for home, login, register, profile, submit car, find cars, booking, worker appointments and worker offers.
- Tailwind for styling, and a navbar with a mobile menu.
- Login is only a simulation (console.log), with no real authentication.
- Forms with validation: register, submit car and profile edit. There is also a booking form with weekday time slots.
- Worker pages: the offer list with status and accept/reject buttons, and appointment management.

**What's not good enough**

- The car list is placeholder data, with no filters and no detail page.
- Some mobile navbar links go to routes that don't exist.
- A few pages are not responsive.
- When you submit a form, the user doesn't see any message.
- The price estimate component is made but not shown on any page.
- Mock data is written inside the components instead of one shared file that follows the interface.

### Backend - 19/25

**What we have**

- An Express server with MVC (models / controllers / routes).
- MongoDB with Mongoose. At first we used arrays, then moved everything to Mongoose after it was taught in class.
- 4 models: User, Car, Offer and Appointment, with references, enums and required fields.
- Full CRUD for all 4, which is 20 endpoints. All of them were tested in Postman.
- Checks for missing fields, a whitelist of fields that can be updated, a check for wrong ids, and a 404 when something is not found.

**What's not good enough**

- There is no error-handling middleware. Some bad requests return Express's HTML error page instead of JSON.
- The User email is not unique, and the password comes back in GET responses.
- The same code is repeated in all 4 entities.
- The AI price estimate moved to Sprint 3.

### Frontend/backend interface

During the sprint we agreed on the HTTP methods, the required fields and the data types. But we never finished writing the exact endpoint and field names down in one document. So when we checked afterwards, some names were different between the frontend and the backend. For example, the car owner is `client` in the backend and `seller` in the frontend.

We wrote the agreement down after the sprint: [interface-agreement.md](./interface-agreement.md). Fixing the differences is the first task in Sprint 3.

---

## 3. Adherence to Scrum Process - 15/25

Details: [ceremony-insights.md](./ceremony-insights.md) and [team-contributions.md](./team-contributions.md)

**What went well**

- We rotated the Scrum Master: Aakash in Sprint 1, Duy in Sprint 2. Sam stayed as Product Owner.
- The sprint goal and backlog were on Trello, with each story split into frontend and backend tasks.
- We worked in two tracks (frontend and backend) and used feature branches and pull requests. 17 PRs were merged through GitHub.
- We had daily scrums of 15-45 minutes where we talked about progress, next steps and blockers.
- We changed the plan when we needed to:
  - We moved the AI price model to Sprint 3 (Sam's call as PO).
  - We postponed image storage.
  - When Aakash built the login page by accident, we kept it and changed Ridhi's task instead.
- The sprint review was the demo in our presentation on 17.09.

**What went wrong**

- We only wrote down one daily scrum in the repo (8.9). The rest happened but we didn't log them.
- The retrospective was written after the sprint, not right after the presentation.
- Some commits were pushed straight to `main`, even though our own git rules say "PR only".

---

## 4. Group Presentation - 19/25

Slides: [sprint2-presentation.pdf](./sprint2-presentation.pdf)

All 4 of us presented on 17.09.2026. The slides covered:

- Sprint 1 recap with the prototype
- Sprint 2 goals
- Frontend progress
- Backend progress, with schema and Postman screenshots
- Changes from the prototype
- Ceremonies
- Goals hit and missed
- Sprint 3 priorities
- Team roles

**What we missed**

- We didn't explain the frontend/backend interface.
- We didn't show the 4Ls retrospective.
- The team slide only had names and roles, not what each person actually did.
