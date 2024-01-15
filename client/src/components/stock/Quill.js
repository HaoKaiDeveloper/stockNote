import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import classes from "./Quill.module.css";

const Quill = ({ value, handleChange }) => {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        [("bold", "italic", "underline", "strike", "blockquote")],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
      ],
    },
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
  ];

  return (
    <ReactQuill
      modules={modules}
      formats={formats}
      value={value}
      onChange={handleChange}
      className={classes.main}
    />
  );
};

export default Quill;
