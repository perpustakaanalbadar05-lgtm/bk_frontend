import { useEffect } from 'react'
import { RiCloseLine } from 'react-icons/ri'

export default function Modal({ isOpen, onClose, title, subtitle, icon: Icon, iconBg = 'from-primary-500 to-accent-500', size = 'md', children, footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative w-full ${sizes[size]} bg-dark-950 border border-white/20 rounded-2xl shadow-2xl animate-in flex flex-col max-h-[90vh]`} style={{ animationDuration: '0.25s' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className="text-xl text-white" />
              </div>
            )}
            <div>
              <h2 className="font-display font-bold text-white text-lg leading-tight">{title}</h2>
              {subtitle && <p className="text-dark-200 text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white transition-colors ml-4 flex-shrink-0"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-white/20 bg-white/5 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
