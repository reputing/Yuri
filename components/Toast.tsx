'use client'
export function ToastContainer({ toasts }: { toasts: { id: number; msg: string; type: string }[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={'toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium shadow-lg max-w-xs ' +
            (t.type === 'success' ? 'bg-bg3 border-green-500/60 text-green-400' :
             t.type === 'error'   ? 'bg-bg3 border-red-500/60 text-red-400' :
                                    'bg-bg3 border-accent/60 text-accent')}
        >
          <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '✦'}</span>
          {t.msg}
        </div>
      ))}
    </div>
  )
}
