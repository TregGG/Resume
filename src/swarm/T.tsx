import { createElement, type ElementType, type HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLElement> & { as?: ElementType; children: string };

/**
 * Text that the swarm types out. The full text stays in the DOM (.sw-ghost) to hold the
 * layout and keep it readable by screen readers and search engines; the engine types into
 * the absolutely positioned .sw-typed overlay, which wraps exactly like the ghost.
 */
export function T({ as = 'span', children, className, ...rest }: Props) {
  return createElement(
    as,
    { ...rest, className: className ? `sw-t ${className}` : 'sw-t', 'data-sw': 'text' },
    <span className="sw-ghost">{children}</span>,
    <span className="sw-typed" aria-hidden="true" />,
  );
}
