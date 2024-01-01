import React from 'react'
import ReactDOM from 'react-dom/client'

import { Toast } from './utils/toast.tsx'

import { Routes } from './routes'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />

    <Toast />
  </React.StrictMode>,
)
