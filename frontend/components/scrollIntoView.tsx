import { useEffect, useRef } from 'react';
import React from 'react';

export interface Props {
  children: Array<any> | any;
}

export function AutoScrollList(props: Props) {
  const bottomRef: any = useRef();

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.children]);

  return (
    <section {...props}>
      <div key={'child'}>{props.children}</div>
      <div key={'dummy'} ref={bottomRef} />
    </section>
  );
}
