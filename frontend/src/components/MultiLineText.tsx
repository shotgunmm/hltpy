import * as React from 'react';
const MultiLineText: React.SFC<{ value: string }> = ({ value }) => {
  return <div>{value.split("\n").map((line, idx) => <div key={idx}>{line}</div>)}</div>
}
export default MultiLineText