import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import NurseMenu from "../../components/Layout/NurseMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatedContent = () => {

    const [contents, setContents] = useState([]);
    const navigate = useNavigate()

    const getAllContents = async () => {
        try {
          const { data } = await axios.get(
            "http://localhost:8082/api/v1/content/get-all-content"
          );
          if (data.success) {
            setContents(data.contents);
          }
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong in getting contents");
        }
      };
    
      const deleteContent = async (contentId) => {
        try {
            const { data } = await axios.delete(`http://localhost:8082/api/v1/content/delete-content/${contentId}`);
            if (data.success) {
                toast.success("Content deleted successfully");
                setContents(contents.filter(content => content._id !== contentId));
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while deleting content");
        }
    }
    
      useEffect(() => {
        getAllContents();
      }, []);
    
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <NurseMenu />
          </div>
          <div className="col-md-8">
          <h1 className="text-center">All contents</h1>
          <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contents?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.title}</td>
                        <td key={c._id}>{c.injuryType}</td>
                        <td>
                          <button className="btn btn-primary ms-2" onClick={() => navigate('/dashboard/user/content', { state: { contentId: c._id } })}>View</button>
                          <button className="btn btn-danger ms-2" onClick={() => deleteContent(c._id)}>Delete</button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatedContent;
