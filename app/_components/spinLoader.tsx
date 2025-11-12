export const SpinLoader = () => {
  return (
    <div className="w-4 h-4 animate-spin rounded-full border-4 border-solid border-current border-t-transparent">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-current" />
      </div>
    </div>
  )
}