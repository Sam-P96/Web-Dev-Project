<!--
AutoTori FAQ: knowledge base for the support chatbot (RAG).

DRAFT / PLACEHOLDER. Written from the README backlog and the current data models.
Anything marked [PLACEHOLDER] is an assumption and must be confirmed by the Product Owner.

Format rules (the ingest script relies on them):
- Every "## " heading is one topic. Chunks are split on "## " and "### " headings.
- Keep each "### " question self-contained: the bot may only see that one chunk.
- English only.
-->

# AutoTori FAQ

## About AutoTori

### What is AutoTori?
AutoTori is a car trading platform. Sellers submit their car's details and get an instant price estimate from a valuation model trained on real market data. The company then reviews the car, makes a purchase offer, and finalises the deal at an in-person inspection appointment.

### How is AutoTori different from a normal car marketplace?
You see a rough price estimate before you book any meeting, so neither you nor the company wastes time on meetings that were never going to lead to a deal. When you sell to AutoTori, your car is not listed publicly.

### Who can use AutoTori?
Anyone selling a car can create an account and submit it. Company workers review submissions and make offers. Buying cars directly through the site is planned but not available yet. [PLACEHOLDER]

## Selling your car

### How do I sell my car with AutoTori?
1. Create an account with your email and password.
2. Submit your car's details (make, model, year, mileage, fuel, transmission, location and an optional description).
3. Get an instant price estimate.
4. A worker reviews your submission and may send you a purchase offer.
5. Book an in-person appointment so the company can inspect the car and finalise the deal.

### What information do I need to submit my car?
Required: make, model, year and mileage in kilometres. Optional but recommended: fuel type (petrol, diesel or hybrid), transmission (automatic or manual), location, condition and a short description. More details give a more accurate estimate.

### Will my car be listed publicly?
No. When you sell to the company, your submission is only visible to you and AutoTori staff. Listing your car publicly for buyers is a planned feature. [PLACEHOLDER]

### What does the status of my submission mean?
- Pending: your car has been submitted and is waiting for review.
- Accepted: the company has reviewed your car and is interested.
- Rejected: the company will not make an offer for this car. [PLACEHOLDER: add the usual reasons and whether the seller can resubmit]

### Can I edit or delete my submission?
Yes, you can update your car's details or delete the submission from your account while it is being processed. [PLACEHOLDER: confirm whether editing is blocked after an offer or appointment exists]

## Price estimate

### How is the price estimate calculated?
The estimate comes from a machine-learning regression model (Random Forest) trained on real Finnish used-car market data. It uses your car's make, model, year, mileage, fuel type and transmission.

### Is the estimate a guaranteed price?
No. The estimate is for reference only. The final price is only agreed after the company has inspected the car in person. AutoTori never commits to a price through the website or the chatbot.

### Why is my estimate missing?
Some cars do not get an automatic estimate, for example rare models or cars with incomplete details. A worker will review the car manually instead. [PLACEHOLDER]

### Why might the final offer differ from the estimate?
The model cannot see the car. Condition, service history, damage, tyres and equipment found during inspection can move the price up or down.

## Offers

### How do offers work?
After reviewing your submission, a company worker can send you a purchase offer with an amount in euros and a message. You can see the offer in your account.

### What happens if I decline the estimate?
A worker can review your car and make their own offer instead of the automatic estimate.

### Can I make a counter-offer?
Counter-offers are planned but not available yet. [PLACEHOLDER]

### When is an offer final?
An offer only counts as accepted once both sides have confirmed it in person at the inspection appointment. An offer marked "accepted" on the website is not a binding sale until then.

## Appointments

### How do I book an appointment?
Once your car has been submitted, you can book an in-person appointment from your account: choose a date and time, and add a location or notes if needed. A worker is then assigned to your appointment.

### What happens at the appointment?
A company worker inspects your car, checks the documents, and if both sides agree on the price, the deal is finalised.

### What does my appointment status mean?
- Booked: you have requested the appointment.
- Confirmed: a worker has confirmed it.
- Completed: the inspection has taken place.
- Cancelled: the appointment was cancelled.

### Can I reschedule or cancel an appointment?
Yes. Please reschedule or cancel as early as possible so the time slot can be given to someone else. [PLACEHOLDER: confirm how, and any notice period]

### What should I bring to the appointment?
[PLACEHOLDER] Typically: the car, all keys, the vehicle registration certificate, service history, and a photo ID.

## Account and privacy

### How do I create an account?
Click "Sign up" and register with your name, email and a password. Your email must not already be in use.

### How do I log in or log out?
Use "Log in" in the navigation bar with your email and password. You can log out from the same menu.

### How do I update my profile?
Go to your profile page to update your name, email, phone number, address or age.

### How is my data protected?
Your password is stored hashed and is never shown, not even to staff. Only you and AutoTori staff can see your car submissions. [PLACEHOLDER: link to the privacy policy]

### How do I delete my account?
[PLACEHOLDER] Contact support and we will delete your account and your data.

### I forgot my password. What do I do?
Password reset is not available yet. Please contact support. [PLACEHOLDER]

## Fees

### Does it cost anything to sell my car to AutoTori?
No. Submitting your car, getting an estimate and booking an appointment is free. [PLACEHOLDER]

### Can I list my car for buyers myself?
Listing your car publicly for a small fee is planned but not available yet. [PLACEHOLDER: fee amount]

## Contact

### How do I contact AutoTori?
[PLACEHOLDER] Email: support@autotori.example · Phone: +358 00 000 0000 · Opening hours: Mon–Fri 9:00–17:00 (Finnish time).

### The chatbot could not answer my question. What now?
Please contact our support team using the details above. A person will get back to you.
