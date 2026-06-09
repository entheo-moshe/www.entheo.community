import { createRootRoute, Outlet } from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'

export const Route = createRootRoute({
  component: RootDocument,
})

function RootDocument() {
  return (
    <div className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
