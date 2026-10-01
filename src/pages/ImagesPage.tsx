import ImageManager from '../features/images/ImageManager'

export default function ImagesPage() {
  return (
    <div className="page">
      <header className="page__head">
        <h1>Images</h1>
        <p className="page__sub">
          Upload images for the active tab, or attach them to a specific todo.
        </p>
      </header>

      <ImageManager />
    </div>
  )
}