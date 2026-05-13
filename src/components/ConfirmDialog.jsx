import { RiAlertLine } from 'react-icons/ri'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Hapus', confirmClass = 'bg-red-600 hover:bg-red-500 text-white' }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-950 border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in" style={{ animationDuration: '0.2s' }}>
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <RiAlertLine className="text-3xl text-red-400" />
        </div>
        <h3 className="text-white font-bold text-lg text-center mb-2">{title}</h3>
        <p className="text-dark-200 text-sm text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm">Batal</button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
