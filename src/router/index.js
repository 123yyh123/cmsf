import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/LayoutIndex.vue'
import {getUserRole} from "@/util/jwt";

Vue.use(VueRouter)

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/403',
        component: () => import('@/views/403'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/redirectByRole', // 永远跳转到中间跳转页
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {title: '首页', icon: 'dashboard', role: 'admin'}
            },
            {
                path: 'index',
                name: 'Index',
                component: () => import('@/views/dashboard/notice.vue'),
                meta: {title: '首页', icon: 'dashboard', role: 'teacher'}
            },
            {
                path: 'redirectByRole',
                name: 'RedirectByRole',
                component: {
                    // 临时中间页，执行跳转
                    render: h => h('div')
                },
            }
        ]
    }
]

export const asyncRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
            title: '首页',
            icon: 'el-icon-s-home',
            roles: ['admin']
        }
    },
    // 公告展示
    {
        path: '/index',
        name: 'Index',
        meta: {
            title: '首页',
            icon: 'el-icon-s-home',
            roles: ['teacher']
        },
    },
    // 教室管理
    {
        path: '/classroom',
        component: Layout,
        meta: {title: '教室管理', icon: 'el-icon-set-up', roles: ['admin']},
        children: [
            {
                path: 'list',
                name: 'ClassroomList',
                component: () => import('@/views/classroom/list'),
                meta: {title: '教室列表', roles: ['admin']}
            },
            {
                path: 'status',
                name: 'ClassroomStatus',
                component: () => import('@/views/classroom/status'),
                meta: {title: '教室使用管理', roles: ['admin']}
            }
        ]
    },

    // 楼栋管理
    {
        path: '/building',
        component: Layout,
        meta: {title: '楼栋管理', icon: 'el-icon-office-building', roles: ['admin']},
        children: [
            {
                path: 'list',
                name: 'BuildingList',
                component: () => import('@/views/building/list'),
                meta: {title: '楼栋列表', roles: ['admin']}
            }
        ]
    },

    // 用户管理
    {
        path: '/user',
        component: Layout,
        meta: {title: '用户管理', icon: 'el-icon-user-solid', roles: ['admin']},
        children: [
            {
                path: 'teacher',
                name: 'TeacherManage',
                component: () => import('@/views/user/teacher'),
                meta: {title: '教师管理', roles: ['admin']}
            },
            {
                path: 'student',
                name: 'StudentManage',
                component: () => import('@/views/user/student'),
                meta: {title: '学生管理', roles: ['admin']}
            }
        ]
    },

    // 预约管理
    {
        path: '/reservation',
        component: Layout,
        meta: {title: '预约管理', icon: 'el-icon-date', roles: ['admin', 'teacher', 'student']},
        children: [
            {
                path: 'all',
                name: 'AllReservations',
                component: () => import('@/views/reservation/all'),
                meta: {title: '预约记录', roles: ['admin']}
            },
            {
                path: 'audit',
                name: 'ReservationAudit',
                component: () => import('@/views/reservation/audit'),
                meta: {title: '预约审核', roles: ['admin']}
            },
            {
                path: 'my',
                name: 'MyReservation',
                component: () => import('@/views/reservation/my'),
                meta: {title: '我的预约', roles: ['teacher', 'student']}
            },
            {
                path: 'add',
                name: 'AddReservation',
                component: () => import('@/views/reservation/add'),
                meta: {title: '我要预约', roles: ['teacher']}
            }
        ]
    },

    // 设备管理
    {
        path: '/device',
        component: Layout,
        meta: {title: '设备管理', icon: 'el-icon-connection', roles: ['admin']},
        children: [
            {
                path: 'list',
                name: 'DeviceList',
                component: () => import('@/views/device/list'),
                meta: {title: '设备列表', roles: ['admin']}
            },
            {
                path: 'repair',
                name: 'DeviceRepair',
                component: () => import('@/views/device/repair'),
                meta: {title: '设备故障处理', roles: ['admin']}
            }
        ]
    },

    // 通知公告
    {
        path: '/notice',
        component: Layout,
        meta: {title: '通知公告', icon: 'el-icon-bell', roles: ['admin']},
        children: [
            {
                path: 'list',
                name: 'NoticeList',
                component: () => import('@/views/notice/list'),
                meta: {title: '公告列表', roles: ['admin']}
            },
            {
                path: 'create',
                name: 'CreateNotice',
                component: () => import('@/views/notice/create'),
                meta: {title: '发布公告', roles: ['admin']}
            }
        ]
    },

    // 反馈与报修
    {
        path: '/feedback',
        component: Layout,
        meta: {title: '问题反馈', icon: 'el-icon-chat-dot-square', roles: ['teacher', 'student']},
        children: [
            {
                path: 'submit',
                name: 'SubmitFeedback',
                component: () => import('@/views/feedback/submit'),
                meta: {title: '提交反馈', roles: ['teacher', 'student']}
            },
            {
                path: 'list',
                name: 'FeedbackList',
                component: () => import('@/views/feedback/list'),
                meta: {title: '我的反馈', roles: ['teacher', 'student']}
            }
        ]
    },
    {
        path: '/system',
        component: Layout,
        meta: {title: '系统管理', icon: 'el-icon-setting', roles: ['admin']},
        children: [
            {
                path: 'log',
                name: 'SystemLog',
                component: () => import('@/views/system/log'),
                meta: {title: '系统日志', roles: ['admin']}
            },
        ]
    },

    // 个人中心
    {
        path: '/profile',
        component: Layout,
        meta: {title: '个人中心', icon: 'el-icon-user', roles: ['admin', 'teacher', 'student']},
        children: [
            {
                path: 'edit',
                name: 'EditProfile',
                component: () => import('@/views/profile/edit'),
                meta: {title: '编辑信息', roles: ['admin', 'teacher', 'student']}
            }
        ]
    },

    // 404 页面
    {path: '*', redirect: '/404', hidden: true},
]

const router = new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes.concat(asyncRoutes)
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const role = getUserRole()
    if (!token) {
        // 无 token，强制登录
        return to.path === '/login' ? next() : next('/login')
    }
    if (to.path === '/login') {
        next("/")
    }
    if (to.path === '/redirectByRole') {
        next(role === 'admin' ? '/dashboard' : '/index')
    }
    if (to.meta && to.meta.roles) {
        console.log(to.meta.roles)
        // 目标路由有限制角色,审核预约特殊处理，允许辅导员访问
        if (to.meta.roles.includes(role) || (to.path === '/reservation/audit' && role === 'teacher' && localStorage.getItem('counselor'))) {
            // 当前角色在允许访问的角色列表中
            next()
        } else {
            // 当前角色不在允许访问的角色列表中
            next('/403') // 或自定义提示页
        }
    } else {
        // 不限制角色的页面
        next()
    }
})

export default router
