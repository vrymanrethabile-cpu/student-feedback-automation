# Student Feedback Automation System

This project includes a responsive React front-end for collecting student feedback and a matching n8n workflow blueprint for saving, classifying, and notifying on submissions.

## Project Structure

- `src/App.jsx` — feedback form and client-side validation
- `src/App.css` — responsive styling for the interface
- `n8n/student-feedback-workflow.json` — exported n8n workflow example
- `docs/n8n-workflow-diagram.svg` — visual workflow overview
- `.env.example` — template for the n8n webhook URL

## Front-End Features

- Required fields: student name, email, course name, rating, and feedback message
- Client-side validation and inline error messages
- Responsive layout for desktop and mobile
- Fetch API submission flow ready for an n8n webhook
- Success and error states to guide the user after submission

## n8n Workflow Logic

The workflow file includes the following flow:

1. Webhook receives POST data from the React form.
2. Validation node checks that all required fields exist.
3. Valid submissions are stored in Google Sheets.
4. A conditional logic step evaluates the rating:
   - `rating <= 2` → mark as `Needs Attention`
   - `rating > 2` → mark as `Positive Feedback`
5. A notification node sends a thank-you message to the student.

## Setup Instructions

1. Install dependencies:
   - `npm install`
2. Create a local environment file:
   - copy `.env.example` to `.env`
   - set `VITE_N8N_WEBHOOK_URL` to your live n8n webhook URL
3. Run the app locally:
   - `npm run dev`
4. Import the workflow JSON into n8n and update the Google Sheets and notification credentials.

## Reflection Questions

### What challenges did you encounter?
I encountered the main challenge of making the front end and n8n workflow work together without a live backend connection. The form needed good validation and a clean interface while the automation workflow needed a clear decision path for ratings and notifications.

### How did you solve them?
I handled the front-end validation in the React form so the user receives feedback immediately before submission. I also built the workflow around a webhook-first architecture and included a simulated fallback mode so the form can be tested even before a live n8n endpoint is connected.

### What did you learn about workflow automation?
I learned that automation is most useful when it turns repetitive tasks into a reliable, reusable process. The best workflows are simple, validate data early, and create clear decisions that reduce manual work and improve response quality.

## Loom Video Notes

Record a short Loom video covering:

- a quick overview of the student feedback form
- the n8n workflow structure
- a close-up of the decision logic for ratings
- the final thank-you notification flow

The workflow visual included in `docs/n8n-workflow-diagram.svg` can be used as a screenshot reference during the explanation.
