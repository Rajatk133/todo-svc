import styled from 'styled-components'
import { useAppDispatch } from '../../app/hooks'
import { deleteImage } from './imagesSlice'
import type { ImageAsset } from '../../types'
import { formatBytes } from '../../utils/date'

const Grid = styled.ul`
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 14px;
`

const Thumb = styled.li`
  position: relative;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`

const Image = styled.img`
  width: 100%;
  height: 130px;
  object-fit: cover;
  display: block;
  background: ${({ theme }) => theme.color.surface3};
`

const Placeholder = styled.div`
  width: 100%;
  height: 130px;
  background: ${({ theme }) => theme.color.surface3};
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 0.45; }
    50% { opacity: 0.75; }
  }
`

const ThumbMeta = styled.div`
  padding: 9px 11px;
  display: grid;
  gap: 2px;
`

const ThumbName = styled.span`
  font-size: 12px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ThumbSize = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.color.muted};
`

const Remove = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(15, 23, 42, 0.6);
  color: #fff;
  cursor: pointer;
  line-height: 1;
  font-size: 11px;
  display: grid;
  place-items: center;

  &:hover { background: ${({ theme }) => theme.color.danger}; }
`

interface Props {
  images: ImageAsset[]
  allowDelete?: boolean
}

export default function ImageThumbnails({ images, allowDelete = true }: Props) {
  const dispatch = useAppDispatch()

  if (images.length === 0) return null

  return (
    <Grid>
      {images.map((image) => (
        <Thumb key={image.id}>
          {image.dataUrl ? (
            <Image src={image.dataUrl} alt={image.name} loading="lazy" />
          ) : (
            <Placeholder aria-label="Loading image" />
          )}
          <ThumbMeta>
            <ThumbName title={image.name}>{image.name}</ThumbName>
            <ThumbSize>{formatBytes(image.size)}</ThumbSize>
          </ThumbMeta>
          {allowDelete && (
            <Remove
              type="button"
              aria-label={`Remove image ${image.name}`}
              title="Remove image"
              onClick={() => dispatch(deleteImage(image.id))}
            >
              ✕
            </Remove>
          )}
        </Thumb>
      ))}
    </Grid>
  )
}