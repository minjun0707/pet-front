import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/layout/mainLayout.vue';
import WelcomeScreen from '@/components/welcomeScreen.vue';
import SignUpScreen from '@/components/user/signUpScreen.vue';
import PetProfile from '@/components/pet/petProfile.vue';
import PetProfileRegister from '@/components/pet/petProfileRegisterScreen.vue';
import LoginScreen from '@/components/user/loginScreen.vue';
import EditProfileScreen from '@/components/user/editProfileScreen.vue';
import PasswordChangeScreen from '@/components/user/passwordChangeScreen.vue';
import PetsitterRegister from '@/components/petsitter/petsitterRegister.vue';
import PetsitterList from '@/components/petsitter/petsitterList.vue';
import PetsitterEdit from '@/components/petsitter/petsitterEdit.vue';
import BannerProducts from '@/components/bannerProductsScreen.vue';
import ProductsScreen from '@/components/productsScreen.vue';
import ViewPetProfile from '@/components/pet/viewPetProfile.vue';
import EditPetProfile from '@/components/pet/editPetProfile.vue'; 
import CodeManagemnet from '@/components/codeMangement.vue'
import PaymentScreen from '@/components/petsitter/paymentScreen.vue';
const routes = [
  {
    path: '/',
    name: 'welcome',
    component: WelcomeScreen
  },
  { path: '/editPetProfile/:id', 
    name: 'editPetProfile', 
    component: EditPetProfile 
  },
  { path: '/editProfileScreen',
    name: 'editProfileScreen',
    component: EditProfileScreen
  },  
  {
    path: '/signup',
    name: 'signUp',
    component: SignUpScreen
  },
  {
    path: '/myPetProFile',
    name: 'myPetProFile',
    component: ViewPetProfile
  },
  {
    path: '/login',
    name: 'login',
    component: LoginScreen
  },
  {
    path: '/password-change',
    name: 'passwordChange',
    component: PasswordChangeScreen
  },
  {
    path: '/petProfileRegister',
    name: 'petProfileRegister',
    component: PetProfileRegister
  },

  {
    path: '/petProfile',
    name: 'petProfile',
    component: PetProfile
  },

  // 🔹 MainLayout을 부모 컴포넌트로 설정
  {
    path: '/home',
    component: MainLayout,
    children: [
      {
        path: '', // 기본 메인 화면
        name: 'home',
        component: BannerProducts
      },

      {
        path: 'payment', // 기본 메인 화면
        name: 'payment',
        component: PaymentScreen
      },

      {
        path: 'edit-profile',
        name: 'editProfile',
        component: EditProfileScreen
      },
      {
        path: 'petsitter/register',
        name: 'petsitterRegister',
        component: PetsitterRegister
      },
      {
        path: 'petsitter/list',
        name: 'petsitterList',
        component: PetsitterList
      },
      {
        path: 'petsitter/edit',
        name: 'petsitterEdit',
        component: PetsitterEdit
      },
      {
        path: 'products',
        name: 'Products',
        component: ProductsScreen
      },
      {
        path: 'codeManagement',
        name: 'codeManagement',
        component: CodeManagemnet
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
