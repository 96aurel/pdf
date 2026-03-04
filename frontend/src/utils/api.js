import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
})

export const uploadFiles = async (endpoint, files, extraData = {}) => {
  const formData = new FormData()
  if (Array.isArray(files)) {
    files.forEach((f) => formData.append('files', f))
  } else {
    formData.append('file', files)
  }
  Object.entries(extraData).forEach(([key, val]) => formData.append(key, val))
  const res = await api.post(endpoint, formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const uploadFilesForText = async (endpoint, files, extraData = {}) => {
  const formData = new FormData()
  if (Array.isArray(files)) {
    files.forEach((f) => formData.append('files', f))
  } else {
    formData.append('file', files)
  }
  Object.entries(extraData).forEach(([key, val]) => formData.append(key, val))
  const res = await api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export default api
