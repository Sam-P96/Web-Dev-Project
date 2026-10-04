# AutoTori — Tổng duyệt dự án

> **Ngày duyệt:** 2026-09-23
> **Branch:** `feature/be-login-and-authentication`
> **Phạm vi:** toàn bộ repo (backend, frontend, config, git)
> **Loại tài liệu:** báo cáo rà soát — *không có thay đổi code nào được thực hiện*

---

## Mục lục

1. [Tình trạng tổng thể](#1-tình-trạng-tổng-thể)
2. [Đối chiếu Product Backlog](#2-đối-chiếu-product-backlog)
3. [Danh sách hardcode](#3-danh-sách-hardcode)
4. [Bug thật](#4-bug-thật)
5. [Vấn đề mức repo](#5-vấn-đề-mức-repo)
6. [Đề xuất thứ tự ưu tiên](#6-đề-xuất-thứ-tự-ưu-tiên)
7. [Rủi ro lớn nhất](#7-rủi-ro-lớn-nhất)

---

## 1. Tình trạng tổng thể

| Khối | Mức hoàn thiện | Ghi chú |
|---|---|---|
| Backend cấu trúc (routes → controllers → models) | ~75% | Sạch, nhất quán 4 resource, tách lớp đúng |
| Backend nghiệp vụ / bảo mật | ~15% | Không auth, không hash, không middleware lỗi |
| **Auth & login (branch hiện tại)** | **0%** | `git diff main...HEAD` **rỗng** — branch chưa có commit nào |
| Frontend UI (Tailwind) | ~80% | Đủ trang, responsive cơ bản, giao diện tốt |
| Frontend nối backend | ~35% | Chỉ Car + Appointment nối thật; User register nối 1 chiều; Login/Profile/Booking/Offer vẫn giả |
| AI valuation (lõi product vision) | **0%** | Không có dòng nào — đây là tính năng bán hàng chính |
| Test | 0% | `npm test` = `exit 1` |
| Docs | ~40% | README vẫn là Sprint 1, hướng dẫn chạy vẫn `python -m http.server` |

**MVP tổng: khoảng 40–45%.**
Phần "vỏ" gần xong, phần "ruột" (auth + định giá + ràng buộc nghiệp vụ) gần như chưa bắt đầu.

---

## 2. Đối chiếu Product Backlog

| User story | Trạng thái | Chi tiết |
|---|---|---|
| Seller tạo account | 🟡 Một phần | `POST /users` chạy, nhưng password plaintext, email không unique |
| Seller submit xe | 🟡 Một phần | Chạy được, nhưng `client` là ID hardcode |
| Seller nhận giá ước tính từ model | 🔴 Chưa có | UI có, model/API không có |
| Worker xem & xử lý offer | 🟡 Một phần | Dùng nhầm Car API thay vì Offer API |
| Seller đặt lịch hẹn | 🔴 Chưa có | Form chỉ `console.log` |
| Worker quản lý lịch hẹn | 🟢 Xong | Nối backend thật, đầy đủ nhất trong project |
| Login & quản lý profile | 🔴 Chưa có | Login chỉ `console.log`; Profile hardcode 100% |

---

## 3. Danh sách hardcode

### A. URL / cấu hình — 3 nguồn mâu thuẫn nhau

| Vị trí | Nội dung |
|---|---|
| `frontend/src/api/userApi.js:3` | `http://localhost:4000/api/users` |
| `frontend/src/apis/carApi.js:3` | `http://localhost:4000/api/cars` |
| `frontend/.env:2` | `VITE_API_URL=http://localhost:4000/api` |
| `backend/.env` | `PORT=4000`, còn `backend/app.js:34` default `3000` |

**Hệ quả:**
- `WorkerAppointments` gọi cổng **4000**, Car/User gọi cổng **3000** — một trong hai đang gọi sai server.
- `frontend/.env` bị root `.gitignore` (pattern `.env`) nuốt, và **không có `.env.example` cho frontend** → teammate clone về sẽ có `VITE_API_URL = undefined`, fetch thành `undefined/appointments`.

### B. ID giả mạo danh tính — nguy hiểm nhất về logic

| Vị trí | Nội dung |
|---|---|
| `frontend/src/components/CarForm.jsx:6, 63` | `PLACEHOLDER_CLIENT_ID = "6ab1575f4b02b92e8a25e7e3"` — mọi xe submit đều thuộc cùng 1 user |
| `frontend/src/lib/useCurrentUser.js:4` | Không có `localStorage.user` → trả `{_id: VITE_DEV_WORKER_ID, role: 'worker'}` — **mọi khách vãng lai đều là worker** |
| `frontend/.env:1` | `VITE_DEV_WORKER_ID=652f1a2b3c4d5e6f7a8b9c0f` |

### C. Dữ liệu giả thay cho DB

| Vị trí | Nội dung |
|---|---|
| `frontend/src/components/FeaturedCarsPrime.jsx:4-55` | 6 xe placeholder (3 cặp trùng nhau), `image: ""` — dùng cho cả Home lẫn `/find_cars` |
| `frontend/src/pages/UserProfile.jsx:6-12` | `'Ridhi'`, `ridhi@autotori.fi`, `+358 234 567 890`, địa chỉ Espoo, role `'Seller / Worker'` |
| `frontend/src/components/BookingAppointment.jsx:6-13` | 6 khung giờ cố định `09:00 AM … 04:00 PM` |
| `frontend/src/components/PriceEstimateDisplay.jsx:3` | Giá mặc định `23500 / 25000 / 26800` + thanh range cứng `left-[15%] right-[15%]` |
| `frontend/src/pages/WorkerOffers.jsx:55, 59` | `location: 'Unknown'`, `image: ''` |
| `frontend/src/pages/WorkerAppointments.jsx:4-35` | Mock data comment-out |
| `frontend/src/pages/WorkerOffers.jsx:4-41` | Mock data comment-out + 3 URL ảnh Unsplash |

### D. Danh sách lựa chọn cứng

| Vị trí | Nội dung |
|---|---|
| `CarForm.jsx` | Make (6 hãng), Year 2015–2026, Fuel, Transmission, Condition |
| `SearchPrime.jsx:25-66` | Make / Model / khoảng giá — **trùng lặp với CarForm nhưng lệch nội dung** |
| `Navbar.jsx:49-56, 119-126` | `EN / FI / SV` nhưng không có i18n — select chết |

### E. Handler chỉ giả vờ chạy

| Vị trí | Hành vi |
|---|---|
| `LoginForm.jsx:63` | `console.log('sending to server:', …)` — chưa gọi API |
| `BookingAppointment.jsx:25` | `console.log(values)` — không POST `/appointments` |
| `UserProfile.jsx:18-22` | `handleSave` chỉ `setIsEditing(false)` |

### F. Link chết / route sai

| Vị trí | Vấn đề |
|---|---|
| `FeaturedCarsPrime.jsx:65`, `CarCardPrime.jsx:13` | `href="listings.html"` — trỏ prototype HTML Sprint 1 |
| `Navbar.jsx:88, 94, 106, 112` | Mobile menu trỏ `/create-account`, `/booking`, `/worker/appointments`, `/worker/offers` — **không route nào tồn tại**; desktop dùng `/register`, `/employee_booking`, `/offers` |
| `Navbar.jsx:36` | `to="appointment"` thiếu `/` → relative path, vỡ khi đang ở trang con |
| `SellCtaPrime.jsx:11` | Nút "Sell Your Car" trỏ `/find_cars` thay vì `/submit_page` |
| `SearchPrime.jsx:69` | Nút Search chỉ là `<Link>`, không truyền filter nào |

### G. Màu sắc

Toàn bộ hex cứng (`#247f3d`, `#2f9449`, `#151815`, `#d8dcd8`…) lặp lại hàng trăm lần, trong khi `index.css` đã cài sẵn token shadcn (`--primary`, `--border`…).
→ Sửa 1 màu thương hiệu = sửa ~200 chỗ.

---

## 4. Bug thật

### Frontend

| # | Vị trí | Mô tả |
|---|---|---|
| 1 | `WorkerOffers.jsx:82, 85` | Dùng `updateCar.isVerified` (tham chiếu **hàm import**) thay vì `updateStatus.isVerified`. Bấm Accept/Reject → status thành `undefined`, badge trắng |
| 2 | `WorkerOffers.jsx:56` | Đọc `car.seller`, nhưng schema Car có trường `client`, và backend không `populate` → cột Seller luôn trống |
| 3 | `WorkerOffers.jsx:165, 252` | `item.price.toLocaleString()` với `estimatedPrice` default `null` → **crash trắng trang** khi có xe chưa định giá |
| 4 | `UserForm.jsx:79` | Gửi `age: values.age` nhưng form chỉ có field `dob`, không có `age` → luôn `undefined`; `dob` validate xong rồi bỏ đi |
| 5 | `UserForm.jsx:3` | `import { fi } from 'zod/v4/locales'` thừa |
| 6 | `Login.jsx`, `CreateAccount.jsx` | Import `Navbar`, `Footer` nhưng không render (Navbar đã global ở `AppPrime`) |
| 7 | `HeaderPrime.jsx:1` | `function HeaderPrime(para1, header1, para2)` — sai cách nhận props (phải destructure từ 1 object); className còn là CSS cũ → component chết |
| 8 | `PriceEstimateDisplay.jsx` | **Không được import ở bất kỳ đâu**, dù đây là tính năng lõi của product vision |
| 9 | `frontend/src/App.css` | 1366 dòng CSS cũ, **không được import ở đâu** |
| 10 | `lib/utils.js` | `export { cn } from "cn"` — dùng package `cn` lạ thay vì `clsx` + `tailwind-merge` chuẩn shadcn |

### Backend

| # | Vị trí | Mô tả |
|---|---|---|
| 11 | Toàn bộ | Không có `POST /login`, không `bcrypt`, không `jsonwebtoken`, không middleware auth. Password lưu **plaintext**, và `GET /users` + `GET /users/:id` trả nguyên cả `password` ra response |
| 12 | `userModel.js:21` | `email` **không có `unique: true`**, nhưng code bắt lỗi `11000` "already in use" → nhánh đó không bao giờ chạy, email trùng vẫn đăng ký được |
| 13 | `carControllers.js`, `userControllers.js`, `offerControllers.js` | Không có `try/catch` (chỉ `appointment` có) → lỗi DB thành unhandled rejection, request treo |
| 14 | `app.js:29-32` | 4 router đều mount ở `"/"`, không prefix `/api`; không 404 handler; không error-handling middleware; `cors()` mở toàn bộ |
| 15 | `appointmentModel.js` | Không check trùng lịch, dù user story ghi rõ *"without double-booking"* |
| 16 | `offerModel.js` + `/offers` | API đầy đủ nhưng **frontend không dùng** — trang Offers chạy trên Car API. Luồng offer/counter-offer chưa nối |
| 17 | `carModel.js:31` | Field `images` vẫn là comment `HELP???`. `isVerified` đặt tên như boolean nhưng là enum `Pending/Accepted/Rejected` |
| 18 | `appointmentModel.js:41` | `SIGNUP_ROLES` thừa (copy-paste từ userModel) |
| 19 | `backend/test-db.js` | Import `./src/config/db.js`, `./src/models/User.js` theo cấu trúc thư mục **không còn tồn tại** → chạy là crash |
| 20 | `PUT /appointments/:id` | Trả document chưa populate, nên frontend phải tự merge (`mergeRow`) — workaround đúng nhưng mong manh |

---

## 5. Vấn đề mức repo

| # | Mô tả |
|---|---|
| 21 | Root còn `css/`, `js/`, `image/` của prototype Sprint 1; `js/script.js` **bị cắt cụt giữa chừng** (thiếu dấu đóng ngoặc) |
| 22 | Root `package.json` chỉ có `react-router-dom` — không dùng, nên xóa |
| 23 | `frontend/package.json` có `dotenv` — vô nghĩa ở client (Vite đã lo) |
| 24 | README mô tả Sprint 1, hướng dẫn chạy sai hoàn toàn so với hiện tại |
| 25 | 20+ branch trên remote chưa dọn |

---

## 6. Đề xuất thứ tự ưu tiên

### 🔴 Chặn demo — làm trước

1. Thống nhất **1 nguồn base URL duy nhất** + commit `frontend/.env.example`.
2. Backend: `POST /login` + bcrypt + JWT (đúng scope branch hiện tại), và loại `password` khỏi mọi response.
3. `email: { unique: true }` + đồng bộ index.
4. Sửa 3 bug crash của `WorkerOffers` (`updateCar.isVerified`, `car.seller`, `price` null).

### 🟠 Bỏ hardcode danh tính

5. Login lưu user → `useCurrentUser` bỏ fallback worker → `CarForm` lấy `client` từ user thật.
6. `UserProfile` gọi `GET /users/:id` và `PUT /users/:id`.
7. `BookingAppointment` POST thật lên `/appointments`.

### 🟡 Nối nốt dữ liệu

8. `FeaturedCarsPrime` đọc `GET /cars`, bỏ `placeholderCars` + sửa link `listings.html`.
9. Thống nhất mobile/desktop nav về đúng route.
10. Quyết định dứt điểm: dùng Offer API hay bỏ — hiện đang có 2 khái niệm chồng nhau.

### 🟢 Sau cùng

11. API định giá (lõi sản phẩm nhưng chưa ai đụng).
12. Upload ảnh (multer).
13. Dọn `App.css`, `css/`, `js/`, `test-db.js`.
14. Viết lại README.

---

## 7. Rủi ro lớn nhất

> **Product vision xoay quanh regression model định giá, nhưng đến giờ chưa có gì.**

Đây là điểm bán hàng chính của sản phẩm và là thứ giám khảo sẽ hỏi đầu tiên.
Nên đưa vào sprint tới **sớm**, đừng để cuối.

Rủi ro thứ hai: branch `feature/be-login-and-authentication` **chưa có commit nào** — auth là story ưu tiên cao trong backlog và là điều kiện tiên quyết để bỏ hết hardcode nhóm B.
