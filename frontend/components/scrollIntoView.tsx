import { useEffect, useRef, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function AutoScrollList(props: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = bottomRef;
    if (current) {
      current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [props.children]);

  return (
    <section {...props}>
      <div style={{ whiteSpace: 'pre-wrap' }} key={'child'}>
        {props.children}
      </div>
      <div key={'dummy'} ref={bottomRef} />
    </section>
  );
}
