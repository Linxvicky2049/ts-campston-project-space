import { useState } from "react"

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    return newErrors
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: "" })
  }

  function handleSubmit(e) {
    e.preventDefault()

    const foundErrors = validate()

    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors)
      return
    }

    setSubmitted(true)
  }

  return (
    <section id="contact" className="contact">
      <div className="container">

        <div className="contact-inner">

          <div className="contact-header">
            <p className="section-label">Send A Message</p>
            <h2>Contact Mission Control</h2>
            <p className="contact-sub">
              Have a question about the cosmos? We'd love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div className="success-message">
              <h3>🚀 Message Launched!</h3>
              <p>We'll get back to you faster than light speed.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="form-error">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="form-error">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Your message..."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <span className="form-error">{errors.message}</span>
                )}
              </div>

              <button type="submit" className="primary-btn">
                Send Message
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  )
}

export default ContactForm