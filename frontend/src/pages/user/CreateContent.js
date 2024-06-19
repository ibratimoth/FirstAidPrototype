import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import NurseMenu from "../../components/Layout/NurseMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
const { Option } = Select;

const CreateContent = () => {
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

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

  //create product function
  const handleCreate = async(e) => {
    e.preventDefault()
    try {
      const productData = new FormData()
      productData.append("title", title)
      productData.append("description", description)
      productData.append("category", category)
      const { data } = await axios.post(
        "http://localhost:8082/api/v1/content/make-content", productData);
        if(data?.success){
          toast.success('Content created successfully')
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
    }

    setTitle('')
    setDescription('')
    setCategory('')
  }

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <NurseMenu />
          </div>
          <div className="col-md-7">
            <h1>Create Content</h1>
            <div className="m-1 w-70">
              <Select
                bordered={false}
                placeholder="Select a Category"
                size="large"
                showSearch
                className="form-select mb-3 "
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.injuryType}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <input
                  type="text"
                  value={title}
                  placeholder="Enter title"
                  className="form-control"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Enter Your description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
                <div className="mb-3">
                  <button className="btn btn-primary" onClick={handleCreate}>create content</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateContent;
