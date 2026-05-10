export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-surface rounded-2xl border border-border shadow-lg ${
        hover ? 'hover:shadow-xl hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-5 pb-0 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-5 pt-0 flex gap-3 ${className}`}>
      {children}
    </div>
  );
}
