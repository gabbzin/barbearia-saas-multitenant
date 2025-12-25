export const SpinLoader = () => {
  return (
    <div className="h-4 w-4 animate-spin rounded-full border-4 border-current border-t-transparent border-solid">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-current" />
      </div>
    </div>
  );
};
