import type { HTMLAttributes } from 'react';

export function ReceptionKey({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`reception-key ${className}`.trim()} aria-hidden="true" {...props}>
    <i className="key-ring" />
    <span className="key-metal"><i /></span>
    <span className="key-tag"><small>MYSTERY HOTEL</small><strong>404</strong><b>НЕ ТЕРЯЙТЕ</b></span>
  </span>;
}
