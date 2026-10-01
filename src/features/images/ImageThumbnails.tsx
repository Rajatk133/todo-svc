import { useAppDispatch } from '../../app/hooks'
import { deleteImage } from './imagesSlice'
import type { ImageAsset } from '../../types'
import { formatBytes } from '../../utils/date'

interface Props {
  images: ImageAsset[]
  allowDelete?: boolean
}

export default function ImageThumbnails({ images, allowDelete = true }: Props) {
  const dispatch = useAppDispatch()

  if (images.length === 0) return null

  return (
    <ul className="thumbs">
      {images.map((image) => (
        <li key={image.id} className="thumb">
          {image.dataUrl ? (
            <img src={image.dataUrl} alt={image.name} loading="lazy" />
          ) : (
            <div className="thumb__placeholder" aria-label="Loading image" />
          )}
          <div className="thumb__meta">
            <span className="thumb__name" title={image.name}>
              {image.name}
            </span>
            <span className="thumb__size">{formatBytes(image.size)}</span>
          </div>
          {allowDelete && (
            <button
              type="button"
              className="thumb__remove"
              aria-label={`Remove image ${image.name}`}
              title="Remove image"
              onClick={() => dispatch(deleteImage(image.id))}
            >
              ✕
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}