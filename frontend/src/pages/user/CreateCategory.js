import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import NurseMenu from "../../components/Layout/NurseMenu";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from 'antd'

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [injuryType, setInjuryType] = useState("");
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [updatedName, setUpdatedName] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8082/api/v1/category/create-category",
        { injuryType }
      );
      if (data?.success) {
        toast.success(`${injuryType} is created`);
        getAllCategory()
      } else {
        toast.error(data.message);
      }
    } catch (error) {}

    setInjuryType('')
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8082/api/v1/category/get-category"
      );
      if (data.success) {
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

  const handleUpdate = async(e) => {
    e.preventDefault()
    try {
        const { data } = await axios.put(
          `http://localhost:8082/api/v1/category/update-category/${selected._id}`,
          { injuryType : updatedName }
        );
        if (data?.success) {
          toast.success(`${updatedName} is updated`);
          setSelected(null)
          setUpdatedName("")
          setVisible(false)
          getAllCategory();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong")
      }

  }
  const handleDelete = async(cid) => {
    try {
        const { data } = await axios.delete(
          `http://localhost:8082/api/v1/category/delete-category/${cid}`);
        if (data?.success) {
          toast.success(`category is deleted`);
          getAllCategory();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong")
      }

  }
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <NurseMenu />
          </div>
          <div className="col-md-8">
            <h1>All categories</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={injuryType}
                setValue={setInjuryType}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.injuryType}</td>
                        <td>
                          <button className="btn btn-primary ms-2" onClick={() => {setVisible(true) ; setUpdatedName(c.injuryType); setSelected(c)}}>Edit</button>
                          <button className="btn btn-danger ms-2" onClick={() => {handleDelete(c._id)}}>Delete</button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal onCancel={() => setVisible(false)} footer={false} visible= {visible}>
                  <CategoryForm  value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate}/>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
