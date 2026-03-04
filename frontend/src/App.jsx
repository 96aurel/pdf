import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import OrganizePages from './pages/OrganizePages'
import ExtractPages from './pages/ExtractPages'
import Watermark from './pages/Watermark'
import PageNumbers from './pages/PageNumbers'
import ProtectPDF from './pages/ProtectPDF'
import UnlockPDF from './pages/UnlockPDF'
import SignPDF from './pages/SignPDF'
import EditPDF from './pages/EditPDF'
import ComparePDF from './pages/ComparePDF'
import ConvertToPDF from './pages/ConvertToPDF'
import ConvertFromPDF from './pages/ConvertFromPDF'
import ImageConverter from './pages/ImageConverter'
import ImageTools from './pages/ImageTools'
import OCR from './pages/OCR'
import QRCode from './pages/QRCode'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fusionner" element={<MergePDF />} />
            <Route path="/diviser" element={<SplitPDF />} />
            <Route path="/compresser" element={<CompressPDF />} />
            <Route path="/organiser" element={<OrganizePages />} />
            <Route path="/extraire" element={<ExtractPages />} />
            <Route path="/filigrane" element={<Watermark />} />
            <Route path="/numerotation" element={<PageNumbers />} />
            <Route path="/proteger" element={<ProtectPDF />} />
            <Route path="/deverrouiller" element={<UnlockPDF />} />
            <Route path="/signer" element={<SignPDF />} />
            <Route path="/editer" element={<EditPDF />} />
            <Route path="/comparer" element={<ComparePDF />} />
            <Route path="/convertir-vers-pdf" element={<ConvertToPDF />} />
            <Route path="/convertir-depuis-pdf" element={<ConvertFromPDF />} />
            <Route path="/convertir-image" element={<ImageConverter />} />
            <Route path="/outils-image" element={<ImageTools />} />
            <Route path="/ocr" element={<OCR />} />
            <Route path="/qrcode" element={<QRCode />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  )
}
