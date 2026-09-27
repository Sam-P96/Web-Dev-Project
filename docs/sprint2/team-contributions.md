# AutoTori - Sprint 2 Team Contributions

## Roles

| Member | Role | Track |
|---|---|---|
| Aakash | Developer | Frontend |
| Ridhi | Developer | Frontend |
| Sam | Product Owner, Developer | Backend |
| Duy | Scrum Master, Developer | Backend |

## What each person did

### Aakash (Frontend)

- Car submission form with validation (seller flow)
- Login form, registration form and form validation for all forms
- Navbar (with mobile menu) and footer
- Booking form with weekday time slots
- Price estimate UI (hard-coded value)
- Tailwind setup and the migration to Tailwind components
- Merged PR #1, #2, #3 and #6
- Helped Sam with the images problem in the car schema

### Ridhi (Frontend)

- The Sprint 1 HTML prototype, which the React version is built from
- User profile page with edit mode
- The first worker pages: offer list and appointment management
- PR #7 and #8 (profile, offers and appointment pages)

### Sam (Backend, Product Owner)

- Mongoose schemas for User, Car, Offer and Appointment, plus the MongoDB connection
- CRUD API for Car, Offer and Appointment
- Converted the User API from array data to Mongoose
- Converted the homepage from HTML to React components with Tailwind
- Postman testing and screenshots for the presentation
- As PO: decided the priorities, for example moving the AI price model to Sprint 3

### Duy (Backend, Scrum Master)

- Express server setup and the MVC structure (models / controllers / routes) that the other entities followed
- User CRUD API (the first version used array data)
- Cleaned up and restructured the backend folders
- Frontend: replaced the prototype `.html` links with React Router links, added the `/register` route, and wrote a routing review for the team
- As SM: planned the sprint, split the work, wrote the git workflow guides and the daily log, ran the checklist session, and reviewed and merged backend PRs (#4, #9, #10)

## How we worked together

- Each user story on Trello had a frontend part and a backend part with a named owner. The two people on each track talked mostly in the daily scrum and in PRs.
- Sam and Duy shared one pattern for the backend: Duy made the structure and Sam built the other entities on top of it.
- Aakash and Ridhi split the pages between them and fixed merge conflicts together.

## Evidence

Git commits across all branches (as of 27.09.2026, so this also includes some early Sprint 3 work):

| Member | Commits |
|---|---:|
| Duy | 29 |
| Sam | 26 |
| Aakash | 18 |
| Ridhi | 8 |

The commit history and PRs are on GitHub: https://github.com/Sam-P96/Web-Dev-Project
