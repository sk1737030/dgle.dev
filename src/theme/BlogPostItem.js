import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import { useLocation } from "@docusaurus/router";
import Comment from "../components/Comment";

const BASIC_PATH = "/";
export default function BlogPostItemWrapper(props) {
  const { pathname } = useLocation();
  const isBasicPath = BASIC_PATH === pathname;
  return (
    <>
      <BlogPostItem {...props} />
      <br /> <br />
      {!isBasicPath && <Comment />}
      <br />
    </>
  );
}
