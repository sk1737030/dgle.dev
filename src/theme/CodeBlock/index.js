import React from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import Comment from "../../components/Comment";

export default function CodeBlockWrapper(props) {
  return (
    <>
      <CodeBlock {...props} />
{/*      <Comment/>*/}
    </>
  );
}
