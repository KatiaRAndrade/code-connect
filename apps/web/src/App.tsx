import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { FeedPage } from './pages/FeedPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { CreatePostPage } from './pages/CreatePostPage'

function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold focus:text-black"
      >
        Pular para o conteúdo
      </a>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/nova-publicacao" element={<CreatePostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
