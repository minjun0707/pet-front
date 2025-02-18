<template>
    <div class="main-layout">
      <div class="content-container">
        <div class="main-content">
          <h2>코드 관리</h2>
  
          <!-- 🔹 코드 그룹 관리 -->
          <div class="form-container">
            <form @submit.prevent="saveCodeGroup">
              <input v-model="group.groupId" placeholder="그룹 ID" required class="input-box" />
              <input v-model="group.groupName" placeholder="그룹명" required class="input-box" />
              <textarea v-model="group.description" placeholder="설명" class="input-box"></textarea>
              <button type="submit" class="btn primary">저장</button>
            </form>
          </div>
  
          <table class="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>설명</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="g in codeGroups" :key="g.groupId">
                <td>{{ g.groupId }}</td>
                <td>{{ g.groupName }}</td>
                <td>{{ g.description }}</td>
                <td>
                  <button @click="editGroup(g)" class="btn">수정</button>
                  <button @click="deleteGroup(g.groupId)" class="btn danger">삭제</button>
                  <button @click="selectGroup(g.groupId)" class="btn secondary">코드 상세 관리</button>
                </td>
              </tr>
            </tbody>
          </table>
  
          <!-- 🔹 코드 상세 관리 -->
          <div v-if="selectedGroup">
            <h3>코드 상세 ({{ selectedGroup }})</h3>
            <div class="form-container">
              <form @submit.prevent="saveCodeDetail">
                <input v-model="detail.codeId" placeholder="코드 ID" required class="input-box" />
                <input v-model="detail.codeName" placeholder="코드명" required class="input-box" />
                <input v-model="detail.codeValue" placeholder="코드 값" required class="input-box" />
                <input v-model="detail.sortOrder" type="number" placeholder="정렬순서" class="input-box" />
                <select v-model="detail.isActive" class="input-box">
                  <option :value="true">활성</option>
                  <option :value="false">비활성</option>
                </select>
                <button type="submit" class="btn primary">저장</button>
              </form>
            </div>
  
            <table class="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                  <th>값</th>
                  <th>정렬</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in codeDetails" :key="d.codeId">
                  <td>{{ d.codeId }}</td>
                  <td>{{ d.codeName }}</td>
                  <td>{{ d.codeValue }}</td>
                  <td>{{ d.sortOrder }}</td>
                  <td>{{ d.isActive ? "활성" : "비활성" }}</td>
                  <td>
                    <button @click="editDetail(d)" class="btn">수정</button>
                    <button @click="deleteDetail(d.codeId)" class="btn danger">삭제</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import codeService from "@/codeService";
  import api from "@/api/axios";
  import router from "@/router";

  
  // 🔹 상태 변수
  const codeGroups = ref([]);
  const codeDetails = ref([]);
  const selectedGroup = ref(null);
  
  
  // 코드 그룹 모델
  const group = ref({
    groupId: "",
    groupName: "",
    description: "",
  });
  
  // 코드 상세 모델
  const detail = ref({
    codeId: "",
    groupId: "",
    codeName: "",
    codeValue: "",
    sortOrder: 1,
    isActive: true,
  });
  
  // 🔹 코드 그룹 목록 불러오기
  const loadGroups = async () => {
    const { data } = await codeService.getCodeGroups();
    codeGroups.value = [...data]; 
    console.log(data);
  };

  const loadGroupDetails = async () => {
    const { data } = await codeService.getCodeDetails(selectedGroup.value);
    codeDetails.value = [...data]; 
    console.log(codeDetails);
  };  
  


  // 🔹 코드 그룹 저장

const saveCodeGroup = async () => {
    try {
        const response = await api.post('/code-groups', {
            groupId: group.value.groupId,
            groupName: group.value.groupName,
            description: group.value.description,
        });

        console.log("📌 저장 응답 데이터:", response.data);

            await loadGroups(); // 최신 데이터 불러오기
            router.replace('/home/codeManagement'); // 같은 페이지로 다시 이동하여 리렌더링 강제


        // 입력 필드 초기화
        group.value.groupId = "";
        group.value.groupName = "";
        group.value.description = "";
    } catch (error) {
        console.error("🚨 저장 중 오류 발생:", error);
    }
};
  
  // 🔹 코드 그룹 수정
  const editGroup = (g) => {
    group.value = { ...g };
  };
  
  // 🔹 코드 그룹 삭제
  const deleteGroup = async (id) => {
    await codeService.deleteCodeGroup(id);
    loadGroups();
  };
  
  // 🔹 특정 그룹 선택 → 해당 상세 코드 목록 조회
  const selectGroup = async (groupId) => {
    selectedGroup.value = groupId;
    detail.value.groupId = groupId;
    const { data } = await codeService.getCodeDetails(groupId);
    codeDetails.value = data;
  };
  
  const saveCodeDetail = async () => {
    try {
        const response = await api.post('/code-details', {
            codeId: detail.value.codeId,
            groupId: selectedGroup.value,
            codeName: detail.value.codeName,
            codeValue: detail.value.codeValue,
            sortOrder: detail.value.sortOrder,
            isActive: detail.value.isActive,
        });

        console.log("📌 저장 응답 데이터:", response.data);
 
        // selectGroup(selectedGroup.value);
        // await loadGroups(); // 최신 데이터 불러오기
        await loadGroupDetails();
        router.replace('/home/codeManagement'); // 같은 페이지로 다시 이동하여 리렌더링 강제



        // 입력 필드 초기화
        detail.value.codeId = "";
        detail.value.codeName = "";
        detail.value.codeValue = "";
        detail.value.sortOrder = 1;
        detail.value.isActive = true;

    } catch (error) {
        console.error("🚨 저장 중 오류 발생:", error);
    }
};

  // 🔹 코드 상세 저장
//   const saveCodeDetail = async () => {
//     if (detail.value.codeId) {
//       await codeService.createCodeDetail(detail.value);
//       detail.value = {
//         codeId: "",
//         groupId: selectedGroup.value,
//         codeName: "",
//         codeValue: "",
//         sortOrder: 1,
//         isActive: true,
//       };

//       selectGroup(selectedGroup.value);
//     }
//   };
  
  // 🔹 코드 상세 수정
  const editDetail = (d) => {
    detail.value = { ...d };
  };
  
  // 🔹 코드 상세 삭제
  const deleteDetail = async (id) => {
    await codeService.deleteCodeDetail(id);
    selectGroup(selectedGroup.value);
  };
  
  // 컴포넌트가 로드될 때 코드 그룹 리스트 불러오기
  onMounted(() => {
    loadGroups();
  });
  </script>
  
  <style scoped>
  .main-layout {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
  }
  
  .content-container {
    display: flex;
    justify-content: center;
  }
  
  .main-content {
    width: 100%;
    max-width: 1000px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  h2, h3 {
    color: #333;
  }
  
  .form-container {
    margin-bottom: 20px;
  }
  
  .input-box {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .styled-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  .styled-table th, .styled-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }
  
  .btn {
    padding: 8px 12px;
    margin: 2px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .primary { background: #007bff; color: white; }
  .secondary { background: #6c757d; color: white; }
  .danger { background: #dc3545; color: white; }
  </style>
  