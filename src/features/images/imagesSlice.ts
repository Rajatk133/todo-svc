import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ImageAsset, ImagesState } from '../../types'
import { createId } from '../../utils/id'
import { removeTab } from '../tabs/tabsSlice'
import { deleteTodo } from '../todos/todosSlice'

/** Hard cap per file. Guards against pulling a huge video into Redux. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml'

const initialState: ImagesState = { items: [] }

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImages(state, action: PayloadAction<ImageAsset[]>) {
      state.items.unshift(...action.payload)
    },
    deleteImage(state, action: PayloadAction<string>) {
      state.items = state.items.filter((a) => a.id !== action.payload)
    },
    clearTabImages(state, action: PayloadAction<string>) {
      state.items = state.items.filter((a) => a.tabId !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeTab, (state, action) => {
        state.items = state.items.filter((a) => a.tabId !== action.payload)
      })
      .addCase(deleteTodo, (state, action) => {
        state.items = state.items.filter((a) => a.todoId !== action.payload)
      })
  },
})

export const { addImages, deleteImage, clearTabImages } = imagesSlice.actions
export default imagesSlice.reducer

export interface BuildAssetsInput {
  tabId: string
  todoId?: string | null
  files: File[]
  /** Positionally aligned with `files`. */
  dataUrls: string[]
}

export function buildAssets({ tabId, todoId, files, dataUrls }: BuildAssetsInput): ImageAsset[] {
  const now = Date.now()
  const linkedTodoId = todoId ?? null
  return files.map((file, index) => ({
    id: createId(),
    tabId,
    todoId: linkedTodoId,
    name: file.name,
    mimeType: file.type,
    size: file.size,
    dataUrl: dataUrls[index] ?? '',
    createdAt: now + index,
  }))
}