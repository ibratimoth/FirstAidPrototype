import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Modal } from "antd";

const ContentDetails = () => {
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // Extract contentId from location.state
  const { contentId } = location.state || {};

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8082/api/v1/category/get-category"
      );
      if (data?.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log("Something went wrong");
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const getContent = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8082/api/v1/content/get-content/${contentId}`
      );
      if (data.success) {
        const { title, description, category } = data.content;
        setTitle(title);
        setDescription(description);
        setCategory(category._id); // Assuming category is an object with _id field
        setContent(description); // Assuming description contains the full text content
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting content");
    }
  };

  useEffect(() => {
    if (contentId) {
      getContent();
    }
  }, [contentId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const contentData = { title, description, category };
      const { data } = await axios.put(
        `http://localhost:8082/api/v1/content/update-content/${contentId}`,
        contentData
      );
      if (data?.success) {
        toast.success(`Content is updated`);
        setVisible(false);
        getContent();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const transformContentToHtml = (content) => {
    // Convert URLs into image tags
    let htmlContent = content.replace(/(https?:\/\/[^\s]+)/g, (url) => {
      return `<img src="${url}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
    });

    // Format based on keywords (simple implementation)
    htmlContent = htmlContent.replace(/^Definition: /gm, '<h2>Definition</h2><p>')
                             .replace(/^Causes: /gm, '</p><h2>Causes</h2><p>')
                             .replace(/^Symptoms: /gm, '</p><h2>Symptoms</h2><p>')
                             .replace(/^First Aid /gm, '</p><h2>First Aid</h2><ul>')
                             .replace(/^When to Seek Immediate Medical Attention/gm, '</ul><h2>When to Seek Immediate Medical Attention</h2><ul>');

    // Split sentences into list items for specific sections
    htmlContent = htmlContent.replace(/(<h2>First Aid<\/h2><ul>)([^<]+)/, (match, p1, p2) => {
      const listItems = p2.split('.').filter(item => item.trim()).map(item => `<li>${item.trim()}.</li>`).join('');
      return `${p1}${listItems}`;
    });

    htmlContent = htmlContent.replace(/(<h2>When to Seek Immediate Medical Attention<\/h2><ul>)([^<]+)/, (match, p1, p2) => {
      const listItems = p2.split('.').filter(item => item.trim()).map(item => `<li>${item.trim()}.</li>`).join('');
      return `${p1}${listItems}`;
    });

    // Close open paragraphs and lists at the end of the content
    htmlContent += '</p></ul>';

    return htmlContent;
  };

  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Content Details</h1>
        <div 
          style={{
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
          dangerouslySetInnerHTML={{ __html: transformContentToHtml(content) }} 
        />
        <button type="button" className="btn btn-primary text-center" onClick={() => setVisible(true)}>Edit</button>
      </div>
      <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
        <h2>Edit Content</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.injuryType}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </Modal>
    </Layout>
  );
};

export default ContentDetails;
