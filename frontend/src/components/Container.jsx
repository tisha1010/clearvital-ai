function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1600px] ${className}`}>{children}</div>
  );
}

export default Container;
