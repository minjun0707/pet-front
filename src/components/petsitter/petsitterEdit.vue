<template>
  <div class="petsitter-register">
    <h2>펫시터 프로필 등록</h2>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label>활동 가능 지역</label>
        <div class="location-select">
          <select v-model="selectedCity" class="select-box" required>
            <option value="">시 선택</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
          <select 
            v-model="selectedDistrict" 
            class="select-box" 
            required
            :disabled="!selectedCity"
          >
            <option value="">구 선택</option>
            <option v-for="district in districts[selectedCity]" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>
        <div v-if="selectedCity && selectedDistrict" class="selected-location">
          선택된 지역: {{ selectedCity }} {{ selectedDistrict }}
        </div>
      </div>

      <div class="form-group">
        <label>돌봄 가능한 반려동물</label>
        <div class="pet-type-input">
          <input 
            type="text" 
            v-model="newPetType" 
            placeholder="예: 고양이, 강아지, 말티즈, 페르시안 고양이" 
            @keyup.enter="addPetType"
          />
          <button type="button" class="add-btn" @click="addPetType">+</button>
        </div>
        <div class="pet-examples">
          추천: 
          <button 
            v-for="pet in petExamples" 
            :key="pet" 
            @click="addExamplePet(pet)"
            class="example-btn"
          >
            {{ pet }}
          </button>
        </div>
        <div class="pet-types-list">
          <div 
            v-for="(type, index) in form.petTypes" 
            :key="index" 
            class="pet-type-tag"
            :style="{
              backgroundColor: type.color.bg,
              color: type.color.text
            }"
          >
            {{ type.name }}
            <button 
              type="button" 
              class="remove-btn"
              :style="{ color: type.color.text }"
              @click="removePetType(index)"
            >×</button>
          </div>
        </div>
      </div>

      <div class="schedule-section">
        <h3>돌봄 가능 설정</h3>
        
        <div class="schedule-container">
          <!-- 날짜 선택 -->
          <div class="date-range">
            <label>돌봄 가능 날짜</label>
            <div class="date-inputs">
              <div class="date-field">
                <Datepicker
                  v-model="form.startDate"
                  :min-date="new Date()"
                  :enable-time-picker="false"
                  locale="ko"
                  auto-apply
                  :format="formatDate"
                  placeholder="&nbsp;&nbsp;&nbsp;&nbsp;시작 날짜 선택"
                  class="date-input"
                />
              </div>
              <span class="date-separator">~</span>
              <div class="date-field">
                <Datepicker
                  v-model="form.endDate"
                  :min-date="form.startDate || new Date()"
                  :enable-time-picker="false"
                  locale="ko"
                  auto-apply
                  :format="formatDate"
                  placeholder="&nbsp;&nbsp;&nbsp;&nbsp;종료 날짜 선택"
                />
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 요일 선택 -->
          <div class="days-selection">
            <label>돌봄 가능 요일</label>
            <div class="days-group">
              <label class="day-checkbox" v-for="day in days" :key="day.value">
                <input type="checkbox" v-model="form.availableDays" :value="day.value" />
                <span class="day-label">{{ day.label }}</span>
              </label>
            </div>
          </div>

          <div class="divider"></div>

          <!-- 시간 선택 -->
          <div class="time-selection">
            <label>돌봄 가능 시간</label>
            <div class="time-slider">
              <div class="time-labels">
                <span v-for="hour in timeLabels" :key="hour">{{ hour }}</span>
              </div>
              <div 
                class="time-track"
                @mousedown="startDragging"
              >
                <div 
                  class="selected-range"
                  :style="{
                    left: `${(form.startTime / 24) * 100}%`,
                    width: `${((form.endTime - form.startTime) / 24) * 100}%`
                  }"
                ></div>
                <div 
                  class="time-handle start"
                  :style="{ left: `${(form.startTime / 24) * 100}%` }"
                  @mousedown.stop="startDragging('start')"
                ></div>
                <div 
                  class="time-handle end"
                  :style="{ left: `${(form.endTime / 24) * 100}%` }"
                  @mousedown.stop="startDragging('end')"
                ></div>
              </div>
              <div class="selected-time">
                선택된 시간: 
                {{ formatTimeWithMinutes(form.startTime, form.startMinute) }} ~ 
                {{ formatTimeWithMinutes(form.endTime, form.endMinute) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>시간당 요금 (원)</label>
        <input 
          type="number" 
          v-model="form.hourlyRate" 
          placeholder="예: 20000" 
          min="0" 
          step="1000" 
          required 
        />
      </div>

      <button type="submit" class="submit-btn">등록하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch ,computed, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useUserStore } from '@/stores/userStore';
import api from '@/api/axios';

const userStore = useUserStore();
const router = useRouter();
const newPetType = ref('');

const selectedCity = ref('서울특별시'); // 기본값: 서울특별시
const selectedDistrict = ref('강남구'); // 기본값: 강남구




const days = [
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
  { value: 'SATURDAY', label: '토' },
  { value: 'SUNDAY', label: '일' }
];

// 도시와 구 데이터
const cities = ['서울특별시', '부산광역시', '인천광역시', '대구광역시', '대전광역시', '광주광역시'];
const districts = {
  '서울특별시': ['강남구', '서초구', '송파구', '강동구', '마포구', '서대문구', '종로구', '중구', '용산구'],
  '부산광역시': ['해운대구', '수영구', '부산진구', '동래구', '남구'],
  '인천광역시': ['연수구', '남동구', '부평구', '계양구', '서구'],
  // 다른 도시의 구 데이터 추가
};

// 반려동물 예시 데이터
const petExamples = ['고양이', '강아지', '말티즈', '페르시안 고양이', '사자'];



const form = ref({
  location: '',
  petTypes: [],
  availableDays: [],
  hourlyRate: '20000',
  startDate: null,
  endDate: null,
  startTime: 9,    // 기본값 9시
  endTime: 18,     // 기본값 18시
  startMinute: 0,  // 추가: 시작 분
  endMinute: 0     // 추가: 종료 분
});



// 지역이 선택될 때마다 form.location 업데이트
watch([selectedCity, selectedDistrict], ([city, district]) => {
  if (city && district) {
    form.value.location = `${city} ${district}`;
  } else {
    form.value.location = '';
  }
});



// 태그 색상 배열 추가
const tagColors = [
  { bg: 'var(--pastel-pink)', text: '#D88484' },
  { bg: 'var(--pastel-blue)', text: '#6B8EB3' },
  { bg: 'var(--pastel-green)', text: '#6BA368' },
  { bg: 'var(--pastel-yellow)', text: '#B3A668' },
  { bg: 'var(--pastel-purple)', text: '#9B6BB3' },
  { bg: 'var(--pastel-orange)', text: '#D8A084' },
];

const getRandomColor = () => {
  return tagColors[Math.floor(Math.random() * tagColors.length)];
};

const addPetType = () => {
  if (newPetType.value.trim()) {
    const color = getRandomColor();
    form.value.petTypes.push({
      name: newPetType.value.trim(),
      color: color
    });
    newPetType.value = '';
  }
};

const addExamplePet = (pet) => {
  if (!form.value.petTypes.find(type => type.name === pet)) {
    const color = getRandomColor();
    form.value.petTypes.push({
      name: pet,
      color: color
    });
  }
};

const removePetType = (index) => {
  form.value.petTypes.splice(index, 1);
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};

const formatTimeWithMinutes = (hour, minute) => {
  return `${hour}:${minute === 0 ? '00' : '30'}`;
};

const timeLabels = [
  '0:00', '3:00', '6:00', '9:00', '12:00', '15:00', '18:00', '21:00', '24:00'
];

const isDragging = ref(false);
const dragTarget = ref(null);

const startDragging = (target) => {
  isDragging.value = true;
  dragTarget.value = target;
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDragging);
};

const stopDragging = () => {
  isDragging.value = false;
  dragTarget.value = null;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
};

const handleDrag = (e) => {
  if (!isDragging.value) return;

  const trackElement = e.target.closest('.time-track');
  if (!trackElement) return;

  const rect = trackElement.getBoundingClientRect();
  const percentage = (e.clientX - rect.left) / rect.width;
  const totalMinutes = percentage * 24 * 60; // 전체 시간을 분 단위로 변환
  const roundedMinutes = Math.round(totalMinutes / 30) * 30; // 30분 단위로 반올림
  
  const hour = Math.floor(roundedMinutes / 60);
  const minute = roundedMinutes % 60;
  
  const clampedHour = Math.max(0, Math.min(24, hour));

  if (dragTarget.value === 'start') {
    if (clampedHour < form.value.endTime || (clampedHour === form.value.endTime && minute < form.value.endMinute)) {
      form.value.startTime = clampedHour;
      form.value.startMinute = minute;
    }
  } else if (dragTarget.value === 'end') {
    if (clampedHour > form.value.startTime || (clampedHour === form.value.startTime && minute > form.value.startMinute)) {
      form.value.endTime = clampedHour;
      form.value.endMinute = minute;
    }
  }
};

const loadPetsitterProfile = () => {
  // API 호출로 기존 데이터 불러오기 (임시 데이터)
  const data = {
    location: '서울특별시 강남구',
    petTypes: [
      { name: '말티즈', color: getRandomColor() },
      { name: '시츄', color: getRandomColor() },
      { name: '토이푸들', color: getRandomColor() }
    ],
    availableDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    startTime: 9,
    endTime: 18,
    startMinute: 0,
    endMinute: 0,
    hourlyRate: 20000
  };

  // 데이터 설정
  form.value = data;
  
  // 지역 선택 설정
  const [city, district] = data.location.split(' ');
  selectedCity.value = city;
  selectedDistrict.value = district;
};


const handleSubmit = async () => {
  if (form.value.petTypes.length === 0) {
    alert('최소 한 개 이상의 반려동물 종류를 입력해주세요.');
    return;
  }

  if (form.value.availableDays.length === 0) {
    alert('최소 하나의 돌봄 가능 요일을 선택해주세요.');
    return;
  }

  const requestData = {
    city: form.value.location,
    availablePets: form.value.petTypes.map(pet => pet.name),
    startDate: form.value.startDate ? form.value.startDate.toISOString().split('T')[0] : null,
    endDate: form.value.endDate ? form.value.endDate.toISOString().split('T')[0] : null,
    availableDays: form.value.availableDays, // ['MON', 'WED', 'THU' ...]
    startTime: form.value.startTime,
    endTime: form.value.endTime,
    hourlyRate: form.value.hourlyRate
};



  const userId = computed(() => userStore.userId);

  try {
    const response = await api.post(`/users/pet-sitter/${userId.value}`, requestData);

    if (response.data) {
      console.log('등록 성공:', response.data);
      alert('펫시터 프로필이 성공적으로 등록되었습니다!');
      router.push('/home/petsitter/list'); // 등록 후 리스트 페이지로 이동
    } else {
      const error = await response.json();
      console.error('등록 실패:', error);
      alert('등록에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.log(requestData);
    console.error('서버 요청 중 오류 발생:', error);
    alert('서버 오류가 발생했습니다.');
  }
};

onMounted(() => {
  loadPetsitterProfile();
});

</script>

<style scoped>

.petsitter-register {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: var(--color-secondary);
  margin-bottom: 30px;
}

.register-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-secondary);
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--color-secondary);
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.days-group {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.day-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.day-checkbox input[type="checkbox"] {
  display: none;
}

.day-label {
  padding: 8px 15px;
  border-radius: 20px;
  background-color: #f5f5f5;
  color: var(--color-secondary);
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 40px;
  text-align: center;
  font-size: 13px;
}

.day-checkbox input[type="checkbox"]:checked + .day-label {
  background-color: var(--color-primary);
  color: white;
}

.day-checkbox:hover .day-label {
  background-color: var(--color-accent2);
}

.day-checkbox input[type="checkbox"]:checked:hover + .day-label {
  background-color: var(--color-accent1);
}

.submit-btn {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: var(--color-accent1);
}

.pet-type-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.add-btn {
  padding: 10px;
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: rotate(90deg);
  background-color: var(--color-accent1);
}

.pet-types-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.pet-type-tag {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  animation: tagAppear 0.3s ease-out;
  transform-origin: left center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@keyframes tagAppear {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.7;
  margin-left: 4px;
}

.pet-type-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.pet-type-tag:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  transform: scale(1.2);
  opacity: 1;
}

.location-select {
  display: flex;
  gap: 10px;
}

.select-box {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-secondary);
}

.select-box:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.selected-location {
  margin-top: 8px;
  color: var(--color-primary);
  font-weight: 500;
}

.pet-examples {
  margin: 10px 0;
  color: var(--color-secondary);
  font-size: 14px;
}

.example-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 2px 8px;
  margin: 0 4px;
  font-size: 14px;
}

.example-btn:hover {
  text-decoration: underline;
}

.schedule-section {
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  margin: 30px 0;
  background-color: #fafafa;
}

.schedule-section h3 {
  color: var(--color-secondary);
  margin-bottom: 20px;
  font-size: 18px;
}

.schedule-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 10px 0;
}

.date-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.date-field {
  flex: 0 1 auto;
}

.date-separator {
  display: flex;
  align-items: center;
  color: var(--color-secondary);
  font-weight: bold;
  margin: 0 10px;
}

.time-slider {
  margin: 40px 20px;
  padding: 0 10px;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  color: var(--color-secondary);
  font-size: 12px;
  margin-bottom: 20px;
}

.time-track {
  position: relative;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 15px 0;
  cursor: pointer;
}

.selected-range {
  position: absolute;
  height: 100%;
  background-color: var(--color-primary);
  top: 0;
  pointer-events: none;
  left: calc(${props => (props.startTime + props.startMinute/60) / 24 * 100}%);
  width: calc(${props => ((props.endTime + props.endMinute/60) - (props.startTime + props.startMinute/60)) / 24 * 100}%);
}

.time-handle {
  width: 16px;
  height: 16px;
  background-color: white;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.2s ease;
  z-index: 1;
}

.time-handle:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.2);
}

.time-handle:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.selected-time {
  text-align: center;
  margin-top: 20px;
  color: var(--color-secondary);
  font-weight: 500;
  font-size: 14px;
}

/* 불필요한 스타일 제거 */
.time-marks, .time-mark, .time-slot {
  display: none;
}

/* DatePicker 커스텀 스타일 수정 */
:deep(.dp__input) {
  padding: 12px 40px 12px 40px !important;  /* 오른쪽 패딩 증가 */
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-secondary);
  width: 200px;
}

:deep(.dp__input_wrap) {
  position: relative;
}

:deep(.dp__input_icon) {
  position: absolute;
  right: 15px;  /* 아이콘 위치 조정 */
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;  /* 아이콘을 텍스트 위로 */
  pointer-events: none;  /* 아이콘이 클릭을 방해하지 않도록 */
}

/* placeholder 스타일 */
:deep(.dp__input::placeholder) {
  color: var(--color-secondary);
  opacity: 0.7;
}

/* focus 스타일 */
:deep(.dp__input:focus) {
  border-color: var(--color-primary);
  outline: none;
}

/* 기존 days-group 스타일 수정 */
.days-selection {
  margin: 10px 0;
}

.days-group {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

/* 파스텔톤 색상 수정 */
:root {
  --pastel-pink: #FFE5E5;
  --pastel-blue: #E5F3FF;
  --pastel-green: #E5FFE5;
  --pastel-yellow: #FFFFE5;
  --pastel-purple: #F5E5FF;
  --pastel-orange: #FFE5D9;
}

.date-separator {
  display: flex;
  align-items: center;
  color: var(--color-secondary);
  font-weight: bold;
  margin: 0 10px;
}

.time-slider {
  margin-top: 20px;
}

.time-track {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 12px;
}

.time-slot {
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-secondary);
  transition: all 0.3s ease;
}

.time-slot:hover {
  background-color: var(--color-accent2);
}

.time-slot.selected-start {
  background-color: var(--color-primary);
  color: white;
}

.time-slot.selected-end {
  background-color: var(--color-primary);
  color: white;
}

.selected-time {
  margin-top: 10px;
  color: var(--color-secondary);
  font-weight: 500;
  text-align: center;
}

.time-labels {
  display: flex;
  justify-content: space-between;
  color: var(--color-secondary);
  font-size: 14px;
  font-weight: 500;
}
</style> 