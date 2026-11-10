import type { ReactNode } from 'react';

/** Bordered window with an orange label tab and off-white corner squares. */
export function Win({ label, className = '', children }: { label?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`win ${className}`} data-label={label} data-sw="box">
      <i className="k tl" />
      <i className="k tr" />
      <i className="k bl" />
      <i className="k br" />
      {children}
    </div>
  );
}
