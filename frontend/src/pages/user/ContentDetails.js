import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const ContentDetails = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract contentId from location.state
  const { contentId } = location.state || {};

  const getContent = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8082/api/v1/content/get-content/${contentId}`
      );
      if (data.success) {
        setContent(data.content.description); // Assuming description contains the full text content
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
      </div>
    </Layout>
  );
};

export default ContentDetails;
