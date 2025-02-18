import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // 백엔드 API 주소

export default {
  // 🔹 코드 그룹 API
  getCodeGroups() {
    return axios.get(`${API_BASE_URL}/code-groups`);
  },
  createCodeGroup(data) {
    return axios.post(`${API_BASE_URL}/code-groups`, data);
  },
  updateCodeGroup(id, data) {
    return axios.put(`${API_BASE_URL}/code-groups/${id}`, data);
  },
  deleteCodeGroup(id) {
    return axios.delete(`${API_BASE_URL}/code-groups/${id}`);
  },

  // 🔹 코드 상세 API
  getCodeDetails(groupId) {
    return axios.get(`${API_BASE_URL}/code-details?groupId=${groupId}`);
  },
  createCodeDetail(data) {
    return axios.post(`${API_BASE_URL}/code-details`, data);
  },
  updateCodeDetail(id, data) {
    return axios.put(`${API_BASE_URL}/code-details/${id}`, data);
  },
  deleteCodeDetail(id) {
    return axios.delete(`${API_BASE_URL}/code-details/${id}`);
  },
};
