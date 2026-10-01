import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty">
        <p className="empty__icon" aria-hidden="true">
          404
        </p>
        <h3>Page not found</h3>
        <p>That route does not exist.</p>
        <p style={{ marginTop: 12 }}>
          <Link to="/" className="button button--primary button--sm">
            Back to dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}