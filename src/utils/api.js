import axios from "axios";
const apiurl = import.meta.env.VITE_API_URL;

export const postData = async (url, payload) => {
  try {
    const res = await fetch(apiurl + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Request failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    return { success: false, message: error.message || "Network error" };
  }
};

export const fetchData = async (url) => {
  try {
    const { data } = await axios.get(apiurl + url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error.response?.data || error;
  }
};
export const uploadImage = async (url, updateData) => {
  try {
    const res = await axios.put(apiurl + url, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        // "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || error;
  }
};

export const UploadImages = async (url, formData) => {
  try {
    const res = await axios.post(apiurl + url, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        // DO NOT set Content-Type manually for FormData
      },
    });
    return res.data;
  } catch (error) {
    console.error("Image upload error:", error);

    // If the backend responded with an error
    if (error.response) {
      return error.response.data;
    }

    // If no response (e.g., network issue)
    return { message: error.message || "Unknown error", images: null };
  }
};

export const editData = async (url, updateData) => {
  try {
    const res = await axios.put(apiurl + url, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response?.data || error;
  }
};

export const deleteData = async (url, params = {}) => {
  try {
    const res = await axios.delete(apiurl + url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        "Content-Type": "application/json",
      },
      params: params, // ⬅️ send fileId as query param here
    });
    return res.data;
  } catch (error) {
    console.log("Delete error:", error);
    return error.response?.data || error;
  }
};

export const deleteMultiple = async (url, body = {}) => {
  try {
    const response = await axios.delete(url, {
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Full error:", error); // 👈 Add this
    return {
      error: true,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};
