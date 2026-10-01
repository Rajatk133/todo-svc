import ImageManager from '../features/images/ImageManager'
import { Page, PageHead, PageSub } from '../styles/primitives'

export default function ImagesPage() {
  return (
    <Page>
      <PageHead>
        <h1>Images</h1>
        <PageSub>Upload images for the active tab, or attach them to a specific todo.</PageSub>
      </PageHead>

      <ImageManager />
    </Page>
  )
}