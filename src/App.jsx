import { useMemo, useState } from 'react'
import './App.css'

const initialForm = {
  studentName: '',
  email: '',
  courseName: '',
  rating: '',
  feedback: '',
}

const WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ||
  'https://your-n8n-webhook-url.example.com/webhook/student-feedback'

function App() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ratingInsight = useMemo(() => {
    const value = Number(formData.rating)

    if (!value) return 'Select a rating to see your feedback summary.'
    if (value <= 2) return 'This feedback highlights a key improvement area.'
    return 'Thank you for sharing a positive learning experience.'
  }, [formData.rating])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))

    if (status.type) {
      setStatus({ type: '', message: '' })
    }
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.studentName.trim()) {
      nextErrors.studentName = 'Student name is required.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.courseName.trim()) {
      nextErrors.courseName = 'Course name is required.'
    }

    if (!formData.rating) {
      nextErrors.rating = 'Please choose a rating from 1 to 5.'
    }

    if (!formData.feedback.trim()) {
      nextErrors.feedback = 'Feedback message is required.'
    }

    return nextErrors
  }

  const submitFeedback = async () => {
    const payload = {
      ...formData,
      rating: Number(formData.rating),
      submittedAt: new Date().toISOString(),
    }

    const shouldSimulate =
      !WEBHOOK_URL ||
      WEBHOOK_URL.includes('your-n8n') ||
      WEBHOOK_URL.includes('example')

    if (shouldSimulate) {
      await new Promise((resolve) => setTimeout(resolve, 700))
      return payload
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setStatus({
        type: 'error',
        message: 'Please fix the highlighted fields before submitting.',
      })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await submitFeedback()
      setStatus({
        type: 'success',
        message: 'Thank you for your feedback! Your response has been received successfully.',
      })
      setFormData(initialForm)
      setErrors({})
    } catch (error) {
      console.error(error)
      setStatus({
        type: 'error',
        message:
          'Something went wrong while sending your feedback. Please check the n8n webhook URL and try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="feedback-card">
        <header className="card-header">
          <p className="eyebrow">Student feedback</p>
          <h1>Course Experience Survey</h1>
          <p className="subtitle">
            Share your thoughts so we can improve the learning experience.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="feedback-form" noValidate>
          <div className="form-grid">
            <label className="field">
              <span>Student Name</span>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.studentName ? 'input error' : 'input'}
              />
              {errors.studentName && <small>{errors.studentName}</small>}
            </label>

            <label className="field">
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className={errors.email ? 'input error' : 'input'}
              />
              {errors.email && <small>{errors.email}</small>}
            </label>

            <label className="field full-width">
              <span>Course Name</span>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                placeholder="e.g. React Foundations"
                className={errors.courseName ? 'input error' : 'input'}
              />
              {errors.courseName && <small>{errors.courseName}</small>}
            </label>

            <label className="field">
              <span>Rating</span>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className={errors.rating ? 'input error' : 'input'}
              >
                <option value="">Select a rating</option>
                <option value="1">1 - Very poor</option>
                <option value="2">2 - Needs improvement</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </select>
              {errors.rating && <small>{errors.rating}</small>}
            </label>

            <div className="rating-preview">
              <span className="preview-label">Feedback status</span>
              <strong>{ratingInsight}</strong>
            </div>

            <label className="field full-width">
              <span>Feedback Message</span>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us what went well and what could be improved..."
                className={errors.feedback ? 'input error' : 'input'}
              />
              {errors.feedback && <small>{errors.feedback}</small>}
            </label>
          </div>

          {status.message && (
            <div className={status.type === 'success' ? 'status success' : 'status error'}>
              {status.message}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending feedback...' : 'Submit Feedback'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
